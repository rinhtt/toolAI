import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

// Kiểm tra xem Key đã nạp chưa (Rinh nhìn log ở Terminal nhé)
console.log("Check Key:", process.env.GEMINI_API_KEY ? "✅ Đã nạp" : "❌ Chưa thấy Key");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // LUÔN DÙNG 1.5-FLASH

app.post('/api/recontent', async (req, res) => {
  try {
    const { content, targetPlatform } = req.body;
    const prompt = `Viết kịch bản TikTok triệu view từ nội dung này: ${content}`;
    
    const result = await model.generateContent(prompt);
    res.json({ result: result.response.text() });
  } catch (error) {
    console.error("Lỗi Gemini:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5001, () => console.log('🚀 Server đã sẵn sàng tại port 5001'));