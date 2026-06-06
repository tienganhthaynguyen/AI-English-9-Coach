import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Initialize Gemini safely and lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.post("/api/grade-with-ai", async (req, res) => {
    try {
      const { studentName, score, studentWrittenAnswers } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        console.log("No GEMINI_API_KEY found or is placeholder. Returning high-quality simulated Vietnamese feedback.");
        return res.json({
          success: true,
          offline: true,
          data: {
            overall_comment: `Chúc mừng học sinh ${studentName || "Minh Anh"} đã hoàn thành bài viết! Con có nền ngữ pháp tổng thể tương đối tốt, tuy nhiên với các câu hỏi viết lại tự luận, con còn dễ nhầm lẫn sang các cấu trúc cơ bản khác hoặc quên chưa lùi thì phù hợp.`,
            score_analysis: `Điểm số trắc nghiệm và câu ngắn đạt mức khá giỏi (${score || "8.5"}/10). Lỗi nghiêm trọng tập trung ở phần tự luận chuyển đổi câu tường thuật / bị động phức tạp.`,
            strengths: [
              "Luyện ngữ âm rất chuẩn, phân biệt được đuôi phát âm '-ed' và trọng âm từ cơ bản.",
              "Nắm vững các câu hỏi điền từ và giới từ đi kèm thông dụng."
            ],
            weaknesses: [
              "Hay bị quên lùi thời của động từ và biến đổi trạng ngữ chỉ mốc thời gian khi chuyển sang câu gián tiếp.",
              "Lúng túng khi viết thể bị động ở cấu trúc quá khứ đơn (quên chia to be phù hợp)."
            ],
            major_grammar_errors: [
              {
                error_type: "REPORTED",
                error_name_vi: "Lỗi câu gián tiếp (Reported Speech)",
                frequency: 1,
                explanation_vi: "Khi chuyển từ câu trực tiếp 'I am going to visit Hanoi tomorrow' sang gián tiếp Nam said, theo quy tắc ngữ pháp lớp 9 chúng ta bắt buộc phải: Đổi ngôi chủ ngữ (I -> he), lùi thì của động từ (am -> was) và đổi mốc thời gian tương lai (tomorrow -> the following day/the next day). Việc giữ nguyên 'is' hoặc 'tomorrow' là chưa chuẩn xác.",
                wrong_example: "Nam said he is going to visit Hanoi tomorrow.",
                correct_example: "Nam said he was going to visit Hanoi the following day.",
                advice: "Hãy học thuộc lòng bảng quy tắc 'Lùi thì' (Hiện tại tiếp diễn -> Quá khứ tiếp diễn) và bảng đổi 'Trạng ngữ chỉ thời gian' trong đề ôn thi vào 10."
              },
              {
                error_type: "PASSIVE",
                error_name_vi: "Lỗi thiếu động từ 'be' ở câu bị động",
                frequency: 1,
                explanation_vi: "Cấu trúc bị động chung là S + be + V-ed/V3. Khi viết lại câu quá khứ 'They built this school in 2010', chủ ngữ mới là 'This school' số ít, ta phải đưa động từ to be quá khứ 'was' đi kèm 'built'. Sẽ là lỗi sai nếu chỉ viết là 'This school built'.",
                wrong_example: "This school built in 2010.",
                correct_example: "This school was built in 2010.",
                advice: "Khi thấy chủ từ là vật nhận tác động của hành động, luôn luôn kiểm tra công thức bị động phải có cả động từ 'be' chia đúng thì và động từ chính phân từ hai (V3)."
              }
            ],
            seven_day_plan: [
              { day: 1, focus: "Lý thuyết & Bảng quy tắc câu gián tiếp", task: "Học thuộc 5 mốc thời gian ranh giới cần đổi và 6 nhóm lùi thì. Làm 10 câu đổi mốc thời gian." },
              { day: 2, focus: "Tập viết câu kể gián tiếp", task: "Sử dụng động từ dẫn 'said that', 'told someone that' để viết lại 15 câu nói thường ngày." },
              { day: 3, focus: "Câu hỏi gián tiếp có 'if/whether'", task: "Nêu câu hỏi nghi vấn thành câu gián tiếp. Áp dụng chuyển 10 câu hỏi Yes/No." },
              { day: 4, focus: "Câu mệnh lệnh & Động từ đặc biệt", task: "Áp dụng cấu trúc 'asked/told someone (not) to do something'. Sửa bài tập ví dụ." },
              { day: 5, focus: "Thực hành cấu trúc Bị động quá khứ đơn", task: "Lấy 15 câu chủ động quá khứ đơn biến đổi ngược thành bị động có to be 'was/were'." },
              { day: 6, focus: "Lập trình giải đề tổng hợp ngắn", task: "Thực hiện giải test 20 câu tổng hợp chuyên đề Reported Speech và Passive Voice." },
              { day: 7, focus: "Đánh giá tiến trình cùng AI Coach", task: "Xem lại toàn bộ đáp án đúng, tự viết lại các câu sai mà không xem tài liệu bổ trợ." }
            ],
            teacher_note: "Học sinh có thiên hướng tư duy logic tốt nhưng làm bài tự luận đôi khi còn vội vàng dẫn tới bỏ sót các chi tiết biến đổi thời gian. Khuyên thầy cô cho học sinh luyện viết tay thêm nhiều câu gián tiếp.",
            parent_note: "Con học chuyên cần. Phụ huynh có thể giúp con dò nhanh bảng lùi thì câu gián tiếp khoảng 5 phút mỗi tối."
          }
        });
      }

      const payloadText = `Chấm điểm và phân tích năng lực chi tiết cho học sinh lớp 9 ôn thi vào 10 ở Việt Nam:
Tên học sinh: ${studentName || "Học sinh"}
Tổng điểm trắc nghiệm tự chấm: ${score}/10

Bộ bài viết tự luận của học sinh cần bạn chấm điểm và phân tích chuyên sâu:
${JSON.stringify(studentWrittenAnswers, null, 2)}

Hãy phân tích lỗi sai và đưa ra nhận xét bằng tiếng Việt dễ hiểu nhất cho học sinh lớp 9 Việt Nam.
Bạn phải phản hồi CHỈ bằng định dạng JSON thuần túy (không được bọc trong markdown và không có ký tự dư thừa). Schema của JSON phải như sau:
{
  "overall_comment": "Nhận xét tổng quan thân thiện, chỉ rõ tiến bộ và mảng yếu lớn nhất bằng tiếng Việt.",
  "score_analysis": "Phân tích điểm số chi tiết.",
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "weaknesses": ["Điểm yếu 1", "Điểm yếu 2"],
  "major_grammar_errors": [
    {
      "error_type": "Mã lỗi tương tự PASSIVE, TENSE, SVA, WORD_FORM, REPORTED, PREPOSITION...",
      "error_name_vi": "Tên tiếng Việt thân thiện của lỗi",
      "frequency": 1,
      "explanation_vi": "Giải thích chi tiết vì sao học sinh viết sai như vậy, phân tích ngữ pháp tiếng Việt dễ hiểu cho học sinh lớp 9.",
      "wrong_example": "Câu sai của học sinh",
      "correct_example": "Câu sửa đúng của học sinh",
      "advice": "Lời khuyên khắc phục để ôn thi tốt vào 10"
    }
  ],
  "seven_day_plan": [
    { "day": 1, "focus": "Chủ đề ôn tập", "task": "Nhiệm vụ hành động cụ thể" }
  ],
  "teacher_note": "Gửi riêng thầy cô giáo lưu ý về học sinh này.",
  "parent_note": "Gợi ý cho phụ huynh đồng hành cùng con."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: payloadText,
        config: {
          responseMimeType: "application/json",
        },
      });

      const resultText = response.text || "{}";
      let parsedResult;
      try {
        parsedResult = JSON.parse(resultText);
      } catch {
        const cleanJson = resultText.replace(/```json|```/g, "").trim();
        parsedResult = JSON.parse(cleanJson);
      }

      res.json({ success: true, offline: false, data: parsedResult });
    } catch (error: any) {
      console.error("Gemini Grading Server Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/generate-exam", async (req, res) => {
    try {
      const { prompt: customPrompt, duration, difficulty, grammarPoints } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        console.log("No GEMINI_API_KEY found or placeholder. Returning static enhanced questions.");
        return res.json({
          success: true,
          offline: true,
          questions: [
            {
              question_id: 'Q_AI_001',
              skill: 'grammar',
              question_type: 'multiple_choice',
              question_text: 'If she _______ harder, she would pass the high school entrance exam easily.',
              options: { A: 'studies', B: 'studied', C: 'will study', D: 'study' },
              correct_answer: 'B',
              explanation_vi: "Câu điều kiện loại 2 (Conditional sentence Type 2) diễn tả sự việc trái với thực tế ở hiện tại: If + S + V2/ed, S + would + V-inf. Ở vế sau có 'would pass', do đó vế if chia ở thì Quá khứ đơn: studied.",
              difficulty: difficulty || 'medium',
              grammar_point: 'Conditional sentences',
              error_type: 'CONDITIONAL',
              score: 0.25
            },
            {
              question_id: 'Q_AI_002',
              skill: 'vocabulary',
              question_type: 'multiple_choice',
              question_text: 'We are very excited _______ the upcoming field trip to Cuc Phuong National Park.',
              options: { A: 'of', B: 'with', C: 'about', D: 'at' },
              correct_answer: 'C',
              explanation_vi: "Cấu trúc giới từ đi kèm tính từ quen thuộc: 'be excited about something' (hào hứng, phấn khích về điều gì).",
              difficulty: difficulty || 'medium',
              grammar_point: 'Prepositions',
              error_type: 'PREPOSITION',
              score: 0.25
            },
            {
              question_id: 'Q_AI_003',
              skill: 'grammar',
              question_type: 'word_form',
              question_text: 'The solar panels will provide _______ electricity for our household next year. (CHEAP)',
              correct_answer: 'cheap',
              explanation_vi: "Chỗ trống đứng trước danh từ 'electricity' và bổ nghĩa cho danh từ đó nên ta cần điền một tính từ (adjective). Dạng tính từ nguyên bản của 'cheap' vẫn là 'cheap' (rẻ).",
              difficulty: 'easy',
              grammar_point: 'Word forms',
              error_type: 'WORD_FORM',
              score: 0.25
            },
            {
              question_id: 'Q_AI_004',
              skill: 'writing',
              question_type: 'rewrite_sentence',
              question_text: "I don't have a laptop to study online.\n-> I wish ___________________________________.",
              correct_answer: 'I wish I had a laptop to study online.',
              acceptable_answers: ['I wish that I had a laptop to study online'],
              explanation_vi: "Cấu trúc câu ước trái với hiện tại (Wish for present): S + wish(es) + S + v2/ed. Thực tế là 'I don't have ...' nên câu ước chuyển sang khẳng định quá khứ: 'I had ...'.",
              difficulty: difficulty || 'medium',
              grammar_point: 'Wish sentences',
              error_type: 'WISH',
              score: 0.5
            }
          ]
        });
      }

      const systemInstruction = "You are a professional EdTech Grade 9 English exam developer for Vietnamese secondary schools preparing for high school entrance examination. You write clear, correct question structures matching Vietnamese exam styles.";
      const pText = `Hãy tạo một danh sách các câu hỏi tiếng Anh ôn thi vào 10 bám sát các yêu cầu sau:
Yêu cầu riêng từ giáo viên: ${customPrompt || "Tạo đề ôn thi chất lượng"}
Thời gian dự kiến: ${duration || 60} phút
Mức độ khó của đề: ${difficulty || "medium"}
Chuyên đề trọng tâm: ${grammarPoints ? grammarPoints.join(", ") : "Ngẫu nhiên"}

Phản hồi CHỈ bằng định dạng JSON đại diện cho mảng các câu hỏi, không bọc ngoài bất kỳ từ ngữ nào, không có markdown markdown code blocks. Mảng JSON phải chứa các đối tượng có thuộc tính như mẫu sau:
[
  {
    "question_id": "Mã ngẫu nhiên duy nhất bắt đầu dạng Q_AI_...",
    "skill": "pronunciation | grammar | vocabulary | writing",
    "question_type": "multiple_choice | word_form | rewrite_sentence",
    "question_text": "Nội dung câu hỏi rõ ràng. Đối với word_form, ghi rõ từ gốc ở cuối câu trong ngoặc (Ví dụ: (BEAUTY)). Đối với rewrite_sentence, ghi câu mẫu bắt đầu bằng mũi tên.",
    "options": {
      "A": "Lựa chọn A (chỉ trả về thuộc tính này nếu question_type là multiple_choice)",
      "B": "Lựa chọn B",
      "C": "Lựa chọn C",
      "D": "Lựa chọn D"
    },
    "correct_answer": "Đáp án đúng (Nếu trắc nghiệm là ký tự đáp án A/B/C/D. Nếu điền từ hay viết câu là chuỗi đáp án chuẩn viết thường hoặc viết mẫu)",
    "explanation_vi": "Giải thích chi tiết bằng tiếng Việt thân thiện, cách suy luận cho học sinh lớp 9 Việt Nam.",
    "difficulty": "easy | medium | hard",
    "grammar_point": "Tên chủ điểm ngữ pháp",
    "error_type": "Mã lỗi quy về: TENSE | SVA | PASSIVE | WORD_FORM | PREPOSITION | REPORTED | CONDITIONAL | WISH",
    "score": 0.25
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: pText,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const resultText = response.text || "[]";
      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(resultText);
      } catch {
        const cleanJson = resultText.replace(/```json|```/g, "").trim();
        parsedQuestions = JSON.parse(cleanJson);
      }

      res.json({ success: true, offline: false, questions: parsedQuestions });
    } catch (error: any) {
      console.error("Gemini Exam Generation Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware / production static server check
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
