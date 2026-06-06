import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { LandingView } from "./components/LandingView";
import { LoginView } from "./components/LoginView";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { StudentDashboard } from "./components/StudentDashboard";
import { TestRoom } from "./components/TestRoom";
import { ResultView } from "./components/ResultView";
import { GrammarMap } from "./components/GrammarMap";
import { PracticeRoom } from "./components/PracticeRoom";
import { TeacherClassReport } from "./components/TeacherClassReport";
import { ExamGenerator } from "./components/ExamGenerator";
import { QuestionBank } from "./components/QuestionBank";
import { ConfigModal } from "./components/ConfigModal";

import { ClassItem, Student, Question, Exam, Assignment, Attempt } from "./types";
import {
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_QUESTIONS,
  INITIAL_EXAMS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ATTEMPTS,
} from "./data/initialData";

export default function App() {
  // Global View Roles state logic
  const [role, setRole] = useState<string>("guest"); // 'guest' | 'teacher' | 'student'
  const [currentView, setCurrentView] = useState<string>("landing"); 
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Database core state
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [attempts, setAttempts] = useState<Attempt[]>(INITIAL_ATTEMPTS);

  // Api configurations state logic
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Taker test states
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [testTimeRemaining, setTestTimeRemaining] = useState<number>(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timerIntervalId, setTimerIntervalId] = useState<any>(null);

  // Selected details
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [selectedClassReport, setSelectedClassReport] = useState<ClassItem | null>(null);
  const [activePracticeTask, setActivePracticeTask] = useState<any>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceGraded, setPracticeGraded] = useState<boolean>(false);

  // Toast notifications indicators
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "info" | "error" }>({
    show: false, message: "", type: "success"
  });

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  // Profile Login selectors
  const handleQuickLogin = (roleType: "teacher" | "student") => {
    if (roleType === "teacher") {
      setCurrentUser({ id: "T01", name: "Thầy Tuấn Anh", email: "tuananh.nguyen@edu.vn", school: "THCS Giảng Võ, Hà Nội" });
      setRole("teacher");
      setCurrentView("teacher-dashboard");
      showToast("Đăng nhập thành công với tư cách Giáo viên!", "success");
    } else if (roleType === "student") {
      const targetStudent = students.find(s => s.student_id === "S01");
      setCurrentUser(targetStudent || students[0]);
      setRole("student");
      setCurrentView("student-dashboard");
      showToast("Đăng nhập thành công với tư cách Học sinh!", "success");
    }
  };

  const handleLogout = () => {
    setRole("guest");
    setCurrentUser(null);
    setCurrentView("landing");
    showToast("Đã đăng xuất tài khoản an toàn.", "info");
  };

  // Server-side AI Grading invocation
  const handleGradeWithAI = async (attemptId: string) => {
    const attemptObj = attempts.find(a => a.attempt_id === attemptId);
    if (!attemptObj) return;

    setApiLoading(true);
    showToast("Đang gửi bài làm tự luận lên máy chủ AI để phân loại lỗi sai...", "info");

    const targetedExam = exams.find(e => e.exam_id === questions.find(q => q.question_id === Object.keys(attemptObj.answers)[0])?.question_id) || exams[0];
    const examQuestions = questions.filter(q => targetedExam?.question_ids.includes(q.question_id));

    // Compile written questions for analysis
    const studentWrittenAnswers: any[] = [];
    examQuestions.forEach(q => {
      if (q.question_type === "rewrite_sentence" || q.question_type === "word_form") {
        studentWrittenAnswers.push({
          question_id: q.question_id,
          question_text: q.question_text,
          correct_answer: q.correct_answer,
          student_answer: attemptObj.answers[q.question_id] || "",
          score_weight: q.score,
          grammar_point: q.grammar_point,
          error_type: q.error_type
        });
      }
    });

    try {
      // Connect to genuine server-side proxy endpoint!
      const res = await fetch("/api/grade-with-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentName: attemptObj.student_name,
          score: attemptObj.score,
          studentWrittenAnswers
        })
      });

      if (!res.ok) {
        throw new Error("Không phản hồi hoàn tất từ máy chủ AI chấm bài.");
      }

      const payload = await res.json();
      if (payload.success && payload.data) {
        const aiGradingData = payload.data;

        const updatedAttempts = attempts.map(att => {
          if (att.attempt_id === attemptId) {
            return { ...att, ai_feedback: aiGradingData, status: "graded" as const };
          }
          return att;
        });

        setAttempts(updatedAttempts);

        // Safely update active state detail
        const currentAttemptUpdate = updatedAttempts.find(att => att.attempt_id === attemptId);
        if (currentAttemptUpdate) {
          setSelectedAttempt(currentAttemptUpdate);
        }

        // Dynamically adjust student's mastery profile index based on AI outcomes
        if (aiGradingData.major_grammar_errors && aiGradingData.major_grammar_errors.length > 0) {
          const updatedStudents = students.map(st => {
            if (st.student_id === attemptObj.student_id) {
              const adjustedScores = { ...st.grammar_weakness_map };
              aiGradingData.major_grammar_errors.forEach((errObj: any) => {
                const mapKey = errObj.error_type;
                if (adjustedScores[mapKey] !== undefined) {
                  adjustedScores[mapKey] = Math.max(15, adjustedScores[mapKey] - 12);
                }
              });
              return { ...st, grammar_weakness_map: adjustedScores };
            }
            return st;
          });
          setStudents(updatedStudents);

          // Update logged in user profile mapping
          const updatedSelf = updatedStudents.find(s => s.student_id === currentUser?.student_id);
          if (updatedSelf) {
            setCurrentUser(updatedSelf);
          }
        }

        showToast("Đã bóc tách lỗi sai ngữ pháp thành công từ AI Coach!", "success");
      } else {
        throw new Error("Dữ liệu phản hồi lỗi cấu trúc từ máy chủ AI.");
      }
    } catch (err: any) {
      console.error(err);
      showToast(`Không kết tinh được phản hồi: ${err.message}`, "error");
    } finally {
      setApiLoading(false);
    }
  };

  // Start exam trigger
  const handleStartExam = (assignmentId: string) => {
    const assignmentObj = assignments.find(a => a.assignment_id === assignmentId);
    if (!assignmentObj) return;

    const examObj = exams.find(e => e.exam_id === assignmentObj.exam_id);
    if (!examObj) return;

    setActiveAssignment(assignmentObj);
    setActiveExam(examObj);
    setStudentAnswers({});
    setFlaggedQuestions({});
    setTestTimeRemaining(examObj.duration * 60);

    setCurrentView("student-test-room");
    showToast(`Đã nhận đề "${examObj.title}". Chúc em làm bài thật tập trung!`, "info");
  };

  // Exam Countdown Timing effect
  useEffect(() => {
    if (currentView === "student-test-room" && testTimeRemaining > 0) {
      const interval = setInterval(() => {
        setTestTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // Trigger automatic submit when clock runs out
            submitExamLogic();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerIntervalId(interval);
      return () => clearInterval(interval);
    }
  }, [currentView, testTimeRemaining]);

  // Answer handler
  const handleAnswerChange = (questionId: string, value: string) => {
    setStudentAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Flag bookmark helper
  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Handle manual submit dialog
  const handleSubmitExamClick = () => {
    if (!activeExam) return;
    const unansweredCount = activeExam.question_ids.filter(id => !studentAnswers[id]).length;
    
    if (unansweredCount > 0) {
      if (window.confirm(`Em còn ${unansweredCount} câu hỏi bỏ trống chưa ghi đáp án. Em vẫn muốn kết thúc nộp bài chứ?`)) {
        submitExamLogic();
      }
    } else {
      if (window.confirm("Bản ghi sẽ được nộp để chấm điểm và phân tích lỗ hổng. Em đồng ý nộp bài chứ?")) {
        submitExamLogic();
      }
    }
  };

  // Actual submit calculations
  const submitExamLogic = () => {
    if (timerIntervalId) clearInterval(timerIntervalId);
    if (!activeExam || !activeAssignment) return;

    let earnedPoints = 0;
    const examQuestions = questions.filter(q => activeExam.question_ids.includes(q.question_id));

    examQuestions.forEach(q => {
      const studentInput = (studentAnswers[q.question_id] || "").trim().toLowerCase();
      const correctAns = q.correct_answer.trim().toLowerCase();

      if (q.question_type === "multiple_choice") {
        if (studentInput === correctAns) {
          earnedPoints += q.score;
        }
      } else if (q.question_type === "word_form") {
        if (studentInput === correctAns) {
          earnedPoints += q.score;
        }
      } else if (q.question_type === "rewrite_sentence") {
        const matchesAcceptable = q.acceptable_answers?.some(
          ans => ans.trim().toLowerCase() === studentInput
        );
        if (studentInput === correctAns || matchesAcceptable) {
          earnedPoints += q.score;
        }
      }
    });

    const newAttemptId = `AT0${attempts.length + 1}`;
    const newAttempt: Attempt = {
      attempt_id: newAttemptId,
      assignment_id: activeAssignment.assignment_id,
      student_id: currentUser?.student_id || "S01",
      student_name: currentUser?.full_name || "Nguyễn Minh Anh",
      score: Number(earnedPoints.toFixed(2)),
      submitted_at: new Date().toLocaleString("vi-VN"),
      time_spent: activeExam.duration * 60 - testTimeRemaining,
      status: "submitted",
      answers: studentAnswers,
      ai_feedback: null
    };

    const updatedAttempts = [newAttempt, ...attempts];
    setAttempts(updatedAttempts);

    // Swap view immediately
    setSelectedAttempt(newAttempt);
    setCurrentView("student-result");
    showToast("Nộp bài thi thành công! AI Coach đang tiếp quản...", "success");

    // Seamless instant automatic evaluation call triggers for better UX!
    setTimeout(() => {
      handleGradeWithAI(newAttemptId);
    }, 1200);
  };

  // Practice generation helper
  const handleGeneratePractice = (grammarPoint: string) => {
    let practiceQs = [];
    if (grammarPoint === "PASSIVE") {
      practiceQs = [
        { id: 1, text: "The grand high school entrance test _______ by all candidates next week. (take)", correct: "will be taken" },
        { id: 2, text: "Active: She cleans the computer room everyday. -> Passive: The computer room _______ by her everyday.", correct: "is cleaned" }
      ];
    } else if (grammarPoint === "WORD_FORM") {
      practiceQs = [
        { id: 1, text: "She answered all the difficult questions _______ and won the scholarship. (SUCCESS)", correct: "successfully" },
        { id: 2, text: "The English mock test was _______ easy, making him pass standard target safely. (SURPRISE)", correct: "surprisingly" }
      ];
    } else {
      practiceQs = [
        { id: 1, text: "They are very interested _______ practicing grammar with the AI Exam Coach. (in/on/at)", correct: "in" },
        { id: 2, text: "Getting top results is highly dependent _______ daily focused consistency. (on/off/for)", correct: "on" }
      ];
    }

    setActivePracticeTask({
      title: `Chuyên đề rèn luyện bổ trợ: ${grammarPoint}`,
      point: grammarPoint,
      questions: practiceQs
    });
    setPracticeAnswers({});
    setPracticeGraded(false);
    setCurrentView("personalized-practice");
  };

  const handlePracticeSubmit = () => {
    setPracticeGraded(true);
    showToast("Chúc mừng em đã nộp bài tập củng cố chuyên sâu!", "success");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased selection:bg-indigo-600 selection:text-white">
      
      {/* HEADER NAVBAR CONTAINER */}
      <Header 
        role={role}
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        handleLogout={handleLogout}
        setShowConfigModal={setShowConfigModal}
      />

      {/* Dynamic Slide Toaster Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center p-4 rounded-2xl shadow-xl border text-xs sm:text-sm max-w-sm transition-all duration-300 transform translate-y-0 ${
          toast.type === "error" ? "bg-red-50 text-red-800 border-red-200" :
          toast.type === "info" ? "bg-indigo-50 text-indigo-800 border-indigo-200" :
          "bg-emerald-50 text-emerald-800 border-emerald-255"
        }`}>
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-white border">
              {toast.type === "error" ? "LỖI" : toast.type === "info" ? "TIN" : "OK"}
            </span>
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* PRINCIPAL DELEGATED VIEW CONTAINER */}
      <main className="flex-grow py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Landing Page */}
        {currentView === "landing" && (
          <LandingView handleQuickLogin={handleQuickLogin} />
        )}

        {/* Login selection board */}
        {currentView === "login" && (
          <LoginView handleQuickLogin={handleQuickLogin} />
        )}

        {/* Teacher Home Dashboard */}
        {role === "teacher" && currentView === "teacher-dashboard" && (
          <TeacherDashboard 
            classes={classes}
            examsCount={exams.length}
            setCurrentView={setCurrentView}
            setSelectedClassReport={setSelectedClassReport}
            handleGeneratePractice={handleGeneratePractice}
          />
        )}

        {/* Student Home Learning Workspace */}
        {role === "student" && currentView === "student-dashboard" && (
          <StudentDashboard 
            currentUser={currentUser}
            assignments={assignments}
            attempts={attempts}
            exams={exams}
            handleStartExam={handleStartExam}
            setSelectedAttempt={setSelectedAttempt}
            setCurrentView={setCurrentView}
            handleGeneratePractice={handleGeneratePractice}
          />
        )}

        {/* Online Answering Testroom Workspace */}
        {currentView === "student-test-room" && activeExam && (
          <TestRoom 
            activeExam={activeExam}
            questions={questions}
            studentAnswers={studentAnswers}
            testTimeRemaining={testTimeRemaining}
            flaggedQuestions={flaggedQuestions}
            handleAnswerChange={handleAnswerChange}
            toggleFlagQuestion={toggleFlagQuestion}
            handleSubmitExamClick={handleSubmitExamClick}
          />
        )}

        {/* Dynamic Exam Result analysis details */}
        {currentView === "student-result" && selectedAttempt && (
          <ResultView 
            selectedAttempt={selectedAttempt}
            exams={exams}
            questions={questions}
            apiLoading={apiLoading}
            handleGradeWithAI={handleGradeWithAI}
            setCurrentView={setCurrentView}
            role={role}
          />
        )}

        {/* Interactive Grammar proficiency visual mapping map */}
        {currentView === "student-grammar-report" && currentUser && (
          <GrammarMap 
            currentUser={currentUser}
            handleGeneratePractice={handleGeneratePractice}
          />
        )}

        {/* AI Supplementary Remedial exercises workspace */}
        {currentView === "personalized-practice" && activePracticeTask && (
          <PracticeRoom 
            activePracticeTask={activePracticeTask}
            practiceAnswers={practiceAnswers}
            setPracticeAnswers={setPracticeAnswers}
            practiceGraded={practiceGraded}
            handlePracticeSubmit={handlePracticeSubmit}
            setCurrentView={setCurrentView}
          />
        )}

        {/* Teacher managed classroom score profiles */}
        {currentView === "teacher-class-report" && selectedClassReport && (
          <TeacherClassReport 
            selectedClassReport={selectedClassReport}
            students={students}
            attempts={attempts}
            setSelectedAttempt={setSelectedAttempt}
            setCurrentView={setCurrentView}
            showToast={showToast}
          />
        )}

        {/* Custom Exam Generator setup */}
        {currentView === "exam-generator" && (
          <ExamGenerator 
            classes={classes}
            questions={questions}
            setQuestions={setQuestions}
            exams={exams}
            setExams={setExams}
            assignments={assignments}
            setAssignments={setAssignments}
            setCurrentView={setCurrentView}
            showToast={showToast}
            currentUser={currentUser}
          />
        )}

        {/* Categorised questions list library */}
        {currentView === "question-bank" && (
          <QuestionBank 
            questions={questions}
            showToast={showToast}
          />
        )}

      </main>

      {/* FOOTER & ACCREDITATION BRAND */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 mt-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 select-none">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-base">
                AI
              </div>
              <div>
                <h4 className="text-sm font-black text-white leading-none tracking-tight">AI English 9</h4>
                <span className="text-[10px] text-indigo-400 font-bold tracking-wider uppercase">Exam Coach</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Hệ thống bồi dưỡng, bóc tách lỗi sai ngữ âm và dạng thức viết lại câu bám sát cấu trúc vào trung học phổ thông. Powered by Gemini 3.5 Flash.
            </p>
          </div>

          <div className="space-y-3.5">
            <h5 className="text-xs font-black text-white uppercase tracking-wider">Chuyên đề bồi dưỡng trọng điểm</h5>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">Thì tiếng Anh</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">Thể bị động</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">Biến đổi từ loại</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">Câu gián tiếp</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">Câu ước wish</span>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-black text-white uppercase tracking-wider">Hợp tác & Liên kết THCS</h5>
            <p className="text-xs leading-relaxed font-semibold text-slate-400">
              Công ty giải pháp công nghệ giáo dục EdTech và Phát triển Sư phạm Quốc tế Việt Nam.
            </p>
            <p className="text-xs font-black text-indigo-400 tracking-wide font-sans">
              Email hỗ trợ: support.coach@aienglish9.edu.vn
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-850 text-center text-[11px] text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} AI English 9 Exam Coach. Bảo lưu toàn bộ bản quyền trí tuệ EdTech Vietnam.</p>
        </div>
      </footer>

      {/* GEMINI CONFIGURATOR ACCESS KEY MODAL PANEL */}
      {showConfigModal && (
        <ConfigModal 
          setShowConfigModal={setShowConfigModal}
          geminiApiKey={geminiApiKey}
          setGeminiApiKey={setGeminiApiKey}
          showToast={showToast}
        />
      )}

    </div>
  );
}
