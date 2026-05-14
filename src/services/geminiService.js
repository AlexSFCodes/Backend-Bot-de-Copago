const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const systemInstruction = `
Eres un asistente médico experto de triaje. Tu tarea es analizar los síntomas de un paciente y determinar qué especialidad médica debería atenderlo.
Debes elegir la especialidad más específica y adecuada de la siguiente lista:
- Cardiología: Para dolores de pecho, palpitaciones, presión alta, etc.
- Pediatría: Para cualquier síntoma en niños o bebés.
- Traumatología: Para golpes, dolores de huesos, fracturas, lesiones físicas.
- Gastroenterología: Para dolores de estómago, náuseas, problemas digestivos.
- Medicina General: Para síntomas generales como gripe, resfriado, chequeos o si no encaja en las anteriores.

Responde ÚNICAMENTE con el nombre de la especialidad. No añadidas explicaciones ni puntos.
`;

async function getSpecialtyFromSymptom(symptom) {
  try {
    const prompt = `${systemInstruction}\n\nSíntoma del paciente: "${symptom}"\nEspecialidad sugerida:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    console.log("Gemini Raw Response:", text);
    
    // Clean text in case Gemini adds extra words
    const specialties = ["Cardiología", "Pediatría", "Medicina General", "Traumatología", "Gastroenterología"];
    const found = specialties.find(s => text.toLowerCase().includes(s.toLowerCase()));
    
    return found || "Medicina General";
  } catch (error) {
    console.error("Error in geminiService:", error);
    return "Medicina General";
  }
}

module.exports = { getSpecialtyFromSymptom };
