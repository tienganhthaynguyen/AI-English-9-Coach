import React from "react";
import { Sparkles, HelpCircle, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";

interface PracticeQuestion {
  id: number;
  text: string;
  correct: string;
}

interface PracticeTask {
  title: string;
  point: string;
  questions: PracticeQuestion[];
}

interface PracticeRoomProps {
  activePracticeTask: PracticeTask;
  practiceAnswers: Record<string, string>;
  setPracticeAnswers: (ans: Record<string, string>) => void;
  practiceGraded: boolean;
  handlePracticeSubmit: () => void;
  setCurrentView: (view: string) => void;
}

export const PracticeRoom: React.FC<PracticeRoomProps> = ({
  activePracticeTask,
  practiceAnswers,
  setPracticeAnswers,
  practiceGraded,
  handlePracticeSubmit,
  setCurrentView,
}) => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
      
      {/* Title segment */}
      <div className="border-b border-slate-100 pb-4">
        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3 w-3 inline text-indigo-500 mr-1" />
          <span>Bài Tập Vá Lỗ Hổng Từ AI Coach</span>
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">{activePracticeTask.title}</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Dạng bài điền từ và viết lại từ nguyên mẫu giúp củng cố kiến thức thi chuyển cấp tức thì.
        </p>
      </div>

      {/* Main questions listing */}
      <div className="space-y-6">
        {activePracticeTask.questions.map((q, idx) => {
          const studentInput = practiceAnswers[q.id] || "";
          
          const cleanStudentAns = studentInput.trim().toLowerCase();
          const cleanCorrectAns = q.correct.trim().toLowerCase();
          const isCorrect = cleanStudentAns === cleanCorrectAns;

          return (
            <div key={q.id} className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-3.5">
              <span className="text-[10px] text-indigo-700 font-black uppercase tracking-wider block">
                Câu hỏi luyện tập {idx + 1}:
              </span>
              <p className="font-extrabold text-slate-900 text-base font-sans">{q.text}</p>
              
              <input 
                type="text"
                disabled={practiceGraded}
                value={studentInput}
                onChange={(e) => setPracticeAnswers({ ...practiceAnswers, [q.id]: e.target.value })}
                placeholder="Nhập câu trả lời chuẩn xác..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium bg-white"
              />

              {practiceGraded && (
                <div className="pt-2.5 text-xs text-slate-600 space-y-1.5 border-t border-slate-150 font-medium leading-relaxed">
                  <p className="flex items-center space-x-1">
                    <span className="font-bold">Trạng thái bài làm của em:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}>
                      {isCorrect ? "Đúng rồi ✨" : "Nhầm lẫn ❌"}
                    </span>
                  </p>
                  <p>
                    <span className="font-bold text-slate-500">Bài làm:</span> <span className="font-mono">{studentInput || "(Chưa gõ)"}</span>
                  </p>
                  <p>
                    <span className="font-bold text-slate-500">Đáp án chuẩn:</span> <code className="font-mono bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded font-black">{q.correct}</code>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer trigger actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button 
          type="button"
          onClick={() => setCurrentView("student-dashboard")}
          className="px-5 py-3 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </button>
        
        {!practiceGraded ? (
          <button 
            type="button"
            onClick={handlePracticeSubmit}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition"
          >
            Nộp Bài Làm
          </button>
        ) : (
          <button 
            type="button"
            onClick={() => setCurrentView("student-dashboard")}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold rounded-xl transition flex items-center space-x-1.5"
          >
            <span>Hoàn thành bổ trợ</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

    </div>
  );
};
