const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/claude", async (req, res) => {
    const token = req.headers["x-app-token"];
    if (token !== process.env.APP_TOKEN) {
          return res.status(401).json({ error: "Unauthorized" });
    }
    try {
          const response = await fetch("https://api.anthropic.com/v1/messages", {
                  method: "POST",
                  headers: {
                            "Content-Type": "application/json",
                            "x-api-key": process.env.ANTHROPIC_API_KEY,
                            "anthropic-version": "2023-06-01"
                  },
                  body: JSON.stringify(req.body)
          });
          const data = await response.json();
          res.json(data);
    } catch (err) {
          res.status(500).json({ error: err.message });
    }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
