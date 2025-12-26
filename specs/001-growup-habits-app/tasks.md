# Tasks: GrowUp Yourself — MVP Implementation

**Input**: Design documents from `/specs/001-growup-habits-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Expo-managed React Native structure

- [ ] T001 Create Expo project with TypeScript template via `npx create-expo-app GrowUpYourself --template expo-template-blank-typescript`
- [ ] T002 Install core dependencies: expo-sqlite, expo-notifications, expo-router, react-native-paper, zustand, victory-native, @expo/vector-icons in `package.json`
- [ ] T003 [P] Setup TypeScript configuration (tsconfig.json) with strict mode
- [ ] T004 [P] Create folder structure: `src/{screens,viewmodels,components,repositories,services,theme,models}` and `tests/{unit,integration}`
- [ ] T005 [P] Setup ESLint and Prettier for code consistency
- [ ] T006 Create app configuration file with app name, colors, and design tokens at `src/config/constants.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Implement Repository abstraction for SQLite in `src/repositories/Repository.ts` with CRUD methods
- [ ] T008 [P] Implement database initialization and migrations framework in `src/repositories/migrations/`
- [ ] T009 [P] Create TypeScript models (interfaces) in `src/models/index.ts`: UserProfile, Pilar, Meta, Execucao, LancamentoFinanceiro, Investimento, Compromisso
- [ ] T010 [P] Implement NotificationService wrapper in `src/services/NotificationService.ts` for expo-notifications
- [ ] T011 [P] Create design tokens and theme file at `src/theme/tokens.ts` with colors, spacing, typography (blue palette per spec)
- [ ] T012 Create root navigation structure with Expo Router in `src/screens/_layout.tsx`
- [ ] T013 [P] Implement base ViewModel pattern (zustand stores) example in `src/viewmodels/BaseViewModel.ts`
- [ ] T014 Setup Jest and React Native Testing Library configuration in `jest.config.js` and `tests/`
- [ ] T015 Create AppHeader fixed component in `src/components/AppHeader.tsx` with 4 pillar icons and progress bars (placeholder state)
- [ ] T016 Create AppTabBar component in `src/components/AppTabBar.tsx` with 4 pillar tabs + Profile tab (placeholder state)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Criar e executar meta semanal (Priority: P1) 🎯 MVP

**Goal**: Usuário pode criar uma meta semanal, receber lembrete, iniciar a sessão, e registrar conclusão com histórico local.

**Independent Test**: Criar meta (seg/qua/sex, 30min, 06:00), simular notificação, iniciar em horário diferente, marcar conclusão, verificar histórico com horario_inicio_real correto.

### Tests for User Story 1 (OPTIONAL)

- [ ] T017 [P] [US1] Unit test for MetaRepository CRUD in `tests/unit/repositories/MetaRepository.test.ts`
- [ ] T018 [P] [US1] Unit test for MetaViewModel state and actions in `tests/unit/viewmodels/MetaViewModel.test.ts`
- [ ] T019 [P] [US1] Integration test for meta creation + execution flow in `tests/integration/MetaFlow.test.ts`

### Implementation for User Story 1

- [ ] T020 [P] [US1] Implement MetaRepository in `src/repositories/MetaRepository.ts` (CRUD for Meta and Execucao)
- [ ] T021 [P] [US1] Create MetaViewModel in `src/viewmodels/MetaViewModel.ts` with state (metas[], loading, error) and actions (create, update, delete, recordExecution)
- [ ] T022 [US1] Create screen `src/screens/spirituality/ListMetasScreen.tsx` showing list of metas by subtopic (Leitura, Oração, Vida em Comunidade, Serviço)
- [ ] T023 [US1] Create modal/screen `src/screens/spirituality/CreateMetaScreen.tsx` with form (título, descrição, dias_semana chips, duracao_minutos, horario_sugerido, notificacao_minutos_antes)
- [ ] T024 [US1] Create screen `src/screens/spirituality/ExecuteMetaScreen.tsx` with timer (shows countdown from duracao based on horario_inicio_real), buttons for "Iniciar", "Marcar Conclusão", and "Observação"
- [ ] T025 [P] [US1] Implement Pillar data initialization in `src/repositories/migrations/001_init_pilares.ts` (insert 4 pilares into DB)
- [ ] T026 [US1] Wire MetaViewModel to screens via Expo Router in `src/screens/spirituality/_layout.tsx`
- [ ] T027 [US1] Implement local notification scheduling for meta reminders via NotificationService in `src/services/SchedulingService.ts` (lembretes 1 dia before, alarm final based on horario_inicio_real + duracao)
- [ ] T028 [P] [US1] Create MetaCard component in `src/components/MetaCard.tsx` showing titulo, dias_semana, progress button
- [ ] T029 [US1] Wire MetaCard to ExecuteMetaScreen and handle "Iniciar" action (record horario_inicio_real, schedule alarm, transition to active state)

**Checkpoint**: User Story 1 should be fully functional and testable independently - user can create a meta, see it scheduled, start it at real time, and mark it complete.

---

## Phase 4: User Story 2 - Visualizar progresso mensal no header (Priority: P1) 🎯 MVP

**Goal**: Usuário vê barra de progresso mensal fixa no header (Espiritualidade, Saúde, Finanças, Relacionamentos) com média de metas cumpridas.

**Independent Test**: Preencher histórico com pontuações semanais [100, 75, 50, 100], verificar header mostra 81% (±1%), tooltip with breakdown.

### Tests for User Story 2 (OPTIONAL)

- [ ] T030 [P] [US2] Unit test for progress calculation in `tests/unit/services/ProgressCalculationService.test.ts` (average of weekly scores ±1%)
- [ ] T031 [P] [US2] Unit test for ProgressViewModel in `tests/unit/viewmodels/ProgressViewModel.test.ts`

### Implementation for User Story 2

- [ ] T032 [P] [US2] Implement ProgressCalculationService in `src/services/ProgressCalculationService.ts` (calculate monthly average per pilar from execucoes)
- [ ] T033 [P] [US2] Create ProgressViewModel in `src/viewmodels/ProgressViewModel.ts` exposing monthly progress per pilar (0-100%)
- [ ] T034 [US2] Update AppHeader component (`src/components/AppHeader.tsx`) to show 4 progress bars (one per pilar), colors from theme tokens, animated fill
- [ ] T035 [US2] Add tooltip/modal to AppHeader icon touch to show weekly breakdown (if desired)
- [ ] T036 [US2] Wire ProgressViewModel to AppHeader via context or state management to auto-update when execucoes change

**Checkpoint**: User Stories 1 AND 2 should both work independently - user sees metas work + progress bar updates when meta is marked done.

---

## Phase 5: User Story 3 - Saúde: chat on-device e cálculos básicos (Priority: P2)

**Goal**: Usuário usa chat para calcular IMC/TMB, definir metas de saúde, marcar cumprimento via quick-action.

**Independent Test**: No chat, pedir "Calcule meu IMC" com peso 78kg altura 1.78m, verificar resposta correta (25.6, normal), quick-action registra meta.

### Tests for User Story 3 (OPTIONAL)

- [ ] T037 [P] [US3] Unit test for IMC/TMB calculations in `tests/unit/services/HealthCalculationService.test.ts`
- [ ] T038 [P] [US3] Unit test for HealthChatViewModel in `tests/unit/viewmodels/HealthChatViewModel.test.ts`
- [ ] T039 [P] [US3] Integration test for health meta creation via chat in `tests/integration/HealthChatFlow.test.ts`

### Implementation for User Story 3

- [ ] T040 [P] [US3] Implement HealthCalculationService in `src/services/HealthCalculationService.ts` (IMC = peso / altura^2, TMB = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age), category interpretation)
- [ ] T041 [P] [US3] Create HealthRepository in `src/repositories/HealthRepository.ts` for health metas and chat history
- [ ] T042 [P] [US3] Create simple rule-based chat engine in `src/services/HealthChatEngine.ts` (parse user input for keywords like "calcule imc", "exercício", "meta de peso", respond with canned responses + calculations)
- [ ] T043 [US3] Create HealthChatViewModel in `src/viewmodels/HealthChatViewModel.ts` with messages[], loading, sendMessage() action
- [ ] T044 [US3] Create screen `src/screens/health/HealthChatScreen.tsx` with chat bubbles (user/system), quick-action buttons (Registar exercício, Adicione exame, Marcar meta)
- [ ] T045 [US3] Create component `src/components/HealthChatBubble.tsx` for system/user messages with quick-action buttons
- [ ] T046 [US3] Wire quick-action buttons to create health metas (call HealthRepository.createHealthMeta(), schedule notifications if needed)
- [ ] T047 [US3] Add profile summary at top of HealthChatScreen (peso, altura, IMC quick calc)

**Checkpoint**: User Story 3 works independently - user can chat about health, get IMC/TMB, and create metas from quick-actions.

---

## Phase 6: User Story 4 - Finanças: planejamento vs lançamento e alerta (Priority: P2)

**Goal**: Usuário define planejamento mensal, registra lançamentos reais; ao >90%, app exibe alerta.

**Independent Test**: Define planejamento 3000 BRL, lança despesas até 2750 BRL (91%), verifica banner com alerta e sugestão.

### Tests for User Story 4 (OPTIONAL)

- [ ] T048 [P] [US4] Unit test for finance alerts in `tests/unit/services/FinanceAlertService.test.ts` (>90%, >100%)
- [ ] T049 [P] [US4] Unit test for FinanceViewModel in `tests/unit/viewmodels/FinanceViewModel.test.ts`

### Implementation for User Story 4

- [ ] T050 [P] [US4] Implement FinanceRepository in `src/repositories/FinanceRepository.ts` (CRUD for LancamentoFinanceiro, monthly planning budget)
- [ ] T051 [P] [US4] Implement FinanceAlertService in `src/services/FinanceAlertService.ts` (calculate % gasto vs planejado, emit alert if >90%)
- [ ] T052 [P] [US4] Create FinanceViewModel in `src/viewmodels/FinanceViewModel.ts` with state (planejamento, gastos, percentualGasto, alertLevel)
- [ ] T053 [US4] Create screen `src/screens/finance/FinanceDashboardScreen.tsx` with cards (Planejamento, Gasto Atual, % Usado)
- [ ] T054 [US4] Create alert banner component `src/components/FinanceAlertBanner.tsx` (shows when >90%, >100% with color/icon)
- [ ] T055 [US4] Create screen `src/screens/finance/LancamentoScreen.tsx` form for adding despesa/receita (categoria, valor, data, nota, checkbox planejado/real)
- [ ] T056 [US4] Add pie chart in FinanceDashboardScreen using victory-native (gastos by categoria)
- [ ] T057 [US4] Wire FinanceViewModel to update planejamento and lançamentos, trigger alerts via FinanceAlertService
- [ ] T058 [P] [US4] Create FinanceLancamentoCard component in `src/components/FinanceLancamentoCard.tsx` showing item details

**Checkpoint**: User Story 4 works independently - user can set budget, add expenses, and see alerts.

---

## Phase 7: User Story 5 - Relacionamentos: agenda recorrente e lembretes (Priority: P2)

**Goal**: Usuário cria compromisso recorrente com preparações e lembretes 2d/1d/day.

**Independent Test**: Criar compromisso recorrente (toda quinta), verificar em todas as quintas do mês, receber notificações 2d, 1d, e no dia.

### Tests for User Story 5 (OPTIONAL)

- [ ] T059 [P] [US5] Unit test for recurrence rule in `tests/unit/services/RecurrenceService.test.ts` (generate occurrences for month)
- [ ] T060 [P] [US5] Unit test for RelationshipViewModel in `tests/unit/viewmodels/RelationshipViewModel.test.ts`

### Implementation for User Story 5

- [ ] T061 [P] [US5] Implement RelationshipRepository in `src/repositories/RelationshipRepository.ts` (CRUD for Compromisso)
- [ ] T062 [P] [US5] Implement RecurrenceService in `src/services/RecurrenceService.ts` (parse recurrence_rule, generate list of occurrences for month)
- [ ] T063 [P] [US5] Create RelationshipViewModel in `src/viewmodels/RelationshipViewModel.ts` with state (compromissos[], occurrences for month)
- [ ] T064 [US5] Create screen `src/screens/relationships/AgendaScreen.tsx` showing calendar/list of compromissos for month
- [ ] T065 [US5] Create screen `src/screens/relationships/CreateCompromissoScreen.tsx` with form (titulo, com_quem, data_hora, recorrencia dropdown/picker, preparacao checklist)
- [ ] T066 [US5] Create component `src/components/AgendaItem.tsx` showing compromisso with preparation details and status
- [ ] T067 [US5] Wire lembretes scheduling (2d, 1d, no dia) via NotificationService, handle recurrence
- [ ] T068 [US5] Add toggle in AgendaScreen to edit one occurrence or entire series

**Checkpoint**: User Story 5 works independently - user can schedule recurring events with reminders.

---

## Phase 8: Profile & Backup (Cross-cutting)

**Purpose**: User profile management and backup/export functionality

- [ ] T069 Implement ProfileRepository in `src/repositories/ProfileRepository.ts` (get/update UserProfile)
- [ ] T070 Create ProfileViewModel in `src/viewmodels/ProfileViewModel.ts` with fields (nome, foto, sexo, peso, altura, meta_peso, preferences)
- [ ] T071 [P] Create screen `src/screens/ProfileScreen.tsx` with form fields and preferences toggles (notificações por pilar, tema claro/escuro)
- [ ] T072 [P] Create photo picker integration (use expo-image-picker or similar)
- [ ] T073 Implement BackupService in `src/services/BackupService.ts` (export JSON/SQLite dump, import restore)
- [ ] T074 Add Backup/Export UI in ProfileScreen with buttons for "Exportar Backup" and "Importar Backup"
- [ ] T075 Implement file sharing flow for backup export (use expo-sharing or RNShare)

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories and final polish

- [ ] T076 [P] Add comprehensive error handling and logging to all services (`src/services/LoggingService.ts`)
- [ ] T077 [P] Implement app-wide accessibility review: AA contrast, semantic labels, touch targets >=44px
- [ ] T078 [P] Create empty states for all screens (no metas, no compromissos, no transactions)
- [ ] T079 [P] Create error state screens and error boundaries
- [ ] T080 Documentation updates: README with quickstart, API docs in comments
- [ ] T081 [P] Performance optimization: index database queries, lazy load screens
- [ ] T082 Code cleanup and refactoring (remove unused code, consolidate duplicates)
- [ ] T083 Run through quickstart.md validation: bootstrap fresh project, verify folder structure
- [ ] T084 [P] Add unit tests for edge cases (no notification permission, DB write failure, retroactive meta recording)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion - BLOCKS all user stories
- **Phases 3-7 (User Stories)**: All depend on Phase 2 completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order: US1 → US2 → US3 → US4 → US5
- **Phase 8 (Profile & Backup)**: Can start after Phase 2 (does not depend on specific user stories)
- **Phase 9 (Polish)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 - MVP core
- **User Story 2 (P1)**: Can start after Phase 2 - MVP, depends on US1 data (reads metas for progress, but independent implementation)
- **User Story 3 (P2)**: Can start after Phase 2 - Independent from US1/US2
- **User Story 4 (P2)**: Can start after Phase 2 - Independent from US1/US2/US3
- **User Story 5 (P2)**: Can start after Phase 2 - Independent from US1-US4

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Repository before ViewModel
- ViewModel before Screens
- Core implementation before integration with other stories
- Story complete and independently testable before moving to next

### Parallel Opportunities

- All Phase 1 Setup tasks marked [P] can run in parallel
- All Phase 2 Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Phase 2 completes:
  - US1 and US2 can run in parallel (US2 reads from US1 data but is independently testable)
  - US3, US4, US5 can all run in parallel with each other and with US1/US2
  - Profile & Backup can run in parallel with user stories
- Within each story, all [P] tasks can run in parallel
  - Example US1 parallel: T020, T021, T025, T028 can run together
  - Example US3 parallel: T040, T041, T042 can run together

---

## Parallel Example: User Story 1 Fast Track

```
Phase 2 done → Launch all US1 tasks marked [P] together:
- T020: MetaRepository CRUD
- T021: MetaViewModel
- T025: Pillar initialization
- T028: MetaCard component

Then launch dependent tasks:
- T022: ListMetasScreen
- T023: CreateMetaScreen
- T024: ExecuteMetaScreen (depends on T021, T028)
- T026: Wire routing
- T027: Notification scheduling
- T029: Wire card to execution

Result: US1 complete in ~1 sprint
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (create/execute metas)
4. Complete Phase 4: User Story 2 (progress visualization)
5. **STOP and VALIDATE**: Test US1 + US2 independently and together
6. Deploy/demo MVP: user can create metas, see progress

### Incremental Delivery (Add features weekly)

1. Setup + Foundational → Foundation ready
2. + User Story 1 → MVP! (demo: create metas)
3. + User Story 2 → MVP+ (demo: progress bars)
4. + User Story 3 → Health (demo: chat + IMC)
5. + User Story 4 → Finance (demo: budget alerts)
6. + User Story 5 → Relationships (demo: recurring events)
7. + Profile & Backup → Admin features
8. + Polish → Release ready

### Parallel Team Strategy (3-4 developers)

1. All developers: Setup + Foundational
2. Once Foundational done:
   - Dev A: User Story 1 (meta creation/execution)
   - Dev B: User Story 3 (health chat) + Profile
   - Dev C: User Story 4 (finance) + Backup
   - Dev D: User Story 5 (relationships) or User Story 2 (progress) if available
3. Dev A completes US1 → Dev B/C/D integrate their stories into main app
4. Weekly integration points to verify all stories still work together

---

## Suggested Commit Points (After Each Task or Group)

- T001-T006: Initial setup commit
- T007-T016: Foundation commit
- T017-T029: User Story 1 commit
- T030-T036: User Story 2 commit
- T037-T047: User Story 3 commit
- T048-T058: User Story 4 commit
- T059-T068: User Story 5 commit
- T069-T075: Profile & Backup commit
- T076-T084: Polish & release commit

---

## Notes

- [P] tasks = different files, no dependencies on unfinished tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable by running just that story's tasks
- Verify tasks work independently before integrating (stop at checkpoints)
- Avoid: same file conflicts, cross-story dependencies that break independence
- Use branches per story or per phase for safety
