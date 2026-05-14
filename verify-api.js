const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

async function verificarApi() {
  try {
    // Usamos el modelo que recomendaste: gemini-2.5-flash
    // Nota: Si este modelo da error 404, prueba con "gemini-2.0-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const pregunta = "Hola, confirma que estás funcionando. ¿Qué versión de modelo eres?";

    console.log("⏳ Conectando con Gemini 2.5 Flash...");

    const result = await model.generateContent(pregunta);
    const response = await result.response;
    
    console.log("\n✅ ¡POR FIN CONECTADO!");
    console.log("Respuesta:", response.text());

  } catch (error) {
    console.error("\n❌ ERROR:");
    console.error(error.message);
    if (error.message.includes("404")) {
      console.log("\n💡 TIP: Si el error es 404, intenta cambiar el modelo a 'gemini-2.0-flash' en src/services/geminiService.js");
    }
  }
}

verificarApi();
