import axios from "axios";

const API_URL = "http://localhost:4000";

export const fetchForms = async () => {
  const response = await axios.get(`${API_URL}/forms`);
    return response.data;
};

export const fetchFormById = async (formId: string) => {
  const response = await axios.get(`${API_URL}/forms/${formId}`);
  return response.data;
};
