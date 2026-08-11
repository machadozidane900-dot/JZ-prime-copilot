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

```
if (!question || !String(question).trim()) {
  return res.status(400).json({
    error: "Pergunta não informada",
  });
}

const nomeEmpresa = empresa.empresa || "sua empresa";
const responsavel = empresa.responsavel || "não informado";
const segmento = empresa.segmento || "não informado";

const faturamento = Number(empresa.faturamento) || 0;
const clientes = Number(empresa.clientes) || 0;
const metaCadastrada = Number(empresa.meta) || 0;
const oportunidades = Number(empresa.oportunidades) || 0;
const objetivo = empresa.objetivo || "Aumentar vendas";

const ticketMedio =
  clientes > 0 ? faturamento / clientes : 0;

const formatarMoeda = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const contexto = `
```

Você é o JZ Prime Copilot, um assistente estratégico empresarial.

Seu trabalho é analisar perguntas do usuário como um consultor empresarial experiente.

DADOS ATUAIS DA EMPRESA:

Empresa: ${nomeEmpresa}
Responsável: ${responsavel}
Segmento: ${segmento}

Faturamento mensal atual: ${formatarMoeda(faturamento)}
Clientes ativos: ${clientes}
Meta cadastrada no sistema: ${formatarMoeda(metaCadastrada)}
Oportunidades cadastradas: ${oportunidades}
Objetivo principal: ${objetivo}
Ticket médio aproximado: ${formatarMoeda(ticketMedio)}

REGRAS:

* Responda sempre em português do Brasil.
* Seja profissional, claro e objetivo.
* Use os dados reais fornecidos acima.
* Não invente dados da empresa.
* Você pode analisar vendas, faturamento, metas, clientes, custos, despesas, margem, lucro, marketing, estratégia, planejamento e crescimento.
* O usuário pode fazer perguntas diferentes das opções existentes no sistema.
* Não use respostas prontas.
* Analise a pergunta individualmente.
* Se o usuário informar uma nova meta na pergunta, use ESSA META na análise, mesmo que seja diferente da meta cadastrada.
* Se houver números suficientes, faça os cálculos.
* Mostre os cálculos de forma simples.
* Quando fizer estimativas, deixe claro que são estimativas.
* Dê recomendações práticas.
* Evite respostas genéricas.
* Pense como um consultor estratégico de negócios.
* Não diga que não possui dados que foram fornecidos acima.

IMPORTANTE SOBRE METAS:

Se o usuário perguntar algo como:

"Como faço para aumentar meu faturamento de R$ 70 mil para R$ 130 mil?"

Você deve interpretar:

Faturamento atual = R$ 70.000
Nova meta = R$ 130.000
Aumento necessário = R$ 60.000
Crescimento necessário = aproximadamente 85,7%

Depois, explique estratégias concretas para atingir essa diferença.

Se houver dados de clientes, também analise:

* ticket médio;
* quantidade de novos clientes necessária;
* possibilidade de aumentar ticket;
* frequência de compra;
* vendas adicionais;
* clientes de maior potencial.

Não invente preços ou taxas de conversão. Se precisar estimar, deixe claro que é uma simulação.

FORMATO PREFERENCIAL:

Comece respondendo diretamente à pergunta.

Depois, quando fizer sentido, apresente:

1. Diagnóstico
2. Cálculo
3. Estratégias
4. Plano de ação

A resposta deve ser útil para o empresário tomar uma decisão.
`;

```
const response = await client.responses.create({
  model: "gpt-5-mini",
  instructions: contexto,
  input: String(question),
});

const answer =
  response.output_text ||
  "Não consegui gerar uma resposta neste momento.";

return res.status(200).json({
  answer,
});
```

} catch (error) {
console.error("Erro no Copilot:", error);

```
return res.status(500).json({
  error: "Erro ao consultar a inteligência artificial.",
});
```

}
}
