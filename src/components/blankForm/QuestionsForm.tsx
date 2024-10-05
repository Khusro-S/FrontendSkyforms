import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material";

import Theme from "../../theme/Theme";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { DropResult } from "@hello-pangea/dnd";
import QuestionsUI from "./QuestionsUI";

interface Option {
  optionText: string;
}

interface Question {
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

  const reorder = (
    list: Question[],
    startIndex: number,
    endIndex: number
  ): Question[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    const itemgg = [...questions];
    const itemF = reorder(
      itemgg,
      result.source.index,
      result.destination.index
    );
    setQuestions(itemF);
  }

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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <QuestionsUI
                      questions={questions}
                      setQuestions={setQuestions}
                    />
                    {provided.placeholder}
                  </div>
                  {/* <Draggable draggableId="draggable" index={0}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        Drag me!
                      </div>
                    )}
                  </Draggable> */}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {/* {QuestionsUI()} */}
        </div>
      </div>
    </ThemeProvider>
  );
}
