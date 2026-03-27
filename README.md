# Olharr Studio

Agente de IA para criação de moodboards e storyboards cinematográficos.

## Setup

```bash
npm install
cp .env.example .env.local
# Adicione sua GEMINI_API_KEY no .env.local
npm run dev
```

## API Key Gratuita

1. Acesse https://ai.google.dev
2. Clique "Get API Key"
3. Copie a key para `.env.local`

## Deploy no Vercel

```bash
vercel --prod
```

Configure `GEMINI_API_KEY` nas Environment Variables do projeto no Vercel.
