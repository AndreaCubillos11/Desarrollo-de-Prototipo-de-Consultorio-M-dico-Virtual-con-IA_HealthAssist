document.addEventListener("DOMContentLoaded", () => {
    const userInput = document.getElementById('user-input');
    userInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter' && userInput.value.trim() !== '') {
            event.preventDefault();
            const userMessage = userInput.value.trim();
            displayMessage('Usuario', userMessage);
            userInput.value = '';

            displayProcessingMessage(); // Mostrar mensaje de procesamiento

            try {
                const response = await sendMessage(userMessage);
                removeProcessingMessage(); // Eliminar el mensaje de procesamiento
                displayMessage('HealthAssist ', response);
            } catch (error) {
                console.error('Error al recibir la respuesta del servidor:', error);
                removeProcessingMessage(); // En caso de error, también eliminamos el mensaje de procesamiento
                displayMessage('HealthAssist ', 'Lo siento, hubo un problema al procesar tu solicitud.');
            }
        }
    });
});

function displayProcessingMessage() {
    const chatContainer = document.getElementById('chat-container');
    const processingMessage = document.createElement('p');
    processingMessage.id = 'processing-message';
    processingMessage.textContent = 'Procesando, por favor espera...';
    chatContainer.appendChild(processingMessage);
}

function removeProcessingMessage() {
    const processingMessage = document.getElementById('processing-message');
    if (processingMessage) {
        processingMessage.remove();
    }
}


function sendMessage(inputText) {
    const postData = {
        model: "TheBloke/CodeLlama-7B-Instruct-GGUF/codellama-7b-instruct.Q4_K_S.gguf",
        messages: [
            { role: "system", content: "Como médico experto, tu deber es resolver todas las dudas que tenga el paciente. Por favor, responde siempre en español. Solo responde preguntas que tengan que ver con medicina." },
            { role: "user", content: inputText }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false
    };
    

    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify(postData);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3003/v1/chat/completions', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.choices && response.choices[0] && response.choices[0].message) {
                        const respuesta = response.choices[0].message.content.trim();
                        resolve(respuesta);
                    } else {
                        reject("No se encontró texto en la respuesta.");
                    }
                } catch (error) {
                    reject("Error al parsear la respuesta del servidor: " + error);
                }
            } else {
                reject("Error al enviar el post: " + xhr.statusText);
            }
        };

        xhr.onerror = function () {
            reject("Error de red al enviar el post.");
        };

        xhr.send(jsonData);
    });
}

function displayTypingEffect(sender, message) {
    const chatContainer = document.getElementById('chat-container');
    let messageElement = document.getElementById('typing-message');
  
    if (!messageElement) {
      messageElement = document.createElement('p');
      messageElement.id = 'typing-message';
      chatContainer.appendChild(messageElement);
    }
}
function displayMessage(sender, message) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

