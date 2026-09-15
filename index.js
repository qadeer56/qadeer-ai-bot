const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");
const fs = require("fs");

// ================================
// QADEER AI BOT
// ================================

// Railway Volume ka persistent path
const SESSION_PATH = "/data/qadeer-session";

// Agar /data available nahi hai to local path use hoga
const AUTH_PATH = fs.existsSync("/data")
  ? SESSION_PATH
  : "./.wwebjs_auth";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🤖 Qadeer AI Bot is running!");
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

// ================================
// WHATSAPP CLIENT
// ================================

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "qadeer-ai-bot",
    dataPath: AUTH_PATH
  }),

  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ]
  }
});

// ================================
// QR CODE
// ================================

client.on("qr", (qr) => {
  console.log("================================");
  console.log("📱 SCAN THIS QR CODE");
  console.log("================================");

  qrcode.generate(qr, { small: true });
});

// ================================
// AUTHENTICATED
// ================================

client.on("authenticated", () => {
  console.log("🔐 WhatsApp authentication successful.");
});

// ================================
// READY
// ================================

client.on("ready", () => {
  console.log("================================");
  console.log("🤖 QADEER AI BOT READY");
  console.log("================================");
  console.log("✅ WhatsApp successfully connected.");
});

// ================================
// AUTH FAILURE
// ================================

client.on("auth_failure", (msg) => {
  console.log("❌ Authentication failure:", msg);
});

// ================================
// DISCONNECTED
// ================================

client.on("disconnected", (reason) => {
  console.log("⚠️ WhatsApp disconnected:", reason);
});

// ================================
// MESSAGE HANDLER
// ================================

client.on("message", async (message) => {
  try {
    const text = message.body.trim();
    const lower = text.toLowerCase();

    console.log(
      `📩 Message: ${text}`
    );

    // ============================
    // BASIC COMMANDS
    // ============================

    if (lower === ".ping") {
      await message.reply("🏓 Pong!");
      return;
    }

    if (lower === ".hello") {
      await message.reply("👋 Hello bhai! Main Qadeer AI Bot hoon.");
      return;
    }

    if (lower === ".salam") {
      await message.reply("وعلیکم السلام ❤️");
      return;
    }

    if (lower === ".owner") {
      await message.reply(
        "👑 Owner: Qadeer\n🤖 Bot: Qadeer AI Bot"
      );
      return;
    }

    if (lower === ".menu") {
      await message.reply(
`🤖 *QADEER AI BOT*

━━━━━━━━━━━━━━

📌 BASIC
.ping
.hello
.salam
.owner
.menu

🧠 AI
.ai <message>

💬 CHAT
.autochat on
.autochat off

━━━━━━━━━━━━━━
🔥 More features coming...`
      );
      return;
    }

    // ============================
    // AI COMMAND PLACEHOLDER
    // ============================

    if (lower.startsWith(".ai ")) {
      const question = text.slice(4).trim();

      if (!question) {
        await message.reply("❌ Example:\n.ai What is Python?");
        return;
      }

      await message.reply(
        `🧠 AI system abhi connect nahi hua.\n\nTumhara question:\n${question}`
      );

      return;
    }

  } catch (error) {
    console.error("❌ Message handler error:", error);
  }
});

// ================================
// START BOT
// ================================

console.log("🚀 Starting Qadeer AI Bot...");

client.initialize();
