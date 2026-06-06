import React from "react";
import { GraduationCap, BrainCircuit, LogOut, Settings } from "lucide-react";

interface HeaderProps {
  role: string;
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUser: any;
  handleLogout: () => void;
  setShowConfigModal: (show: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  currentView,
  setCurrentView,
  currentUser,
  handleLogout,
  setShowConfigModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand title */}
        <div 
          className="flex items-center space-x-3 cursor-pointer select-none group" 
          onClick={() => setCurrentView("landing")}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
              AI English 9
            </h1>
            <span className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase">
              Exam Coach
            </span>
          </div>
        </div>

        {/* Center navigation links responsive */}
        {role !== "guest" && (
          <nav className="hidden md:flex space-x-1">
            {role === "teacher" && (
              <>
                <button 
                  onClick={() => setCurrentView("teacher-dashboard")}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                    currentView === "teacher-dashboard" 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Bảng điều khiển
                </button>
                <button 
                  onClick={() => setCurrentView("exam-generator")}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                    currentView === "exam-generator" 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Thiết kế đề thi
                </button>
                <button 
                  onClick={() => setCurrentView("question-bank")}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                    currentView === "question-bank" 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Ngân hàng câu hỏi
                </button>
              </>
            )}

            {role === "student" && (
              <>
                <button 
                  onClick={() => setCurrentView("student-dashboard")}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                    currentView === "student-dashboard" 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Góc học tập
                </button>
                <button 
                  onClick={() => setCurrentView("student-grammar-report")}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                    currentView === "student-grammar-report" 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Bản đồ điểm yếu
                </button>
              </>
            )}
          </nav>
        )}

        {/* Action controls */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowConfigModal(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
            title="Cài đặt API Gemini"
          >
            <Settings className="h-5 w-5 animate-hover-spin" />
          </button>

          {role !== "guest" ? (
            <div className="flex items-center space-x-3">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-bold text-slate-900 leading-none">
                  {currentUser?.name || currentUser?.full_name}
                </p>
                <p className="text-[10px] text-indigo-600 font-semibold tracking-wider uppercase mt-1">
                  {role === "teacher" ? "Thầy Cô" : "Học sinh"}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 sm:px-3 sm:py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-xl transition duration-200 flex items-center space-x-1.5"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setCurrentView("login")}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 uppercase tracking-wide transition duration-200"
            >
              Đăng nhập khách
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
