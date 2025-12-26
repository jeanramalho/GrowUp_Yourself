# Feature Specification: GrowUp Yourself — MVP (Gestão de Hábitos)

**Feature Branch**: `001-growup-habits-app`  
**Created**: 2025-12-23  
**Status**: Draft  
**Input**: User description: "construa uma aplicação que ajude no desenvolvimento pessoal das pessoas, baseada nos arquivos que estão dentro da pasta software_engineering tanto o layout como a arquitetura, fluxo de funcionamento e tecnologias, pode acrescentar também e usar elementos e bibliotecas de terceiros caso necessário."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Criar e executar meta semanal (Priority: P1)

Usuário cria uma meta semanal em um dos pilares (ex.: Leitura — seg/qua/sex — 30min), recebe lembrete, inicia a sessão no horário real, registra conclusão e vê o histórico.

**Why this priority**: Funcionalidade central do produto — gestão de hábitos e medição de progresso.

**Independent Test**: Criar meta, configurar dias/duração/lembrança, aguardar notificação (ou simular), marcar início manual, marcar conclusão; verificar registro em histórico e cálculo de progresso semanal.

**Acceptance Scenarios**:

1. **Given** app sem metas, **When** usuário cria uma meta com dias e duração, **Then** meta aparece na lista e agendamento de notificação local é criado.
2. **Given** meta agendada para 06:00, **When** notificação é disparada e usuário abre app e pressiona "Iniciar", **Then** app grava horário real de início e agenda alarme final para horário_real_inicio + duração.
3. **Given** sessão iniciada em horário diferente do sugerido, **When** usuário marca conclusão, **Then** execução grava `horario_inicio_real` correto e duração real, e semana conta como cumprida conforme definição.

---

### User Story 2 - Visualizar progresso mensal no header (Priority: P1)

Usuário vê barra de progresso mensal fixa no header com média do pilar (Espiritualidade, Saúde, Finanças, Relacionamentos).

**Why this priority**: Feedback contínuo e motivação — elemento sempre visível em todas as abas.

**Independent Test**: Preencher histórico de execuções em diferentes semanas do mês e verificar que a barra do pilar mostra a média mensal conforme algoritmo descrito.

**Acceptance Scenarios**:

1. **Given** histórico com pontuações semanais [100, 75, 50, 100], **When** visualizar header, **Then** barra mostra 81% (±1% tolerância) e tooltip exibe valores por semana.

---

### User Story 3 - Saúde: chat on-device e cálculos básicos (Priority: P2)

Usuário usa chat de saúde para calcular IMC/TMB, definir metas de exercícios e registrar cumprimento via quick-action do chat.

**Why this priority**: Valor agregado importante e diferencial; permite orientar metas de saúde mesmo em MVP com regras calculadas.

**Independent Test**: No chat, solicitar cálculo IMC após preencher peso/altura do perfil; verificar resposta correta e quick-action que registra meta cumprida.

**Acceptance Scenarios**:

1. **Given** perfil com peso 78kg e altura 1.78m, **When** pedir "Calcule meu IMC", **Then** chat responde com IMC correto e interpretação (normal/overweight) e opção para registrar meta.

---

### User Story 4 - Finanças: planejamento vs lançamento e alerta (Priority: P2)

Usuário define planejamento mensal, registra lançamentos reais; ao ultrapassar 90% do planejado, app exibe alerta.

**Why this priority**: Ajuda prática para controle financeiro mensal — objetivo do pilar Finanças.

**Independent Test**: Definir planejamento, lançar despesas até >90%, verificar banner/alerta e sugestão de ajuste.

**Acceptance Scenarios**:

1. **Given** planejamento 3000 BRL e gastos 2750 BRL (91%), **When** abrir dashboard, **Then** alerta visível com sugestão de revisar categorias.

---

### User Story 5 - Relacionamentos: agenda recorrente e lembretes (Priority: P2)

Usuário cria compromisso recorrente (ex.: toda quinta-feira encontro com família) com preparações e lembretes 2 dias/1 dia/no dia.

**Why this priority**: Mantém objetivo do pilar Relacionamentos — execução de ações programadas.

**Independent Test**: Criar compromisso recorrente, verificar presença nas datas, e recebimento de notificações programadas.

**Acceptance Scenarios**:

1. **Given** compromisso recorrente criado, **When** visualizar calendário, **Then** ocorrência aparece em todas as datas previstas do mês.

---

### Edge Cases

- Dispositivo sem permissão de notificações: app deve detectar e exibir instruções para o usuário habilitar permissão; ações continuam registradas manualmente.
- Usuário inicia sessão sem marcar antes (retroativo): permitir marcar execução retroativa com horário e status (concluída/falhou) e explicar impacto na métrica.
- Sem espaço disponível / falha de escrita no banco: exibir erro legível e opção para exportar backup manualmente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema deve permitir criar, editar e excluir metas por pilar com atributos: título, descrição, dias da semana, duração (minutos), horário sugerido, notificação minutos antes, recorrência semanal.
- **FR-002**: O sistema deve permitir iniciar uma sessão de meta, registrando `horario_inicio_real` e agendando alarme final para `horario_inicio_real + duracao`.
- **FR-003**: O sistema deve permitir marcar uma execução como `concluida`, `falhou` ou `pulou` e salvar observações opcionais; histórico diário/semana/mês deve ser persistido.
- **FR-004**: O header fixo deve exibir as 4 barras de progresso mensais (uma por pilar) calculadas pela média das semanas do mês, com tolerância ±1% no cálculo.
- **FR-005**: O sistema deve agendar notificações locais: lembrete de início, lembretes de preparação (2 e 1 dia antes quando configurado) e alertas financeiros (>90% do planejado).
- **FR-006**: O módulo Saúde deve oferecer um chat on-device que: calcula IMC/TMB a partir do perfil, permite inserir/extrair dados de exames manualmente, e fornece quick-actions para marcar metas como cumpridas.
- **FR-007**: O módulo Finanças deve suportar planejamento mensal, lançamentos reais (despesa/receita), indicadores (saldo, % usado) e gráficos por período/categoria.
- **FR-008**: O módulo Relacionamentos deve suportar cadastro de compromissos com recorrência, preparação (checklist/texto) e lembretes configuráveis; permitir marcar ocorrência como concluída.
- **FR-009**: Perfil local com campos: nome, foto, sexo (opcional), peso, altura, meta_peso e preferências (notificações por pilar, tema claro/escuro); perfil alimenta cálculos do módulo Saúde.
- **FR-010**: Exportação e importação manual de backup em arquivo (JSON ou SQLite dump) via compartilhamento do sistema operacional.
- **FR-011**: Persistência local usando banco de dados on-device (persistência local) com esquema compatível para `user_profile`, `meta`, `execucao`, `lancamento_financeiro`, `investimento`, `compromisso`.

### Key Entities *(include if feature involves data)*

- **UserProfile**: id, nome, foto_path, sexo, peso, altura, meta_peso, preferências (notificações, tema), updated_at
- **Pilar**: id, nome (Espiritualidade, Saúde, Finanças, Relacionamentos), icone, ordem
- **Meta**: id, pilar_id, titulo, descricao, dias_semana (bitmask), duracao_minutos, horario_sugerido, notificacao_minutos_antes, recorrente BOOLEAN, peso INTEGER, created_at, updated_at
- **Execucao**: id, meta_id, data, horario_inicio_real, duracao_real, status ENUM(concluida,falhou,pulou), observacao, created_at
- **LancamentoFinanceiro**: id, tipo ENUM(receita, despesa), categoria, valor, data, nota, planejado BOOLEAN, created_at
- **Investimento**: id, nome, principal, taxa_juros_ano, data_inicio, notas
- **Compromisso**: id, titulo, com_quem, data_hora, recorrencia_rule, preparacao JSON (checklist), lembretes JSON, status

### Assumptions

- Armazenamento local será um banco de dados on-device por padrão; abstração de repositório permitirá futura migração para backend.
- IA on-device é alvo para Fase 2; no MVP, o módulo Saúde oferece cálculos determinísticos (IMC/TMB) e respostas baseadas em regras locais.
- App será single-user por dispositivo (sem multiusuário) conforme requisito de privacidade.
- Notificações são usadas via APIs nativas do sistema operacional; o app deve lidar com permissão negada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuário consegue criar uma meta e registrar uma execução (iniciar + concluir) com sucesso — verificado por teste manual com 5 casos diferentes.
- **SC-002**: Notificações locais disparam no horário configurado e o alarme final respeita `horario_inicio_real + duracao` em ≥ 95% das execuções de teste (simulado em ambiente de teste).
- **SC-003**: Barra de progresso mensal reflete a média das semanas do mês com precisão ±1% comparada ao cálculo de referência (script de validação).
- **SC-004**: Chat Saúde (MVP sem LLM) calcula IMC/TMB corretamente a partir dos dados do perfil (fórmulas verificáveis) em 100% dos casos de teste.
- **SC-005**: Ao ultrapassar 90% do planejamento financeiro, o app exibe alerta visível e registrável pelo usuário em 100% dos casos de teste.
- **SC-006**: Backup export gera arquivo legível (JSON/SQLite) que pode ser importado novamente preservando as tabelas principais em pelo menos 95% dos campos.

---
