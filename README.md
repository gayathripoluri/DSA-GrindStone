# Grindstone

A local-first DSA (Data Structures & Algorithms) practice app. No login, no
cloud — your progress lives in your browser's IndexedDB, an on-device Ollama
model plays your AI interviewer/mentor, and your C++ submissions compile and
run in a sandboxed Docker container on your own machine.

Every AI interaction is designed to **never hand you the answer** — it asks
questions, gives hints, and reacts to your reasoning, the way a real interview
would.

## Features

- **Guided daily sessions** — warm-up questions → guided note-taking →
  mock interview → code → tests → reflection → spaced-repetition review,
  one problem at a time.
- **Pattern-wise theory decks** — slide-based concept explainers per pattern
  (Two Pointers, Hashing, etc.), not just a raw problem list.
- **Voice input/output** — dictate your reasoning out loud (Web Speech API);
  the AI can talk back at specific moments, never on every step.
- **Achievements** — a badge case on your Journey page that unlocks based on
  your real solve history and streaks.
- **Sandboxed code execution** — your C++ runs in a network-isolated,
  resource-capped Docker container (falls back to running locally if Docker
  isn't available — fine for solo local use, just without the isolation).
- **Fully local** — no accounts, no external API keys, no data leaves your
  machine.

## Requirements

See [requirements.txt](requirements.txt) for the full list at a glance (system
tools + exact npm packages). Summary:

| Tool | Why | Install |
|---|---|---|
| [Node.js](https://nodejs.org) 20+ | runs the Next.js app | `brew install node` |
| [Ollama](https://ollama.com) | runs the local LLM that plays interviewer/mentor | `brew install ollama` |
| [Colima](https://github.com/abiodun/colima) + Docker CLI *(optional but recommended)* | sandboxes your C++ submissions | `brew install colima docker` |

Docker/Colima is optional: if it isn't running, code still compiles and runs
using a local `g++`/`clang++` on your PATH — just without the sandbox
isolation. Fine if you're the only person using the app on your own machine;
set it up if you ever expose the app beyond that.

## Installation

```bash
git clone https://github.com/gayathripoluri/DSA-GrindStone.git
cd DSA-GrindStone/app
npm install
```

### One-time setup

```bash
# Ollama — pulls the local model used for warm-up/interview/reflection (~2GB)
brew services start ollama
ollama pull llama3.2:3b

# Colima — free Docker daemon for macOS, used to sandbox C++ execution (optional)
brew install colima docker
colima start --cpu 2 --memory 2 --disk 20
brew services start colima     # so it comes back up automatically on login
```

No `.env` file is required to run the app. See [.env.example](app/.env.example)
for the two optional overrides (`OLLAMA_URL`, `OLLAMA_MODEL`) if you're running
Ollama somewhere other than its default `localhost:11434`, or want a different
model.

## Running

```bash
# make sure Ollama is running (and Colima, if you want sandboxed execution)
ollama pull llama3.2:3b   # only needed once, skip if already pulled
colima status || colima start

cd app
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The dev server binds to
loopback only (`127.0.0.1`), not `0.0.0.0`, so it isn't reachable from other
devices on your network by default.

## Project structure

```
DSA-GrindStone/
└── app/                  # the Next.js app itself
    ├── src/
    │   ├── app/          # routes (today, journey, insights, reviews, settings, api/*)
    │   ├── components/   # session flow, theory decks, journey UI
    │   ├── data/         # problems, patterns, theory content, achievements
    │   └── lib/          # db (IndexedDB), ollama client, sandboxed C++ runner,
    │                     # rate limiting, CSRF guard, spaced repetition
    └── public/
```

## Troubleshooting

- **AI steps hang or error** — check Ollama is running: `ollama list` should
  show `llama3.2:3b`. Restart with `brew services restart ollama`.
- **Code submissions run unsandboxed** — the app logs a one-line warning
  server-side and still works, just without isolation. Run
  `colima status`; if it's not running, `colima start`.
- **Port 3000 already in use** — stop whatever else is using it, or run
  `npm run dev -- -p 3001` and open that port instead.

## Privacy & scope

Everything — your solve history, streaks, and reviews — is stored locally in
your browser's IndexedDB. Nothing is sent anywhere except your own machine's
Ollama instance and Docker daemon. There is no backend database and no
account system.
