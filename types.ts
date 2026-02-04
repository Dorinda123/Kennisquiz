export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export enum QuizState {
  START,
  PLAYING,
  FINISHED,
}