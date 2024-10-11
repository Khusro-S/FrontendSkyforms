import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { initialStateQuestion } from "./questionsSlice";

interface Option {
  optionText: string;
}

export interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: Option[];
  open: boolean;
  required: boolean;
}

interface FormState {
  //   questions: Question[];
  formTitle: string;
  formDescription: string;
}

// const initialQuestions = initialStateQuestion.questions;
const initialState: FormState = {
  //   questions: initialQuestions,
  formTitle: "",
  formDescription: "",
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    // setQuestions: (state, action: PayloadAction<Question[]>) => {
    //   state.questions = action.payload;
    // },
    setFormTitle: (state, action: PayloadAction<string>) => {
      state.formTitle = action.payload;
    },
    setFormDescription: (state, action: PayloadAction<string>) => {
      state.formDescription = action.payload;
    },
  },
});

export const { setFormDescription, setFormTitle } = formSlice.actions;

export const formSliceActions = formSlice.actions;
export default formSlice;
