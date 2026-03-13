# Spec: Editor com Syntax Highlighting

## Problema

O `CodeEditor` atual (`src/components/ui/code-editor.tsx`) é um `<textarea>` sem syntax highlighting. O usuário cola código e vê texto monocromático — experiência inferior para um produto que analisa código.

## Objetivo

Substituir o editor por um componente com **syntax highlighting em tempo real**, **editável**, com **auto-detecção de linguagem** e **seletor manual** na title bar.

---

## Pesquisa de Alternativas

| Solução | Tipo | Bundle | Highlight Quality | Editável | React Support |
|---------|------|--------|-------------------|----------|---------------|
| **CodeMirror 6** | Editor completo | ~50-80 KB (core + 1 lang) | Nativo, excelente | Sim | `@uiw/react-codemirror` |
| Monaco | Editor completo | ~2-5 MB | Excelente (VS Code) | Sim | `@monaco-editor/react` |
| Shiki + textarea overlay | Highlighter + hack | ~30 KB + gramáticas | Excelente (TextMate) | Gambiarra | Manual |
| Prism + `react-simple-code-editor` | Highlighter + editor leve | ~15-30 KB | Boa | Sim, mas limitado | `react-simple-code-editor` |

### Recomendação: **CodeMirror 6**

**Por quê:**
- Editor de verdade com cursor, seleção, undo/redo, indentação, bracket matching
- Highlight nativo de alta qualidade via Lezer (parser incremental)
- Bundle modular — carrega apenas as linguagens necessárias (~50-80 KB para core + 1 linguagem)
- 2-5x menor que Monaco
- Wrapper React maduro: `@uiw/react-codemirror`
- Suporte a 140+ linguagens via `@codemirror/lang-*`
- Temas customizáveis — pode replicar a paleta vesper/terminal do projeto
- Excelente performance com parsing incremental

**Por que não Monaco:**
- Bundle de 2-5 MB é desproporcional para um editor de input (não IDE)
- Requer web workers, configuração complexa com Next.js
- Overkill para o caso de uso

**Por que não Shiki + textarea overlay:**
- Hack frágil: manter textarea invisível sincronizado com um `<pre>` destacado
- Problemas conhecidos de scroll sync, line height mismatch, IME
- Não escala com funcionalidades de editor

---

## Especificação Técnica

### Pacotes

```bash
npm install @uiw/react-codemirror @codemirror/lang-javascript @codemirror/lang-python @codemirror/lang-java @codemirror/lang-cpp @codemirror/lang-html @codemirror/lang-css @codemirror/lang-json @codemirror/lang-markdown @codemirror/lang-rust @codemirror/lang-go @codemirror/lang-php @codemirror/lang-sql @codemirror/lang-xml
```

Para auto-detecção:
```bash
npm install @vscode/vscode-languagedetection
```

### Componente: `CodeEditor` (rewrite)

**Arquivo:** `src/components/ui/code-editor.tsx`

**Props (interface mantida retrocompatível):**

```tsx
interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;        // novo: forçar linguagem (override auto-detect)
  className?: string;
}
```

**Estrutura visual:**

```
┌──────────────────────────────────────────────┐
│ 🔴 🟡 🟢    [language selector ▾]           │  ← title bar
├──────────────────────────────────────────────┤
│ 1 │ function calculateTotal(items) {         │
│ 2 │   var total = 0;                         │  ← CodeMirror editor
│ 3 │   for (var i = 0; i < items.length; ... │
│ ...                                          │
└──────────────────────────────────────────────┘
```

### Title Bar

- Dots (close/minimize/maximize) — à esquerda, como já existe
- Seletor de linguagem — à direita dos dots, estilizado como inline dropdown
  - Mostra linguagem detectada/selecionada (ex: `javascript ▾`)
  - Ao clicar, abre lista de linguagens disponíveis
  - Seleção manual faz override da auto-detecção
  - Estilo: `text-text-secondary font-mono text-xs`, sem borda, hover `text-text-primary`

### Auto-detecção de Linguagem

- Usar `@vscode/vscode-languagedetection` (modelo ML leve, ~93.3% accuracy)
- Detecção disparada com **debounce de 500ms** após mudança no conteúdo
- Se o usuário selecionou manualmente uma linguagem, **não** auto-detectar (flag `isManualSelection`)
- Detecção inicial no mount se `value` não for vazio
- Mapeamento `detectedLanguageId → @codemirror/lang-*` extension

### Tema Custom (Vesper/Terminal)

Criar tema CodeMirror alinhado com o design system:

```tsx
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

const devRoastTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#111111",        // bg-input
    foreground: "#fafafa",        // text-primary
    caret: "#10b981",             // accent-green
    selection: "#2a2a2a",         // border-primary (sutil)
    selectionMatch: "#2a2a2a",
    lineHighlight: "#1a1a1a",     // bg-elevated
    gutterBackground: "#0f0f0f",  // bg-surface
    gutterForeground: "#4b5563",  // text-tertiary
    gutterBorder: "#2a2a2a",      // border-primary
  },
  styles: [
    { tag: t.comment, color: "#4b5563" },         // text-tertiary
    { tag: t.string, color: "#10b981" },           // accent-green
    { tag: t.number, color: "#f59e0b" },           // accent-amber
    { tag: t.keyword, color: "#ef4444" },          // accent-red
    { tag: t.function(t.variableName), color: "#06b6d4" }, // accent-cyan
    { tag: t.typeName, color: "#f59e0b" },         // accent-amber
    { tag: t.operator, color: "#6b7280" },         // text-secondary
    { tag: t.bool, color: "#f59e0b" },             // accent-amber
    { tag: t.propertyName, color: "#fafafa" },     // text-primary
  ],
});
```

### Mapeamento de Linguagens

```tsx
const LANGUAGES = {
  javascript: { label: "JavaScript", ext: () => import("@codemirror/lang-javascript").then(m => m.javascript({ jsx: true })) },
  typescript: { label: "TypeScript", ext: () => import("@codemirror/lang-javascript").then(m => m.javascript({ jsx: true, typescript: true })) },
  python:     { label: "Python",     ext: () => import("@codemirror/lang-python").then(m => m.python()) },
  java:       { label: "Java",       ext: () => import("@codemirror/lang-java").then(m => m.java()) },
  cpp:        { label: "C/C++",      ext: () => import("@codemirror/lang-cpp").then(m => m.cpp()) },
  html:       { label: "HTML",       ext: () => import("@codemirror/lang-html").then(m => m.html()) },
  css:        { label: "CSS",        ext: () => import("@codemirror/lang-css").then(m => m.css()) },
  json:       { label: "JSON",       ext: () => import("@codemirror/lang-json").then(m => m.json()) },
  markdown:   { label: "Markdown",   ext: () => import("@codemirror/lang-markdown").then(m => m.markdown()) },
  rust:       { label: "Rust",       ext: () => import("@codemirror/lang-rust").then(m => m.rust()) },
  go:         { label: "Go",         ext: () => import("@codemirror/lang-go").then(m => m.go()) },
  php:        { label: "PHP",        ext: () => import("@codemirror/lang-php").then(m => m.php()) },
  sql:        { label: "SQL",        ext: () => import("@codemirror/lang-sql").then(m => m.sql()) },
  xml:        { label: "XML",        ext: () => import("@codemirror/lang-xml").then(m => m.xml()) },
  plaintext:  { label: "Plain Text", ext: () => Promise.resolve([]) },
} as const;
```

**Lazy loading**: cada linguagem é importada dinamicamente somente quando necessária. O bundle inicial carrega apenas o core do CodeMirror.

### Integração com `CodeInputSection`

O componente pai (`src/app/code-input-section.tsx`) **não precisa mudar** — a interface `value`/`onChange` é mantida. A prop `language` é opcional e pode ser adicionada depois se necessário.

### Estilização / CSS

- **Sem border-radius** em nenhum elemento (estética terminal)
- Font: `JetBrains Mono` via CSS override no tema CodeMirror (`& .cm-editor { font-family: var(--font-mono) }`)
- Tamanho: `text-xs` (12px), `line-height: 20px` (1.25rem) — consistente com o editor atual
- Gutter: mesma largura e estilo do componente atual (`w-12`, `border-r border-border-primary`)
- Scrollbar: estilizar com cores do tema (`::-webkit-scrollbar`)
- O wrapper externo mantém `border border-border-primary bg-bg-input`
- CodeMirror editor deve ter `min-height` equivalente a 16 linhas (como o `rows={count}` atual)

### Acessibilidade

- CodeMirror 6 tem suporte built-in a screen readers e navegação por teclado
- O seletor de linguagem deve ter `aria-label="Select language"` e role adequado
- Focus visível com `border-focus` (`#10b981`)

---

## TO-DOs de Implementação

### Fase 1 — Setup e tema
- [ ] Instalar pacotes: `@uiw/react-codemirror`, lang packages, `@vscode/vscode-languagedetection`
- [ ] Criar tema `devRoastTheme` em `src/components/ui/code-editor-theme.ts`
- [ ] Criar mapa de linguagens com lazy imports em `src/components/ui/code-editor-languages.ts`

### Fase 2 — Componente editor
- [ ] Reescrever `CodeEditor` em `src/components/ui/code-editor.tsx` usando `@uiw/react-codemirror`
- [ ] Implementar title bar com dots + seletor de linguagem
- [ ] Aplicar tema custom, font override, dimensões
- [ ] Garantir retrocompatibilidade: props `value`, `onChange`, `className`

### Fase 3 — Auto-detecção
- [ ] Implementar hook `useLanguageDetection(code)` com debounce 500ms
- [ ] Integrar com seletor: auto-detect popula o seletor, seleção manual faz override
- [ ] Detecção no mount para código inicial (placeholder)

### Fase 4 — Polish
- [ ] Estilizar scrollbar
- [ ] Testar com 10+ linguagens (JS, TS, Python, Java, C++, Rust, Go, HTML, CSS, SQL)
- [ ] Verificar bundle size com `next build` — meta: < 100 KB gzipped para core + 1 linguagem
- [ ] Testar acessibilidade (keyboard nav, screen reader)
- [ ] Remover prop `lineCount` (CodeMirror gerencia linhas nativamente)

---

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| `@vscode/vscode-languagedetection` usa ONNX Runtime (~1.5 MB WASM) | Bundle size | Lazy load o módulo de detecção; carregar somente após primeiro input |
| CodeMirror SSR hydration mismatch | Erro no Next.js | Renderizar com `dynamic(() => import(...), { ssr: false })` ou guard com `useEffect` |
| Font override não aplicar | Visual inconsistente | Usar `EditorView.theme` com `& .cm-editor, & .cm-content { fontFamily }` |
| Seletor de linguagem dropdown complexo | Scope creep | Começar com `<select>` nativo estilizado, iterar depois |
