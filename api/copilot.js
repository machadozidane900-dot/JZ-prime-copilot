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

    const ticketMedio =
      clientes > 0
        ? faturamento / clientes
        : 0;

    const progresso =
      meta > 0
        ? Math.round(
            (faturamento / meta) * 100
          )
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

    const contexto = `
Você é o JZ Prime Copilot, um consultor estratégico empresarial.

Sua função é analisar a pergunta do usuário usando os dados atuais da empresa e fornecer uma resposta prática, inteligente e personalizada.

DADOS ATUAIS DA EMPRESA

Empresa:
${nomeEmpresa}

Responsável:
${responsavel}

Segmento:
${segmento}

Faturamento mensal atual:
${formatarMoeda(faturamento)}

Clientes ativos:
${clientes}

Meta mensal cadastrada:
${formatarMoeda(meta)}

Progresso da meta:
${progresso}%

Oportunidades:
${oportunidades}

Objetivo principal:
${objetivo}

Ticket médio aproximado:
${formatarMoeda(ticketMedio)}

REGRAS DO COPILOT

1. Responda sempre em português do Brasil.

2. Seja profissional, claro e objetivo.

3. Use os dados reais fornecidos acima.

4. Nunca invente dados da empresa.

5. Quando houver números suficientes, faça os cálculos necessários.

6. Se o usuário informar uma nova meta na própria pergunta, essa nova meta tem prioridade sobre a meta cadastrada.

7. Sempre calcule quanto falta para atingir uma meta quando isso fizer sentido.

8. Mostre cálculos de forma simples e fácil de entender.

9. Transforme a análise em ações práticas.

10. Evite respostas genéricas.

11. Responda diretamente à pergunta do usuário.

12. Você pode analisar:

- faturamento
- vendas
- clientes
- ticket médio
- metas
- custos
- despesas
- margem
- lucro
- marketing
- aquisição de clientes
- retenção
- crescimento
- planejamento comercial
- oportunidades

13. Quando fizer uma estimativa, deixe claro que é uma estimativa.

14. Pense como um consultor empresarial.

15. Quando o usuário perguntar como aumentar o faturamento, considere estratégias como:

- aumentar o número de clientes
- aumentar o ticket médio
- aumentar a frequência de compra
- melhorar a conversão
- recuperar clientes antigos
- criar novas ofertas
- melhorar o processo comercial

16. Sempre que possível, transforme objetivos em números.

17. A resposta deve ser útil para tomada de decisão.

EXEMPLO:

Se o faturamento atual for R$ 50.000 e o usuário perguntar:

"Como faço para chegar a R$ 130.000?"

Considere R$ 130.000 como a nova meta da pergunta.

Calcule:

- faturamento atual
- nova meta
- diferença em reais
- crescimento necessário
- possíveis estratégias para alcançar a meta

PERGUNTA DO USUÁRIO:

${question}
`;

    const response =
      await client.responses.create({
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
