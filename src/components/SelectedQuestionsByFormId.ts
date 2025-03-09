import { RootState } from "../store/rootReducer";

const selectQuestionsByFormId = (state: RootState, formId: string) => {
  const form = state.forms.forms.find((form) => form.id === formId);
  return form ? form.questions : [];
};

export default selectQuestionsByFormId;
