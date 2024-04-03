import Message from "../types/interface.ts";

const chatContainer = document.getElementById(
  "chat-container"
) as HTMLDivElement;
const formChat = document.getElementById("form-chat") as HTMLFormElement;
const inputMessage = document.getElementById(
  "input-message"
) as HTMLInputElement;
const btnSubmit = document.getElementById("btn_submit") as HTMLButtonElement;

formChat.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = inputMessage.value.trim();

  if (!message) return;

  inputMessage.value = "";
  btnSubmit.disabled = true;
  btnSubmit.classList.add("cursor-not-allowed", "opacity-50");
  btnSubmit.textContent = "Wait for response...";

  try {
    const response = await sendQuestion(message);

    btnSubmit.disabled = false;
    btnSubmit.classList.remove("cursor-not-allowed", "opacity-50");
    btnSubmit.textContent = "Send";

    if (chatContainer) {
      displayMessage(message, "You");
      displayMessage(response.answer, "Support Team AI");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

async function sendQuestion(question: string): Promise<{ answer: string }> {
  const response = await fetch(
    `http://localhost:3000/api/question?question=${encodeURIComponent(
      question
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch response from server");
  }

  return response.json();
}

function displayMessage(text: string, sender: string) {
  if (!chatContainer) return;

  const messageHTML = `
    <div class="flex space-x-4 items-start justify-${
      sender === "You" ? "end" : "start"
    }">
      <div class="grid gap-1.5">
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4">${text}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">${sender}</div>
      </div>
      <div class="flex flex-col items-center space-y-1">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400">${getCurrentTime()}</div>
      
      </div>
    </div>
  `;

  chatContainer.innerHTML += messageHTML;
}

function getCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
