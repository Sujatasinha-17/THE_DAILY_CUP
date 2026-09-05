const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const messagesPath = path.join(__dirname, "..", "data", "messages.json");

function readMessages() {
  if (!fs.existsSync(messagesPath)) return [];
  const raw = fs.readFileSync(messagesPath, "utf-8");
  return raw ? JSON.parse(raw) : [];
}

function writeMessages(messages) {
  fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2), "utf-8");
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact -> save a contact / order-ahead message
router.post("/", (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are all required." });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: "Message is too long." });
  }

  try {
    const messages = readMessages();
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      receivedAt: new Date().toISOString(),
    };
    messages.push(entry);
    writeMessages(messages);

    res.status(201).json({ success: true, message: "Message received." });
  } catch (err) {
    res.status(500).json({ error: "Could not save your message. Please try again." });
  }
});

// GET /api/contact -> list saved messages (simple admin view)
router.get("/", (req, res) => {
  try {
    res.json(readMessages());
  } catch (err) {
    res.status(500).json({ error: "Could not load messages." });
  }
});

module.exports = router;
