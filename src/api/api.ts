import axios from "axios";
import { Form, FormResponse } from "../types/types";

export const API_URL = import.meta.env.VITE_API_URL;
export const RESPONSES_URL = import.meta.env.VITE_RESPONSES_URL;

export const fetchAllForms = async (): Promise<Form[]> => {
  const response = await axios.get(`${API_URL}/forms`);
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
