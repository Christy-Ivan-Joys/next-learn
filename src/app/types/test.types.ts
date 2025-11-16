export interface OptionType {
    id: number;
    option: string;
    image?: string | null;
    is_correct?: boolean;
  }
  
  export interface QuestionType {
    question_id: number;
    number: number;
    question: string;
    comprehension?: string | null;
    image?: string | null;
    options: OptionType[];
  }
  
  export interface ExamResponseType {
    success: boolean;
    questions_count: number;
    total_marks: number;
    total_time: number;
    time_for_each_question: number;
    mark_per_each_answer: number;
    instruction: string;
    questions: QuestionType[];
  }