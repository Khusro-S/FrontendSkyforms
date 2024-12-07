import { RootState } from "../store/rootReducer";

const selectQuestionsByFormId = (state: RootState, formId: string) => {
  const form = state.forms.forms.find((form) => form.formId === formId);
  return form ? form.questions : [];
};

export default selectQuestionsByFormId;
