import React from "react";
import { Sparkles, TrendingUp, Clock, BookOpen, User, CheckCircle2, ChevronRight } from "lucide-react";
import { Assignment, Attempt, Exam } from "../types";

interface StudentDashboardProps {
  currentUser: any;
  assignments: Assignment[];
  attempts: Attempt[];
  exams: Exam[];
  handleStartExam: (assignmentId: string) => void;
  setSelectedAttempt: (att: Attempt) => void;
  setCurrentView: (view: string) => void;
  handleGeneratePractice: (grammarPoint: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  assignments,
  attempts,
  exams,
  handleStartExam,
  setSelectedAttempt,
  setCurrentView,
  handleGeneratePractice,
}) => {
  return (
    <div className="space-y-8">
      {/* Upper Student details banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Chương trình luyện sâu vào lớp 10 THCS</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Chào {currentUser?.full_name || "học sinh"}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Mục tiêu điểm thi Tiếng Anh vào 10: <span className="font-extrabold text-indigo-600 text-base">{currentUser?.target_score || "9.0"}</span>
          </p>
        </div>

        {/* Progress gauge metrics */}
        <div className="bg-indigo-50 p-5 rounded-2xl flex items-center space-x-4 border border-indigo-100">
          <div className="p-3 bg-white rounded-xl text-indigo-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Ước lượng năng lực hiện tại</p>
            <p className="text-2xl font-black text-indigo-950">7.2/10</p>
            <p className="text-[10px] text-indigo-600 font-semibold leading-none">Cần thêm +1.8 để chinh phục mục tiêu!</p>
          </div>
        </div>
      </div>

      {/* Main Student layout split cols */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Online exam assignments */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <span>Nhiệm vụ luyện thi trực tuyến</span>
          </h3>

          <div className="space-y-4">
            {assignments.map(ass => {
              const exam = exams.find(e => e.exam_id === ass.exam_id);
              const completedAttempt = attempts.find(
                att => att.assignment_id === ass.assignment_id && att.student_id === currentUser.student_id
              );
              const isCompleted = !!completedAttempt;

              return (
                <div 
                  key={ass.assignment_id} 
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[9px] font-extrabold uppercase">
                        Lớp {ass.class_name}
                      </span>
                      <span className="text-xs text-slate-400 font-bold inline-flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Hạn khóa đề: {ass.due_date}</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{exam?.title || "Đề thi thử"}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Thời gian làm bài: {exam?.duration || 60} phút | Số câu hỏi: {exam?.total_questions || 8} câu
                    </p>
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center space-x-3.5 self-stretch sm:self-auto justify-between sm:justify-start pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Đã chấm</p>
                        <p className="text-lg font-black text-emerald-600 mt-1">{completedAttempt.score}/10</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setSelectedAttempt(completedAttempt);
                          setCurrentView("student-result");
                        }}
                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition duration-200 flex items-center space-x-1"
                      >
                        <span>Xem kết quả</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => handleStartExam(ass.assignment_id)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition whitespace-nowrap text-center"
                    >
                      Bắt Đầu Làm Đề
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: AI Personalized drilling tasks */}
        <div className="space-y-6">
          <div className="border-b border-slate-200/80 pb-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI đề xuất rèn luyện</h3>
            <p className="text-xs text-slate-500">Sinh bài tập phụ đạo bù lấp tức thời các vùng rò rỉ điểm</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            
            <div className="p-4 bg-red-50/50 border border-red-200/60 rounded-xl space-y-2.5">
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-black uppercase">Chữa cháy ngữ pháp</span>
              <h5 className="font-bold text-slate-900 text-xs sm:text-sm">Câu bị động (Passive voice)</h5>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Hệ thống nhận thấy điểm yếu viết lại câu bị động quá khứ đơn trong lần thi thử trước. Đề nghị làm ngay 5 câu bồi dưỡng.
              </p>
              <button 
                type="button"
                onClick={() => handleGeneratePractice("PASSIVE")}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition duration-200 w-full text-center tracking-wide uppercase"
              >
                Nhận chuyên đề bị động
              </button>
            </div>

            <div className="p-4 bg-amber-50/40 border border-amber-200/60 rounded-xl space-y-2.5">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-black uppercase">Thực hành khẩn cấp</span>
              <h5 className="font-bold text-slate-900 text-xs sm:text-sm">Từ loại biến đổi (Word form)</h5>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Vá ngay các quy tắc thêm đuôi suffix (-ly, -fully, -tion) của các từ vựng chủ đề môi trường và công nghệ lớp 9.
              </p>
              <button 
                type="button"
                onClick={() => handleGeneratePractice("WORD_FORM")}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition duration-200 w-full text-center tracking-wide uppercase"
              >
                Nhận chuyên đề biến từ
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
