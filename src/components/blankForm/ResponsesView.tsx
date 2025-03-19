import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Button, FormControlLabel, Input, Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { AppDispatch } from "../../store/Store";
import { RootState } from "../../store/rootReducer";
import { fetchFormResponsesThunk } from "../../store/responsesSlice";
import {
  AnswerValue,
  FormResponse,
  Question,
  QuestionType,
} from "../../types/types";
import ActiveTabsViewForm from "../viewForm/ActiveTabsViewForm";
// import FileDisplay from "./inputComponents/FileDisplay";
// import FileUploadInputViewForm from "../viewForm/FileUploadInputViewForm";

export default function ResponsesView() {
  const dispatch = useDispatch<AppDispatch>();
  const { id: formId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("summary");

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  // Get form data from Redux
  const form = useSelector((state: RootState) =>
    state.forms.forms.find((form) => form.id === formId)
  );

  // Get responses for this form
  //   const responses = useSelector((state: RootState) =>
  //     state.responses.responses.filter((response) => response.id === formId)
  //   );
  const responses = useSelector((state: RootState) =>
    state.responses.responses.filter((response) => response.formId === formId)
  );

  useEffect(() => {
    if (formId) {
      setLoading(true);
      dispatch(fetchFormResponsesThunk(formId))
        .unwrap()
        .then(() => setLoading(false))
        .catch((error) => {
          console.error("Error fetching responses:", error);
          setLoading(false);
        });
    }
  }, [dispatch, formId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center p-4">
        <Typography variant="h5">Form not found</Typography>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="section md:w-[800px] w-full mx-auto">
        <div className="border border-solid border-purple bg-black rounded-xl p-5 md:space-y-5 space-y-4">
          <Typography variant="h5" className="text-white text-center">
            No responses yet
          </Typography>
          <Typography variant="body1" className="text-gray-400 text-center">
            When users submit responses, they will appear here.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="section md:w-[800px] w-full mx-auto px-5">
      <ActiveTabsViewForm
        activeTab={activeTab}
        onTabChange={handleTabChange}
        noOfResponses={responses.length}
      />
      <div className="">
        {activeTab === "summary" && (
          <>
            {/* <Typography variant="h5" className="text-white">
              {responses.length} Responses
            </Typography> */}
            {/* Summary section */}
            <div className="mb-8">
              {/* <Typography variant="h6" className="text-white mb-4">
                Summary
              </Typography> */}

              {/* We'll show a summary of responses for each question */}
              {form.questions.map((question) => (
                <ResponseSummary
                  key={question.id}
                  question={question}
                  responses={responses}
                />
              ))}
            </div>
          </>
        )}
        {activeTab === "individual" && (
          <>
            {/* Individual responses section */}
            {/* <Typography variant="h6" className="text-white mb-4">
                Individual Responses
              </Typography> */}
            <IndividualResponses
              responses={responses}
              formQuestions={form.questions}
            />
            {/* <div className="">

              {responses.map((response, index) => (
                <div
                  key={response.id}
                  className="border border-solid border-purple bg-black rounded-2xl p-5 mb-4"
                >
                  <Typography variant="h5" className="text-white mb-2">
                    Response {index + 1}
                  </Typography>
                  <Typography variant="body1" className="mb-4">
                    Submitted: {new Date(response.submittedAt).toLocaleString()}
                  </Typography>

                  {form.questions.map((question) => {
                    const answer = response.answers.find(
                      (a) => a.questionId === question.id
                    );
                    return (
                      <div key={question.id} className="mb-4">

                        <h2 className="text-2xl">{question.questionText}</h2>

                        <Typography variant="h6" className="text-gray-300 ml-2">
                          {formatAnswer(answer?.value, question.questionType)}
                        </Typography>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}

// Helper component for rendering response summaries
function ResponseSummary({
  question,
  responses,
}: {
  question: Question;
  responses: FormResponse[];
}) {
  // Extract all answers for this question
  const answers = responses
    .map(
      (response) =>
        response.answers.find((a) => a.questionId === question.id)?.value
    )
    .filter(Boolean);

  // For multiple choice questions, we'll show percentages
  if (
    question.questionType === QuestionType.RADIO ||
    question.questionType === QuestionType.CHECKBOX
  ) {
    return (
      <div className="mb-6 border border-solid border-purple bg-black rounded-2xl p-5">
        {/* <Typography variant="h1" className="text-white mb-2 text-2xl"> */}
        <h2 className="text-2xl">{question.questionText}</h2>
        {/* </Typography> */}

        {question.options?.map((option) => {
          const count = answers.filter(
            (answer) =>
              answer === option.optionText ||
              (Array.isArray(answer) && answer.includes(option.optionText))
          ).length;

          const percentage =
            responses.length > 0
              ? Math.round((count / responses.length) * 100)
              : 0;

          return (
            <div key={option.optionText} className="mb-2 ">
              <div className="flex items-center">
                {/* <Typography variant="body2" className="text-gray-300 w-1/3"> */}
                <h2 className="w-1/3 text-xl">{option.optionText}</h2>
                {/* </Typography> */}
                <div className="w-2/3">
                  <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-purple"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <span className="absolute top-0 left-2 text-black text-xs h-full flex items-center">
                      {count} ({percentage}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // For text questions, we'll show a list of answers
  return (
    <div className="mb-6 border border-solid border-purple bg-black rounded-2xl p-5">
      {/* <Typography variant="subtitle1" className="text-white mb-2"> */}
      <h2 className=" text-2xl">{question.questionText}</h2>
      <p className="mb-2">
        {answers.length} {answers.length > 1 ? "Responses" : "Response"}
      </p>
      {/* </Typography> */}
      {/* <div className="pl-4 border-l-2 flex flex-col gap-3 max-h-44 overflow-y-scroll"> */}
      <div className=" flex flex-col gap-3 max-h-44 overflow-y-scroll pr-4">
        {answers.length > 0 ? (
          answers.map((answer, index) => (
            <Typography
              key={index}
              variant="h6"
              className=" mb-1 bg-gray-700  p-2 rounded-xl"
            >
              {formatAnswer(answer, question.questionType)}
            </Typography>
          ))
        ) : (
          // answers.slice(0, 5).map((answer, index) => (
          // <Typography key={index} variant="h6" className="text-gray-300 mb-1">
          //   {formatAnswer(answer, question.questionType)}
          // </Typography>
          // ))
          <Typography variant="h6" className="text-gray-500 italic">
            No answers yet
          </Typography>
        )}
        {/* {answers.length > 5 && (
          <Typography variant="body2" className="text-gray-500 italic">
            + {answers.length - 5} more responses
          </Typography>
        )} */}
      </div>
    </div>
  );
}

function IndividualResponses({
  responses,
  formQuestions,
}: {
  responses: FormResponse[];
  formQuestions: Question[];
}) {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, responses.length - 1));
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  if (responses.length === 0) {
    return <Typography variant="body1">No responses yet.</Typography>;
  }

  const currentResponse = responses[currentPage];

  return (
    <div className="">
      <div className=" md:space-y-5 space-y-4">
        <div className="border border-solid border-purple bg-black rounded-xl p-5">
          <Typography variant="h5" className="text-white mb-2">
            Response {currentPage + 1} of {responses.length}
          </Typography>
          <Typography variant="body1" className="mb-4">
            Submitted: {new Date(currentResponse.submittedAt).toLocaleString()}
          </Typography>
        </div>
        {formQuestions.map((question) => {
          const answer = currentResponse.answers.find(
            (a) => a.questionId === question.id
          )?.value;
          return (
            <div
              key={question.id}
              className="mb-4 border border-solid border-purple bg-black rounded-xl p-5"
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
                    {question.options?.map((option, optionIndex) => (
                      <FormControlLabel
                        key={optionIndex}
                        control={
                          <input
                            type={question.questionType}
                            checked={
                              question.questionType === QuestionType.RADIO
                                ? answer === option.optionText
                                : (answer as string[])?.includes(
                                    option.optionText
                                  )
                            }
                            readOnly // Make options read-only
                            // disabled
                          />
                        }
                        label={<Typography>{option.optionText}</Typography>}
                      />
                    ))}
                  </div>
                ) : question.questionType === QuestionType.FILE_UPLOAD ? (
                  // <FileDisplay answer={answer as File | null} />
                  <p>{formatAnswer(answer, question.questionType)}</p>
                ) : (
                  // <p>FIle inpute</p>
                  <AnswerInput
                    question={question}
                    answer={answer ?? null}
                    readOnly
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between my-5">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          variant="contained"
          color="primary"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentPage === responses.length - 1}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function AnswerInput({
  question,
  answer,
  readOnly,
}: {
  question: Question;
  answer: AnswerValue;
  readOnly: boolean;
}) {
  return (
    <>
      {question.questionType === "shortAnswer" && (
        <Input
          type="text"
          className="w-full"
          value={answer || ""}
          readOnly={readOnly}
          placeholder="Short Answer"
        />
      )}

      {question.questionType === "longAnswer" && (
        <Input
          multiline
          className="w-full"
          placeholder="Long answer"
          value={answer || ""}
          readOnly={readOnly}
        />
      )}

      {question.questionType === "date" && (
        <Input type="date" value={answer || ""} readOnly={readOnly} />
      )}

      {question.questionType === "phoneNumber" && (
        <Input
          type="number"
          className="w-[]"
          value={answer || ""}
          readOnly={readOnly}
          placeholder="552 XXX XX XX"
        />
      )}
    </>
  );
}

// Helper function to format answers based on question type
function formatAnswer(value: AnswerValue, questionType: string): string {
  if (value === null || value === undefined) return "No answer";

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (questionType === "date" && typeof value === "string") {
    return new Date(value).toLocaleDateString();
  }

  if (
    questionType === "fileUpload" &&
    typeof value === "object" &&
    value !== null &&
    "name" in value
  ) {
    return (value as { name: string }).name || "Upload file";
  }

  return String(value);
}
