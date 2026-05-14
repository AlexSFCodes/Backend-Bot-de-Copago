const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getSpecialtyFromSymptom } = require('./src/services/geminiService');
const db = require('./src/database/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint to process symptoms and give a recommendation
app.post('/api/chat', async (req, res) => {
  const { symptom, planId } = req.body;

  if (!symptom) {
    return res.status(400).json({ error: "Por favor ingresa un síntoma." });
  }

  try {
    // 1. Get specialty from symptom via Gemini
    const specialty = await getSpecialtyFromSymptom(symptom);

    // 2. Get insurance plan from DB (default to plan_plata if not found)
    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(planId || 'plan_plata') || 
                 db.prepare('SELECT * FROM plans WHERE id = ?').get('plan_plata');
    
    const planCoverage = db.prepare('SELECT * FROM plans_coverage WHERE plan_id = ? AND specialty = ?')
                           .get(plan.id, specialty) || { co_pay: 20, discount: 0.8 };

    // 3. Get hospitals and their costs for this specialty from DB
    const hospitalsWithCosts = db.prepare(`
      SELECT h.name, h.location, hc.cost 
      FROM hospitals h 
      LEFT JOIN hospitals_costs hc ON h.id = hc.hospital_id AND hc.specialty = ?
    `).all(specialty);

    const recommendations = hospitalsWithCosts.map(h => {
      const baseCost = h.cost || 50;
      const estimatedTotal = (baseCost * planCoverage.discount) + planCoverage.co_pay;

      return {
        hospitalName: h.name,
        location: h.location,
        specialty,
        estimatedTotal: estimatedTotal.toFixed(2),
        coPay: planCoverage.co_pay
      };
    });

    // 4. Sort by most economical
    recommendations.sort((a, b) => parseFloat(a.estimatedTotal) - parseFloat(b.estimatedTotal));

    // 5. Log the consultation in the database
    db.prepare(`
      INSERT INTO consultation_logs (symptom, specialty, plan_id, estimated_total) 
      VALUES (?, ?, ?, ?)
    `).run(symptom, specialty, plan.id, parseFloat(recommendations[0].estimatedTotal));

    res.json({
      success: true,
      data: {
        specialty,
        planName: plan.name,
        bestOption: recommendations[0],
        allOptions: recommendations
      }
    });

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Hubo un error al procesar tu solicitud." });
  }
});

// Endpoint to get all insurance plans
app.get('/api/plans', (req, res) => {
  try {
    const plans = db.prepare('SELECT * FROM plans').all();
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los planes." });
  }
});

// Endpoint to get consultation history
app.get('/api/history', (req, res) => {
  try {
    const history = db.prepare('SELECT * FROM consultation_logs ORDER BY timestamp DESC').all();
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el historial." });
  }
});

app.get('/', (req, res) => {
  res.send('Backend Bot de Copago - Agente Médico Activo');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});