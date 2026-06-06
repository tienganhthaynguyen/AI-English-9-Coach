import React from "react";
import { Award, Sparkles, Check, AlertCircle, Calendar, Shield, RefreshCw, ChevronLeft, Heart, CheckCircle2 } from "lucide-react";
import { Attempt, Exam, Question } from "../types";

interface ResultViewProps {
  selectedAttempt: Attempt;
  exams: Exam[];
  questions: Question[];
  apiLoading: boolean;
  handleGradeWithAI: (attemptId: string) => void;
  setCurrentView: (view: string) => void;
  role: string;
}

export const ResultView: React.FC<ResultViewProps> = ({
  selectedAttempt,
  exams,
  questions,
  apiLoading,
  handleGradeWithAI,
  setCurrentView,
  role,
}) => {
  const examObj = exams.find(e => e.exam_id === questions.find(q => q.question_id === Object.keys(selectedAttempt.answers)[0])?.question_id) || exams[0];
  const examQuestions = questions.filter(q => examObj?.question_ids.includes(q.question_id));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Upper score block card header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
          <Award className="h-4 w-4" />
          <span>Bàn Giao Kết Quả Ôn Luyện</span>
        </span>
        
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
          {examObj?.title || "Bài ôn tập cuối chương"}
        </h2>
        
        <p className="text-xs text-slate-400 font-medium">Nộp bài lúc: {selectedAttempt.submitted_at}</p>

        <div className="flex items-center justify-center space-x-8 pt-4">
          <div className="text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">TỔNG ĐIỂM SỐ</p>
            <p className="text-4xl sm:text-5xl font-black text-indigo-600 mt-1">{selectedAttempt.score}/10</p>
          </div>
          <div className="w-px h-14 bg-slate-200"></div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none font-sans">THỜI GIAN LÀM</p>
            <p className="text-lg sm:text-2xl font-extrabold text-slate-800 mt-1">
              {Math.floor(selectedAttempt.time_spent / 60)} phút {(selectedAttempt.time_spent % 60)} giây
            </p>
          </div>
        </div>
      </div>

      {/* AI Teacher detailed report module */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-slate-800">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600/30 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-xl font-bold">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">AI English Exam Coach</h3>
                <p className="text-[10px] sm:text-xs text-indigo-300 font-medium">Phản hồi chắp cánh ước mơ đại học và trung học phổ thông khối Chuyên</p>
              </div>
            </div>
          </div>

          {apiLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">AI English Coach đang phân tích cấu trúc câu và lập bản đồ học tập...</p>
                <p className="text-xs text-indigo-300 font-medium">Quá trình bóc lỗi sai ngữ pháp kéo dài từ 2 đến 4 giây.</p>
              </div>
            </div>
          ) : selectedAttempt.ai_feedback ? (
            <div className="space-y-6 text-sm">
              
              {/* Overall comment segment */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">💬 Nhân xét của Coach:</span>
                <p className="text-slate-100 leading-relaxed text-sm bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                  {selectedAttempt.ai_feedback.overall_comment}
                </p>
              </div>

              {/* Strengths and Weaknesses bento panels */}
              <div className="grid sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/20 rounded-xl space-y-2">
                  <p className="font-bold text-emerald-400 text-xs sm:text-sm flex items-center space-x-1.5">
                    <Check className="h-4 w-4" />
                    <span>Điểm mạnh ghi nhận:</span>
                  </p>
                  <ul className="space-y-1 text-xs text-emerald-100/90 leading-relaxed list-disc list-inside font-medium">
                    {selectedAttempt.ai_feedback.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-red-950/10 border border-red-900/10 rounded-xl space-y-2">
                  <p className="font-bold text-red-300 text-xs sm:text-sm flex items-center space-x-1.5">
                    <AlertCircle className="h-4 w-4" />
                    <span>Vùng khuyết thiếu nguy cấp:</span>
                  </p>
                  <ul className="space-y-1 text-xs text-red-200/90 leading-relaxed list-disc list-inside font-medium">
                    {selectedAttempt.ai_feedback.weaknesses.map((wk, i) => (
                      <li key={i}>{wk}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Detailed grammar errors annotations */}
              {selectedAttempt.ai_feedback.major_grammar_errors && selectedAttempt.ai_feedback.major_grammar_errors.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">🔍 Phân tích ngữ âm và cấu trúc câu tự luận:</span>
                  
                  {selectedAttempt.ai_feedback.major_grammar_errors.map((err, i) => (
                    <div key={i} className="p-5 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-red-900/30 text-red-300 border border-red-900/20 rounded text-[10px] font-bold uppercase tracking-wider">
                          {err.error_name_vi}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-medium">Error Group: {err.error_type}</span>
                      </div>
                      
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <span className="font-bold text-slate-100">Cơ chế lỗi sai:</span> {err.explanation_vi}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-red-950/20 border border-red-900/15 rounded-lg">
                          <p className="font-bold text-red-300 mb-1 leading-none">❌ Phương án lỗi sai của em:</p>
                          <p className="font-mono text-slate-100 font-medium">{err.wrong_example || "(Không ghi nhận)"}</p>
                        </div>
                        <div className="p-3 bg-emerald-950/20 border border-emerald-900/15 rounded-lg">
                          <p className="font-bold text-emerald-400 mb-1 leading-none">✨ Câu sửa hoàn thiện chuẩn:</p>
                          <p className="font-mono text-slate-100 font-medium">{err.correct_example}</p>
                        </div>
                      </div>

                      <p className="text-xs text-amber-300 italic font-medium">
                        <span className="font-bold not-italic text-slate-200">💡 Chỉ dẫn khắc phục:</span> {err.advice}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Day Study Plan */}
              {selectedAttempt.ai_feedback.seven_day_plan && (
                <div className="space-y-3.5 pt-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">📅 Lộ trình bồi đắp kiến thức cá nhân hóa trong 7 Ngày:</span>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {selectedAttempt.ai_feedback.seven_day_plan.map((dayPlan, i) => (
                      <div key={i} className="p-4 bg-slate-950/30 border border-slate-800 rounded-xl flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[10px] text-amber-400 font-extrabold uppercase leading-none tracking-wider">NGÀY {dayPlan.day}</span>
                          <h5 className="font-bold text-white text-xs mt-1 leading-snug">{dayPlan.focus}</h5>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{dayPlan.task}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gửi riêng thầy cô và phụ huynh */}
              <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-slate-850">
                {selectedAttempt.ai_feedback.teacher_note && (
                  <div className="p-4 bg-indigo-950/10 border border-indigo-900/15 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider leading-none">📋 Note cho giáo viên:</p>
                    <p className="text-xs text-indigo-200/90 leading-relaxed font-medium">{selectedAttempt.ai_feedback.teacher_note}</p>
                  </div>
                )}
                {selectedAttempt.ai_feedback.parent_note && (
                  <div className="p-4 bg-pink-950/5 border border-pink-900/10 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-pink-400 uppercase tracking-wider leading-none">
                      <Heart className="h-3 w-3 inline mr-1 fill-pink-500 text-pink-500" />
                      <span>Note cho phụ huynh:</span>
                    </p>
                    <p className="text-xs text-pink-200/90 leading-relaxed font-medium">{selectedAttempt.ai_feedback.parent_note}</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <p className="text-sm text-slate-400">Bài thi của em hiện chưa được AI Coach phân tích chi tiết.</p>
              <button 
                type="button"
                onClick={() => handleGradeWithAI(selectedAttempt.attempt_id)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition duration-200 inline-flex items-center space-x-1.5"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Kích hoạt chấm điểm thông minh qua AI</span>
              </button>
            </div>
          )}
        </div>

        {/* Detailed answering correctness checklist */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Chi tiết câu hỏi & bài làm</h3>
          
          <div className="space-y-4">
            {examQuestions.map((q, idx) => {
              const studentChoice = selectedAttempt.answers[q.question_id] || "";
              const cleanStudentAns = studentChoice.trim().toLowerCase();
              const cleanCorrectAns = q.correct_answer.trim().toLowerCase();

              const hasAcceptableMatch = q.acceptable_answers?.some(
                ans => ans.trim().toLowerCase() === cleanStudentAns
              );
              
              const isCorrect = cleanStudentAns === cleanCorrectAns || hasAcceptableMatch;

              return (
                <div 
                  key={q.question_id} 
                  className={`bg-white p-6 rounded-2xl border transition-all space-y-3.5 shadow-sm ${
                    isCorrect 
                      ? "border-emerald-200 bg-emerald-50/5 hover:border-emerald-300" 
                      : "border-red-200 bg-red-50/5 hover:border-red-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      Câu {idx + 1} &bull; Chuyên đề: {q.grammar_point}
                    </span>
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isCorrect ? "bg-emerald-150 text-emerald-800" : "bg-red-150 text-red-800"
                    }`}>
                      <span>{isCorrect ? "Đúng" : "Lỗi sai"}</span>
                    </span>
                  </div>

                  <p className="font-extrabold text-slate-900 text-sm sm:text-base leading-relaxed">
                    {q.question_text}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 pt-1 text-sm">
                    <div className={`p-3.5 rounded-xl border ${
                      isCorrect ? "bg-emerald-50 border-emerald-100 text-emerald-900" : "bg-red-50 border-red-100 text-red-900"
                    }`}>
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-1 leading-none">Phương án em điền:</p>
                      <p className="font-mono font-bold text-sm">{studentChoice || "(Bỏ trống không làm)"}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-250 text-slate-900 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-1 leading-none">Phương án chuẩn xác:</p>
                      <p className="font-mono font-bold text-sm text-indigo-700">{q.correct_answer}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed font-medium">
                    <p className="font-extrabold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                      <Sparkles className="h-3 w-3 text-indigo-500" />
                      <span>GIẢI THÍCH CHỈ DẪN TIẾNG VIỆT:</span>
                    </p>
                    {q.explanation_vi}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating actions buttons back to controller */}
        <div className="pt-4 flex items-center justify-center">
          <button 
            type="button"
            onClick={() => setCurrentView(role === "teacher" ? "teacher-dashboard" : "student-dashboard")}
            className="px-8 py-3.5 bg-slate-900 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm rounded-xl tracking-wide uppercase shadow-md active:scale-95 transition"
          >
            Quay lại Bảng Điều Khiển
          </button>
        </div>

      </div>
    </div>
  );
};
