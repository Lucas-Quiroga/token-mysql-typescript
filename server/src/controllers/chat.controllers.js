import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.AI_API_KEY);

const model = "mistralai/Mistral-7B-Instruct-v0.2";

export async function getQuestion(req, res) {
  try {
    const question = req.query.question;

    // Verifica que la pregunta existe y es una cadena
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Invalid question" });
    }

    // Construye el texto de la pregunta con el formato de instrucción requerido
    const prompt = `[INST]${question}[/INST]"`;

    // Realiza la generación de texto con el modelo
    const result = await hf.textGeneration({
      model,
      inputs: prompt,
    });

    // Elimina la pregunta de la respuesta
    let answer = result.generated_text.replace(question, "").trim();
    // y elimina [INST][/INST]
    answer = answer.replace("[INST]", "").replace("[/INST]", "").trim();

    res.json({ answer });
  } catch (error) {
    console.error(error);

    // Proporciona un manejo de errores más detallado
    if (error instanceof HfInference.ApiError) {
      res.status(500).json({ error: "Error with Hugging Face API" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
