import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.post("/api/explain", async (req, res) => {
  const { code } = req.body;
  console.log("Received code:", code);

  if (!code) return res.status(400).json({ error: "Code snippet is required" });

  try {
    // Use the latest model name (as of April 2025)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `You are an expert programming tutor. Please explain the following code :\n\n${code}\n\nProvide a comprehensive explanation covering what the code does, how it works, key concept.output should be small and concise.Give out in  markdown format.`;
    const result = await model.generateContent(prompt);
    const explanation = await result.response.text();
    res.json({ explanation });
    console.log("Generated explanation:", explanation);
  } catch (error) {
    console.error("Error generating explanation:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
