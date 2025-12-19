---
agent: speckit.plan
---
meta:
  project: GrowUp Yourself
  description: >
    Plano de execução Spec-Driven para o MVP do GrowUp Yourself (React Native + Expo, TypeScript).
    Prioriza privacidade, offline-first, separação de camadas e testabilidade conforme speckit.constitution.
  author: Jean Ramalho
  date: 2025-12-19

timeline:
  - milestone: "Milestone 1 — Bootstrapping & Infra (MVP-setup)"
    objective: "Preparar infra do app: lint, CI, design tokens, storybook, migrations básicas"
    deliverables:
      - src/styles/design-tokens.json
      - src/i18n/pt-BR.json (strings iniciais)
      - .eslintrc.js, .prettierrc, tsconfig.json
      - .github/workflows/ci.yml (lint/typecheck/test/build)
      - Storybook initial config
      - migrations/0001_create_tables.sql
    acceptance_criteria:
      - lint/typecheck rodando no CI com regras do constitution
      - design tokens extraídos e referenciáveis
    dependencies:
      - software_engineering/layout/v.1.2
      - speckit.constitution
    target_sprint: Sprint 1

  - milestone: "Milestone 2 — Core Features (MVP funcional)"
    objective: "Implementar fluxos essenciais: Metas CRUD, HeaderProgress, iniciar meta & notificações, progresso mensal, Perfil & backup"
    deliverables:
      - SPEC-001, SPEC-002, SPEC-003, SPEC-004, SPEC-008 implementados e testados
      - UI screens para cada pilar básicos
    acceptance_criteria:
      - Metas persistem no SQLite e testes de integração passam
      - Header mostra progresso mensal com precisão ≤1%
      - Backup export/import roundtrip comprovado
    dependencies:
      - Milestone 1 complete
    target_sprint: Sprint 2-3

  - milestone: "Milestone 3 — Saúde (IA) + Finanças"
    objective: "Integrar chat Saúde com AI on-device encapsulada (fallback) e dashboard financeiro básico com alertas"
    deliverables:
      - SPEC-005, SPEC-006 implemented
      - services/ai with AiFallback and AiLocal scaffold
      - Finance dashboard + alerts
    acceptance_criteria:
      - IMC/TMB unit tests passam
      - Alert triggered at >=90% planning in finance tests
    dependencies:
      - Milestone 2 complete
    target_sprint: Sprint 4-5

  - milestone: "Milestone 4 — Relacionamentos, Polimento e QA"
    objective: "Agenda recorrente, checklists de preparação, acessibilidade, E2E tests e polimento UX"
    deliverables:
      - SPEC-007 implemented
      - E2E suite covering critical flows
    acceptance_criteria:
      - recurrenceUtils unit tests validam ocorrências
      - E2E: criar meta → iniciar → concluir passes on CI (mocked)
    dependencies:
      - Milestone 2 & 3
    target_sprint: Sprint 6-7

  - milestone: "Milestone 5 — Release Candidate & Handover"
    objective: "Pipeline de release completo, documentação, CHANGELOG e entrega do build Expo"
    deliverables:
      - Release notes, CHANGELOG, README final
      - Export de assets e design tokens para dev
    acceptance_criteria:
      - Build pipeline gera artefato de release (bundle) e checklist QA verde
    dependencies:
      - All previous milestones
    target_sprint: Sprint 8

epics:
  - id: SPEC-001
    title: Header fixo com 4 ícones e barras de progresso mensais
    description: Implementar HeaderProgress consumindo design-tokens e i18n; acessibilidade e Storybook
    priority: high
    specs_link: SPEC-001
    tasks:
      - task_id: T1-001
        description: Extrair design tokens de software_engineering/layout/v.1.2 → src/styles/design-tokens.json
        files_to_change: ["src/styles/design-tokens.json"]
        tests_to_create: ["__tests__/i18n.loading.test.ts"]
        estimate_story_points: 2
      - task_id: T1-002
        description: Implementar componente HeaderProgress + styles + story
        files_to_change: ["src/components/HeaderProgress/HeaderProgress.tsx","src/components/HeaderProgress/HeaderProgress.styles.ts","stories/HeaderProgress.stories.tsx"]
        tests_to_create: ["__tests__/HeaderProgress.test.tsx"]
        estimate_story_points: 3
      - task_id: T1-003
        description: Integrar Header no MainNavigator e garantir persistência nas rotas
        files_to_change: ["src/navigation/MainNavigator.tsx"]
        tests_to_create: ["__tests__/navigation.header.integration.test.tsx"]
        estimate_story_points: 2

  - id: SPEC-002
    title: CRUD de Metas por Pilar e persistência SQLite
    description: Model Meta, DAO, usecases, UI list/form, migrations e testes
    priority: high
    specs_link: SPEC-002
    tasks:
      - task_id: T2-001
        description: Model `Meta` e migration SQL
        files_to_change: ["src/domain/models/Meta.ts","migrations/0001_create_meta_table.sql"]
        tests_to_create: ["__tests__/metaModel.unit.test.ts"]
        estimate_story_points: 3
      - task_id: T2-002
        description: DAO metaDAO.ts (CRUD) com abstração para sqliteRepository
        files_to_change: ["src/data/metaDAO.ts","src/data/sqliteRepository.ts"]
        tests_to_create: ["__tests__/metaDAO.integration.test.ts"]
        estimate_story_points: 5
      - task_id: T2-003
        description: Use-cases domain/metaUseCases.ts (create/get/update/delete) + unit tests
        files_to_change: ["src/domain/usecases/metaUseCases.ts"]
        tests_to_create: ["__tests__/metaUseCases.unit.test.ts"]
        estimate_story_points: 3
      - task_id: T2-004
        description: UI: MetaList + MetaForm (usar layout v.1.2) + Storybook + accessibility
        files_to_change: ["src/screens/Spirituality/MetaList.tsx","src/screens/Spirituality/MetaForm.tsx","stories/MetaForm.stories.tsx"]
        tests_to_create: ["__tests__/MetaForm.integration.test.tsx"]
        estimate_story_points: 5
      - task_id: T2-005
        description: E2E flow: criar meta → iniciar → marcar completa (test)
        files_to_change: ["e2e/flows/create_start_complete.spec.ts"]
        tests_to_create: ["e2e/flows/create_start_complete.spec.ts"]
        estimate_story_points: 5

  - id: SPEC-003
    title: Iniciar meta e alarmar final
    description: startMeta, execucao table, agendamento de notificação e UI MetaRunning
    priority: high
    specs_link: SPEC-003
    tasks:
      - task_id: T3-001
        description: Implementar execucao table e persistência
        files_to_change: ["migrations/0001_create_meta_table.sql","src/domain/models/Execucao.ts"]
        tests_to_create: ["__tests__/execucao.model.unit.test.ts"]
        estimate_story_points: 2
      - task_id: T3-002
        description: Implementar metaExecutionUseCases.startMeta/markRetroactive + tests
        files_to_change: ["src/domain/usecases/metaExecutionUseCases.ts"]
        tests_to_create: ["__tests__/metaExecutionUseCases.unit.test.ts"]
        estimate_story_points: 3
      - task_id: T3-003
        description: Notifications service injetável e mock para CI
        files_to_change: ["src/services/notifications.ts"]
        tests_to_create: ["__tests__/notifications.integration.test.ts"]
        estimate_story_points: 3
      - task_id: T3-004
        description: UI MetaRunning com timer e botão finalizar
        files_to_change: ["src/screens/Meta/MetaRunning.tsx"]
        tests_to_create: ["__tests__/MetaRunning.integration.test.tsx"]
        estimate_story_points: 3

  - id: SPEC-004
    title: Barra de progresso mensal por pilar
    description: Serviço progressCalculator, integração com HeaderProgress e testes de precisão
    priority: high
    specs_link: SPEC-004
    tasks:
      - task_id: T4-001
        description: Implementar src/services/progressCalculator.ts com getMonthlyProgress
        files_to_change: ["src/services/progressCalculator.ts"]
        tests_to_create: ["__tests__/progressCalculator.unit.test.ts"]
        estimate_story_points: 3
      - task_id: T4-002
        description: Integrar progressCalculator em HeaderProgress e atualizar stories/tests
        files_to_change: ["src/components/HeaderProgress/HeaderProgress.tsx"]
        tests_to_create: ["__tests__/HeaderProgress.integration.test.tsx"]
        estimate_story_points: 2

  - id: SPEC-005
    title: Chat Saúde com AI on-device (fallback)
    description: Encapsular AI em services/ai, criar ChatHealth, quick-actions e disclaimer
    priority: high
    specs_link: SPEC-005
    tasks:
      - task_id: T5-001
        description: Criar interface AI (AiService) e AiFallback implementation
        files_to_change: ["src/services/ai/AiService.ts","src/services/ai/index.ts"]
        tests_to_create: ["__tests__/ai.calculateIMC.unit.test.ts"]
        estimate_story_points: 3
      - task_id: T5-002
        description: Implementar ChatHealth screen com quick-actions e tests
        files_to_change: ["src/screens/Health/ChatHealth.tsx","stories/ChatHealth.stories.tsx"]
        tests_to_create: ["__tests__/ChatHealth.integration.test.ts"]
        estimate_story_points: 5
      - task_id: T5-003
        description: Spike: avaliar opções de LLM on-device (size, license, feasibility)
        files_to_change: ["research/spike-ai-ondevice.md"]
        tests_to_create: []
        estimate_story_points: 3

  - id: SPEC-006
    title: Finanças — Planejamento vs Lançamentos e alerta >90%
    description: Finance dashboard, calcPercentSpent, alerts and basic charts (expo-compatible)
    priority: medium
    specs_link: SPEC-006
    tasks:
      - task_id: T6-001
        description: Implement financeUseCases.calcPercentSpent + unit tests
        files_to_change: ["src/domain/usecases/financeUseCases.ts"]
        tests_to_create: ["__tests__/financeUseCases.unit.test.ts"]
        estimate_story_points: 3
      - task_id: T6-002
        description: FinanceDashboard UI + chart integration (recommend react-native-svg + victory-native)
        files_to_change: ["src/screens/Finance/FinanceDashboard.tsx"]
        tests_to_create: ["__tests__/FinanceDashboard.integration.test.tsx"]
        estimate_story_points: 5
      - task_id: T6-003
        description: Alerts/notifications for >=90% and >100%
        files_to_change: ["src/services/notifications.ts","src/domain/usecases/financeUseCases.ts"]
        tests_to_create: ["__tests__/financeAlerts.integration.test.ts"]
        estimate_story_points: 2

  - id: SPEC-007
    title: Relacionamentos — Agenda com recorrência e lembretes
    description: Recurrence utils and agenda UI + notifications
    priority: medium
    specs_link: SPEC-007
    tasks:
      - task_id: T7-001
        description: Implement recurrenceUtils and unit tests
        files_to_change: ["src/utils/recurrenceUtils.ts"]
        tests_to_create: ["__tests__/recurrenceUtils.unit.test.ts"]
        estimate_story_points: 3
      - task_id: T7-002
        description: Agenda UI + RelationshipForm + notifications
        files_to_change: ["src/screens/Relationships/Agenda.tsx","src/screens/Relationships/RelationshipForm.tsx"]
        tests_to_create: ["__tests__/Agenda.integration.test.tsx"]
        estimate_story_points: 5

  - id: SPEC-008
    title: Perfil — Dados locais e export/import backup
    description: Profile screen, backupService and import/export roundtrip
    priority: high
    specs_link: SPEC-008
    tasks:
      - task_id: T8-001
        description: Profile model + Profile screen
        files_to_change: ["src/domain/models/UserProfile.ts","src/screens/Profile/Profile.tsx"]
        tests_to_create: ["__tests__/profile.unit.test.ts"]
        estimate_story_points: 3
      - task_id: T8-002
        description: Implement backupService (export/import) and roundtrip integration test
        files_to_change: ["src/services/backupService.ts"]
        tests_to_create: ["__tests__/backupService.integration.test.ts"]
        estimate_story_points: 3

  - id: SPEC-009
    title: Export design tokens e i18n pt-BR
    description: Extrair design tokens do layout v.1.2 e criar i18n pt-BR com textos do MVP
    priority: high
    specs_link: SPEC-009
    tasks:
      - task_id: T9-001
        description: Copy/transform tokens → src/styles/design-tokens.json
        files_to_change: ["src/styles/design-tokens.json"]
        tests_to_create: []
        estimate_story_points: 2
      - task_id: T9-002
        description: Generate src/i18n/pt-BR.json with UI strings and disclaimers
        files_to_change: ["src/i18n/pt-BR.json"]
        tests_to_create: ["__tests__/i18n.loading.test.ts"]
        estimate_story_points: 2

backlog:
  - SPEC-010: Sync to Cloud (future, low priority)
  - SPEC-011: Multi-user support (future, low priority)
  - SPEC-012: Integrations: bank APIs / wearables (evaluation required)

risks:
  - id: R1
    title: AI on-device model size/performance
    impact: High
    mitigation: Implement AiFallback deterministic rules; quantize models; allow disabling AI via `AI_ENABLED` feature flag
    spike_task:
      id: S-AI-001
      description: Evaluate candidate LLMs for on-device use (size, memory, inference time, license)
      success_criteria: Identify at least one model ≤200MB quantized with permissive license or confirm infeasibility
      estimate_story_points: 3
  - id: R2
    title: Data loss (user device lost or reset)
    impact: High
    mitigation: Implement export/import manual backup; consider encrypted backup option behind feature flag `BACKUP_ENCRYPTION`
    spike_task:
      id: S-BACKUP-001
      description: Define encrypted backup format and UX (password, key derivation)
      success_criteria: Backup format documented and roundtrip test passes
      estimate_story_points: 3
  - id: R3
    title: Notifications reliability (iOS background limits)
    impact: Medium
    mitigation: Use platform best practices (Expo Notifications), document limitations, offer local reminder fallbacks
    spike_task:
      id: S-NOTIF-001
      description: Test notification scheduling on iOS/Android and document limitations
      success_criteria: List of supported behaviors and fallback UX
      estimate_story_points: 2

ci_requirements:
  - job: lint
    steps: ["npm run lint","npm run typecheck"]
  - job: test
    steps: ["npm test -- --coverage" ]
  - job: build
    steps: ["expo prebuild (or expo build) for validation" ]
  - job: storybook
    steps: ["build-storybook" ]
  - triggers: ["pull_request to main branch", "push to release/*"]

release_checklist:
  - All CI jobs green
  - All specs associated PRs merged
  - CHANGELOG updated
  - Release notes drafted
  - Expo bundle created and smoke-tested on device

outputs:
  - create_issues: true # one issue per task (ask before running automation)
  - create_milestones: true
  - create_labels: ["spec/MVP","priority/high","priority/medium","status/in-progress"]
  - templates: [".github/PULL_REQUEST_TEMPLATE.md",".github/ISSUE_TEMPLATE/spec-task.md"]

sprints:
  - sprint: Sprint 1
    start: 2025-12-22
    length_weeks: 2
    capacity_story_points: 20
    epics: [SPEC-009, SPEC-001, SPEC-001:T1-001]
  - sprint: Sprint 2
    start: 2026-01-05
    length_weeks: 2
    capacity_story_points: 20
    epics: [SPEC-002 (T2-001,T2-002), SPEC-003 (T3-001)]
  - sprint: Sprint 3
    start: 2026-01-19
    length_weeks: 2
    capacity_story_points: 20
    epics: [SPEC-002 (UI tasks), SPEC-004]
  - sprint: Sprint 4
    start: 2026-02-02
    length_weeks: 2
    capacity_story_points: 20
    epics: [SPEC-005 (T5-001,T5-003 spike)]

notes:
  - All UI strings must be in `src/i18n/pt-BR.json` and include the signature "Design por Jean Ramalho" where visible in prototyping.
  - Any new dependency must be accompanied by a small SPEC evaluating impact (size, license, perf).
  - Respect `software_engineering/layout/v.1.2` as single source of truth for assets and tokens.
