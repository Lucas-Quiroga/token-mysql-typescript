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

    const result = await hf.textGeneration({
      model,
      inputs: question,
      options: {
        language: "es",
      },
    });

    // Elimina la pregunta de la respuesta
    const answer = result.generated_text.replace(question, "").trim();

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
