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

    const nomeEmpresa = empresa.empresa || "sua empresa";
    const responsavel = empresa.responsavel || "não informado";
    const segmento = empresa.segmento || "não informado";

    const faturamento = Number(empresa.faturamento) || 0;
    const clientes = Number(empresa.clientes) || 0;
    const meta = Number(empresa.meta) || 0;
    const oportunidades = Number(empresa.oportunidades) || 0;

    const objetivo = empresa.objetivo || "Aumentar vendas";

    const progresso =
      meta > 0
        ? Math.round((faturamento / meta) * 100)
        : 0;

    const restante =
      meta > 0
        ? Math.max(meta - faturamento, 0)
        : 0;

    const ticketMedio =
      clientes > 0
        ? faturamento / clientes
        : 0;

    const formatarMoeda = (valor) =>
      Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

    const contexto = `
Você é o JZ Prime Copilot, um assistente estratégico empresarial.

Você está conversando com o responsável pela empresa.

DADOS ATUAIS DA EMPRESA:

Empresa: ${nomeEmpresa}
Responsável: ${responsavel}
Segmento: ${segmento}

Faturamento mensal: ${formatarMoeda(faturamento)}
Clientes ativos: ${clientes}
Meta mensal cadastrada: ${formatarMoeda(meta)}
Progresso da meta cadastrada: ${progresso}%
Valor restante para a meta cadastrada: ${formatarMoeda(restante)}
Oportunidades: ${oportunidades}
Objetivo principal: ${objetivo}
Ticket médio aproximado: ${formatarMoeda(ticketMedio)}

REGRAS IMPORTANTES:

1. Responda sempre em português do Brasil.
2. Seja profissional, claro e direto.
3. Use os dados da empresa quando forem relevantes.
4. Você pode responder perguntas sobre vendas, faturamento, clientes, metas, custos, despesas, margem, lucro, marketing, estratégia, planejamento e crescimento.
5. O usuário pode perguntar qualquer coisa relacionada à gestão empresarial.
6. Não fique limitado às respostas prontas do sistema.
7. Analise a pergunta antes de responder.
8. Não invente dados da empresa.
9. Se precisar fazer uma estimativa, deixe claro que é uma estimativa.
10. Quando o usuário informar uma nova meta dentro da pergunta, use essa meta na análise.
11. Quando houver números suficientes, faça os cálculos necessários.
12. Sempre que possível, transforme a análise em ações práticas.
13. Evite respostas genéricas.
14. Se a pergunta for sobre aumentar faturamento, explique caminhos concretos para crescimento.
15. Se o usuário perguntar quanto falta para determinada meta, calcule usando o faturamento atual informado.
16. Não diga que você não possui os dados se eles estiverem acima.
17. Você é um copiloto estratégico: pense como um consultor empresarial.

A pergunta do usuário é:

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
