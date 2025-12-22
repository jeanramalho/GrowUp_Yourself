Você é um designer de UI/UX profissional. Crie um layout completo e protótipo de alta-fidelidade para um aplicativo mobile nativo chamado **"GrowUp Yourself"** — um app de gestão de hábitos focado em desenvolvimento pessoal, dividido em 4 pilares: **Espiritualidade, Saúde, Finanças, Relacionamentos**. O design deve ser moderno, clean, humanizado e acessível. Evite qualquer referência explícita a instituições religiosas mesmo que o conteúdo se inspire em práticas tradicionais. O design e microcopy devem parecer autoria humana — atribua autoria como **Jean Ramalho** nos metadados/rodapé de design.

**Objetivos do protótipo**
- Mostrar fluxo principal de uso: visão geral (header fixo com progresso), criação de metas semanais, execução (start/mark), chat de saúde com IA (quick-actions), dashboard financeiro com gráficos, agenda de relacionamentos com recorrência, e perfil do usuário.
- Entregar screens para smartphone (375–390pt largura) e tablet (768pt largura). Fornecer variação light/dark.
- Exportar assets (SVG ícones, PNG de telas) e design tokens (cores, tipografia, espaçamentos) em JSON prontos para uso em React Native + Expo.

**Paleta e tokens iniciais (use estes como base, gere variações harmoniosas):**
- Primary Blue 1: `#0A6CF0`
- Primary Blue 2: `#2B8AF7`
- Navy (escuro): `#0B3D91`
- Surface Light: `#FFFFFF`
- Surface Dark: `#0A0F1A`
- Neutral Gray 1: `#F3F6FA`
- Neutral Gray 2: `#A9B3C7`
- Alert / Critical: `#E24B4B` (uso pontual)
- Success: `#2ECC71` (uso pontual)
- **Obs:** priorize tons de azul; prefira manter paleta monocromática com contrastes adequados.

**Tipografia**
- Família: Inter (ou Google Sans).  
- Hierarquia: H1 22–24pt, H2 18–20pt, Body 16pt, Small 12–14pt.  
- Peso: Regular 400, Medium 500, Bold 700.

**Grid & espaçamentos**
- Grid base: 4pt scale → espaçamentos: 4 / 8 / 12 / 16 / 20 / 24 / 32.  
- Touch targets ≥ 44px.

**Animações & micro-interações**
- Micro-interações suaves (150–250ms) para botões, toggles, e barra de progresso.  
- Interação do header: ao tocar no ícone de um pilar, mostrar tooltip com resumo do progresso mensal.  
- Ao marcar “iniciar” uma meta, animação de contagem regressiva suave e transição para o estado ativo.

**Header fixo (essencial)**
- Altura mínima 56dp.  
- Contém 4 ícones pequenos (um por pilar) alinhados horizontalmente.  
- Cada ícone tem uma **mini barra de progresso mensal** abaixo, preenchida % conforme média mensal do pilar.  
- No canto direito do header pequeno avatar que abre Perfil/Config. Header é fixo em todas as telas principais.

**TabBar (rodapé)**
- 4 tabs: Espiritualidade, Saúde, Finanças, Relacionamentos. Ícones + rótulos curtos.
- Tab selecionada com indicador e micro-sombra.

**Telas / fluxos a criar (entregáveis)**
1. **Home / Overview**
   - Header fixo com os 4 ícones + progresso.
   - Card resumo com "Hoje" — cartões de metas ativas por pilar (cada card: título meta, dias, tempo restante, botão iniciar/marcar).
   - CTA flutuante para “Nova Meta”.
   - Empty state elegante para usuário sem metas (ilustração minimal).

2. **Espiritualidade — Lista de Metas**
   - Tela de listar metas por subtópicos (Leitura, Oração/Meditação, Vida em Comunidade, Serviço Voluntário).
   - Botão de criar meta → modal/form.
   - Formulário criar meta: título, descrição, dias da semana (chips), duração (minutos), horário sugerido, notificação X minutos antes, campo opção para descrição detalhada (livro/atividade), peso (opcional).
   - Estado de meta ativa com botão “Iniciar”. Ao iniciar, gravar horário real de início; alarme final deve ser `horário_real_inicio + duração`.
   - State: "Ativa", "Pausada", "Concluída". Mostrar histórico rápido semanal.

3. **Fluxo: Criar / Editar Meta**
   - Modal ou tela full. Mostrar validações, labels claras e microcopy encorajadora.
   - Exemplo de microcopy em PT-BR:  
     - Placeholder título: "Ex.: Leitura — Salmo 23"  
     - Ajuda: "Defina dias e duração. Você receberá um lembrete antes do início."  
     - Botão salvar: "Salvar Meta"

4. **Espiritualidade — Meta em Execução**
   - Tela com timer em contagem (baseado no início real), botão para marcar conclusão, botão para registrar observação.  
   - Ao iniciar fora do horário sugerido, mostrar microcopy: "Você começou às 06:10 — o alarme final será às 06:40."  
   - Ações rápidas: marcar como concluída, pausar, registrar retroativo.

5. **Saúde — Chat com IA (on-device)**
   - Layout de chat conversacional com bolhas. No topo, resumo do perfil (peso, altura, IMC rápido).  
   - Quick-actions (botões) sugeridos pela IA: "Registar exercício de hoje", "Adicione exame", "Marcar meta como cumprida".  
   - Tela de input para upload manual de exames (campo texto/valores) — mostrar how-to minimal.  
   - State: resposta do sistema com cards de ações (ex.: cálculo IMC/TMB), e CTA para marcar meta como cumprida diretamente da resposta.  
   - Incluir disclaimer claro: "Este recurso oferece sugestões — não substitui avaliação médica."

6. **Finanças — Dashboard**
   - Cards: Planejamento mensal (meta), Gasto atual, Percentual usado.  
   - Gráficos: linha de gastos por dia (mês), pizza por categoria.  
   - Tela de lançamentos: formulário rápido para lançar despesa/receita (categoria, valor, data, nota, marcar como planejado/real).  
   - Estado de alerta: quando gasto > 90% do planejamento; mostrar banner com sugestão de ajuste.

7. **Relacionamentos — Agenda**
   - Calendário / lista com compromissos recorrentes.  
   - Tela de cadastro de compromisso: título, com quem, data/hora, recorrência (ex.: toda quinta), preparação (checklist), lembretes (2 dias, 1 dia, no dia).  
   - Ao visualizar compromisso recorrentemente, mostrar toggle para editar apenas uma ocorrência ou toda série.

8. **Perfil**
   - Campos locais: nome, foto, sexo (opcional), peso, altura, meta de peso, preferências (notificações por pilar ON/OFF), tema (claro/escuro).  
   - Botão exportar/importar backup (JSON/SQLite) — UI para exportar arquivo localmente.

9. **Configurações / Sobre**
   - Informação sobre privacidade: todos os dados ficam no dispositivo.  
   - Dados do autor do app: "Design e autoria: Jean Ramalho" (incluir como metadado/rodapé do protótipo).

**Estados adicionais a gerar**
- Empty states (sem metas, sem lançamentos, sem histórico).
- Error states (falha ao salvar, permissão de notificações negada).
- Onboarding curto (opcional) com 3 telas: objetivo do app, como funciona a medição mensal, privacidade local.

**Requisitos de acessibilidade**
- Contraste mínimo AA.  
- Texto escalável.  
- Fornecer labels para leitores de tela.  
- Botões com área de toque adequada.

**Microcopy — exemplos (português)**
- CTA iniciar: "Iniciar sessão"
- Notificação lembrete: "Lembrete: leitura às 06:00 (30 min) — Comece agora?"
- Confirmação: "Meta salva com sucesso."
- Aviso médico: "Se detectar sintomas graves, procure atendimento médico."

**Mock data (para popular o protótipo automaticamente)**
- Usuário: Jean (foto avatar), peso 78kg, altura 1.78m, meta 75kg.
- Exemplo de metas:
  - Leitura: seg/qua/sex — 30min — 06:00
  - Oração: diário — 10min — 07:00
  - Treino: seg/qua/sex — 40min — 19:00
- Finanças: planejamento 3000 BRL, gastos atuais 2750 BRL (91%).

**Export & Entregáveis (peça ao Stitch)**
- Versões light + dark para smartphone (iPhone/Android) e tablet.
- Arquivos: Figma/HTML export ou design tokens JSON (colors, typography, spacing), SVG icons, PNGs de telas.
- Fornecer nome de componentes (naming convention) e classe sugerida para React Native:
  - `HeaderProgress`, `MetaCard`, `HealthChatBubble`, `FinanceChart`, `AgendaItem`, `ProfileCard`.
- Gerar um arquivo `design-tokens.json` com cores hex, tipografia e espaçamentos.
- Gerar um pacote ZIP com assets e um README com instruções de uso e créditos (incluir "Design por Jean Ramalho").

**Observações finais**
- Produza variações de layout: compact (telhas pequenas) e extendida (telas com mais informação).  
- Entregar protótipo com fluxo clicável das ações mais importantes: criar meta → iniciar → marcar concluído; chat saúde → marcar meta; finanças → lançar despesa e ver alerta.  
- Todos os textos e labels devem estar em **Português (pt-BR)**.  
- Não mencionar origem religiosa do conteúdo — tratar como prática de bem-estar discreta.

Obrigado. Gere as telas solicitadas, assets e o pacote de design tokens pronto para exportar ao time de desenvolvimento (React Native + Expo).
