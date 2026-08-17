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
      return res.status(500).json({
        error: "OPENAI_API_KEY não configurada.",
      });
    }

    const body = req.body || {};

    const question = String(body.question || "").trim();

    const empresa = body.empresa || {};

    const historico = Array.isArray(body.historico)
      ? body.historico
      : [];

    if (!question) {
      return res.status(400).json({
        error: "Pergunta não informada.",
      });
    }

    /*
     * ============================================================
     * DADOS DA EMPRESA
     * ============================================================
     */

    const faturamento = Number(empresa.faturamento || 0);

    const meta = Number(empresa.meta || 0);

    const clientes = Number(empresa.clientes || 0);

    const custos = Number(
      empresa.custos ||
      empresa.custo ||
      empresa.despesas ||
      0
    );

    const lucro = Number(
      empresa.lucro ||
      Math.max(0, faturamento - custos)
    );

    const ticketMedio =
      clientes > 0
        ? faturamento / clientes
        : 0;

    const progresso =
      meta > 0
        ? Math.min(100, (faturamento / meta) * 100)
        : 0;

    const faltaMeta =
      Math.max(0, meta - faturamento);

    /*
     * ============================================================
     * DATA ATUAL
     * ============================================================
     */

    const agora = new Date();

    const ano = agora.getFullYear();

    const mes = agora.getMonth();

    const diaAtual = agora.getDate();

    const ultimoDia = new Date(
      ano,
      mes + 1,
      0
    ).getDate();

    const diasRestantes = Math.max(
      1,
      ultimoDia - diaAtual
    );

    const metaDiaria =
      faltaMeta > 0
        ? faltaMeta / diasRestantes
        : 0;

    /*
     * ============================================================
     * CONTEXTO DA EMPRESA
     * ============================================================
     */

    const contextoEmpresa = `
DADOS ATUAIS DA EMPRESA

Faturamento atual: R$ ${faturamento.toFixed(2)}
Meta mensal: R$ ${meta.toFixed(2)}
Clientes ativos: ${clientes}
Custos/despesas informados: R$ ${custos.toFixed(2)}
Lucro estimado: R$ ${lucro.toFixed(2)}
Ticket médio estimado: R$ ${ticketMedio.toFixed(2)}
Progresso da meta: ${progresso.toFixed(1)}%
Valor que falta para a meta: R$ ${faltaMeta.toFixed(2)}

DATA ATUAL

Dia atual: ${diaAtual}
Último dia do mês: ${ultimoDia}
Dias restantes no mês: ${diasRestantes}

META DIÁRIA NECESSÁRIA

R$ ${metaDiaria.toFixed(2)} por dia para atingir a meta mensal.
`;

    /*
     * ============================================================
     * SISTEMA DO COPILOT
     * ============================================================
     */

    const systemPrompt = `
Você é o JZ Prime Copilot, um consultor empresarial inteligente.

Seu objetivo é ajudar o empresário a tomar decisões melhores usando
os dados reais da empresa fornecidos no contexto.

REGRAS IMPORTANTES:

1. Responda sempre em português do Brasil.

2. Seja profissional, direto, estratégico e prático.

3. Use os dados da empresa sempre que forem relevantes.

4. Nunca invente números que não estejam disponíveis.

5. Quando faltar uma informação, deixe isso claro.

6. Você deve entender o contexto da conversa.

Por exemplo:

Usuário:
"Quanto falta para minha meta?"

Copilot:
"Faltam R$ 20.000."

Usuário:
"Faça isso."

Nesse caso, "isso" significa continuar a ação sugerida anteriormente.
Você deve entender a referência e não responder com uma mensagem genérica.

7. Quando o usuário disser:
"faça isso",
"continue",
"e agora?",
"como faço?",
"monte",
"pode fazer",
"faça",
"quero",
ou frases semelhantes,

use o histórico da conversa para descobrir exatamente o que está sendo solicitado.

8. Se o usuário pedir um plano de ação, entregue um plano concreto.

9. Quando analisar uma meta financeira, sempre que possível mostre:

- valor atual;
- meta;
- valor que falta;
- percentual atingido;
- valor necessário por dia;
- quantidade de vendas/clientes necessária, se houver dados suficientes;
- ações recomendadas.

10. Não fique repetindo que pode ajudar.
Ajude diretamente.

11. Evite respostas genéricas como:
"Posso analisar faturamento, clientes e metas."
Se a pergunta puder ser respondida com os dados disponíveis, responda.

12. Formate valores monetários em reais.

13. Use títulos curtos, listas e emojis com moderação para facilitar a leitura.

14. Quando houver uma oportunidade de ação, termine com uma recomendação objetiva.

15. Não diga que você é apenas uma IA.

16. Pense como um consultor empresarial.

CONTEXTO DA EMPRESA:

${contextoEmpresa}
`;

    /*
     * ============================================================
     * HISTÓRICO DA CONVERSA
     * ============================================================
     */

    const mensagensHistorico = historico
      .slice(-12)
      .map((item) => {
        const role =
          item.role === "assistant"
            ? "assistant"
            : "user";

        const content = String(
          item.content ||
          item.text ||
          ""
        ).trim();

        return {
          role,
          content,
        };
      })
      .filter((item) => item.content);

    /*
     * ============================================================
     * MONTAGEM DAS MENSAGENS
     * ============================================================
     */

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...mensagensHistorico,
      {
        role: "user",
        content: question,
      },
    ];

    /*
     * ============================================================
     * OPENAI
     * ============================================================
     */

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.4,
      max_tokens: 1200,
    });

    const resposta =
      completion.choices?.[0]?.message?.content?.trim();

    if (!resposta) {
      throw new Error(
        "A OpenAI não retornou uma resposta."
      );
    }

    return res.status(200).json({
      answer: resposta,
      resposta: resposta,
      success: true,
    });

  } catch (error) {
    console.error("Erro no Copilot:", error);

    return res.status(500).json({
      error: "Erro ao processar o Copilot.",
      details:
        error?.message ||
        "Erro desconhecido.",
    });
  }
}
