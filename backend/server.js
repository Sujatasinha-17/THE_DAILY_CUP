require("dotenv").config();
const express = require("express");
const cors = require("cors");

const menuRoutes = require("./routes/menu");
const contactRoutes = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "The Daily Cup API" });
});

app.use("/api/menu", menuRoutes);
app.use("/api/contact", contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`☕ The Daily Cup API running at http://localhost:${PORT}`);
});
