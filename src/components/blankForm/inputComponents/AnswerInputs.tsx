import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { formsActions } from "../../../store/formsSlice";
import { Input } from "@mui/material";
import selectQuestionsByFormId from "../../SelectedQuestionsByFormId";

export default function AnswerInputs({ questionId }: { questionId: string }) {
  const dispatch = useDispatch();
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

  // Function to handle input change and dispatch based on question type
  const handleInputChange = (value: string | number) => {
    switch (question.questionType) {
      case "shortAnswer":
        dispatch(
          formsActions.changeShortAnswer({
            id: currentFormId,
            answer: String(value),
            questionId: question.id,
          })
        );
        break;
      case "longAnswer":
        dispatch(
          formsActions.changeLongAnswer({
            id: currentFormId,
            answer: String(value),
            questionId: question.id,
          })
        );
        break;
      case "date":
        dispatch(
          formsActions.changeDate({
            id: currentFormId,
            date: String(value),
            questionId: question.id,
          })
        );
        break;
      case "phoneNumber":
        // const phoneNumber = typeof value === 'string' ? parseInt(value, 10) : value;
        // dispatch(questionsActions.changePhoneNumber({ number: isNaN(phoneNumber) ? null : phoneNumber, index }));
        dispatch(
          formsActions.changePhoneNumber({
            id: currentFormId,
            number: Number(value),
            questionId: question.id,
          })
        );
        break;
      default:
        break;
    }
  };
  return (
    <>
      {question.questionType === "shortAnswer" && (
        <Input
          type="text"
          value={question.shortAnswer || ""}
          onChange={(e) => {
            handleInputChange(e.target.value);
          }}
          placeholder="Short Answer"
          // className="w-[95%] outline-none border-b border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-2xl sm:text-xl text-lg"
        />
      )}

      {question.questionType === "longAnswer" && (
        <Input
          multiline
          placeholder="Long answer"
          value={question.longAnswer || ""}
          onChange={(e) => handleInputChange(e.target.value)}
        />
      )}

      {question.questionType === "date" && (
        <Input
          type="date"
          value={question.date || ""}
          onChange={(e) => {
            handleInputChange(e.target.value);
          }}
          // className="sm:w-[25%] w-[33%] outline-none border-b border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-2xl sm:text-xl text-lg text-purple"
        />
      )}

      {question.questionType === "phoneNumber" && (
        <Input
          type="number"
          value={question.phoneNumber || ""}
          onChange={(e) => {
            handleInputChange(e.target.value);
          }}
          placeholder="552 XXX XX XX"
          // className="w-[95%] outline-none border-b border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-2xl sm:text-xl text-lg"
        />
      )}
    </>
  );
}
