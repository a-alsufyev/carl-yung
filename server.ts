import express from "express";
import path from "path";
import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file when running in self-hosted or Docker containers
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized OpenAI client
let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!openaiClient) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error("OPENAI_API_KEY is not defined in environment variables. Please configure it in Settings > Secrets.");
    }
    openaiClient = new OpenAI({
      apiKey: key,
    });
  }
  return openaiClient;
}

// API endpoint to analyze audit responses
app.post("/api/analyze", async (req, res) => {
  try {
    const { answers, gender } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length < 7) {
      return res.status(400).json({ error: "Не все ответы предоставлены. Необходимо ответить на все 7 вопросов." });
    }

    const isFemale = gender === "female";
    const promptFilename = isFemale ? "jungian_prompt_female.txt" : "jungian_prompt.txt";

    // Read the unmodified prompt as system instruction (with fallback search for production stages)
    let promptPath = path.join(process.cwd(), "src", promptFilename);
    if (!fs.existsSync(promptPath)) {
      promptPath = path.join(__dirname, "src", promptFilename);
    }
    if (!fs.existsSync(promptPath)) {
      promptPath = path.join(__dirname, promptFilename);
    }

    if (!fs.existsSync(promptPath)) {
      return res.status(500).json({ error: "Системный файл подсказки не найден на сервере (заданный путь: " + promptPath + ")" });
    }
    const systemPrompt = fs.readFileSync(promptPath, "utf-8");

    // Format the prompt containing answers
    let userSubmissionContent = isFemale 
      ? "Пользовательница заполнила аудит женской личности и архетипов союза. Вот её ответы:\n\n"
      : "Пользователь заполнил аудит мужской силы. Вот его ответы:\n\n";

    answers.forEach((ans: any, index: number) => {
      userSubmissionContent += `**Вопрос ${index + 1}:** ${ans.questionText || ""}\n`;
      userSubmissionContent += `**Ответ:** ${ans.selectedOptionText || ""}\n`;
      if (ans.customDetails && ans.customDetails.trim()) {
        userSubmissionContent += `**Пояснение пользователя:** ${ans.customDetails}\n`;
      }
      userSubmissionContent += "\n";
    });

    userSubmissionContent += "Пожалуйста, предоставь финальный глубокий разбор строго по указанной форме в системной инструкции.";

    // Call OpenAI API with system instructions
    const openai = getOpenAI();
    const result = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userSubmissionContent,
        },
      ],
      temperature: 0.85,
    });

    const rawResponse = result.choices[0]?.message?.content || "";
    return res.json({ rawResponse });
  } catch (err: any) {
    console.error("Analysis Error:", err);
    return res.status(500).json({ 
      error: err.message || "Произошла ошибка при генерации психологического разбора. Пожалуйста, убедитесь, что API ключ OpenAI на месте." 
    });
  }
});

// Configure Vite or production static file serving
async function configureApp() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

configureApp().catch((err) => {
  console.error("Failure while building/starting the Express server", err);
  process.exit(1);
});
