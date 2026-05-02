const express = require('express');
const cors = require('cors');
require('dotenv').config();
let currentWeather ='';
let totalTokens = 0;
const { ChatAnthropic } = require("@langchain/anthropic");

const claude = new ChatAnthropic({
    apiKey: process.env.AIKEY,
    model: "claude-haiku-4-5-20251001"
});

const tools = [{
    name: "theWeather",
    description: "gets weather information of a city",
    input_schema: {
        type: "object",
        properties: {
            city: { type: "string" }
        },
        required: ["city"]
    }
}]

const usefullClaude = claude.bindTools(tools);

const weatherApi = async (city) => {
    const weatherKey = process.env.WEATHERAPIKEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherKey}`

    try {
        await fetch(url, {
            method: "GET",
        })
            .then(response => response.json())
            // .then(data => console.log(data))
            .then(data => currentWeather = data)
            .catch(error => console.error('Error:', error));

    } catch (error) {
        console.log(error)
    }
};

const systemPrompt = `system: Je bent John, een chatbot die gebruikers helpt bepalen wat ze moeten dragen op basis van het weer.

Doel:
Minimaliseer de tijd die een gebruiker nodig heeft om een outfit te kiezen en geef praktisch, passend kledingadvies op basis van actuele weersomstandigheden.

Gedrag:

Wees kort, duidelijk en praktisch.
Geef concrete kledingadviezen (lagen, type kleding, accessoires).
Neem een adviserende toon aan.

Flow:

Controleer of je voldoende informatie hebt:
Locatie
Tijdstip/dag
Ontbreekt er informatie? Stel gerichte, korte vragen.
Zodra voldoende info beschikbaar is: geef advies.

Weerafhankelijkheid:

Gebruik alleen betrouwbare en actuele weerinformatie.
Als weerdata ontbreekt:
→ geef geen kledingadvies
→ meld kort: "Ik kan momenteel geen weergegevens ophalen, dus geen advies geven."

Output richtlijnen:

Maximaal 3–5 zinnen per antwoord
Gebruik opsommingen voor kledingadvies indien nuttig
Vermijd lange uitleg of context`
let chatHistory = [systemPrompt]

const app = express();

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
    const user = req.body.user;
    chatHistory.push(`user: ${user}`);

    let response = await usefullClaude.invoke(chatHistory);
    if (response.tool_calls.length > 0) {
        const city = response.tool_calls[0].args.city;
        await weatherApi(city);
        chatHistory.push(`tool result: ${JSON.stringify(currentWeather)}`);
        response = await usefullClaude.invoke(chatHistory);
    }
    totalTokens += response.usage_metadata.total_tokens;
    // console.log(response.usage_metadata.total_tokens)
    const aiAnswer = response.lc_kwargs.content;
    chatHistory.push(`claude: ${aiAnswer}`);
    // console.log(chatHistory);
    res.json({
        aiAnswer,
        totalTokens
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`you server running on ${port} bru`);
});