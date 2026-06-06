import React from "react";
import { Clock, Play, Flag, HelpCircle, ArrowLeftRight, CheckCircle } from "lucide-react";
import { Question, Exam } from "../types";

interface TestRoomProps {
  activeExam: Exam;
  questions: Question[];
  studentAnswers: Record<string, string>;
  testTimeRemaining: number;
  flaggedQuestions: Record<string, boolean>;
  handleAnswerChange: (questionId: string, value: string) => void;
  toggleFlagQuestion: (questionId: string) => void;
  handleSubmitExamClick: () => void;
}

export const TestRoom: React.FC<TestRoomProps> = ({
  activeExam,
  questions,
  studentAnswers,
  testTimeRemaining,
  flaggedQuestions,
  handleAnswerChange,
  toggleFlagQuestion,
  handleSubmitExamClick,
}) => {
  const examQuestions = questions.filter(q => activeExam.question_ids.includes(q.question_id));

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const answeredCount = examQuestions.filter(q => !!studentAnswers[q.question_id]).length;

  return (
    <div className="space-y-6">
      {/* Interactive sticky countdown panel */}
      <div className="sticky top-16 z-30 bg-slate-900 text-white p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl border border-slate-800">
        <div className="space-y-1">
          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            KHU VỰC THI THỬ TRỰC TUYẾN
          </span>
          <h3 className="font-extrabold text-base sm:text-lg leading-tight text-white">{activeExam.title}</h3>
          <p className="text-xs text-slate-400">
            Nội dung bài làm tự kích hoạt lưu tự động mỗi giây vào Sandbox an toàn.
          </p>
        </div>

        <div className="flex items-center justify-between md:justify-end space-x-6">
          <div className="flex items-center space-x-2.5 bg-slate-850 px-4 py-2 rounded-xl border border-slate-800">
            <Clock className="h-5 w-5 text-amber-400 animate-pulse" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Thời gian còn lại</p>
              <p className="text-lg sm:text-xl font-mono font-black text-amber-300 mt-0.5 whitespace-nowrap">
                {formatTime(testTimeRemaining)}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleSubmitExamClick}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-xs sm:text-sm font-extrabold text-white rounded-xl shadow-lg shadow-emerald-900/10 transition flex items-center space-x-1.5 self-center"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Nộp Bài Làm</span>
          </button>
        </div>
      </div>

      {/* Primary splits layout for questions and navigation grids */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of exam questions */}
        <div className="lg:col-span-2 space-y-6">
          {examQuestions.map((q, idx) => {
            const isFlagged = !!flaggedQuestions[q.question_id];
            const currentAns = studentAnswers[q.question_id] || "";

            return (
              <div 
                key={q.question_id} 
                className={`bg-white p-6 rounded-2xl border-2 transition-all duration-300 space-y-4 ${
                  isFlagged 
                    ? "border-amber-300 bg-amber-50/5 shadow-sm shadow-amber-100/10" 
                    : "border-slate-200/80 hover:border-slate-300 shadow-sm"
                }`}
              >
                
                {/* Heading indicator */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase">
                    Câu hỏi {idx + 1}
                  </span>
                  
                  <button 
                    type="button"
                    onClick={() => toggleFlagQuestion(q.question_id)}
                    className={`text-xs font-bold inline-flex items-center space-x-1.5 transition duration-200 ${
                      isFlagged ? "text-amber-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Flag className={`h-4 w-4 ${isFlagged ? "fill-amber-500 text-amber-500" : ""}`} />
                    <span>{isFlagged ? "Bỏ xem lại" : "Đánh dấu xem lại"}</span>
                  </button>
                </div>

                {/* Prompt Question Content */}
                <p className="font-extrabold text-slate-900 text-base leading-relaxed whitespace-pre-line font-sans">
                  {q.question_text}
                </p>

                {/* Choices inputs rendering as requested */}
                {q.question_type === "multiple_choice" && q.options ? (
                  <div className="grid gap-2.5 pt-2">
                    {Object.entries(q.options).map(([key, value]) => (
                      <label 
                        key={key} 
                        className={`p-4 rounded-xl border text-sm flex items-center space-x-3.5 cursor-pointer select-none transition duration-150 ${
                          currentAns === key 
                            ? "bg-indigo-50/60 border-indigo-300 text-indigo-950 font-bold shadow-sm" 
                            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <input 
                          type="radio" 
                          name={`q_${q.question_id}`} 
                          value={key}
                          checked={currentAns === key}
                          onChange={() => handleAnswerChange(q.question_id, key)}
                          className="w-4.5 h-4.5 text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-offset-0"
                        />
                        <span className="font-extrabold text-xs text-indigo-700 group-hover:text-indigo-800 uppercase mr-1">
                          {key}.
                        </span>
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="pt-2 space-y-1.5">
                    <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide block">
                      Viết câu trả lời tự luận của em vào ô này:
                    </label>
                    <input 
                      type="text"
                      value={currentAns}
                      onChange={(e) => handleAnswerChange(q.question_id, e.target.value)}
                      placeholder="Gõ đáp án chính xác..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium bg-white"
                    />
                    <p className="text-[10px] text-slate-400 font-medium">
                      Lưu ý: Không viết hoa đầu câu, viết hoa tên riêng khi cần thiết. Kiểm tra kỹ chính tả.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Answering Map navigation grids */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider border-b border-slate-100 pb-2">
              Bản đồ trả lời bài
            </h4>
            
            <div className="grid grid-cols-4 gap-2">
              {activeExam.question_ids.map((id, index) => {
                const isAnswered = !!studentAnswers[id];
                const isFlagged = !isAnswered && flaggedQuestions[id];
                const isFlaggedAndAnswered = isAnswered && flaggedQuestions[id];

                let bgClass = "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100";
                if (isFlaggedAndAnswered) {
                  bgClass = "bg-amber-500 text-white border border-amber-600";
                } else if (isFlagged) {
                  bgClass = "bg-amber-100 border border-amber-300 text-amber-800";
                } else if (isAnswered) {
                  bgClass = "bg-indigo-600 text-white shadow-sm shadow-indigo-200";
                }

                return (
                  <div 
                    key={id}
                    className={`h-11 rounded-xl text-xs font-bold transition duration-150 flex flex-col items-center justify-center select-none ${bgClass}`}
                  >
                    <span>{index + 1}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-500 font-semibold">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 bg-indigo-600 rounded-lg"></span>
                <span>Đã làm ({answeredCount} / {examQuestions.length} câu)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 bg-slate-50 border border-slate-200 rounded-lg"></span>
                <span>Chưa làm ({examQuestions.length - answeredCount} câu)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 bg-amber-100 border border-amber-300 rounded-lg"></span>
                <span>Đánh dấu cần xem lại sau</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
