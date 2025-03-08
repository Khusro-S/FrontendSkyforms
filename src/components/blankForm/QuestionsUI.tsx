import { useEffect, useRef } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { DropResult } from "@hello-pangea/dnd";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Select,
  MenuItem,
  Switch,
  IconButton,
  useMediaQuery,
  SelectChangeEvent,
} from "@mui/material";

import Typography from "@mui/material/Typography";

import CheckCircle from "@mui/icons-material/CheckCircle";
import ShortText from "@mui/icons-material/ShortText";
import Subject from "@mui/icons-material/Subject";
import CropOriginalOutlined from "@mui/icons-material/CropOriginalOutlined";
import FilterNone from "@mui/icons-material/FilterNone";
import Delete from "@mui/icons-material/Delete";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import TextFields from "@mui/icons-material/TextFields";
import FileUpload from "@mui/icons-material/FileUpload";
import Phone from "@mui/icons-material/Phone";

import { formsActions } from "../../store/formsSlice";
import RenderInputComponents from "./inputComponents/RenderInputComponents";
import AnswerInputs from "./inputComponents/AnswerInputs";
import FileUploadInput from "./inputComponents/FileUploadInput";
import CheckBox from "@mui/icons-material/CheckBox";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import selectQuestionsByFormId from "../SelectedQuestionsByFormId";
import { QuestionType } from "../../types/types";

function QuestionsUI() {
  const formId = useSelector((state: RootState) => state.forms.currentFormId);

  const questions = useSelector((state: RootState) => {
    return formId ? selectQuestionsByFormId(state, formId) : [];
  });

  //   const [questionTypeSelect, setQuestionTypeSelect] =
  //     useState("Multiple Choice");

  //   const handleChange = (event: SelectChangeEvent) => {
  //     setQuestionTypeSelect(event.target.value);
  //   };

  const handleChange = (
    formId: string,
    event: SelectChangeEvent,
    id: string
  ) => {
    dispatch(
      formsActions.updateQuestionTypeSelect({
        formId: formId,
        questionId: id,
        questionTypeSelect: event.target.value as string,
      })
    );
  };

  // const handleChange = (value: string, index: number) => {
  //     dispatch(formsActions.updateQuestionType({ index, questionType: value }));
  //     setQuestionTypeSelect(event.target.value);
  //   };

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

  const dispatch = useDispatch();

  const handleExpand = (i: number, formId: string) => {
    dispatch(formsActions.handleExpand({ Index: i, formId }));
  };

  const changeQuestion = (text: string, questionId: string, formId: string) => {
    dispatch(formsActions.changeQuestion({ text, questionId, formId }));
  };
  const addQuestionType = (
    formId: string,
    questionId: string,
    type: QuestionType
  ) => {
    dispatch(formsActions.addQuestionType({ questionId, type, formId }));
  };

  const copyQuestion = (questionId: string, formId: string) => {
    dispatch(formsActions.copyQuestion({ questionId, formId }));
  };

  const addMoreQuestionField = (formId: string) => {
    dispatch(formsActions.addMoreQuestionField({ formId }));
  };

  const requiredQuestion = (formId: string, questionId: string) => {
    dispatch(formsActions.requiredQuestion({ questionId, formId }));
  };

  const deleteQuestion = (formId: string, questionId: string) => {
    dispatch(formsActions.deleteQuestion({ questionId, formId }));
  };

  const onDragEnd = (result: DropResult, formId: string) => {
    if (!result.destination) {
      return;
    }

    dispatch(
      formsActions.reorderQuestions({
        formId,
        startIndex: result.source.index,
        endIndex: result.destination.index,
      })
    );
  };

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <DragDropContext
      onDragEnd={(result) => {
        if (formId) onDragEnd(result, formId);
      }}
    >
      <Droppable droppableId="questions-droppable">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            // className="questions-container"
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
                        onChange={() => {
                          if (formId) handleExpand(index, formId);
                        }}
                      >
                        <div
                          ref={
                            index === questions.length - 1
                              ? lastQuestionRef
                              : null
                          }
                        >
                          {!question.open && (
                            <>
                              <AccordionSummary>
                                <Typography color="warning">
                                  {question.required
                                    ? "* " + question.questionText
                                    : question.questionText}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="flex flex-col gap-y-2 px-3">
                                  {question.questionType === "radio" ||
                                  question.questionType === "checkbox" ? (
                                    question.options?.map(
                                      (option, optionIndex) => (
                                        <FormControlLabel
                                          key={optionIndex}
                                          disabled
                                          control={
                                            <input
                                              type={question.questionType}
                                              //   required={question.required}
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
                                    )
                                  ) : question.questionType ===
                                    QuestionType.FILE_UPLOAD ? (
                                    <FileUploadInput questionId={question.id} />
                                  ) : (
                                    <AnswerInputs questionId={question.id} />
                                  )}
                                </div>
                              </AccordionDetails>
                            </>
                          )}

                          {/* {!question.open && (
                            <>
                              <AccordionSummary>
                                <Typography color="warning">
                                  {question.required
                                    ? "* " + question.questionText
                                    : question.questionText}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="flex flex-col gap-y-2 px-3">
                                  {question.options?.map(
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
                          )} */}
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
                                        value={question.questionText}
                                        onChange={(e) => {
                                          if (formId) {
                                            changeQuestion(
                                              e.target.value,
                                              question.id,
                                              formId
                                            );
                                          }
                                        }}
                                        placeholder="Question"
                                        className="w-[95%] outline-none border-b border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-2xl sm:text-xl text-lg"
                                      />
                                    </div>
                                    <CropOriginalOutlined />
                                  </div>
                                  <Select
                                    onChange={(e) => {
                                      if (formId) {
                                        handleChange(formId, e, question.id);
                                      }
                                    }}
                                    value={question.questionTypeSelect}
                                    className="md:text-4xl sm:text-3xl text-2xl place-self-start mb-2"
                                    variant="outlined"
                                    sx={{ padding: 0 }}
                                  >
                                    <MenuItem
                                      value={"Multiple Choice"}
                                      onClick={() => {
                                        if (formId) {
                                          addQuestionType(
                                            formId,
                                            question.id,
                                            QuestionType.RADIO
                                          );
                                        }
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
                                      value={"Check Box"}
                                      onClick={() => {
                                        if (formId) {
                                          addQuestionType(
                                            formId,
                                            question.id,
                                            QuestionType.CHECKBOX
                                          );
                                        }
                                      }}
                                    >
                                      <CheckBox
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
                                      Check Box
                                    </MenuItem>

                                    <MenuItem
                                      value={"Short Answer"}
                                      onClick={() => {
                                        if (formId) {
                                          addQuestionType(
                                            formId,
                                            question.id,
                                            QuestionType.SHORT_ANSWER
                                          );
                                        } else {
                                          console.warn(
                                            "formId is null. Cannot add question type."
                                          );
                                        }
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
                                        if (formId) {
                                          addQuestionType(
                                            formId,
                                            question.id,
                                            QuestionType.LONG_ANSWER
                                          );
                                        }
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

                                    <MenuItem
                                      value={"File Upload"}
                                      onClick={() => {
                                        if (formId) {
                                          addQuestionType(
                                            formId,
                                            question.id,
                                            QuestionType.FILE_UPLOAD
                                          );
                                        }
                                      }}
                                    >
                                      <FileUpload
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
                                      File Upload
                                    </MenuItem>

                                    <MenuItem
                                      value={"date"}
                                      onClick={() => {
                                        if (formId) {
                                          addQuestionType(
                                            formId,
                                            question.id,
                                            QuestionType.DATE
                                          );
                                        }
                                      }}
                                    >
                                      <CalendarMonth
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
                                      Date
                                    </MenuItem>

                                    <MenuItem
                                      value={"Phone"}
                                      onClick={() => {
                                        if (formId) {
                                          addQuestionType(
                                            formId,
                                            question.id,
                                            QuestionType.PHONE_NUMBER
                                          );
                                        }
                                      }}
                                    >
                                      <Phone
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
                                      Mobile
                                    </MenuItem>
                                  </Select>
                                </div>

                                <RenderInputComponents
                                  questionId={question.id}
                                />

                                <div className="addQuestionFooterBottomRight border-t border-solid border-purple h-full pt-1 flex items-center sm:place-self-end place-content-center max-sm:w-full w-max mt-3">
                                  <IconButton
                                    onClick={() => {
                                      if (formId) {
                                        copyQuestion(question.id, formId);
                                      }
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
                                      }}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      if (formId) {
                                        deleteQuestion(formId, question.id);
                                      }
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
                                      }}
                                    />
                                  </IconButton>
                                  <div className="w-[2px] h-full bg-purple mx-2" />
                                  <span
                                    onClick={() => {
                                      if (formId) {
                                        requiredQuestion(formId, question.id);
                                      }
                                    }}
                                  >
                                    Required{" "}
                                    <Switch
                                      name="checked"
                                      checked={question.required}
                                      size={isSmallScreen ? "small" : "medium"}
                                    />
                                  </span>
                                </div>
                              </AccordionDetails>
                              <div className="questionEdit flex flex-col gap-3 bg-blackbg h-full py-2 px-1 rounded-xl">
                                <AddCircleOutline
                                  color="primary"
                                  onClick={() => {
                                    if (formId) addMoreQuestionField(formId);
                                  }}
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
