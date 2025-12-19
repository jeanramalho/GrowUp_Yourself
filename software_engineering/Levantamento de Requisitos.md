# Levantamento de Requisitos — App Gestão de Hábitos

**Projeto:** GrowUp Yourself

**Versão:** 1.0

**Data:** 18 de dezembro de 2025

**Autor:** Jean Ramalho

---

## 1. Visão Geral do Projeto

Aplicativo mobile nativo, focado em gestão de hábitos e desenvolvimento pessoal dividido em quatro pilares (espiritualidade, saúde, finanças e relacionamentos). O app funcionará preferencialmente offline, sem necessidade de login, com armazenamento local (SQLite ou alternativa recomendada). Deve ser responsivo para celulares e ter bom layout em tablets.

Objetivo principal: permitir que o usuário defina metas semanais em cada pilar, receba lembretes, registre cumprimentos e visualize um progresso mensal consolidado.

---

## 2. Público-alvo

* Usuários individuais que desejam organizar metas de desenvolvimento pessoal.
* Pessoas que valorizam privacidade e preferem armazenamento local (sem nuvem / sem login inicial).
* Usuários que buscam acompanhamento simples, com possibilidade de IA offline para apoio na área de saúde.

---

## 3. Resumo do Escopo (o que será entregue)

### Inclusões:

* Aplicativo mobile (React Native + Expo recomendado) com TabBar 4 pilares + Perfil.
* Armazenamento local com persistência (SQLite sugerido) e abstração de repositório para facilitar futura migração para backend.
* Implementação de notificações locais (lembranças, preparação de atividades, alertas de orçamento).
* Motor de regras para metas recorrentes e cálculo de progresso mensal.
* Módulo de IA offline (execute-torch-AI / on-device LLM) para o pilar Saúde: chat conversacional local que calcula IMC/TMB, interpreta exames (entrada manual) e ajuda a definir metas.
* Design UI/UX moderno e clean, paleta de tons azuis, suporte a tema claro/escuro.
* Protótipos iniciais no Google Stitch (assets e prompts para geração) e export para edição (Figma/HTML/CSS).

### Exclusões (fora do escopo inicial):

* Autenticação multiusuário/contas na nuvem (será prevista como futuro).
* Sincronização entre dispositivos.
* Integração com APIs financeiras externas (ex.: cotação, extratos bancários) — poderá ser adicionada mais tarde.

---

## 4. Requisitos Funcionais (RF)

### RF-01: Navegação principal

* O app terá um **TabBar** com 4 abas principais: Espiritualidade, Saúde, Finanças, Relacionamentos, e uma aba Perfil acessível pelo header/profile.
* O header será fixo e exibirá ícones dos 4 pilares com uma barra de progresso mensal para cada pilar.

### RF-02: Cadastro de metas (por pilar)

* O usuário poderá criar metas semanais para cada subtópico (ex.: leitura: 30 minutos, seg/qua/sex).
* Cada meta terá: título, descrição opcional, dias da semana, duração esperada (minutos), horário sugerido (start), notificação antes (minutos) e recorrência (se aplicável).
* Ao iniciar, o usuário registra o horário real de início (manual) — o alarme final deverá respeitar o tempo efetivamente iniciado (ex.: início 6:10 + duração 30 → alarme 6:40).

### RF-03: Marcação de conclusão

* O usuário poderá marcar execução/registro da atividade (concluída, falhou, pulou).
* Históricos diários e semanais serão gravados para cálculo de métricas.

### RF-04: Barra de progresso mensal (header)

* A barra de cada pilar será calculada mensalmente como média ponderada das metas semanais cumpridas durante o mês (detalhes do algoritmo na seção 7).

### RF-05: Notificações locais

* Notificações locais para lembretes de início, lembretes de preparação (2 e 1 dia antes quando configurado), e notificações de orçamento (próximo ao limite).
* O usuário poderá habilitar/desabilitar notificações por pilar.

### RF-06: Saúde — Chat com IA offline

* Módulo conversacional on-device que: calcula IMC, TMB, metas calóricas, sugere exercícios e analisa exames quando o usuário inserir dados relevantes.
* O chat poderá transformar declarações do usuário como “Cumpri a meta de hoje” em marcações automáticas.
* Todas as inferências e dados utilizados pelo modelo ficarão no dispositivo (privacidade).

### RF-07: Finanças

* Tela de planejamento mensal (valores alvo), tela de lançamentos reais, indicadores (saldo, percentual gasto), gráficos (mensais, categorias) e área de investimentos (entrada manual de aportes, taxas e rendimento calculado).
* Alertas quando o gasto corrente estiver perto de ultrapassar o planejamento.

### RF-08: Relacionamentos — Agenda com recorrência

* Cadastro de compromissos com campos: título, contatos (com quem), data/hora, recorrência, preparação (lista ou texto), lembretes (2 dias/1 dia/dia), marcar como concluído.

### RF-09: Perfil

* Cadastro local de dados: nome, foto, sexo (opcional), peso, altura, meta de peso.
* Perfil alimenta cálculos do módulo Saúde.

### RF-10: Export/Backup

* Exportação manual de backup em arquivo (JSON ou SQLite dump) localmente (ex.: exportar e salvar no device / compartilhar via apps). Import manual também suportado.

---

## 5. Requisitos Não-Funcionais (RNF)

* **RNF-01 — Privacidade:** Todos os dados ficam no dispositivo, sem envio a servidores externos por padrão.
* **RNF-02 — Performance:** Inicialização < 2s em aparelhos modernos; ações de leitura/escrita fluídas com uso de índices no banco.
* **RNF-03 — Espaço:** O app não deve exceder 200MB de espaço de instalação (estimativa inicial), com dados do usuário armazenados eficientemente.
* **RNF-04 — Offline-first:** Funcionalidades principais devem funcionar sem conexão.
* **RNF-05 — Acessibilidade:** Texto legível, contraste adequado, suportar leitor de tela e tamanhos de fonte dinâmicos.
* **RNF-06 — Segurança local:** Dados persistidos com permissões padrões do SO; recomenda-se encriptação de backups opcionais.

---

## 6. Regras de Negócio e Fluxos Importantes

### 6.1 Criação e execução de metas

* Metas são criadas com dias da semana e duração. Quando o usuário marca “iniciar”, o app grava o horário real de início e programa um alarme para (horário_real_inicio + duração).
* Se o usuário esquecer de marcar início, o app pode oferecer opção de marcar retroativamente (ex.: marcar como "Cumpri às 06:12").

### 6.2 Recorrência e semanas

* Metas são definidas por semana. Ao final de cada semana o app notifica para o usuário definir metas da próxima semana.
* Progresso mensal: a média das semanas concluídas no mês corrente.

### 6.3 Finanças — planejamento x real

* Quando gasto acumulado > 90% do planejamento, enviar alerta de atenção.
* Ao ultrapassar 100%, enviar alerta critico e sugestão de ajuste.

### 6.4 Privacidade e uso único do dispositivo

* O app não permitirá múltiplos perfis por design inicial; todos os dados assumem um único usuário por dispositivo.

---

## 7. Algoritmos de Metrificação (proposta)

### 7.1 Metrificação semanal (por meta)

* Para cada meta semanal definida com N dias ativos (ex.: seg/qua/sex → N=3):

  * Pontuação da semana = (dias cumpridos / N) * 100%

### 7.2 Metrificação mensal (por pilar)

* Para cada semana W no mês com pontuação p(W) (0..100):

  * Pontuação Mensal do Pilar = (Σ p(W) para todas as semanas completas/parciais do mês) / número de semanas consideradas
* Ex.: Se mês tem 4 semanas com pontuações [100, 75, 50, 100] → média = 81.25% → barra preenchida 81%.
* Observação: semanas parciais no começo/fim do mês serão consideradas proporcionalmente aos dias do mês que pertencem a cada semana.

### 7.3 Ponderação por importância (opcional)

* Cada meta pode ter peso (baixa/média/alta). Ex.: leitura pode ser peso 1, oração peso 2. Peso influencia cálculo da média ponderada no pilar.
* Implementar inicialmente sem pesos; adicionar como refinamento futuro.

---

## 8. Modelagem de Dados (proposta de esquemas)

### Tabelas sugeridas (SQLite)

* `user_profile` (id, nome, foto_path, sexo, peso, altura, meta_peso, updated_at)
* `pilar` (id, nome, icone, ordem)
* `meta` (id, pilar_id, titulo, descricao, dias_semana BITMASK, duracao_minutos, horario_sugerido, notificacao_minutos_antes, recorrente BOOLEAN, peso INTEGER, created_at, updated_at)
* `execucao` (id, meta_id, data, horario_inicio_real, duracao_real, status ENUM[concluida, falhou, pulou], observacao, created_at)
* `lancamento_financeiro` (id, tipo ENUM[receita, despesa], categoria, valor, data, nota, planejado BOOLEAN, created_at)
* `investimento` (id, nome, principal, taxa_juros_ano, data_inicio, correcoes, notas)
* `compromisso` (id, titulo, com_quem, data_hora, recorrencia_rule, preparacao_text, lembretes JSON, status)
* `audit_log` (id, entidade, acao, payload JSON, created_at)

---

## 9. UI / UX — Diretrizes e Layouts

### Paleta e temas

* Tom base: gama de tons de azul (variações para estado primário, secundário, superfície). Fundo: tema claro (branco) e tema escuro com fundo escuro.
* Espaçamento: sistema de 4/8/16pt.
* Tipografia: família sans-serif moderna (ex.: Inter ou Google Sans). Tamanhos: 20/16/14/12 para hierarquia.

### Componentes principais

* **Header fixo:** ícones dos 4 pilares + barra de progresso mensal por ícone (mínimo altura 56dp).
* **TabBar:** ícones + rótulos curtos.
* **Cards de metas:** título, dias da semana (chips), progresso da meta, botão iniciar/marcar.
* **Chat Saúde:** bolhas de conversa, quick-actions (botões) para marcar meta como cumprida.
* **Tela Finanças:** gráficos simples (pizza/linha) com seleção de período e filtros por categoria.

### Acessibilidade

* Contraste AA mínimo, texto respeitando tamanho dinâmico, targets de toque ≥ 44px.

### Microcopy

* Linguagem simples, tom encorajador e neutro. Evitar referências explícitas a instituições religiosas — a inspiração dos 8 remédios é sutil e implementada sem menção direta.

---

## 10. Wireframes & Google Stitch — Prompt inicial sugerido

*Observação:* utilizar Google Stitch para gerar telas iniciais. Sugestão de prompt para Stitch (em inglês ou português, dependendo da ferramenta):

> "Create a clean mobile UI for a habit-management app named 'GrowUp Yourself'. Primary palette: blues. Main navigation: bottom tab bar with 4 pillars: Spirituality, Health, Finance, Relationships. A fixed header shows small icons for each pillar with individual monthly progress bars under each icon. Design modern, minimal, accessible. Provide screens: Home header + overview, Spirituality - create/read meta screen, Health - chat screen, Finance - planning vs actual with charts, Relationships - agenda/recurring event. Provide light and dark theme variations and export-ready assets."

Também sugerir variações: compact (one-column) e tablet (two-column) layouts.

---

## 11. Integração de IA (Saúde) — Considerações técnicas

* **Abordagem:** IA on-device usando execute-torch-AI / quantized LLMs (inferência local). Modelo leve (ex.: quantized Llama-like or smaller) ou modelos específicos otimizados para mobile.
* **Uso:** chat conversacional para orientação geral e processamento de entrada de exames simples. Não é substituto de profissional — o app exibirá disclaimer recomendando procurar médico quando detectar sinais de risco.
* **Dados do usuário:** modelos e caches devem operar com dados locais; decisões sensíveis (ex.: indicação de procurar médico) devem gerar mensagens claras.
* **Performance:** avaliar uso de quantização (int8/int4), offloading para CPU/GPU disponível e limites de memória; oferecer fallback quando o dispositivo não suportar modelo local (opção de desabilitar IA).
* **Privacidade e ética:** nenhuma informação do usuário será enviada externamente sem consentimento explícito (configuração futura).

---

## 12. Escalabilidade e roadmap técnico

### Fase 1 (MVP):

* Implementação offline com TabBar, CRUD de metas, notificações locais, cálculo de progresso, módulo Saúde com regras básicas (cálculo IMC/TMB sem LLM) para reduzir requisitos iniciais.
* Protótipos e estilos no Google Stitch.

### Fase 2:

* Integrar LLM on-device para chat de saúde (execute-torch-AI) e melhorar conversacionalidade.
* Módulo de investimentos básico (rendimento com taxa fixa).

### Fase 3 (opcional/futuro):

* Login e sincronização cloud (opção), multiusuário, integração com APIs externas (bancos, wearables), backup automático na nuvem.

---

## 13. Riscos e Mitigações

* **IA on-device exige recursos do dispositivo** — Mitigação: implementar fallback com funcionalidade reduzida (ex.: regras estáticas) e opção de desabilitar IA.
* **Usuário perde dados (aparelho perdido/formatado)** — Mitigação: export manual/import e opção de backup criptografado na nuvem (release futura).
* **Complexidade de metragens e UX confusa** — Mitigação: testes de usabilidade com protótipos em Stitch, iterar microcopy e fluxos.

---

## 14. Critérios de Aceitação (exemplos)

* Usuário cria uma meta semanal e marca execução; histórico mostra registro correto com horário real.
* Notificação local dispara no horário configurado e, se o usuário inicia mais tarde, o alarme final respeita horário de início real.
* Barra de progresso no header reflete média mensal correta com precisão ±1%.
* Chat Saúde calcula IMC/TMB corretamente a partir de peso/altura do perfil.
* Backup export gera arquivo JSON/SQLite que pode ser importado novamente.

---

## 15. Entregáveis e próximos passos imediatos

1. Documento de requisitos (este documento).
2. Biblioteca de componentes/Design Tokens (cores, tipografia, espaçamentos) — exportável para Stitch e Figma.
3. Protótipos iniciais no Google Stitch para as telas principais (Home, Espiritualidade - criar meta, Saúde - chat, Finanças - dashboard, Relacionamentos - agenda, Perfil).
4. Estrutura do projeto React Native + Expo com arquitetura limpa: apresentação (UI), domínio (regras), dados (repositório SQLite), services (notifications, ai, backup).

---

## 16. Observações finais

* O app foi planejado para ser simples de usar e priorizar privacidade. A arquitetura proposta facilita migração para recursos online futuramente.
* O nome provisório é **GrowUp Yourself** — variáveis globais para tema/nome devem ser usadas para fácil alteração.


