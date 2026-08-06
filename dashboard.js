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

if (!overlay) {
return;
}

if (!event || event.target === overlay) {
overlay.classList.remove("open");
}
}

function ask(question) {
openChat();

const input = document.getElementById("input");

if (!input) {
return;
}

input.value = question;
send();
}

function addMessage(text, type) {
const messages = document.getElementById("messages");

if (!messages) {
return;
}

const bubble = document.createElement("div");

bubble.className = "bubble " + type;
bubble.textContent = text;

messages.appendChild(bubble);
messages.scrollTop = messages.scrollHeight;
}

async function send() {
const input = document.getElementById("input");

if (!input) {
return;
}

const question = input.value.trim();

if (!question) {
return;
}

addMessage(question, "user");

input.value = "";

addMessage("Analisando sua pergunta...", "ai");

try {
const response = await fetch("/api/copilot", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
question: question
})
});


const data = await response.json();

const messages = document.getElementById("messages");

if (messages && messages.lastElementChild) {
  messages.removeChild(messages.lastElementChild);
}

if (!response.ok) {
  throw new Error(
    data.error || "Erro ao consultar o Copilot"
  );
}

addMessage(
  data.answer || "Não consegui gerar uma resposta.",
  "ai"
);


} catch (error) {
const messages = document.getElementById("messages");


if (messages && messages.lastElementChild) {
  messages.removeChild(messages.lastElementChild);
}

addMessage(
  "Não consegui conectar ao Copilot agora. Tente novamente em alguns segundos.",
  "ai"
);

console.error(error);


}
}

function downloadReport() {
const report = `JZ PRIME COPILOT — RESUMO EXECUTIVO

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
function perguntarCopilot(){

    const pergunta = document.getElementById("perguntaCopilot").value;

    let resposta = "";

    if(pergunta.toLowerCase().includes("venda")){
        resposta = "Analisei sua situação. Recomendo aumentar o contato com clientes atuais, criar ofertas de recompra e acompanhar suas metas semanalmente.";
    }

    else if(pergunta.toLowerCase().includes("lucro")){
        resposta = "Para aumentar o lucro, avalie custos, margem dos produtos e priorize clientes com maior potencial.";
    }

    else{
        resposta = "Minha recomendação é analisar seus indicadores, clientes e metas antes de tomar decisões.";
    }

    document.getElementById("respostaCopilot").innerHTML = resposta;

}
