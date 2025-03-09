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
  Switch,
  IconButton,
  useMediaQuery,
  SelectChangeEvent,
} from "@mui/material";

import Typography from "@mui/material/Typography";

import CropOriginalOutlined from "@mui/icons-material/CropOriginalOutlined";
import FilterNone from "@mui/icons-material/FilterNone";
import Delete from "@mui/icons-material/Delete";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import TextFields from "@mui/icons-material/TextFields";

import { formsActions } from "../../store/formsSlice";
import RenderInputComponents from "./inputComponents/RenderInputComponents";
import AnswerInputs from "./inputComponents/AnswerInputs";
import FileUploadInput from "./inputComponents/FileUploadInput";
import selectQuestionsByFormId from "../SelectedQuestionsByFormId";
import { QuestionType } from "../../types/types";
import QuestionTypeSelect from "./QuestionTypeSelect";

function QuestionsUI() {
  const id = useSelector((state: RootState) => state.forms.currentFormId);

  const questions = useSelector((state: RootState) => {
    return id ? selectQuestionsByFormId(state, id) : [];
  });

  const handleChange = (
    formId: string,
    event: SelectChangeEvent,
    id: string
  ) => {
    dispatch(
      formsActions.updateQuestionTypeSelect({
        id: formId,
        questionId: id,
        questionTypeSelect: event.target.value as string,
      })
    );
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

  const dispatch = useDispatch();

  const handleExpand = (i: number, id: string) => {
    dispatch(formsActions.handleExpand({ Index: i, id }));
  };

  const changeQuestion = (text: string, questionId: string, id: string) => {
    dispatch(formsActions.changeQuestion({ text, questionId, id }));
  };
  const addQuestionType = (
    id: string,
    questionId: string,
    type: QuestionType
  ) => {
    dispatch(formsActions.addQuestionType({ questionId, type, id }));
  };

  const copyQuestion = (questionId: string, id: string) => {
    dispatch(formsActions.copyQuestion({ questionId, id }));
  };

  const addMoreQuestionField = (id: string) => {
    dispatch(formsActions.addMoreQuestionField({ id }));
  };

  const requiredQuestion = (id: string, questionId: string) => {
    dispatch(formsActions.requiredQuestion({ questionId, id }));
  };

  const deleteQuestion = (id: string, questionId: string) => {
    dispatch(formsActions.deleteQuestion({ questionId, id }));
  };

  const onDragEnd = (result: DropResult, id: string) => {
    if (!result.destination) {
      return;
    }

    dispatch(
      formsActions.reorderQuestions({
        id,
        startIndex: result.source.index,
        endIndex: result.destination.index,
      })
    );
  };

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <DragDropContext
      onDragEnd={(result) => {
        if (id) onDragEnd(result, id);
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
                          if (id) handleExpand(index, id);
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
                                          if (id) {
                                            changeQuestion(
                                              e.target.value,
                                              question.id,
                                              id
                                            );
                                          }
                                        }}
                                        placeholder="Question"
                                        className="w-[95%] outline-none border-b border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-2xl sm:text-xl text-lg"
                                      />
                                    </div>
                                    <CropOriginalOutlined />
                                  </div>
                                  <QuestionTypeSelect
                                    value={question.questionTypeSelect}
                                    questionId={question.id}
                                    formId={id}
                                    onTypeChange={handleChange}
                                    onQuestionTypeAdd={addQuestionType}
                                  />
                                </div>

                                <RenderInputComponents
                                  questionId={question.id}
                                />

                                <div className="addQuestionFooterBottomRight border-t border-solid border-purple h-full pt-1 flex items-center sm:place-self-end place-content-center max-sm:w-full w-max mt-3">
                                  <IconButton
                                    onClick={() => {
                                      if (id) {
                                        copyQuestion(question.id, id);
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
                                      if (id) {
                                        deleteQuestion(id, question.id);
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
                                      if (id) {
                                        requiredQuestion(id, question.id);
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
                                    if (id) addMoreQuestionField(id);
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
