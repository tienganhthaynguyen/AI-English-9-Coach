import React from "react";
import { Download, Sparkles, Award, AlertTriangle, ArrowLeft, Send } from "lucide-react";
import { ClassItem, Student, Attempt } from "../types";

interface TeacherClassReportProps {
  selectedClassReport: ClassItem;
  students: Student[];
  attempts: Attempt[];
  setSelectedAttempt: (att: Attempt) => void;
  setCurrentView: (view: string) => void;
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
}

export const TeacherClassReport: React.FC<TeacherClassReportProps> = ({
  selectedClassReport,
  students,
  attempts,
  setSelectedAttempt,
  setCurrentView,
  showToast,
}) => {
  const classStudents = students.filter(st => st.class_id === selectedClassReport.class_id);

  // Math helpers
  const avg = selectedClassReport.avg_score;
  const excellentStudentsCount = selectedClassReport.class_name === "9A1" ? 3 : 1;
  const criticalStudentsCount = selectedClassReport.class_name === "9A1" ? 0 : 2;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title overview page */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
          <Award className="h-4 w-4 text-indigo-600" />
          <span>Báo báo kết quả sư phạm trực quan</span>
        </span>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
              Theo dõi Chất Lượng Lớp {selectedClassReport.class_name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Phân tích biểu đồ phổ điểm thi thử tuyển sinh 10 môn Tiếng Anh và hành động hướng dẫn phụ đạo.
            </p>
          </div>

          <button 
            type="button"
            onClick={() => showToast("Đã kết xuất báo cáo học thuật lớp dạng file PDF về thiết bị!", "success")}
            className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition whitespace-nowrap self-start sm:self-center inline-flex items-center space-x-1.5"
          >
            <Download className="h-4 w-4" />
            <span>Xuất Báo Cáo / Excel</span>
          </button>
        </div>
      </div>

      {/* Grid counters indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Phổ điểm trung bình</p>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-2">{avg}/10</p>
          <span className="text-[10px] text-slate-400 font-medium mt-1.5 block">Đạt chỉ tiêu kỳ 2 tối thiểu</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Tỷ Lệ Đạt (Trên 5.0)</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            {selectedClassReport.class_name === "9A1" ? "100%" : "50%"}
          </p>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1.5 block">Nâng lên +15% so với đợt 1</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Học sinh giỏi (&gt;=8.0)</p>
          <p className="text-2xl sm:text-3xl font-black text-indigo-950 mt-2">
            {excellentStudentsCount} Học sinh
          </p>
          <span className="text-[10px] text-slate-500 font-medium mt-1.5 block">Chỉ tiêu bồi dưỡng điểm 9, 10</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Trường hợp phụ đạo gấp</p>
          <p className="text-2xl sm:text-3xl font-black text-red-600 mt-2">
            {criticalStudentsCount} Học sinh
          </p>
          <span className="text-[10px] text-red-400 font-bold mt-1.5 block">Xác lập rò rỉ điểm ở mức Chuyên Đề</span>
        </div>
      </div>

      {/* Main split sections */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: List details table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Bảng điểm học tập</h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-250 text-slate-500 text-xs font-bold uppercase">
                    <th className="p-4">Họ và tên</th>
                    <th className="p-4">Mục tiêu</th>
                    <th className="p-4">Điểm thi thử</th>
                    <th className="p-4">Lỗi sai phổ biến</th>
                    <th className="p-4 text-right">Chi tiết nộp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium text-xs sm:text-sm">
                  {classStudents.map(st => {
                    const studentAttempt = attempts.find(a => a.student_id === st.student_id);
                    const currentScore = st.student_id === "S01" ? 9.0 : st.student_id === "S03" ? 9.5 : 5.5;

                    return (
                      <tr key={st.student_id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-extrabold text-slate-900">{st.full_name}</td>
                        <td className="p-4 font-bold text-indigo-600">{st.target_score}</td>
                        <td className="p-4 font-black text-slate-950">{currentScore}/10</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded text-[9px] font-black uppercase tracking-wider">
                            {st.student_id === "S01" ? "REPORTED" : "WORD_FORM"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {studentAttempt ? (
                            <button 
                              type="button"
                              onClick={() => {
                                setSelectedAttempt(studentAttempt);
                                setCurrentView("student-result");
                              }}
                              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-150 text-xs font-bold rounded-lg transition"
                            >
                              Phân Tích AI &rarr;
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Chưa nộp bài làm</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: AI Pedagogical suggestions handbooks */}
        <div className="space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Gợi ý Sư phạm AI</h3>

          <div className="bg-indigo-950 text-white p-6 rounded-3xl shadow-lg shadow-indigo-100 space-y-4 border border-indigo-900">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
              <h5 className="font-extrabold text-white text-xs sm:text-sm tracking-tight">Kế hoạch phụ đạo khuyên dùng:</h5>
            </div>

            <p className="text-xs text-indigo-200 leading-relaxed font-medium">
              Dựa trên thống kê 5 câu bị động và biến đổi từ loại có tần suất lỗi sai nhiều nhất của lớp {selectedClassReport.class_name}:
            </p>

            <div className="p-4 bg-indigo-900/60 border border-indigo-800 rounded-xl space-y-2.5 text-xs">
              <h6 className="font-bold text-white text-xs">Chuyên đề: Word Form & Passive Voice Gia Tốc</h6>
              <ul className="list-disc list-inside space-y-1.5 text-indigo-200 leading-relaxed font-medium">
                <li>Bố trí 15 phút đầu giờ ôn tập cấu trúc biến từ loại cơ bản qua sơ đồ cây hậu tố.</li>
                <li>Xây bài kiểm tra 10 câu trắc nghiệm bị động thì tương lai đơn có bổ sung 'by + agent'.</li>
              </ul>
            </div>

            <button 
              type="button"
              onClick={() => showToast("Đang sinh tài liệu Giáo án phụ đạo lớp học dưới dạng PDF... Vui lòng đợi trong giây lát!", "info")}
              className="w-full py-2.5 bg-white text-indigo-950 font-bold rounded-xl text-xs hover:bg-indigo-50 shadow-sm transition flex items-center justify-center space-x-1"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Tải Giáo Án Phụ Đạo Chi Tiết</span>
            </button>
          </div>
        </div>

      </div>

      {/* Back button */}
      <div className="pt-2 border-t border-slate-200">
        <button 
          type="button"
          onClick={() => setCurrentView("teacher-dashboard")}
          className="px-5 py-3 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-xl transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại Bảng điều khiển</span>
        </button>
      </div>

    </div>
  );
};
