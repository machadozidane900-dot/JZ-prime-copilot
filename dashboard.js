/* =========================================================
   JZ PRIME COPILOT
   DASHBOARD.JS — VERSÃO NOVA
========================================================= */

"use strict";

/* =========================================================
   DADOS DA EMPRESA
========================================================= */

const empresa = JSON.parse(
  localStorage.getItem("empresa") || "{}"
);


/* =========================================================
   FUNÇÕES BÁSICAS
========================================================= */

function dinheiro(valor) {
  valor = Number(valor) || 0;

  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


function numero(valor) {
  return (Number(valor) || 0).toLocaleString("pt-BR");
}


function percentual(valor) {
  return `${Math.round(Number(valor) || 0)}%`;
}


function buscar(id) {
  return document.getElementById(id);
}


/* =========================================================
   DADOS CALCULADOS
========================================================= */

const faturamento = Number(empresa.faturamento) || 0;
const clientes = Number(empresa.clientes) || 0;
const meta = Number(empresa.meta) || 0;

const custos = Number(
  empresa.custos ||
  empresa.custo ||
  empresa.despesas ||
  0
);

const lucro = Number(
  empresa.lucro ||
  (faturamento - custos)
);

const margem =
  faturamento > 0
    ? (lucro / faturamento) * 100
    : 0;

const ticketMedio =
  clientes > 0
    ? faturamento / clientes
    : 0;

const percentualMeta =
  meta > 0
    ? (faturamento / meta) * 100
    : 0;

const faltaMeta =
  Math.max(meta - faturamento, 0);

const oportunidades =
  Math.max(3, Math.round(clientes * 0.08));


/* =========================================================
   ATUALIZAR ELEMENTO
========================================================= */

function colocar(id, valor) {

  const elemento = buscar(id);

  if (elemento) {
    elemento.textContent = valor;
  }

}


/* =========================================================
   DASHBOARD
========================================================= */

function atualizarDashboard() {

  colocar(
    "faturamentoCard",
    dinheiro(faturamento)
  );


  colocar(
    "clientesCard",
    numero(clientes)
  );


  colocar(
    "oportunidadesCard",
    numero(oportunidades)
  );


  colocar(
    "metaFaturamento",
    dinheiro(faturamento)
  );


  document
    .querySelectorAll("[data-meta]")
    .forEach(elemento => {

      elemento.textContent =
        dinheiro(meta);

    });


  document
    .querySelectorAll("[data-progresso]")
    .forEach(elemento => {

      elemento.textContent =
        percentualMeta > 100
          ? "100%"
          : percentual(percentualMeta);

    });


  document
    .querySelectorAll("[data-objetivo]")
    .forEach(elemento => {

      elemento.textContent =
        empresa.objetivo ||
        "Aumentar vendas";

    });


  document
    .querySelectorAll("[data-empresa]")
    .forEach(elemento => {

      elemento.textContent =
        empresa.empresa ||
        "Minha empresa";

    });


  const barra =
    document.querySelector(
      "[data-progresso-bar]"
    );

  if (barra) {

    barra.style.width =
      `${Math.min(percentualMeta, 100)}%`;

  }

}


/* =========================================================
   CABEÇALHO
========================================================= */

function atualizarCabecalho() {

  const nome =
    empresa.responsavel ||
    "Empreendedor";

  colocar(
    "saudacao",
    `Visão geral, ${nome}`
  );


  colocar(
    "descricaoPainel",
    empresa.empresa
      ? `Controle, análise e estratégia para ${empresa.empresa}.`
      : "Controle, análise e estratégia em um só lugar."
  );

}


/* =========================================================
   NOTIFICAÇÕES
========================================================= */

function notifyUser(mensagem) {

  alert(mensagem);

}


/* =========================================================
   COPILOT
========================================================= */

function adicionarMensagem(
  texto,
  tipo = "bot"
) {

  const chat =
    buscar("chatBox");

  if (!chat) return;


  const mensagem =
    document.createElement("div");

  mensagem.className =
    "message";


  const avatar =
    document.createElement("div");

  avatar.className =
    "avatar";

  avatar.textContent =
    tipo === "user"
      ? "Você"
      : "✦";


  const conteudo =
    document.createElement("div");

  conteudo.className =
    "message-content";


  const nome =
    document.createElement("strong");

  nome.textContent =
    tipo === "user"
      ? "Você"
      : "JZ Prime Copilot";


  const textoElemento =
    document.createElement("p");

  textoElemento.innerHTML =
    escaparHTML(texto)
      .replace(/\n/g, "<br>");


  conteudo.appendChild(nome);
  conteudo.appendChild(textoElemento);

  mensagem.appendChild(avatar);
  mensagem.appendChild(conteudo);

  chat.appendChild(mensagem);

  chat.scrollTop =
    chat.scrollHeight;

}


function escaparHTML(texto) {

  const div =
    document.createElement("div");

  div.textContent =
    texto;

  return div.innerHTML;

}


/* =========================================================
   RESPOSTA DO COPILOT
========================================================= */

function gerarRespostaLocal(pergunta) {

  const p =
    pergunta
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");


  /* -----------------------------------------
     PLANO DE AÇÃO
  ----------------------------------------- */

  if (
    p.includes("plano de acao") ||
    p.includes("plano de ação") ||
    p.includes("proximo passo") ||
    p.includes("o que devo fazer")
  ) {

    return `
⚡ PLANO DE AÇÃO — JZ PRIME

Objetivo principal:
${empresa.objetivo || "Aumentar vendas"}

📊 SITUAÇÃO ATUAL

Faturamento:
${dinheiro(faturamento)}

Clientes ativos:
${numero(clientes)}

Ticket médio:
${dinheiro(ticketMedio)}

Meta mensal:
${dinheiro(meta)}

Falta para a meta:
${dinheiro(faltaMeta)}

🚀 PLANO PRÁTICO

1. PROSPECÇÃO
Aumentar a quantidade de novos contatos e oportunidades comerciais.

2. CONVERSÃO
Fazer acompanhamento de todas as propostas e oportunidades abertas.

3. TICKET MÉDIO
Buscar vendas de maior valor e oferecer produtos ou serviços complementares.

4. CLIENTES ATUAIS
Trabalhar recompra, indicação e recuperação de clientes antigos.

5. CONTROLE
Acompanhar semanalmente faturamento, clientes, propostas e vendas.

🎯 FOCO IMEDIATO

${faltaMeta > 0
  ? `Você precisa gerar aproximadamente ${dinheiro(faltaMeta)} adicionais para atingir sua meta mensal.`
  : "Sua meta mensal já foi atingida. O próximo foco deve ser superar a meta e aumentar a margem."
}
`;

  }


  /* -----------------------------------------
     VENDAS
  ----------------------------------------- */

  if (
    p.includes("venda") ||
    p.includes("vendas")
  ) {

    return `
📊 ANÁLISE DAS SUAS VENDAS

Faturamento atual:
${dinheiro(faturamento)}

Clientes ativos:
${numero(clientes)}

Ticket médio:
${dinheiro(ticketMedio)}

Meta mensal:
${dinheiro(meta)}

Falta para a meta:
${dinheiro(faltaMeta)}

🎯 RECOMENDAÇÕES

1. Aumentar a quantidade de oportunidades.
2. Melhorar o acompanhamento das propostas.
3. Buscar aumentar o ticket médio.
4. Trabalhar clientes antigos.
5. Criar ofertas específicas para aumentar conversão.

Objetivo cadastrado:
${empresa.objetivo || "Aumentar vendas"}
`;

  }


  /* -----------------------------------------
     META
  ----------------------------------------- */

  if (
    p.includes("meta") ||
    p.includes("quanto falta")
  ) {

    return `
🎯 ANÁLISE DA META

Meta mensal:
${dinheiro(meta)}

Faturamento atual:
${dinheiro(faturamento)}

Percentual atingido:
${percentualMeta > 100
  ? "100%+"
  : percentual(percentualMeta)
}

Valor que falta:
${dinheiro(faltaMeta)}

${
  faltaMeta > 0
    ? `Você ainda precisa gerar ${dinheiro(faltaMeta)} para atingir sua meta.`
    : "Parabéns! Sua empresa já atingiu a meta mensal."
}
`;

  }


  /* -----------------------------------------
     TICKET MÉDIO
  ----------------------------------------- */

  if (
    p.includes("ticket") ||
    p.includes("valor medio") ||
    p.includes("valor médio")
  ) {

    return `
💰 TICKET MÉDIO

Faturamento:
${dinheiro(faturamento)}

Clientes ativos:
${numero(clientes)}

Ticket médio estimado:
${dinheiro(ticketMedio)}

Para aumentar o ticket médio, considere criar ofertas maiores, vendas adicionais e pacotes de produtos ou serviços.
`;

  }


  /* -----------------------------------------
     CUSTOS
  ----------------------------------------- */

  if (
    p.includes("custo") ||
    p.includes("custos") ||
    p.includes("despesa")
  ) {

    if (custos > 0) {

      return `
💰 ANÁLISE DE CUSTOS

Faturamento:
${dinheiro(faturamento)}

Custos informados:
${dinheiro(custos)}

Lucro estimado:
${dinheiro(lucro)}

Margem estimada:
${percentual(margem)}

🎯 PRIORIDADES

1. Identificar os maiores custos.
2. Separar custos fixos e variáveis.
3. Negociar fornecedores.
4. Eliminar despesas que não geram retorno.
5. Acompanhar a margem mensalmente.
`;

    }

    return `
💰 ANÁLISE DE CUSTOS

Ainda não encontrei um valor de custos cadastrado para sua empresa.

Por enquanto:

Faturamento:
${dinheiro(faturamento)}

Clientes:
${numero(clientes)}

Meta:
${dinheiro(meta)}

Para uma análise financeira mais precisa, cadastre os custos/despesas da empresa.
`;

  }


  /* -----------------------------------------
     LUCRO / MARGEM
  ----------------------------------------- */

  if (
    p.includes("lucro") ||
    p.includes("margem")
  ) {

    return `
📈 LUCRO E MARGEM

Faturamento:
${dinheiro(faturamento)}

Custos considerados:
${dinheiro(custos)}

Lucro estimado:
${dinheiro(lucro)}

Margem estimada:
${percentual(margem)}

⚠️ Esse cálculo é uma estimativa baseada nos dados cadastrados.
`;

  }


  /* -----------------------------------------
     CLIENTES
  ----------------------------------------- */

  if (
    p.includes("cliente") ||
    p.includes("clientes")
  ) {

    return `
👥 ANÁLISE DA CARTEIRA

Clientes ativos:
${numero(clientes)}

Faturamento:
${dinheiro(faturamento)}

Ticket médio:
${dinheiro(ticketMedio)}

🎯 ESTRATÉGIA

• Recuperar clientes inativos.
• Criar campanhas de recompra.
• Identificar clientes de maior potencial.
• Buscar indicações.
• Aumentar o valor médio por cliente.
`;

  }


  /* -----------------------------------------
     FATURAMENTO
  ----------------------------------------- */

  if (
    p.includes("faturamento") ||
    p.includes("receita")
  ) {

    return `
📊 FATURAMENTO

Faturamento atual:
${dinheiro(faturamento)}

Meta mensal:
${dinheiro(meta)}

Falta:
${dinheiro(faltaMeta)}

Clientes:
${numero(clientes)}

Ticket médio:
${dinheiro(ticketMedio)}

Para aumentar o faturamento, trabalhe simultaneamente aquisição de clientes, conversão e ticket médio.
`;

  }


  /* -----------------------------------------
     CRESCIMENTO
  ----------------------------------------- */

  if (
    p.includes("crescimento") ||
    p.includes("crescer") ||
    p.includes("aumentar")
  ) {

    return `
🚀 ESTRATÉGIA DE CRESCIMENTO

Faturamento atual:
${dinheiro(faturamento)}

Meta:
${dinheiro(meta)}

Clientes:
${numero(clientes)}

Ticket médio:
${dinheiro(ticketMedio)}

🎯 PRIORIDADES

1. Aumentar geração de oportunidades.
2. Melhorar conversão.
3. Aumentar ticket médio.
4. Recuperar clientes antigos.
5. Criar metas comerciais semanais.

Objetivo cadastrado:
${empresa.objetivo || "Crescimento da empresa"}
`;

  }


  /* -----------------------------------------
     PADRÃO
  ----------------------------------------- */

  return `
Entendi. 👍

Com os dados atuais da sua empresa consigo analisar:

📊 Faturamento
👥 Clientes
🎯 Metas
💰 Ticket médio
📈 Crescimento
⚡ Plano de ação
💵 Custos
📈 Lucro e margem

Experimente perguntar:

• Como estão minhas vendas?
• Quanto falta para minha meta?
• Qual é meu ticket médio?
• Onde posso reduzir custos?
• Como aumentar meu faturamento?
• Crie um plano de ação.
• Como melhorar minha margem?
`;

}


/* =========================================================
   ASK COPILOT
========================================================= */

function askCopilot(pergunta) {

  if (!pergunta) return;


  adicionarMensagem(
    pergunta,
    "user"
  );


  setTimeout(() => {

    const resposta =
      gerarRespostaLocal(pergunta);

    adicionarMensagem(
      resposta,
      "bot"
    );

  }, 300);

}


/* =========================================================
   ENVIAR COPILOT
========================================================= */

function sendCopilot() {

  const input =
    buscar("copilotInput");

  if (!input) return;


  const pergunta =
    input.value.trim();


  if (!pergunta) return;


  input.value = "";


  askCopilot(pergunta);

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
   GRÁFICO DE FATURAMENTO
========================================================= */

function criarGraficoFaturamento() {

  const canvas =
    buscar("faturamentoChart");

  if (
    !canvas ||
    typeof Chart === "undefined"
  ) return;


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

            data: [
              faturamento * 0.62,
              faturamento * 0.71,
              faturamento * 0.78,
              faturamento * 0.84,
              faturamento * 0.93,
              faturamento
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

        },

        scales: {

          y: {
            beginAtZero: true
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
    buscar("clientesChart");

  if (
    !canvas ||
    typeof Chart === "undefined"
  ) return;


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

            data: [

              Math.max(
                0,
                Math.round(clientes * 0.55)
              ),

              Math.max(
                0,
                Math.round(clientes * 0.63)
              ),

              Math.max(
                0,
                Math.round(clientes * 0.70)
              ),

              Math.max(
                0,
                Math.round(clientes * 0.79)
              ),

              Math.max(
                0,
                Math.round(clientes * 0.89)
              ),

              clientes

            ],

            fill: false,

            tension: 0.35

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

    }
  );

}


/* =========================================================
   GRÁFICO DA META
========================================================= */

function criarGraficoMeta() {

  const canvas =
    buscar("metaChart");

  if (
    !canvas ||
    typeof Chart === "undefined"
  ) return;


  const atingido =
    Math.min(faturamento, meta);

  const restante =
    Math.max(meta - faturamento, 0);


  new Chart(
    canvas,
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

    }
  );

}


/* =========================================================
   RELATÓRIO
========================================================= */

function downloadReport() {

  const texto = `

JZ PRIME COPILOT
RELATÓRIO EXECUTIVO

Empresa:
${empresa.empresa || "Não informada"}

Responsável:
${empresa.responsavel || "Não informado"}

Segmento:
${empresa.segmento || "Não informado"}

Faturamento:
${dinheiro(faturamento)}

Clientes ativos:
${numero(clientes)}

Ticket médio:
${dinheiro(ticketMedio)}

Meta mensal:
${dinheiro(meta)}

Falta para a meta:
${dinheiro(faltaMeta)}

Custos:
${dinheiro(custos)}

Lucro estimado:
${dinheiro(lucro)}

Margem estimada:
${percentual(margem)}

Objetivo:
${empresa.objetivo || "Não informado"}

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

    atualizarDashboard();

    atualizarCabecalho();

    criarGraficoFaturamento();

    criarGraficoClientes();

    criarGraficoMeta();

  }
);
