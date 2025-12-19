---
agent: speckit.implement
description: "Execute implementation for a single SPEC following spec-driven development workflow"
---

# speckit.implement — Guia de Implementação por SPEC

## Objetivo

Este prompt guia a implementação de uma SPEC individual, garantindo conformidade com:
- speckit.constitution (clean code, separação de camadas, testabilidade, offline-first)
- Convenções TypeScript + React Native + Expo
- Ciclo TDD (testes primeiro, depois implementação)

## Modo de Operação

### 1. Entrada (do usuário)

```
Implement SPEC-XXX (exemplo: "Implement SPEC-001 HeaderProgress")
```

### 2. Contexto Obrigatório

Ler/validar:
- `speckit.specify`: localize a SPEC solicitada (id, title, description, files_to_change, tests_to_create, acceptance_criteria)
- `speckit.plan`: verifique qual epic contém as tasks associadas
- `speckit.tasks.md`: busque tasks bloqueantes (dependências em Phase 2)
- `speckit.constitution`: aplique princípios arquiteturais

### 3. Execução (passos do agent)

#### Passo 1: Validar bloqueadores

```
IF Phase 2 (Foundational) não está completo:
  - Verificar: sqliteRepository.ts, migrations, notifications.ts, featureFlags.ts, Storybook setup
  - Listar bloqueadores (arquivos essenciais faltando)
  - Solicitar desbloqueio ou implementar bloqueadores primeiro
ELSE
  - Prosseguir para Passo 2
```

#### Passo 2: Gerar estrutura de testes (RED fase do TDD)

```
Para cada teste em tests_to_create:
  1. Criar arquivo de teste com describe + test cases para acceptance_criteria
  2. Arquivo deve ser VAZIO de implementação (apenas expect statements)
  3. Rodar npm test → validar que todos falham (RED)
  4. Imprimir lista de testes que falharam (para referência)
```

#### Passo 3: Implementar (GREEN fase do TDD)

```
Para cada arquivo em files_to_change:
  1. Criar ou atualizar arquivo seguindo estrutura de camadas:
     - src/domain/ → regras de negócio, modelos, use-cases
     - src/data/ → DAOs, repositórios, persistência
     - src/screens/ → componentes UI (apresentação)
     - src/services/ → serviços injetáveis (notifications, backup, etc.)
     - src/components/ → componentes reutilizáveis
  2. Implementar conforme descrito na SPEC (description + steps)
  3. Respeitar design tokens em src/styles/design-tokens.json
  4. Extrair strings para src/i18n/pt-BR.json (toda UI string)
  5. Incluir accessibility labels (accessibilityLabel, role, etc.)
  6. Rodar npm test → validar que todos passam (GREEN)
```

#### Passo 4: Refatorar (REFACTOR fase do TDD)

```
1. Revisar código para lint/typecheck
2. Rodar: npm run lint --fix && npm run typecheck
3. Aplicar princípios da constitution: clean code, SRP, abstrações simples
4. Remover duplicação
```

#### Passo 5: Criar artefatos

```
1. Storybook story (se UI):
   - Arquivo: stories/[ComponentName].stories.tsx
   - Imports: componente + design tokens
   - Exemplo de uso com mock props
2. Documentação:
   - README breve em src/[feature]/README.md
   - Explicar o que foi implementado e como testar localmente
```

#### Passo 6: Validar contra acceptance_criteria

```
Para cada critério em acceptance_criteria:
  1. Confirmar que há teste cobrindo o critério
  2. Rodar teste manualmente (npm test -- --watch)
  3. Validar output/behavior com valores de exemplo de mock_data
  4. Imprimir resultado (✓ PASS ou ✗ FAIL)
```

#### Passo 7: Preparar PR

```
1. Listar arquivos criados/alterados (files_to_change)
2. Listar testes adicionados (tests_to_create)
3. Gerar mensagem de commit convencional:
   feat(spec): implement SPEC-XXX [Title] — descrição breve
4. Sugerir PR template preenchido (title, body, labels)
5. Imprimir checklist de validação (lint ✓, tests ✓, storybook ✓, i18n ✓)
```

### 4. Saída

```
Resultado esperado:
- Todos testes passando (npm test)
- Lint/typecheck sem erros (npm run lint + npm run typecheck)
- Arquivos criados/alterados conforme files_to_change
- Storybook story criado (se aplicável)
- i18n strings extraídas
- PR pronto para merge (com mensagem de commit e body preenchido)
- Checklist de aceitação validada contra acceptance_criteria
```

## Observações Técnicas

### Arquitetura de Camadas

```
Apresentação (UI)
  ↓ consome
Domínio (use-cases, modelos, regras)
  ↓ consome
Dados (DAOs, repositórios, persistência)
  ↓ consome
Serviços (notificações, backups, IA, etc.)
```

### TypeScript Strict Mode

- `noImplicitAny: true`
- `strict: true`
- Tipos explícitos em function params/returns
- Evitar `any` (usar `unknown` + type guards se necessário)

### Testes

- Unit tests: funções puras, sem side effects
- Integration tests: DAO, notificações, persistência (use test doubles / mocks)
- E2E: fluxos críticos end-to-end (opcional para specs iniciais)

### Feature Flags

- `AI_ENABLED`: controla se LLM on-device é carregado
- `BACKUP_ENCRYPTION`: controla se backups são encriptados
- Armazenar em `src/config/featureFlags.ts` (leitura de env vars)

### Offline-First & Privacidade

- Nenhum dado enviado para rede sem consentimento explícito
- Armazenamento padrão: SQLite local
- Backups: opt-in via UI
- Qualquer integração externa: requer SPEC separada de avaliação de impacto

## Exemplo de Invocação

```
User: "Implement SPEC-001 HeaderProgress"

Agent:
1. ✓ Validar Phase 2 bloqueadores
2. ✓ Gerar testes (RED)
3. ✓ Implementar HeaderProgress (GREEN)
4. ✓ Refatorar (lint/typecheck)
5. ✓ Criar Storybook story
6. ✓ Validar acceptance_criteria
7. ✓ Preparar PR

Output:
- Arquivos: src/components/HeaderProgress/HeaderProgress.tsx + styles + story
- Testes: __tests__/HeaderProgress.test.tsx (✓ ALL PASS)
- PR: feat(spec): implement SPEC-001 HeaderProgress + body preenchido
```

## Referências

- `speckit.constitution`: princípios arquiteturais e convenções
- `speckit.specify`: definição técnica da SPEC
- `speckit.plan`: roadmap e dependências
- `speckit.tasks.md`: lista de tasks e bloqueadores
- `.github/PULL_REQUEST_TEMPLATE.md`: template de PR padrão
