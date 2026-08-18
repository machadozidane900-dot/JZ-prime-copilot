/* =========================================================
   JZ PRIME COPILOT
   DASHBOARD.JS
   IA LOCAL — SEM API / SEM CUSTO
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

carregarEmpresa();


/* =========================================================
   FUNÇÕES DE FORMATAÇÃO
========================================================= */

function numero(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

function formatarMoeda(valor) {
  return numero(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatarNumero(valor) {
  return numero(valor).toLocaleString("pt-BR");
}


/* =========================================================
   ATUALIZAR DASHBOARD
========================================================= */

function atualizarDashboard() {

  carregarEmpresa();

  const faturamento = numero(empresa.faturamento);
  const clientes = numero(empresa.clientes);
  const meta = numero(empresa.meta);

  const faturamentoCard =
    document.getElementById("faturamentoCard");

  const clientesCard =
    document.getElementById("clientesCard");

  const oportunidadesCard =
    document.getElementById("oportunidadesCard");

  if (faturamentoCard) {
    faturamentoCard.textContent =
      formatarMoeda(faturamento);
  }

  if (clientesCard) {
    clientesCard.textContent =
      formatarNumero(clientes);
  }

  if (oportunidadesCard) {
    const oportunidades =
      Math.max(1, Math.round(clientes * 0.08));

    oportunidadesCard.textContent =
      formatarNumero(oportunidades);
  }

  document
    .querySelectorAll("[data-meta]")
    .forEach(function (elemento) {

      elemento.textContent =
        formatarMoeda(meta);

    });


  const progresso =
    meta > 0
      ? Math.min((faturamento / meta) * 100, 100)
      : 0;


  document
    .querySelectorAll("[data-progresso]")
    .forEach(function (elemento) {

      elemento.textContent =
        Math.round(progresso) + "%";

    });


  document
    .querySelectorAll("[data-progresso-bar]")
    .forEach(function (elemento) {

      elemento.style.width =
        Math.min(progresso, 100) + "%";

    });


  const metaFaturamento =
    document.getElementById("metaFaturamento");

  if (metaFaturamento) {

    metaFaturamento.textContent =
      formatarMoeda(faturamento);

  }


  document
    .querySelectorAll("[data-objetivo]")
    .forEach(function (elemento) {

      elemento.textContent =
        empresa.objetivo || "Aumentar vendas";

    });


  document
    .querySelectorAll("[data-empresa]")
    .forEach(function (elemento) {

      elemento.textContent =
        empresa.empresa || "Minha empresa";

    });


  atualizarTextoPainel();
}


/* =========================================================
   TEXTOS DO PAINEL
========================================================= */

function atualizarTextoPainel() {

  const saudacao =
    document.getElementById("saudacao");

  const descricao =
    document.getElementById("descricaoPainel");


  const responsavel =
    empresa.responsavel || "";


  if (saudacao) {

    saudacao.textContent =
      responsavel
        ? "Visão geral, " + responsavel
        : "Visão geral";

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
   CHAT
========================================================= */

function adicionarMensagem(texto, tipo) {

  const chatBox =
    document.getElementById("chatBox");

  if (!chatBox) return;


  const mensagem =
    document.createElement("div");

  mensagem.className =
    "message";


  if (tipo === "user") {

    mensagem.innerHTML = `
      <div class="avatar">Você</div>

      <div class="message-content">
        <strong>Você</strong>
        <p>${escaparHTML(texto)}</p>
      </div>
    `;

  } else {

    mensagem.innerHTML = `
      <div class="avatar">✦</div>

      <div class="message-content">
        <strong>JZ Prime Copilot</strong>
        <p>${texto}</p>
      </div>
    `;

  }


  chatBox.appendChild(mensagem);

  chatBox.scrollTop =
    chatBox.scrollHeight;
}


/* =========================================================
   SEGURANÇA
========================================================= */

function escaparHTML(texto) {

  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   DADOS ATUAIS
========================================================= */

function obterDados() {

  carregarEmpresa();

  const faturamento =
    numero(empresa.faturamento);

  const clientes =
    numero(empresa.clientes);

  const meta =
    numero(empresa.meta);

  const ticket =
    clientes > 0
      ? faturamento / clientes
      : 0;

  const falta =
    Math.max(meta - faturamento, 0);

  const percentual =
    meta > 0
      ? (faturamento / meta) * 100
      : 0;


  return {
    nome: empresa.empresa || "sua empresa",
    responsavel: empresa.responsavel || "",
    segmento: empresa.segmento || "",
    faturamento,
    clientes,
    meta,
    objetivo: empresa.objetivo || "Aumentar vendas",
    ticket,
    falta,
    percentual
  };

}


/* =========================================================
   COPILOT
========================================================= */

function askCopilot(pergunta) {

  if (!pergunta) return;

  const input =
    document.getElementById("copilotInput");

  if (input) {
    input.value = "";
  }

  adicionarMensagem(
    pergunta,
    "user"
  );


  const resposta =
    gerarRespostaLocal(pergunta);


  setTimeout(function () {

    adicionarMensagem(
      resposta,
      "copilot"
    );

  }, 250);

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


  if (!pergunta) {

    input.focus();

    return;

  }


  askCopilot(pergunta);

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
   IA LOCAL
========================================================= */

function gerarRespostaLocal(pergunta) {

  const dados =
    obterDados();


  const texto =
    pergunta
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");


  /* =======================================================
     SAUDAÇÃO
  ======================================================= */

  if (
    texto === "oi" ||
    texto === "ola" ||
    texto.includes("bom dia") ||
    texto.includes("boa tarde") ||
    texto.includes("boa noite")
  ) {

    return `
      Olá, ${escaparHTML(dados.responsavel || "você")}! 👋<br><br>

      Sou o <strong>JZ Prime Copilot</strong>.<br><br>

      Já tenho os indicadores cadastrados da sua empresa
      e posso analisar:<br><br>

      📊 Faturamento<br>
      👥 Clientes<br>
      🎯 Metas<br>
      💰 Ticket médio<br>
      📈 Crescimento<br>
      ⚡ Plano de ação<br>
      💵 Custos e margem<br><br>

      Você pode perguntar, por exemplo:<br><br>

      • Como estão minhas vendas?<br>
      • Quanto falta para minha meta?<br>
      • Como aumentar meu faturamento?<br>
      • Qual é meu ticket médio?<br>
      • Como chegar a R$ 100.000?<br>
      • Crie um plano de ação.
    `;

  }


  /* =======================================================
     PLANO DE AÇÃO
  ======================================================= */

  if (
    texto.includes("plano de acao") ||
    texto.includes("plano de ação") ||
    texto.includes("o que devo fazer") ||
    texto.includes("proximos passos") ||
    texto.includes("proximos passos")
  ) {

    const clientesNecessarios =
      dados.ticket > 0 && dados.falta > 0
        ? Math.ceil(dados.falta / dados.ticket)
        : 0;


    return `
      ⚡ <strong>PLANO DE AÇÃO — JZ PRIME</strong><br><br>

      <strong>Objetivo principal:</strong>
      ${escaparHTML(dados.objetivo)}<br><br>

      📊 <strong>SITUAÇÃO ATUAL</strong><br><br>

      Faturamento:
      ${formatarMoeda(dados.faturamento)}<br>

      Clientes ativos:
      ${formatarNumero(dados.clientes)}<br>

      Ticket médio:
      ${formatarMoeda(dados.ticket)}<br><br>

      🎯 <strong>META</strong><br><br>

      Meta mensal:
      ${formatarMoeda(dados.meta)}<br>

      Falta para atingir:
      ${formatarMoeda(dados.falta)}<br><br>

      🚀 <strong>PLANO PRÁTICO</strong><br><br>

      <strong>1. PROSPECÇÃO</strong><br>
      Aumentar diariamente o número de novos contatos
      comerciais e oportunidades.<br><br>

      <strong>2. CONVERSÃO</strong><br>
      Acompanhar cada proposta enviada e fazer
      follow-up até obter uma resposta.<br><br>

      <strong>3. TICKET MÉDIO</strong><br>
      Criar ofertas de maior valor e buscar vendas
      complementares para os clientes atuais.<br><br>

      <strong>4. RECUPERAÇÃO</strong><br>
      Entrar em contato com clientes antigos que
      não compram atualmente.<br><br>

      <strong>5. CONTROLE</strong><br>
      Acompanhar semanalmente faturamento, clientes,
      propostas e vendas fechadas.<br><br>

      📈 <strong>META COMERCIAL</strong><br><br>

      ${
        clientesNecessarios > 0
          ? "Mantendo o ticket médio atual, seriam necessários aproximadamente <strong>" +
            formatarNumero(clientesNecessarios) +
            " novos clientes</strong> para cobrir o valor que falta."
          : "Cadastre uma meta e um faturamento válidos para calcular a quantidade de novos clientes necessária."
      }<br><br>

      ⚠️ Essa projeção é uma estimativa baseada
      exclusivamente nos dados cadastrados.
    `;

  }


  /* =======================================================
     VENDAS
  ======================================================= */

  if (
    texto.includes("venda") ||
    texto.includes("vendas") ||
    texto.includes("comercial")
  ) {

    return `
      📊 <strong>ANÁLISE DAS SUAS VENDAS</strong><br><br>

      Seu faturamento atual é de
      <strong>${formatarMoeda(dados.faturamento)}</strong>
      por mês.<br><br>

      Você possui
      <strong>${formatarNumero(dados.clientes)}</strong>
      cliente(s) ativo(s).<br><br>

      Seu ticket médio aproximado é de
      <strong>${formatarMoeda(dados.ticket)}</strong>.<br><br>

      🎯 <strong>Estratégia recomendada:</strong><br><br>

      1. Aumentar a conversão dos contatos em clientes.<br>
      2. Trabalhar ofertas de maior valor.<br>
      3. Recuperar clientes antigos.<br>
      4. Acompanhar semanalmente propostas e fechamentos.<br><br>

      <strong>Objetivo cadastrado:</strong>
      ${escaparHTML(dados.objetivo)}
    `;

  }


  /* =======================================================
     META
  ======================================================= */

  if (
    texto.includes("meta") ||
    texto.includes("quanto falta") ||
    texto.includes("atingir")
  ) {

    if (dados.meta <= 0) {

      return `
        🎯 Ainda não existe uma meta mensal válida
        cadastrada.<br><br>

        Cadastre a meta da empresa para que eu possa
        calcular o progresso e quanto falta para atingir
        o objetivo.
      `;

    }


    return `
      🎯 <strong>ANÁLISE DA META</strong><br><br>

      Faturamento atual:
      <strong>${formatarMoeda(dados.faturamento)}</strong><br><br>

      Meta mensal:
      <strong>${formatarMoeda(dados.meta)}</strong><br><br>

      Progresso:
      <strong>${dados.percentual.toFixed(1)}%</strong><br><br>

      ${
        dados.falta > 0
          ? "Falta alcançar <strong>" +
            formatarMoeda(dados.falta) +
            "</strong> para atingir sua meta."
          : "🎉 Parabéns! Sua meta mensal já foi atingida."
      }
    `;

  }


  /* =======================================================
     TICKET MÉDIO
  ======================================================= */

  if (
    texto.includes("ticket") ||
    texto.includes("valor medio") ||
    texto.includes("valor médio")
  ) {

    return `
      💰 <strong>TICKET MÉDIO</strong><br><br>

      Faturamento:
      ${formatarMoeda(dados.faturamento)}<br>

      Clientes ativos:
      ${formatarNumero(dados.clientes)}<br><br>

      Seu ticket médio aproximado é de
      <strong>${formatarMoeda(dados.ticket)}</strong>.
    `;

  }


  /* =======================================================
     CLIENTES
  ======================================================= */

  if (
    texto.includes("cliente") ||
    texto.includes("clientes")
  ) {

    return `
      👥 <strong>ANÁLISE DA CARTEIRA</strong><br><br>

      Clientes ativos:
      <strong>${formatarNumero(dados.clientes)}</strong><br><br>

      Faturamento mensal:
      <strong>${formatarMoeda(dados.faturamento)}</strong><br><br>

      Ticket médio:
      <strong>${formatarMoeda(dados.ticket)}</strong><br><br>

      Para crescer, recomendo trabalhar três frentes:<br><br>

      1. Conquistar novos clientes.<br>
      2. Aumentar o valor comprado pelos clientes atuais.<br>
      3. Recuperar clientes antigos.
    `;

  }


  /* =======================================================
     CUSTOS / MARGEM
  ======================================================= */

  if (
    texto.includes("custo") ||
    texto.includes("custos") ||
    texto.includes("margem") ||
    texto.includes("lucro")
  ) {

    return `
      💰 <strong>CUSTOS E MARGEM</strong><br><br>

      Seu faturamento atual é de
      <strong>${formatarMoeda(dados.faturamento)}</strong>.<br><br>

      Para melhorar a margem, recomendo:<br><br>

      1. Identificar os maiores custos da empresa.<br>
      2. Negociar fornecedores.<br>
      3. Eliminar despesas que não geram retorno.<br>
      4. Revisar preços e margem de cada produto ou serviço.<br>
      5. Separar custos fixos e variáveis.<br><br>

      ⚠️ Para calcular sua margem real, ainda precisamos
      cadastrar os custos da empresa.
    `;

  }


  /* =======================================================
     AUMENTAR FATURAMENTO
  ======================================================= */

  if (
    texto.includes("aumentar faturamento") ||
    texto.includes("aumentar vendas") ||
    texto.includes("crescer") ||
    texto.includes("crescimento")
  ) {

    return `
      📈 <strong>COMO AUMENTAR O FATURAMENTO</strong><br><br>

      Atualmente:
      <strong>${formatarMoeda(dados.faturamento)}</strong><br><br>

      Sua meta:
      <strong>${formatarMoeda(dados.meta)}</strong><br><br>

      Eu trabalharia nestas 4 frentes:<br><br>

      <strong>1. Mais clientes</strong><br>
      Aumentar a prospecção diária.<br><br>

      <strong>2. Maior ticket</strong><br>
      Criar ofertas de maior valor.<br><br>

      <strong>3. Recompra</strong><br>
      Fazer clientes atuais comprarem novamente.<br><br>

      <strong>4. Recuperação</strong><br>
      Reativar clientes antigos.
    `;

  }


  /* =======================================================
     META ESPECÍFICA — EX: "COMO CHEGAR A 130 MIL?"
  ======================================================= */

  const valoresEncontrados =
    pergunta.match(
      /(?:r\$\s*)?(\d+(?:[.,]\d+)?)(?:\s*(?:mil|k))?/gi
    );


  if (
    valoresEncontrados &&
    (
      texto.includes("chegar") ||
      texto.includes("atingir") ||
      texto.includes("faturamento") ||
      texto.includes("meta")
    )
  ) {

    let alvo = null;

    for (
      let i = 0;
      i < valoresEncontrados.length;
      i++
    ) {

      let valorTexto =
        valoresEncontrados[i]
          .toLowerCase()
          .replace(/\s/g, "")
          .replace("r$", "");


      let multiplicador = 1;

      if (valorTexto.endsWith("mil")) {

        multiplicador = 1000;

        valorTexto =
          valorTexto.replace("mil", "");

      }

      if (valorTexto.endsWith("k")) {

        multiplicador = 1000;

        valorTexto =
          valorTexto.replace("k", "");

      }


      valorTexto =
        valorTexto.replace(/\./g, "")
                   .replace(",", ".");


      const valor =
        Number(valorTexto) * multiplicador;


      if (
        Number.isFinite(valor) &&
        valor > 0
      ) {

        alvo = valor;

      }

    }


    if (alvo) {

      const falta =
        Math.max(
          alvo - dados.faturamento,
          0
        );


      const percentual =
        dados.faturamento > 0
          ? ((alvo - dados.faturamento) /
             dados.faturamento) * 100
          : 0;


      const novosClientes =
        dados.ticket > 0
          ? Math.ceil(falta / dados.ticket)
          : 0;


      return `
        🎯 <strong>PLANO PARA CHEGAR A ${formatarMoeda(alvo)}</strong><br><br>

        Seu faturamento atual:
        <strong>${formatarMoeda(dados.faturamento)}</strong><br><br>

        Objetivo:
        <strong>${formatarMoeda(alvo)}</strong><br><br>

        Falta gerar:
        <strong>${formatarMoeda(falta)}</strong><br><br>

        Crescimento necessário:
        <strong>${Math.max(percentual, 0).toFixed(1)}%</strong><br><br>

        🚀 <strong>Como trabalhar essa diferença:</strong><br><br>

        • conquistar novos clientes;<br>
        • aumentar o ticket médio;<br>
        • recuperar clientes antigos;<br>
        • aumentar a conversão comercial;<br>
        • criar ofertas de maior valor.<br><br>

        ${
          novosClientes > 0
            ? "📊 Mantendo o ticket médio atual de <strong>" +
              formatarMoeda(dados.ticket) +
              "</strong>, seriam necessários aproximadamente <strong>" +
              formatarNumero(novosClientes) +
              " novos clientes</strong> para cobrir essa diferença."
            : "📊 Cadastre clientes ativos para calcular quantos novos clientes seriam necessários."
        }
      `;

    }

  }


  /* =======================================================
     RESPOSTA PADRÃO
  ======================================================= */

  return `
    🤖 <strong>JZ Prime Copilot</strong><br><br>

    Entendi sua pergunta. Posso analisar os dados reais
    cadastrados da sua empresa.<br><br>

    📊 Faturamento:
    <strong>${formatarMoeda(dados.faturamento)}</strong><br>

    👥 Clientes:
    <strong>${formatarNumero(dados.clientes)}</strong><br>

    🎯 Meta:
    <strong>${formatarMoeda(dados.meta)}</strong><br>

    💰 Ticket médio:
    <strong>${formatarMoeda(dados.ticket)}</strong><br><br>

    Experimente perguntar:<br><br>

    • Como estão minhas vendas?<br>
    • Quanto falta para minha meta?<br>
    • Como aumentar meu faturamento?<br>
    • Qual é meu ticket médio?<br>
    • Como chegar a R$ 100.000?<br>
    • Crie um plano de ação.
  `;

}


/* =========================================================
   RELATÓRIO
========================================================= */

function downloadReport() {

  const dados =
    obterDados();


  const relatorio = `

JZ PRIME COPILOT
RESUMO EXECUTIVO

Empresa:
${dados.nome}

Responsável:
${dados.responsavel}

Segmento:
${dados.segmento}

Faturamento mensal:
${formatarMoeda(dados.faturamento)}

Clientes ativos:
${formatarNumero(dados.clientes)}

Meta mensal:
${formatarMoeda(dados.meta)}

Ticket médio:
${formatarMoeda(dados.ticket)}

Progresso da meta:
${dados.percentual.toFixed(1)}%

Objetivo:
${dados.objetivo}

Gerado pelo JZ Prime Copilot.
`;


  const blob =
    new Blob(
      [relatorio],
      { type: "text/plain;charset=utf-8" }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    "relatorio-jz-prime.txt";


  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);

}


/* =========================================================
   GRÁFICOS
========================================================= */

let faturamentoChart = null;
let clientesChart = null;
let metaChart = null;


function destruirGrafico(grafico) {

  if (grafico) {
    grafico.destroy();
  }

}


function criarGraficos() {

  if (
    typeof Chart === "undefined"
  ) {

    console.warn(
      "Chart.js não carregado."
    );

    return;

  }


  const dados =
    obterDados();


  /* =======================================================
     FATURAMENTO
  ======================================================= */

  const canvasFaturamento =
    document.getElementById(
      "faturamentoChart"
    );


  if (canvasFaturamento) {

    destruirGrafico(
      faturamentoChart
    );


    faturamentoChart =
      new Chart(
        canvasFaturamento,
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

                data: [
                  dados.faturamento * 0.65,
                  dados.faturamento * 0.72,
                  dados.faturamento * 0.81,
                  dados.faturamento * 0.88,
                  dados.faturamento * 0.94,
                  dados.faturamento
                ],

                borderWidth: 1
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
            }

          }

        }
      );

  }


  /* =======================================================
     CLIENTES
  ======================================================= */

  const canvasClientes =
    document.getElementById(
      "clientesChart"
    );


  if (canvasClientes) {

    destruirGrafico(
      clientesChart
    );


    clientesChart =
      new Chart(
        canvasClientes,
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

                data: [
                  Math.max(0, Math.round(dados.clientes * 0.55)),
                  Math.max(0, Math.round(dados.clientes * 0.64)),
                  Math.max(0, Math.round(dados.clientes * 0.72)),
                  Math.max(0, Math.round(dados.clientes * 0.81)),
                  Math.max(0, Math.round(dados.clientes * 0.91)),
                  dados.clientes
                ],

                tension: 0.35,

                borderWidth: 2,

                fill: false
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
            }

          }

        }
      );

  }


  /* =======================================================
     META
  ======================================================= */

  const canvasMeta =
    document.getElementById(
      "metaChart"
    );


  if (canvasMeta) {

    destruirGrafico(
      metaChart
    );


    const percentual =
      dados.meta > 0
        ? Math.min(
            (dados.faturamento /
             dados.meta) * 100,
            100
          )
        : 0;


    metaChart =
      new Chart(
        canvasMeta,
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
                  percentual,
                  Math.max(
                    100 - percentual,
                    0
                  )
                ],

                borderWidth: 0
              }
            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "70%",

            plugins: {
              legend: {
                display: false
              }
            }

          }

        }
      );

  }

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    carregarEmpresa();

    atualizarDashboard();

    criarGraficos();

  }
);


/* =========================================================
   ATUALIZAÇÃO QUANDO VOLTAR PARA A ABA
========================================================= */

window.addEventListener(
  "focus",
  function () {

    carregarEmpresa();

    atualizarDashboard();

  }
);
