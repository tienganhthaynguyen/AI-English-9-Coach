import React from "react";
import { Users, Layers, Award, AlertTriangle, PlusCircle, Layout, BookOpen, ChevronRight } from "lucide-react";
import { ClassItem } from "../types";

interface TeacherDashboardProps {
  classes: ClassItem[];
  examsCount: number;
  setCurrentView: (view: string) => void;
  setSelectedClassReport: (cl: ClassItem) => void;
  handleGeneratePractice: (grammarPoint: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  classes,
  examsCount,
  setCurrentView,
  setSelectedClassReport,
  handleGeneratePractice,
}) => {
  return (
    <div className="space-y-8">
      {/* 4 Cards Stats counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Học sinh khối 9</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">9 học sinh</p>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Đang tích cực ôn luyện bám sát đề 10</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lớp Quản Lý</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">2 Lớp</p>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Phân chia: 9A1 (chuyên) & 9A2 (thực hành)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bộ đề thi thử</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Award className="h-4 w-4" />
            </span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{examsCount} Đề thi</p>
            <span className="text-[10px] sm:text-xs text-emerald-600 font-semibold">Tự động hóa bóc tách qua AI Coach</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lỗi phổ biến</span>
            <span className="p-2 bg-red-50 text-red-600 rounded-xl">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div>
            <p className="text-base sm:text-lg font-black text-red-600 mt-2 uppercase truncate">WORD_FORM & TƯƠNG THUẬT</p>
            <span className="text-[10px] sm:text-xs text-red-500 font-bold">&gt; 65% Học sinh mắc lỗi</span>
          </div>
        </div>
      </div>

      {/* Main dashboard columns splits */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Managed Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Danh sách lớp quản lý</h3>
              <p className="text-xs text-slate-500">Giám sát điểm số chung, tỷ lệ trả lời bài viết tự luận</p>
            </div>
            
            <button 
              type="button"
              onClick={() => setCurrentView("exam-generator")}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 flex items-center space-x-1.5 transition self-start"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Thiết Kế Đề Thi</span>
            </button>
          </div>

          <div className="grid gap-4">
            {classes.map(cl => (
              <div 
                key={cl.class_id} 
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-extrabold">LỚP {cl.class_name}</span>
                    <span className="text-xs text-slate-400 font-medium">Sĩ số: {cl.student_count} học sinh</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">Bài thi gần đây nhất: {cl.last_test}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    Tỷ lệ hoàn thành đề thi: <span className="font-bold text-indigo-600">{cl.submission_rate}%</span>
                  </p>
                </div>

                <div className="flex items-center space-x-5">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Điểm Trung Bình</p>
                    <p className={`text-xl font-black tracking-tight ${cl.avg_score >= 7.0 ? "text-emerald-600" : "text-amber-500"}`}>{cl.avg_score}/10</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedClassReport(cl);
                      setCurrentView("teacher-class-report");
                    }}
                    className="px-4 py-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 hover:border-indigo-100 text-xs font-bold rounded-xl transition duration-200 whitespace-nowrap"
                  >
                    Xem Báo Cáo
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Banner trigger for question library */}
          <div className="bg-indigo-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-indigo-100">
            <div className="space-y-1.5">
              <h4 className="text-base font-bold tracking-tight inline-flex items-center space-x-2">
                <Layout className="h-5 w-5 text-indigo-300" />
                <span>Thư viện Ngân hàng câu hỏi tuyển sinh</span>
              </h4>
              <p className="text-xs text-indigo-200">
                Lưu trữ gần 300 câu hỏi trắc nghiệm ngữ âm, điền từ chuyên đề và bài viết tự luận viết lại câu chuẩn cấu trúc G9.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setCurrentView("question-bank")}
              className="px-4 py-2.5 bg-white text-indigo-950 font-bold rounded-xl text-xs hover:bg-slate-50 transition duration-200 whitespace-nowrap self-start sm:self-center"
            >
              Phân loại thư mục
            </button>
          </div>
        </div>

        {/* Right Column: AI Warning alerts */}
        <div className="space-y-6">
          <div className="border-b border-slate-200/80 pb-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Cảnh báo điểm nghẽn</h3>
            <p className="text-xs text-slate-500">Giúp thầy cô giao gấp dạng ôn tập để lấy điểm tủ</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            
            <div className="p-4 bg-red-50/50 border border-red-200/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded uppercase">Mức khẩn cấp</span>
                <span className="text-xs font-bold text-red-600">68% sai sót</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">WORD_FORM (Biến đổi từ loại)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nhầm lẫn hậu tố danh từ chỉ người/vật; chưa quen viết trạng từ bằng đuôi phụ hóa tính từ.
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold">Priority: HIGH</span>
                <button 
                  type="button"
                  onClick={() => handleGeneratePractice("WORD_FORM")}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center space-x-1"
                >
                  <span>Giao bài bù</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-yellow-50/30 border border-yellow-200/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded uppercase">Trung bình</span>
                <span className="text-xs font-bold text-yellow-600">55% sai sót</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">PASSIVE_VOICE (Thể bị động)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Quên chưa chia động từ To-Be trong thì quá khứ đơn, nhầm thì khi viết lại câu bị động.
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold">Priority: MEDIUM</span>
                <button 
                  type="button"
                  onClick={() => handleGeneratePractice("PASSIVE")}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center space-x-1"
                >
                  <span>Giao bài bù</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-blue-50/30 border border-blue-200/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase font-sans">Ít cần chú ý</span>
                <span className="text-xs font-bold text-blue-600">45% sai sót</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">PREPOSITIONS (Giới từ đi liền)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dùng sai các giới từ quen thuộc đi theo các tính từ như 'excited about', 'famous for', 'good at'.
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold">Priority: LOW</span>
                <button 
                  type="button"
                  onClick={() => handleGeneratePractice("PREPOSITION")}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center space-x-1"
                >
                  <span>Giao bài bù</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
