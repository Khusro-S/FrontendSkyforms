import axios, { AxiosError } from "axios";
import { Form, FormResponse, User } from "../types/types";

export const API_URL = import.meta.env.VITE_API_URL;
export const RESPONSES_URL = import.meta.env.VITE_RESPONSES_URL;
export const AUTH_URL = import.meta.env.VITE_AUTH_URL;

// export const fetchAllForms = async (): Promise<Form[]> => {
//   const response = await axios.get(`${API_URL}/forms`);
//   return response.data;
// };
export const fetchUserFormsAPI = async (userId: string): Promise<Form[]> => {
  const response = await axios.get(`${API_URL}/forms?userId=${userId}`);
  return response.data;
};

export const fetchFormByIdAPI = async (formId: string): Promise<Form> => {
  const response = await axios.get(`${API_URL}/forms/${formId}`);
  return response.data;
};

export const createFormAPI = async (formData: Form): Promise<Form> => {
  const response = await axios.post(`${API_URL}/forms`, formData);
  return response.data;
};

export const updateFormAPI = async (
  id: string,
  formData: Form
): Promise<Form> => {
  const response = await axios.put(`${API_URL}/forms/${id}`, formData);
  return response.data;
};

export const updateFormLastOpenedAPI = async (
  id: string,
  lastOpened: string
): Promise<void> => {
  await axios.patch(`${API_URL}/forms/${id}`, { lastOpened });
};

export const deleteFormAPI = async (formId: string): Promise<void> => {
  await axios.delete(`${API_URL}/forms/${formId}`);
};

export const updateFormTitleAPI = async (
  formId: string,
  formTitle: string
): Promise<void> => {
  await axios.patch(`${API_URL}/forms/${formId}`, { formTitle });
};

// New function for submitting form responses
export const submitFormResponseAPI = async (
  formResponse: Omit<FormResponse, "submittedAt">
): Promise<FormResponse> => {
  const response = await axios.post(
    `${RESPONSES_URL}/responses/`,
    formResponse
  );
  return response.data;
};

// Function to get all responses for a form
// export const fetchFormResponsesAPI = async (
//   id: string
// ): Promise<FormResponse[]> => {
//   const response = await axios.get(`${RESPONSES_URL}/responses/${id}`);
//   return response.data;
// };
export const fetchFormResponsesAPI = async (
  formId: string
): Promise<FormResponse[]> => {
  try {
    const response = await axios.get(
      `${RESPONSES_URL}/responses?formId=${formId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching form responses:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// Function to get a specific response
export const fetchResponseByIdAPI = async (
  id: string
  // responseId: string
): Promise<FormResponse> => {
  const response = await axios.get(`${RESPONSES_URL}/responses/${id}}`);
  return response.data;
};

export const deleteFormResponsesAPI = async (formId: string): Promise<void> => {
  // await axios.delete(`${RESPONSE_URL}/responses/${formId}`);
  await axios.delete(`${RESPONSES_URL}/responses/${formId}`);
};

// Auth APIs

// export const loginAPI = async (credentials: {
//   email: string;
//   password: string;
// }): Promise<{ token: string; user: User }> => {
//   try {
//     const response = await axios.get(`${AUTH_URL}/users`, {
//       params: { email: credentials.email, password: credentials.password },
//     });

//     if (response.data.length > 0) {
//       const userData = response.data[0].token;
//       return {
//         token: userData.token,
//         user: {
//           id: userData.id,
//           email: userData.email,
//         },
//       };
//     } else {
//       throw new Error("Invalid email or password");
//     }
//   } catch (error: unknown) {
//     let errorMessage = "Login failed";
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError;
//       if (
//         axiosError.response &&
//         axiosError.response.data &&
//         typeof axiosError.response.data === "object" &&
//         "message" in axiosError.response.data &&
//         typeof axiosError.response.data.message === "string"
//       ) {
//         errorMessage = axiosError.response.data.message;
//       } else {
//         errorMessage = "Login failed: server error"; // fallback error message
//       }
//     } else if (error instanceof Error) {
//       errorMessage = error.message;
//     }
//     throw new Error(errorMessage);
//   }
// };

// export const signupAPI = async (userData: {
//   email: string;
//   password: string;
//   confirmPassword: string;
// }): Promise<User> => {
//   try {
//     const existingUserResponse = await axios.get(
//       `${AUTH_URL}/users?email=${userData.email}`
//     );
//     if (existingUserResponse.data.length > 0) {
//       throw new Error("User already exists");
//     }
//     const response = await axios.post(`${AUTH_URL}/users`, {
//       email: userData.email,
//       password: userData.password,
//       // Generate token here if needed
//     });

//     // Return the created user object
//     return {
//       id: response.data.id,
//       email: response.data.email,
//       // Add other user fields as needed
//     };
//   } catch (error: unknown) {
//     let errorMessage = "Signup failed";
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError;
//       if (
//         axiosError.response &&
//         axiosError.response.data &&
//         typeof axiosError.response.data === "object" &&
//         "message" in axiosError.response.data &&
//         typeof axiosError.response.data.message === "string"
//       ) {
//         errorMessage = axiosError.response.data.message;
//       } else {
//         errorMessage = "Signup failed: server error"; // fallback error message
//       }
//     } else if (error instanceof Error) {
//       errorMessage = error.message;
//     }
//     throw new Error(errorMessage);
//   }
// };

// export const validateTokenAPI = async (): Promise<User> => {
//   try {
//     const token = sessionStorage.getItem("authToken");
//     if (!token) {
//       throw new Error("No token found");
//     }

//     // Call your backend API to validate the token
//     const response = await axios.get(`${AUTH_URL}/validate-token`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Return the user data from the response
//     return response.data;
//   } catch (error: unknown) {
//     let errorMessage = "Token validation failed";
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError;
//       if (
//         axiosError.response &&
//         axiosError.response.data &&
//         typeof axiosError.response.data === "object" &&
//         "message" in axiosError.response.data &&
//         typeof axiosError.response.data.message === "string"
//       ) {
//         errorMessage = axiosError.response.data.message;
//       }
//     } else if (error instanceof Error) {
//       errorMessage = error.message;
//     }
//     throw new Error(errorMessage);
//   }
// };

export const loginAPI = async (credentials: {
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> => {
  try {
    const response = await axios.get(`${AUTH_URL}/users`, {
      params: { email: credentials.email, password: credentials.password },
    });

    if (response.data.length > 0) {
      const userData = response.data[0];
      return {
        token: userData.token,
        user: {
          id: userData.id,
          email: userData.email,
          token: userData.token,
        },
      };
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error: unknown) {
    let errorMessage = "Login failed";
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === "object" &&
        "message" in axiosError.response.data &&
        typeof axiosError.response.data.message === "string"
      ) {
        errorMessage = axiosError.response.data.message;
      } else {
        errorMessage = "Login failed: server error";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const signupAPI = async (userData: {
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<User> => {
  try {
    const existingUserResponse = await axios.get(
      `${AUTH_URL}/users?email=${userData.email}`
    );
    if (existingUserResponse.data.length > 0) {
      throw new Error("User already exists");
    }

    const token = Math.random().toString(36).substring(2); // Generate a mock token
    const response = await axios.post(`${AUTH_URL}/users`, {
      email: userData.email,
      password: userData.password,
      token: token, // Include the generated token
    });

    return {
      id: response.data.id,
      email: response.data.email,
      token: token, // Return the generated token
    };
  } catch (error: unknown) {
    let errorMessage = "Signup failed";
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === "object" &&
        "message" in axiosError.response.data &&
        typeof axiosError.response.data.message === "string"
      ) {
        errorMessage = axiosError.response.data.message;
      } else {
        errorMessage = "Signup failed: server error";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};
export const validateTokenAPI = async (): Promise<{
  token: string;
  user: User;
}> => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${AUTH_URL}/users`);
    const user = response.data.find((user: User) => user.token === token);

    if (!user) {
      throw new Error("Invalid token");
    }

    return {
      token: token,
      user: { id: user.id, email: user.email, token: user.token },
    };
  } catch (error: unknown) {
    let errorMessage = "Token validation failed";
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === "object" &&
        "message" in axiosError.response.data &&
        typeof axiosError.response.data.message === "string"
      ) {
        errorMessage = axiosError.response.data.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

// export const loginAPI = async (credentials: {
//   email: string;
//   password: string;
// }): Promise<string> => {
//   try {
//     const response = await axios.get(`${AUTH_URL}/users`, {
//       params: { email: credentials.email, password: credentials.password },
//     });

//     if (response.data.length > 0) {
//       return response.data[0].token;
//     } else {
//       throw new Error("Invalid email or password");
//     }
//   } catch (error) {
//     console.error("Login failed:", error);
//     throw error; // Rethrow the error to be handled by the caller
//   }
// };

// export const signupAPI = async (userData: {
//   email: string;
//   password: string;
//   confirmPassword: string;
// }): Promise<void> => {
//   try {
//     const existingUserResponse = await axios.get(
//       `${AUTH_URL}/users?email=${userData.email}`
//     );
//     if (existingUserResponse.data.length > 0) {
//       throw new Error("User already exists");
//     }
//     const token = generateToken(userData.email);

//     await axios.post(`${API_URL}/users`, {
//       email: userData.email,
//       password: userData.password,
//       token: token,
//     });
//   } catch (error) {
//     console.error("Signup failed:", error);
//     throw error; // Rethrow the error to be handled by the caller
//   }
// };

// const generateToken = (email: string): string => {
//   // Simple token generation using Base64 encoding of the email and a timestamp
//   return Buffer.from(`${email}:${Date.now()}`).toString("base64");
// };
