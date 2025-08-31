import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { api } from "../api"; // Your API service
import { FormResponse } from "../types/types";
import {
  deleteFormResponsesAPI,
  fetchFormResponsesAPI,
  submitFormResponseAPI,
} from "../api/api";
import { RootState } from "./rootReducer";

// export const submitFormResponseThunk = createAsyncThunk(
//   "responses/submitFormResponse",
//   async (response: Omit<FormResponse, "submittedAt">, { rejectWithValue }) => {
//     try {
//       const result = await submitFormResponseAPI(response);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const fetchFormResponsesThunk = createAsyncThunk(
//   "responses/fetchFormResponses",
//   async (formId: string, { rejectWithValue }) => {
//     try {
//       const responses = await fetchFormResponsesAPI(formId);
//       return responses;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const deleteFormResponsesThunk = createAsyncThunk(
//   "responses/deleteFormResponses",
//   async (formId: string, { rejectWithValue }) => {
//     try {
//       await deleteFormResponsesAPI(formId);
//       return formId; // Return the formId for reducer logic
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

export const submitFormResponseThunk = createAsyncThunk(
  "responses/submitFormResponse",
  async (
    response: Omit<FormResponse, "submittedAt">,
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.currentUser?.id;
      if (!userId) {
        return rejectWithValue("User not authenticated");
      }
      const result = await submitFormResponseAPI({ ...response, userId });
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchFormResponsesThunk = createAsyncThunk(
  "responses/fetchFormResponses",
  async (formId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.currentUser?.id;
      if (!userId) {
        return rejectWithValue("User not authenticated");
      }

      // Modify the API call to filter responses by userId as well
      const responses = await fetchFormResponsesAPI(formId);
      // return responses.filter((response) => response.userId === userId);
      return responses;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteFormResponsesThunk = createAsyncThunk(
  "responses/deleteFormResponses",
  async (formId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.currentUser?.id;
      if (!userId) {
        return rejectWithValue("User not authenticated");
      }

      // Modify the API call to delete responses by userId as well if needed.
      await deleteFormResponsesAPI(formId);
      return formId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


interface ResponsesState {
  responses: FormResponse[];
  loading: boolean;
  error: string | null;
}

export const initialStateResponses: ResponsesState = {
  responses: [],
  loading: false,
  error: null,
};

const responsesSlice = createSlice({
  name: "responses",
  initialState: initialStateResponses,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitFormResponseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFormResponseThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.responses.push(action.payload);
      })
      .addCase(submitFormResponseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFormResponsesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormResponsesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.responses = action.payload;
      })
      .addCase(fetchFormResponsesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteFormResponsesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFormResponsesThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out responses with the deleted formId
        state.responses = state.responses.filter(
          (response) => response.id !== action.payload
        );
      })
      .addCase(deleteFormResponsesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default responsesSlice;
