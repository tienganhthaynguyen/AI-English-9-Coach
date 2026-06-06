import { ClassItem, Student, Question, Exam, Assignment, Attempt } from "../types";

export const INITIAL_CLASSES: ClassItem[] = [
  { class_id: 'C001', class_name: '9A1', student_count: 5, avg_score: 7.8, last_test: 'Đề thi thử vào 10 - Đợt 1', submission_rate: 100 },
  { class_id: 'C002', class_name: '9A2', student_count: 4, avg_score: 5.6, last_test: 'Đề kiểm tra Chuyên đề Bị động', submission_rate: 75 }
];

export const INITIAL_STUDENTS: Student[] = [
  { student_id: 'S01', full_name: 'Nguyễn Minh Anh', class_id: 'C001', class_name: '9A1', target_score: 9.0, grammar_weakness_map: { 'TENSE': 85, 'SVA': 90, 'PASSIVE': 45, 'WORD_FORM': 50, 'PREPOSITION': 70, 'REPORTED': 60 }, email: 'minhanh@gmail.com' },
  { student_id: 'S02', full_name: 'Trần Quốc Bảo', class_id: 'C001', class_name: '9A1', target_score: 8.5, grammar_weakness_map: { 'TENSE': 75, 'SVA': 80, 'PASSIVE': 85, 'WORD_FORM': 40, 'PREPOSITION': 55, 'REPORTED': 75 }, email: 'quocbao@gmail.com' },
  { student_id: 'S03', full_name: 'Lê Mỹ Duyên', class_id: 'C001', class_name: '9A1', target_score: 9.5, grammar_weakness_map: { 'TENSE': 95, 'SVA': 95, 'PASSIVE': 90, 'WORD_FORM': 80, 'PREPOSITION': 85, 'REPORTED': 90 }, email: 'myduyen@gmail.com' },
  { student_id: 'S04', full_name: 'Phạm Hoàng Nam', class_id: 'C002', class_name: '9A2', target_score: 7.0, grammar_weakness_map: { 'TENSE': 60, 'SVA': 55, 'PASSIVE': 30, 'WORD_FORM': 35, 'PREPOSITION': 40, 'REPORTED': 25 }, email: 'hoangnam@gmail.com' },
  { student_id: 'S05', full_name: 'Vũ Thùy Chi', class_id: 'C002', class_name: '9A2', target_score: 8.0, grammar_weakness_map: { 'TENSE': 70, 'SVA': 65, 'PASSIVE': 55, 'WORD_FORM': 60, 'PREPOSITION': 50, 'REPORTED': 45 }, email: 'thuychi@gmail.com' }
];

export const INITIAL_QUESTIONS: Question[] = [
  // Pronunciation
  {
    question_id: 'Q001',
    skill: 'pronunciation',
    question_type: 'multiple_choice',
    question_text: 'Choose the word whose underlined part is pronounced differently from that of the others.',
    options: { A: 'decided', B: 'worked', C: 'started', D: 'needed' },
    correct_answer: 'B',
    explanation_vi: "Đuôi '-ed' ở từ 'worked' được phát âm là /t/ vì từ kết thúc bằng âm vô thanh /k/. Các từ còn lại đuôi '-ed' phát âm là /ɪd/ vì kết thúc bằng /t/ hoặc /d/.",
    difficulty: 'easy',
    grammar_point: 'Pronunciation of -ed',
    error_type: 'PRONUNCIATION',
    score: 0.25
  },
  {
    question_id: 'Q002',
    skill: 'pronunciation',
    question_type: 'multiple_choice',
    question_text: 'Choose the word that has a different stress pattern from that of the others.',
    options: { A: 'important', B: 'beautiful', C: 'excellent', D: 'careful' },
    correct_answer: 'A',
    explanation_vi: "'important' có trọng âm rơi vào âm tiết thứ 2. Ba từ còn lại trọng âm rơi vào âm tiết thứ nhất.",
    difficulty: 'medium',
    grammar_point: 'Word Stress',
    error_type: 'PRONUNCIATION',
    score: 0.25
  },
  // Grammar - Passive voice
  {
    question_id: 'Q003',
    skill: 'grammar',
    question_type: 'multiple_choice',
    question_text: 'The new bridge _______ by local workers next month.',
    options: { A: 'will build', B: 'is built', C: 'will be built', D: 'was built' },
    correct_answer: 'C',
    explanation_vi: "Trạng từ thời gian 'next month' chỉ tương lai đơn. Chủ ngữ 'The new bridge' (Cây cầu mới) chỉ vật chịu tác động nên dùng cấu trúc bị động tương lai đơn: will be + V3/ed.",
    difficulty: 'medium',
    grammar_point: 'Passive voice',
    error_type: 'PASSIVE',
    score: 0.25
  },
  // Grammar - Reported Speech
  {
    question_id: 'Q004',
    skill: 'grammar',
    question_type: 'multiple_choice',
    question_text: 'Lan said that she _______ English then.',
    options: { A: 'is studying', B: 'was studying', C: 'studied', D: 'studies' },
    correct_answer: 'B',
    explanation_vi: "Trong câu gián tiếp có từ chỉ thời gian 'then' (biến đổi từ 'now' trong câu trực tiếp), động từ cần lùi thì từ Hiện tại tiếp diễn thành Quá khứ tiếp diễn (was/were + V-ing). Lan là ngôi thứ 3 số ít nên dùng 'was studying'.",
    difficulty: 'medium',
    grammar_point: 'Reported speech',
    error_type: 'REPORTED',
    score: 0.25
  },
  // Vocabulary - Collocation
  {
    question_id: 'Q005',
    skill: 'vocabulary',
    question_type: 'multiple_choice',
    question_text: 'Every morning, My father always _______ homework with me to make sure I understand the lesson.',
    options: { A: 'makes', B: 'does', C: 'takes', D: 'gives' },
    correct_answer: 'B',
    explanation_vi: "Ta có cụm từ cố định (collocation): 'do homework' (làm bài tập về nhà), không dùng 'make homework'.",
    difficulty: 'easy',
    grammar_point: 'Collocations',
    error_type: 'COLLOCATION',
    score: 0.25
  },
  // Word Form
  {
    question_id: 'Q006',
    skill: 'grammar',
    question_type: 'word_form',
    question_text: 'We must learn to use water _______ so that we can save it for the future. (ECONOMY)',
    correct_answer: 'economically',
    explanation_vi: "Chỗ trống đứng sau động từ thường 'use' và tân ngữ 'water' để bổ nghĩa cho động từ nên ta cần một trạng từ (adverb). Dạng trạng từ của 'economy' là 'economically' (một cách tiết kiệm).",
    difficulty: 'hard',
    grammar_point: 'Word forms',
    error_type: 'WORD_FORM',
    score: 0.25
  },
  // Sentence Transformation 1
  {
    question_id: 'Q007',
    skill: 'writing',
    question_type: 'rewrite_sentence',
    question_text: 'They built this school in 2010.\n-> This school ___________________________________.',
    correct_answer: 'This school was built in 2010.',
    acceptable_answers: ['This school was built in 2010 by them', 'This school was built by them in 2010'],
    explanation_vi: "Chuyển từ câu chủ động sang bị động thì Quá khứ đơn: S + was/were + V3/ed. Chủ ngữ mới là 'This school' số ít nên dùng 'was built'. Phần 'by them' có thể bỏ qua.",
    difficulty: 'medium',
    grammar_point: 'Passive voice',
    error_type: 'PASSIVE',
    score: 0.5
  },
  // Sentence Transformation 2
  {
    question_id: 'Q008',
    skill: 'writing',
    question_type: 'rewrite_sentence',
    question_text: '"I am going to visit Hanoi tomorrow," Nam said.\n-> Nam said ___________________________________.',
    correct_answer: 'Nam said he was going to visit Hanoi the following day.',
    acceptable_answers: [
      'Nam said he was going to visit Hanoi the next day.',
      'Nam said that he was going to visit Hanoi the following day.',
      'Nam said that he was going to visit Hanoi the next day.'
    ],
    explanation_vi: "Chuyển đổi câu gián tiếp: Thay đổi đại từ 'I' thành 'he', lùi thì động từ 'am going to' thành 'was going to', và đổi trạng từ chỉ thời gian 'tomorrow' thành 'the following day' hoặc 'the next day'. Nam là ngôi thứ nhất trong câu trực tiếp chuyển thành ngôi thứ ba số ít.",
    difficulty: 'hard',
    grammar_point: 'Reported speech',
    error_type: 'REPORTED',
    score: 0.5
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    exam_id: 'E001',
    title: 'Đề Ôn Luyện Tuyển Sinh 10 - Chuyên Đề Trọng Tâm 01',
    duration: 60,
    total_questions: 8,
    difficulty_level: 'medium',
    created_by: 'Teacher Tuan',
    created_at: '2026-06-01',
    question_ids: ['Q001', 'Q002', 'Q003', 'Q004', 'Q005', 'Q006', 'Q007', 'Q008']
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    assignment_id: 'A001',
    exam_id: 'E001',
    class_id: 'C001',
    class_name: '9A1',
    start_date: '2026-06-01',
    due_date: '2026-06-15',
    status: 'active'
  }
];

export const INITIAL_ATTEMPTS: Attempt[] = [
  {
    attempt_id: 'AT01',
    assignment_id: 'A001',
    student_id: 'S01',
    student_name: 'Nguyễn Minh Anh',
    score: 9.0,
    submitted_at: '2026-06-02 14:30',
    time_spent: 2400, // 40 mins
    status: 'graded',
    answers: {
      'Q001': 'B', // Correct
      'Q002': 'A', // Correct
      'Q003': 'C', // Correct
      'Q004': 'B', // Correct
      'Q005': 'B', // Correct
      'Q006': 'economically', // Correct
      'Q007': 'This school was built in 2010.', // Correct (0.5 pts)
      'Q008': 'Nam said he is going to visit Hanoi tomorrow.' // Incorrect lùi thì & trạng ngữ (0 pts)
    },
    ai_feedback: {
      overall_comment: "Em học rất khá, nắm chắc các phần ngữ âm và trắc nghiệm ngữ pháp cơ bản. Tuy nhiên phần viết lại câu gián tiếp em còn chưa vững do quên không lùi thì và đổi trạng ngữ.",
      score_analysis: "Đạt 9.0/10 điểm. Hoàn thành bài tốt nhưng cần lưu ý phần tự luận.",
      strengths: ["Phát âm và trọng âm cực tốt", "Trắc nghiệm từ vựng, giới từ và bị động vững vàng"],
      weaknesses: ["Chưa nắm vững quy tắc chuyển đổi câu gián tiếp (Reported Speech)"],
      major_grammar_errors: [
        {
          error_type: "REPORTED",
          error_name_vi: "Lỗi câu tường thuật / câu gián tiếp",
          frequency: 1,
          explanation_vi: "Khi chuyển câu trực tiếp sang gián tiếp, em quên chưa lùi thì động từ 'am' -> 'was' và chưa chuyển trạng ngữ chỉ thời gian 'tomorrow' -> 'the following day' hoặc 'the next day'.",
          wrong_example: "Nam said he is going to visit Hanoi tomorrow.",
          correct_example: "Nam said he was going to visit Hanoi the following day.",
          advice: "Hãy học thuộc bảng quy tắc lùi thì và bảng đổi trạng từ chỉ thời gian trong câu gián tiếp."
        }
      ],
      seven_day_plan: [
        { day: 1, focus: "Lý thuyết câu gián tiếp", task: "Xem lại video/ghi chép về quy tắc lùi thì và đổi trạng từ. Làm 10 câu trắc nghiệm đổi thì." },
        { day: 2, focus: "Chuyển đổi câu kể gián tiếp", task: "Luyện tập viết lại 15 câu kể từ trực tiếp sang gián tiếp." },
        { day: 3, focus: "Câu hỏi trong gián tiếp (Yes/No & Wh-)", task: "Học công thức ask + if/whether và làm 10 câu áp dụng." },
        { day: 4, focus: "Câu mệnh lệnh gián tiếp", task: "Ôn tập cấu trúc 'told/asked someone to do something'." },
        { day: 5, focus: "Luyện tập tổng hợp câu tường thuật", task: "Làm mini-test 20 câu chuyên đề Reported Speech." },
        { day: 6, focus: "Ôn tập Câu bị động khó", task: "Nhắc lại kiến thức Passive voice lớp 9." },
        { day: 7, focus: "Làm thử đề tổng hợp", task: "Làm bài kiểm tra ngắn 15 phút tổng hợp kiến thức ngữ pháp." }
      ]
    }
  }
];
