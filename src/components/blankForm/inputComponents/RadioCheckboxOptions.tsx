import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { Button, IconButton } from "@mui/material";
import CropOriginalOutlined from "@mui/icons-material/CropOriginalOutlined";
import Close from "@mui/icons-material/Close";
import { formsActions } from "../../../store/formsSlice";
import selectQuestionsByFormId from "../../SelectedQuestionsByFormId";

export default function RadioCheckboxOptions({
  questionId,
}: {
  questionId: string;
}) {
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

  const removeOption = (questionId: string, optionIndex: number) => {
    if (currentFormId) {
      dispatch(
        formsActions.removeOption({
          id: currentFormId,
          questionId,
          optionIndex,
        })
      );
    }
  };
  const handleRadioChange = (optionIndex: number) => {
    if (currentFormId)
      dispatch(
        formsActions.setRadioOption({
          id: currentFormId,
          questionId,
          optionIndex,
        })
      );
  };
  const handleCheckboxChange = (optionIndex: number) => {
    if (currentFormId)
      dispatch(
        formsActions.toggleCheckbox({
          id: currentFormId,
          questionId,
          optionIndex,
        })
      );
  };
  //   const changeOptionValues = (text: string, i: number, j: number) => {
  //     dispatch(questionsActions.changeOptionValues({ text, i, j }));
  //   };
  const handleChangeOptionValue = (text: string, optionIndex: number) => {
    if (currentFormId)
      dispatch(
        formsActions.changeOptionValues({
          id: currentFormId,
          text,
          questionId,
          optionIndex,
        })
      );
  };
  //   const handleOptionToggle = (text: string, optionIndex: number) => {
  //     if (question.questionType === "radio") {
  //       dispatch(
  //         questionsActions.changeOptionValues({ text, i: index, j: optionIndex })
  //       );
  //     } else if (question.questionType === "checkbox") {
  //       dispatch(questionsActions.toggleCheckbox({ index, optionIndex }));
  //     }
  //   };
  const addOption = (questionId: string) => {
    if (currentFormId)
      dispatch(formsActions.addOption({ id: currentFormId, questionId }));
  };

  return (
    <>
      {question.options?.map((option, optionIndex) => (
        <div className="addQuestionBody flex items-center" key={optionIndex}>
          <input
            type={question.questionType}
            className="md:mr-5 mr-3"
            checked={
              question.questionType === "radio"
                ? question.selectedOptions?.[0] === option.optionText
                : question.selectedOptions?.includes(option.optionText)
            }
            onChange={() => {
              if (question.questionType === "radio") {
                handleRadioChange(optionIndex);
              } else if (question.questionType === "checkbox") {
                handleCheckboxChange(optionIndex);
              }
            }}
          />
          <div className="w-[70%]">
            <input
              type="text"
              placeholder="Option"
              value={option.optionText}
              onChange={(e) =>
                handleChangeOptionValue(e.target.value, optionIndex)
              }
              className="w-[94%] outline-none border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-2xl sm:text-xl text-lg"
            />
          </div>
          <IconButton>
            <CropOriginalOutlined sx={{ marginRight: 2 }} color="primary" />
          </IconButton>
          <IconButton onClick={() => removeOption(questionId, optionIndex)}>
            <Close color="warning" />
          </IconButton>
        </div>
      ))}

      {question.options && question.options.length < 5 && (
        <div className="addQuestionBody flex items-center px-3">
          <Button
            size="small"
            variant="outlined"
            onClick={() => addOption(question.id)}
          >
            Add option
          </Button>
        </div>
      )}
    </>
  );
}
  