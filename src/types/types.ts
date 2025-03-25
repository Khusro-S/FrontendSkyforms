export interface FileData {
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Option {
  optionText: string;
}
export enum QuestionType {
  RADIO = "radio",
  CHECKBOX = "checkbox",
  SHORT_ANSWER = "shortAnswer",
  LONG_ANSWER = "longAnswer",
  FILE_UPLOAD = "fileUpload",
  DATE = "date",
  PHONE_NUMBER = "phoneNumber",
}
export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  questionTypeSelect: string;
  options?: Option[];
  selectedOptions?: string[];
  shortAnswer?: string;
  longAnswer?: string;
  date?: string;
  phoneNumber?: number | null;
  file?: FileData;
  open: boolean;
  required: boolean;
}
export interface User {
  id: string;
  email: string;
  token: string;
}
export interface Form {
  // formId: string;
  id: string;
  userId: string;
  formTitle: string;
  formDescription: string;
  questions: Question[];
  lastOpened: string | null;
  newForm: boolean;
}
export type AnswerValue =
  | string
  | string[]
  | File
  | number
  | Date
  | null
  | undefined;

export interface FormResponse {
  id: string;
  userId: string;
  formId: string;
  answers: {
    questionId: string;
    value: AnswerValue;
  }[];
  submittedAt: string;
}
