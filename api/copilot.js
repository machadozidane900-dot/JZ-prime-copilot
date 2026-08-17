import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

const client = apiKey
  ? new OpenAI({
      apiKey,
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

    // ==============================
    // DADOS DA EMPRESA
    // ==============================

    const nomeEmpresa =
      empresa.empresa || "sua empresa";

    const responsavel =
      empresa.responsavel || "não informado";

    const segmento =
      empresa.segmento || "não informado";

    const objetivo =
      empresa.objetivo || "não informado";

    const faturamento =
      Number(empresa.faturamento) || 0;

    const clientes =
      Number(empresa.clientes) || 0;

    const meta =
      Number(empresa.meta) || 0;

    const oportunidades =
      Number(empresa.oportunidades) || 0;

    // ==============================
    // CÁLCULOS
    // ==============================

    const ticketMedio =
      clientes > 0
        ? faturamento / clientes
        : 0;

    const percentualMeta =
      meta > 0
        ? (faturamento / meta) * 100
        : 0;

    const progressoMeta =
      Math.round(percentualMeta);

    const valorFaltante =
      Math.max(meta - faturamento, 0);

    const clientesNecessarios =
      ticketMedio > 0
        ? Math.ceil(valorFaltante / ticketMedio)
        : 0;

    function formatarMoeda(valor) {
      return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL",
        }
      );
    }

    // ==============================
    // CONTEXTO DO COPILOT
    // ==============================

    const contexto = `
Você é o JZ Prime Copilot, um consultor estratégico
de negócios integrado a um sistema SaaS empresarial.

Sua função é analisar os dados da empresa e ajudar
o responsável a tomar decisões melhores.

RESPONDA SEMPRE EM PORTUGUÊS DO BRASIL.

========================================
DADOS DA EMPRESA
========================================

Empresa:
${nomeEmpresa}

Responsável:
${responsavel}

Segmento:
${segmento}

Objetivo principal:
${objetivo}

========================================
INDICADORES
========================================

Faturamento mensal:
${formatarMoeda(faturamento)}

Clientes ativos:
${clientes}

Meta mensal:
${formatarMoeda(meta)}

Progresso da meta:
${progressoMeta}%

Valor que falta para atingir a meta:
${formatarMoeda(valorFaltante)}

Ticket médio:
${formatarMoeda(ticketMedio)}

Oportunidades identificadas:
${oportunidades}

Clientes adicionais necessários,
considerando o ticket médio atual:
${clientesNecessarios}

========================================
COMPORTAMENTO
========================================

Você deve:

- Ser profissional e objetivo.
- Responder de forma prática.
- Usar os dados reais fornecidos.
- Nunca inventar números.
- Fazer cálculos quando houver dados suficientes.
- Explicar os cálculos de forma simples.
- Identificar problemas e oportunidades.
- Sugerir ações práticas.
- Priorizar ações de maior impacto.
- Considerar faturamento, vendas, clientes,
  ticket médio, metas, aquisição, retenção,
  custos, despesas, margem e crescimento.
- Quando não houver dados suficientes,
  deixe isso claro.
- Quando fizer uma estimativa,
  informe que é uma estimativa.
- Não apresentar uma estimativa como fato.
- Se o usuário informar uma nova meta,
  utilize a nova meta no cálculo.
- Se o usuário perguntar quanto precisa vender,
  calcule quando os dados permitirem.
- Se o usuário perguntar como atingir uma meta,
  transforme a resposta em um plano de ação.
- Evite respostas genéricas.

========================================
FORMATO DAS RESPOSTAS
========================================

Sempre que fizer sentido:

1. Análise
2. Diagnóstico
3. Números importantes
4. Ações recomendadas

Não utilize esse formato de maneira artificial
quando uma resposta curta for suficiente.

========================================
PERGUNTA
========================================

${question.trim()}
`;

    // ==============================
    // OPENAI
    // ==============================

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: contexto,
      input: question.trim(),
    });

    const answer =
      response.output_text ||
      "Não consegui gerar uma resposta neste momento.";

    return res.status(200).json({
      answer,
    });

  } catch (error) {
    console.error(
      "Erro no Copilot:",
      error
    );

    return res.status(500).json({
      error:
        "Erro ao consultar a inteligência artificial.",
    });
  }
}
