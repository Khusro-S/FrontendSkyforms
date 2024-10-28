import { useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import RadioCheckboxOptions from "./RadioCheckboxOptions";
import FileUploadInput from "./FileUploadInput";
import AnswerInputs from "./AnswerInputs";

export default function RenderInputComponents({ index }: { index: number }) {
  const question = useSelector(
    (state: RootState) => state.questions.questions[index]
  );
  switch (question.questionType) {
    case "radio":
    case "checkbox":
      return <RadioCheckboxOptions index={index} />;
    case "fileUpload":
      return <FileUploadInput index={index} />;
    case "shortAnswer":
    case "longAnswer":
    case "date":
    case "phoneNumber":
      return <AnswerInputs index={index} />;
    default:
      return null;
  }
}
