/* =========================================================
   JZ PRIME COPILOT
   DASHBOARD.JS
========================================================= */


/* =========================================================
   DADOS DA EMPRESA
========================================================= */

let empresa = {};


/* =========================================================
   CARREGAR EMPRESA
========================================================= */

function carregarEmpresa() {

  try {

    const dados =
      localStorage.getItem(
        "empresa"
      );

    empresa =
      dados
        ? JSON.parse(dados)
        : {};

  } catch (erro) {

    console.error(
      "Erro ao carregar empresa:",
      erro
    );

    empresa = {};

  }

}


/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatarMoeda(valor) {

  const numero =
    Number(valor) || 0;

  return numero.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );

}


function formatarNumero(valor) {

  const numero =
    Number(valor) || 0;

  return numero.toLocaleString(
    "pt-BR"
  );

}


/* =========================================================
   ATUALIZAR DASHBOARD
========================================================= */

function atualizarDashboard() {

  carregarEmpresa();


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


  const oportunidades =
    Math.max(
      3,
      Math.round(
        clientes * 0.08
      )
    );


  const progresso =
    meta > 0
      ? Math.min(
          100,
          Math.round(
            (faturamento / meta) * 100
          )
        )
      : 0;


  /* FATURAMENTO */

  const elementoFaturamento =
    document.getElementById(
      "faturamento"
    );

  if (elementoFaturamento) {

    elementoFaturamento.textContent =
      formatarMoeda(
        faturamento
      );

  }


  /* CLIENTES */

  const elementoClientes =
    document.getElementById(
      "clientes"
    );

  if (elementoClientes) {

    elementoClientes.textContent =
      formatarNumero(
        clientes
      );

  }


  /* META */

  const elementoMeta =
    document.getElementById(
      "meta"
    );

  if (elementoMeta) {

    elementoMeta.textContent =
      formatarMoeda(
        meta
      );

  }


  /* OPORTUNIDADES */

  const elementoOportunidades =
    document.getElementById(
      "oportunidades"
    );

  if (elementoOportunidades) {

    elementoOportunidades.textContent =
      formatarNumero(
        oportunidades
      );

  }


  /* PROGRESSO */

  const elementoProgresso =
    document.getElementById(
      "progresso"
    );

  if (elementoProgresso) {

    elementoProgresso.textContent =
      progresso + "%";

  }


  /* BARRAS DE PROGRESSO */

  const barras =
    document.querySelectorAll(
      "[data-progress]"
    );

  barras.forEach(
    function(barra) {

      barra.style.width =
        progresso + "%";

    }
  );


  /* ATRIBUTOS */

  const cards =
    document.querySelectorAll(
      "[data-faturamento]"
    );

  cards.forEach(
    function(card) {

      card.dataset.faturamento =
        faturamento;

    }
  );

}


/* =========================================================
   TEXTOS DO PAINEL
========================================================= */

function atualizarTextoPainel() {

  carregarEmpresa();


  const nome =
    empresa.responsavel ||
    "Empresário";


  const nomeEmpresa =
    empresa.empresa ||
    "sua empresa";


  const saudacao =
    document.getElementById(
      "saudacao"
    );


  if (saudacao) {

    saudacao.textContent =
      "Visão geral, " +
      nome;

  }


  const descricao =
    document.getElementById(
      "descricaoPainel"
    );


  if (descricao) {

    descricao.textContent =
      "Controle, análise e estratégia para " +
      nomeEmpresa +
      ".";

  }

}


/* =========================================================
   NOTIFICAÇÃO
========================================================= */

function notifyUser(
  mensagem
) {

  const notificacao =
    document.createElement(
      "div"
    );


  notificacao.className =
    "notification";


  notificacao.textContent =
    mensagem;


  document.body.appendChild(
    notificacao
  );


  setTimeout(
    function() {

      notificacao.remove();

    },
    3000
  );

}


/* =========================================================
   GRÁFICO DE FATURAMENTO
========================================================= */

function criarGraficoFaturamento() {

  const canvas =
    document.getElementById(
      "graficoFaturamento"
    );


  if (!canvas) {
    return;
  }


  if (
    typeof Chart ===
    "undefined"
  ) {
    return;
  }


  const faturamento =
    Number(
      empresa.faturamento
    ) || 0;


  new Chart(
    canvas,
    {

      type: "bar",

      data: {

        labels: [
          "Mês atual"
        ],

        datasets: [

          {

            label:
              "Faturamento",

            data: [
              faturamento
            ],

            borderWidth: 1

          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio:
          false,

        plugins: {

          legend: {
            display: true
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
      "graficoClientes"
    );


  if (!canvas) {
    return;
  }


  if (
    typeof Chart ===
    "undefined"
  ) {
    return;
  }


  const clientes =
    Number(
      empresa.clientes
    ) || 0;


  new Chart(
    canvas,
    {

      type: "line",

      data: {

        labels: [
          "Atual"
        ],

        datasets: [

          {

            label:
              "Clientes",

            data: [
              clientes
            ],

            tension:
              0.3,

            borderWidth: 2

          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio:
          false

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
      "graficoMeta"
    );


  if (!canvas) {
    return;
  }


  if (
    typeof Chart ===
    "undefined"
  ) {
    return;
  }


  const faturamento =
    Number(
      empresa.faturamento
    ) || 0;


  const meta =
    Number(
      empresa.meta
    ) || 0;


  const restante =
    Math.max(
      0,
      meta - faturamento
    );


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
              faturamento,
              restante
            ],

            borderWidth: 1

          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio:
          false,

        cutout:
          "70%"

      }

    }
  );

}


/* =========================================================
   CRIAR GRÁFICOS
========================================================= */

function criarGraficos() {

  criarGraficoFaturamento();

  criarGraficoClientes();

  criarGraficoMeta();

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(
  texto
) {

  const div =
    document.createElement(
      "div"
    );


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
    document.createElement(
      "div"
    );


  mensagem.className =
    "message " +
    (
      tipo === "user"
        ? "user-message"
        : "ai-message"
    );


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
          ${escaparHTML(texto)
            .replace(/\n/g, "<br>")}
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
   RESPOSTA LOCAL
   FALLBACK CASO A API ESTEJA INDISPONÍVEL
========================================================= */

function gerarRespostaLocal(
  pergunta
) {

  carregarEmpresa();


  const texto =
    pergunta
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );


  const faturamento =
    Number(
      empresa.faturamento
    ) || 0;


  const meta =
    Number(
      empresa.meta
    ) || 0;


  const clientes =
    Number(
      empresa.clientes
    ) || 0;


  const falta =
    Math.max(
      0,
      meta - faturamento
    );


  const progresso =
    meta > 0
      ? Math.round(
          (faturamento / meta) * 100
        )
      : 0;


  const agora =
    new Date();


  const ultimoDia =
    new Date(
      agora.getFullYear(),
      agora.getMonth() + 1,
      0
    ).getDate();


  const diasRestantes =
    Math.max(
      1,
      ultimoDia -
      agora.getDate()
    );


  const metaDiaria =
    falta / diasRestantes;


  /* META */

  if (
    texto.includes("meta") &&
    (
      texto.includes("falta") ||
      texto.includes("quanto")
    )
  ) {

    return (
      "🎯 ANÁLISE DA META\n\n" +

      "Meta considerada:\n" +
      formatarMoeda(meta) +

      "\n\nFaturamento atual:\n" +
      formatarMoeda(faturamento) +

      "\n\nFalta:\n" +
      formatarMoeda(falta) +

      "\n\nProgresso:\n" +
      progresso +
      "%" +

      "\n\nMeta diária necessária:\n" +
      formatarMoeda(metaDiaria) +

      "\n\n📌 Próximo passo:\n" +

      "Você precisa gerar aproximadamente " +
      formatarMoeda(metaDiaria) +
      " por dia durante os " +
      diasRestantes +
      " dias restantes."
    );

  }


  /* CLIENTES */

  if (
    texto.includes("cliente")
  ) {

    return (
      "👥 ANÁLISE DE CLIENTES\n\n" +

      "Clientes ativos:\n" +
      formatarNumero(clientes) +

      "\n\n📌 Recomendo analisar " +
      "ticket médio, frequência de compra " +
      "e oportunidades de novos clientes."
    );

  }


  /* FATURAMENTO */

  if (
    texto.includes("faturamento") ||
    texto.includes("vendas")
  ) {

    return (
      "📊 ANÁLISE DO FATURAMENTO\n\n" +

      "Faturamento atual:\n" +
      formatarMoeda(faturamento) +

      "\n\nMeta mensal:\n" +
      formatarMoeda(meta) +

      "\n\nProgresso:\n" +
      progresso +
      "%"
    );

  }


  /* RESPOSTA PADRÃO */

  return (
    "Com os dados atuais da empresa, " +
    "posso analisar faturamento, clientes, " +
    "metas, ticket médio, crescimento e " +
    "oportunidades comerciais.\n\n" +

    "Pergunte, por exemplo:\n\n" +

    "• Quanto falta para minha meta?\n" +
    "• Como aumentar meu faturamento?\n" +
    "• Quanto preciso vender por dia?\n" +
    "• Como melhorar minhas vendas?\n" +
    "• Crie um plano de ação."
  );

}


/* =========================================================
   ASK COPILOT
========================================================= */

function askCopilot() {

  const input =
    document.getElementById(
      "copilotInput"
    );


  if (!input) {
    return;
  }


  input.focus();

}


/* =========================================================
   ENTER
========================================================= */

function handleEnter(
  event
) {

  if (
    event.key === "Enter" &&
    !event.shiftKey
  ) {

    event.preventDefault();

    sendCopilot();

  }

}


/* =========================================================
   COPILOT COM IA + MEMÓRIA
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


  /* =======================================================
     CARREGAR HISTÓRICO
  ======================================================= */

  let historico = [];


  try {

    historico =
      JSON.parse(
        localStorage.getItem(
          "copilotHistorico"
        )
      ) || [];

  } catch (erro) {

    historico = [];

  }


  /* =======================================================
     MOSTRAR PERGUNTA
  ======================================================= */

  adicionarMensagem(
    pergunta,
    "user"
  );


  input.value = "";


  /* =======================================================
     LOADING
  ======================================================= */

  const carregando =
    document.createElement(
      "div"
    );


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


  try {

    /* =====================================================
       CHAMADA PARA API
    ===================================================== */

    const response =
      await fetch(
        "/api/copilot",
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
                empresa,

              historico:
                historico.slice(-12)

            })

        }
      );


    const data =
      await response.json();


    if (carregando) {

      carregando.remove();

    }


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Erro ao consultar o Copilot."
      );

    }


    const resposta =
      data.answer ||
      data.resposta ||
      "Não consegui gerar uma resposta.";


    /* =====================================================
       MOSTRAR RESPOSTA
    ===================================================== */

    adicionarMensagem(
      resposta,
      "ai"
    );


    /* =====================================================
       SALVAR HISTÓRICO
    ===================================================== */

    historico.push({

      role: "user",

      content:
        pergunta

    });


    historico.push({

      role: "assistant",

      content:
        resposta

    });


    historico =
      historico.slice(-12);


    localStorage.setItem(
      "copilotHistorico",
      JSON.stringify(
        historico
      )
    );


  } catch (erro) {

    console.error(
      "Erro no Copilot:",
      erro
    );


    if (carregando) {

      carregando.remove();

    }


    /* =====================================================
       FALLBACK LOCAL
    ===================================================== */

    const respostaLocal =
      gerarRespostaLocal(
        pergunta
      );


    adicionarMensagem(
      respostaLocal,
      "ai"
    );


    historico.push({

      role: "user",

      content:
        pergunta

    });


    historico.push({

      role: "assistant",

      content:
        respostaLocal

    });


    historico =
      historico.slice(-12);


    localStorage.setItem(
      "copilotHistorico",
      JSON.stringify(
        historico
      )
    );

  }

}


/* =========================================================
   LIMPAR HISTÓRICO DO COPILOT
========================================================= */

function limparHistoricoCopilot() {

  localStorage.removeItem(
    "copilotHistorico"
  );


  const chatBox =
    document.getElementById(
      "chatBox"
    );


  if (chatBox) {

    chatBox.innerHTML = "";

  }


  notifyUser(
    "Histórico do Copilot limpo."
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
    document.createElement(
      "a"
    );


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
    function() {

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

    atualizarTextoPainel();

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

window.limparHistoricoCopilot =
  limparHistoricoCopilot;
