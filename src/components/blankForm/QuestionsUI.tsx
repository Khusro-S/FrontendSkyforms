import Typography from "@mui/material/Typography";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Select,
  MenuItem,
  Switch,
  Button,
  IconButton,
  useMediaQuery,
  SelectChangeEvent,
} from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ShortText from "@mui/icons-material/ShortText";
import Subject from "@mui/icons-material/Subject";
import CropOriginalOutlined from "@mui/icons-material/CropOriginalOutlined";
import Close from "@mui/icons-material/Close";
import FilterNone from "@mui/icons-material/FilterNone";
import Delete from "@mui/icons-material/Delete";
// import NorthEast from "@mui/icons-material/NorthEast";
// import MoreVertOutlined from "@mui/icons-material/MoreVertOutlined";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import TextFields from "@mui/icons-material/TextFields";
import { useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import { DropResult } from "@hello-pangea/dnd";
import DragIndicator from "@mui/icons-material/DragIndicator";

interface Option {
  optionText: string;
}

interface Question {
  id: string;
  questionText: string;
  questionType: string; // Can be refined to an enum or specific types
  options: Option[];
  open: boolean;
  required: boolean;
}

// Define the prop types for the child component
interface QuestionUIProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

function QuestionsUI({ questions, setQuestions }: QuestionUIProps) {
  const [questionTypeSelect, setQuestionTypeSelect] =
    useState("Multiple Choice");

  const handleChange = (event: SelectChangeEvent) => {
    setQuestionTypeSelect(event.target.value);
  };

  const lastQuestionRef = useRef<HTMLDivElement | null>(null);

  const prevQuestionsLength = useRef<number>(questions.length);

  useEffect(() => {
    if (questions.length > prevQuestionsLength.current) {
      if (lastQuestionRef.current) {
        lastQuestionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
    prevQuestionsLength.current = questions.length;
  }, [questions.length]);
  function changeQuestion(text: string, index: number) {
    const newQuestion = [...questions];
    newQuestion[index].questionText = text;
    setQuestions(newQuestion);
    // console.log(newQuestion);
  }
  function addQuestionType(index: number, type: string) {
    const qs = [...questions];
    console.log(type);
    qs[index].questionType = type;
    setQuestions(qs);
  }
  function changeOptionValues(text: string, i: number, j: number) {
    const optionsQuestion = [...questions];
    optionsQuestion[i].options[j].optionText = text;
    setQuestions(optionsQuestion);
  }
  function removeOption(i: number, j: number) {
    const removeOptionQuestion = [...questions];
    if (removeOptionQuestion[i].options.length > 1) {
      removeOptionQuestion[i].options.splice(j, 1);
      setQuestions(removeOptionQuestion);
    }
  }
  //   function addOption(index: number) {
  //     const optionsOfQuestion = [...questions];
  //     if (optionsOfQuestion[index].options.length < 5) {
  //       optionsOfQuestion[index].options.push({
  //         optionText: "Untitled option",
  //       });
  //     } else {
  //       console.log("max 5 options");
  //     }
  //     setQuestions(optionsOfQuestion);
  //   }
  function addOption(questionIndex: number) {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      const currentQuestion = updatedQuestions[questionIndex];

      if (currentQuestion.options.length < 5) {
        currentQuestion.options = [
          ...currentQuestion.options,
          { optionText: "Untitled option" },
        ];

        updatedQuestions[questionIndex] = {
          ...currentQuestion,
          options: [...currentQuestion.options],
        };
      }

      return updatedQuestions;
    });
  }

  //   function copyQuestion(index: number) {
  //     const qs = [...questions];
  //     const newQuestion = qs[index];
  //     setQuestions([...questions, newQuestion]);
  //   }
  function copyQuestion(index: number) {
    expandCloseAll();
    const newQuestions = [...questions];
    const questionToCopy = newQuestions[index];
    const newQuestion = {
      ...questionToCopy,
      id: crypto.randomUUID(),
      options: questionToCopy.options.map((option) => ({ ...option })),
      open: true,
    };

    setQuestions([...newQuestions, newQuestion]);
  }
  function deleteQuestion(index: number) {
    const qs = [...questions];
    if (questions.length > 1) {
      qs.splice(index, 1);
    }
    setQuestions(qs);
  }
  function requiredQuestion(index: number) {
    const reqQuestion = [...questions];
    reqQuestion[index].required = !reqQuestion[index].required;
    setQuestions(reqQuestion);
  }
  function addMoreQuestionFiled() {
    expandCloseAll();
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        questionText: "Untitled Question",
        questionType: "radio",
        options: [{ optionText: "Untitled option" }],
        required: false,
        open: true,
      },
    ]);
  }

  const isSmallScreen = useMediaQuery("(max-width:600px)"); // Example for small screen (mobile)
  // const isMediumScreen = useMediaQuery(
  //   "(min-width:601px) and (max-width:960px)"
  // ); // Example for medium screen (tablet)

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

  function expandCloseAll() {
    const qs = [...questions];
    for (let index = 0; index < qs.length; index++) {
      qs[index].open = false;
    }
    setQuestions(qs);
  }

  function handleExpand(i: number) {
    const qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      if (i === j) {
        qs[i].open = true;
      } else {
        qs[j].open = false;
      }
    }
    setQuestions(qs);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="questions-droppable">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="questions-container" // Optional: Add your styles
          >
            {questions.map((question, index) => (
              <Draggable
                key={question.id}
                draggableId={question.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="question-item mb-4 "
                  >
                    <div className="mb-0 relative group">
                      {/* <div className="w-full m-0 p-0 flex justify-center items-center"> */}
                      {question.open && (
                        <DragIndicator className="cursor-move rotate-90 absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-2 z-10" />
                      )}
                      {/* <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-200"> */}
                      <DragIndicator className="cursor-move rotate-90 absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-2 z-10 group-hover:opacity-100 opacity-0 transition-opacity duration-200" />
                      {/* </div> */}

                      {/* </div> */}
                      <Accordion
                        key={index}
                        expanded={question.open}
                        slotProps={{ transition: { unmountOnExit: true } }}
                        className="md:p-3 p-1"
                        onChange={() => handleExpand(index)}
                      >
                        <div
                          key={index}
                          ref={
                            index === questions.length - 1
                              ? lastQuestionRef
                              : null
                          }
                        >
                          {!question.open && (
                            <>
                              <AccordionSummary>
                                <Typography>
                                  {question.required
                                    ? "* " + question.questionText
                                    : question.questionText}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="flex flex-col gap-y-2 px-3">
                                  {question.options.map(
                                    (option, optionIndex) => (
                                      <FormControlLabel
                                        key={optionIndex}
                                        disabled
                                        control={
                                          <input
                                            type={question.questionType}
                                            // required={question.required}
                                            className="mr-5"
                                          />
                                        }
                                        label={
                                          <Typography>
                                            {option.optionText}
                                          </Typography>
                                        }
                                      />
                                    )
                                  )}
                                </div>
                              </AccordionDetails>
                            </>
                          )}
                          {question.open && (
                            <div className="questionBoxes flex justify-center">
                              <AccordionDetails className="addQuestion bg-black text-purple rounded-b-xl w-full flex flex-col">
                                <div className="addQuestionTop flex md:items-center justify-between md:flex-row flex-col gap-5">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex gap-x-2 items-center w-full">
                                      {question.required && (
                                        <p className="m-0 text-red-500">*</p>
                                      )}
                                      <input
                                        type="text"
                                        // value={
                                        //   question.required
                                        //     ? "* " + question.questionText
                                        //     : question.questionText
                                        // }
                                        value={question.questionText}
                                        onChange={(e) => {
                                          changeQuestion(e.target.value, index);
                                        }}
                                        placeholder="Question"
                                        className="w-[95%] outline-none border-b border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-2xl sm:text-xl text-lg"
                                      />
                                    </div>
                                    <CropOriginalOutlined />
                                  </div>
                                  <Select
                                    onChange={handleChange}
                                    value={questionTypeSelect}
                                    className="md:text-4xl sm:text-3xl text-2xl place-self-start mb-2"
                                    variant="outlined"
                                    sx={{ padding: 0 }}
                                  >
                                    <MenuItem
                                      value={"Multiple Choice"}
                                      onClick={() => {
                                        addQuestionType(index, "radio");
                                      }}
                                    >
                                      <CheckCircle
                                        sx={{
                                          marginRight: {
                                            xs: "4px",
                                            sm: "6px",
                                            md: "8px",
                                          },
                                          fontSize: {
                                            xs: "1.125rem",
                                            sm: "1.25rem",
                                            md: "1.5rem",
                                          },
                                          lineHeight: {
                                            xs: "1.75rem",
                                            sm: "1.75rem",
                                            md: "2rem",
                                          },
                                        }}
                                      />
                                      Multiple Choice
                                    </MenuItem>
                                    <MenuItem
                                      value={"Short Answer"}
                                      onClick={() => {
                                        addQuestionType(index, "text");
                                      }}
                                    >
                                      <ShortText
                                        sx={{
                                          marginRight: {
                                            xs: "4px",
                                            sm: "6px",
                                            md: "8px",
                                          },
                                          fontSize: {
                                            xs: "1.125rem",
                                            sm: "1.25rem",
                                            md: "1.5rem",
                                          },
                                          lineHeight: {
                                            xs: "1.75rem",
                                            sm: "1.75rem",
                                            md: "2rem",
                                          },
                                        }}
                                      />
                                      Short Answer
                                    </MenuItem>
                                    <MenuItem
                                      value={"Paragraph"}
                                      onClick={() => {
                                        addQuestionType(index, "textArea");
                                      }}
                                    >
                                      <Subject
                                        sx={{
                                          marginRight: {
                                            xs: "4px",
                                            sm: "6px",
                                            md: "8px",
                                          },
                                          fontSize: {
                                            xs: "1.125rem",
                                            sm: "1.25rem",
                                            md: "1.5rem",
                                          },
                                          lineHeight: {
                                            xs: "1.75rem",
                                            sm: "1.75rem",
                                            md: "2rem",
                                          },
                                        }}
                                      />
                                      Paragraph
                                    </MenuItem>
                                  </Select>
                                </div>

                                {question.options.map((option, optionIndex) => (
                                  <div
                                    className="addQuestionBody flex items-center"
                                    key={optionIndex}
                                  >
                                    {question.questionType != "text" ? (
                                      <input
                                        type={question.questionType}
                                        className="md:mr-5 mr-3"
                                        disabled
                                      />
                                    ) : (
                                      <ShortText />
                                    )}
                                    <div className="w-[70%]">
                                      <input
                                        type="text"
                                        placeholder="Option"
                                        value={option.optionText}
                                        onChange={(e) => {
                                          changeOptionValues(
                                            e.target.value,
                                            index,
                                            optionIndex
                                          );
                                        }}
                                        className="w-[94%] outline-none border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-2xl sm:text-xl text-lg"
                                      />
                                    </div>
                                    <IconButton>
                                      <CropOriginalOutlined
                                        sx={{ marginRight: 2 }}
                                        color="primary"
                                      />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => {
                                        removeOption(index, optionIndex);
                                      }}
                                    >
                                      <Close color="warning" />
                                    </IconButton>
                                  </div>
                                ))}

                                {question.options.length < 5 && (
                                  <div className="addQuestionBody flex items-center px-3">
                                    <FormControlLabel
                                      disabled
                                      control={
                                        question.questionType != "text" ? (
                                          <input
                                            type={question.questionType}
                                            // required={question.required}
                                            className="md:mr-5 mr-3"
                                            disabled
                                          />
                                        ) : (
                                          <ShortText />
                                        )
                                      }
                                      label={
                                        <div className="w-full space-x-2">
                                          {/* <input
    type="text"
    value={"Add option"}
    className="textInput outline-none border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-2xl sm:text-xl text-lg text-purple w-1/2 cursor-pointer"
    placeholder="Add option"
    // disabled
    onClick={() => {
      addOption(index);
    }}
  /> */}
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => {
                                              addOption(index);
                                            }}
                                          >
                                            Add option
                                          </Button>
                                        </div>
                                      }
                                    />
                                  </div>
                                )}
                                {/* <div className="addQuestionFooter w-full flex items-center justify-between mt-3"> */}
                                {/* <div className="addQuestionFooterBottomLeft border-t border-solid border-purple pt-1">
<Button size="small">
<NorthEast sx={{ marginRight: 1, width: "20%" }} /> Answer Key
</Button>
</div> */}
                                <div className="addQuestionFooterBottomRight border-t border-solid border-purple h-full pt-1 flex items-center sm:place-self-end place-content-center max-sm:w-full w-max mt-3">
                                  <IconButton
                                    onClick={() => {
                                      copyQuestion(index);
                                    }}
                                  >
                                    <FilterNone
                                      color="primary"
                                      sx={{
                                        marginRight: {
                                          xs: "4px",
                                          sm: "6px",
                                          md: "8px",
                                        },
                                        fontSize: {
                                          xs: "1.125rem",
                                          sm: "1.25rem",
                                          md: "1.5rem",
                                        },
                                        lineHeight: {
                                          xs: "1.75rem",
                                          sm: "1.75rem",
                                          md: "2rem",
                                        },
                                        //   display: {
                                        //     xs: "none",
                                        //     md: "inline-block",
                                        //   },
                                      }}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      deleteQuestion(index);
                                    }}
                                  >
                                    <Delete
                                      color="warning"
                                      sx={{
                                        marginRight: {
                                          xs: "4px",
                                          sm: "6px",
                                          md: "8px",
                                        },
                                        fontSize: {
                                          xs: "1.125rem",
                                          sm: "1.25rem",
                                          md: "1.5rem",
                                        },
                                        lineHeight: {
                                          xs: "1.75rem",
                                          sm: "1.75rem",
                                          md: "2rem",
                                        },
                                        //   display: {
                                        //     xs: "none",
                                        //     md: "inline-block",
                                        //   },
                                      }}
                                    />
                                  </IconButton>
                                  <div className="w-[2px] h-full bg-purple mx-2" />
                                  <span
                                    onClick={() => {
                                      requiredQuestion(index);
                                    }}
                                  >
                                    Required{" "}
                                    <Switch
                                      name="checked"
                                      checked={question.required}
                                      size={isSmallScreen ? "small" : "medium"}
                                    />
                                  </span>
                                  {/* <IconButton>
<MoreVertOutlined
    color="primary"
    sx={{
    marginRight: { xs: "4px", sm: "6px", md: "8px" },
    fontSize: {
        xs: "1.125rem",
        sm: "1.25rem",
        md: "1.5rem",
    },
    lineHeight: {
        xs: "1.75rem",
        sm: "1.75rem",
        md: "2rem",
    },
    }}
/>
</IconButton> */}
                                </div>
                                {/* </div> */}
                              </AccordionDetails>
                              <div className="questionEdit flex flex-col gap-3 bg-blackbg h-full py-2 px-1 rounded-xl">
                                <AddCircleOutline
                                  color="primary"
                                  onClick={addMoreQuestionFiled}
                                  className="hover:cursor-pointer hover:scale-110 transition-all ease-linear duration-200"
                                />
                                <CropOriginalOutlined color="primary" />
                                <TextFields color="primary" />
                              </div>
                            </div>
                          )}
                        </div>
                      </Accordion>
                      {/*  additional content or components related to the question here */}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default QuestionsUI;
