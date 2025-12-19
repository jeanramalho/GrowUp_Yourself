<!--
Sync Impact Report

- Version change: template (none) → 1.0.0
- Modified principles:
	- [PRINCIPLE_1_NAME] → Privacidade e Offline-first
	- [PRINCIPLE_2_NAME] → Clean Code e Legibilidade
	- [PRINCIPLE_3_NAME] → Separation of Concerns / Onion Architecture
	- [PRINCIPLE_4_NAME] → Testabilidade e Spec-Driven
	- [PRINCIPLE_5_NAME] → Modularidade, Progressividade, Performance, Acessibilidade, Theming
- Added sections: Convenções de Implementação; Qualidade e Ferramentas; Arquitetura de Dados; Requisitos para Specs; Riscos; Governança
- Removed sections: placeholder template sections replaced with concrete policy
- Templates requiring updates:
	- .specify/templates/plan-template.md ✅ updated
	- .specify/templates/spec-template.md ✅ updated
	- .specify/templates/tasks-template.md ✅ updated
	- .specify/templates/agent-file-template.md ✅ updated
- Follow-up TODOs:
	- None deferred; all placeholders filled. If a ratification date needs confirmation, update `RATIFICATION_DATE`.
-->

# GrowUp Yourself Constitution

## Propósito
Esta constituição define princípios técnicos, padrões de implementação e critérios de aceitação
para guiar o desenvolvimento do aplicativo GrowUp Yourself — App Gestão de Hábitos. O objetivo é
garantir código limpo, escalabilidade, privacidade por padrão e entrega confiável por meio de
Spec-Driven Development.

## Princípios Centrais

### Privacidade e Offline-first
- Todos os dados do usuário são, por padrão, mantidos apenas no dispositivo.
- Integrações externas só serão adicionadas mediante especificação explícita e consentimento do usuário.
- Backups devem ser opt-in e, quando oferecidos, com opção de encriptação.

Racional: Privacidade é um requisito de produto. Aplicações de hábitos exigem confiança; portanto,
as decisões arquiteturais priorizam armazenamento local e consentimento explícito para qualquer
fluxo que envolva rede ou terceiros.

### Clean Code e Legibilidade
- Código claro é preferível a construções clever; nomes descritivos e funções pequenas (ideal <25–40 linhas).
- Cada módulo/função deve respeitar o princípio da única responsabilidade.
- Comentários são para explicar o "porquê", não o "como".
- Evitar duplicação por meio de abstrações simples e bem testadas.

Racional: Manutenibilidade e onboarding rápido exigem código previsível e observável.

### Separation of Concerns / Onion Architecture
- Estrutura mínima: presentation/ui → domain → data → services.
- UI não contém lógica de negócio; `domain` contém regras e casos de uso; `data` abstrai persistência.

Racional: Camadas claras tornam testes, migrações e extração de módulos mais seguras.

### Testabilidade e Spec-Driven
- Todo comportamento especificado em um `spec` (speckit) deve ter pelo menos:
	- 1 unit test cobrindo lógica pura; e
	- 1 integration/e2e que valide fluxos críticos quando aplicável.
- Tests são parte do PR e devem rodar no CI antes do merge.

Racional: Specs são fonte de verdade; testes vinculados garantem regressões mínimas e documentação viva.

### Modularidade, Progressividade, Performance, Acessibilidade e Theming
- Componentes UI atômicos e desacoplados; design tokens e estilos versionados.
- Funcionalidades avançadas (ex.: IA on-device) devem ter fallbacks e feature flags (`AI_ENABLED`).
- Meta inicial de instalação <200MB; cold start alvo <2s em devices modernos.
- Implementar labels acessíveis, contraste AA+, suporte a fontes escaláveis e i18n (pt-BR padrão).
- Cores, tipografia, espaçamentos e ícones expostos como design-tokens (JSON); tema claro/escuro via tokens.

Racional: Experiência consistente, inclusiva e com custos controlados em armazenamento e performance.

## Convenções de Implementação
- Linguagem: TypeScript (obrigatório para lógica e UI).
- Framework: React Native + Expo (setup padrão).
- State management: hooks + Context; preferência por soluções leves (ex.: Zustand) quando necessário.
- Persistência: Repositório + DAO; driver SQLite (ex.: `expo-sqlite` ou ponte compatível).
- IA on-device: encapsular em `services/ai` com interface clara (`analyzeExame()`, `calculateIMC()`, `suggestGoals()`), ativação via `AI_ENABLED`.
- Notificações: serviço `notifications` que abstrai API nativa e é injetável para testes.
- Naming: `kebab-case` para assets, `PascalCase` para componentes, `camelCase` para funções/variáveis.
- Commits: Convencional Commits (feat/fix/docs/test/chore) — obrigatório.
- Pull Requests: cada PR deve implementar uma spec do speckit; PR template deve referenciar o ID do spec.
- Branching: trunk-based com PRs curtos e revisão obrigatória.

## Qualidade e Ferramentas
- Linters & Formatters: ESLint + Prettier + regras TypeScript rigorosas (`noImplicitAny`, `strict`).
- CI: GitHub Actions executando lint, typecheck, unit tests e build para QA.
- Code Review: mínimo 1 reviewer; merge só após CI verde e aprovação.
- Coverage: metas pragmáticas (ex.: 80% em domain/core), foco em regras de negócio.

## Arquitetura de Dados
- Modelos persistidos em SQLite conforme modelagem definida nas specs.
- Migration strategy: versões de schema + scripts de migration; cada migration documentada no repo.
- Export/import: operação explícita do usuário (JSON/SQLite dump) com checksums e opção de encriptação.

## Design & UX
- Componentes documentados; Storybook recomendado para React Native.
- Design tokens versionados; atualização de tokens gera migração de estilos testada.
- Microcopy humano e encorajador; evitar linguagem que revele origem institucional das referências.

## Requisitos Específicos para Specs (Speckit Workflow)
1. Cada spec deve conter:
	 - Título claro.
	 - Objetivo / contexto.
	 - Pré-condições (dados mock necessários).
	 - Passo-a-passo (fluxo de usuário).
	 - Critérios de aceitação mensuráveis.
	 - Testes vinculados (unit/integration/e2e).
2. Mapeamento: cada spec deve apontar para arquivos de teste, componentes afetados e tickets/PRs.
3. Automação: CI deve rodar os specs autorais como parte do pipeline; falha em qualquer spec bloqueia merge.

## Critérios de Aceitação Gerais (exemplos)
- Criação de meta salva corretamente com dias e duração e gera notificação X minutos antes.
- Ao iniciar uma meta, o horário real de início é gravado e o alarme final respeita `start + duration`.
- Barra de progresso mensal calculada conforme algoritmo especificado (erro aceitável ≤ 1%).
- Chat da Saúde calcula IMC/TMB corretamente com dados do perfil.
- Export/Import gera arquivo válido e restaurável.

## Riscos Conhecidos e Mitigações
- Modelos on-device pesados → Mitigar com quantização, lazy-load e opção de desabilitar IA.
- Perda de dados → export manual e instruções claras de backup; considerar backup cifrado futuro.
- Complexidade UX → prototipar e testar com usuários reais; iterar microcopy.

## Governança e Manutenção
- Atualizações de dependências: dependabot ativo; atualizações maiores revisadas via RFC.
- Documentação: README de cada módulo + CHANGELOG para releases.
- Autoridade de decisões: decisões arquiteturais maiores documentadas em ADRs.

**Version**: 1.0.0 | **Ratified**: 2025-12-18 | **Last Amended**: 2025-12-18

Esta constituição é a fonte de verdade para decisões de arquitetura e qualidade durante o desenvolvimento.
Alterações devem ser aprovadas via PR que inclua revisão técnica e atualização das specs relacionadas.

