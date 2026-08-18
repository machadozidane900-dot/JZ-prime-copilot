/* =========================================================
   JZ PRIME COPILOT
   DASHBOARD.JS
   VERSÃO LOCAL - SEM API PAGA
========================================================= */

"use strict";


/* =========================================================
   DADOS DA EMPRESA
========================================================= */

let empresa = {};

try {
  const dados = localStorage.getItem("empresa");

  if (dados) {
    empresa = JSON.parse(dados);
  }
} catch (erro) {
  console.error("Erro ao carregar empresa:", erro);
  empresa = {};
}


/* =========================================================
   VALORES PADRÃO
========================================================= */

empresa.empresa = empresa.empresa || "Minha empresa";
empresa.responsavel = empresa.responsavel || "Usuário";
empresa.segmento = empresa.segmento || "Não informado";
empresa.faturamento = Number(empresa.faturamento) || 0;
empresa.clientes = Number(empresa.clientes) || 0;
empresa.meta = Number(empresa.meta) || 0;
empresa.objetivo = empresa.objetivo || "Aumentar vendas";


/* =========================================================
   FUNÇÕES DE FORMATAÇÃO
========================================================= */

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


function formatarNumero(valor) {
  return Number(valor || 0).toLocaleString("pt-BR");
}


/* =========================================================
   TICKET MÉDIO
========================================================= */

function calcularTicket() {

  if (empresa.clientes <= 0) {
    return 0;
  }

  return empresa.faturamento / empresa.clientes;
}


/* =========================================================
   PROGRESSO DA META
========================================================= */

function calcularProgresso() {

  if (empresa.meta <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (empresa.faturamento / empresa.meta) * 100
    )
  );
}


/* =========================================================
   OPORTUNIDADES
========================================================= */

function calcularOportunidades() {

  if (empresa.clientes <= 0) {
    return 0;
  }

  return Math.max(
    1,
    Math.round(empresa.clientes * 0.08)
  );
}


/* =========================================================
   ATUALIZAR DASHBOARD
========================================================= */

function atualizarDashboard() {

  const faturamentoCard =
    document.getElementById("faturamentoCard");

  const clientesCard =
    document.getElementById("clientesCard");

  const oportunidadesCard =
    document.getElementById("oportunidadesCard");

  if (faturamentoCard) {
    faturamentoCard.textContent =
      formatarMoeda(empresa.faturamento);
  }

  if (clientesCard) {
    clientesCard.textContent =
      formatarNumero(empresa.clientes);
  }

  if (oportunidadesCard) {
    oportunidadesCard.textContent =
      formatarNumero(calcularOportunidades());
  }


  document
    .querySelectorAll("[data-meta]")
    .forEach(function(elemento) {

      elemento.textContent =
        formatarMoeda(empresa.meta);

    });


  document
    .querySelectorAll("[data-progresso]")
    .forEach(function(elemento) {

      elemento.textContent =
        calcularProgresso() + "%";

    });


  const metaFaturamento =
    document.getElementById("metaFaturamento");

  if (metaFaturamento) {

    metaFaturamento.textContent =
      formatarMoeda(empresa.faturamento);

  }


  document
    .querySelectorAll("[data-progresso-bar]")
    .forEach(function(elemento) {

      elemento.style.width =
        calcularProgresso() + "%";

    });


  document
    .querySelectorAll("[data-objetivo]")
    .forEach(function(elemento) {

      elemento.textContent =
        empresa.objetivo;

    });


  document
    .querySelectorAll("[data-empresa]")
    .forEach(function(elemento) {

      elemento.textContent =
        empresa.empresa;

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


  if (saudacao) {

    saudacao.textContent =
      "Visão geral, " +
      empresa.responsavel;

  }


  if (descricao) {

    descricao.textContent =
      "Controle, análise e estratégia para " +
      empresa.empresa +
      ".";

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

function adicionarMensagem(
  tipo,
  mensagem
) {

  const chatBox =
    document.getElementById("chatBox");

  if (!chatBox) {
    return;
  }


  const message =
    document.createElement("div");

  message.className =
    "message";


  const avatar =
    document.createElement("div");

  avatar.className =
    "avatar";

  avatar.textContent =
    tipo === "user"
      ? "Você"
      : "✦";


  const content =
    document.createElement("div");

  content.className =
    "message-content";


  const strong =
    document.createElement("strong");

  strong.textContent =
    tipo === "user"
      ? "Você"
      : "JZ Prime Copilot";


  const p =
    document.createElement("p");


  /*
     textContent evita que uma pergunta
     do usuário seja interpretada como HTML.
  */

  p.textContent =
    mensagem;


  content.appendChild(strong);
  content.appendChild(p);


  message.appendChild(avatar);
  message.appendChild(content);


  chatBox.appendChild(message);


  chatBox.scrollTop =
    chatBox.scrollHeight;

}


/* =========================================================
   RESPOSTA DO COPILOT
========================================================= */

function gerarRespostaLocal(pergunta) {

  const texto =
    String(pergunta || "")
      .toLowerCase()
      .trim();


  const faturamento =
    empresa.faturamento;

  const clientes =
    empresa.clientes;

  const meta =
    empresa.meta;

  const ticket =
    calcularTicket();

  const progresso =
    calcularProgresso();


  const faltaMeta =
    Math.max(
      0,
      meta - faturamento
    );


  /* =====================================================
     SAUDAÇÃO
  ===================================================== */

  if (
    texto === "oi" ||
    texto === "olá" ||
    texto === "ola" ||
    texto.includes("bom dia") ||
    texto.includes("boa tarde") ||
    texto.includes("boa noite")
  ) {

    return (
      "Olá, " +
      empresa.responsavel +
      "! 👋\n\n" +

      "Sou o JZ Prime Copilot.\n\n" +

      "Já tenho os indicadores cadastrados da sua empresa e posso analisar:\n\n" +

      "📊 Faturamento\n" +
      "👥 Clientes\n" +
      "🎯 Metas\n" +
      "💰 Ticket médio\n" +
      "📈 Crescimento\n" +
      "⚡ Plano de ação\n" +
      "💵 Custos e margem\n\n" +

      "Pode me perguntar diretamente, por exemplo:\n\n" +

      "• Como estão minhas vendas?\n" +
      "• Quanto falta para minha meta?\n" +
      "• Como aumentar meu faturamento?\n" +
      "• Qual é meu ticket médio?\n" +
      "• Como chegar a R$ 130.000?\n" +
      "• Crie um plano de ação."
    );

  }


  /* =====================================================
     VENDAS
  ===================================================== */

  if (
    texto.includes("venda") ||
    texto.includes("vendas")
  ) {

    return (
      "📊 ANÁLISE DAS SUAS VENDAS\n\n" +

      "Faturamento atual: " +
      formatarMoeda(faturamento) +
      "\n\n" +

      "Clientes ativos: " +
      formatarNumero(clientes) +
      "\n\n" +

      "Ticket médio aproximado: " +
      formatarMoeda(ticket) +
      "\n\n" +

      "🎯 Estratégia recomendada:\n\n" +

      "1. Aumentar a quantidade de oportunidades comerciais.\n" +
      "2. Melhorar a conversão de propostas.\n" +
      "3. Trabalhar clientes antigos.\n" +
      "4. Buscar aumentar o ticket médio.\n" +
      "5. Fazer acompanhamento semanal das vendas.\n\n" +

      "Objetivo cadastrado: " +
      empresa.objetivo
    );

  }


  /* =====================================================
     META
  ===================================================== */

  if (
    texto.includes("meta") ||
    texto.includes("quanto falta")
  ) {

    if (meta <= 0) {

      return (
        "🎯 SUA META\n\n" +

        "Ainda não existe uma meta mensal cadastrada.\n\n" +

        "Cadastre uma meta no formulário da empresa para que eu possa calcular o progresso."
      );

    }


    return (
      "🎯 ANÁLISE DA META\n\n" +

      "Meta mensal: " +
      formatarMoeda(meta) +
      "\n\n" +

      "Faturamento atual: " +
      formatarMoeda(faturamento) +
      "\n\n" +

      "Progresso: " +
      progresso +
      "%\n\n" +

      "Falta para atingir a meta: " +
      formatarMoeda(faltaMeta)
    );

  }


  /* =====================================================
     TICKET
  ===================================================== */

  if (
    texto.includes("ticket")
  ) {

    return (
      "💰 TICKET MÉDIO\n\n" +

      "Faturamento: " +
      formatarMoeda(faturamento) +
      "\n\n" +

      "Clientes ativos: " +
      formatarNumero(clientes) +
      "\n\n" +

      "Ticket médio aproximado: " +
      formatarMoeda(ticket) +
      "\n\n" +

      "Para aumentar o ticket, considere oferecer produtos ou serviços complementares, planos de maior valor e pacotes."
    );

  }


  /* =====================================================
     CLIENTES
  ===================================================== */

  if (
    texto.includes("cliente") ||
    texto.includes("clientes")
  ) {

    return (
      "👥 ANÁLISE DA CARTEIRA\n\n" +

      "Clientes ativos: " +
      formatarNumero(clientes) +
      "\n\n" +

      "Ticket médio aproximado: " +
      formatarMoeda(ticket) +
      "\n\n" +

      "Recomendações:\n\n" +

      "1. Identificar os clientes de maior valor.\n" +
      "2. Criar ações de retenção.\n" +
      "3. Recuperar clientes inativos.\n" +
      "4. Buscar indicações.\n" +
      "5. Aumentar vendas para a base atual."
    );

  }


  /* =====================================================
     CUSTOS
  ===================================================== */

  if (
    texto.includes("custo") ||
    texto.includes("custos")
  ) {

    return (
      "💰 CONTROLE DE CUSTOS\n\n" +

      "O dashboard ainda não possui seus custos detalhados cadastrados.\n\n" +

      "Mesmo assim, recomendo:\n\n" +

      "1. Separar custos fixos e variáveis.\n" +
      "2. Identificar despesas que não geram receita.\n" +
      "3. Negociar fornecedores.\n" +
      "4. Acompanhar margem por produto ou serviço.\n" +
      "5. Revisar os custos mensalmente."
    );

  }


  /* =====================================================
     MARGEM
  ===================================================== */

  if (
    texto.includes("margem") ||
    texto.includes("lucro")
  ) {

    return (
      "📈 MARGEM E LUCRATIVIDADE\n\n" +

      "Seu faturamento atual é de " +
      formatarMoeda(faturamento) +
      ".\n\n" +

      "Para calcular sua margem real, preciso também dos custos e despesas da empresa.\n\n" +

      "Recomendação inicial: acompanhe faturamento, custos, despesas e lucro separadamente."
    );

  }


  /* =====================================================
     AUMENTAR FATURAMENTO
  ===================================================== */

  if (
    texto.includes("aumentar faturamento") ||
    texto.includes("aumentar vendas") ||
    texto.includes("crescer")
  ) {

    return (
      "📈 COMO AUMENTAR O FATURAMENTO\n\n" +

      "Com os dados atuais:\n\n" +

      "Faturamento: " +
      formatarMoeda(faturamento) +
      "\n" +

      "Clientes: " +
      formatarNumero(clientes) +
      "\n" +

      "Ticket médio: " +
      formatarMoeda(ticket) +
      "\n\n" +

      "🚀 Prioridades:\n\n" +

      "1. Aumentar novos clientes.\n" +
      "2. Aumentar o ticket médio.\n" +
      "3. Recuperar clientes antigos.\n" +
      "4. Melhorar a conversão.\n" +
      "5. Criar ofertas de maior valor."
    );

  }


  /* =====================================================
     PLANO DE AÇÃO
  ===================================================== */

  if (
    texto.includes("plano") ||
    texto.includes("ação") ||
    texto.includes("acao")
  ) {

    return (
      "⚡ PLANO DE AÇÃO — JZ PRIME\n\n" +

      "Objetivo principal: " +
      empresa.objetivo +
      "\n\n" +

      "📊 SITUAÇÃO ATUAL\n\n" +

      "Faturamento: " +
      formatarMoeda(faturamento) +
      "\n" +

      "Clientes ativos: " +
      formatarNumero(clientes) +
      "\n" +

      "Ticket médio: " +
      formatarMoeda(ticket) +
      "\n\n" +

      "🎯 META\n\n" +

      "Meta considerada: " +
      formatarMoeda(meta) +
      "\n" +

      "Falta para atingir: " +
      formatarMoeda(faltaMeta) +
      "\n\n" +

      "🚀 PLANO PRÁTICO\n\n" +

      "1. PROSPECÇÃO\n" +
      "Aumentar diariamente o número de novos contatos comerciais.\n\n" +

      "2. CONVERSÃO\n" +
      "Acompanhar propostas e fazer follow-up até obter uma resposta.\n\n" +

      "3. TICKET MÉDIO\n" +
      "Criar ofertas de maior valor e vendas complementares.\n\n" +

      "4. RECUPERAÇÃO\n" +
      "Entrar em contato com clientes antigos.\n\n" +

      "5. CONTROLE\n" +
      "Acompanhar semanalmente faturamento, clientes, propostas e vendas fechadas.\n\n" +

      "📈 META COMERCIAL\n\n" +

      (
        ticket > 0
          ? "Se o ticket médio atual for mantido, seriam necessários aproximadamente " +
            Math.ceil(faltaMeta / ticket) +
            " novos clientes para cobrir o valor que falta."
          : "Cadastre clientes e faturamento para calcular a projeção."
      )
    );

  }


  /* =====================================================
     META ESPECÍFICA
     EXEMPLO: "COMO CHEGAR A 130 MIL?"
  ===================================================== */

  const numeros =
    texto.match(
      /(?:r\$)?\s*([\d.]+(?:,\d+)?)\s*(?:mil|k)?/
    );


  if (
    numeros &&
    (
      texto.includes("chegar") ||
      texto.includes("atingir") ||
      texto.includes("alcançar") ||
      texto.includes("meta")
    )
  ) {

    let valorTexto =
      numeros[1]
        .replace(/\./g, "")
        .replace(",", ".");


    let alvo =
      Number(valorTexto);


    if (
      texto.includes("mil") ||
      texto.includes("k")
    ) {

      alvo *= 1000;

    }


    if (
      alvo > 0 &&
      alvo < 1000
    ) {

      alvo *= 1000;

    }


    const diferenca =
      Math.max(
        0,
        alvo - faturamento
      );


    const clientesNecessarios =
      ticket > 0
        ? Math.ceil(diferenca / ticket)
        : 0;


    return (
      "🎯 PLANO PARA CHEGAR A " +
      formatarMoeda(alvo) +
      "\n\n" +

      "Faturamento atual: " +
      formatarMoeda(faturamento) +
      "\n\n" +

      "Objetivo: " +
      formatarMoeda(alvo) +
      "\n\n" +

      "Falta gerar: " +
      formatarMoeda(diferenca) +
      "\n\n" +

      "📊 Ticket médio atual: " +
      formatarMoeda(ticket) +
      "\n\n" +

      "🚀 ESTRATÉGIA\n\n" +

      "1. Aumentar a prospecção.\n" +
      "2. Recuperar clientes antigos.\n" +
      "3. Melhorar a conversão.\n" +
      "4. Aumentar o ticket médio.\n" +
      "5. Criar ofertas de maior valor.\n\n" +

      (
        ticket > 0
          ? "Se o ticket médio permanecer em " +
            formatarMoeda(ticket) +
            ", seriam necessários aproximadamente " +
            clientesNecessarios +
            " novos clientes para gerar o valor que falta."
          : "Cadastre clientes ativos para eu calcular quantos novos clientes seriam necessários."
      )
    );

  }


  /* =====================================================
     RESPOSTA PADRÃO
  ===================================================== */

  return (
    "Entendi sua pergunta. 👍\n\n" +

    "Com os dados cadastrados, consigo analisar:\n\n" +

    "📊 Faturamento\n" +
    "👥 Clientes\n" +
    "🎯 Metas\n" +
    "💰 Ticket médio\n" +
    "📈 Crescimento\n" +
    "⚡ Plano de ação\n" +
    "💵 Custos e margem\n\n" +

    "Tente perguntar:\n\n" +

    "\"Como estão minhas vendas?\"\n" +
    "\"Quanto falta para minha meta?\"\n" +
    "\"Como aumentar meu faturamento?\"\n" +
    "\"Qual é meu ticket médio?\"\n" +
    "\"Como chegar a R$ 130.000?\"\n" +
    "\"Crie um plano de ação\""
  );

}


/* =========================================================
   ASK COPILOT
========================================================= */

function askCopilot(pergunta) {

  if (!pergunta) {
    return;
  }


  adicionarMensagem(
    "user",
    pergunta
  );


  setTimeout(function() {

    const resposta =
      gerarRespostaLocal(pergunta);


    adicionarMensagem(
      "bot",
      resposta
    );

  }, 300);

}


/* =========================================================
   ENVIAR COPILOT
========================================================= */

function sendCopilot() {

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


  input.value = "";


  askCopilot(pergunta);

}


/* =========================================================
   ENTER
========================================================= */

function handleEnter(event) {

  if (
    event &&
    event.key === "Enter"
  ) {

    event.preventDefault();

    sendCopilot();

  }

}


/* =========================================================
   RELATÓRIO
========================================================= */

function downloadReport() {

  const ticket =
    calcularTicket();

  const progresso =
    calcularProgresso();


  const relatorio =

`JZ PRIME COPILOT
RESUMO EXECUTIVO

Empresa: ${empresa.empresa}

Responsável: ${empresa.responsavel}

Segmento: ${empresa.segmento}

Faturamento mensal:
${formatarMoeda(empresa.faturamento)}

Clientes ativos:
${formatarNumero(empresa.clientes)}

Ticket médio:
${formatarMoeda(ticket)}

Meta mensal:
${formatarMoeda(empresa.meta)}

Progresso da meta:
${progresso}%

Objetivo principal:
${empresa.objetivo}

Gerado pelo JZ Prime Copilot.`;


  const blob =
    new Blob(
      [relatorio],
      {
        type: "text/plain;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    "JZ-Prime-Relatorio.txt";


  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

}


/* =========================================================
   GRÁFICOS
========================================================= */

let faturamentoChart = null;
let clientesChart = null;
let metaChart = null;


function criarGraficos() {

  if (
    typeof Chart === "undefined"
  ) {

    console.warn(
      "Chart.js não carregado."
    );

    return;

  }


  const faturamentoCanvas =
    document.getElementById(
      "faturamentoChart"
    );


  const clientesCanvas =
    document.getElementById(
      "clientesChart"
    );


  const metaCanvas =
    document.getElementById(
      "metaChart"
    );


  if (
    faturamentoCanvas &&
    !faturamentoChart
  ) {

    faturamentoChart =
      new Chart(
        faturamentoCanvas,
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
                  empresa.faturamento * 0.65,
                  empresa.faturamento * 0.72,
                  empresa.faturamento * 0.78,
                  empresa.faturamento * 0.84,
                  empresa.faturamento * 0.92,
                  empresa.faturamento
                ]

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


  if (
    clientesCanvas &&
    !clientesChart
  ) {

    clientesChart =
      new Chart(
        clientesCanvas,
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

                  Math.round(
                    empresa.clientes * 0.65
                  ),

                  Math.round(
                    empresa.clientes * 0.72
                  ),

                  Math.round(
                    empresa.clientes * 0.78
                  ),

                  Math.round(
                    empresa.clientes * 0.84
                  ),

                  Math.round(
                    empresa.clientes * 0.92
                  ),

                  empresa.clientes

                ]

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


  if (
    metaCanvas &&
    !metaChart
  ) {

    const atingido =
      Math.min(
        empresa.faturamento,
        empresa.meta
      );


    const restante =
      Math.max(
        0,
        empresa.meta - empresa.faturamento
      );


    metaChart =
      new Chart(
        metaCanvas,
        {
          type: "doughnut",

          data: {

            labels: [
              "Atingido",
              "Restante"
            ],

            datasets: [

              {
                data: [

                  atingido,

                  empresa.meta > 0
                    ? restante
                    : 1

                ]

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

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    atualizarDashboard();

    criarGraficos();

  }
);
