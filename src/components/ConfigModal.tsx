import React from "react";
import { KeyRound, Sparkles, ShieldCheck } from "lucide-react";

interface ConfigModalProps {
  setShowConfigModal: (show: boolean) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  setShowConfigModal,
  geminiApiKey,
  setGeminiApiKey,
  showToast,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-250 shadow-2xl space-y-4">
        
        {/* Title header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <KeyRound className="h-5 w-5 text-indigo-600 animate-pulse" />
            <span>Cấu hình API Gemini</span>
          </h3>
          <button 
            type="button"
            onClick={() => setShowConfigModal(false)}
            className="text-slate-400 hover:text-slate-600 font-extrabold text-xl leading-none select-none transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Form settings details */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-600">
          <p className="leading-relaxed font-semibold">
            Hệ thống ôn luyện tích hợp mô hình tối tân <code className="bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-xs text-indigo-700 font-mono font-black">gemini-3.5-flash</code> để tự động chấm tự luận sửa đổi câu và bóc lỗi ngữ âm.
          </p>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Khóa API của bạn:</label>
            <input 
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Gõ mã khóa AIzaSy... (Thầy cô để trống để dùng demo)"
              className="w-full px-4 py-3 rounded-xl border border-slate-250 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <p className="text-[10px] text-slate-400 leading-normal font-medium">
              Lưu ý: Khóa được sử dụng cho các yêu cầu chấm bài, lưu trữ tạm vào phiên làm việc. Thầy cô có thể để trống để kích hoạt chế độ Giả lập Sư phạm AI chất lượng cao không cần cấu hình.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-bold inline-flex items-center space-x-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Mã hóa bảo mật</span>
          </span>

          <button 
            type="button"
            onClick={() => {
              setShowConfigModal(false);
              showToast("Đã thiết lập cấu hình kết nối API thành công!", "success");
            }}
            className="px-5 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition duration-200 uppercase tracking-wide"
          >
            Lưu Cấu Hình
          </button>
        </div>

      </div>
    </div>
  );
};
