export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {
    const { question, empresa = {} } = req.body || {};

    if (!question) {
      return res.status(400).json({
        error: "Pergunta não informada"
      });
    }

    const q = question.toLowerCase();

    const nomeEmpresa =
      empresa.empresa || "sua empresa";

    const faturamento =
      Number(empresa.faturamento) || 0;

    const clientes =
      Number(empresa.clientes) || 0;

    const meta =
      Number(empresa.meta) || 0;

    const objetivo =
      empresa.objetivo || "Aumentar vendas";

    const segmento =
      empresa.segmento || "não informado";

    const progresso =
      meta > 0
        ? Math.round((faturamento / meta) * 100)
        : 0;

    const restante =
      Math.max(meta - faturamento, 0);

    const ticketMedio =
      clientes > 0
        ? faturamento / clientes
        : 0;

    const formatarMoeda = (valor) =>
      Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });

    let answer = "";

    if (
      q.includes("venda") ||
      q.includes("vendas") ||
      q.includes("faturamento")
    ) {
      answer =
        `Analisei os dados da ${nomeEmpresa}. ` +
        `O faturamento atual é de ${formatarMoeda(faturamento)}, ` +
        `com ${clientes} clientes ativos. ` +
        `A meta mensal é ${formatarMoeda(meta)} e você já atingiu ` +
        `${progresso}% dela. ` +
        `Para chegar à meta, faltam ${formatarMoeda(restante)}. ` +
        `Como o objetivo principal é "${objetivo}", ` +
        `recomendo concentrar os esforços comerciais em novas vendas ` +
        `e nos clientes com maior potencial de crescimento.`;
    }

    else if (
      q.includes("meta") ||
      q.includes("objetivo")
    ) {
      answer =
        `Sua meta mensal é ${formatarMoeda(meta)}. ` +
        `O faturamento atual está em ${formatarMoeda(faturamento)}, ` +
        `representando ${progresso}% da meta. ` +
        `Ainda faltam ${formatarMoeda(restante)} para atingir o objetivo. ` +
        `Minha recomendação é acompanhar esse indicador semanalmente.`;
    }

    else if (
      q.includes("cliente") ||
      q.includes("clientes")
    ) {
      answer =
        `Atualmente, a ${nomeEmpresa} possui ${clientes} clientes ativos. ` +
        `Com faturamento de ${formatarMoeda(faturamento)}, ` +
        `o faturamento médio por cliente está em aproximadamente ` +
        `${formatarMoeda(ticketMedio)}. ` +
        `Uma boa estratégia é identificar os clientes com maior potencial ` +
        `e trabalhar aumento de frequência, ticket e novas oportunidades.`;
    }

    else if (
      q.includes("custo") ||
      q.includes("custos") ||
      q.includes("despesa") ||
      q.includes("despesas")
    ) {
      answer =
        `Para controlar custos na ${nomeEmpresa}, recomendo separar ` +
        `despesas fixas, variáveis e comerciais. ` +
        `Depois, compare cada gasto com o retorno gerado. ` +
        `O objetivo deve ser reduzir desperdícios sem comprometer ` +
        `a capacidade de gerar os ${formatarMoeda(meta)} de faturamento desejados.`;
    }

    else if (
      q.includes("margem") ||
      q.includes("lucro") ||
      q.includes("rentabilidade")
    ) {
      answer =
        `Para melhorar a margem da ${nomeEmpresa}, acompanhe ` +
        `receita, custos e despesas separadamente. ` +
        `Também é importante identificar quais produtos ou serviços ` +
        `possuem maior margem e direcionar as vendas para essas oportunidades. ` +
        `O faturamento atual é de ${formatarMoeda(faturamento)}.`;
    }

    else if (
      q.includes("plano") ||
      q.includes("estratégia") ||
      q.includes("estrategia") ||
      q.includes("ação") ||
      q.includes("acao")
    ) {
      answer =
        `Plano de ação para ${nomeEmpresa}: ` +
        `1) aumentar a prospecção comercial; ` +
        `2) priorizar os clientes de maior potencial; ` +
        `3) acompanhar o faturamento semanalmente; ` +
        `4) controlar custos e margem; ` +
        `5) trabalhar para alcançar os ${formatarMoeda(meta)} da meta mensal. ` +
        `Atualmente, o progresso é de ${progresso}%.`;
    }

    else {
      answer =
        `Analisei os dados disponíveis da ${nomeEmpresa}. ` +
        `Seu faturamento é de ${formatarMoeda(faturamento)}, ` +
        `você possui ${clientes} clientes ativos e sua meta é ` +
        `${formatarMoeda(meta)}. ` +
        `O progresso atual é de ${progresso}%. ` +
        `Seu segmento é ${segmento} e o principal objetivo é "${objetivo}". ` +
        `Posso analisar suas vendas, clientes, meta, custos, margem ou criar um plano de ação.`;
    }

    return res.status(200).json({
      answer
    });

  } catch (error) {
    console.error("Erro no Copilot:", error);

    return res.status(500).json({
      error: "Erro interno do Copilot"
    });
  }
}
