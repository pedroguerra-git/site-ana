/**
 * API Stub (Node + Express) para receber agendamentos do site.
 * Instalar:
 *   npm init -y
 *   npm i express cors
 * Rodar:
 *   node api_stub_node_express.js
 * Endpoint:
 *   POST http://localhost:3000/api/booking
 */
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.post("/api/booking", (req, res) => {
  const payload = req.body || {};
  if (!payload.name || !payload.phone || !payload.program) {
    return res.status(400).json({ ok:false, error:"Campos obrigatórios ausentes." });
  }
  console.log("Booking received:", payload);
  return res.json({ ok:true, id: "booking_" + Date.now() });
});

app.listen(3000, () => console.log("API stub listening on http://localhost:3000"));
