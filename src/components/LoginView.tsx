import React from "react";
import { User, Users, GraduationCap, ChevronRight } from "lucide-react";

interface LoginViewProps {
  handleQuickLogin: (role: "teacher" | "student") => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ handleQuickLogin }) => {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Chào mừng quay lại</h3>
        <p className="text-sm text-slate-500 font-medium">Chọn một tài khoản thử nghiệm nhanh bên dưới để bắt đầu</p>
      </div>
      
      <div className="space-y-3">
        <button 
          type="button"
          onClick={() => handleQuickLogin("teacher")}
          className="w-full text-left p-4 border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl flex items-center justify-between transition-all duration-200 group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 group-hover:text-indigo-800 transition-colors">Thầy Tuấn Anh</p>
              <p className="text-xs text-slate-500">Giáo viên Tiếng Anh khối 9 THCS</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>

        <button 
          type="button"
          onClick={() => handleQuickLogin("student")}
          className="w-full text-left p-4 border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl flex items-center justify-between transition-all duration-200 group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-100 transition-colors">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 group-hover:text-violet-800 transition-colors">Nguyễn Minh Anh</p>
              <p className="text-xs text-slate-500 font-medium">Học sinh lớp 9A1 - Mục tiêu 9.0 vào 10</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
        </button>
      </div>

      <div className="pt-2 text-center text-[11px] text-slate-400 font-medium leading-relaxed">
        Phên bản thử nghiệm EdTech EduCoach. Toàn bộ cơ sở dữ liệu là dạng In-Memory an toàn.
      </div>
    </div>
  );
};
