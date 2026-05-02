# John - The Weather AI

Een chatbot die je advies geeft over wat je moet aantrekken op basis van het actuele weer.

## Projectstructuur

```
├── CLIENT/
│   ├── index.html
│   ├── app.js
│   └── styles/
└── SERVER/
    ├── index.js
    ├── .env
    └── package.json
```

## Vereisten

- Node.js
- npm
- OpenWeatherMap API key
- Anthropic API key

## Installatie

```bash
cd SERVER
npm install
```

Maak een `.env` bestand aan in de `SERVER` map:

```
AIKEY=jouw_anthropic_api_key
WEATHERAPIKEY=jouw_openweathermap_api_key
```

## Starten

```bash
cd SERVER
node index.js
```

Open `CLIENT/index.html` in je browser.

## Features

- Actueel weer ophalen via OpenWeatherMap API
- Kledingadvies via Claude (Anthropic)
- Chat history bijgehouden per sessie
- Token gebruik zichtbaar in de UI
- Markdown rendering van AI antwoorden
- Submit knop geblokkeerd tijdens verwerking
