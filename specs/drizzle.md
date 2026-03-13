# Drizzle ORM — DevRoast Database Spec

## Visão Geral

Migrar dados mock (leaderboard, stats, issues) para PostgreSQL usando Drizzle ORM.
Stack: **Drizzle ORM + PostgreSQL 16 (Docker Compose) + drizzle-kit**.

---

## 1. Enums PostgreSQL

```ts
// src/db/schema.ts
import { pgEnum } from "drizzle-orm/pg-core";

export const languageEnum = pgEnum("language", [
	"javascript",
	"typescript",
	"python",
	"go",
	"rust",
	"sql",
	"java",
	"csharp",
	"php",
	"ruby",
	"swift",
	"kotlin",
	"other",
]);

export const severityEnum = pgEnum("severity", [
	"critical",
	"warning",
	"good",
]);
```

> `severity` alinha com `type Severity = "critical" | "warning" | "good"` de `issue-card.tsx`.
> `language` cobre os idiomas do leaderboard mock (`javascript`, `typescript`, `sql`) e mais comuns.

---

## 2. Tabelas

### 2.1 `roasts`

Armazena cada análise de código submetida.

```ts
import { pgTable, uuid, text, real, timestamp, integer } from "drizzle-orm/pg-core";

export const roasts = pgTable("roasts", {
	id: uuid().defaultRandom().primaryKey(),
	code: text().notNull(),
	language: languageEnum().notNull(),
	score: real().notNull(),           // 0.0–10.0 (leaderboard usa esse valor)
	roastText: text().notNull(),       // texto do roast gerado pela IA
	codeLines: integer().notNull(),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
}, (table) => [
	index("idx_roasts_score").on(table.score),
]);
```

**Campos derivados do mock:**
| Mock field         | Coluna DB     | Origem                                          |
| ------------------ | ------------- | ----------------------------------------------- |
| `row.score`        | `score`       | Nota numérica (leaderboard: "1.2", "1.8", etc.) |
| `row.code[]`       | `code`        | Código original submetido                        |
| `row.lang`         | `language`    | Enum da linguagem                                |
| `2,847 roasted`    | `count(*)`    | Query agregada                                   |
| `avg score: 4.2`   | `avg(score)`  | Query agregada                                   |

### 2.2 `issues`

Issues detectadas em cada roast (exibidas via `IssueCard`).

```ts
export const issues = pgTable("issues", {
	id: uuid().defaultRandom().primaryKey(),
	roastId: uuid().notNull().references(() => roasts.id, { onDelete: "cascade" }),
	severity: severityEnum().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
```

**Alinhamento com `IssueCardProps`:**
- `severity` → enum `"critical" | "warning" | "good"`
- `title` → `string`
- `description` → `string`

### 2.3 `suggestions`

Sugestões de diff para cada issue (exibidas via `DiffBlock`).

```ts
import { jsonb } from "drizzle-orm/pg-core";

// Tipo DiffLine alinhado com diff-block.tsx
// { type: "context" | "added" | "removed", content: string }

export const suggestions = pgTable("suggestions", {
	id: uuid().defaultRandom().primaryKey(),
	issueId: uuid().notNull().references(() => issues.id, { onDelete: "cascade" }),
	fileName: text().notNull(),
	diffLines: jsonb().$type<Array<{ type: "context" | "added" | "removed"; content: string }>>().notNull(),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
```

**Alinhamento com `DiffBlockProps`:**
- `fileName` → `string`
- `diffLines` → `DiffLine[]` (armazenado como JSONB)

---

## 3. Queries de Leaderboard

```ts
// Top N piores scores (shame leaderboard)
const leaderboard = await db
	.select({
		id: roasts.id,
		score: roasts.score,
		code: roasts.code,
		language: roasts.language,
		createdAt: roasts.createdAt,
	})
	.from(roasts)
	.orderBy(asc(roasts.score))
	.limit(10);

// Stats agregados (hero section)
const stats = await db
	.select({
		totalRoasts: count(),
		avgScore: avg(roasts.score),
	})
	.from(roasts);

// Roast completo com issues e suggestions (página de resultado)
const roastWithIssues = await db
	.select()
	.from(roasts)
	.innerJoin(issues, eq(issues.roastId, roasts.id))
	.leftJoin(suggestions, eq(suggestions.issueId, issues.id))
	.where(eq(roasts.id, roastId));
```

---

## 4. Docker Compose — PostgreSQL

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## 5. Configuração Drizzle

### 5.1 Variáveis de ambiente

```env
# .env.local
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

### 5.2 Conexão

```ts
// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!, { casing: "snake_case" });
```

### 5.3 drizzle.config.ts

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	casing: "snake_case",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
```

---

## 6. Dependências

```bash
pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg
```

---

## 7. Checklist de Implementação

- [ ] Criar `docker-compose.yml` com PostgreSQL 16
- [ ] Adicionar `DATABASE_URL` ao `.env.local`
- [ ] Instalar dependências (`drizzle-orm`, `pg`, `drizzle-kit`)
- [ ] Criar `src/db/schema.ts` com enums e tabelas
- [ ] Criar `src/db/index.ts` com conexão
- [ ] Criar `drizzle.config.ts`
- [ ] Rodar `pnpm drizzle-kit generate` para gerar migração inicial
- [ ] Rodar `pnpm drizzle-kit migrate` para aplicar migração
- [ ] Substituir mock do leaderboard em `src/app/page.tsx` por query real
- [ ] Substituir stats hardcoded (2,847 / avg 4.2) por query agregada
- [ ] Criar Server Action ou API route para submeter roasts e persistir resultado
- [ ] Adicionar `docker-compose.yml` e `drizzle/` ao `.gitignore` se necessário
- [ ] Adicionar script `"db:generate"` e `"db:migrate"` ao `package.json`
