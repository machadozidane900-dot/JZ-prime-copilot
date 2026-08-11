import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

    const faturamento =
      Number(empresa.faturamento) || 0;

    const clientes =
      Number(empresa.clientes) || 0;

    const meta =
      Number(empresa.meta) || 0;

    const oportunidades =
      Number(empresa.oportunidades) || 0;

    const progresso =
      meta > 0
        ? Math.round((faturamento / meta) * 100)
        : 0;

    const empresaNome =
      empresa.empresa || "Empresa";

    const responsavel =
      empresa.responsavel || "Responsável não informado";

    const segmento =
      empresa.segmento || "Não informado";

    const objetivo =
      empresa.objetivo || "Aumentar vendas";

    const contextoEmpresa = `
Você é o JZ Prime Copilot, um assistente estratégico empresarial.

DADOS DA EMPRESA:

Empresa: ${empresaNome}
Responsável: ${responsavel}
Segmento: ${segmento}
Faturamento mensal: R$ ${faturamento.toLocaleString("pt-BR")}
Clientes ativos: ${clientes}
Meta mensal: R$ ${meta.toLocaleString("pt-BR")}
Progresso da meta: ${progresso}%
Oportunidades: ${oportunidades}
Objetivo principal: ${objetivo}

REGRAS:

- Responda em português do Brasil.
- Seja claro, profissional e objetivo.
- Use os dados da empresa sempre que forem relevantes.
- Não invente números que não foram fornecidos.
- Quando fizer estimativas, deixe claro que são estimativas.
- Dê recomendações práticas.
- Priorize vendas, faturamento, clientes, custos, margem, metas e crescimento.
- Quando possível, apresente passos concretos.
`;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: contextoEmpresa,
      input: question
    });

    const answer =
      response.output_text ||
      "Não consegui gerar uma resposta neste momento.";

    return res.status(200).json({
      answer
    });

  } catch (error) {
    console.error("Erro no Copilot:", error);

    return res.status(500).json({
      error: "Erro ao consultar a inteligência artificial."
    });
  }
}


Atualizar configuração do Copilot
