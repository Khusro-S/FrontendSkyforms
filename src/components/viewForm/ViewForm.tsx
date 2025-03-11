import { useDispatch, useSelector } from "react-redux";
import {
  // Accordion,
  // AccordionDetails,
  // AccordionSummary,
  Typography,
  FormControlLabel,
  // TextField,
  Button,
  Input,
} from "@mui/material";
// import { FileUpload } from '@mui/icons-material';
import { Form, Question, QuestionType } from "../../types/types";
import { RootState } from "../../store/rootReducer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFormByIdThunk } from "../../store/formsSlice";
import { AppDispatch } from "../../store/Store";
import FileUploadInputViewForm from "./FileUploadInputViewForm";
// import { FileUploadOutlined } from "@mui/icons-material";
// import FileUploadInput from "../blankForm/inputComponents/FileUploadInput";
// import AnswerInputs from "../blankForm/inputComponents/AnswerInputs";
type AnswerValue = string | string[] | File | number | Date | null;
interface Answer {
  question: Question;
  answer: AnswerValue;
  // onAnswerChange: (answer: AnswerValue) => void;
}

export default function ViewForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const { id: currentFormId } = useParams<{ id: string }>();
  // {
  //   console.log("currentform id by useParam", currentFormId);
  // }
  const [loading, setLoading] = useState(true);
  const [localForm, setLocalForm] = useState<Form | null>(null);
  // const [formValid, setFormValid] = useState(true);

  // Fetch from Redux store
  const reduxForm = useSelector((state: RootState) =>
    state.forms.forms.find((form) => form.id === currentFormId)
  );

  // Use both localForm and reduxForm
  const currentForm = localForm || reduxForm;

  // const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    if (currentFormId) {
      setLoading(true);

      // Dispatch the action to fetch the form
      dispatch(fetchFormByIdThunk(currentFormId))
        .unwrap() // Unwrap the promise to get the actual response
        .then((fetchedForm) => {
          // Set the fetched form to local state
          setLocalForm(fetchedForm);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching form:", error);
          setLoading(false);
        });
    }
  }, [dispatch, currentFormId]);

  useEffect(() => {
    if (currentForm && currentForm.questions) {
      const initialAnswers = currentForm.questions.map((question) => ({
        question: question,
        answer: null,
      }));
      setAnswers(initialAnswers);
    }
  }, [currentForm]);
  // const currentFormId = useSelector(
  //   (state: RootState) => state.forms.currentFormId
  // );
  // const currentForm = useSelector((state: RootState) =>
  //   state.forms.forms.find((form) => form.id === currentFormId)
  // );

  const handleAnswerChange = (question: Question, answer: AnswerValue) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((a) =>
        a.question.id === question.id ? { ...a, question: question, answer } : a
      )
    );
  };
  // const handleAnswerChange = (
  //   questionId: string,
  //   answer: string | string[] | FileData | number | null | Date
  // ) => {
  //   const existingAnswerIndex = answers.findIndex(
  //     (a) => a.questionId === questionId
  //   );
  //   if (existingAnswerIndex !== -1) {
  //     const updatedAnswers = [...answers];
  //     updatedAnswers[existingAnswerIndex].answer = answer;
  //     setAnswers(updatedAnswers);
  //   } else {
  //     setAnswers([...answers, { questionId, answer }]);
  //   }
  // };

  const validateForm = () => {
    if (!currentForm) return false;

    for (const question of currentForm.questions) {
      if (question.required) {
        const answer = answers.find(
          (a) => a.question.id === question.id
        )?.answer;
        if (
          answer === null ||
          answer === undefined ||
          (Array.isArray(answer) && answer.length === 0) ||
          (typeof answer === "string" && answer.trim() === "")
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    // setFormValid(isValid);

    if (isValid) {
      console.log("Answers:", answers);
      alert("Answers submitted!");
    } else {
      alert("Please fill in all required fields.");
    }
  };

  if (loading) {
    return <div>Laoding...</div>;
  }
  if (!currentForm) {
    return <div>Form not found.</div>;
  }
  return (
    <div className="form-fill h-full pb-4 flex flex-col justify-center items-center px-5">
      <div className="section md:w-[800px] w-full space-y-5">
        <div className="form-title-section">
          <div className="form-title border border-solid border-purple bg-black rounded-xl p-5 md:space-y-5 space-y-4">
            <Typography variant="h3" className="text-white">
              {currentForm.formTitle}
            </Typography>
            <Typography variant="h4" className="text-gray-400">
              {currentForm.formDescription}
            </Typography>
          </div>
        </div>

        {/* {currentForm.questions.map((question, index) => ( */}
        {currentForm.questions.map((question) => (
          <div
            key={question.id}
            className="border border-solid border-purple bg-black rounded-xl p-5 md:space-y-5 space-y-4"
          >
            <Typography color="warning" variant="h6">
              {question.required
                ? "* " + question.questionText
                : question.questionText}
            </Typography>
            <div className="flex flex-col gap-y-2 px-3">
              {question.questionType === QuestionType.RADIO ||
              question.questionType === QuestionType.CHECKBOX ? (
                <div className="flex flex-col">
                  {" "}
                  {/* Wrap options in a flex column */}
                  {question.options?.map((option, optionIndex) => (
                    <FormControlLabel
                      key={optionIndex}
                      control={
                        <input
                          type={question.questionType}
                          checked={
                            question.questionType === QuestionType.RADIO
                              ? answers.find(
                                  (a) => a.question.id === question.id
                                )?.answer === option.optionText
                              : (
                                  answers.find(
                                    (a) => a.question.id === question.id
                                  )?.answer as string[]
                                )?.includes(option.optionText)
                          }
                          onChange={(e) => {
                            if (question.questionType === QuestionType.RADIO) {
                              handleAnswerChange(question, option.optionText);
                            } else {
                              const currentAnswers =
                                (answers.find(
                                  (a) => a.question.id === question.id
                                )?.answer as string[]) || [];
                              if (e.target.checked) {
                                handleAnswerChange(question, [
                                  ...currentAnswers,
                                  option.optionText,
                                ]);
                              } else {
                                handleAnswerChange(
                                  question,
                                  currentAnswers.filter(
                                    (item) => item !== option.optionText
                                  )
                                );
                              }
                            }
                          }}
                        />
                      }
                      label={<Typography>{option.optionText}</Typography>}
                    />
                  ))}
                </div>
              ) : question.questionType === QuestionType.FILE_UPLOAD ? (
                <FileUploadInputViewForm
                  question={question}
                  answer={
                    answers.find((a) => a.question.id === question.id)
                      ?.answer as File | null
                  }
                  onAnswerChange={(file: File | null) =>
                    handleAnswerChange(question, file)
                  }
                />
              ) : (
                <AnswerInput
                  question={question}
                  answer={
                    answers.find((a) => a.question.id === question.id)
                      ?.answer ?? null
                  }
                  onAnswerChange={(answer) =>
                    handleAnswerChange(question, answer)
                  }
                />
              )}
            </div>
          </div>
        ))}

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}

function AnswerInput({
  question,
  answer,
  onAnswerChange,
}: {
  question: Question;
  answer: AnswerValue;
  onAnswerChange: (answer: AnswerValue) => void;
}) {
  return (
    <>
      {question.questionType === "shortAnswer" && (
        <Input
          type="text"
          className="w-full"
          required={question.required}
          value={answer || ""}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Short Answer"
        />
      )}

      {question.questionType === "longAnswer" && (
        <Input
          multiline
          className="w-full"
          required={question.required}
          placeholder="Long answer"
          value={answer || ""}
          onChange={(e) => onAnswerChange(e.target.value)}
        />
      )}

      {question.questionType === "date" && (
        <Input
          type="date"
          required={question.required}
          value={answer || ""}
          onChange={(e) => onAnswerChange(e.target.value)}
        />
      )}

      {question.questionType === "phoneNumber" && (
        <Input
          type="number"
          className="w-[]"
          required={question.required}
          value={answer || ""}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="552 XXX XX XX"
        />
      )}
    </>
  );
}
