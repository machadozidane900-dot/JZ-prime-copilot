/* =========================================================
   JZ PRIME COPILOT
   DASHBOARD.JS
   ========================================================= */


/* =========================================================
   DADOS DA EMPRESA
   ========================================================= */

let empresa = {};

function carregarEmpresa() {
  try {
    const dados = localStorage.getItem("empresa");

    if (dados) {
      empresa = JSON.parse(dados);
    } else {
      empresa = {};
    }
  } catch (error) {
    console.error("Erro ao carregar dados da empresa:", error);
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
  return (Number(valor) || 0).toLocaleString("pt-BR");
}


/* =========================================================
   PREENCHER DADOS DO DASHBOARD
   ========================================================= */

function atualizarDashboard() {

  carregarEmpresa();

  const faturamento = Number(empresa.faturamento) || 0;
  const clientes = Number(empresa.clientes) || 0;
  const meta = Number(empresa.meta) || 0;

  /*
    Se não existir uma quantidade de oportunidades
    cadastrada, usamos uma estimativa inicial.
  */
  const oportunidades =
    Number(empresa.oportunidades) ||
    Math.max(3, Math.round(clientes * 0.08));


  /* ---------------------------------------------
     FATURAMENTO
  --------------------------------------------- */

  const faturamentoCard =
    document.getElementById("faturamentoCard");

  if (faturamentoCard) {
    faturamentoCard.textContent =
      formatarMoeda(faturamento);
  }


  /* ---------------------------------------------
     CLIENTES
  --------------------------------------------- */

  const clientesCard =
    document.getElementById("clientesCard");

  if (clientesCard) {
    clientesCard.textContent =
      formatarNumero(clientes);
  }


  /* ---------------------------------------------
     OPORTUNIDADES
  --------------------------------------------- */

  const oportunidadesCard =
    document.getElementById("oportunidadesCard");

  if (oportunidadesCard) {
    oportunidadesCard.textContent =
      formatarNumero(oportunidades);
  }


  /* ---------------------------------------------
     NOME DA EMPRESA
  --------------------------------------------- */

  const nomeEmpresa =
    empresa.empresa || "Minha empresa";

  const elementosEmpresa =
    document.querySelectorAll(
      "[data-empresa]"
    );

  elementosEmpresa.forEach((elemento) => {
    elemento.textContent = nomeEmpresa;
  });


  /* ---------------------------------------------
     RESPONSÁVEL
  --------------------------------------------- */

  const responsavel =
    empresa.responsavel || "";

  const elementosResponsavel =
    document.querySelectorAll(
      "[data-responsavel]"
    );

  elementosResponsavel.forEach((elemento) => {
    elemento.textContent = responsavel;
  });


  /* ---------------------------------------------
     SEGMENTO
  --------------------------------------------- */

  const segmento =
    empresa.segmento || "";

  const elementosSegmento =
    document.querySelectorAll(
      "[data-segmento]"
    );

  elementosSegmento.forEach((elemento) => {
    elemento.textContent = segmento;
  });


  /* ---------------------------------------------
     META
  --------------------------------------------- */

  const elementosMeta =
    document.querySelectorAll(
      "[data-meta]"
    );

  elementosMeta.forEach((elemento) => {
    elemento.textContent =
      formatarMoeda(meta);
  });


  /* ---------------------------------------------
     OBJETIVO
  --------------------------------------------- */

  const objetivo =
    empresa.objetivo ||
    "Aumentar vendas";

  const elementosObjetivo =
    document.querySelectorAll(
      "[data-objetivo]"
    );

  elementosObjetivo.forEach((elemento) => {
    elemento.textContent = objetivo;
  });


  /* ---------------------------------------------
     PROGRESSO DA META
  --------------------------------------------- */

  let percentualMeta = 0;

  if (meta > 0) {
    percentualMeta =
      Math.min(
        100,
        Math.round((faturamento / meta) * 100)
      );
  }

  const elementosProgresso =
    document.querySelectorAll(
      "[data-progresso]"
    );

  elementosProgresso.forEach((elemento) => {
    elemento.textContent =
      percentualMeta + "%";
  });


  const barrasProgresso =
    document.querySelectorAll(
      "[data-progresso-bar]"
    );

  barrasProgresso.forEach((barra) => {
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
    document.getElementById("saudacao");

  const descricao =
    document.getElementById("descricaoPainel");

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
   NOTIFICAÇÕES
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
    setTimeout(() => {

      notification.style.opacity =
        "0";

    }, 2800);
}


/* =========================================================
   GRÁFICO DE FATURAMENTO
   ========================================================= */

let faturamentoChart = null;


function criarGraficoFaturamento() {

  const canvas =
    document.getElementById(
      "faturamentoChart"
    );

  if (!canvas) {
    return;
  }

  /*
    Se Chart.js estiver disponível,
    usamos o gráfico real.
  */

  if (typeof Chart === "undefined") {

    console.warn(
      "Chart.js não foi carregado."
    );

    return;
  }


  if (faturamentoChart) {
    faturamentoChart.destroy();
  }


  const faturamento =
    Number(empresa.faturamento) || 0;


  /*
    Criamos uma evolução visual
    baseada no faturamento informado.
  */

  const valores = [

    faturamento * 0.68,

    faturamento * 0.74,

    faturamento * 0.71,

    faturamento * 0.82,

    faturamento * 0.91,

    faturamento

  ];


  faturamentoChart =
    new Chart(canvas, {

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

        datasets: [{

          label:
            "Faturamento",

          data:
            valores,

          backgroundColor:
            "#35d99b",

          borderRadius:
            6,

          borderSkipped:
            false

        }]

      },

      options: {

        responsive: true,

        maintainAspectRatio:
          false,

        plugins: {

          legend: {
            display: false
          },

          tooltip: {

            callbacks: {

              label: function(context) {

                return formatarMoeda(
                  context.raw
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

    });
}


/* =========================================================
   GRÁFICO DE CLIENTES
   ========================================================= */

let clientesChart = null;


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
      Math.round(clientes * 0.62)
    ),

    Math.max(
      1,
      Math.round(clientes * 0.70)
    ),

    Math.max(
      1,
      Math.round(clientes * 0.76)
    ),

    Math.max(
      1,
      Math.round(clientes * 0.83)
    ),

    Math.max(
      1,
      Math.round(clientes * 0.91)
    ),

    clientes

  ];


  clientesChart =
    new Chart(canvas, {

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

        datasets: [{

          label:
            "Clientes",

          data:
            dados,

          borderColor:
            "#35d99b",

          backgroundColor:
            "rgba(53,217,155,.12)",

          borderWidth:
            2,

          fill:
            true,

          tension:
            0.35,

          pointRadius:
            3,

          pointBackgroundColor:
            "#35d99b"

        }]

      },

      options: {

        responsive: true,

        maintainAspectRatio:
          false,

        plugins: {

          legend: {
            display: false
          }

        },

        scales: {

          y: {

            beginAtZero: true,

            ticks: {
              color: "#71857c"
            },

            grid: {
              color:
                "rgba(255,255,255,.05)"
            }

          },

          x: {

            ticks: {
              color: "#71857c"
            },

            grid: {
              display: false
            }

          }

        }

      }

    });
}


/* =========================================================
   GRÁFICO DE META
   ========================================================= */

let metaChart = null;


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


  let restante =
    Math.max(
      meta - faturamento,
      0
    );


  if (meta <= 0) {
    restante = 1;
  }


  metaChart =
    new Chart(canvas, {

      type: "doughnut",

      data: {

        labels: [
          "Realizado",
          "Restante"
        ],

        datasets: [{

          data: [
            Math.min(
              faturamento,
              meta
            ),
            restante
          ],

          backgroundColor: [
            "#35d99b",
            "#173128"
          ],

          borderWidth:
            0

        }]

      },

      options: {

        responsive: true,

        maintainAspectRatio:
          false,

        cutout:
          "72%",

        plugins: {

          legend: {
            display: false
          }

        }

      }

    });
}


/* =========================================================
   CRIAR TODOS OS GRÁFICOS
   ========================================================= */

function criarGraficos() {

  criarGraficoFaturamento();

  criarGraficoClientes();

  criarGraficoMeta();
}


/* =========================================================
   COPILOT
   ========================================================= */

function adicionarMensagem(texto, tipo) {

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
          ${escaparHTML(texto)}
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
   ENTER NO COPILOT
   ========================================================= */

function handleEnter(event) {

  if (event.key === "Enter") {

    event.preventDefault();

    sendCopilot();
  }
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


  adicionarMensagem(
    pergunta,
    "user"
  );


  input.value = "";


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
        Analisando sua empresa...
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


  try {

    const resposta =
      await fetch(
        "/api/copilot",
        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              question:
                pergunta,

              empresa:
                empresa

            })

        }
      );


    const dados =
      await resposta.json();


    if (carregando) {
      carregando.remove();
    }


    if (!resposta.ok) {

      throw new Error(
        dados.error ||
        "Erro ao consultar o Copilot."
      );

    }


    adicionarMensagem(

      dados.answer ||
      "Não consegui gerar uma resposta agora.",

      "ai"

    );


  } catch (erro) {

    console.error(
      "Erro no Copilot:",
      erro
    );


    if (carregando) {
      carregando.remove();
    }


    /*
      Resposta local para o dashboard
      continuar funcionando mesmo quando
      a API estiver indisponível.
    */

    const respostaLocal =
      gerarRespostaLocal(
        pergunta
      );


    adicionarMensagem(
      respostaLocal,
      "ai"
    );

  }

}


/* =========================================================
   COPILOT LOCAL
   ========================================================= */

function gerarRespostaLocal(pergunta) {

  const texto =
    pergunta.toLowerCase();


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


  if (
    texto.includes("venda") ||
    texto.includes("vendas")
  ) {

    return (
      "Com base nos dados cadastrados, " +
      "seu faturamento atual é " +
      formatarMoeda(faturamento) +
      ". O primeiro ponto recomendado é " +
      "acompanhar a evolução das vendas, " +
      "a taxa de conversão e o ticket médio."
    );
  }


  if (
    texto.includes("custo") ||
    texto.includes("custos")
  ) {

    return (
      "Para reduzir custos, recomendo " +
      "separar despesas fixas e variáveis, " +
      "identificar gastos recorrentes de baixo " +
      "retorno e acompanhar a margem mensal."
    );
  }


  if (
    texto.includes("margem") ||
    texto.includes("lucro")
  ) {

    return (
      "Para melhorar a margem, acompanhe " +
      "preço médio, custo por venda e despesas " +
      "operacionais. Crescer faturamento sem " +
      "proteger a margem pode reduzir a rentabilidade."
    );
  }


  if (
    texto.includes("plano") ||
    texto.includes("ação")
  ) {

    return (
      "Plano inicial: 1) acompanhar vendas " +
      "semanalmente; 2) priorizar clientes de " +
      "maior potencial; 3) revisar custos; " +
      "4) acompanhar a meta de " +
      formatarMoeda(meta) +
      ". Atualmente, o progresso estimado " +
      "é de " +
      progresso +
      "%."
    );
  }


  return (
    "Analisei os dados disponíveis. " +
    "Sua empresa possui " +
    formatarNumero(clientes) +
    " clientes ativos e faturamento de " +
    formatarMoeda(faturamento) +
    ". Posso ajudar a analisar vendas, " +
    "custos, margem ou criar um plano de ação."
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

Empresa: ${nome}

Responsável: ${empresa.responsavel || "-"}

Segmento: ${empresa.segmento || "-"}

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


  setTimeout(() => {

    URL.revokeObjectURL(
      url
    );

  }, 1000);
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    carregarEmpresa();

    atualizarDashboard();

    /*
      Esperamos um pequeno intervalo para
      garantir que o Chart.js esteja disponível.
    */

    setTimeout(
      criarGraficos,
      100
    );

  }
);


/* =========================================================
   EXPOR FUNÇÕES PARA O HTML
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
