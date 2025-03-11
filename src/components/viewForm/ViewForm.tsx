import { useDispatch, useSelector } from "react-redux";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  FormControlLabel,
  TextField,
  Button,
} from "@mui/material";
// import { FileUpload } from '@mui/icons-material';
import { FileData, Form, QuestionType } from "../../types/types";
import { RootState } from "../../store/rootReducer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFormByIdThunk } from "../../store/formsSlice";
import { AppDispatch } from "../../store/Store";

interface Answer {
  questionId: string;
  answer: string | string[] | FileData | number | null | Date;
}

export default function ViewForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { id: currentFormId } = useParams<{ id: string }>();
  {
    console.log("currentform id by useParam", currentFormId);
  }
  const [loading, setLoading] = useState(true);
  const [localForm, setLocalForm] = useState<Form | null>(null);

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
  // const currentFormId = useSelector(
  //   (state: RootState) => state.forms.currentFormId
  // );
  // const currentForm = useSelector((state: RootState) =>
  //   state.forms.forms.find((form) => form.id === currentFormId)
  // );

  const [answers, setAnswers] = useState<Answer[]>([]);

  if (!currentForm) {
    return <div>Form not found.</div>;
  }

  const handleAnswerChange = (
    questionId: string,
    answer: string | string[] | FileData | number | null | Date
  ) => {
    const existingAnswerIndex = answers.findIndex(
      (a) => a.questionId === questionId
    );
    if (existingAnswerIndex !== -1) {
      const updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex].answer = answer;
      setAnswers(updatedAnswers);
    } else {
      setAnswers([...answers, { questionId, answer }]);
    }
  };

  const handleSubmit = () => {
    // Process answers here
    console.log("Submitted answers:", answers);
    // You can send the answers to your backend or perform other actions
  };

  return (
    <div className="form-fill h-full pb-4 flex flex-col justify-center items-center px-5">
      <div className="section md:w-[800px] w-full space-y-5">
        <div className="form-title-section">
          <div className="form-title border border-solid border-purple bg-black rounded-xl p-5 md:space-y-5 space-y-4">
            <Typography variant="h4" className="text-white">
              {currentForm.formTitle}
            </Typography>
            <Typography variant="subtitle1" className="text-gray-400">
              {currentForm.formDescription}
            </Typography>
          </div>
        </div>

        {/* {currentForm.questions.map((question, index) => ( */}
        {currentForm.questions.map((question) => (
          <Accordion key={question.id} defaultExpanded className="md:p-3 p-1">
            <AccordionSummary>
              <Typography color="warning">
                {question.required
                  ? "* " + question.questionText
                  : question.questionText}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-col gap-y-2 px-3">
                {question.questionType === QuestionType.RADIO ||
                question.questionType === QuestionType.CHECKBOX ? (
                  question.options?.map((option, optionIndex) => (
                    <FormControlLabel
                      key={optionIndex}
                      control={
                        <input
                          type={question.questionType}
                          name={question.id}
                          value={option.optionText}
                          onChange={() => {
                            const selectedOptions =
                              question.questionType === QuestionType.CHECKBOX
                                ? answers.find(
                                    (a) => a.questionId === question.id
                                  )?.answer
                                : [];
                            if (
                              question.questionType === QuestionType.CHECKBOX
                            ) {
                              if (
                                (selectedOptions as string[]).includes(
                                  option.optionText
                                )
                              ) {
                                handleAnswerChange(
                                  question.id,
                                  (selectedOptions as string[]).filter(
                                    (item) => item !== option.optionText
                                  )
                                );
                              } else {
                                handleAnswerChange(question.id, [
                                  ...(selectedOptions as string[]),
                                  option.optionText,
                                ]);
                              }
                            } else {
                              handleAnswerChange(
                                question.id,
                                option.optionText
                              );
                            }
                          }}
                        />
                      }
                      label={<Typography>{option.optionText}</Typography>}
                    />
                  ))
                ) : question.questionType === QuestionType.SHORT_ANSWER ||
                  question.questionType === QuestionType.LONG_ANSWER ? (
                  <TextField
                    multiline={
                      question.questionType === QuestionType.LONG_ANSWER
                    }
                    rows={
                      question.questionType === QuestionType.LONG_ANSWER ? 4 : 1
                    }
                    placeholder="Your answer"
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                  />
                ) : question.questionType === QuestionType.FILE_UPLOAD ? (
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const fileData: FileData = {
                          name: file.name,
                          size: file.size,
                          type: file.type,
                          url: URL.createObjectURL(file),
                        };
                        handleAnswerChange(question.id, fileData);
                      }
                    }}
                  />
                ) : question.questionType === QuestionType.DATE ? (
                  <TextField
                    type="date"
                    onChange={(e) => {
                      handleAnswerChange(question.id, new Date(e.target.value));
                    }}
                  />
                ) : question.questionType === QuestionType.PHONE_NUMBER ? (
                  <TextField
                    type="number"
                    placeholder="Phone number"
                    onChange={(e) => {
                      handleAnswerChange(question.id, Number(e.target.value));
                    }}
                  />
                ) : null}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
