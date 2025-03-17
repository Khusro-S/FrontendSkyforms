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
import { AnswerValue, Form, Question, QuestionType } from "../../types/types";
import { RootState } from "../../store/rootReducer";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFormByIdThunk, setError } from "../../store/formsSlice";
import { AppDispatch } from "../../store/Store";
import FileUploadInputViewForm from "./FileUploadInputViewForm";
import { submitFormResponseThunk } from "../../store/responsesSlice";
// import { FileUploadOutlined } from "@mui/icons-material";
// import FileUploadInput from "../blankForm/inputComponents/FileUploadInput";
// import AnswerInputs from "../blankForm/inputComponents/AnswerInputs";

interface Answer {
  question: Question;
  answer: AnswerValue;
  // onAnswerChange: (answer: AnswerValue) => void;
}

export default function ViewForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const { id: currentFormId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [localForm, setLocalForm] = useState<Form | null>(null);
  // const [formValid, setFormValid] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

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

  // const handleSubmit = () => {
  //   const isValid = validateForm();
  //   // setFormValid(isValid);

  //   if (isValid) {
  //     console.log("Answers:", answers);
  //     alert("Answers submitted!");
  //   } else {
  //     alert("Please fill in all required fields.");
  //   }
  // };
  const handleSubmit = () => {
    const isValid = validateForm();

    if (isValid && currentFormId) {
      // Format answers for API submission
      setLoading(true);
      setError(null);
      const formattedAnswers = answers.map((a) => ({
        questionId: a.question.id,
        value: a.answer,
      }));

      // Create response object
      const response = {
        id: crypto.randomUUID(),
        formId: currentFormId,
        answers: formattedAnswers,
        submittedAt: new Date().toISOString(),
      };
      // Dispatch the action to submit the response
      dispatch(submitFormResponseThunk(response))
        .unwrap()
        .then(() => {
          // Show success message to user
          // alert("Form submitted successfully!");
          setLoading(false);
          setFormSubmitted(true);
        })
        .catch((error) => {
          // Show error message
          setLoading(false);
          alert(`Error submitting form: ${error}`);
        });
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleClearForm = () => {
    // Reset all answers
    if (currentForm && currentForm.questions) {
      const initialAnswers = currentForm.questions.map((question) => ({
        question: question,
        answer: null,
      }));
      setAnswers(initialAnswers);
    }

    // Reset submission status
    setFormSubmitted(false);
  };

  if (loading) {
    return <div>Laoding...</div>;
  }
  if (!currentForm) {
    return <div>Form not found.</div>;
  }

  return (
    <div className="form-fill h-full pb-4 flex flex-col justify-center items-center px-5">
      {formSubmitted ? (
        // Success view after submission
        <div className="section md:w-[800px] w-full space-y-5 flex justify-center items-center min-h-screen">
          <div className="border border-solid border-green-500 bg-black rounded-xl p-5 md:space-y-5 space-y-4">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>

            <Typography variant="h3" className="text-white text-center">
              Form Submitted Successfully
            </Typography>

            <Typography variant="h4" className="text-gray-400 text-center">
              Thank you for your response!
            </Typography>

            <div className="flex justify-between items-center mt-6">
              <Button
                variant="contained"
                color="primary"
                onClick={handleClearForm}
                className="mr-4"
              >
                Submit Another Response
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/")} // Navigate to home or forms list
              >
                Back to Forms
              </Button>
            </div>
          </div>
        </div>
      ) : (
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
                              if (
                                question.questionType === QuestionType.RADIO
                              ) {
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

          <div className="flex items-center justify-between">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className="mr-4"
            >
              Submit
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearForm}
            >
              Clear Form
            </Button>
          </div>
        </div>
      )}
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
