import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { Button, IconButton } from "@mui/material";
import CropOriginalOutlined from "@mui/icons-material/CropOriginalOutlined";
import Close from "@mui/icons-material/Close";
import { questionsActions } from "../../../store/questionsSlice";

export default function RadioCheckboxOptions({ index }: { index: number }) {
  const dispatch = useDispatch();
  const questions = useSelector(
    (state: RootState) => state.questions.questions
  );
  const question = questions[index];

  const removeOption = (i: number, j: number) => {
    dispatch(questionsActions.removeOption({ i, j }));
  };
  const handleRadioChange = (optionIndex: number) => {
    dispatch(questionsActions.setRadioOption({ index, optionIndex }));
  };
  const handleCheckboxChange = (optionIndex: number) => {
    dispatch(questionsActions.toggleCheckbox({ index, optionIndex }));
  };
  //   const changeOptionValues = (text: string, i: number, j: number) => {
  //     dispatch(questionsActions.changeOptionValues({ text, i, j }));
  //   };
  const handleChangeOptionValue = (text: string, optionIndex: number) => {
    dispatch(
      questionsActions.changeOptionValues({ text, i: index, j: optionIndex })
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
  const addOption = (index: number) => {
    dispatch(questionsActions.addOption(index));
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
          <IconButton onClick={() => removeOption(index, optionIndex)}>
            <Close color="warning" />
          </IconButton>
        </div>
      ))}

      {question.options && question.options.length < 5 && (
        <div className="addQuestionBody flex items-center px-3">
          <Button
            size="small"
            variant="outlined"
            onClick={() => addOption(index)}
          >
            Add option
          </Button>
        </div>
      )}
    </>
  );
}
  

// export default function RadioCheckboxOptions({ index }: { index: number }) {
//   const dispatch = useDispatch();
//   const questions = useSelector(
//     (state: RootState) => state.questions.questions
//   );
//   const question = questions[index];

//   const removeOption = (i: number, j: number) => {
//     dispatch(questionsActions.removeOption({ i, j }));
//   };
//   const changeOptionValues = (text: string, i: number, j: number) => {
//     dispatch(questionsActions.changeOptionValues({ text, i, j }));
//   };
//   const addOption = (index: number) => {
//     dispatch(questionsActions.addOption(index));
//   };
//   return (
//     <>
//       {question.options?.map((option, optionIndex) => (
//         <div className="addQuestionBody flex items-center" key={optionIndex}>
//           <input
//             type={question.questionType}
//             className="md:mr-5 mr-3"
//             disabled={false} // Change based on your logic
//             checked={question.selectedOptions?.includes(option.optionText)} // Check if the option is selected
//             onChange={() => {
//               // Handle checkbox/radio selection change
//               if (question.questionType === "radio") {
//                 // Dispatch action for radio
//                 dispatch(
//                   questionsActions.selectRadioOption({ index, optionIndex })
//                 );
//               } else if (question.questionType === "checkbox") {
//                 // Dispatch action for checkbox
//                 dispatch(
//                   questionsActions.toggleCheckbox({ index, optionIndex })
//                 );
//               }
//             }}
//           />
//           <div className="w-[70%]">
//             <input
//               type="text"
//               placeholder="Option"
//               value={option.optionText}
//               onChange={(e) => {
//                 changeOptionValues(e.target.value, index, optionIndex);
//               }}
//               className="w-[94%] outline-none border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-2xl sm:text-xl text-lg"
//             />
//           </div>
//           <IconButton>
//             <CropOriginalOutlined sx={{ marginRight: 2 }} color="primary" />
//           </IconButton>
//           <IconButton
//             onClick={() => {
//               removeOption(index, optionIndex);
//             }}
//           >
//             <Close color="warning" />
//           </IconButton>
//         </div>
//       ))}

//       {question.options && question.options.length < 5 && (
//         <div className="addQuestionBody flex items-center px-3">
//           <Button
//             size="small"
//             variant="outlined"
//             onClick={() => {
//               addOption(index);
//             }}
//           >
//             Add option
//           </Button>
//         </div>
//       )}
//     </>
//   );
// }
