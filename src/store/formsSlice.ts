import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileData, Form, Question, QuestionType } from "../types/types";
import {
  createFormAPI,
  deleteFormAPI,
  fetchAllForms,
  fetchFormByIdAPI,
  updateFormAPI,
  updateFormLastOpenedAPI,
  updateFormTitleAPI,
} from "../api/api";

interface FormsState {
  forms: Form[];
  error?: string | null;
  loading?: boolean;
  currentFormId: string | null;
  searchQuery: string;
}

export const initialStateForms: FormsState = {
  forms: [],
  error: null,
  loading: false,
  currentFormId: null,
  searchQuery: "",
};
export const getForms = createAsyncThunk("forms/getAllForms", async () => {
  const response = await fetchAllForms();
  const data = await response;
  return data as Form[];
});

export const createFormThunk = createAsyncThunk<Form, Form>(
  "forms/createForm",
  async (formData: Form) => {
    const response = await createFormAPI(formData);
    return response;
  }
);

export const fetchFormByIdThunk = createAsyncThunk(
  "forms/fetchFormById",
  async (formId: string) => {
    const response = await fetchFormByIdAPI(formId);
    return response as Form; // The server should return the form with the provided ID
  }
);

export const updateLastOpenedThunk = createAsyncThunk(
  "forms/updateLastOpened",
  async ({ id, lastOpened }: { id: string; lastOpened: Date }) => {
    // console.log(lastOpened);
    const lastOpenedString = lastOpened.toISOString();
    await updateFormLastOpenedAPI(id, lastOpenedString);
    return { id, lastOpened: lastOpenedString };
  }
);

export const deleteFormThunk = createAsyncThunk(
  "forms/deleteForm",
  async (formId: string) => {
    await deleteFormAPI(formId);
    return formId;
  }
);

export const updateFormTitleThunk = createAsyncThunk(
  "forms/updateFormTitle",
  async ({ formId, formTitle }: { formId: string; formTitle: string }) => {
    await updateFormTitleAPI(formId, formTitle);
    return { formId, formTitle };
  }
);
export const updateFormThunk = createAsyncThunk(
  "forms/updateForm",
  async (formData: Form, { rejectWithValue }) => {
    try {
      // Assuming updateFormAPI is your API call function
      await updateFormAPI(formData.id, formData);
      // Return the form data for the reducer to use
      return formData;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Failed to update form: ");
    }
  }
);

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
      state.forms = state.forms.filter((form) => form.id !== action.payload);
    },

    updateForm(state, action: PayloadAction<Form>) {
      const index = state.forms.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.forms[index] = action.payload;
      }
    },
    setLastOpened(
      state,
      action: PayloadAction<{ id: string; lastOpened: string }>
    ) {
      const { id, lastOpened } = action.payload;
      const form = state.forms.find((f) => f.id === id);
      if (form) {
        form.lastOpened = lastOpened;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addMoreQuestionField(state, action: PayloadAction<{ id: string }>) {
      const form = state.forms.find((f) => f.id === action.payload.id);
      if (form) {
        form.questions.forEach((question) => (question.open = false));
        form.questions.push({
          id: crypto.randomUUID(),
          questionText: "Untitled question",
          questionType: QuestionType.RADIO,
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
        id: string;
        questionId: string;
        questionTypeSelect: string;
      }>
    ) => {
      const { id, questionId, questionTypeSelect } = action.payload;
      const form = state.forms.find((f) => f.id === id);

      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question) {
          question.questionTypeSelect = questionTypeSelect;
        }
      }
    },

    copyQuestion(
      state,
      action: PayloadAction<{ id: string; questionId: string }>
    ) {
      const form = state.forms.find((f) => f.id === action.payload.id);
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
      action: PayloadAction<{ id: string; questionId: string }>
    ) {
      const { id, questionId } = action.payload;
      const form = state.forms.find((f) => f.id === id); // Find the form by id

      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (
          question &&
          (question.questionType === QuestionType.RADIO ||
            question.questionType === QuestionType.CHECKBOX)
        ) {
          question.options = question.options || [];
          question.options.push({ optionText: "Untitled Option" });
        }
      }
    },

    removeOption: (
      state,
      action: PayloadAction<{
        id: string;
        questionId: string;
        optionIndex: number;
      }>
    ) => {
      const { id, questionId, optionIndex } = action.payload;
      const form = state.forms.find((f) => f.id === id);
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (
          question &&
          (question.questionType === QuestionType.RADIO ||
            question.questionType === QuestionType.CHECKBOX) &&
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
        id: string;
        text: string;
        questionId: string;
      }>
    ) => {
      const { text, questionId } = action.payload;
      const form = state.forms.find((f) => f.id === action.payload.id);
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question) {
          question.questionText = text;
        }
      }
    },

    requiredQuestion: (
      state,
      action: PayloadAction<{ id: string; questionId: string }>
    ) => {
      const { questionId } = action.payload;
      const form = state.forms.find((f) => f.id === action.payload.id);
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question) {
          question.required = !question.required;
        }
      }
    },

    deleteQuestion(
      state,
      action: PayloadAction<{ id: string; questionId: string }>
    ) {
      const form = state.forms.find((f) => f.id === action.payload.id);
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
        id: string;
        questionId: string;
        type: QuestionType;
      }>
    ) => {
      const { id, questionId, type } = action.payload;
      const form = state.forms.find((f) => f.id === id);

      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question) {
          question.questionType = type;

          question.options = undefined;
          question.selectedOptions = undefined;
          question.shortAnswer = undefined;
          question.longAnswer = undefined;
          question.date = undefined;
          question.phoneNumber = null;
          question.file = undefined;

          if (type === QuestionType.RADIO || type === QuestionType.CHECKBOX) {
            question.options = [{ optionText: "Untitled Option" }];
          }
        }
      }
    },
    changeOptionValues: (
      state,
      action: PayloadAction<{
        id: string;
        text: string;
        questionId: string;
        optionIndex: number;
      }>
    ) => {
      const { id, text, questionId, optionIndex } = action.payload;

      if (!id) {
        console.warn("id is null. Cannot change option value.");
        return state;
      }
      const form = state.forms.find((f) => f.id === id);
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
        id: string;
        startIndex: number;
        endIndex: number;
      }>
    ) {
      const { id, startIndex, endIndex } = action.payload;
      const form = state.forms.find((f) => f.id === id);
      if (form) {
        const [removed] = form.questions.splice(startIndex, 1);
        form.questions.splice(endIndex, 0, removed);
      }
    },

    handleExpand: (
      state: FormsState,
      action: PayloadAction<{ id: string; Index: number }>
    ): FormsState => {
      const { id, Index } = action.payload;
      const form = state.forms.find((f) => f.id === id);
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
        id: action.payload,
        formTitle: "Untitled Form",
        formDescription: "Untitled Description",
        questions: [
          {
            id: crypto.randomUUID(),
            questionText: "Untitled Question",
            questionType: QuestionType.RADIO,
            questionTypeSelect: "Multiple Choice",
            options: [{ optionText: "Untitled Option" }],
            open: true,
            required: false,
          },
        ],
        lastOpened: new Date().toISOString(),
        newForm: true,
      };

      state.forms.push(newForm);
      state.currentFormId = newForm.id;
    },

    setFormTitle: (
      state,
      action: PayloadAction<{ id: string; formTitle: string }>
    ) => {
      const { id, formTitle } = action.payload;
      const form = state.forms.find((f) => f.id === id);
      if (form) {
        form.formTitle = formTitle;
      }
    },

    setFormDescription: (
      state,
      action: PayloadAction<{ id: string; formDescription: string }>
    ) => {
      const { id, formDescription } = action.payload;
      const form = state.forms.find((f) => f.id === id);
      if (form) {
        form.formDescription = formDescription;
      }
    },

    setQuestions: (
      state,
      action: PayloadAction<{ id: string; questions: Question[] }>
    ) => {
      const { id, questions } = action.payload;
      const form = state.forms.find((f) => f.id === id);
      if (form) {
        form.questions = questions;
      }
    },

    setFile(
      state,
      action: PayloadAction<{
        id: string;
        questionId: string;
        file: FileData;
      }>
    ) {
      const { id, questionId, file } = action.payload;
      const form = state.forms.find((f) => f.id === id);

      if (form) {
        form.questions = form.questions.map((question) =>
          question.id === questionId &&
          question.questionType === QuestionType.FILE_UPLOAD
            ? { ...question, file }
            : question
        );
      }
    },

    removeFile(
      state,
      action: PayloadAction<{ id: string; questionId: string }>
    ) {
      const { id, questionId } = action.payload;
      const form = state.forms.find((f) => f.id === id);
      if (form) {
        form.questions = form.questions.map((question) =>
          question.id === questionId &&
          question.questionType === QuestionType.FILE_UPLOAD
            ? { ...question, file: undefined }
            : question
        );
      }
    },

    changeShortAnswer: (
      state,
      action: PayloadAction<{
        id: string | null;
        answer: string;
        questionId: string;
      }>
    ) => {
      const { id, answer, questionId } = action.payload;
      if (!id) {
        console.warn("id is null. Cannot update short answer.");
        return state;
      }
      const form = state.forms.find((f) => f.id === id);

      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question && question.questionType === QuestionType.SHORT_ANSWER) {
          question.shortAnswer = answer;
        }
      }
    },
    changeLongAnswer: (
      state,
      action: PayloadAction<{
        id: string | null;
        answer: string;
        questionId: string;
      }>
    ) => {
      const { id, answer, questionId } = action.payload;
      if (!id) {
        console.warn("id is null. Cannot update short answer.");
        return state;
      }

      const form = state.forms.find((f) => f.id === id);

      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question && question.questionType === QuestionType.LONG_ANSWER) {
          question.longAnswer = answer;
        }
      }
    },

    changeDate: (
      state,
      action: PayloadAction<{
        id: string | null;
        date: string;
        questionId: string;
      }>
    ) => {
      const { id, date, questionId } = action.payload;
      if (!id) {
        console.warn("id is null. Cannot update short answer.");
        return state;
      }

      const form = state.forms.find((f) => f.id === id);
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question && question.questionType === QuestionType.DATE) {
          question.date = date;
        }
      }
    },

    changePhoneNumber: (
      state,
      action: PayloadAction<{
        id: string | null;
        number: number;
        questionId: string;
      }>
    ) => {
      const { id, number, questionId } = action.payload;
      if (!id) {
        console.warn("id is null. Cannot update short answer.");
        return state;
      }
      const form = state.forms.find((f) => f.id === id);
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);
        if (question && question.questionType === QuestionType.PHONE_NUMBER) {
          question.phoneNumber = number;
        }
      }
    },

    toggleOpenAllQuestions(
      state,
      action: PayloadAction<{ id: string; open: boolean }>
    ) {
      const form = state.forms.find((f) => f.id === action.payload.id);
      if (form) {
        form.questions.forEach(
          (question) => (question.open = action.payload.open)
        );
      }
    },

    toggleCheckbox: (
      state,
      action: PayloadAction<{
        id: string;
        questionId: string;
        optionIndex: number;
      }>
    ) => {
      const { id, questionId, optionIndex } = action.payload;
      if (!id) {
        console.warn("id is null. Cannot toggle checkbox option.");
        return state;
      }
      const form = state.forms.find((f) => f.id === id);
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
        id: string;
        questionId: string;
        optionIndex: number;
      }>
    ) => {
      const { id, questionId, optionIndex } = action.payload;
      const form = state.forms.find((f) => f.id === id);
      if (!id) {
        console.warn("id is null. Cannot set radio option.");
        return state;
      }
      if (form) {
        const question = form.questions.find((q) => q.id === questionId);

        if (
          question &&
          question.questionType === QuestionType.RADIO &&
          question.options
        ) {
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
      })
      .addCase(createFormThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFormThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.forms.push(action.payload);
      })
      .addCase(createFormThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create form";
        console.log("Error: ", action.error);
      })
      .addCase(fetchFormByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFormByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedForm = action.payload;
        state.forms = state.forms.map((form) =>
          form.id === fetchedForm.id ? fetchedForm : form
        );
      })
      .addCase(fetchFormByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch form";
        console.log("Error: ", action.error);
      })
      .addCase(updateLastOpenedThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLastOpenedThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { id, lastOpened } = action.payload;
        const form = state.forms.find((f) => f.id === id);
        if (form) {
          form.lastOpened = new Date(lastOpened).toISOString();
        }
      })
      .addCase(updateLastOpenedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update last opened";
        console.log("Error: ", action.error);
      })
      .addCase(deleteFormThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFormThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = state.forms.filter((form) => form.id !== action.payload);
      })
      .addCase(deleteFormThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete form";
        console.log("Error: ", action.error);
      })
      .addCase(updateFormTitleThunk.fulfilled, (state, action) => {
        const { formId, formTitle } = action.payload;
        const formIndex = state.forms.findIndex((form) => form.id === formId);
        if (formIndex !== -1) {
          state.forms[formIndex].formTitle = formTitle;
        }
      })
      // New updateForm reducers
      .addCase(updateFormThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFormThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Find the form index and update it
        const index = state.forms.findIndex(
          (form) => form.id === action.payload.id
        );
        if (index !== -1) {
          state.forms[index] = action.payload;
        }
      })
      .addCase(updateFormThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
