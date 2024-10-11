import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Option {
  optionText: string;
}

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: Option[];
  open: boolean;
  required: boolean;
}

interface QuestionsState {
  questions: Question[];
}

export const initialStateQuestion: QuestionsState = {
  questions: [
    {
      id: crypto.randomUUID(),
      questionText: "Which flower is named after the sun?",
      questionType: "radio",
      options: [
        { optionText: "Lilies" },
        { optionText: "Roses" },
        { optionText: "Sunflowers" },
        { optionText: "Lavender" },
      ],
      open: true,
      required: false,
    },
  ],
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
        options: [{ optionText: "Untitled option" }],
        open: true,
        required: false,
      });
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
      state.questions[action.payload].options.push({ optionText: "" });
    },

    removeOption: (state, action: PayloadAction<{ i: number; j: number }>) => {
      const { i, j } = action.payload;
      if (state.questions[i] && state.questions[i].options.length > 1) {
        state.questions[i].options.splice(j, 1);
      }
    },

    changeQuestion: (
      state,
      action: PayloadAction<{ text: string; index: number }>
    ) => {
      const { text, index } = action.payload;

      if (state.questions[index]) {
        state.questions[index].questionText = text;
      }
    },

    requiredQuestion: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      if (state.questions[index]) {
        state.questions[index].required = !state.questions[index].required;
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

    // addQuestionType: (
    //   state,
    //   action: PayloadAction<{ index: number; type: string }>
    // ) => {
    //   const { index, type } = action.payload;
    //   const newQuestions = [...state.questions];
    //   if (newQuestions[index]) {
    //     newQuestions[index].questionType = type;
    //   }
    //   state.questions = newQuestions;
    // },
    // changeOptionValues: (
    //   state,
    //   action: PayloadAction<{ text: string; i: number; j: number }>
    // ) => {
    //   const { text, i, j } = action.payload;
    //   const newQuestions = [...state.questions];
    //   if (newQuestions[i] && newQuestions[i].options[j]) {
    //     newQuestions[i].options[j].optionText = text;
    //   }
    //   state.questions = newQuestions;
    // },

    addQuestionType: (
      state,
      action: PayloadAction<{ index: number; type: string }>
    ) => {
      const { index, type } = action.payload;
      if (index >= 0 && index < state.questions.length) {
        state.questions[index].questionType = type;
      }
    },
    changeOptionValues: (
      state,
      action: PayloadAction<{ text: string; i: number; j: number }>
    ) => {
      const { text, i, j } = action.payload;
      const question = state.questions[i];
      if (question && j >= 0 && j < question.options.length) {
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
} = questionsSlice.actions;

export const questionsActions = questionsSlice.actions;
export default questionsSlice;
