import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import { loginAPI, signupAPI, validateTokenAPI } from "../api/api";
import { User } from "../types/types";
// import axios, { AxiosError } from "axios";

interface LoginResponse {
  token: string;
  user: User;
}
export const loginThunk = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginAPI(credentials);
    // const token = await loginAPI(credentials);
    // const token = user.token;
    sessionStorage.setItem("authToken", response.token);
    return response;
  } catch (error) {
    // Change to any or error:unknown
    console.log("Error object:", error);

    if (error instanceof Error) {
      return rejectWithValue(error.message); // Correctly pass error message
    } else {
      return rejectWithValue("Login failed"); // Generic fallback
    }
  }
});

export const signupThunk = createAsyncThunk<
  User,
  { email: string; password: string; confirmPassword: string },
  { rejectValue: string }
>("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const user = await signupAPI(userData);
    return user;
  } catch (error) {
    console.log("error object: ", error);
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    } else {
      return rejectWithValue("Signup failed");
    }
  }
});

// Validate token thunk - use this on app initialization
export const validateTokenThunk = createAsyncThunk<
  { token: string; user: User },
  void,
  {
    rejectValue: string;
    dispatch: ThunkDispatch<unknown, unknown, UnknownAction>;
  }
>("auth/validateToken", async (_, thunkAPI) => {
  const token = sessionStorage.getItem("authToken");
  if (!token) return thunkAPI.rejectWithValue("No token found");

  try {
    // Use the validateTokenAPI from the API file
    const user = await validateTokenAPI();
    return { user, token };
  } catch (error) {
    // Clear invalid token
    sessionStorage.removeItem("authToken");
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    } else {
      return thunkAPI.rejectWithValue("Token validation failed");
    }
  }
});

interface AuthState {
  loginLoading: boolean;
  loginError: string | null;
  signupLoading: boolean;
  signupError: string | null;
  isAuthenticated: boolean;
  token: string | null;
  currentUser: User | null;
  validationLoading: boolean;
  validationError: string | null;
}

export const initialAuthState: AuthState = {
  loginLoading: false,
  loginError: null,
  signupLoading: false,
  signupError: null,
  isAuthenticated: !!sessionStorage.getItem("authToken"),
  token: sessionStorage.getItem("authToken"),
  currentUser: null,
  validationLoading: false,
  validationError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.currentUser = null;
      sessionStorage.removeItem("authToken");
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
        state.currentUser = null;
        console.log("Error: ", action.error);
      })
      .addCase(signupThunk.pending, (state) => {
        state.signupLoading = true;
        state.signupError = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.signupLoading = false;
        state.currentUser = action.payload;
        // Optionally, dispatch loginThunk here to log in the user immediately after signup.
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.signupLoading = false;
        state.signupError = action.payload as string;
        console.log("Error: ", action.error);
      })
      // Token validation reducers
      .addCase(validateTokenThunk.pending, (state) => {
        state.validationLoading = true;
        state.validationError = null;
      })
      .addCase(validateTokenThunk.fulfilled, (state, action) => {
        state.validationLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
        state.validationError = null;
      })
      .addCase(validateTokenThunk.rejected, (state, action) => {
        state.validationLoading = false;
        state.validationError = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
        state.currentUser = null;
        // Token was invalid, so we've already removed it from storage
      });
  },
});

export const { logout, setCurrentUser } = authSlice.actions;

export default authSlice;
