import { useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import RadioCheckboxOptions from "./RadioCheckboxOptions";
import FileUploadInput from "./FileUploadInput";
import AnswerInputs from "./AnswerInputs";
import selectQuestionsByFormId from "../../SelectedQuestionsByFormId";

export default function RenderInputComponents({
  questionId,
}: {
  questionId: string;
}) {
  const currentFormId = useSelector(
    (state: RootState) => state.forms.currentFormId
  );
  const questions = useSelector((state: RootState) =>
    currentFormId ? selectQuestionsByFormId(state, currentFormId) : []
  );
  const question = questions.find((q) => q.id === questionId);
  if (!question) {
    return <div>Question not found</div>;
  }
  // const question = useSelector(
  //   (state: RootState) => state.questions.questions[index]
  // );
  switch (question.questionType) {
    case "radio":
    case "checkbox":
      return <RadioCheckboxOptions questionId={questionId} />;
    case "fileUpload":
      return <FileUploadInput questionId={questionId} />;
    case "shortAnswer":
    case "longAnswer":
    case "date":
    case "phoneNumber":
      return <AnswerInputs questionId={questionId} />;
    default:
      return null;
  }
}
