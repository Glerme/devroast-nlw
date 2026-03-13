# Specs

Antes de implementar uma nova feature, crie um arquivo `specs/<feature-name>.md` com a especificação.

## Estrutura

```
# <Feature Name>

## Problema
O que está faltando ou quebrado. Por quê vale implementar.

## Objetivo
O que a implementação deve entregar (1–3 frases).

---

## Pesquisa / Alternativas  ← omitir se óbvio
Tabela comparando opções e justificativa da escolha.

---

## Especificação Técnica
Pacotes, estrutura de arquivos, interfaces, snippets de código relevantes.
Foco no "como" — o suficiente para implementar sem ambiguidade.

---

## Checklist de Implementação
- [ ] Passo atômico 1
- [ ] Passo atômico 2
```

## Regras

- Arquivo em `specs/<kebab-case>.md`
- Inclua código apenas onde ele reduz ambiguidade
- Checklist com passos atômicos e ordenados
- Omita seções que não agregam (ex: sem alternativas se a escolha é óbvia)
