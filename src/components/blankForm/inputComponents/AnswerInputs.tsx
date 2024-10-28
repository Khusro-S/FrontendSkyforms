import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { questionsActions } from "../../../store/questionsSlice";
import { Input } from "@mui/material";

export default function AnswerInputs({ index }: { index: number }) {
  const dispatch = useDispatch();
  const question = useSelector(
    (state: RootState) => state.questions.questions[index]
  );

  // Function to handle input change and dispatch based on question type
  const handleInputChange = (value: string | number) => {
    switch (question.questionType) {
      case "shortAnswer":
        dispatch(
          questionsActions.changeShortAnswer({ answer: String(value), index })
        );
        break;
      case "longAnswer":
        dispatch(
          questionsActions.changeLongAnswer({ answer: String(value), index })
        );
        break;
      case "date":
        dispatch(questionsActions.changeDate({ date: String(value), index }));
        break;
      case "phoneNumber":
        // const phoneNumber = typeof value === 'string' ? parseInt(value, 10) : value;
        // dispatch(questionsActions.changePhoneNumber({ number: isNaN(phoneNumber) ? null : phoneNumber, index }));
        dispatch(
          questionsActions.changePhoneNumber({ number: Number(value), index })
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
