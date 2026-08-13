let empresa = {};

let faturamentoChart = null;
let clientesChart = null;
let metaChart = null;

function carregarEmpresa() {
  try {
    const dados = localStorage.getItem("empresa");

    if (dados) {
      empresa = JSON.parse(dados);
    } else {
      empresa = {};
    }
  } catch (error) {
    console.error("Erro ao carregar empresa:", error);
    empresa = {};
  }

  return empresa;
}

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

function atualizarDashboard() {
  carregarEmpresa();

  const faturamento = Number(empresa.faturamento) || 0;
  const clientes = Number(empresa.clientes) || 0;
  const meta = Number(empresa.meta) || 0;

  const oportunidades =
    Number(empresa.oportunidades) ||
    Math.max(3, Math.round(clientes * 0.08));

  const faturamentoCard =
    document.getElementById("faturamentoCard");

  if (faturamentoCard) {
    faturamentoCard.textContent =
      formatarMoeda(faturamento);
  }

  const clientesCard =
    document.getElementById("clientesCard");

  if (clientesCard) {
    clientesCard.textContent =
      formatarNumero(clientes);
  }

  const oportunidadesCard =
    document.getElementById("oportunidadesCard");

  if (oportunidadesCard) {
    oportunidadesCard.textContent =
      formatarNumero(oportunidades);
  }

  const metaFaturamento =
    document.getElementById("metaFaturamento");

  if (metaFaturamento) {
    metaFaturamento.textContent =
      formatarMoeda(faturamento);
  }

  document
    .querySelectorAll("[data-empresa]")
    .forEach(elemento => {
      elemento.textContent =
        empresa.empresa || "Minha empresa";
    });

  document
    .querySelectorAll("[data-responsavel]")
    .forEach(elemento => {
      elemento.textContent =
        empresa.responsavel || "";
    });

  document
    .querySelectorAll("[data-segmento]")
    .forEach(elemento => {
      elemento.textContent =
        empresa.segmento || "";
    });

  document
    .querySelectorAll("[data-meta]")
    .forEach(elemento => {
      elemento.textContent =
        formatarMoeda(meta);
    });

  document
    .querySelectorAll("[data-objetivo]")
    .forEach(elemento => {
      elemento.textContent =
        empresa.objetivo || "Aumentar vendas";
    });

  let percentualMeta = 0;

  if (meta > 0) {
    percentualMeta =
      Math.round((faturamento / meta) * 100);

    percentualMeta =
      Math.min(100, Math.max(0, percentualMeta));
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
    saudacao.textContent =
      nome
        ? "Visão geral, " + nome
        : "Visão geral";
  }

  if (descricao) {
    descricao.textContent =
      empresa.empresa
        ? "Controle, análise e estratégia para " +
          empresa.empresa +
          "."
        : "Controle, análise e estratégia em um só lugar.";
  }
}

function adicionarMensagem(texto, tipo) {
  const chatBox =
    document.getElementById("chatBox");

  if (!chatBox) {
    return;
  }

  const mensagem =
    document.createElement("div");

  mensagem.className =
    "message " + tipo;

  if (tipo === "user") {
    mensagem.innerHTML =
      '<div class="message-content">' +
      '<strong>Você</strong>' +
      '<p>' +
      escaparHTML(texto) +
      '</p>' +
      '</div>';
  } else {
    mensagem.innerHTML =
      '<div class="avatar">✦</div>' +
      '<div class="message-content">' +
      '<strong>JZ Prime Copilot</strong>' +
      '<p>' +
      escaparHTML(texto) +
      '</p>' +
      '</div>';
  }

  chatBox.appendChild(mensagem);

  chatBox.scrollTop =
    chatBox.scrollHeight;
}

function escaparHTML(texto) {
  const div =
    document.createElement("div");

  div.textContent =
    texto;

  return div.innerHTML;
}

function askCopilot(pergunta) {
  const input =
    document.getElementById("copilotInput");

  if (!input) {
    return;
  }

  input.value = pergunta;

  sendCopilot();
}

function handleEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendCopilot();
  }
}

async function sendCopilot() {
  const input =
    document.getElementById("copilotInput");

  if (!input) {
    console.error(
      "Campo copilotInput não encontrado."
    );
    return;
  }

  const pergunta =
    input.value.trim();

  if (!pergunta) {
    return;
  }

  carregarEmpresa();

  adicionarMensagem(
    pergunta,
    "user"
  );

  input.value = "";

  const carregando =
    document.createElement("div");

  carregando.className =
    "message ai-loading";

  carregando.innerHTML =
    '<div class="avatar">✦</div>' +
    '<div class="message-content">' +
    '<strong>JZ Prime Copilot</strong>' +
    '<p>Analisando sua empresa...</p>' +
    '</div>';

  const chatBox =
    document.getElementById("chatBox");

  if (chatBox) {
    chatBox.appendChild(carregando);
    chatBox.scrollTop =
      chatBox.scrollHeight;
  }

  try {
    const resposta =
      await fetch("/api/copilot", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          question: pergunta,
          empresa: empresa
        })
      });

    const textoResposta =
      await resposta.text();

    let dados;

    try {
      dados =
        JSON.parse(textoResposta);
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

  } catch (error) {
    console.error(
      "Erro no Copilot:",
      error
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

function downloadReport() {
  carregarEmpresa();

  const nome =
    empresa.empresa ||
    "Minha empresa";

  const faturamento =
    Number(empresa.faturamento) || 0;

  const clientes =
    Number(empresa.clientes) || 0;

  const meta =
    Number(empresa.meta) || 0;

  const progresso =
    meta > 0
      ? Math.round(
          (faturamento / meta) * 100
        )
      : 0;

  const report =
    "JZ PRIME COPILOT\n\n" +
    "RESUMO EXECUTIVO\n\n" +
    "Empresa: " + nome + "\n\n" +
    "Responsável: " +
    (empresa.responsavel || "-") +
    "\n\n" +
    "Segmento: " +
    (empresa.segmento || "-") +
    "\n\n" +
    "Faturamento mensal: " +
    formatarMoeda(faturamento) +
    "\n\n" +
    "Clientes ativos: " +
    formatarNumero(clientes) +
    "\n\n" +
    "Meta mensal: " +
    formatarMoeda(meta) +
    "\n\n" +
    "Progresso da meta: " +
    progresso +
    "%\n\n" +
    "Principal objetivo: " +
    (empresa.objetivo || "-");

  const arquivo =
    new Blob(
      [report],
      {
        type:
          "text/plain;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(arquivo);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "jz-prime-resumo-executivo.txt";

  document.body.appendChild(link);

  link.click();

  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    carregarEmpresa();
    atualizarDashboard();
  }
);

window.askCopilot =
  askCopilot;

window.sendCopilot =
  sendCopilot;

window.handleEnter =
  handleEnter;

window.downloadReport =
  downloadReport;
