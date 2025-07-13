// 📁 packages/backend/server.ts

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { ethers, Interface } from "ethers";
import crypto from "crypto";
import fs from "fs";
import { fetch } from "undici";
import MultisigWalletABI from "../../packages/sdk/abi/MultisigWallet.json";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

// ✅ Persistent log storage
const LOG_PATH = "./logs.json";
let logs: any[] = [];
let lastHash = "";

// ✅ Load from disk at startup
if (fs.existsSync(LOG_PATH)) {
  try {
    logs = JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
    console.log(`📂 Loaded ${logs.length} persisted logs.`);
  } catch (err) {
    console.error("❌ Failed to load logs:", err);
  }
}

// ✅ Hash helper
function hashLog(data: any) {
  const content = JSON.stringify({ ...data, prevHash: lastHash });
  lastHash = crypto.createHash("sha256").update(content).digest("hex");
  return lastHash;
}

// ✅ Webhook logger with persistence
app.post("/api/notify", async (req: Request, res: Response) => {
  const payload = req.body;
  const logHash = hashLog(payload);
  const entry = {
  ...payload,
  wallet: payload.wallet?.toLowerCase() || "unknown", // ✅ force lowercase for filtering
  time: Date.now(),
  hash: logHash,
};
  logs.push(entry);

  // Save to disk
  try {
    fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.warn("⚠️ Could not persist logs:", err);
  }

  // Notify Slack
  try {
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🔔 *${payload.type?.toUpperCase()}* | ${payload.action} by ${payload.actor} on ${payload.wallet}
${payload.txId !== undefined ? `• TX ID: ${payload.txId}` : ""}`,
        }),
      });
    }

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Failed to notify" });
  }
});

// ✅ AI Summary
app.post("/api/summarize", async (req: Request, res: Response) => {
  const { to, value, data } = req.body;

  const prompt = `
You are a blockchain expert. Summarize this Ethereum transaction:
- To: ${to}
- Value: ${value} ETH
- Data: ${data || "None"}
Explain in simple terms what this TX does.`;

  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const json = (await aiRes.json()) as any;
    res.json({ summary: json?.choices?.[0]?.message?.content ?? "No response." });
  } catch (err) {
    console.error("AI summary failed", err);
    res.status(500).json({ error: "Failed to summarize" });
  }
});

// ✅ AI Audit
app.post("/api/audit", async (req: Request, res: Response) => {
  const { to, value, data, role } = req.body;

  const prompt = `
You are an AI TX auditor. Evaluate this Ethereum TX:
- To: ${to}
- Value: ${value}
- Data: ${data}
- User Role: ${role}
Is this safe, malicious, or risky? Explain why.`;

  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const json = (await aiRes.json()) as any;
    res.json({ audit: json?.choices?.[0]?.message?.content ?? "No response." });
  } catch (err) {
    console.error("AI audit failed", err);
    res.status(500).json({ error: "Failed to audit TX" });
  }
});

// ✅ Role Suggestion
app.post("/api/suggest-role", async (req: Request, res: Response) => {
  const { user, logs } = req.body;
  const formatted = logs.map((l: any) => `• ${l.type} - TX ${l.txId ?? "-"} by ${l.user ?? "unknown"}`).join("\n");

  const prompt = `
You are a governance expert for smart contract multisigs.
User address: ${user}
These are the user's recent actions:
${formatted}
Choose from: OWNER, EXECUTOR, AUDITOR. Explain briefly why.`;

  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const json = (await aiRes.json()) as any;
    res.json({ suggestion: json?.choices?.[0]?.message?.content ?? "No suggestion." });
  } catch (err) {
    console.error("Role suggestion failed", err);
    res.status(500).json({ error: "GPT failed" });
  }
});

// ✅ Relay execution
app.post("/api/relay", async (req: Request, res: Response) => {
  const { wallet, txId } = req.body;

  if (!wallet || typeof txId !== "number" || txId < 0) {
    res.status(400).json({ error: "Missing or invalid parameters" });
    return;
  }

  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.RELAYER_KEY!, provider);
    const contract = new ethers.Contract(wallet, MultisigWalletABI, signer);

    await (contract.callStatic as any).executeTransaction(txId);

    const tx = await (contract as any).executeTransaction(txId);
    const receipt = await tx.wait();

    console.log(`✅ Relayed TX ${receipt.hash}`);
    res.json({ status: "relayed", txHash: receipt.hash });
  } catch (err: any) {
    console.error("❌ Relay error:", err.message);
    res.status(500).json({ error: "Relay failed" });
  }
});

// ✅ Submit TX
app.post("/api/submit-tx", async (req: Request, res: Response) => {
  const { walletAddress, to, value, data, vaultLabel } = req.body;

  if (!walletAddress || !to || !value || vaultLabel === undefined) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.RELAYER_KEY!, provider);
    const contract = new ethers.Contract(walletAddress, MultisigWalletABI, signer);

    const parsedValue = BigInt(value);
    const fee = (parsedValue * BigInt(10)) / BigInt(10000);

    const tx = await contract.submitTransaction(to, parsedValue, data, vaultLabel, {
      value: fee,
    });

    const receipt = await tx.wait();

    res.json({
      status: "submitted",
      txHash: receipt.transactionHash,
      vault: vaultLabel,
    });
  } catch (err) {
    console.error("❌ TX submit failed", err);
    res.status(500).json({ error: "Submission failed" });
  }
});

// ✅ Analytics with persisted logs
// ✅ Enhanced /api/analytics route with ?wallet filter
app.get("/api/analytics", (req: Request, res: Response) => {
 const userAddress = (req.query.wallet as string | undefined)?.toLowerCase();

const filteredLogs = userAddress
  ? logs.filter((l) => l.actor?.toLowerCase() === userAddress)
  : logs;

  const topTxs = filteredLogs
    .filter((l) => l.type === "transaction" && l.value)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const signerMap: Record<string, number> = {};
  filteredLogs.forEach((l) => {
    if (!l.actor) return;
    signerMap[l.actor] = (signerMap[l.actor] || 0) + 1;
  });
console.log("🔍 Analytics requested by:", userAddress);
console.log("📦 Returning logs:", filteredLogs.length);
  const topSigners = Object.entries(signerMap)
    .map(([user, count]) => ({ user, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const vaultStats: Record<string, number> = {};
  filteredLogs.forEach((l) => {
    const vault = l.vault || "General";
    vaultStats[vault] = (vaultStats[vault] || 0) + 1;
  });

  const vaultArr = Object.entries(vaultStats).map(([label, total]) => ({
    label,
    totalValue: total.toString(),
  }));

  const gasUsage = filteredLogs
    .filter((l) => l.gasUsed && l.txHash)
    .map((l) => ({
      gasUsed: l.gasUsed,
      txHash: l.txHash,
    }))
    .slice(0, 10);

  res.json({
    topTxs,
    topSigners,
    vaultStats: vaultArr,
    gasUsage,
    totalLogs: filteredLogs.length,
  });
});

// ✅ Events endpoint
app.post("/api/events", async (req: Request, res: Response) => {
  const { contractAddress } = req.body;

  if (!contractAddress) {
    res.status(400).json({ error: "Missing contractAddress" });
    return;
  }

  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const iface = new Interface(MultisigWalletABI);

    const topicsToListen = [
      ethers.id("SubmitTransaction(uint256,address)"),
      ethers.id("ConfirmTransaction(uint256,address)"),
      ethers.id("ExecuteTransaction(uint256,address)"),
      ethers.id("CancelTransaction(uint256,address)"),
      ethers.id("RevokeConfirmation(uint256,address)"),
    ];

    const latestBlock = await provider.getBlockNumber();
    const fromBlock = latestBlock > 5000 ? latestBlock - 5000 : 0;
    const logsArr: any[] = [];

    for (let start = fromBlock; start <= latestBlock; start += 500) {
      const end = Math.min(start + 499, latestBlock);

      const chunk = await provider.getLogs({
        address: contractAddress,
        fromBlock: start,
        toBlock: end,
        topics: [topicsToListen],
      });

      logsArr.push(...chunk);
      await new Promise((res) => setTimeout(res, 200));
    }

   const parsedEvents = logsArr.map((log) => {
  try {
    const parsed = iface.parseLog(log);

    if (!parsed) {
      return {
        name: "Unknown",
        txHash: log.transactionHash,
        blockNumber: Number(log.blockNumber),
        rawTopics: log.topics,
      };
    }

    return {
      name: parsed.name,
      txHash: log.transactionHash,
      blockNumber: Number(log.blockNumber),
      args: Object.fromEntries(
        Object.entries(parsed.args || {}).map(([k, v]) => [
          k,
          typeof v === "bigint" ? v.toString() : v,
        ])
      ),
    };
  } catch (e) {
    return {
      name: "Unknown",
      txHash: log.transactionHash,
      blockNumber: Number(log.blockNumber),
      rawTopics: log.topics,
    };
  }
});

    res.json({ events: parsedEvents });
  } catch (err: any) {
    console.error("❌ Event load failed:", err.message);
    res.status(500).json({ error: "Failed to load events" });
  }
});

// ✅ Raw logs endpoint
app.get("/api/logs", (_req: Request, res: Response) => {
  res.json(logs);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
