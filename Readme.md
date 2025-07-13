# VaultX 🔐

VaultX is a next-generation, AI-powered multisig wallet for EVM-compatible blockchains. It brings enhanced security, collaborative transaction management, and rich analytics to multisig workflows.

## ✨ Features

- ✅ Secure multisig wallet for EVM chains
- 🧠 AI-powered transaction summarization & auditing
- 🧾 Activity logs with hash linking & chain traceability
- 📊 Analytics dashboard (Top TXs, gas usage, vault stats)
- 👥 Role-based access (Owners, Delegates, Viewers)
- 🔁 Transaction relaying & facial verification
- 📦 Local transaction caching & vault labeling
- 📣 Notify signers with one-click alerts
- 🌐 Supports Ethereum, Polygon, Arbitrum, Base & more

## 🔧 Tech Stack

- Frontend: React + Wagmi + Viem
- Backend: Express + Ethers.js + OpenAI API
- Smart Contracts: Custom Multisig Wallet (EVM compatible)
- Storage: JSON-based persistent logs

## 📦 Installation

```bash
git clone https://github.com/your-org/vaultx.git
cd vaultx
yarn install
yarn dev
Set your .env variables:

env
Copy
Edit
OPENAI_API_KEY=sk-...
RPC_URL=https://your_rpc
RELAYER_KEY=0xabc...
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
🧠 AI Features
/api/summarize → summarizes any TX

/api/audit → AI audits the TX for safety

/api/suggest-role → role suggestion from behavior

⚙️ Roles
Role	Can Sign	Can Execute	Can Revoke	Can View
Owner	✅	✅	✅	✅
Delegate	✅	❌	❌	✅
Viewer	❌	❌	❌	✅

🛡️ Security & UX
Biometric verification for sensitive TXs

Guard clauses for invalid TX execution

Notifications for pending TXs

Confirmation alerts on wallet deploy

📜 License
MIT License © 2025 VaultX Ahsan Moizz
