/* =========================================================
   JZ PRIME COPILOT
   DASHBOARD.JS
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
    document.getElementById("faturamentoCard");

  if (faturamentoCard) {
    faturamentoCard.textContent =
      formatarMoeda(faturamento);
  }


  /* CLIENTES */

  const clientesCard =
    document.getElementById("clientesCard");

  if (clientesCard) {
    clientesCard.textContent =
      formatarNumero(clientes);
  }


  /* OPORTUNIDADES */

  const oportunidadesCard =
    document.getElementById("oportunidadesCard");

  if (oportunidadesCard) {
    oportunidadesCard.textContent =
      formatarNumero(oportunidades);
  }


  /* FATURAMENTO PARA META */

  const metaFaturamento =
    document.getElementById("metaFaturamento");

  if (metaFaturamento) {
    metaFaturamento.textContent =
      formatarMoeda(faturamento);
  }


  /* EMPRESA */

  const nomeEmpresa =
    empresa.empresa || "Minha empresa";

  document
    .querySelectorAll("[data-empresa]")
    .forEach(elemento => {
      elemento.textContent = nomeEmpresa;
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
   NOTIFICAÇÃO
   ========================================================= */

function notifyUser(mensagem) {
  let notification =
    document.getElementById("jzNotification");

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
    console.error(
      "Chart.js não foi carregado."
    );
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
              label: "Faturamento",

              data: valores,

              backgroundColor:
                "#35d99b",

              hoverBackgroundColor:
                "#4ae5ac",

              borderRadius: 7,

              borderSkipped: false
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
                label: function(context) {
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
                color: "#71857c",

                font: {
                  size: 10
                },

                callback: function(value) {
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
                color: "#71857c",

                font: {
                  size: 10
                }
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
    console.error(
      "Chart.js não foi carregado."
    );
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
              label: "Clientes",

              data: dados,

              borderColor:
                "#35d99b",

              backgroundColor:
                "rgba(53,217,155,.12)",

              borderWidth: 3,

              fill: true,

              tension: .35,

              pointRadius: 4,

              pointHoverRadius: 6,

              pointBackgroundColor:
                "#35d99b",

              pointBorderColor:
                "#06100c",

              pointBorderWidth: 2
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
                color: "#71857c",

                font: {
                  size: 10
                }
              },

              grid: {
                color:
                  "rgba(255,255,255,.05)"
              }
            },

            x: {
              ticks: {
                color: "#71857c",

                font: {
                  size: 10
                }
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
    console.error(
      "Chart.js não foi carregado."
    );
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
              "Sem meta",
              "Restante"
            ],

            datasets: [
              {
                data: [
                  0,
                  1
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

              borderWidth: 0,

              hoverOffset: 5
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
            },

            tooltip: {
              callbacks: {
                label: function(context) {
                  return (
                    " " +
                    formatarMoeda(
                      context.raw
                    )
                  );
                }
              }
            }
          }
        }
      }
    );
}


/* =========================================================
   CRIAR TODOS OS GRÁFICOS
   ========================================================= */

function criarGraficos() {
  carregarEmpresa();

  criarGraficoFaturamento();
  criarGraficoClientes();
  criarGraficoMeta();
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
        <strong>Você</strong>

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


  /* Garante dados atualizados */

  carregarEmpresa();


  /* Mostra pergunta */

  adicionarMensagem(
    pergunta,
    "user"
  );

  input.value = "";


  /* Mensagem de carregamento */

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
        "/api/copiloto",
        {
          method: "POST",

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


    const textoResposta =
      await resposta.text();


    let dados = {};

    try {
      dados =
        JSON.parse(
          textoResposta
        );
    } catch (error) {
      dados = {
        error:
          "A API retornou uma resposta inválida."
      };
    }


    if (carregando) {
      carregando.remove();
    }


    if (!resposta.ok) {
      console.error(
        "Erro da API:",
        dados
      );

      throw new Error(
        dados.error ||
        "Erro ao consultar o Copilot."
      );
    }


    const respostaIA =
      dados.answer ||
      dados.output ||
      "A inteligência artificial não retornou uma resposta.";


    adicionarMensagem(
      respostaIA,
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


    adicionarMensagem(
      "Não consegui conectar à inteligência artificial agora. Verifique a configuração da API e tente novamente.",
      "ai"
    );
  }
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

  const report = `
JZ PRIME COPILOT

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
