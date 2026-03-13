# UI Components — Padrões de Criação

## Design System

- **Tema escuro** — fundo `bg-page: #0A0A0A`, superfícies progressivamente mais claras (`bg-surface`, `bg-input`, `bg-elevated`)
- **Bordas** — `border-primary: #2A2A2A`, 1px solid, sem border-radius (estética terminal)
- **Cores de destaque** — `accent-green` (ações primárias, sucesso), `accent-red` (erro, crítico), `accent-amber` (warning), `accent-cyan` (info)
- **Tokens definidos em** `src/app/globals.css` via `@theme inline` do Tailwind v4. Sempre usar as classes de cor do tema (`text-text-primary`, `bg-accent-green`) em vez de cores hardcoded

## Tipografia

- **font-mono** (`JetBrains Mono`) — fonte principal: títulos, labels, código, botões
- **font-body** (`IBM Plex Mono`) — fonte de corpo: descrições, subtítulos, hints
- Tamanhos mais usados: `text-xs` (12px), `text-[13px]`, `text-sm` (14px), `text-lg` (18px)
- Peso: `font-normal` para texto corrido, `font-medium` (500) para labels/botões, `font-bold` (700) para títulos e destaques

## Convenções de Código

### Estrutura de arquivo
```tsx
// 1. "use client" apenas se o componente usa hooks ou event handlers
"use client";

// 2. Imports (organizados pelo Biome)
import { useState } from "react";

// 3. Tipos locais (type/interface para props e variantes)
type Variant = "primary" | "outline";

interface ComponentProps {
  variant?: Variant;
}

// 4. Constantes de estilo com Record<Variant, string> para variantes
const variantStyles: Record<Variant, string> = {
  primary: "bg-accent-green text-bg-page",
  outline: "border border-border-primary text-text-primary",
};

// 5. Named export (não default)
export function Component({ variant = "primary" }: ComponentProps) {
  return <div className={variantStyles[variant]} />;
}
```

### Regras
- **Named exports** — nunca `export default`, sempre `export function NomeDoComponente`
- **Props via interface** — nome: `{NomeComponente}Props`
- **Variantes via Record** — mapear estilos em um `Record<Variant, string>` ou `Record<Variant, {...}>` fora do componente
- **className como prop** — componentes reutilizáveis aceitam `className` para extensão, concatenado ao final
- **Tailwind puro** — toda estilização via classes Tailwind, sem CSS modules, sem styled-components
- **Sem border-radius** — a estética é terminal/hacker, bordas retas (exceção: toggle knob e dots que são `rounded-full`)
- **Formatação** — tabs para indentação, aspas duplas, gerenciado pelo Biome
- **Acessibilidade** — SVGs com `role="img"` e `aria-label`, toggles com `role="switch"` e `aria-checked`

### Fontes nas classes
- `font-mono` → JetBrains Mono (títulos, labels, código, botões)
- `font-body` → IBM Plex Mono (descrições, subtítulos, textos longos)

### Server vs Client components
- **Server components** (padrão) — sem `"use client"`, podem ser `async`, sem hooks/event handlers
- **Client components** — com `"use client"`, usam hooks (`useState`, `useEffect`) ou event handlers (`onClick`, `onChange`)
- **CodeBlock** é um server component async que usa Shiki para syntax highlighting (tema: vesper)
- **CodeEditor** é um client component com textarea interativo
- Se uma página precisa de ambos, extrair a parte client em um componente separado e importar na page (server)

### Barrel export
Sempre adicionar o componente em `src/components/ui/index.ts`:
```ts
export { NovoComponente } from "./novo-componente";
```
