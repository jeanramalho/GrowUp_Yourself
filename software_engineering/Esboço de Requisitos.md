# Projeto App Gestão de Hábitos

Tipo do projeto: Aplicativo Mobile nativo.

Tecnlogias utilizadas: React Native, Expo, Armazenamento Local, pode usar bibliotecas de terceiros, pode usar bibliotecas de ícones de terceiros, execute-torch-AI: On-device & LLM.

Responsividade: O Aplicativo deve funcionar bem em celulares primariamente, mas também deve ter um bom layout em tablets.

Banco de dados: O armazenamento será local, persistencia local e no dispositivo.

Aplicativo Sem login

O aplicativo vai ser em menu tabbar com os pilares de desenvolvimento pessoal, em cada tabbar será apresentado as funcionalidades daquela area, e no header teremos a barra de progresso dos 4 pilares sendo apresentados como area comum comum em todos os pilares.

TabBar 1  Espiritualidade.
Subtópicos:
Leitura
Oração/meditação
Vida em comunidade/igreja
Serviço voluntário

Tabbar 2 Saúde
Subtópicos:
8 remédios naturais (IASD)
Exames (acompanhamento semestral, comparativo, avaliação física), 
Acompanhamento de peso e avaliação física

TabBar 3 Finanças
Subtopicos:
Planilha de gastos/ gastos reais 
Planilha de orçamento/Planejamento
Planilha de investimentos
Planilha de doação

TabBar 4 Relacionamentos
Subtópicos:
Família
Amigos
Trabalho

Cores: Paleta de Tons de azuis o fundo pode ser branco ou escuro de acordo com o tema escolhido pelo usuário

Armazenamento: Local, sem login, somente uma pessoa poderá utilizar o app no dispositivo, não será permitido dados de dois usuários.

Design: Moderno, clean, bonito buscando exemplos de apps semelhantes

Objetivo do aplicativo: O objetivo do app é criar uma aplicação que ajude a pessoa a se desenvolver pessoalmente. Nos princípios físicos, mentais e espirituais utilizando 4 pilares que serão as abas do app (Espiritualidade, Saúde, Finanças, Relacionamentos). Cada aba do menu tabbar será como um aplicativo em sí própria, fornecendo informações e funções específicas do objetivo da aba selecionada.

Header: O header será um elemento que todas as abas do menu tabBar terão em comum, ele não sairá em nenhuma movimentação do app. Mas será um header simples que apresentará o símbolo de todas as abas do menu tabmar, e uma pequena barra de progresso abaixo do ícone que mostrará o quanto o usuário tem alcançado. Essa barra de progresso será metrificada mensalmente e terá a forma de metrificar diferente em cada pilar ou seja em cada ícone do header.

## Abas

### Espiritualidade

Nessa aba o aplicativo apresentará para o usuário os tópicos: Leitura, Oração/Meditação, Vida em Comunidade/Igreja, Serviço Voluntário. E o usuário escolherá metas pra atuar em cada área dos tópicos. Por exemplo: No tópico leitura, o usuário escolherá quanto tempo ele lerá por dia, quais os dias ele lerá, e o aplicativo irá criar um sistema de acompanhamento para aquela meta, com notificação de lembrete alguns minutos antes, e uma marcação para o usuário marcar a hora que ele iniciou a leitura e um alarme que tocará ao final do tempo que o usuário escolheu, por exemplo, se o usuário escolheu 30 minutos de leitura e que ele irá começar as 6h da manha, e por algum motivo o usuário atrasa e começa as 6:10 da manhã e marca no app que começou nesse horário o alarme de final da leitura que tocaria 6:30 da manhã normalmente vai tocar as 6:40 da manhã. E de acordo com o que o usuário escolheu o aplicativo vai preenchendo as metas. Se ele escolheu ler segunda, quarta e sexta, e ele marcou direitinho no app que ele leu todos esse dias, ele vai estar 100% da meta na semana. Da mesma forma vai acontecer com a oração/meditação, e os outros, essa parte do app será um aplicativo de gestão de habitos, onde o usuário separará tempo e dias para atuar nessas áreas da vida e o app o lembrará e o acompanhará. E o usuário poderá descrever qual atividade fará, qual livro irá ler, qual serviço voluntário fará e onde, ele poderá descrever todas as tarefas que ele fará. A metas serão definidas toda semana, e ao final de cada semana o app lembrará o usuário para cadastrar novas metas. Porém a metrificação para a barra de progresso será contada por mês, que analisará quais as porcentagens da metas o usuário cumpriu durante as semanas do mes corrente e fará uma média que será refletida na barra de progresso. Tudo será salvo dentro de um banco de dados offline do dispositivo, pode ser SQLIte ou outro melhor sugerido.

### Saúde

Nessa aba, o pilar de saúde acompanhará a saúde do usuário, incentivando o usuário com hábitos que melhorarão sua saúde, hábitos que serão baseados mas não nomeados nos 8 remédios naturais que são pregados pela igreja adventista do sétimo dia, mas não serão citados nem citado nome da igreja no app, apenas serão baseados discretamente. Nessa parte do app, usaremos IA nativa e offline do react native ou execute-torch-AI, essa parte será como um chat, que realizará as perguntas necessárias pra acompanhamento e dicas para o usuário. A IA do app realizará os cálculos de IMC, TMB, pra saber o peso ideal, meta de calorias, dica de dieta, consumo de calorias, exercícios físicos, e tudo que um nutri e personal faria, o chat também terá a opção do usuário colocar exames pra que a IA possa ler e passar um resumo dos resultados, falando o que precisa melhorar, indicar procurar um médico caso necessário. O usuário poderá colocar meta de perda ou ganhou de peso, realização de exercícios, ou qualquer tipo de meta com relação a saúde pelo chat com a IA, que perguntará toda semana quais são as metas da semana, e a medida que for cumprindo o usuário vai falar no chat - “Cumpri hoje a meta de exercícios” - por exemplo o chat vai marcar como cumprida a meta do dia, e ao adicionar uma meta no chat, também poderá ser incluído notificação de lembrete da atividade no dispositivo automáticamente. A metrificação será realizada de acordo com as metas escolhidas e cumpridas, a barra de progresso será preenchida de acordo com as metas cumpridas no mes, e as metas serão estipuladas a cada semana. Tudo isso será salvo em um banco de dados offline no dispositivo do qual a IA se alimentará, pode ser SQLite ou outro melhor sugerido.

### Finanças

Nessa aba, teremos um app de gestão de controle financeiro completo, com gráficos e tudo mais. Teremos a área de planejamentos, onde o usuário colocará o ideal que ele tem para o mês em questão, a outra área é onde ele vai lançar as moviemntações reais do mês, sempre visando o planejamento feito, e quando ele ultrapassar ou estiver prestes a ultrapassar o planejamento feito, uma mensagem será enviada. A 3 área do app será a de investimentos, onde o usuário colocará os dados de algum investimento que fez, com as taxas de juros e correções, tudo direitinho e o app mostrará em tempo real o redimento do investimento do usuário. A metrificação de objetivos para a aba de finanças será se ele estiver vivendo de acordo ao planejamento mensal dele.

### Relacionamentos

Nessa aba, teremos algo parecido com uma agenda normal, porém com metas a serem cumpridas, por exemplo: O usuário vai marcar que todas as quintas feiras fará algo com a esposa, com os filhos ou com a família toda, esse compromisso aparecerá na agenda visível no app e também terá lembretes que serão em forma de notificações 2 e 1 dia antes além do lembrete no dia escolhido. Ou seja nessa aba o usuário poderá colocar metas que o ajudarão a melhorar o relacionamento dele com a família, amigos, igreja, comunidade durante todo o mês. No cadastro da atividade terão campos para ele preencher, como nome da atividade, com quem será a atividade, qual o dia e horário, e se será recorrente, caso seja recorrente, por exemplo toda quinta feira do mês, essa atividade deverá aparecer pra ele em todas as quintas feiras do mês, também deverá ter o campo preparação com o que o usuário precisará comprar ou organizar para atividade, e no dia da atividade, o usuário poderá marcar a atividade como conclúida se ele realmente a realizou. A metrificação será realizada de acordo ao cumprimento das metas que o usuário criou.

### Perfil

Essa será uma aba adicional além dos 4 pilares, mas não entrará nos pilares e nem será metrificada e também aparecerá no header, será a aba de perfil do usuário onde ele poderá colocar os dados dele, nome, foto, sexo, peso, altura, meta de peso, e o app se alimentará desses dados também.

## Escalabilidade

O App deverá ter facilidade para escalabilidade, como pra criar conta de usuário, trabalhar online, e como ainda não temos um nome e cores definidas diretamente, tudo deve ser fácil de mudar, em variáveis que muda tudo no app somente ao mudar a variável. A princípio o nome do app será "GrowUp Yourself" as cores serão as cores já descritas no campo cores do documento.