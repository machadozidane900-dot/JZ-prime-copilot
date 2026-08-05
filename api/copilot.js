export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({
error: "Método não permitido"
});
}

try {
const { question } = req.body || {};

```
if (!question) {
  return res.status(400).json({
    error: "Pergunta não informada"
  });
}

const q = question.toLowerCase();

let answer =
  "Entendi sua pergunta. Posso ajudar a analisar vendas, custos, margem, clientes, financeiro e oportunidades da sua empresa.";

if (
  q.includes("venda") ||
  q.includes("vendas") ||
  q.includes("faturamento")
) {
  answer =
    "As vendas apresentam evolução positiva. Recomendo acompanhar conversão, ticket médio e frequência de compra. O próximo passo é identificar quais clientes possuem maior potencial de crescimento.";
}

if (
  q.includes("custo") ||
  q.includes("custos") ||
  q.includes("despesa") ||
  q.includes("despesas")
) {
  answer =
    "Para reduzir custos sem prejudicar o crescimento, comece separando despesas fixas, variáveis e comerciais. Depois, identifique os gastos que não estão contribuindo diretamente para receita ou margem.";
}

if (
  q.includes("margem") ||
  q.includes("lucro") ||
  q.includes("rentabilidade")
) {
  answer =
    "A margem merece acompanhamento próximo. Identifique quais produtos ou serviços possuem maior margem e concentre esforços comerciais nessas oportunidades.";
}

if (
  q.includes("cliente") ||
  q.includes("clientes")
) {
  answer =
    "Analise os clientes por faturamento, frequência de compra e potencial de crescimento. Isso ajuda a identificar clientes estratégicos e oportunidades de expansão.";
}

if (
  q.includes("plano") ||
  q.includes("estratégia") ||
  q.includes("estrategia")
) {
  answer =
    "Plano recomendado: analisar os indicadores, identificar os principais gargalos, priorizar as oportunidades de maior impacto, definir responsáveis e acompanhar os resultados semanalmente.";
}

return res.status(200).json({
  answer
});
```

} catch (error) {
return res.status(500).json({
error: "Erro interno do Copilot"
});
}
}
