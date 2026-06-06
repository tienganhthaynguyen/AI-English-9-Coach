import React from "react";
import { Sparkles, HelpCircle, GraduationCap, ArrowUpRight, CheckCircle } from "lucide-react";
import { Student } from "../types";

interface GrammarMapProps {
  currentUser: Student;
  handleGeneratePractice: (grammarPoint: string) => void;
}

export const GrammarMap: React.FC<GrammarMapProps> = ({ currentUser, handleGeneratePractice }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Description header text */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Bản Đồ Điểm Nghẽn Ngữ Pháp Lớp 9
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Dữ liệu được cập nhật tự động từ lịch sử nộp bài trắc nghiệm và câu viết lại tự luận của em.
        </p>
      </div>

      {/* Grammar weaknesses layout map */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-none">Phân tích chuyên đề ôn thi vào 10</h4>
        </div>

        <div className="grid gap-6">
          {(Object.entries(currentUser.grammar_weakness_map) as [string, number][]).map(([point, score]) => {
            
            // Layout metrics
            const isStrong = score >= 80;
            const isMedium = score >= 65 && score < 80;
            const isWeak = score >= 45 && score < 65;
            const isCritical = score < 45;

            let colorClass = "bg-emerald-500";
            let textClass = "text-emerald-700 bg-emerald-50 border-emerald-100";
            let statusText = "Thành thạo (Strong)";

            if (isMedium) {
              colorClass = "bg-yellow-500";
              textClass = "text-yellow-700 bg-yellow-50 border-yellow-100";
              statusText = "Khá ổn (Average)";
            } else if (isWeak) {
              colorClass = "bg-amber-500";
              textClass = "text-amber-700 bg-amber-50 border-amber-100";
              statusText = "Cần gia cố (Weak)";
            } else if (isCritical) {
              colorClass = "bg-red-500";
              textClass = "text-red-700 bg-red-50 border-red-100 animate-pulse";
              statusText = "Nguy kịch (Critical)";
            }

            const pointTitleVi = 
              point === "TENSE" ? "Thì của động từ (Verb tenses)" :
              point === "SVA" ? "Sự hòa hợp Chủ-Vị (Subject-Verb Agreement)" :
              point === "PASSIVE" ? "Thể bị động (Passive voice)" :
              point === "WORD_FORM" ? "Từ loại & Suffixes (Word forms)" :
              point === "PREPOSITION" ? "Thành ngữ & Giới từ (Prepositions)" :
              "Câu tường thuật gián tiếp (Reported Speech)";

            return (
              <div key={point} className="space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <span className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">
                    {pointTitleVi}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Độ đạt:</span>
                    <span className="text-sm font-mono font-black text-slate-900">{score}%</span>
                    <span className={`px-2 py-0.5 border rounded text-[9px] font-black uppercase tracking-wider ${textClass}`}>
                      {statusText}
                    </span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-3.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                {/* Action remedial instructions if weak */}
                {score < 75 && (
                  <div className="pt-1 flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-medium italic">
                      Gợi ý: Cần bù khẩn cấp 5 câu để kéo chỉ số lên mức Xanh.
                    </p>
                    <button 
                      type="button"
                      onClick={() => handleGeneratePractice(point)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center space-x-0.5 border border-indigo-100 hover:border-indigo-300 bg-indigo-50/20 hover:bg-indigo-50 px-2 py-1 rounded-lg transition"
                    >
                      <span>Luyện bù ngay</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
