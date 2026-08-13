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

function escaparHTML(texto) {
  const div =
    document.createElement("div");

  div.textContent =
    texto;

  return div.innerHTML;
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

function analisarPergunta(pergunta) {
  carregarEmpresa();

  const texto =
    pergunta.toLowerCase();

  const faturamento =
    Number(empresa.faturamento) || 0;

  const clientes =
    Number(empresa.clientes) || 0;

  const meta =
    Number(empresa.meta) || 0;

  const nome =
    empresa.responsavel ||
    empresa.empresa ||
    "você";

  const objetivo =
    empresa.objetivo ||
    "Aumentar vendas";

  const segmento =
    empresa.segmento ||
    "seu segmento";

  const ticket =
    clientes > 0
      ? faturamento / clientes
      : 0;

  const progresso =
    meta > 0
      ? Math.round(
          (faturamento / meta) * 100
        )
      : 0;

  if (
    texto.includes("oi") ||
    texto.includes("olá") ||
    texto.includes("ola") ||
    texto.includes("bom dia") ||
    texto.includes("boa tarde") ||
    texto.includes("boa noite")
  ) {
    return (
      "Olá, " +
      nome +
      "! 👋\n\n" +
      "Sou o JZ Prime Copilot. Já tenho os indicadores cadastrados da sua empresa e posso analisar faturamento, clientes, metas, vendas e crescimento.\n\n" +
      "Por exemplo, você pode perguntar:\n" +
      "• Como estão minhas vendas?\n" +
      "• Quanto falta para minha meta?\n" +
      "• Como aumentar meu faturamento?\n" +
      "• Qual é meu ticket médio?\n" +
      "• Como chegar a R$ 100.000?"
    );
  }

  if (
    texto.includes("venda") ||
    texto.includes("vendas") ||
    texto.includes("faturamento")
  ) {
    if (faturamento <= 0) {
      return (
        "Ainda não tenho um faturamento cadastrado no sistema.\n\n" +
        "Cadastre o faturamento da empresa para eu conseguir fazer uma análise comercial mais precisa."
      );
    }

    return (
      "📊 Análise das suas vendas\n\n" +
      "Seu faturamento atual é de " +
      formatarMoeda(faturamento) +
      " por mês.\n\n" +
      "Você possui " +
      formatarNumero(clientes) +
      " cliente(s) ativo(s), com ticket médio aproximado de " +
      formatarMoeda(ticket) +
      ".\n\n" +
      "🎯 Estratégia recomendada:\n" +
      "1. Aumentar a conversão dos contatos em clientes.\n" +
      "2. Trabalhar ofertas de maior valor.\n" +
      "3. Recuperar clientes antigos.\n" +
      "4. Acompanhar semanalmente propostas e fechamentos.\n\n" +
      "Objetivo cadastrado: " +
      objetivo +
      "."
    );
  }

  if (
    texto.includes("meta") ||
    texto.includes("objetivo")
  ) {
    if (meta <= 0) {
      return (
        "Sua meta mensal ainda não está cadastrada.\n\n" +
        "Cadastre uma meta para eu calcular o valor que falta e o percentual de progresso."
      );
    }

    const falta =
      Math.max(meta - faturamento, 0);

    return (
      "🎯 Análise da sua meta\n\n" +
      "Meta mensal: " +
      formatarMoeda(meta) +
      "\n" +
      "Faturamento atual: " +
      formatarMoeda(faturamento) +
      "\n" +
      "Progresso: " +
      progresso +
      "%\n" +
      "Falta: " +
      formatarMoeda(falta) +
      "\n\n" +
      "Para atingir essa meta, concentre os esforços em novos clientes, aumento do ticket médio e recuperação de oportunidades comerciais."
    );
  }

  if (
    texto.includes("ticket") ||
    texto.includes("cliente")
  ) {
    if (clientes <= 0) {
      return (
        "Você ainda não possui clientes ativos cadastrados.\n\n" +
        "Cadastre a quantidade de clientes para eu calcular seu ticket médio."
      );
    }

    return (
      "👥 Análise da carteira\n\n" +
      "Clientes ativos: " +
      formatarNumero(clientes) +
      "\n" +
      "Faturamento: " +
      formatarMoeda(faturamento) +
      "\n" +
      "Ticket médio aproximado: " +
      formatarMoeda(ticket) +
      "\n\n" +
      "Uma estratégia interessante é aumentar o valor médio por cliente antes de depender exclusivamente da aquisição de novos clientes."
    );
  }

  if (
    texto.includes("custo") ||
    texto.includes("despesa")
  ) {
    return (
      "💰 Análise de custos\n\n" +
      "Ainda não existem custos ou despesas cadastrados no dashboard.\n\n" +
      "Por isso, não vou inventar valores.\n\n" +
      "Para melhorar sua gestão, registre mensalmente:\n" +
      "• Custos fixos\n" +
      "• Custos variáveis\n" +
      "• Despesas comerciais\n" +
      "• Marketing\n" +
      "• Folha e encargos\n\n" +
      "Com esses dados será possível calcular margem e identificar onde reduzir gastos."
    );
  }

  if (
    texto.includes("margem") ||
    texto.includes("lucro")
  ) {
    return (
      "📈 Análise de margem\n\n" +
      "Ainda não tenho custos e despesas cadastrados. Sem esses valores, não é correto calcular seu lucro ou sua margem.\n\n" +
      "O que já consigo analisar é seu faturamento atual de " +
      formatarMoeda(faturamento) +
      " e seu ticket médio aproximado de " +
      formatarMoeda(ticket) +
      ".\n\n" +
      "Cadastre seus custos para transformar essa análise em uma avaliação real de lucratividade."
    );
  }

  if (
    texto.includes("crescer") ||
    texto.includes("crescimento") ||
    texto.includes("aumentar") ||
    texto.includes("melhorar")
  ) {
    return (
      "🚀 Plano de crescimento\n\n" +
      "Para " +
      objetivo.toLowerCase() +
      ", eu trabalharia em quatro frentes:\n\n" +
      "1. Aquisição\n" +
      "Aumentar a quantidade de novos contatos qualificados.\n\n" +
      "2. Conversão\n" +
      "Melhorar o processo comercial e o acompanhamento das propostas.\n\n" +
      "3. Ticket médio\n" +
      "Criar ofertas complementares e aumentar o valor por cliente.\n\n" +
      "4. Retenção\n" +
      "Criar ações para que os clientes atuais comprem novamente.\n\n" +
      "Hoje o sistema registra " +
      formatarNumero(clientes) +
      " clientes e " +
      formatarMoeda(faturamento) +
      " de faturamento mensal.\n\n" +
      "Segmento: " +
      segmento +
      "."
    );
  }

  const numeroEncontrado =
    pergunta.match(
      /R?\$?\s?([\d.,]+)\s*(mil|k)?/i
    );

  if (numeroEncontrado) {
    let valor =
      numeroEncontrado[1]
        .replace(/\./g, "")
        .replace(",", ".");

    valor =
      Number(valor);

    if (
      numeroEncontrado[2] &&
      numeroEncontrado[2].toLowerCase() === "mil"
    ) {
      valor *= 1000;
    }

    if (
      numeroEncontrado[2] &&
      numeroEncontrado[2].toLowerCase() === "k"
    ) {
      valor *= 1000;
    }

    if (valor > faturamento) {
      const falta =
        valor - faturamento;

      const aumento =
        faturamento > 0
          ? Math.round(
              ((valor - faturamento) /
                faturamento) *
                100
            )
          : 0;

      return (
        "🎯 Análise da meta solicitada\n\n" +
        "Você quer chegar a " +
        formatarMoeda(valor) +
        ".\n\n" +
        "Faturamento atual: " +
        formatarMoeda(faturamento) +
        "\n" +
        "Falta: " +
        formatarMoeda(falta) +
        "\n" +
        "Crescimento necessário: aproximadamente " +
        aumento +
        "%.\n\n" +
        "Caminhos possíveis:\n" +
        "• conquistar novos clientes;\n" +
        "• aumentar o ticket médio;\n" +
        "• recuperar clientes antigos;\n" +
        "• melhorar a conversão comercial;\n" +
        "• criar novas ofertas.\n\n" +
        "Essa é uma estimativa baseada apenas nos dados cadastrados."
      );
    }
  }

  return (
    "Entendi sua pergunta. 👍\n\n" +
    "Com os dados atuais, consigo analisar:\n\n" +
    "📊 faturamento\n" +
    "👥 clientes\n" +
    "🎯 metas\n" +
    "💰 ticket médio\n" +
    "📈 crescimento\n" +
    "⚡ oportunidades\n" +
    "💵 custos e margem\n\n" +
    "Tente perguntar algo como:\n\n" +
    "\"Como estão minhas vendas?\"\n" +
    "\"Quanto falta para minha meta?\"\n" +
    "\"Como aumentar meu faturamento?\"\n" +
    "\"Como chegar a R$ 100.000?\""
  );
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

  adicionarMensagem(
    pergunta,
    "user"
  );

  input.value = "";

  const resposta =
    analisarPergunta(pergunta);

  setTimeout(() => {
    adicionarMensagem(
      resposta,
      "ai"
    );
  }, 350);
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
    "Objetivo principal: " +
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
