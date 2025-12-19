---
agent: speckit.specify
---
# Schema: custom speckit YAML (fields: id, title, description, priority, preconditions, steps, expected_results, acceptance_criteria, files_to_change, tests_to_create, mock_data)
# Generated following user instructions and speckit.constitution principles (privacy, offline-first, TypeScript + RN + Expo)

- id: SPEC-001
  title: Header fixo com 4 ícones e barras de progresso mensais
  priority: high
  description: >
    Implementar header fixo em todas telas principais contendo 4 ícones representando cada pilar
    (Espiritualidade, Saúde, Finanças, Relacionamentos) e uma mini barra de progresso mensal abaixo de
    cada ícone. Avatar no canto direito abre Perfil/Config. Todos os assets e tokens vêm de software_engineering/layout/v.1.2.
  preconditions:
    - design tokens e ícones disponíveis em software_engineering/layout/v.1.2
    - Storybook configurado
  steps:
    - Criar componente React Native: src/components/HeaderProgress/HeaderProgress.tsx (props: progress)
    - Extrair design tokens para src/styles/design-tokens.json
    - Implementar estilos em src/components/HeaderProgress/HeaderProgress.styles.ts
    - Incluir Header no fluxo de navegação: src/navigation/MainNavigator.tsx
    - Criar story: stories/HeaderProgress.stories.tsx
    - Escrever unit tests: __tests__/HeaderProgress.test.tsx
    - Extrair strings para src/i18n/pt-BR.json e incluir assinatura visível onde aplicável
  expected_results:
    - Header fixo presente em rotas principais; mini barras exibem percentuais e tooltip descritivo ao toque
  acceptance_criteria:
    - Unit test verifica renderização com progress 0..100, accessibility labels e snapshot
    - Header responsivo com touch targets >=44px e contraste AA
  files_to_change:
    - src/components/HeaderProgress/HeaderProgress.tsx
    - src/components/HeaderProgress/HeaderProgress.styles.ts
    - src/navigation/MainNavigator.tsx
    - stories/HeaderProgress.stories.tsx
    - src/styles/design-tokens.json
    - src/i18n/pt-BR.json
  tests_to_create:
    - __tests__/HeaderProgress.test.tsx: unit (render + accessibility + snapshot)
  mock_data:
    - { "spiritual": 81.25, "health": 60, "finance": 91, "relationship": 45 }

- id: SPEC-002
  title: CRUD de Metas por Pilar e persistência SQLite
  priority: high
  description: >
    Implementar criação, edição, exclusão e listagem de metas por pilar com persistência local em SQLite.
    Modelo `Meta` com campos: title, description, days (array de dias 1..7), durationMinutes, suggestedTime, notifyBeforeMinutes, recurring (boolean).
  preconditions:
    - Database service padronizado em src/data/sqliteRepository.ts (ou stub)
    - Models e requisitos em software_engineering/Levantamento de Requisitos.md
  steps:
    - Criar model TypeScript: src/domain/models/Meta.ts
    - Criar DAO: src/data/metaDAO.ts (CRUD, parametrizado para test doubles)
    - Criar use-cases: src/domain/usecases/metaUseCases.ts (create, read, update, delete, getByPillar)
    - Criar UI: src/screens/Spirituality/MetaList.tsx e MetaForm.tsx usando design tokens
    - Adicionar migration SQL: migrations/0001_create_meta_table.sql
    - Escrever unit tests para domain/usecases e integration test para DAO (mock DB file)
  expected_results:
    - Metas persistem entre reinícios do app; formulários validam campos obrigatórios (dias)
  acceptance_criteria:
    - Unit tests cobrem createMeta() com casos válidos e inválidos
    - Integration test insere meta via DAO e recupera a mesma
  files_to_change:
    - src/domain/models/Meta.ts
    - src/data/metaDAO.ts
    - src/domain/usecases/metaUseCases.ts
    - src/screens/Spirituality/MetaList.tsx
    - src/screens/Spirituality/MetaForm.tsx
    - migrations/0001_create_meta_table.sql
  tests_to_create:
    - __tests__/metaUseCases.unit.test.ts
    - __tests__/metaDAO.integration.test.ts
  mock_data:
    - sample_meta: { "title": "Leitura - Salmos", "description": "Ler Salmo 23", "days": [1,3,5], "durationMinutes":30, "time":"06:00", "notifyBeforeMinutes":10 }

- id: SPEC-003
  title: Iniciar meta e alarmar final com base no horário real de início
  priority: high
  description: >
    Ao iniciar uma meta, registrar horario_real_inicio e agendar notificação para horario_real_inicio + duration. Permitir marcação retroativa quando usuário não marcar início no tempo.
  preconditions:
    - Service de notificações injetável: src/services/notifications.ts
    - Use-cases de execução: metaExecutionUseCases.startMeta/markRetroactive
  steps:
    - Implementar startMeta que grava execução em tabela `execucao` e agenda notificação
    - Implementar botão "Iniciar" em MetaCard que chama startMeta
    - Implementar tela MetaRunning com timer calculando restante a partir do horario_real_inicio
    - Adicionar testes unit para cálculo do horário final e integration test que mocka notifications
  expected_results:
    - Final calculado como start + duration; notificação de término dispara apropriadamente
  acceptance_criteria:
    - Unit test: start at 06:10 + duration 30 => final 06:40
    - Integration test: notifications.schedule called com timestamp correto
  files_to_change:
    - src/domain/usecases/metaExecutionUseCases.ts
    - src/services/notifications.ts
    - src/screens/Meta/MetaRunning.tsx
  tests_to_create:
    - __tests__/metaExecutionUseCases.unit.test.ts
    - __tests__/metaExecutionUseCases.integration.test.ts
  mock_data:
    - execution_case: { "metaId": "m1", "suggestedStart":"06:00", "actualStart":"06:10", "durationMinutes":30 }

- id: SPEC-004
  title: Barra de progresso mensal por pilar (algoritmo de metrificação)
  priority: high
  description: >
    Implementar cálculo de progresso mensal por pilar conforme algoritmo: média das pontuações semanais das metas daquele pilar (conforme Levantamento de Requisitos).
  preconditions:
    - Histórico de execuções disponível na tabela execucao
    - Utilitários de data em src/utils/dateUtils.ts
  steps:
    - Criar serviço: src/services/progressCalculator.ts com getMonthlyProgress(pillarId, month, year)
    - Cobrir casos de semanas parciais e ausência de dados
    - Escrever unit tests com exemplos e tolerância <=1%
    - Consumir serviço em HeaderProgress para exibir valores reais
  expected_results:
    - Cálculo correto com precisão <=1%
  acceptance_criteria:
    - Unit tests: [100,75,50,100] => 81.25 (Header mostra 81% arredondado)
  files_to_change:
    - src/services/progressCalculator.ts
    - src/components/HeaderProgress/HeaderProgress.tsx
  tests_to_create:
    - __tests__/progressCalculator.unit.test.ts
  mock_data:
    - weekly_scores_example: [100,75,50,100]

- id: SPEC-005
  title: Chat Saúde com AI on-device (fallback determinístico)
  priority: high
  description: >
    Implementar chat conversacional para Saúde suportando cálculo IMC/TMB, quick-actions (ex.: "Cumpri hoje a meta X") e análise simples de exames inseridos.
    IA on-device deve ser encapsulada; quando indisponível, usar regras determinísticas.
  preconditions:
    - Feature flag: AI_ENABLED
    - Interface de serviço: src/services/ai/index.ts (calculateIMC, calculateTMB, analyzeExame, suggestGoals)
    - Layout do chat em software_engineering/layout/v.1.2
  steps:
    - Criar serviço AI com implementações AiLocal (tenta carregar modelo) e AiFallback (regras)
    - Criar ChatScreen: src/screens/Health/ChatHealth.tsx com quick actions
    - Garantir disclaimer visível: "Sugestões não substituem avaliação médica"
    - Escrever unit tests para IMC/TMB e integration test para quick-actions que chamam metaUseCases
  expected_results:
    - IMC/TMB calculados corretamente; quick-action grava execução
  acceptance_criteria:
    - Unit tests para IMC/TMB com valores conhecidos
    - Integration test: chat quick action chama metaUseCases.markComplete
  files_to_change:
    - src/services/ai/AiService.ts
    - src/screens/Health/ChatHealth.tsx
    - src/domain/usecases/healthUseCases.ts
  tests_to_create:
    - __tests__/ai.calculateIMC.unit.test.ts
    - __tests__/ChatHealth.integration.test.ts
  mock_data:
    - profile: { "name":"Jean", "weight":78, "height":1.78, "targetWeight":75 }

- id: SPEC-006
  title: Finanças — Planejamento vs Lançamentos e alerta >90%
  priority: medium
  description: >
    Implementar telas e fluxos para planejar valor mensal, lançar despesas/receitas, calcular percentual gasto e exibir alerta quando gasto >=90% do planejado.
  preconditions:
    - model lancamento_financeiro definido
    - biblioteca de gráficos compatível com Expo confirmada (recomendação: react-native-svg + victory-native)
  steps:
    - Criar screens: src/screens/Finance/FinanceDashboard.tsx e FinanceEntryForm.tsx
    - Implementar serviço: src/domain/usecases/financeUseCases.ts (calcPercentSpent, addEntry)
    - Implementar banner de alerta >=90% e notificação local quando ultrapassar 100%
    - Escrever unit tests para calcPercentSpent
  expected_results:
    - Dashboard mostra planejamento, gasto atual e gráfico por categoria; alerta visual e notificação quando necessário
  acceptance_criteria:
    - Unit test: calcPercentSpent(2750,3000) => 91.67% -> triggers banner
  files_to_change:
    - src/screens/Finance/FinanceDashboard.tsx
    - src/domain/usecases/financeUseCases.ts
    - __tests__/financeUseCases.unit.test.ts
  tests_to_create:
    - __tests__/financeUseCases.unit.test.ts
  mock_data:
    - planning: { "month": "2025-12", "planned": 3000, "current":2750 }

- id: SPEC-007
  title: Relacionamentos — Agenda com recorrência e lembretes
  priority: medium
  description: >
    Implementar cadastro de compromissos recorrentes (ex.: toda quinta), checklists de preparação e lembretes (2 dias, 1 dia, no dia).
  preconditions:
    - model compromisso e serviço calendar/recurrence disponíveis
    - assets de calendário em software_engineering/layout/v.1.2
  steps:
    - Criar screens: src/screens/Relationships/Agenda.tsx e RelationshipForm.tsx
    - Implementar recurrenceUtils em src/utils/recurrenceUtils.ts (RRULE weekly/byday simplificado)
    - Ao salvar recorrência, agendar notificações conforme configuração
    - Escrever unit tests para recurrenceUtils
  expected_results:
    - Compromissos recorrentes listados nas ocorrências corretas; lembretes disparados conforme regras
  acceptance_criteria:
    - Unit test: recurrenceUtils('weekly','TH') retorna próximas 4 quintas
  files_to_change:
    - src/screens/Relationships/Agenda.tsx
    - src/utils/recurrenceUtils.ts
  tests_to_create:
    - __tests__/recurrenceUtils.unit.test.ts
  mock_data:
    - appointment: { "title":"Noite com família", "who":"Esposa", "recurrence":"weekly:TH", "prep":["Comprar flores"] }

- id: SPEC-008
  title: Perfil — Dados locais e export/import backup
  priority: high
  description: >
    Implementar tela de perfil com campos locais (nome, foto, sexo, peso, altura, metaPeso) e função de export/import de backup (JSON/SQLite dump). Backup deve ser opt-in e suportar encriptação via flag BACKUP_ENCRYPTION.
  preconditions:
    - user_profile model presente
    - permissões de arquivo via expo-file-system/Share
  steps:
    - Criar screen: src/screens/Profile/Profile.tsx
    - Implementar services/backupService.ts com exportBackup() e importBackup(file)
    - Implementar UI para exportar e compartilhar arquivo
    - Escrever integration test de roundtrip export/import
  expected_results:
    - Export gera arquivo válido; import restaura dados
  acceptance_criteria:
    - Roundtrip test: save profile -> export -> clear DB -> import -> profile restored
  files_to_change:
    - src/screens/Profile/Profile.tsx
    - src/services/backupService.ts
    - __tests__/backupService.integration.test.ts
  tests_to_create:
    - __tests__/backupService.integration.test.ts
  mock_data:
    - profile: { "name":"Jean Ramalho", "weight":78, "height":1.78, "gender":"M", "targetWeight":75 }

- id: SPEC-009
  title: Export design tokens e i18n pt-BR
  priority: high
  description: >
    Extrair tokens visuais e microcopy de software_engineering/layout/v.1.2 e gerar:
    - src/styles/design-tokens.json (cores, tipografia, espaçamentos, ícones)
    - src/i18n/pt-BR.json (todas as strings visíveis ao usuário)
    Incluir assinatura visível "Design por Jean Ramalho" em telas de protótipo/metadados.
  preconditions:
    - Acesso a software_engineering/layout/v.1.2
  steps:
    - Copiar/transformar tokens para src/styles/design-tokens.json
    - Gerar src/i18n/pt-BR.json com chaves de interface para todas specs
    - Atualizar componentes/stories para usar tokens e strings i18n
  expected_results:
    - Componentes consomem tokens e strings do i18n; todas strings em pt-BR
  acceptance_criteria:
    - Arquivos gerados existem e são consumidos pelos stubs
  files_to_change:
    - src/styles/design-tokens.json
    - src/i18n/pt-BR.json
  tests_to_create:
    - __tests__/i18n.loading.test.ts
  mock_data:
    - designTokens: { "colors": { "primary":"#0055FF" }, "spacing": { "md": 16 } }
