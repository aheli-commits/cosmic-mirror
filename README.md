# cosmic-mirror
Cosmic Mirror is an AI-powered self-discovery experience that transforms birth details into thoughtful, personalized insights. Blending astrology, storytelling, and reflection, it helps users explore personality patterns, relationships, strengths, challenges, and personal growth through beautifully crafted readings.

Run locally
---------

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

Backend Setup
--------------

The Express backend calls OpenAI to generate personalized readings.

### 1. Get an OpenAI API Key

- Go to https://platform.openai.com/api/keys
- Create a new API key
- Copy the key (you won't be able to see it again)

### 2. Set the API Key

**In Codespaces:**
- Open Codespaces settings: Click your profile icon → Codespaces → Dot menu (•••) on the environment
- Add a secret `OPENAI_API_KEY` with your API key value
- Restart your Codespaces environment

**Locally:**
```bash
export OPENAI_API_KEY="sk-your-api-key-here"
npm run start:server
```

### 3. Start the Backend Server

```bash
npm run start:server
```

The server listens at http://localhost:4000 and calls OpenAI's GPT-3.5-turbo model to generate cosmic readings.
