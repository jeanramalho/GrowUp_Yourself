---
description: "Generated task list for GrowUp Yourself MVP (speckit)
---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 [P] Initialize Expo + TypeScript project (expo init / tsconfig) in project root: set up TypeScript, `app.json` and basic src/ structure
- [ ] T002 [P] Configure ESLint + Prettier + TypeScript strict rules (`.eslintrc.js`, `.prettierrc`, `tsconfig.json`)
- [ ] T003 [P] Create CI pipeline (.github/workflows/ci.yml) with jobs: lint, typecheck, test, build
- [ ] T004 [P] Extract design tokens from `software_engineering/layout/v.1.2` → `src/styles/design-tokens.json` and add to repo
- [ ] T005 [P] Generate initial i18n file `src/i18n/pt-BR.json` with UI strings and signature "Design por Jean Ramalho"

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T006 Create `src/data/sqliteRepository.ts` abstraction for SQLite access (wrapper for `expo-sqlite`)
- [ ] T007 Add migrations folder and baseline migration `migrations/0001_create_tables.sql` (meta, execucao, user_profile, lancamento_financeiro, compromisso)
- [ ] T008 Implement injectable `src/services/notifications.ts` with scheduling/cancel stubs and platform notes
- [ ] T009 Add feature flag config `src/config/featureFlags.ts` with `AI_ENABLED` and `BACKUP_ENCRYPTION`
- [ ] T010 Setup Storybook initial config and storybook scripts (/.storybook, `stories/`)

---

## Phase 3: User Story US1 — Header fixo com 4 ícones e barras de progresso mensais (SPEC-001)

- [ ] T011 [P] [US1] Create component `src/components/HeaderProgress/HeaderProgress.tsx` and styles `HeaderProgress.styles.ts`
- [ ] T012 [P] [US1] Add Storybook story `stories/HeaderProgress.stories.tsx` and ensure it consumes `src/styles/design-tokens.json`
- [ ] T013 [US1] Integrate header into navigation: `src/navigation/MainNavigator.tsx` (render persistent header across main routes)
- [ ] T014 [US1] Create unit test `__tests__/HeaderProgress.test.tsx` (render + accessibility labels + snapshot)

---

## Phase 3: User Story US2 — CRUD de Metas por Pilar e persistência SQLite (SPEC-002)

- [ ] T015 [P] [US2] Create model `src/domain/models/Meta.ts` (fields per spec) and `src/domain/models/Execucao.ts`
- [ ] T016 [P] [US2] Add migration `migrations/0001_create_meta_table.sql` (table meta + execucao)
- [ ] T017 [US2] Implement DAO `src/data/metaDAO.ts` (CRUD) using `sqliteRepository` abstraction
- [ ] T018 [US2] Implement domain use-cases `src/domain/usecases/metaUseCases.ts` (createMeta, getMetasByPilar, update, delete)
- [ ] T019 [US2] Implement UI screens: `src/screens/Spirituality/MetaList.tsx` and `src/screens/Spirituality/MetaForm.tsx` (use tokens from layout v.1.2)
- [ ] T020 [US2] Create tests: `__tests__/metaUseCases.unit.test.ts` and `__tests__/metaDAO.integration.test.ts` (integration uses test DB file)

---

## Phase 3: User Story US3 — Iniciar meta e alarmar final (SPEC-003)

- [ ] T021 [US3] Implement `src/domain/usecases/metaExecutionUseCases.ts` with `startMeta(metaId)` and `markRetroactive(metaId, actualStart)`
- [ ] T022 [US3] Persist execution to `execucao` table and schedule end notification via `src/services/notifications.ts`
- [ ] T023 [US3] UI: add "Iniciar" button in `src/components/MetaCard.tsx` and screen `src/screens/Meta/MetaRunning.tsx`
- [ ] T024 [US3] Tests: `__tests__/metaExecutionUseCases.unit.test.ts` (time calc) and integration test mocking notifications `__tests__/metaExecutionUseCases.integration.test.ts`

---

## Phase 3: User Story US4 — Barra de progresso mensal por pilar (SPEC-004)

- [ ] T025 [P] [US4] Implement `src/services/progressCalculator.ts` with `getMonthlyProgress(pillarId, month, year)` per algorithm (weeks partial weighting)
- [ ] T026 [US4] Unit tests `__tests__/progressCalculator.unit.test.ts` covering examples (e.g., [100,75,50,100] => 81.25)
- [ ] T027 [US4] Integrate progressCalculator into `HeaderProgress` (consume service) and update stories/tests

---

## Phase 3: User Story US5 — Chat Saúde com AI on-device (fallback) (SPEC-005)

- [ ] T028 [P] [US5] Add AI service interface `src/services/ai/index.ts` and fallback `src/services/ai/AiFallback.ts`
- [ ] T029 [US5] Add scaffold for `src/services/ai/AiLocal.ts` (attempt model load, return failure → fallback)
- [ ] T030 [US5] Implement `src/screens/Health/ChatHealth.tsx` with quick-actions ("Cumpri hoje a meta X") and visible medical disclaimer
- [ ] T031 [US5] Tests: `__tests__/ai.calculateIMC.unit.test.ts` (pure functions) and `__tests__/ChatHealth.integration.test.ts` (quick-action triggers metaUseCases.markComplete)
- [ ] T032 [US5] Create research spike `research/spike-ai-ondevice.md` to evaluate candidate models (size, license, perf)

---

## Phase 3: User Story US6 — Finanças — Planejamento vs Lançamentos e alerta >90% (SPEC-006)

- [ ] T033 [US6] Implement `src/domain/usecases/financeUseCases.ts` with `calcPercentSpent(planned, current)` and `addEntry`
- [ ] T034 [US6] UI: `src/screens/Finance/FinanceDashboard.tsx` and `src/screens/Finance/FinanceEntryForm.tsx` (chart integration optional)
- [ ] T035 [US6] Add alerts: banner when >=90% and local notification when >100% (use `src/services/notifications.ts`)
- [ ] T036 [US6] Tests: `__tests__/financeUseCases.unit.test.ts` (calcPercentSpent) and integration test for alerts

---

## Phase 3: User Story US7 — Relacionamentos — Agenda com recorrência e lembretes (SPEC-007)

- [ ] T037 [US7] Implement `src/utils/recurrenceUtils.ts` (RRULE weekly/byday simplified) and unit tests `__tests__/recurrenceUtils.unit.test.ts`
- [ ] T038 [US7] UI: `src/screens/Relationships/Agenda.tsx` and `src/screens/Relationships/RelationshipForm.tsx` (recurrence UI + prep checklist)
- [ ] T039 [US7] Schedule notifications for occurrences (use `src/services/notifications.ts`)
- [ ] T040 [US7] Integration E2E: create recurring event → verify occurrences show in calendar

---

## Phase 3: User Story US8 — Perfil — Dados locais e export/import backup (SPEC-008)

- [ ] T041 [US8] Implement `src/domain/models/UserProfile.ts` and `src/screens/Profile/Profile.tsx` (edit UI + show "Design por Jean Ramalho")
- [ ] T042 [US8] Implement `src/services/backupService.ts` with `exportBackup()` and `importBackup(file)` supporting JSON/SQLite dump and optional encryption flag
- [ ] T043 [US8] Tests: `__tests__/backupService.integration.test.ts` (roundtrip: save→export→clear DB→import→restore)
- [ ] T044 [US8] Add UI affordance to share/export file (use Expo Share/FileSystem)

---

## Phase 3: User Story US9 — Export design tokens & i18n (SPEC-009)

- [ ] T045 [P] [US9] Extract and commit `src/styles/design-tokens.json` from `software_engineering/layout/v.1.2` (colors, spacing, typog)
- [ ] T046 [P] [US9] Generate full `src/i18n/pt-BR.json` with all visible strings for MVP and medical disclaimers
- [ ] T047 [US9] Tests: `__tests__/i18n.loading.test.ts` to validate translations load

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T048 [P] Accessibility audit: ensure contrast AA, touch targets ≥44px, add `accessibilityLabel` to interactive components
- [ ] T049 Add CI E2E job (smoke): run critical flows mocked (create meta→start→complete)
- [ ] T050 Prepare `CHANGELOG.md` entry and `README.md` updates for modules added

---

## Dependencies & Notes

- All `files_to_change` above must reference paths under `src/` unless explicitly noted.
- Tests must use Jest + @testing-library/react-native for UI and node-based Jest for domain logic.
- Use `sqliteRepository` abstraction to allow swapping DB drivers in future.
- Feature flags for `AI_ENABLED` and `BACKUP_ENCRYPTION` must be checked before triggering model loads or encrypted backups.

---

## How to use

- Developers can check off tasks when completed in PRs; each task should reference the corresponding SPEC ID in the PR description.
- Prefer small PRs mapping to single tasks. Follow Conventional Commits: `feat(spec): ...` / `fix`: ...

