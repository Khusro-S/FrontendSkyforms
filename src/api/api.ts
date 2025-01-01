import axios from "axios";
import { Form } from "../store/formsSlice";

const API_URL = import.meta.env.VITE_API_URL;

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
