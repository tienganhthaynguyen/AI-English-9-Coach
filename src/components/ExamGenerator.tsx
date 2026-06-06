import React, { useState } from "react";
import { Sparkles, ArrowLeft, ArrowRight, Settings, Command } from "lucide-react";
import { ClassItem, Question, Exam, Assignment } from "../types";

interface ExamGeneratorProps {
  classes: ClassItem[];
  questions: Question[];
  setQuestions: (qs: Question[]) => void;
  exams: Exam[];
  setExams: (exs: Exam[]) => void;
  assignments: Assignment[];
  setAssignments: (as: Assignment[]) => void;
  setCurrentView: (view: string) => void;
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
  currentUser: any;
}

export const ExamGenerator: React.FC<ExamGeneratorProps> = ({
  classes,
  questions,
  setQuestions,
  exams,
  setExams,
  assignments,
  setAssignments,
  setCurrentView,
  showToast,
  currentUser,
}) => {
  // Input states
  const [newExamTitle, setNewExamTitle] = useState("");
  const [newExamClass, setNewExamClass] = useState("C001");
  const [newExamDuration, setNewExamDuration] = useState(60);
  const [newExamDifficulty, setNewExamDifficulty] = useState("medium");
  const [selectedGrammarFocus, setSelectedGrammarFocus] = useState<string[]>([]);
  const [aiGeneratePrompt, setAiGeneratePrompt] = useState("");
  const [apiLoading, setApiLoading] = useState(false);

  const grammarOptions = [
    "Tenses", "Passive voice", "Reported speech", "Conditional sentences", 
    "Relative clauses", "Word forms", "Prepositions"
  ];

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim()) {
      showToast("Vui lòng nhập tên đề ôn tập để nhận diện bài làm!", "error");
      return;
    }

    setApiLoading(true);
    showToast("Đang kết nối AI sinh cấu trúc đề thi bám sát kỳ thi tuyển sinh 10...", "info");

    try {
      // Connect to genuine server-side API proxy route!
      const res = await fetch("/api/generate-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: aiGeneratePrompt,
          duration: newExamDuration,
          difficulty: newExamDifficulty,
          grammarPoints: selectedGrammarFocus,
        })
      });

      if (!res.ok) {
        throw new Error("Không thể kết nối đến máy chủ sinh đề.");
      }

      const payload = await res.json();
      if (payload.success && payload.questions && payload.questions.length > 0) {
        const aiQuestions: Question[] = payload.questions;

        // Register new questions in main questions data bank safely
        const updatedQuestions = [...questions];
        const newQuestionIds: string[] = [];

        aiQuestions.forEach((q) => {
          // Check for duplication
          if (!updatedQuestions.some(existing => existing.question_id === q.question_id)) {
            updatedQuestions.push(q);
          }
          newQuestionIds.push(q.question_id);
        });

        setQuestions(updatedQuestions);

        // Register new exam
        const newExamId = `E00${exams.length + 1}`;
        const newExam: Exam = {
          exam_id: newExamId,
          title: newExamTitle,
          duration: Number(newExamDuration),
          total_questions: newQuestionIds.length,
          difficulty_level: newExamDifficulty,
          created_by: currentUser?.name || currentUser?.full_name || "Thầy Tuấn",
          created_at: new Date().toISOString().split("T")[0],
          question_ids: newQuestionIds
        };

        setExams([...exams, newExam]);

        // Automatically assign topic to targeted managed classroom items
        const newAssignmentId = `A00${assignments.length + 1}`;
        const targetClass = classes.find(c => c.class_id === newExamClass);
        const newAssignment: Assignment = {
          assignment_id: newAssignmentId,
          exam_id: newExamId,
          class_id: newExamClass,
          class_name: targetClass ? targetClass.class_name : "9A1",
          start_date: new Date().toISOString().split("T")[0],
          due_date: "2026-06-30",
          status: "active"
        };

        setAssignments([newAssignment, ...assignments]);

        const engineSourceText = payload.offline 
          ? "đã tự động tối ưu hóa từ ngân hàng mẫu" 
          : "đã được sinh mới trực tiếp bằng trí tuệ nhân tạo Gemini";

        showToast(`Đề thi "${newExamTitle}" ${engineSourceText} và đã giao cho lớp ${newAssignment.class_name}!`, "success");
        setCurrentView("teacher-dashboard");
      } else {
        throw new Error("Dữ liệu câu hỏi trả về từ máy chủ không hợp lệ.");
      }

    } catch (error: any) {
      console.error(error);
      showToast(`Có lỗi xảy ra khi tạo đề: ${error.message}`, "error");
    } finally {
      setApiLoading(false);
    }
  };

  const toggleGrammarTag = (tag: string) => {
    if (selectedGrammarFocus.includes(tag)) {
      setSelectedGrammarFocus(selectedGrammarFocus.filter(t => t !== tag));
    } else {
      setSelectedGrammarFocus([...selectedGrammarFocus, tag]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
      
      {/* Description header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <Command className="h-6 w-6 text-indigo-600 animate-pulse" />
          <span>Thiết Kế Đề Luyện Vào Khối 10</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Lên cấu hình mẫu đề khảo thí, lựa chọn khối giao nộp và tự động sinh câu hỏi thông minh.
        </p>
      </div>

      <form onSubmit={handleCreateExam} className="space-y-6">
        
        {/* Row 1: Title and Target Class */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700">Tên đề thi thử</label>
            <input 
              type="text" 
              value={newExamTitle}
              onChange={(e) => setNewExamTitle(e.target.value)}
              placeholder="VD: Đề thi thử chuyên đề Reported Speech..."
              className="w-full px-4 py-3 rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium bg-white"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700">Lớp được giao bài luôn</label>
            <select 
              value={newExamClass}
              onChange={(e) => setNewExamClass(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold bg-white"
            >
              {classes.map(cl => (
                <option key={cl.class_id} value={cl.class_id}>Lớp {cl.class_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Duration, Difficulty, Structure */}
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700">Thời gian làm bài</label>
            <select 
              value={newExamDuration}
              onChange={(e) => setNewExamDuration(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold bg-white"
            >
              <option value={45}>45 Phút</option>
              <option value={60}>60 Phút (Mặc định)</option>
              <option value={90}>90 Phút</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700">Mức độ thử thách</label>
            <select 
              value={newExamDifficulty}
              onChange={(e) => setNewExamDifficulty(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold bg-white"
            >
              <option value="easy">Cơ bản (Easy)</option>
              <option value="medium">Độ phân hóa khá (Medium)</option>
              <option value="hard">Bồi dưỡng thi Chuyên (Hard)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700">Phân bố khảo thí mẫu</label>
            <select className="w-full px-4 py-3 rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold bg-white">
              <option>Chuẩn Sở GD-ĐT Hà Nội</option>
              <option>Chuẩn Sở GD-ĐT TP.HCM</option>
              <option>4 Câu trắc nghiệm + 4 tự luận</option>
            </select>
          </div>
        </div>

        {/* Tags Selection Block */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-700 block">
            Chọn các chuyên đề ngữ pháp mong muốn (Ủy thác AI lọc chuẩn):
          </label>
          <div className="flex flex-wrap gap-2">
            {grammarOptions.map(opt => {
              const isSelected = selectedGrammarFocus.includes(opt);
              return (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => toggleGrammarTag(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition duration-150 ${
                    isSelected 
                      ? "bg-indigo-600 text-white border-indigo-600" 
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI helper prompt textbox */}
        <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4.5 w-4.5 text-indigo-600 animate-bounce" />
            <span className="text-indigo-950 font-extrabold text-xs sm:text-sm">Trợ lý AI thiết kế câu hỏi bồi dưỡng</span>
          </div>

          <textarea 
            value={aiGeneratePrompt}
            onChange={(e) => setAiGeneratePrompt(e.target.value)}
            placeholder="Ví dụ: Tạo cho tôi đề 4 câu bám cực sát vào dạng câu ước wish cho lớp 9; thêm phần viết tự luận có câu mẫu 'This school is built...'."
            className="w-full p-4 text-xs sm:text-sm rounded-xl border border-indigo-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white leading-relaxed font-medium text-slate-705"
            rows={3}
            disabled={apiLoading}
          />
          <p className="text-[10px] text-indigo-400 font-semibold leading-normal">
            Hệ thống AI sẽ rà soát ngân hàng câu hỏi thực tiễn và sinh câu hỏi mới đạt chuẩn với đáp án và lời giải giải thích chi tiết nhất.
          </p>
        </div>

        {/* Actions triggering submit options */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => setCurrentView("teacher-dashboard")}
            className="px-5 py-3 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition flex items-center space-x-1"
            disabled={apiLoading}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </button>

          <button 
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 font-extrabold text-white text-xs sm:text-sm rounded-xl tracking-wide uppercase shadow-lg shadow-indigo-100 transition flex items-center space-x-1.5"
            disabled={apiLoading}
          >
            {apiLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>AI Đang Thiết kế...</span>
              </>
            ) : (
              <>
                <span>Sinh đề & Giao đề lập tức</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
