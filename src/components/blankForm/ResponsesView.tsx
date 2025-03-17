import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { AppDispatch } from "../../store/Store";
import { RootState } from "../../store/rootReducer";
import { fetchFormResponsesThunk } from "../../store/responsesSlice";
import { AnswerValue, FormResponse, Question } from "../../types/types";
import ActiveTabsViewForm from "../viewForm/ActiveTabsViewForm";

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
    <div className="section md:w-[800px] w-full mx-auto">
      <ActiveTabsViewForm activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="border border-solid border-purple bg-black rounded-xl p-5 md:space-y-5 space-y-4">
        {activeTab === "summary" && (
          <>
            <Typography variant="h5" className="text-white">
              {responses.length} Responses
            </Typography>
            {/* Summary section */}
            <div className="mb-8">
              <Typography variant="h6" className="text-white mb-4">
                Summary
              </Typography>

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
            <div>
              <Typography variant="h6" className="text-white mb-4">
                Individual Responses
              </Typography>

              {responses.map((response, index) => (
                <div
                  key={response.id}
                  className="border border-solid border-gray-700 rounded-lg p-4 mb-4"
                >
                  <Typography variant="subtitle1" className="text-white mb-2">
                    Response {index + 1}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-gray-400 block mb-4"
                  >
                    Submitted: {new Date(response.submittedAt).toLocaleString()}
                  </Typography>

                  {form.questions.map((question) => {
                    const answer = response.answers.find(
                      (a) => a.questionId === question.id
                    );
                    return (
                      <div key={question.id} className="mb-4">
                        <Typography variant="body2" className="text-white">
                          {question.questionText}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-gray-300 ml-2"
                        >
                          {formatAnswer(answer?.value, question.questionType)}
                        </Typography>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
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
    question.questionType === "radio" ||
    question.questionType === "checkbox"
  ) {
    return (
      <div className="mb-6">
        <Typography variant="subtitle1" className="text-white mb-2">
          {question.questionText}
        </Typography>

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
            <div key={option.optionText} className="mb-2">
              <div className="flex items-center">
                <Typography variant="body2" className="text-gray-300 w-1/3">
                  {option.optionText}
                </Typography>
                <div className="w-2/3">
                  <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-purple-600"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <span className="absolute top-0 left-2 text-white text-xs h-full flex items-center">
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
    <div className="mb-6">
      <Typography variant="subtitle1" className="text-white mb-2">
        {question.questionText}
      </Typography>
      <div className="pl-4 border-l-2 border-gray-700">
        {answers.length > 0 ? (
          answers.slice(0, 5).map((answer, index) => (
            <Typography
              key={index}
              variant="body2"
              className="text-gray-300 mb-1"
            >
              {formatAnswer(answer, question.questionType)}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" className="text-gray-500 italic">
            No answers yet
          </Typography>
        )}
        {answers.length > 5 && (
          <Typography variant="body2" className="text-gray-500 italic">
            + {answers.length - 5} more responses
          </Typography>
        )}
      </div>
    </div>
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
