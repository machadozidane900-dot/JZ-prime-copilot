/* =========================================================
   JZ PRIME COPILOT
   DASHBOARD — DADOS DA EMPRESA + COPILOT
========================================================= */


/* =========================================================
   CARREGAR DADOS DA EMPRESA
========================================================= */

function carregarEmpresa() {

  const dados = localStorage.getItem("empresa");

  if (!dados) {
    return null;
  }

  try {

    return JSON.parse(dados);

  } catch (erro) {

    console.error("Erro ao carregar dados da empresa:", erro);

    return null;
  }
}


/* =========================================================
   FORMATAÇÃO DE VALORES
========================================================= */

function moeda(valor) {

  const numero = Number(valor || 0);

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


/* =========================================================
   ATUALIZAR DASHBOARD
========================================================= */

function atualizarDashboard() {

  const empresa = carregarEmpresa();

  if (!empresa) {

    console.log("Nenhuma empresa cadastrada.");

    return;
  }


  /* -----------------------------------------
     NOME DA EMPRESA
  ----------------------------------------- */

  const nomeEmpresa = document.getElementById("nomeEmpresa");

  if (nomeEmpresa) {
    nomeEmpresa.textContent =
      empresa.empresa || "Minha empresa";
  }


  /* -----------------------------------------
     RESPONSÁVEL
  ----------------------------------------- */

  const responsavel = document.getElementById("responsavel");

  if (responsavel) {
    responsavel.textContent =
      empresa.responsavel || "";
  }


  /* -----------------------------------------
     SEGMENTO
  ----------------------------------------- */

  const segmento = document.getElementById("segmento");

  if (segmento) {
    segmento.textContent =
      empresa.segmento || "Não informado";
  }


  /* -----------------------------------------
     FATURAMENTO
  ----------------------------------------- */

  const faturamento = document.getElementById(
    "faturamentoCard"
  );

  if (faturamento) {

    faturamento.textContent =
      moeda(empresa.faturamento);
  }


  /* -----------------------------------------
     CLIENTES
  ----------------------------------------- */

  const clientes = document.getElementById(
    "clientesCard"
  );

  if (clientes) {

    clientes.textContent =
      Number(empresa.clientes || 0)
        .toLocaleString("pt-BR");
  }


  /* -----------------------------------------
     META
  ----------------------------------------- */

  const meta = document.getElementById(
    "metaCard"
  );

  if (meta) {

    meta.textContent =
      moeda(empresa.meta);
  }


  /* -----------------------------------------
     OBJETIVO
  ----------------------------------------- */

  const objetivo = document.getElementById(
    "objetivoEmpresa"
  );

  if (objetivo) {

    objetivo.textContent =
      empresa.objetivo ||
      "Definir objetivo";
  }


  /* -----------------------------------------
     NOME NO TOPO
  ----------------------------------------- */

  const nomeTopo = document.getElementById(
    "nomeTopo"
  );

  if (nomeTopo) {

    nomeTopo.textContent =
      empresa.responsavel ||
      empresa.empresa ||
      "Empresário";
  }


  /* -----------------------------------------
     SAUDAÇÃO
  ----------------------------------------- */

  const saudacao = document.getElementById(
    "saudacao"
  );

  if (saudacao) {

    saudacao.textContent =
      "Bom dia, " +
      (
        empresa.responsavel ||
        "Empresário"
      ) +
      " 👋";
  }


  /* -----------------------------------------
     PORCENTAGEM DA META
  ----------------------------------------- */

  const percentualMeta =
    document.getElementById(
      "percentualMeta"
    );

  if (percentualMeta) {

    const faturamento =
      Number(empresa.faturamento || 0);

    const meta =
      Number(empresa.meta || 0);

    let percentual = 0;

    if (meta > 0) {

      percentual =
        (faturamento / meta) * 100;

    }

    percentual =
      Math.min(
        Math.round(percentual),
        100
      );

    percentualMeta.textContent =
      percentual + "%";
  }


  /* -----------------------------------------
     OPORTUNIDADES
  ----------------------------------------- */

  const oportunidades =
    document.getElementById(
      "oportunidadesCard"
    );

  if (oportunidades) {

    oportunidades.textContent =
      "0";
  }


  /* -----------------------------------------
     RESUMO ESTRATÉGICO
  ----------------------------------------- */

  atualizarResumo(empresa);
}


/* =========================================================
   RESUMO ESTRATÉGICO
========================================================= */

function atualizarResumo(empresa) {

  const resumo =
    document.getElementById(
      "resumoEstrategico"
    );

  if (!resumo) {
    return;
  }


  const faturamento =
    Number(empresa.faturamento || 0);

  const meta =
    Number(empresa.meta || 0);


  if (!faturamento && !meta) {

    resumo.textContent =
      "Ainda não existem dados suficientes para gerar uma análise estratégica. Preencha os dados da empresa para começar.";

    return;
  }


  if (meta > 0 && faturamento < meta) {

    resumo.textContent =
      "Seu faturamento atual está abaixo da meta mensal. O Copilot recomenda acompanhar vendas, conversão e oportunidades comerciais para aproximar o resultado da meta.";

    return;
  }


  if (meta > 0 && faturamento >= meta) {

    resumo.textContent =
      "Sua empresa atingiu ou superou a meta mensal informada. O próximo foco recomendado é proteger a margem, controlar custos e identificar oportunidades de crescimento.";

    return;
  }


  resumo.textContent =
    "Os dados da sua empresa foram carregados. Continue alimentando o sistema para que o Copilot possa gerar análises mais precisas.";
}


/* =========================================================
   ABRIR COPILOT
========================================================= */

function openChat() {

  const overlay =
    document.getElementById("overlay");

  const input =
    document.getElementById("input");

  if (overlay) {

    overlay.classList.add("open");
  }

  if (input) {

    input.focus();
  }
}


/* =========================================================
   FECHAR COPILOT
========================================================= */

function closeChat(event) {

  const overlay =
    document.getElementById("overlay");

  if (!overlay) {
    return;
  }

  if (
    !event ||
    event.target === overlay
  ) {

    overlay.classList.remove("open");
  }
}


/* =========================================================
   PERGUNTAS RÁPIDAS
========================================================= */

function ask(question) {

  openChat();

  const input =
    document.getElementById("input");

  if (!input) {
    return;
  }

  input.value = question;

  send();
}


/* =========================================================
   ADICIONAR MENSAGEM
========================================================= */

function addMessage(text, type) {

  const messages =
    document.getElementById("messages");

  if (!messages) {
    return;
  }

  const bubble =
    document.createElement("div");

  bubble.className =
    "bubble " + type;

  bubble.textContent = text;

  messages.appendChild(bubble);

  messages.scrollTop =
    messages.scrollHeight;
}


/* =========================================================
   ENVIAR PERGUNTA PARA O COPILOT
========================================================= */

async function send() {

  const input =
    document.getElementById("input");

  if (!input) {
    return;
  }

  const question =
    input.value.trim();

  if (!question) {
    return;
  }


  /* Mensagem do usuário */

  addMessage(
    question,
    "user"
  );

  input.value = "";


  /* Mensagem temporária */

  addMessage(
    "Analisando sua pergunta...",
    "ai"
  );


  try {

    const empresa =
      carregarEmpresa();


    const response =
      await fetch(
        "/api/copilot",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            question: question,

            empresa: empresa

          })
        }
      );


    const data =
      await response.json();


    const messages =
      document.getElementById(
        "messages"
      );


    if (
      messages &&
      messages.lastElementChild
    ) {

      messages.removeChild(
        messages.lastElementChild
      );
    }


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Erro ao consultar o Copilot"
      );
    }


    addMessage(
      data.answer ||
      "Não consegui gerar uma resposta.",
      "ai"
    );


  } catch (error) {

    const messages =
      document.getElementById(
        "messages"
      );


    if (
      messages &&
      messages.lastElementChild
    ) {

      messages.removeChild(
        messages.lastElementChild
      );
    }


    addMessage(
      "Não consegui conectar ao Copilot agora. Tente novamente em alguns segundos.",
      "ai"
    );


    console.error(error);
  }
}


/* =========================================================
   RELATÓRIO
========================================================= */

function downloadReport() {

  const empresa =
    carregarEmpresa();


  if (!empresa) {

    alert(
      "Cadastre os dados da empresa primeiro."
    );

    return;
  }


  const faturamento =
    moeda(empresa.faturamento);


  const meta =
    moeda(empresa.meta);


  const clientes =
    Number(
      empresa.clientes || 0
    ).toLocaleString("pt-BR");


  const report = `

JZ PRIME COPILOT
RESUMO EXECUTIVO

EMPRESA
${empresa.empresa || "Não informado"}

RESPONSÁVEL
${empresa.responsavel || "Não informado"}

SEGMENTO
${empresa.segmento || "Não informado"}


INDICADORES

Faturamento mensal: ${faturamento}

Clientes ativos: ${clientes}

Meta mensal: ${meta}

Principal objetivo:
${empresa.objetivo || "Não informado"}


RECOMENDAÇÃO

Utilizar os indicadores cadastrados para acompanhar
o desempenho da empresa, identificar oportunidades,
controlar custos e priorizar ações estratégicas.


JZ Prime Copilot
Estratégia orientada por dados.
`;


  const file =
    new Blob(
      [report],
      {
        type: "text/plain"
      }
    );


  const link =
    document.createElement("a");


  link.href =
    URL.createObjectURL(file);


  link.download =
    "jz-prime-resumo-executivo.txt";


  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);


  URL.revokeObjectURL(
    link.href
  );
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    atualizarDashboard();

  }
);
