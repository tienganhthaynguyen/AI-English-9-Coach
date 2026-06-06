import React, { useState } from "react";
import { Filter, Layers, HelpCircle, Plus, BookOpen, Sparkles } from "lucide-react";
import { Question } from "../types";

interface QuestionBankProps {
  questions: Question[];
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({ questions, showToast }) => {
  const [filterSkill, setFilterSkill] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  const filteredQuestions = questions.filter(q => {
    const matchSkill = filterSkill === "all" || q.skill === filterSkill;
    const matchDiff = filterDifficulty === "all" || q.difficulty === filterDifficulty;
    return matchSkill && matchDiff;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Overview category filters header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span>Ngân hàng câu hỏi bồi dưỡng G9</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Danh sách tất cả các câu hỏi được phân tách thành các mức độ: Trắc nghiệm phát âm, cấu trúc, viết câu tự luận.
          </p>
        </div>

        <button 
          type="button"
          onClick={() => showToast("Tính năng thêm thẻ chuyên đề thủ công đang được tối ưu hóa ở bản phát triển tiếp theo!", "info")}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition whitespace-nowrap self-start inline-flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm Thủ Công</span>
        </button>
      </div>

      {/* Filter panel options */}
      <div className="bg-white p-4 rounded-2xl border border-slate-250/80 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Bộ lọc:</span>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-600">Phân loại:</label>
          <select 
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-semibold bg-white cursor-pointer"
          >
            <option value="all">Tất cả bài tập</option>
            <option value="pronunciation">Phát âm (Pronunciation)</option>
            <option value="grammar">Ngữ pháp (Grammar)</option>
            <option value="vocabulary">Từ vựng (Vocabulary)</option>
            <option value="writing">Viết lại câu (Writing)</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-600">Mức thử thách:</label>
          <select 
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-semibold bg-white cursor-pointer"
          >
            <option value="all">Mọi mức độ</option>
            <option value="easy">Cơ bản (Easy)</option>
            <option value="medium">Độ đạt khá (Medium)</option>
            <option value="hard">Khó nâng cao (Hard)</option>
          </select>
        </div>

        <div className="ml-auto text-xs text-slate-400 font-bold">
          Hiển thị: <span className="text-indigo-600">{filteredQuestions.length}</span> / {questions.length} câu hỏi
        </div>
      </div>

      {/* Database checklist rendering */}
      <div className="bg-white rounded-3xl border border-slate-250/80 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-200">
          {filteredQuestions.map((q) => (
            <div key={q.question_id} className="p-6 hover:bg-slate-50/50 transition duration-150 space-y-4">
              
              {/* Category tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[9px] font-black uppercase">
                  {q.question_id}
                </span>
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[9px] font-black uppercase">
                  {q.skill}
                </span>
                <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded text-[9px] font-black uppercase">
                  {q.question_type}
                </span>
                <span className={`px-2.5 py-0.5 rounded border text-[9px] font-black uppercase ${
                  q.difficulty === "easy" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                  q.difficulty === "medium" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                  "bg-red-50 text-red-700 border-red-100 animate-pulse"
                }`}>
                  {q.difficulty}
                </span>

                <span className="ml-auto text-xs text-slate-400 font-extrabold tracking-wide">
                  +{q.score} điểm thi
                </span>
              </div>

              {/* Text context prompt */}
              <p className="font-extrabold text-slate-900 text-base leading-relaxed whitespace-pre-line font-sans">
                {q.question_text}
              </p>

              {/* Choices rendering options */}
              {q.options && (
                <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
                  {Object.entries(q.options).map(([letter, text]) => (
                    <div 
                      key={letter} 
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center space-x-2.5 ${
                        q.correct_answer === letter 
                          ? "bg-emerald-50 border-emerald-250 text-emerald-950 font-bold" 
                          : "bg-slate-50 border-slate-150 text-slate-600"
                      }`}
                    >
                      <span className="font-extrabold text-xs uppercase text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded">
                        {letter}
                      </span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Text answer if writing types */}
              {!q.options && (
                <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 font-bold font-mono">
                  🔑 Đáp án mẫu: "{q.correct_answer}"
                </div>
              )}

              {/* Explanatory notes */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-xs text-slate-500 leading-relaxed font-semibold font-sans">
                <p className="font-extrabold text-slate-700 uppercase mb-1 leading-none tracking-wider inline-flex items-center space-x-1.5">
                  <Sparkles className="h-3 w-3 text-indigo-500 animate-bounce" />
                  <span>Giải nghĩa chi tiết khoa học (Tiếng Việt):</span>
                </p>
                <p className="mt-1 font-medium">{q.explanation_vi}</p>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
