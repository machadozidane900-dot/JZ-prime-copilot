/* =========================================================
   JZ PRIME COPILOT
   DASHBOARD.JS
   VERSÃO LOCAL — SEM API
========================================================= */

let empresa = {};

let faturamentoChart = null;
let clientesChart = null;
let metaChart = null;


/* =========================================================
   CARREGAR DADOS DA EMPRESA
========================================================= */

function carregarEmpresa() {

  try {

    const dados = localStorage.getItem("empresa");

    if (dados) {
      empresa = JSON.parse(dados);
    } else {
      empresa = {};
    }

  } catch (error) {

    console.error(
      "Erro ao carregar dados da empresa:",
      error
    );

    empresa = {};
  }

  return empresa;
}


/* =========================================================
   FORMATADORES
========================================================= */

function formatarMoeda(valor) {

  const numero = Number(valor) || 0;

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


function formatarNumero(valor) {

  return (
    Number(valor) || 0
  ).toLocaleString("pt-BR");

}


/* =========================================================
   ATUALIZAR DASHBOARD
========================================================= */

function atualizarDashboard() {

  carregarEmpresa();

  const faturamento =
    Number(empresa.faturamento) || 0;

  const clientes =
    Number(empresa.clientes) || 0;

  const meta =
    Number(empresa.meta) || 0;

  const oportunidades =
    Number(empresa.oportunidades) ||
    Math.max(
      3,
      Math.round(clientes * 0.08)
    );


  /* FATURAMENTO */

  const faturamentoCard =
    document.getElementById(
      "faturamentoCard"
    );

  if (faturamentoCard) {

    faturamentoCard.textContent =
      formatarMoeda(faturamento);

  }


  /* CLIENTES */

  const clientesCard =
    document.getElementById(
      "clientesCard"
    );

  if (clientesCard) {

    clientesCard.textContent =
      formatarNumero(clientes);

  }


  /* OPORTUNIDADES */

  const oportunidadesCard =
    document.getElementById(
      "oportunidadesCard"
    );

  if (oportunidadesCard) {

    oportunidadesCard.textContent =
      formatarNumero(oportunidades);

  }


  /* FATURAMENTO PARA META */

  const metaFaturamento =
    document.getElementById(
      "metaFaturamento"
    );

  if (metaFaturamento) {

    metaFaturamento.textContent =
      formatarMoeda(faturamento);

  }


  /* EMPRESA */

  const nomeEmpresa =
    empresa.empresa ||
    "Minha empresa";

  document
    .querySelectorAll("[data-empresa]")
    .forEach(elemento => {

      elemento.textContent =
        nomeEmpresa;

    });


  /* RESPONSÁVEL */

  document
    .querySelectorAll("[data-responsavel]")
    .forEach(elemento => {

      elemento.textContent =
        empresa.responsavel || "";

    });


  /* SEGMENTO */

  document
    .querySelectorAll("[data-segmento]")
    .forEach(elemento => {

      elemento.textContent =
        empresa.segmento || "";

    });


  /* META */

  document
    .querySelectorAll("[data-meta]")
    .forEach(elemento => {

      elemento.textContent =
        formatarMoeda(meta);

    });


  /* OBJETIVO */

  const objetivo =
    empresa.objetivo ||
    "Aumentar vendas";

  document
    .querySelectorAll("[data-objetivo]")
    .forEach(elemento => {

      elemento.textContent =
        objetivo;

    });


  /* PROGRESSO */

  let percentualMeta = 0;

  if (meta > 0) {

    percentualMeta =
      Math.round(
        (faturamento / meta) * 100
      );

    percentualMeta =
      Math.min(
        100,
        Math.max(
          0,
          percentualMeta
        )
      );

  }


  document
    .querySelectorAll("[data-progresso]")
    .forEach(elemento => {

      elemento.textContent =
        percentualMeta + "%";

    });


  document
    .querySelectorAll("[data-progresso-bar]")
    .forEach(barra => {

      barra.style.width =
        percentualMeta + "%";

    });


  atualizarTextoPainel();

}


/* =========================================================
   TEXTO DO PAINEL
========================================================= */

function atualizarTextoPainel() {

  const saudacao =
    document.getElementById(
      "saudacao"
    );

  const descricao =
    document.getElementById(
      "descricaoPainel"
    );

  const nome =
    empresa.responsavel ||
    empresa.empresa ||
    "";


  if (saudacao) {

    if (nome) {

      saudacao.textContent =
        "Visão geral, " + nome;

    } else {

      saudacao.textContent =
        "Visão geral";

    }

  }


  if (descricao) {

    if (empresa.empresa) {

      descricao.textContent =
        "Controle, análise e estratégia para " +
        empresa.empresa +
        ".";

    } else {

      descricao.textContent =
        "Controle, análise e estratégia em um só lugar.";

    }

  }

}


/* =========================================================
   NOTIFICAÇÃO
========================================================= */

function notifyUser(mensagem) {

  let notification =
    document.getElementById(
      "jzNotification"
    );


  if (!notification) {

    notification =
      document.createElement("div");

    notification.id =
      "jzNotification";

    notification.style.position =
      "fixed";

    notification.style.right =
      "24px";

    notification.style.bottom =
      "24px";

    notification.style.zIndex =
      "9999";

    notification.style.padding =
      "14px 18px";

    notification.style.borderRadius =
      "10px";

    notification.style.background =
      "#0e2119";

    notification.style.border =
      "1px solid #35d99b";

    notification.style.color =
      "#f5faf7";

    notification.style.fontSize =
      "13px";

    notification.style.boxShadow =
      "0 20px 60px rgba(0,0,0,.45)";

    notification.style.transition =
      "opacity .25s ease";

    document.body.appendChild(
      notification
    );

  }


  notification.textContent =
    mensagem;

  notification.style.opacity =
    "1";


  clearTimeout(
    notification._timer
  );


  notification._timer =
    setTimeout(
      () => {

        notification.style.opacity =
          "0";

      },
      2800
    );

}


/* =========================================================
   GRÁFICO DE FATURAMENTO
========================================================= */

function criarGraficoFaturamento() {

  const canvas =
    document.getElementById(
      "faturamentoChart"
    );


  if (!canvas) {
    return;
  }


  if (typeof Chart === "undefined") {
    return;
  }


  if (faturamentoChart) {
    faturamentoChart.destroy();
  }


  const faturamento =
    Number(empresa.faturamento) || 0;


  const valores = [

    faturamento * 0.58,
    faturamento * 0.64,
    faturamento * 0.71,
    faturamento * 0.78,
    faturamento * 0.88,
    faturamento

  ];


  faturamentoChart =
    new Chart(
      canvas,
      {

        type: "bar",

        data: {

          labels: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun"
          ],

          datasets: [

            {

              label:
                "Faturamento",

              data:
                valores,

              backgroundColor:
                "#35d99b",

              borderRadius:
                7,

              borderSkipped:
                false

            }

          ]

        },


        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              display: false
            },

            tooltip: {

              callbacks: {

                label:
                  function(context) {

                    return (
                      " " +
                      formatarMoeda(
                        context.raw
                      )
                    );

                  }

              }

            }

          },


          scales: {

            y: {

              beginAtZero: true,

              ticks: {

                color:
                  "#71857c",

                callback:
                  function(value) {

                    return formatarMoeda(
                      value
                    );

                  }

              },

              grid: {

                color:
                  "rgba(255,255,255,.05)"

              }

            },


            x: {

              ticks: {

                color:
                  "#71857c"

              },

              grid: {
                display: false
              }

            }

          }

        }

      }
    );

}


/* =========================================================
   GRÁFICO DE CLIENTES
========================================================= */

function criarGraficoClientes() {

  const canvas =
    document.getElementById(
      "clientesChart"
    );


  if (!canvas) {
    return;
  }


  if (typeof Chart === "undefined") {
    return;
  }


  if (clientesChart) {
    clientesChart.destroy();
  }


  const clientes =
    Number(empresa.clientes) || 0;


  const dados = [

    Math.max(
      1,
      Math.round(clientes * 0.52)
    ),

    Math.max(
      1,
      Math.round(clientes * 0.61)
    ),

    Math.max(
      1,
      Math.round(clientes * 0.70)
    ),

    Math.max(
      1,
      Math.round(clientes * 0.79)
    ),

    Math.max(
      1,
      Math.round(clientes * 0.90)
    ),

    clientes

  ];


  clientesChart =
    new Chart(
      canvas,
      {

        type: "line",

        data: {

          labels: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun"
          ],

          datasets: [

            {

              label:
                "Clientes",

              data:
                dados,

              borderColor:
                "#35d99b",

              backgroundColor:
                "rgba(53,217,155,.12)",

              borderWidth:
                3,

              fill:
                true,

              tension:
                .35,

              pointRadius:
                4

            }

          ]

        },


        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              display: false
            }

          },


          scales: {

            y: {

              beginAtZero: true,

              ticks: {

                color:
                  "#71857c"

              },

              grid: {

                color:
                  "rgba(255,255,255,.05)"

              }

            },


            x: {

              ticks: {

                color:
                  "#71857c"

              },

              grid: {
                display: false
              }

            }

          }

        }

      }
    );

}


/* =========================================================
   GRÁFICO DA META
========================================================= */

function criarGraficoMeta() {

  const canvas =
    document.getElementById(
      "metaChart"
    );


  if (!canvas) {
    return;
  }


  if (typeof Chart === "undefined") {
    return;
  }


  if (metaChart) {
    metaChart.destroy();
  }


  const faturamento =
    Number(empresa.faturamento) || 0;

  const meta =
    Number(empresa.meta) || 0;


  if (meta <= 0) {

    metaChart =
      new Chart(
        canvas,
        {

          type: "doughnut",

          data: {

            labels: [
              "Sem meta"
            ],

            datasets: [

              {

                data: [
                  1
                ],

                backgroundColor: [
                  "#173128"
                ],

                borderWidth: 0

              }

            ]

          },


          options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "72%",

            plugins: {

              legend: {
                display: false
              }

            }

          }

        }
      );

    return;

  }


  const realizado =
    Math.min(
      faturamento,
      meta
    );


  const restante =
    Math.max(
      meta - faturamento,
      0
    );


  metaChart =
    new Chart(
      canvas,
      {

        type: "doughnut",

        data: {

          labels: [
            "Realizado",
            "Restante"
          ],

          datasets: [

            {

              data: [
                realizado,
                restante
              ],

              backgroundColor: [
                "#35d99b",
                "#173128"
              ],

              borderWidth: 0

            }

          ]

        },


        options: {

          responsive: true,

          maintainAspectRatio: false,

          cutout: "72%",

          plugins: {

            legend: {
              display: false
            }

          }

        }

      }
    );

}


/* =========================================================
   CRIAR GRÁFICOS
========================================================= */

function criarGraficos() {

  carregarEmpresa();

  criarGraficoFaturamento();

  criarGraficoClientes();

  criarGraficoMeta();

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(texto) {

  const div =
    document.createElement("div");

  div.textContent =
    texto;

  return div.innerHTML;

}


/* =========================================================
   ADICIONAR MENSAGEM
========================================================= */

function adicionarMensagem(
  texto,
  tipo
) {

  const chatBox =
    document.getElementById(
      "chatBox"
    );


  if (!chatBox) {
    return;
  }


  const mensagem =
    document.createElement("div");


  mensagem.className =
    "message " + tipo;


  if (tipo === "user") {

    mensagem.innerHTML = `

      <div class="message-content">

        <strong>
          Você
        </strong>

        <p>
          ${escaparHTML(texto)}
        </p>

      </div>

    `;

  } else {

    mensagem.innerHTML = `

      <div class="avatar">
        ✦
      </div>

      <div class="message-content">

        <strong>
          JZ Prime Copilot
        </strong>

        <p>
          ${escaparHTML(texto).replace(/\n/g, "<br>")}
        </p>

      </div>

    `;

  }


  chatBox.appendChild(
    mensagem
  );


  chatBox.scrollTop =
    chatBox.scrollHeight;

}


/* =========================================================
   PERGUNTAS RÁPIDAS
========================================================= */

function askCopilot(pergunta) {

  const input =
    document.getElementById(
      "copilotInput"
    );


  if (!input) {
    return;
  }


  input.value =
    pergunta;


  sendCopilot();

}


/* =========================================================
   ENTER
========================================================= */

function handleEnter(event) {

  if (
    event.key === "Enter"
  ) {

    event.preventDefault();

    sendCopilot();

  }

}


/* =========================================================
   COPILOT LOCAL
========================================================= */

function gerarRespostaLocal(pergunta) {

  carregarEmpresa();


  const texto =
    pergunta
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");


  const faturamento =
    Number(empresa.faturamento) || 0;

  const clientes =
    Number(empresa.clientes) || 0;

  const metaCadastrada =
    Number(empresa.meta) || 0;

  const objetivo =
    empresa.objetivo ||
    "Aumentar vendas";


  const ticketMedio =
    clientes > 0
      ? faturamento / clientes
      : 0;


  /* =====================================================
     DETECTAR META INFORMADA NA PERGUNTA
  ===================================================== */

  let metaPergunta =
    null;


  const valores =
    texto.match(
      /(?:r\$|rs|reais)?\s*([\d.,]+)\s*(?:mil|k)?/gi
    );


  if (valores && valores.length > 0) {

    const ultimo =
      valores[valores.length - 1];


    let numero =
      ultimo
        .replace(/r\$/gi, "")
        .replace(/rs/gi, "")
        .replace(/reais/gi, "")
        .trim();


    if (
      numero.toLowerCase().includes("mil") ||
      numero.toLowerCase().includes("k")
    ) {

      numero =
        numero
          .replace(/[^\d.,]/g, "");

      numero =
        numero.replace(",", ".");

      metaPergunta =
        Number(numero) * 1000;

    } else {

      numero =
        numero.replace(/\./g, "");

      numero =
        numero.replace(",", ".");

      metaPergunta =
        Number(numero);

    }

  }


  /* =====================================================
     PLANO DE AÇÃO
  ===================================================== */

  if (
    texto.includes("plano de acao") ||
    texto.includes("plano de ação") ||
    texto.includes("plano") ||
    texto.includes("proximos passos") ||
    texto.includes("proximos passos")
  ) {

    const meta =
      metaPergunta ||
      metaCadastrada;


    const falta =
      Math.max(
        meta - faturamento,
        0
      );


    const clientesNecessarios =
      ticketMedio > 0
        ? Math.ceil(
            falta / ticketMedio
          )
        : 0;


    return `⚡ PLANO DE AÇÃO — JZ PRIME

Objetivo principal: ${objetivo}

📊 Situação atual

Faturamento: ${formatarMoeda(faturamento)}
Clientes ativos: ${formatarNumero(clientes)}
Ticket médio: ${formatarMoeda(ticketMedio)}

🎯 Meta

Meta considerada: ${formatarMoeda(meta)}

Falta para atingir:
${formatarMoeda(falta)}

🚀 Plano prático

1. PROSPECÇÃO
Aumentar diariamente o número de novos contatos comerciais e oportunidades.

2. CONVERSÃO
Acompanhar cada proposta enviada e fazer follow-up até obter uma resposta.

3. TICKET MÉDIO
Criar ofertas de maior valor e buscar vendas complementares para os clientes atuais.

4. RECUPERAÇÃO
Entrar em contato com clientes antigos que não compram atualmente.

5. CONTROLE
Acompanhar semanalmente faturamento, clientes, propostas e vendas fechadas.

📈 META COMERCIAL

${clientesNecessarios > 0
  ? `Se o ticket médio atual for mantido, seriam necessários aproximadamente ${formatarNumero(clientesNecessarios)} novos clientes para cobrir o valor que falta.`
  : "Ainda não há dados suficientes para calcular quantos clientes adicionais seriam necessários."}

⚠️ Essa projeção é uma estimativa baseada nos dados cadastrados.`;


  }


  /* =====================================================
     COMO ESTÃO AS VENDAS
  ===================================================== */

  if (
    texto.includes("vendas") ||
    texto.includes("venda")
  ) {

    return `📊 ANÁLISE DAS SUAS VENDAS

Faturamento atual:
${formatarMoeda(faturamento)}

Clientes ativos:
${formatarNumero(clientes)}

Ticket médio aproximado:
${formatarMoeda(ticketMedio)}

🎯 Estratégia recomendada:

1. Aumentar a conversão dos contatos em clientes.
2. Trabalhar ofertas de maior valor.
3. Recuperar clientes antigos.
4. Aumentar o ticket médio.
5. Fazer acompanhamento semanal das propostas.

Objetivo cadastrado:
${objetivo}`;


  }


  /* =====================================================
     META
  ===================================================== */

  if (
    texto.includes("meta") ||
    texto.includes("quanto falta") ||
    texto.includes("atingir")
  ) {

    const meta =
      metaPergunta ||
      metaCadastrada;


    if (meta <= 0) {

      return `🎯 Você ainda não possui uma meta mensal cadastrada.

Cadastre uma meta para que eu possa calcular quanto falta e montar um plano para atingir o objetivo.`;

    }


    const falta =
      Math.max(
        meta - faturamento,
        0
      );


    const percentual =
      Math.round(
        (faturamento / meta) * 100
      );


    const crescimento =
      faturamento > 0
        ? Math.round(
            ((meta - faturamento) /
              faturamento) *
              100
          )
        : 0;


    return `🎯 ANÁLISE DA META

Meta considerada:
${formatarMoeda(meta)}

Faturamento atual:
${formatarMoeda(faturamento)}

Falta:
${formatarMoeda(falta)}

Progresso:
${percentual}%

Crescimento necessário:
${crescimento}%

📌 Próximo passo:

Divida o valor que falta pelo número de dias restantes do mês para transformar a meta em uma meta diária de vendas.

Se você quiser, posso montar um plano de ação para atingir essa meta.`;

  }


  /* =====================================================
     TICKET MÉDIO
  ===================================================== */

  if (
    texto.includes("ticket") ||
    texto.includes("valor medio") ||
    texto.includes("valor médio")
  ) {

    return `💰 TICKET MÉDIO

Faturamento:
${formatarMoeda(faturamento)}

Clientes ativos:
${formatarNumero(clientes)}

Ticket médio aproximado:
${formatarMoeda(ticketMedio)}

📈 Para aumentar o ticket médio:

• Criar ofertas premium.
• Fazer vendas adicionais.
• Criar pacotes de serviços.
• Oferecer produtos complementares.
• Trabalhar clientes que já conhecem sua empresa.`;

  }


  /* =====================================================
     CLIENTES
  ===================================================== */

  if (
    texto.includes("clientes") ||
    texto.includes("cliente")
  ) {

    return `👥 ANÁLISE DE CLIENTES

Clientes ativos:
${formatarNumero(clientes)}

Faturamento:
${formatarMoeda(faturamento)}

Ticket médio:
${formatarMoeda(ticketMedio)}

🎯 Estratégia:

1. Identificar os clientes de maior valor.
2. Criar ações de retenção.
3. Fazer ofertas adicionais.
4. Recuperar clientes inativos.
5. Buscar indicações de clientes atuais.`;

  }


  /* =====================================================
     CRESCIMENTO
  ===================================================== */

  if (
    texto.includes("crescimento") ||
    texto.includes("crescer") ||
    texto.includes("aumentar faturamento") ||
    texto.includes("aumentar meu faturamento")
  ) {

    return `📈 PLANO DE CRESCIMENTO

Faturamento atual:
${formatarMoeda(faturamento)}

Clientes:
${formatarNumero(clientes)}

Ticket médio:
${formatarMoeda(ticketMedio)}

Para crescer, trabalhe quatro alavancas:

1. Mais clientes.
2. Maior ticket médio.
3. Maior frequência de compra.
4. Melhor conversão comercial.

Minha prioridade seria aumentar a geração de oportunidades e, ao mesmo tempo, trabalhar o ticket médio dos clientes atuais.`;

  }


  /* =====================================================
     CUSTOS
  ===================================================== */

  if (
    texto.includes("custo") ||
    texto.includes("custos") ||
    texto.includes("despesa") ||
    texto.includes("despesas")
  ) {

    return `💰 ANÁLISE DE CUSTOS

Para reduzir custos sem prejudicar o crescimento:

1. Liste todas as despesas mensais.
2. Separe custos fixos e variáveis.
3. Identifique despesas que não geram receita.
4. Negocie contratos e fornecedores.
5. Corte desperdícios antes de cortar investimentos comerciais.

⚠️ Para calcular uma economia específica, preciso dos valores das suas despesas.`;

  }


  /* =====================================================
     MARGEM
  ===================================================== */

  if (
    texto.includes("margem") ||
    texto.includes("lucro")
  ) {

    return `📈 ANÁLISE DE MARGEM

Seu faturamento atual é:
${formatarMoeda(faturamento)}

Para calcular sua margem real, precisamos conhecer:

• faturamento;
• custos;
• despesas;
• impostos;
• lucro líquido.

Com esses dados, podemos calcular a margem e identificar quais produtos ou serviços são mais rentáveis.

⚠️ Não vou inventar sua margem sem possuir os custos reais.`;

  }


  /* =====================================================
     SAUDAÇÃO
  ===================================================== */

  if (
    texto === "oi" ||
    texto === "ola" ||
    texto === "olá" ||
    texto.includes("bom dia") ||
    texto.includes("boa tarde") ||
    texto.includes("boa noite")
  ) {

    const nome =
      empresa.responsavel ||
      "você";


    return `Olá, ${nome}! 👋

Sou o JZ Prime Copilot.

Já tenho os indicadores cadastrados da sua empresa e posso analisar:

📊 Faturamento
👥 Clientes
🎯 Metas
💰 Ticket médio
📈 Crescimento
⚡ Plano de ação
💵 Custos e margem

Pode me perguntar diretamente, por exemplo:

• Como estão minhas vendas?
• Quanto falta para minha meta?
• Como aumentar meu faturamento?
• Qual é meu ticket médio?
• Como chegar a R$ 130.000?
• Crie um plano de ação.`;

  }


  /* =====================================================
     RESPOSTA PADRÃO
  ===================================================== */

  return `Entendi sua pergunta. 👍

Com os dados atuais da sua empresa, posso analisar:

📊 Faturamento
👥 Clientes
🎯 Metas
💰 Ticket médio
📈 Crescimento
⚡ Plano de ação
💵 Custos e margem

Tente perguntar, por exemplo:

"Como estão minhas vendas?"

"Quanto falta para minha meta?"

"Como aumentar meu faturamento?"

"Como chegar a R$ 130.000?"

"Crie um plano de ação."`;

}


/* =========================================================
   ENVIAR PARA O COPILOT
========================================================= */

async function sendCopilot() {

  const input =
    document.getElementById(
      "copilotInput"
    );


  if (!input) {
    return;
  }


  const pergunta =
    input.value.trim();


  if (!pergunta) {
    return;
  }


  carregarEmpresa();


  /* MOSTRA PERGUNTA */

  adicionarMensagem(
    pergunta,
    "user"
  );


  input.value = "";


  /* CARREGANDO */

  const carregando =
    document.createElement("div");


  carregando.className =
    "message ai-loading";


  carregando.innerHTML = `

    <div class="avatar">
      ✦
    </div>

    <div class="message-content">

      <strong>
        JZ Prime Copilot
      </strong>

      <p>
        Analisando seus indicadores...
      </p>

    </div>

  `;


  const chatBox =
    document.getElementById(
      "chatBox"
    );


  if (chatBox) {

    chatBox.appendChild(
      carregando
    );

    chatBox.scrollTop =
      chatBox.scrollHeight;

  }


  /* PEQUENO DELAY PARA FICAR NATURAL */

  setTimeout(
    function() {

      if (carregando) {
        carregando.remove();
      }


      const resposta =
        gerarRespostaLocal(
          pergunta
        );


      adicionarMensagem(
        resposta,
        "ai"
      );

    },
    500
  );

}


/* =========================================================
   RELATÓRIO
========================================================= */

function downloadReport() {

  carregarEmpresa();


  const nome =
    empresa.empresa ||
    "Minha empresa";


  const faturamento =
    Number(
      empresa.faturamento
    ) || 0;


  const clientes =
    Number(
      empresa.clientes
    ) || 0;


  const meta =
    Number(
      empresa.meta
    ) || 0;


  const progresso =
    meta > 0
      ? Math.round(
          (faturamento / meta) * 100
        )
      : 0;


  const report = `JZ PRIME COPILOT
RESUMO EXECUTIVO

Empresa:
${nome}

Responsável:
${empresa.responsavel || "-"}

Segmento:
${empresa.segmento || "-"}

Faturamento mensal:
${formatarMoeda(faturamento)}

Clientes ativos:
${formatarNumero(clientes)}

Meta mensal:
${formatarMoeda(meta)}

Progresso da meta:
${progresso}%

Principal objetivo:
${empresa.objetivo || "-"}

RECOMENDAÇÃO ESTRATÉGICA

Acompanhar a evolução do faturamento,
proteger a margem, priorizar oportunidades
comerciais e revisar os indicadores
semanalmente.

JZ Prime Copilot
Estratégia orientada por dados.
`;


  const arquivo =
    new Blob(
      [report],
      {
        type:
          "text/plain;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(
      arquivo
    );


  const link =
    document.createElement("a");


  link.href =
    url;


  link.download =
    "jz-prime-resumo-executivo.txt";


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  setTimeout(
    () => {

      URL.revokeObjectURL(
        url
      );

    },
    1000
  );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    carregarEmpresa();

    atualizarDashboard();

    criarGraficos();

  }
);


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

window.notifyUser =
  notifyUser;

window.askCopilot =
  askCopilot;

window.sendCopilot =
  sendCopilot;

window.handleEnter =
  handleEnter;

window.downloadReport =
  downloadReport;

window.gerarRespostaLocal =
  gerarRespostaLocal;
