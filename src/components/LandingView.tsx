import React from "react";
import { Sparkles, BarChart2, BookOpen, PenTool, ArrowRight, Shield } from "lucide-react";

interface LandingViewProps {
  handleQuickLogin: (role: "teacher" | "student") => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ handleQuickLogin }) => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero section */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <span className="inline-flex items-center space-x-1 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase">
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse text-indigo-500" />
          <span>Giải pháp AI đột phá đồng hành ôn thi THCS môn Tiếng Anh</span>
        </span>
        
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Công cụ tạo đề thi tuyển sinh 10 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
            và chấm điểm bằng AI
          </span>
        </h2>
        
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Hỗ trợ giáo viên thiết kế đề thi trắc nghiệm và tự luận chỉ trong 60 giây. Chấm dứt cảnh chấm tự luận thủ công bằng sức mạnh phân bóc lỗi sai chi tiết, lập tức sinh bản đồ điểm yếu cho từng em.
        </p>
        
        {/* Entrance trigger buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            type="button"
            onClick={() => handleQuickLogin("teacher")}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transform hover:-translate-y-0.5 active:translate-y-0 transition flex items-center justify-center space-x-2.5"
          >
            <span>Trải nghiệm vai Giáo viên</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button 
            type="button"
            onClick={() => handleQuickLogin("student")}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-indigo-700 font-bold border-2 border-indigo-100 rounded-xl hover:border-indigo-200 transform hover:-translate-y-0.5 active:translate-y-0 transition flex items-center justify-center"
          >
            Trải nghiệm vai Học sinh
          </button>
        </div>
      </div>

      {/* Benefit Bento-style Grid */}
      <div className="grid md:grid-cols-3 gap-8 pt-6">
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Thiết Kế Đề Chuẩn Sát</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Tạo đề ôn luyện 10 cực nhanh bám sát form mẫu của các tỉnh/thành phố (Hà Nội, TP.HCM, Đà Nẵng). Tự do phân bố tỷ lệ độ khó và lựa chọn chuyên đề Ngữ pháp trọng tâm.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold">
            <PenTool className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">AI Chấm Viết Chi Tiết</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Chấm tự động câu viết lại gián tiếp, câu ước, bị động và word form phức tạp. Chỉ rõ lỗi sai (SVA, lùi thì, trạng từ), giải thích cặn kẽ và đề xuất cách viết chuẩn.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
            <BarChart2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Bản Đồ Năng Lực 7 Ngày</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Tự động bóc tách bản đồ lỗ hổng ngữ pháp của từng cá nhân. Gói kế hoạch tự ôn tập 7 ngày thông minh và sinh bài tập phụ đạo khẩn cấp giảm thiểu rủi ro thi cử.
          </p>
        </div>

      </div>

      {/* Security credentials badge */}
      <div className="max-w-md mx-auto pt-4 text-center">
        <p className="text-xs text-slate-400 font-medium inline-flex items-center justify-center space-x-1.5">
          <Shield className="h-3.5 w-3.5 text-slate-400" />
          <span>Vận hành hoàn toàn bằng mô hình Gemini 3.5 Flash bảo mật</span>
        </p>
      </div>
    </div>
  );
};
