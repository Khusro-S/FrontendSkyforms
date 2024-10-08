import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material";

import Theme from "../../theme/Theme";
import QuestionsUI from "./QuestionsUI";

interface Option {
  optionText: string;
}

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: Option[];
  open: boolean;
  required: boolean;
}
export default function QuestionsForm() {
  const getInitialFormData = () => {
    const savedFormData = localStorage.getItem("questionsFormData");
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        return {
          questions: parsedData.questions || [
            {
              id: crypto.randomUUID(),
              questionText: "Which flower is named after the sun?",
              questionType: "radio",
              options: [
                { optionText: "Lilies" },
                { optionText: "Roses" },
                { optionText: "Sunflowers" },
                { optionText: "Lavender" },
              ],
              open: true,
              required: false,
            },
          ],
          formTitle: parsedData.formTitle || "",
          formDescription: parsedData.formDescription || "",
        };
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        // If parsing fails, return default values
      }
    }
    // Default values if no saved data exists
    return {
      questions: [
        {
        id: crypto.randomUUID(),
          questionText: "Untitled Question",
          questionType: "radio",
          options: [{ optionText: "Untitled Option" }],
          open: true,
          required: false,
        },
      ],
      formTitle: "",
      formDescription: "",
    };
  };

  // Initialize form data from localStorage or defaults
  const initialFormData = getInitialFormData();

  // Set up state variables
  const [questions, setQuestions] = useState<Question[]>(
    initialFormData.questions
  );
  const [formTitle, setFormTitle] = useState(initialFormData.formTitle);
  const [formDescription, setFormDescription] = useState(
    initialFormData.formDescription
  );

  // useEffect to save form data to localStorage whenever it changes
  useEffect(() => {
    const formData = {
      questions,
      formTitle,
      formDescription,
    };
    try {
      localStorage.setItem("questionsFormData", JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving form data to localStorage:", error);
    }
  }, [questions, formTitle, formDescription]);

  return (
    <ThemeProvider theme={Theme}>
      <div className="questionform h-full pb-4 flex flex-col justify-center items-center px-5">
        <div className="section md:w-[800px] w-full space-y-5">
          <div className="questionTitleSection">
            <div className="questionFormTop border border-solid border-purple bg-black rounded-xl p-5 md:space-y-5 space-y-4">
              <input
                type="text"
                placeholder="Untitled Form"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full outline-none border-b border-solid border-purple focus:border-b-4 md:pb-2 pb-1 bg-black transition-all ease-linear duration-200 md:text-6xl sm:text-5xl text-4xl"
              />
              <input
                type="text"
                placeholder="Untitled Description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full outline-none border-b border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-4xl sm:text-3xl text-2xl"
              />
            </div>
          </div>

          <QuestionsUI questions={questions} setQuestions={setQuestions} />
        </div>
      </div>
    </ThemeProvider>
  );
}
