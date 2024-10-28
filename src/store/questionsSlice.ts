import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FileData {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Option {
  optionText: string;
}

export interface Question {
  id: string;
  questionText: string;
  questionType:
    | "radio"
    | "checkbox"
    | "shortAnswer"
    | "longAnswer"
    | "fileUpload"
    | "date"
    | "phoneNumber";
  questionTypeSelect: string;
  options?: Option[];
  selectedOptions?: string[];
  placeholderText?: string;
  shortAnswer?: string;
  longAnswer?: string;
  date?: string;
  phoneNumber?: number | null;
  file?: FileData;
  open: boolean;
  required: boolean;
}

interface QuestionsState {
  questions: Question[];
  formTitle: string;
  formDescription: string;
  formId: string;
}
interface UpdateQuestionTypeSelectPayload {
  questionId: string;
  questionTypeSelect: string;
}

export const initialStateQuestion: QuestionsState = {
  questions: [
    {
      id: crypto.randomUUID(),
      questionText: "Untitled Question",
      questionType: "radio",
      questionTypeSelect: "Multiple Choice",
      options: [
        { optionText: "Untitled Option" },
        // { optionText: "Roses" },
        // { optionText: "Sunflowers" },
        // { optionText: "Lavender" },
      ],
      // questionTypeSelect:
      open: true,
      required: false,
    },
  ],
  formTitle: "Untitled form",
  formDescription: "Untitled description",
  formId: crypto.randomUUID(),
};

const questionsSlice = createSlice({
  name: "questions",
  initialState: initialStateQuestion,
  reducers: {
    addMoreQuestionField(state) {
      state.questions.forEach((question) => (question.open = false));

      state.questions.push({
        id: crypto.randomUUID(),
        questionText: "Untitled question",
        questionType: "radio",
        questionTypeSelect: "Multiple Choice",
        options: [{ optionText: "Untitled option" }],
        open: true,
        required: false,
      });
    },
    updateQuestionTypeSelect: (
      state,
      action: PayloadAction<UpdateQuestionTypeSelectPayload>
    ) => {
      const { questionId, questionTypeSelect } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);
      if (question) {
        question.questionTypeSelect = questionTypeSelect;
      }
    },
    copyQuestion(state, action: PayloadAction<number>) {
      state.questions.forEach((question) => (question.open = false));

      const copiedQuestion = {
        ...state.questions[action.payload],
        id: crypto.randomUUID(),
        open: true,
      };
      state.questions.push(copiedQuestion);
    },

    addOption(state, action: PayloadAction<number>) {
      const question = state.questions[action.payload];
      if (
        question.questionType === "radio" ||
        question.questionType === "checkbox"
      ) {
        question.options = question.options || [];
        question.options.push({ optionText: "Untitled Option" });
      }
    },

    removeOption: (state, action: PayloadAction<{ i: number; j: number }>) => {
      const { i, j } = action.payload;
      const question = state.questions[i];
      if (
        question &&
        (question.questionType === "radio" ||
          question.questionType === "checkbox") &&
        question.options &&
        question.options.length > 1
      ) {
        question.options.splice(j, 1);
      }
    },

    changeQuestion: (
      state,
      action: PayloadAction<{ text: string; index: number }>
    ) => {
      const { text, index } = action.payload;
      const question = state.questions[index];
      if (question) {
        question.questionText = text;
      }
    },

    requiredQuestion: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      const question = state.questions[index];
      if (question) {
        question.required = !question.required;
      }
    },

    deleteQuestion: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      if (
        state.questions.length > 1 &&
        index >= 0 &&
        index < state.questions.length
      ) {
        state.questions.splice(index, 1);
      }
    },

    addQuestionType: (
      state,
      action: PayloadAction<{ index: number; type: Question["questionType"] }>
    ) => {
      const { index, type } = action.payload;
      const question = state.questions[index];
      if (question) {
        question.questionType = type;
        if (type === "radio" || type === "checkbox") {
          question.options = [{ optionText: "Untitled Option" }];
        } else {
          question.options = undefined;
        }
      }
    },

    changeOptionValues: (
      state,
      action: PayloadAction<{ text: string; i: number; j: number }>
    ) => {
      const { text, i, j } = action.payload;
      const question = state.questions[i];
      if (
        question &&
        question.options &&
        j >= 0 &&
        j < question.options.length
      ) {
        question.options[j].optionText = text;
      }
    },

    reorderQuestions(
      state,
      action: PayloadAction<{ startIndex: number; endIndex: number }>
    ) {
      const [removed] = state.questions.splice(action.payload.startIndex, 1);
      state.questions.splice(action.payload.endIndex, 0, removed);
    },

    handleExpand(state, action: PayloadAction<number>) {
      state.questions = state.questions.map((question, index) => ({
        ...question,
        open: index === action.payload,
      }));
    },

    setFormTitle: (state, action: PayloadAction<string>) => {
      state.formTitle = action.payload;
    },

    setFormDescription: (state, action: PayloadAction<string>) => {
      state.formDescription = action.payload;
    },

    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },

    setFile(state, action: PayloadAction<{ index: number; file: FileData }>) {
      const { index, file } = action.payload;
      state.questions = state.questions.map((question, i) =>
        i === index && question.questionType === "fileUpload"
          ? { ...question, file }
          : question
      );
    },

    removeFile(state, action: PayloadAction<number>) {
      const index = action.payload;
      state.questions = state.questions.map((question, i) =>
        i === index && question.questionType === "fileUpload"
          ? { ...question, file: undefined }
          : question
      );
    },

    changeShortAnswer: (
      state,
      action: PayloadAction<{ answer: string; index: number }>
    ) => {
      const { answer, index } = action.payload;
      const question = state.questions[index];
      if (question && question.questionType === "shortAnswer") {
        question.shortAnswer = answer;
      }
    },

    changeLongAnswer: (
      state,
      action: PayloadAction<{ answer: string; index: number }>
    ) => {
      const { answer, index } = action.payload;
      const question = state.questions[index];
      if (question && question.questionType === "longAnswer") {
        question.longAnswer = answer;
      }
    },

    changeDate: (
      state,
      action: PayloadAction<{ date: string; index: number }>
    ) => {
      const { date, index } = action.payload;
      const question = state.questions[index];
      if (question && question.questionType === "date") {
        question.date = date;
      }
    },

    changePhoneNumber: (
      state,
      action: PayloadAction<{ number: number; index: number }>
    ) => {
      const { number, index } = action.payload;
      const question = state.questions[index];
      if (question && question.questionType === "phoneNumber") {
        question.phoneNumber = number;
      }
    },

    // updateQuestionType: (
    //   state,
    //   action: PayloadAction<UpdateQuestionTypePayload>
    // ) => {
    //   const { index, questionType } = action.payload;
    //   const question = state.questions[index];
    //   if (question) {
    //     question.questionType = questionType;
    //   }
    // },

    toggleCheckbox: (
      state,
      action: PayloadAction<{ index: number; optionIndex: number }>
    ) => {
      const { index, optionIndex } = action.payload;
      const question = state.questions[index];

      if (question) {
        // If selectedOptions is not initialized, initialize it
        if (!question.selectedOptions) {
          question.selectedOptions = [];
        }

        // Check if the option is already selected
        const optionText = question.options?.[optionIndex]?.optionText; // Added optional chaining for safety

        if (optionText) {
          // Ensure optionText is defined
          if (question.selectedOptions.includes(optionText)) {
            // Remove it if already selected
            question.selectedOptions = question.selectedOptions.filter(
              (option) => option !== optionText
            );
          } else {
            // Add it if not selected
            question.selectedOptions.push(optionText);
          }
        }
      }
    },

    setRadioOption: (
      state,
      action: PayloadAction<{ index: number; optionIndex: number }>
    ) => {
      const { index, optionIndex } = action.payload;
      const question = state.questions[index];

      if (question && question.questionType === "radio" && question.options) {
        // Ensure only one selected option by replacing selectedOptions
        question.selectedOptions = [question.options[optionIndex].optionText];
      }
    },
  },
});

export const {
  addMoreQuestionField,
  copyQuestion,
  addOption,
  removeOption,
  reorderQuestions,
  handleExpand,
  changeQuestion,
  addQuestionType,
  changeOptionValues,
  deleteQuestion,
  requiredQuestion,
  setFormTitle,
  setFormDescription,
  setQuestions,
  setFile,
  removeFile,
  changeShortAnswer,
  changeLongAnswer,
  changeDate,
  changePhoneNumber,
  toggleCheckbox,
  updateQuestionTypeSelect,
  setRadioOption,
} = questionsSlice.actions;

export const questionsActions = questionsSlice.actions;
export default questionsSlice;
