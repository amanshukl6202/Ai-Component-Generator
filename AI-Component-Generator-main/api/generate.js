import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, framework } = req.body || {};
  if (!prompt?.trim()) {
    return res.status(400).json({ error: "Please describe your component." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a modern, responsive UI component for: ${prompt}
Framework: ${framework}
Return only the complete code in a Markdown code block.`,
    });
    return res.status(200).json({ text: response.text || "" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Gemini request failed." });
  }
}