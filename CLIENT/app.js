const form = document.getElementById("form");
const button = document.getElementById("button");
const history = document.getElementById("chatOutput");
const totalTokensText = document.getElementById("totalTokens");
let totalTokens = 0;
const url = "http://localhost:3000";



async function getData() {
    const formData = new FormData(form);
    const user = formData.get("question");
    try {
        const userHistory = document.createElement('p');
        userHistory.className = "userText";
        userHistory.innerHTML = user;
        history.appendChild(userHistory);
        history.scrollTop = history.scrollHeight;
        // console.log(JSON.stringify({ user }));
        button.disabled = true;
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user })
        })
            .then(response => response.json())
            // .then(data => console.log(data))
            .then(data => aiResponse = data)
            .catch(error => console.error('Error:', error));

        const aiHistory = document.createElement('p');
        aiHistory.className = "aiText";
        aiHistory.innerHTML = marked.parse(aiResponse.aiAnswer);
        totalTokens = aiResponse.totalTokens;
        totalTokensText.innerHTML = `total tokens used: ${totalTokens}`;
        // aiHistory.innerHTML = aiResponse.aiAnswer;
        history.appendChild(aiHistory);
        history.scrollTop = history.scrollHeight;
        button.disabled = false;

    } catch (error) {
        console.error(error.message);
    }
}

