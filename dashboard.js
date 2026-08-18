/* =========================================================
   JZ PRIME COPILOT — DASHBOARD
   Versão local — sem API paga
========================================================= */

let empresa = {};
let faturamentoChart = null;
let clientesChart = null;
let metaChart = null;


/* =========================================================
   CARREGAR EMPRESA
========================================================= */

function carregarEmpresa() {

  try {

    const dados = localStorage.getItem("empresa");

    if (dados) {
      empresa = JSON.parse(dados);
    }

  } catch (erro) {

    console.error("Erro ao carregar empresa:", erro);

    empresa = {};

  }

}


/* =========================================================
   FUNÇÕES DE FORMATAÇÃO
========================================================= */

function numero(valor) {

  const n = Number(valor);

  return Number.isFinite(n) ? n : 0;

}


function moeda(valor) {

  return numero(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

}


function inteiro(valor) {

  return Math.round(numero(valor)).toLocaleString("pt-BR");

}


function percentual(valor) {

  return Math.round(numero(valor)) + "%";

}


/* =========================================================
   DADOS CALCULADOS
========================================================= */

function obterDados() {

  const faturamento =
    numero(empresa.faturamento);

  const clientes =
    numero(empresa.clientes);

  const meta =
    numero(empresa.meta);

  const despesas =
    numero(empresa.despesas);

  let ticket =
    numero(empresa.ticket);

  const metaAnual =
    numero(empresa.metaAnual);

  const funcionarios =
    numero(empresa.funcionarios);

  if (!ticket && clientes > 0) {

    ticket =
      faturamento / clientes;

  }

  const lucro =
    faturamento - despesas;

  let margem = 0;

  if (faturamento > 0) {

    margem =
      (lucro / faturamento) * 100;

  }

  let progresso = 0;

  if (meta > 0) {

    progresso =
      (faturamento / meta) * 100;

  }

  const faltaMeta =
    Math.max(meta - faturamento, 0);

  let oportunidades = 0;

  if (clientes > 0) {

    oportunidades =
      Math.max(
        3,
        Math.round(clientes * 0.08)
      );

  }

  return {

    faturamento,
    clientes,
    meta,
    despesas,
    ticket,
    metaAnual,
    funcionarios,
    lucro,
    margem,
    progresso,
    faltaMeta,
    oportunidades

  };

}


/* =========================================================
   ATUALIZAR DASHBOARD
========================================================= */

function atualizarDashboard() {

  const dados =
    obterDados();


  /* FATURAMENTO */

  const faturamentoCard =
    document.getElementById("faturamentoCard");

  if (faturamentoCard) {

    faturamentoCard.textContent =
      moeda(dados.faturamento);

  }


  /* CLIENTES */

  const clientesCard =
    document.getElementById("clientesCard");

  if (clientesCard) {

    clientesCard.textContent =
      inteiro(dados.clientes);

  }


  /* META */

  document
    .querySelectorAll("[data-meta]")
    .forEach(function(elemento) {

      elemento.textContent =
        moeda(dados.meta);

    });


  /* PROGRESSO */

  document
    .querySelectorAll("[data-progresso]")
    .forEach(function(elemento) {

      elemento.textContent =
        percentual(
          Math.min(dados.progresso, 100)
        );

    });


  /* BARRA DE PROGRESSO */

  const barra =
    document.querySelector(
      "[data-progresso-bar]"
    );

  if (barra) {

    barra.style.width =
      Math.min(dados.progresso, 100) + "%";

  }


  /* OPORTUNIDADES */

  const oportunidades =
    document.getElementById(
      "oportunidadesCard"
    );

  if (oportunidades) {

    oportunidades.textContent =
      inteiro(dados.oportunidades);

  }


  /* FATURAMENTO META */

  const metaFaturamento =
    document.getElementById(
      "metaFaturamento"
    );

  if (metaFaturamento) {

    metaFaturamento.textContent =
      moeda(dados.faturamento);

  }


  /* OBJETIVO */

  document
    .querySelectorAll("[data-objetivo]")
    .forEach(function(elemento) {

      elemento.textContent =
        empresa.objetivo ||
        "Aumentar vendas";

    });


  /* EMPRESA */

  document
    .querySelectorAll("[data-empresa]")
    .forEach(function(elemento) {

      elemento.textContent =
        empresa.empresa ||
        "Minha empresa";

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
    document.getElementById(
      "descricaoPainel"
    );


  const responsavel =
    empresa.responsavel ||
    "Empresário";


  if (saudacao) {

    saudacao.textContent =
      "Visão geral, " +
      responsavel;

  }


  if (descricao) {

    descricao.textContent =
      "Controle, análise e estratégia para " +
      (empresa.empresa || "sua empresa") +
      ".";

  }

}


/* =========================================================
   GRÁFICO DE FATURAMENTO
========================================================= */

function criarGraficoFaturamento() {

  const canvas =
    document.getElementById(
      "faturamentoChart"
    );

  if (!canvas) return;


  if (faturamentoChart) {

    faturamentoChart.destroy();

  }


  const valor =
    obterDados().faturamento;


  const valores = [

    valor * 0.72,
    valor * 0.81,
    valor * 0.76,
    valor * 0.88,
    valor * 0.94,
    valor

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

        datasets: [

          {

            label: "Faturamento",

            data: valores,

            borderRadius: 8

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

              callback: function(valor) {

                return moeda(valor);

              }

            }

          }

        }

      }

    });

}


/* =========================================================
   GRÁFICO DE CLIENTES
========================================================= */

function criarGraficoClientes() {

  const canvas =
    document.getElementById(
      "clientesChart"
    );

  if (!canvas) return;


  if (clientesChart) {

    clientesChart.destroy();

  }


  const clientes =
    obterDados().clientes;


  const valores = [

    clientes * 0.58,
    clientes * 0.66,
    clientes * 0.71,
    clientes * 0.79,
    clientes * 0.91,
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

        datasets: [

          {

            label: "Clientes",

            data: valores,

            tension: 0.35,

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

        },

        scales: {

          y: {

            beginAtZero: true

          }

        }

      }

    });

}


/* =========================================================
   GRÁFICO DA META
========================================================= */

function criarGraficoMeta() {

  const canvas =
    document.getElementById(
      "metaChart"
    );

  if (!canvas) return;


  if (metaChart) {

    metaChart.destroy();

  }


  const dados =
    obterDados();


  let realizado =
    dados.faturamento;

  let restante =
    Math.max(
      dados.meta - dados.faturamento,
      0
    );


  if (dados.meta === 0) {

    realizado = 0;
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

        datasets: [

          {

            data: [
              realizado,
              restante
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

    });

}


/* =========================================================
   GRÁFICOS
========================================================= */

function criarGraficos() {

  if (
    typeof Chart ===
    "undefined"
  ) {

    console.warn(
      "Chart.js não carregado."
    );

    return;

  }

  criarGraficoFaturamento();

  criarGraficoClientes();

  criarGraficoMeta();

}


/* =========================================================
   MENSAGEM DO COPILOT
========================================================= */

function adicionarMensagem(
  texto,
  usuario = false
) {

  const chat =
    document.getElementById(
      "chatBox"
    );

  if (!chat) return;


  const mensagem =
    document.createElement("div");

  mensagem.className =
    "message";


  if (usuario) {

    mensagem.classList.add(
      "user-message"
    );

  }


  const avatar =
    document.createElement("div");

  avatar.className =
    "avatar";

  avatar.textContent =
    usuario ? "Você" : "✦";


  const conteudo =
    document.createElement("div");

  conteudo.className =
    "message-content";


  const nome =
    document.createElement("strong");

  nome.textContent =
    usuario
      ? "Você"
      : "JZ Prime Copilot";


  const paragrafo =
    document.createElement("p");

  paragrafo.innerHTML =
    texto.replace(
      /\n/g,
      "<br>"
    );


  conteudo.appendChild(nome);

  conteudo.appendChild(paragrafo);

  mensagem.appendChild(avatar);

  mensagem.appendChild(conteudo);

  chat.appendChild(mensagem);


  chat.scrollTop =
    chat.scrollHeight;

}


/* =========================================================
   RESPOSTA DO COPILOT
========================================================= */

function gerarRespostaLocal(pergunta) {

  const p =
    pergunta
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );


  const dados =
    obterDados();


  const nome =
    empresa.responsavel ||
    "você";


  /* SAUDAÇÃO */

  if (
    p === "oi" ||
    p === "ola" ||
    p.includes("bom dia") ||
    p.includes("boa tarde") ||
    p.includes("boa noite")
  ) {

    return `
Olá, ${nome}! 👋

Sou o JZ Prime Copilot.

Já tenho os indicadores cadastrados da sua empresa e posso analisar:

📊 Faturamento
👥 Clientes
🎯 Metas
💰 Ticket médio
📈 Crescimento
⚡ Plano de ação
💵 Custos e margem

Pode me perguntar diretamente:

• Como estão minhas vendas?
• Quanto falta para minha meta?
• Como aumentar meu faturamento?
• Qual é meu ticket médio?
• Como chegar a R$ 130.000?
• Crie um plano de ação.
`;

  }


  /* VENDAS */

  if (
    p.includes("venda") ||
    p.includes("vendas")
  ) {

    return `
📊 ANÁLISE DAS SUAS VENDAS

Faturamento atual:
${moeda(dados.faturamento)}

Clientes ativos:
${inteiro(dados.clientes)}

Ticket médio:
${moeda(dados.ticket)}

🎯 Estratégia recomendada:

1. Aumentar a conversão dos contatos em clientes.
2. Trabalhar ofertas de maior valor.
3. Recuperar clientes antigos.
4. Fazer follow-up das propostas.
5. Acompanhar vendas semanalmente.

Objetivo cadastrado:
${empresa.objetivo || "Aumentar vendas"}
`;

  }


  /* META */

  if (
    p.includes("meta") ||
    p.includes("quanto falta") ||
    p.includes("objetivo")
  ) {

    return `
🎯 ANÁLISE DA SUA META

Faturamento atual:
${moeda(dados.faturamento)}

Meta mensal:
${moeda(dados.meta)}

Falta para atingir:
${moeda(dados.faltaMeta)}

Progresso atual:
${percentual(
  Math.min(dados.progresso, 100)
)}

${
  dados.meta > 0 && dados.faturamento >= dados.meta
    ? "🔥 Parabéns! Sua meta mensal foi atingida."
    : "🚀 O foco agora deve ser transformar a diferença restante em vendas."
}
`;

  }


  /* TICKET */

  if (
    p.includes("ticket") ||
    p.includes("valor medio") ||
    p.includes("valor médio")
  ) {

    return `
💰 TICKET MÉDIO

Seu faturamento:
${moeda(dados.faturamento)}

Clientes ativos:
${inteiro(dados.clientes)}

Ticket médio aproximado:
${moeda(dados.ticket)}

📈 Para aumentar o ticket:

1. Criar ofertas premium.
2. Fazer vendas adicionais.
3. Criar combos ou pacotes.
4. Oferecer produtos/serviços complementares.
5. Priorizar clientes com maior potencial.
`;

  }


  /* CUSTOS */

  if (
    p.includes("custo") ||
    p.includes("despesa") ||
    p.includes("despesas")
  ) {

    return `
💰 ANÁLISE DE CUSTOS

Faturamento:
${moeda(dados.faturamento)}

Despesas mensais:
${moeda(dados.despesas)}

Lucro estimado:
${moeda(dados.lucro)}

Margem estimada:
${percentual(dados.margem)}

⚡ Recomendações:

1. Separar custos fixos e variáveis.
2. Identificar despesas que não geram receita.
3. Negociar contratos e fornecedores.
4. Acompanhar despesas semanalmente.
5. Proteger a margem antes de aumentar descontos.
`;

  }


  /* MARGEM */

  if (
    p.includes("margem") ||
    p.includes("lucro")
  ) {

    return `
📈 ANÁLISE DE MARGEM

Faturamento:
${moeda(dados.faturamento)}

Despesas:
${moeda(dados.despesas)}

Lucro estimado:
${moeda(dados.lucro)}

Margem estimada:
${percentual(dados.margem)}

🎯 Para melhorar:

• aumentar ticket médio;
• reduzir desperdícios;
• negociar custos;
• melhorar mix de produtos/serviços;
• evitar descontos sem estratégia.
`;

  }


  /* PLANO DE AÇÃO */

  if (
    p.includes("plano") ||
    p.includes("acao") ||
    p.includes("ação")
  ) {

    return `
⚡ PLANO DE AÇÃO — JZ PRIME

Objetivo principal:
${empresa.objetivo || "Aumentar vendas"}

📊 SITUAÇÃO ATUAL

Faturamento:
${moeda(dados.faturamento)}

Clientes ativos:
${inteiro(dados.clientes)}

Ticket médio:
${moeda(dados.ticket)}

Despesas:
${moeda(dados.despesas)}

Lucro estimado:
${moeda(dados.lucro)}

🎯 META

Meta mensal:
${moeda(dados.meta)}

Falta para atingir:
${moeda(dados.faltaMeta)}

🚀 PLANO PRÁTICO

1. PROSPECÇÃO
Aumentar diariamente o número de novos contatos comerciais.

2. CONVERSÃO
Acompanhar propostas e realizar follow-up.

3. TICKET MÉDIO
Criar ofertas de maior valor e vendas complementares.

4. RECUPERAÇÃO
Entrar em contato com clientes antigos.

5. CONTROLE
Acompanhar semanalmente faturamento, clientes, propostas e vendas.

📈 META COMERCIAL

Mantendo o ticket médio atual, seriam necessários aproximadamente:

${Math.ceil(
  dados.ticket > 0
    ? dados.faltaMeta / dados.ticket
    : 0
)} novos clientes

para cobrir o valor que falta para a meta.

⚠️ Esta é uma estimativa baseada nos dados cadastrados.
`;

  }


  /* COMO AUMENTAR FATURAMENTO */

  if (
    p.includes("aumentar") &&
    (
      p.includes("faturamento") ||
      p.includes("venda")
    )
  ) {

    return `
🚀 COMO AUMENTAR SEU FATURAMENTO

Hoje:
${moeda(dados.faturamento)}

Meta:
${moeda(dados.meta)}

Ticket médio:
${moeda(dados.ticket)}

Prioridades:

1. Aumentar a quantidade de oportunidades.
2. Melhorar a taxa de conversão.
3. Aumentar o ticket médio.
4. Recuperar clientes antigos.
5. Criar ofertas de maior valor.

🎯 O caminho mais rápido normalmente é trabalhar simultaneamente aquisição + conversão + ticket.
`;

  }


  /* 130 MIL / VALOR ESPECÍFICO */

  const numeros =
    pergunta.match(
      /[\d\.\,]+/
    );


  if (
    numeros &&
    (
      p.includes("chegar") ||
      p.includes("atingir") ||
      p.includes("130") ||
      p.includes("mil")
    )
  ) {

    let valorTexto =
      numeros[0]
        .replace(/\./g, "")
        .replace(",", ".");

    let valor =
      Number(valorTexto);


    if (
      valor > 0 &&
      valor < 1000
    ) {

      valor =
        valor * 1000;

    }


    const falta =
      Math.max(
        valor - dados.faturamento,
        0
      );


    const novosClientes =
      dados.ticket > 0
        ? Math.ceil(
            falta / dados.ticket
          )
        : 0;


    return `
🎯 PLANO PARA CHEGAR A ${moeda(valor)}

Faturamento atual:
${moeda(dados.faturamento)}

Objetivo:
${moeda(valor)}

Falta:
${moeda(falta)}

📊 Mantendo o ticket médio atual de ${moeda(dados.ticket)}, seriam necessários aproximadamente:

${novosClientes} novos clientes

🚀 Estratégia:

1. Aumentar prospecção.
2. Recuperar clientes antigos.
3. Melhorar conversão.
4. Aumentar ticket médio.
5. Criar ofertas de maior valor.
6. Acompanhar a meta semanalmente.

⚠️ É uma projeção baseada nos dados cadastrados.
`;

  }


  /* RESPOSTA PADRÃO */

  return `
Entendi sua pergunta. 👍

Com os dados atuais, consigo analisar:

📊 Faturamento
👥 Clientes
🎯 Metas
💰 Ticket médio
📈 Crescimento
⚡ Plano de ação
💵 Custos e margem

Tente perguntar:

"Como estão minhas vendas?"

"Quanto falta para minha meta?"

"Como aumentar meu faturamento?"

"Qual é meu ticket médio?"

"Como chegar a R$ 130.000?"

"Crie um plano de ação."
`;

}


/* =========================================================
   ASK COPILOT
========================================================= */

function askCopilot(pergunta) {

  if (!pergunta) return;


  adicionarMensagem(
    pergunta,
    true
  );


  setTimeout(function() {

    const resposta =
      gerarRespostaLocal(
        pergunta
      );


    adicionarMensagem(
      resposta,
      false
    );

  }, 300);

}


/* =========================================================
   INPUT ENTER
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
   ENVIAR COPILOT
========================================================= */

function sendCopilot() {

  const input =
    document.getElementById(
      "copilotInput"
    );

  if (!input) return;


  const pergunta =
    input.value.trim();


  if (!pergunta) return;


  input.value = "";


  askCopilot(
    pergunta
  );

}


/* =========================================================
   NOTIFICAÇÃO
========================================================= */

function notifyUser(mensagem) {

  alert(mensagem);

}


/* =========================================================
   RELATÓRIO
========================================================= */

function downloadReport() {

  const dados =
    obterDados();


  const texto = `

JZ PRIME COPILOT
RESUMO EXECUTIVO

EMPRESA
${empresa.empresa || "Não informado"}

RESPONSÁVEL
${empresa.responsavel || "Não informado"}

SEGMENTO
${empresa.segmento || "Não informado"}

--------------------------------

FATURAMENTO
${moeda(dados.faturamento)}

CLIENTES ATIVOS
${inteiro(dados.clientes)}

TICKET MÉDIO
${moeda(dados.ticket)}

DESPESAS
${moeda(dados.despesas)}

LUCRO ESTIMADO
${moeda(dados.lucro)}

MARGEM
${percentual(dados.margem)}

META MENSAL
${moeda(dados.meta)}

PROGRESSO DA META
${percentual(dados.progresso)}

OBJETIVO
${empresa.objetivo || "Não informado"}

--------------------------------

JZ PRIME COPILOT
Controle, análise e estratégia.

`;


  const blob =
    new Blob(
      [texto],
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
    "relatorio-jz-prime.txt";

  link.click();


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

  }
);
