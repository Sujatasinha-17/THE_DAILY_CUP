const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const menuPath = path.join(__dirname, "..", "data", "menu.json");

function readMenu() {
  const raw = fs.readFileSync(menuPath, "utf-8");
  return JSON.parse(raw);
}

// GET /api/menu -> full menu, grouped by category
router.get("/", (req, res) => {
  try {
    const menu = readMenu();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: "Could not load menu." });
  }
});

// GET /api/menu/:category -> items for one category (coffee | cold | bakes)
router.get("/:category", (req, res) => {
  try {
    const menu = readMenu();
    const category = menu[req.params.category];
    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Could not load menu." });
  }
});

module.exports = router;
