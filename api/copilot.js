import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido",
    });
  }

  try {
    const { question, empresa = {} } = req.body || {};

    if (!question) {
      return res.status(400).json({
        error: "Pergunta não informada",
      });
    }

    const nomeEmpresa =
      empresa.empresa || "sua empresa";

    const responsavel =
      empresa.responsavel || "não informado";

    const segmento =
      empresa.segmento || "não informado";

    const faturamento =
      Number(empresa.faturamento) || 0;

    const clientes =
      Number(empresa.clientes) || 0;

    const meta =
      Number(empresa.meta) || 0;

    const oportunidades =
      Number(empresa.oportunidades) || 0;

    const objetivo =
      empresa.objetivo || "Aumentar vendas";

    const formatarMoeda = (valor) => {
      return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    };

    const progresso =
      meta > 0
        ? Math.round((faturamento / meta) * 100)
        : 0;

    const contexto = `
Você é o JZ Prime Copilot, um consultor estratégico empresarial.

Você deve analisar a pergunta do usuário usando os dados atuais da empresa.

DADOS DA EMPRESA:

Empresa: ${nomeEmpresa}
Responsável: ${responsavel}
Segmento: ${segmento}

Faturamento mensal atual:
${formatarMoeda(faturamento)}

Clientes ativos:
${clientes}

Meta mensal cadastrada:
${formatarMoeda(meta)}

Progresso da meta cadastrada:
${progresso}%

Oportunidades:
${oportunidades}

Objetivo principal:
${objetivo}

REGRAS:

- Responda sempre em português do Brasil.
- Seja profissional, claro e objetivo.
- Use os dados da empresa.
- Não invente dados.
- Faça cálculos quando houver números suficientes.
- Se o usuário informar uma nova meta na pergunta, use essa nova meta.
- Não fique limitado à meta cadastrada no dashboard.
- Se o usuário perguntar sobre uma meta diferente da cadastrada, analise a meta informada.
- Explique os cálculos de forma simples.
- Dê recomendações práticas.
- Evite respostas genéricas.
- Pense como um consultor empresarial.
- Considere faturamento, vendas, clientes, ticket médio, margem, custos, lucro e crescimento.
- Quando fizer uma estimativa, diga claramente que é uma estimativa.

EXEMPLO:

Se o usuário perguntar:

"Como faço para aumentar meu faturamento de R$ 70 mil para R$ 130 mil?"

Você deve perceber que a meta da pergunta é R$ 130.000,00,
mesmo que a meta cadastrada no sistema seja diferente.

Calcule:

Faturamento atual: ${formatarMoeda(faturamento)}

Meta solicitada pelo usuário:
R$ 130.000,00

Depois calcule quanto falta e explique caminhos possíveis para alcançar esse valor.

PERGUNTA DO USUÁRIO:

${question}
`;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: contexto,
      input: question,
    });

    const answer =
      response.output_text ||
      "Não consegui gerar uma resposta neste momento.";

    return res.status(200).json({
      answer,
    });

  } catch (error) {
    console.error("Erro no Copilot:", error);

    return res.status(500).json({
      error: "Erro ao consultar a inteligência artificial.",
    });
  }
}
