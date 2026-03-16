import React, { useState } from "react";
import axios from "axios";

function App() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState("Facebook Post");

  const handleConvert = async () => {
    if (!content) return alert("Hãy nhập nội dung gốc vào đã nhé!");
    
    setLoading(true);
    setResult(""); // Xóa kết quả cũ để tạo hiệu ứng mới
    
    try {
      // Gọi đến API Node.js của bạn (Cổng 5001)
      const response = await axios.post("http://localhost:5001/api/recontent", {
        content,
        targetPlatform: platform,
      });
      
      setResult(response.data.result);
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      const errorMsg = error.response?.data?.error || "Không thể kết nối với Server AI.";
      alert("Lỗi rồi: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Hàm copy kết quả nhanh
  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert("Đã sao chép vào bộ nhớ tạm!");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ReContent AI 🚀
          </h1>
          <p className="text-gray-400 mt-2">Dùng Gemini 2.5 Flash để nhân bản nội dung đa kênh.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BÊN TRÁI: INPUT */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <label className="block text-sm font-medium text-gray-400 mb-2">Nội dung gốc</label>
              <textarea
                className="w-full h-80 bg-gray-950 border border-gray-800 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Dán bài báo, transcript Youtube hoặc ý tưởng của bạn vào đây..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">Chọn định dạng muốn chuyển đổi:</label>
                <div className="flex flex-wrap gap-2">
                  {["Facebook Post", "TikTok Script", "Twitter Thread", "Email Summary"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        platform === p 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConvert}
                disabled={loading}
                className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  loading 
                  ? "bg-gray-700 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-xl active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý nội dung...
                  </span>
                ) : `Chuyển sang ${platform}`}
              </button>
            </div>
          </div>

          {/* BÊN PHẢI: OUTPUT */}
          <div className="flex flex-col">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-400">Kết quả AI</h2>
                {result && (
                  <button 
                    onClick={copyToClipboard}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md transition"
                  >
                    Sao chép
                  </button>
                )}
              </div>
              
              <div className="flex-1 bg-gray-950 border border-gray-800 rounded-xl p-5 overflow-y-auto">
                {result ? (
                  <div className="whitespace-pre-wrap text-gray-300 leading-relaxed animate-in fade-in duration-700">
                    {result}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 text-center">
                    <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <p>Nội dung sau khi chuyển đổi sẽ xuất hiện tại đây.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;