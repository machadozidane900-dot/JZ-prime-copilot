/* =========================================================
   JZ PRIME COPILOT
   Dashboard + Copilot local
   Não depende de API paga
========================================================= */

"use strict";

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
  } catch (erro) {
    console.error("Erro ao carregar empresa:", erro);
    empresa = {};
  }
}

/* =========================================================
   UTILITÁRIOS
========================================================= */

function numero(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

function dinheiro(valor) {
  return numero(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function inteiro(valor) {
  return numero(valor).toLocaleString("pt-BR");
}

function escaparHTML(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function obterFaturamento() {
  return numero(empresa.faturamento);
}

function obterClientes() {
  return numero(empresa.clientes);
}

function obterMeta() {
  return numero(empresa.meta);
}

function obterTicket() {
  const faturamento = obterFaturamento();
  const clientes = obterClientes();

  if (clientes <= 0) return 0;

  return faturamento / clientes;
}

function obterProgresso() {
  const faturamento = obterFaturamento();
  const meta = obterMeta();

  if (meta <= 0) return 0;

  return Math.min(100, (faturamento / meta) * 100);
}

function obterNome() {
  return (
    empresa.responsavel ||
    empresa.nome ||
    "você"
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function atualizarDashboard() {
  carregarEmpresa();

  const faturamento = obterFaturamento();
  const clientes = obterClientes();
  const meta = obterMeta();

  const oportunidades =
    clientes > 0
      ? Math.max(3, Math.round(clientes * 0.08))
      : 0;

  const progresso =
    meta > 0
      ? Math.round((faturamento / meta) * 100)
      : 0;

  const faturamentoCard =
    document.getElementById("faturamentoCard");

  const clientesCard =
    document.getElementById("clientesCard");

  const oportunidadesCard =
    document.getElementById("oportunidadesCard");

  if (faturamentoCard) {
    faturamentoCard.textContent = dinheiro(faturamento);
  }

  if (clientesCard) {
    clientesCard.textContent = inteiro(clientes);
  }

  if (oportunidadesCard) {
    oportunidadesCard.textContent = inteiro(oportunidades);
  }

  document.querySelectorAll("[data-meta]").forEach((el) => {
    el.textContent = dinheiro(meta);
  });

  document.querySelectorAll("[data-progresso]").forEach((el) => {
    el.textContent = `${progresso}%`;
  });

  document.querySelectorAll("[data-progresso-bar]").forEach((el) => {
    el.style.width = `${Math.min(100, progresso)}%`;
  });

  document.querySelectorAll("[data-objetivo]").forEach((el) => {
    el.textContent =
      empresa.objetivo || "Aumentar vendas";
  });

  document.querySelectorAll("[data-empresa]").forEach((el) => {
    el.textContent =
      empresa.empresa || "Minha empresa";
  });

  const metaFaturamento =
    document.getElementById("metaFaturamento");

  if (metaFaturamento) {
    metaFaturamento.textContent =
      dinheiro(faturamento);
  }

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

  if (saudacao) {
    saudacao.textContent =
      `Visão geral, ${obterNome()}`;
  }

  if (descricao) {
    descricao.textContent =
      "Controle, análise e estratégia em um só lugar.";
  }
}

/* =========================================================
   NOTIFICAÇÕES
========================================================= */

function notifyUser(mensagem) {
  alert(mensagem);
}

/* =========================================================
   GRÁFICO
========================================================= */

let graficoFaturamento = null;
let graficoClientes = null;
let graficoMeta = null;

function destruirGrafico(grafico) {
  if (grafico) {
    grafico.destroy();
  }
}

function criarGraficos() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js não carregado.");
    return;
  }

  const faturamento = obterFaturamento();
  const clientes = obterClientes();
  const meta = obterMeta();

  const faturamentoCanvas =
    document.getElementById("faturamentoChart");

  const clientesCanvas =
    document.getElementById("clientesChart");

  const metaCanvas =
    document.getElementById("metaChart");

  if (faturamentoCanvas) {
    destruirGrafico(graficoFaturamento);

    const ctx = faturamentoCanvas.getContext("2d");

    graficoFaturamento = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Mês -5",
          "Mês -4",
          "Mês -3",
          "Mês -2",
          "Mês -1",
          "Atual"
        ],
        datasets: [
          {
            label: "Faturamento",
            data: [
              faturamento * 0.70,
              faturamento * 0.76,
              faturamento * 0.82,
              faturamento * 0.88,
              faturamento * 0.94,
              faturamento
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  if (clientesCanvas) {
    destruirGrafico(graficoClientes);

    const ctx = clientesCanvas.getContext("2d");

    graficoClientes = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Mês -5",
          "Mês -4",
          "Mês -3",
          "Mês -2",
          "Mês -1",
          "Atual"
        ],
        datasets: [
          {
            label: "Clientes",
            data: [
              Math.round(clientes * 0.65),
              Math.round(clientes * 0.72),
              Math.round(clientes * 0.80),
              Math.round(clientes * 0.87),
              Math.round(clientes * 0.94),
              clientes
            ],
            tension: 0.35,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  if (metaCanvas) {
    destruirGrafico(graficoMeta);

    const ctx = metaCanvas.getContext("2d");

    const atingido =
      Math.min(faturamento, meta);

    const restante =
      Math.max(meta - faturamento, 0);

    graficoMeta = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          "Atingido",
          "Restante"
        ],
        datasets: [
          {
            data:
              meta > 0
                ? [atingido, restante]
                : [0, 1],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%"
      }
    });
  }
}

/* =========================================================
   CHAT
========================================================= */

function adicionarMensagem(tipo, texto) {
  const chat =
    document.getElementById("chatBox");

  if (!chat) return;

  const div =
    document.createElement("div");

  div.className = "message";

  if (tipo === "user") {
    div.innerHTML = `
      <div class="avatar">Você</div>

      <div class="message-content">
        <strong>Você</strong>
        <p>${escaparHTML(texto)}</p>
      </div>
    `;
  } else {
    div.innerHTML = `
      <div class="avatar">✦</div>

      <div class="message-content">
        <strong>JZ Prime Copilot</strong>
        <p>${texto}</p>
      </div>
    `;
  }

  chat.appendChild(div);

  chat.scrollTop = chat.scrollHeight;
}

/* =========================================================
   INTERPRETAÇÃO DE VALORES
========================================================= */

function extrairValorMonetario(texto) {
  if (!texto) return null;

  let textoLimpo =
    texto
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/r\$/g, "");

  const milhao =
    textoLimpo.match(/(\d+(?:[.,]\d+)?)milh(?:ão|oes|ões)/);

  if (milhao) {
    return parseFloat(
      milhao[1]
        .replace(/\./g, "")
        .replace(",", ".")
    ) * 1000000;
  }

  const mil =
    textoLimpo.match(/(\d+(?:[.,]\d+)?)mil/);

  if (mil) {
    return parseFloat(
      mil[1].replace(",", ".")
    ) * 1000;
  }

  const normal =
    textoLimpo.match(
      /(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+(?:[.,]\d+)?)/
    );

  if (!normal) return null;

  let valor =
    normal[1];

  if (valor.includes(".") && valor.includes(",")) {
    valor =
      valor
        .replace(/\./g, "")
        .replace(",", ".");
  } else if (valor.includes(",")) {
    valor =
      valor.replace(",", ".");
  }

  const resultado =
    Number(valor);

  return Number.isFinite(resultado)
    ? resultado
    : null;
}

/* =========================================================
   PLANO DE AÇÃO
========================================================= */

function gerarPlanoAcao() {
  const faturamento = obterFaturamento();
  const clientes = obterClientes();
  const meta = obterMeta();
  const ticket = obterTicket();

  const falta =
    Math.max(meta - faturamento, 0);

  let novosClientes = 0;

  if (ticket > 0) {
    novosClientes =
      Math.ceil(falta / ticket);
  }

  return `
    <strong>⚡ PLANO DE AÇÃO — JZ PRIME</strong>

    <br><br>

    <strong>Objetivo principal:</strong>
    ${escaparHTML(
      empresa.objetivo || "Aumentar vendas"
    )}

    <br><br>

    <strong>📊 Situação atual</strong>

    <br>
    Faturamento: ${dinheiro(faturamento)}
    <br>
    Clientes ativos: ${inteiro(clientes)}
    <br>
    Ticket médio: ${dinheiro(ticket)}

    <br><br>

    <strong>🎯 Meta</strong>

    <br>
    Meta mensal: ${dinheiro(meta)}
    <br>
    Falta para atingir: ${dinheiro(falta)}

    <br><br>

    <strong>🚀 Plano prático</strong>

    <br><br>

    <strong>1. PROSPECÇÃO</strong>
    <br>
    Aumentar diariamente a geração de novos contatos e oportunidades comerciais.

    <br><br>

    <strong>2. CONVERSÃO</strong>
    <br>
    Acompanhar propostas abertas e realizar follow-up até obter uma resposta.

    <br><br>

    <strong>3. TICKET MÉDIO</strong>
    <br>
    Criar ofertas de maior valor e buscar vendas complementares para clientes atuais.

    <br><br>

    <strong>4. RECUPERAÇÃO</strong>
    <br>
    Reativar clientes antigos e oportunidades que não foram fechadas.

    <br><br>

    <strong>5. CONTROLE</strong>
    <br>
    Revisar semanalmente faturamento, clientes, propostas, conversão e ticket médio.

    <br><br>

    <strong>📈 META COMERCIAL</strong>

    <br>
    ${
      ticket > 0
        ? `Mantendo o ticket médio atual, seriam necessários aproximadamente <strong>${inteiro(novosClientes)} novos clientes</strong> para cobrir o valor que falta.`
        : "Cadastre clientes ativos para calcular quantos novos clientes seriam necessários."
    }

    <br><br>

    <strong>⚠️ Observação:</strong>
    esta projeção é uma estimativa baseada exclusivamente nos dados cadastrados.
  `;
}

/* =========================================================
   ANÁLISE DE VENDAS
========================================================= */

function analisarVendas() {
  const faturamento = obterFaturamento();
  const clientes = obterClientes();
  const ticket = obterTicket();
  const meta = obterMeta();

  let texto = `
    <strong>📊 ANÁLISE DAS SUAS VENDAS</strong>

    <br><br>

    Seu faturamento atual é de <strong>${dinheiro(faturamento)}</strong> por mês.

    <br><br>

    Você possui <strong>${inteiro(clientes)}</strong> cliente(s) ativo(s).

    <br><br>

    Seu ticket médio aproximado é de <strong>${dinheiro(ticket)}</strong>.
  `;

  if (meta > 0) {
    const falta =
      Math.max(meta - faturamento, 0);

    const progresso =
      Math.round(
        (faturamento / meta) * 100
      );

    texto += `
      <br><br>

      Sua meta mensal é de <strong>${dinheiro(meta)}</strong>.

      <br>

      Progresso atual: <strong>${progresso}%</strong>.

      <br>

      ${
        falta > 0
          ? `Ainda faltam <strong>${dinheiro(falta)}</strong> para atingir a meta.`
          : `🎉 Sua meta mensal já foi atingida.`
      }
    `;
  }

  texto += `
    <br><br>

    <strong>🎯 Recomendações</strong>

    <br><br>

    1. Aumentar a conversão dos contatos em clientes.
    <br>
    2. Trabalhar ofertas de maior valor.
    <br>
    3. Recuperar clientes antigos.
    <br>
    4. Fazer follow-up das propostas.
    <br>
    5. Acompanhar o ticket médio semanalmente.

    <br><br>

    Objetivo cadastrado:
    <strong>${escaparHTML(
      empresa.objetivo || "Aumentar vendas"
    )}</strong>
  `;

  return texto;
}

/* =========================================================
   META PERSONALIZADA
========================================================= */

function analisarMeta(valorDesejado) {
  const atual =
    obterFaturamento();

  const clientes =
    obterClientes();

  const ticket =
    obterTicket();

  if (!valorDesejado || valorDesejado <= 0) {
    return `
      Informe uma meta válida.

      <br><br>

      Exemplo:
      <strong>Como chegar a R$ 130.000?</strong>
    `;
  }

  const falta =
    Math.max(
      valorDesejado - atual,
      0
    );

  const percentual =
    atual > 0
      ? ((valorDesejado - atual) / atual) * 100
      : 0;

  let novosClientes = 0;

  if (ticket > 0) {
    novosClientes =
      Math.ceil(falta / ticket);
  }

  let resposta = `
    <strong>🎯 COMO CHEGAR A ${dinheiro(valorDesejado)}</strong>

    <br><br>

    Faturamento atual:
    <strong>${dinheiro(atual)}</strong>

    <br>

    Meta desejada:
    <strong>${dinheiro(valorDesejado)}</strong>

    <br>

    Falta gerar:
    <strong>${dinheiro(falta)}</strong>
  `;

  if (atual > 0) {
    resposta += `
      <br><br>

      Você precisa aumentar o faturamento em aproximadamente
      <strong>${percentual.toFixed(1)}%</strong>
      em relação ao faturamento atual.
    `;
  }

  resposta += `
    <br><br>

    <strong>🚀 Caminho recomendado</strong>

    <br><br>

    1. Aumentar a quantidade de oportunidades.
    <br>
    2. Melhorar a conversão das propostas.
    <br>
    3. Aumentar o ticket médio.
    <br>
    4. Recuperar clientes antigos.
    <br>
    5. Criar ofertas adicionais para clientes atuais.
  `;

  if (ticket > 0) {
    resposta += `
      <br><br>

      Mantendo o ticket médio atual de
      <strong>${dinheiro(ticket)}</strong>,
      seriam necessários aproximadamente
      <strong>${inteiro(novosClientes)} novos clientes</strong>
      para cobrir toda a diferença.
    `;
  }

  resposta += `
    <br><br>

    <strong>📌 Estratégia:</strong>

    Não dependa somente de conseguir mais clientes.
    Trabalhe simultaneamente aquisição, conversão,
    ticket médio e recuperação de clientes.
  `;

  return resposta;
}

/* =========================================================
   TICKET MÉDIO
========================================================= */

function analisarTicket() {
  const faturamento =
    obterFaturamento();

  const clientes =
    obterClientes();

  const ticket =
    obterTicket();

  if (clientes <= 0) {
    return `
      <strong>💰 TICKET MÉDIO</strong>

      <br><br>

      Ainda não é possível calcular seu ticket médio
      porque não existem clientes ativos cadastrados.
    `;
  }

  return `
    <strong>💰 SEU TICKET MÉDIO</strong>

    <br><br>

    Faturamento:
    <strong>${dinheiro(faturamento)}</strong>

    <br>

    Clientes ativos:
    <strong>${inteiro(clientes)}</strong>

    <br>

    Ticket médio:
    <strong>${dinheiro(ticket)}</strong>

    <br><br>

    Isso significa que, em média, cada cliente representa
    aproximadamente <strong>${dinheiro(ticket)}</strong>
    de faturamento mensal.

    <br><br>

    <strong>Para aumentar o faturamento:</strong>

    <br><br>

    • aumentar o número de clientes;
    <br>
    • aumentar o valor médio das vendas;
    <br>
    • criar ofertas complementares;
    <br>
    • aumentar a frequência de compra.
  `;
}

/* =========================================================
   META
========================================================= */

function analisarMetaAtual() {
  const faturamento =
    obterFaturamento();

  const meta =
    obterMeta();

  if (meta <= 0) {
    return `
      <strong>🎯 META MENSAL</strong>

      <br><br>

      Sua meta mensal ainda não foi cadastrada.
    `;
  }

  const falta =
    Math.max(meta - faturamento, 0);

  const progresso =
    Math.round(
      (faturamento / meta) * 100
    );

  if (falta <= 0) {
    return `
      <strong>🎉 META ATINGIDA</strong>

      <br><br>

      Seu faturamento atual é
      <strong>${dinheiro(faturamento)}</strong>.

      <br>

      Sua meta é
      <strong>${dinheiro(meta)}</strong>.

      <br><br>

      Você já atingiu ou ultrapassou sua meta mensal.
    `;
  }

  return `
    <strong>🎯 ANÁLISE DA META</strong>

    <br><br>

    Faturamento atual:
    <strong>${dinheiro(faturamento)}</strong>

    <br>

    Meta mensal:
    <strong>${dinheiro(meta)}</strong>

    <br>

    Progresso:
    <strong>${progresso}%</strong>

    <br>

    Falta:
    <strong>${dinheiro(falta)}</strong>

    <br><br>

    <strong>Prioridade:</strong>

    Trabalhar novas vendas, follow-up,
    recuperação de clientes e aumento do ticket médio.
  `;
}

/* =========================================================
   CUSTOS E MARGEM
========================================================= */

function analisarCustos() {
  return `
    <strong>💰 CUSTOS E MARGEM</strong>

    <br><br>

    Atualmente o cadastro da empresa não possui
    informações suficientes sobre custos para eu calcular
    sua margem real.

    <br><br>

    <strong>Para melhorar a margem:</strong>

    <br><br>

    1. Identifique os principais custos fixos.
    <br>
    2. Separe custos fixos de custos variáveis.
    <br>
    3. Identifique produtos ou serviços com baixa margem.
    <br>
    4. Negocie despesas recorrentes.
    <br>
    5. Aumente preços quando houver espaço comercial.

    <br><br>

    <strong>Importante:</strong>
    não vou inventar uma margem sem ter os custos cadastrados.
  `;
}

/* =========================================================
   CRESCIMENTO
========================================================= */

function analisarCrescimento() {
  const faturamento =
    obterFaturamento();

  const clientes =
    obterClientes();

  const ticket =
    obterTicket();

  return `
    <strong>📈 ANÁLISE DE CRESCIMENTO</strong>

    <br><br>

    Faturamento atual:
    <strong>${dinheiro(faturamento)}</strong>

    <br>

    Clientes:
    <strong>${inteiro(clientes)}</strong>

    <br>

    Ticket médio:
    <strong>${dinheiro(ticket)}</strong>

    <br><br>

    Para crescer de forma consistente, trabalhe três
    alavancas:

    <br><br>

    <strong>1. Mais clientes</strong>
    <br>
    Aumentar a geração de oportunidades.

    <br><br>

    <strong>2. Maior ticket</strong>
    <br>
    Aumentar o valor médio de cada venda.

    <br><br>

    <strong>3. Mais recorrência</strong>
    <br>
    Fazer clientes atuais comprarem novamente.
  `;
}

/* =========================================================
   RESPOSTA PRINCIPAL
========================================================= */

function gerarRespostaLocal(pergunta) {
  carregarEmpresa();

  const original =
    String(pergunta || "").trim();

  const texto =
    original.toLowerCase();

  if (!original) {
    return `
      Pode perguntar. 👋

      <br><br>

      Posso analisar suas vendas, metas, clientes,
      ticket médio, crescimento e criar planos de ação.
    `;
  }

  /* PLANO */

  if (
    texto.includes("plano de ação") ||
    texto.includes("plano de acao") ||
    texto.includes("o que devo fazer") ||
    texto.includes("o que eu faço") ||
    texto.includes("como melhorar")
  ) {
    if (
      texto.includes("margem") ||
      texto.includes("custo")
    ) {
      return analisarCustos();
    }

    return gerarPlanoAcao();
  }

  /* META PERSONALIZADA */

  const palavrasMeta =
    [
      "chegar",
      "atingir",
      "bater",
      "alcançar",
      "alcancar",
      "faturar"
    ];

  const temPalavraMeta =
    palavrasMeta.some(
      palavra => texto.includes(palavra)
    );

  const valorEncontrado =
    extrairValorMonetario(original);

  if (
    temPalavraMeta &&
    valorEncontrado &&
    valorEncontrado > 1000
  ) {
    return analisarMeta(valorEncontrado);
  }

  /* VENDAS */

  if (
    texto.includes("venda") ||
    texto.includes("vendas") ||
    texto.includes("comercial") ||
    texto.includes("clientes novos")
  ) {
    return analisarVendas();
  }

  /* TICKET */

  if (
    texto.includes("ticket") ||
    texto.includes("valor médio") ||
    texto.includes("valor medio")
  ) {
    return analisarTicket();
  }

  /* META */

  if (
    texto.includes("meta") ||
    texto.includes("quanto falta") ||
    texto.includes("falta para")
  ) {
    return analisarMetaAtual();
  }

  /* CUSTOS */

  if (
    texto.includes("custo") ||
    texto.includes("custos") ||
    texto.includes("despesa") ||
    texto.includes("margem") ||
    texto.includes("lucro")
  ) {
    return analisarCustos();
  }

  /* CRESCIMENTO */

  if (
    texto.includes("crescer") ||
    texto.includes("crescimento") ||
    texto.includes("aumentar faturamento") ||
    texto.includes("aumentar vendas")
  ) {
    return analisarCrescimento();
  }

  /* SAUDAÇÃO */

  if (
    texto === "oi" ||
    texto === "olá" ||
    texto === "ola" ||
    texto.includes("bom dia") ||
    texto.includes("boa tarde") ||
    texto.includes("boa noite")
  ) {
    return `
      Olá, ${escaparHTML(obterNome())}! 👋

      <br><br>

      Sou o <strong>JZ Prime Copilot</strong>.

      <br><br>

      Já tenho os indicadores cadastrados da sua empresa
      e posso analisar:

      <br><br>

      📊 Faturamento
      <br>
      👥 Clientes
      <br>
      🎯 Metas
      <br>
      💰 Ticket médio
      <br>
      📈 Crescimento
      <br>
      ⚡ Plano de ação
      <br>
      💵 Custos e margem

      <br><br>

      Pode perguntar diretamente.
    `;
  }

  /* RESPOSTA GENÉRICA */

  return `
    Entendi. 👍

    <br><br>

    Com os dados cadastrados da sua empresa,
    consigo analisar:

    <br><br>

    📊 <strong>Vendas</strong>
    <br>
    🎯 <strong>Metas</strong>
    <br>
    👥 <strong>Clientes</strong>
    <br>
    💰 <strong>Ticket médio</strong>
    <br>
    📈 <strong>Crescimento</strong>
    <br>
    ⚡ <strong>Plano de ação</strong>
    <br>
    💵 <strong>Custos e margem</strong>

    <br><br>

    Tente uma pergunta como:

    <br><br>

    • Como estão minhas vendas?
    <br>
    • Quanto falta para minha meta?
    <br>
    • Como aumentar meu faturamento?
    <br>
    • Qual é meu ticket médio?
    <br>
    • Como chegar a R$ 130.000?
    <br>
    • Crie um plano de ação.
  `;
}

/* =========================================================
   ENVIAR PERGUNTA
========================================================= */

function sendCopilot() {
  const input =
    document.getElementById("copilotInput");

  if (!input) return;

  const pergunta =
    input.value.trim();

  if (!pergunta) return;

  adicionarMensagem(
    "user",
    pergunta
  );

  input.value = "";

  const resposta =
    gerarRespostaLocal(pergunta);

  setTimeout(() => {
    adicionarMensagem(
      "bot",
      resposta
    );
  }, 250);
}

/* =========================================================
   ENTER
========================================================= */

function handleEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendCopilot();
  }
}

/* =========================================================
   RELATÓRIO
========================================================= */

function downloadReport() {
  carregarEmpresa();

  const faturamento =
    obterFaturamento();

  const clientes =
    obterClientes();

  const meta =
    obterMeta();

  const ticket =
    obterTicket();

  const progresso =
    obterProgresso();

  const texto = `
JZ PRIME COPILOT
RESUMO EXECUTIVO

Empresa:
${empresa.empresa || "Não informado"}

Responsável:
${empresa.responsavel || "Não informado"}

Segmento:
${empresa.segmento || "Não informado"}

Faturamento:
${dinheiro(faturamento)}

Clientes ativos:
${inteiro(clientes)}

Ticket médio:
${dinheiro(ticket)}

Meta mensal:
${dinheiro(meta)}

Progresso da meta:
${progresso.toFixed(0)}%

Objetivo:
${empresa.objetivo || "Não informado"}

Gerado pelo JZ Prime Copilot.
  `.trim();

  const blob =
    new Blob(
      [texto],
      { type: "text/plain;charset=utf-8" }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    "jz-prime-relatorio.txt";

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);
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

    console.log(
      "JZ Prime Copilot iniciado."
    );

    console.log(
      "Empresa:",
      empresa
    );
  }
);
