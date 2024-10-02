import { useState } from "react";
import Typography from "@mui/material/Typography";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Select,
  MenuItem,
  ThemeProvider,
  SelectChangeEvent,
  Switch,
  Button,
  IconButton,
} from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ShortText from "@mui/icons-material/ShortText";
import Subject from "@mui/icons-material/Subject";
import Theme from "../../theme/Theme";
import CropOriginalOutlined from "@mui/icons-material/CropOriginalOutlined";
import Close from "@mui/icons-material/Close";
import FilterNone from "@mui/icons-material/FilterNone";
import Delete from "@mui/icons-material/Delete";
import NorthEast from "@mui/icons-material/NorthEast";
import MoreVertOutlined from "@mui/icons-material/MoreVertOutlined";

export default function QuestionsForm() {
  const [questions, setQuestions] = useState([
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
  ]);

  const [questionTypeSelect, setQuestionTypeSelect] =
    useState("Multiple Choice");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setQuestionTypeSelect(event.target.value);
  };

  function questionsUI() {
    return questions.map((question, index) => (
      <Accordion
        key={index}
        expanded={question.open}
        slotProps={{ transition: { unmountOnExit: true } }}
        className="md:p-3 p-1"
      >
        {!question.open && (
          <>
            <AccordionSummary className="bg-black">
              <Typography>{question.questionText}</Typography>
            </AccordionSummary>
            <AccordionDetails className="bg-black text-purple rounded-b-xl">
              <div className="flex flex-col gap-y-2 px-3">
                {question.options.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    disabled
                    control={
                      <input
                        type={question.questionType}
                        required={question.required}
                        className="mr-5"
                      />
                    }
                    label={<Typography>{option.optionText}</Typography>}
                  />
                ))}
              </div>
            </AccordionDetails>
          </>
        )}

        <div className="questionBoxes flex justify-center">
          <AccordionDetails className="addQuestion bg-black text-purple rounded-b-xl w-full flex flex-col">
            <div className="addQuestionTop flex md:items-center justify-between md:flex-row flex-col gap-5">
              <div className="flex items-center justify-between w-full">
                <input
                  type="text"
                  value={question.questionText}
                  placeholder="Question"
                  className="w-[70%] outline-none border-b border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-2xl sm:text-xl text-lg"
                />
                <CropOriginalOutlined />
              </div>
              <Select
                onChange={handleChange}
                value={questionTypeSelect}
                className="md:text-4xl sm:text-3xl text-2xl place-self-start mb-2"
                variant="outlined"
                sx={{ padding: 0 }}
              >
                <MenuItem value={"Multiple Choice"}>
                  <CheckCircle
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
                  Multiple Choice
                </MenuItem>
                <MenuItem value={"Short Answer"}>
                  <ShortText
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
                  Short Answer
                </MenuItem>
                <MenuItem value={"Paragraph"}>
                  <Subject
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
                  />
                ) : (
                  <ShortText />
                )}
                <div className="w-[70%]">
                  <input
                    type="text"
                    placeholder="Option"
                    value={option.optionText}
                    className="w-[94%] outline-none border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-2xl sm:text-xl text-lg"
                  />
                </div>
                <CropOriginalOutlined sx={{ marginRight: 2 }} />
                <Close color="warning" />
              </div>
            ))}

            {/* {question.options.length < 5 && (
              <div className="addQuestionBody">
                <FormControlLabel
                  disabled
                  control={
                    <input
                      type={question.questionType}
                      required={question.required}
                      className="mr-5"
                    />
                  }
                  // label={<Typography>{option.optionText}</Typography>}
                />
              </div>
            )} */}
            <div className="addQuestionFooter w-full flex items-center justify-between mt-3">
              <div className="addQuestionFooterBottomLeft border-t border-solid border-purple pt-1">
                <Button size="small">
                  <NorthEast sx={{ marginRight: 1, width: "20%" }} /> Answer Key
                </Button>
              </div>
              <div className="addQuestionFooterBottomRight border-t border-solid border-purple pt-1">
                <IconButton>
                  <FilterNone color="primary" />
                </IconButton>
                <IconButton>
                  <Delete color="warning" />
                </IconButton>
                <span>
                  Required <Switch name="checked"></Switch>
                </span>
                <IconButton>
                  <MoreVertOutlined color="primary" />
                </IconButton>
              </div>
            </div>
          </AccordionDetails>
        </div>
      </Accordion>
    ));
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
          {questionsUI()}
        </div>
      </div>
    </ThemeProvider>
  );
}
