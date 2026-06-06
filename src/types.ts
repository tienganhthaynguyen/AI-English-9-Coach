export interface ClassItem {
  class_id: string;
  class_name: string;
  student_count: number;
  avg_score: number;
  last_test: string;
  submission_rate: number;
}

export interface Student {
  student_id: string;
  full_name: string;
  class_id: string;
  class_name: string;
  target_score: number;
  grammar_weakness_map: Record<string, number>;
  email: string;
}

export interface Question {
  question_id: string;
  skill: string;
  question_type: string; // 'multiple_choice' | 'word_form' | 'rewrite_sentence'
  question_text: string;
  options?: Record<string, string>;
  correct_answer: string;
  acceptable_answers?: string[];
  explanation_vi: string;
  difficulty: "easy" | "medium" | "hard";
  grammar_point: string;
  error_type: string;
  score: number;
}

export interface Exam {
  exam_id: string;
  title: string;
  duration: number;
  total_questions: number;
  difficulty_level: string;
  created_by: string;
  created_at: string;
  question_ids: string[];
}

export interface Assignment {
  assignment_id: string;
  exam_id: string;
  class_id: string;
  class_name: string;
  start_date: string;
  due_date: string;
  status: "active" | "completed";
}

export interface GrammarErrorDetail {
  error_type: string;
  error_name_vi: string;
  frequency: number;
  explanation_vi: string;
  wrong_example: string;
  correct_example: string;
  advice: string;
}

export interface StudyDayPlan {
  day: number;
  focus: string;
  task: string;
}

export interface AIFeedback {
  overall_comment: string;
  score_analysis: string;
  strengths: string[];
  weaknesses: string[];
  major_grammar_errors?: GrammarErrorDetail[];
  seven_day_plan?: StudyDayPlan[];
  teacher_note?: string;
  parent_note?: string;
}

export interface Attempt {
  attempt_id: string;
  assignment_id: string;
  student_id: string;
  student_name: string;
  score: number;
  submitted_at: string;
  time_spent: number; // in seconds
  status: "graded" | "submitted";
  answers: Record<string, string>;
  ai_feedback: AIFeedback | null;
}
