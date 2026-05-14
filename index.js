const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getSpecialtyFromSymptom } = require('./src/services/geminiService');
const { insurancePlans, hospitalNetwork } = require('./src/data/insuranceData');

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

    // 2. Get insurance plan (default to plan_plata if not provided or not found)
    const plan = insurancePlans.find(p => p.id === planId) || insurancePlans[1];

    // 3. Calculate costs for each hospital in the network
    const recommendations = hospitalNetwork.map(hospital => {
      const baseCost = hospital.baseCosts[specialty] || 50;
      const coverage = plan.coverage[specialty] || { coPay: 20, discount: 0.8 };
      
      const estimatedTotal = baseCost * coverage.discount + coverage.coPay;

      return {
        hospitalName: hospital.name,
        location: hospital.location,
        specialty,
        estimatedTotal: estimatedTotal.toFixed(2),
        coPay: coverage.coPay
      };
    });

    // 4. Sort by most economical
    recommendations.sort((a, b) => parseFloat(a.estimatedTotal) - parseFloat(b.estimatedTotal));

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

app.get('/', (req, res) => {
  res.send('Backend Bot de Copago - Agente Médico Activo');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});