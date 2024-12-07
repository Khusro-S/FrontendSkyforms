import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchForms } from "../api/api";

export interface FileData {
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Option {
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
  // placeholderText?: string;
  shortAnswer?: string;
  longAnswer?: string;
  date?: string;
  phoneNumber?: number | null;
  file?: FileData;
  open: boolean;
  required: boolean;
}

export interface Form {
  formId: string;
  formTitle: string;
  formDescription: string;
  questions: Question[];
  lastOpened: string | null;
}

interface FormsState {
  forms: Form[];
  loading: boolean;
  error: string | null;
  currentFormId: string | null;
}

export const initialStateForms: FormsState = {
  forms: [],
  loading: false,
  error: null,
  currentFormId: null,
};

// export const initialStateQuestion: QuestionsState = {
//   forms: [
//     {
//       formId: crypto.randomUUID(),
//       formTitle: "Untitled form",
//       formDescription: "Untitled description",
//       questions: [
//         {
//           id: crypto.randomUUID(),
//           questionText: "Untitled Question",
//           questionType: "radio",
//           questionTypeSelect: "Multiple Choice",
//           options: [{ optionText: "Untitled Option" }],
//           open: true,
//           required: false,
//         },
//       ],
//     },
//   ],
//   loading: false,
//   error: null,
//   currentFormId: null,
// };

export const getForms = createAsyncThunk("forms/getForms", async () => {
  const response = await fetchForms();
  const data = await response;
  return data as Form[];
});

const formsSlice = createSlice({
  name: "forms",
  initialState: initialStateForms,
  reducers: {
    setCurrentFormId: (state, action: PayloadAction<string | null>) => {
      state.currentFormId = action.payload;
    },

    addForm(state, action: PayloadAction<Form>) {
      state.forms.push(action.payload);
    },

    removeForm(state, action: PayloadAction<string>) {
      state.forms = state.forms.filter(
        (form) => form.formId !== action.payload
      );
    },

    updateForm(
      state,
      action: PayloadAction<{
        formId: string;
        formTitle: string;
        formDescription: string;
      }>
    ) {
      const form = state.forms.find((f) => f.formId === action.payload.formId);
      if (form) {
        form.formTitle = action.payload.formTitle;
        form.formDescription = action.payload.formDescription;
      }
    },

    setLastOpened(
      state,
      action: PayloadAction<{ formId: string; lastOpened: string }>
    ) {
      const { formId, lastOpened } = action.payload;
      const form = state.forms.find((f) => f.formId === formId);
      if (form) {
        form.lastOpened = lastOpened;
      }
    },

    addMoreQuestionField(state, action: PayloadAction<{ formId: string }>) {
      const form = state.forms.find((f) => f.formId === action.payload.formId);
      if (form) {
        form.questions.forEach((question) => (question.open = false));
        form.questions.push({
          id: crypto.randomUUID(),
          questionText: "Untitled question",
          questionType: "radio",
          questionTypeSelect: "Multiple Choice",
          options: [{ optionText: "Untitled option" }],
          open: true,
          required: false,
        });
      }
    },

    updateQuestionTypeSelect: (
      state,
      action: PayloadAction<{
        formId: string;
        questionId: string;
        questionTypeSelect: string;
      }>
    ) => {
      const { formId, questionId, questionTypeSelect } = action.payload;
      const form = state.forms.find((f) => f.formId === formId);

      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question) {
          question.questionTypeSelect = questionTypeSelect;
        }
      }
    },

    copyQuestion(
      state,
      action: PayloadAction<{ formId: string; questionId: string }>
    ) {
      const form = state.forms.find((f) => f.formId === action.payload.formId);
      if (form) {
        const questionToCopy = form.questions.find(
          (question) => question.id === action.payload.questionId
        );
        if (questionToCopy) {
          form.questions.forEach((question) => (question.open = false));
          form.questions.push({
            ...questionToCopy,
            id: crypto.randomUUID(),
            open: true,
          });
        }
      }
    },

    addOption(
      state,
      action: PayloadAction<{ formId: string; questionId: string }>
    ) {
      const { formId, questionId } = action.payload;
      const form = state.forms.find((f) => f.formId === formId); // Find the form by formId

      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (
          question &&
          (question.questionType === "radio" ||
            question.questionType === "checkbox")
        ) {
          question.options = question.options || [];
          question.options.push({ optionText: "Untitled Option" });
        }
      }
    },

    removeOption: (
      state,
      action: PayloadAction<{
        formId: string;
        questionId: string;
        optionIndex: number;
      }>
    ) => {
      const { formId, questionId, optionIndex } = action.payload;
      const form = state.forms.find((f) => f.formId === formId);
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (
          question &&
          (question.questionType === "radio" ||
            question.questionType === "checkbox") &&
          question.options &&
          question.options.length > 1
        ) {
          question.options.splice(optionIndex, 1);
        }
      }
    },
    changeQuestion: (
      state,
      action: PayloadAction<{
        formId: string;
        text: string;
        questionId: string;
      }>
    ) => {
      const { text, questionId } = action.payload;
      const form = state.forms.find((f) => f.formId === action.payload.formId);
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question) {
          question.questionText = text;
        }
      }
    },

    requiredQuestion: (
      state,
      action: PayloadAction<{ formId: string; questionId: string }>
    ) => {
      const { questionId } = action.payload;
      const form = state.forms.find((f) => f.formId === action.payload.formId);
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question) {
          question.required = !question.required;
        }
      }
    },

    deleteQuestion(
      state,
      action: PayloadAction<{ formId: string; questionId: string }>
    ) {
      const form = state.forms.find((f) => f.formId === action.payload.formId);
      if (form) {
        if (form.questions.length > 1) {
          // Only proceed if there’s more than one question
          const questionIndex = form.questions.findIndex(
            (question) => question.id === action.payload.questionId
          );
          if (questionIndex !== -1) {
            form.questions.splice(questionIndex, 1);
          }
        }
      }
    },

    addQuestionType: (
      state,
      action: PayloadAction<{
        formId: string;
        questionId: string;
        type: Question["questionType"];
      }>
    ) => {
      const { formId, questionId, type } = action.payload;
      const form = state.forms.find((f) => f.formId === formId);

      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question) {
          question.questionType = type;
          if (type === "radio" || type === "checkbox") {
            question.options = [{ optionText: "Untitled Option" }];
          } else {
            question.options = undefined;
          }
        }
      }
    },

    // changeOptionValues: (
    //   state,
    //   action: PayloadAction<{
    //     formId: string;
    //     text: string;
    //     i: number;
    //     j: number;
    //   }>
    // ) => {
    //   const { formId, text, i, j } = action.payload;
    //   const form = state.forms.find((f) => f.formId === formId);
    //   if (!formId) {
    //     console.warn("formId is null. Cannot set radio option.");
    //     return state;
    //   }
    //   if (form) {
    //     const question = form.questions[i];
    //     if (
    //       question &&
    //       question.options &&
    //       j >= 0 &&
    //       j < question.options.length
    //     ) {
    //       question.options[j].optionText = text;
    //     }
    //   }
    // },
    changeOptionValues: (
      state,
      action: PayloadAction<{
        formId: string;
        text: string;
        questionId: string;
        optionIndex: number;
      }>
    ) => {
      const { formId, text, questionId, optionIndex } = action.payload;

      if (!formId) {
        console.warn("formId is null. Cannot change option value.");
        return state;
      }
      const form = state.forms.find((f) => f.formId === formId);
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);

        if (
          question &&
          question.options &&
          optionIndex >= 0 &&
          optionIndex < question.options.length
        ) {
          question.options[optionIndex].optionText = text;
        }
      }
      return state;
    },

    reorderQuestions(
      state,
      action: PayloadAction<{
        formId: string;
        startIndex: number;
        endIndex: number;
      }>
    ) {
      const { formId, startIndex, endIndex } = action.payload;
      const form = state.forms.find((f) => f.formId === formId);
      if (form) {
        const [removed] = form.questions.splice(startIndex, 1);
        form.questions.splice(endIndex, 0, removed);
      }
    },

    handleExpand: (
      state: FormsState,
      action: PayloadAction<{ formId: string; Index: number }>
    ): FormsState => {
      const { formId, Index } = action.payload;
      const form = state.forms.find((f) => f.formId === formId);
      if (form) {
        form.questions = form.questions.map((question, index) => ({
          ...question,
          open: index === Index,
        }));
      }

      return state;
    },

    createNewForm: (state, action: PayloadAction<string>) => {
      const newForm: Form = {
        formId: action.payload,
        formTitle: "Untitled Form",
        formDescription: "Untitled Description",
        questions: [
          {
            id: crypto.randomUUID(),
            questionText: "Untitled Question",
            questionType: "radio",
            questionTypeSelect: "Multiple Choice",
            options: [{ optionText: "Untitled Option" }],
            open: true,
            required: false,
          },
        ],
        lastOpened: new Date().toISOString(),
      };

      state.forms.push(newForm);
      state.currentFormId = newForm.formId;
    },

    setFormTitle: (
      state,
      action: PayloadAction<{ formId: string; formTitle: string }>
    ) => {
      const { formId, formTitle } = action.payload;
      const form = state.forms.find((f) => f.formId === formId);
      if (form) {
        form.formTitle = formTitle;
      }
    },

    setFormDescription: (
      state,
      action: PayloadAction<{ formId: string; formDescription: string }>
    ) => {
      const { formId, formDescription } = action.payload;
      const form = state.forms.find((f) => f.formId === formId);
      if (form) {
        form.formDescription = formDescription;
      }
    },

    setQuestions: (
      state,
      action: PayloadAction<{ formId: string; questions: Question[] }>
    ) => {
      const { formId, questions } = action.payload;
      const form = state.forms.find((f) => f.formId === formId);
      if (form) {
        form.questions = questions;
      }
    },

    setFile(
      state,
      action: PayloadAction<{
        formId: string;
        questionId: string;
        file: FileData;
      }>
    ) {
      const { formId, questionId, file } = action.payload;
      const form = state.forms.find((f) => f.formId === formId);

      if (form) {
        form.questions = form.questions.map((question) =>
          question.id === questionId && question.questionType === "fileUpload"
            ? { ...question, file }
            : question
        );
      }
    },

    removeFile(
      state,
      action: PayloadAction<{ formId: string; questionId: string }>
    ) {
      const { formId, questionId } = action.payload;
      const form = state.forms.find((f) => f.formId === formId);
      if (form) {
        form.questions = form.questions.map((question) =>
          question.id === questionId && question.questionType === "fileUpload"
            ? { ...question, file: undefined }
            : question
        );
      }
    },

    // changeShortAnswer: (
    //   state,
    //   action: PayloadAction<{ formId: string; answer: string; index: number }>
    // ) => {
    //   const { formId, answer, index } = action.payload;
    //   const form = state.forms.find((f) => f.formId === formId);
    //   if (form) {
    //     const question = form.questions[index];
    //     if (question && question.questionType === "shortAnswer") {
    //       question.shortAnswer = answer;
    //     }
    //   }
    // },

    changeShortAnswer: (
      state,
      action: PayloadAction<{
        formId: string | null;
        answer: string;
        questionId: string;
      }>
    ) => {
      const { formId, answer, questionId } = action.payload;
      if (!formId) {
        console.warn("formId is null. Cannot update short answer.");
        return state;
      }
      const form = state.forms.find((f) => f.formId === formId);

      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question && question.questionType === "shortAnswer") {
          question.shortAnswer = answer;
        }
      }
    },

    // changeLongAnswer: (
    //   state,
    //   action: PayloadAction<{ formId: string; answer: string; index: number }>
    // ) => {
    //   const { formId, answer, index } = action.payload;
    //   const form = state.forms.find((f) => f.formId === formId);
    //   if (form) {
    //     const question = form.questions[index];
    //     if (question && question.questionType === "longAnswer") {
    //       question.longAnswer = answer;
    //     }
    //   }
    // },

    changeLongAnswer: (
      state,
      action: PayloadAction<{
        formId: string | null;
        answer: string;
        questionId: string;
      }>
    ) => {
      const { formId, answer, questionId } = action.payload;
      if (!formId) {
        console.warn("formId is null. Cannot update short answer.");
        return state;
      }

      const form = state.forms.find((f) => f.formId === formId);

      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question && question.questionType === "longAnswer") {
          question.longAnswer = answer;
        }
      }
    },

    changeDate: (
      state,
      action: PayloadAction<{
        formId: string | null;
        date: string;
        questionId: string;
      }>
    ) => {
      const { formId, date, questionId } = action.payload;
      if (!formId) {
        console.warn("formId is null. Cannot update short answer.");
        return state;
      }

      const form = state.forms.find((f) => f.formId === formId);
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question && question.questionType === "date") {
          question.date = date;
        }
      }
    },

    changePhoneNumber: (
      state,
      action: PayloadAction<{
        formId: string | null;
        number: number;
        questionId: string;
      }>
    ) => {
      const { formId, number, questionId } = action.payload;
      if (!formId) {
        console.warn("formId is null. Cannot update short answer.");
        return state;
      }
      const form = state.forms.find((f) => f.formId === formId);
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question && question.questionType === "phoneNumber") {
          question.phoneNumber = number;
        }
      }
    },

    toggleOpenAllQuestions(
      state,
      action: PayloadAction<{ formId: string; open: boolean }>
    ) {
      const form = state.forms.find((f) => f.formId === action.payload.formId);
      if (form) {
        form.questions.forEach(
          (question) => (question.open = action.payload.open)
        );
      }
    },
    //   toggleOpenSingleQuestion(state, action: PayloadAction<{ formId: string; questionId: string }>) {
    //     const form = state.forms.find((f) => f.formId === action.payload.formId);
    //     if (form) {
    //       form.questions.forEach((question) => (question.open = false));
    //       const question = form.questions.find((q) => q.id === action.payload.questionId);
    //       if (question) question.open = true;
    //     }
    //   },
    // },
    toggleCheckbox: (
      state,
      action: PayloadAction<{
        formId: string;
        questionId: string;
        optionIndex: number;
      }>
    ) => {
      const { formId, questionId, optionIndex } = action.payload;
      if (!formId) {
        console.warn("formId is null. Cannot toggle checkbox option.");
        return state;
      }
      const form = state.forms.find((f) => f.formId === formId);
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);

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
      }
    },

    setRadioOption: (
      state,
      action: PayloadAction<{
        formId: string;
        questionId: string;
        optionIndex: number;
      }>
    ) => {
      const { formId, questionId, optionIndex } = action.payload;
      const form = state.forms.find((f) => f.formId === formId);
      if (!formId) {
        console.warn("formId is null. Cannot set radio option.");
        return state;
      }
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);

        if (question && question.questionType === "radio" && question.options) {
          // Ensure only one selected option by replacing selectedOptions
          question.selectedOptions = [question.options[optionIndex].optionText];
        }
      }
    },

    setForms: (state, action: PayloadAction<Form[]>) => {
      state.forms = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getForms.pending, (state) => {
        state.loading = true;
      })
      .addCase(getForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload;
      })
      .addCase(getForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch forms";
        console.log("Error: ", action.error);
      });
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
  setCurrentFormId,
  addForm,
  removeForm,
  updateForm,
  createNewForm,
  setForms,
  setLoading,
  setError,
  setLastOpened,
} = formsSlice.actions;

export const formsActions = formsSlice.actions;
export default formsSlice;
