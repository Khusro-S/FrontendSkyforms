import axios from "axios";
import { Form } from "../types/types";

export const API_URL = import.meta.env.VITE_API_URL;

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
  formId: string,
  formData: Form
): Promise<Form> => {
  const response = await axios.put(`${API_URL}/forms/${formId}`, formData);
  return response.data;
};

export const updateFormLastOpenedAPI = async (
  formId: string,
  lastOpened: string
): Promise<void> => {
  await axios.patch(`${API_URL}/forms/${formId}`, { lastOpened });
};

export const deleteFormAPI = async (formId: string): Promise<void> => {
  await axios.delete(`${API_URL}/forms/${formId}`);
};