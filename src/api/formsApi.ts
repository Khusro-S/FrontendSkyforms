import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Form, Question } from "../types/types";
import { API_URL } from "./api";

// Assuming your API returns data wrapped in a "data" property
// interface ApiFormsResponse {
//   data: Form[];
// }

// interface ApiFormResponse {
//   data: Form;
// }

// interface ApiQuestionsResponse {
//   data: Question[];
// }

export const formsApi = createApi({
  reducerPath: "formsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Forms"], // Add tagTypes
  endpoints: (builder) => ({
    getForms: builder.query<Form[], void>({
      query: () => "/forms",
      // transformResponse: (response: ApiFormsResponse) => response.data,
      providesTags: ["Forms"],
    }),
    getFormById: builder.query<Form, string>({
      query: (formId) => `/forms/${formId}`,
      // transformResponse: (response: ApiFormResponse) => response.data,
      providesTags: (_, __, formId) => [{ type: "Forms", id: formId }],
    }),
    createForm: builder.mutation<Form, Form>({
      query: (form) => ({
        url: "/forms",
        method: "POST",
        body: form,
      }),
      invalidatesTags: ["Forms"],
    }),
    updateFormLastOpened: builder.mutation<
      void,
      { formId: string; lastOpened: string }
    >({
      query: ({ formId, lastOpened }) => ({
        url: `/forms/${formId}/lastOpened`,
        method: "PUT",
        body: { lastOpened },
      }),
      invalidatesTags: (_, __, { formId }) => [{ type: "Forms", id: formId }],
    }),
    updateFormQuestions: builder.mutation<
      Form,
      { formId: string; questions: Question[] }
    >({
      query: ({ formId, questions }) => ({
        url: `/forms/${formId}/questions`,
        method: "PUT",
        body: { questions },
      }),
      invalidatesTags: (_, __, { formId }) => [{ type: "Forms", id: formId }],
    }),
  }),
});

export const {
  useGetFormsQuery,
  useGetFormByIdQuery,
  useCreateFormMutation,
  useUpdateFormLastOpenedMutation,
  useUpdateFormQuestionsMutation,
} = formsApi;
