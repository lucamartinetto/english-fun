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

app.get("/.well-known/assetlinks.json", (req, res) => {
      res.json([{
              "relation": ["delegate_permission/common.handle_all_urls"],
              "target": {
                        "namespace": "android_app",
                        "package_name": "app.railway.up.english_fun_production.twa",
                        "sha256_cert_fingerprints": ["74:2D:76:15:F3:4D:5A:E1:CA:8E:EB:59:6E:8A:77:B5:94:F5:70:E5:17:8E:1E:BE:E2:EA:79:F8:9A:1E:F4:3E"]
              }
      }]);
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
