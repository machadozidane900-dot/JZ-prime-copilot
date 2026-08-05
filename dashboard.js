function openChat() {
const overlay = document.getElementById("overlay");
const input = document.getElementById("input");

if (overlay) {
overlay.classList.add("open");
}

if (input) {
input.focus();
}
}

function closeChat(event) {
const overlay = document.getElementById("overlay");

if (!overlay) return;

if (!event || event.target === overlay) {
overlay.classList.remove("open");
}
}

function ask(question) {
openChat();

const input = document.getElementById("input");

if (!input) return;

input.value = question;
send();
}

function addMessage(text, type) {
const messages = document.getElementById("messages");

if (!messages) return;

const bubble = document.createElement("div");

bubble.className = `bubble ${type}`;
bubble.textContent = text;

messages.appendChild(bubble);
messages.scrollTop = messages.scrollHeight;
}

function generateCopilotResponse(question) {
const q = question.toLowerCase();

if (
q.includes("venda") ||
q.includes("vendas") ||
q.includes("faturamento")
) {
return "As vendas apresentam evolução positiva. Recomendo acompanhar conversão, ticket médio e frequência de compra. O próximo passo é identificar quais clientes possuem maior potencial de crescimento.";
}

if (
q.includes("custo") ||
q.includes("custos") ||
q.includes("despesa") ||
q.includes("despesas")
) {
return "Os custos merecem acompanhamento próximo. Recomendo separar despesas fixas e variáveis, identificar os maiores centros de custo e comparar a evolução mensal antes de tomar decisões.";
}

if (
q.includes("margem") ||
q.includes("lucro") ||
q.includes("rentabilidade")
) {
return "A margem é um dos principais indicadores para acompanhar. O ideal é identificar quais produtos ou serviços geram maior margem e concentrar esforços comerciais nessas oportunidades.";
}

if (
q.includes("cliente") ||
q.includes("clientes")
) {
return "A carteira de clientes deve ser analisada por frequência de compra, faturamento e potencial de crescimento. Isso permite identificar clientes estratégicos e oportunidades de expansão.";
}

if (
q.includes("plano") ||
q.includes("estratégia") ||
q.includes("estrategia")
) {
return "Plano recomendado: 1) analisar os principais indicadores; 2) identificar gargalos; 3) priorizar oportunidades de maior impacto; 4) definir responsáveis e prazos; 5) acompanhar os resultados semanalmente.";
}

if (
q.includes("financeiro") ||
q.includes("finanças") ||
q.includes("financas")
) {
return "No financeiro, recomendo acompanhar faturamento, margem, despesas, fluxo de caixa e resultado. O objetivo é transformar esses números em decisões práticas para o negócio.";
}

return "Entendi sua pergunta. Para uma análise mais precisa, posso avaliar vendas, custos, margem, clientes, financeiro ou montar um plano de ação para sua empresa.";
}

function send() {
const input = document.getElementById("input");

if (!input) return;

const question = input.value.trim();

if (!question) return;

addMessage(question, "user");

input.value = "";

setTimeout(() => {
const response = generateCopilotResponse(question);

```
addMessage(response, "ai");
```

}, 450);
}

function downloadReport() {
const report =
`JZ PRIME COPILOT — RESUMO EXECUTIVO

Faturamento: R$ 284.620
Lucro estimado: R$ 58.420
Meta mensal: 82%

RECOMENDAÇÃO

Manter controle de custos, acompanhar margem,
identificar oportunidades comerciais e priorizar
ações de maior impacto.

JZ Prime Copilot
Estratégia orientada por dados.`;

const file = new Blob([report], {
type: "text/plain"
});

const link = document.createElement("a");

link.href = URL.createObjectURL(file);
link.download = "jz-prime-resumo-executivo.txt";

link.click();

URL.revokeObjectURL(link.href);
}
