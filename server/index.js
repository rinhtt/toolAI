require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyBWDxjAzbg-ee8GBcVf-HFjnpu2J3ACI0Q");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/recontent', async (req, res) => {
  try {
    let { content, targetPlatform } = req.body;

    if (content.includes('youtube.com') || content.includes('youtu.be')) {
      console.log('--- Đang bóc tách Transcript YouTube ---');
      
      try {
        // CÁCH FIX TRIỆT ĐỂ: Import động bên trong hàm async
        // Chúng ta lấy thuộc tính .YoutubeTranscript từ module đã import
        const youtubeModule = await import('youtube-transcript');
        const YoutubeTranscript = youtubeModule.YoutubeTranscript;
        
        const transcriptArr = await YoutubeTranscript.fetchTranscript(content);
        
        content = transcriptArr.map(t => t.text).join(' ');
        
        console.log('--- Lấy Transcript thành công! ---');
        console.log('Độ dài văn bản:', content.length);
      } catch (ytError) {
        console.error("Lỗi YouTube:", ytError.message);
        return res.status(400).json({ error: "YouTube chặn hoặc video không có phụ đề." });
      }
    }

    const prompt = `Bạn là một chuyên gia content. Hãy chuyển đổi nội dung sau đây thành một bài đăng cho ${targetPlatform}, lôi cuốn và có emoji: ${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ result: response.text() });

  } catch (error) {
    console.error("Lỗi hệ thống:", error);
    res.status(500).json({ error: "Lỗi xử lý AI, Rinh thử lại nhé!" });
  }
});

app.listen(5001, () => console.log('🚀 Server running on port 5001'));