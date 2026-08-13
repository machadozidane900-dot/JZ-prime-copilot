import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

const client = apiKey
  ? new OpenAI({
      apiKey: apiKey,
    })
  : null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido",
    });
  }

  try {
    if (!client) {
      console.error("OPENAI_API_KEY não configurada.");

      return res.status(500).json({
        error: "OPENAI_API_KEY não configurada no Vercel.",
      });
    }

    const { question, empresa = {} } = req.body || {};

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Pergunta não informada.",
      });
    }

    const nomeEmpresa = empresa.empresa || "sua empresa";
    const responsavel = empresa.responsavel || "não informado";
    const segmento = empresa.segmento || "não informado";

    const faturamento = Number(empresa.faturamento) || 0;
    const clientes = Number(empresa.clientes) || 0;
    const meta = Number(empresa.meta) || 0;
    const oportunidades = Number(empresa.oportunidades) || 0;

    const objetivo = empresa.objetivo || "Aumentar vendas";

    const ticketMedio =
      clientes > 0
        ? faturamento / clientes
        : 0;

    const progresso =
      meta > 0
        ? Math.round((faturamento / meta) * 100)
        : 0;

    function formatarMoeda(valor) {
      return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }

    const contexto = `
Você é o JZ Prime Copilot, um consultor estratégico empresarial.

Responda sempre em português do Brasil.

DADOS DA EMPRESA

Empresa: ${nomeEmpresa}
Responsável: ${responsavel}
Segmento: ${segmento}

Faturamento mensal:
${formatarMoeda(faturamento)}

Clientes ativos:
${clientes}

Meta mensal:
${formatarMoeda(meta)}

Progresso da meta:
${progresso}%

Oportunidades:
${oportunidades}

Objetivo principal:
${objetivo}

Ticket médio:
${formatarMoeda(ticketMedio)}

REGRAS

- Seja profissional, claro e objetivo.
- Use os dados reais fornecidos.
- Nunca invente dados.
- Faça cálculos quando houver dados suficientes.
- Se o usuário informar uma nova meta na pergunta, use essa nova meta.
- Calcule quanto falta para atingir a meta quando fizer sentido.
- Mostre os cálculos de forma simples.
- Transforme a análise em ações práticas.
- Evite respostas genéricas.
- Pense como um consultor empresarial.
- Quando fizer estimativas, informe que são estimativas.
- Analise vendas, faturamento, clientes, ticket médio, metas, custos, despesas, margem, lucro, marketing, aquisição, retenção, crescimento e oportunidades.
- Sempre que possível, transforme objetivos em números.

PERGUNTA DO USUÁRIO

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
      answer: answer,
    });

  } catch (error) {
    console.error("Erro no Copilot:", error);

    return res.status(500).json({
      error: "Erro ao consultar a inteligência artificial.",
    });
  }
}
