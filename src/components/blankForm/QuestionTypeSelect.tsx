import React from "react";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import {
  CheckCircle,
  CheckBox,
  ShortText,
  Subject,
  FileUpload,
  CalendarMonth,
  Phone,
} from "@mui/icons-material";
import { QuestionType } from "../../types/types";

interface QuestionTypeSelectProps {
  value: string;
  questionId: string;
  formId: string | null;
  onTypeChange: (
    formId: string,
    event: SelectChangeEvent,
    questionId: string
  ) => void;
  onQuestionTypeAdd: (
    formId: string,
    questionId: string,
    type: QuestionType
  ) => void;
}

const QuestionTypeSelect: React.FC<QuestionTypeSelectProps> = ({
  value,
  questionId,
  formId,
  onTypeChange,
  onQuestionTypeAdd,
}) => {
  const handleChange = (e: SelectChangeEvent) => {
    if (formId) {
      onTypeChange(formId, e, questionId);
    }
  };

  const iconStyle = {
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
  };

  return (
    <Select
      onChange={handleChange}
      value={value}
      className="md:text-4xl sm:text-3xl text-2xl place-self-start mb-2"
      variant="outlined"
      sx={{ padding: 0 }}
    >
      <MenuItem
        value={"Multiple Choice"}
        onClick={() => {
          if (formId) {
            onQuestionTypeAdd(formId, questionId, QuestionType.RADIO);
          }
        }}
      >
        <CheckCircle sx={iconStyle} />
        Multiple Choice
      </MenuItem>

      <MenuItem
        value={"Check Box"}
        onClick={() => {
          if (formId) {
            onQuestionTypeAdd(formId, questionId, QuestionType.CHECKBOX);
          }
        }}
      >
        <CheckBox sx={iconStyle} />
        Check Box
      </MenuItem>

      <MenuItem
        value={"Short Answer"}
        onClick={() => {
          if (formId) {
            onQuestionTypeAdd(formId, questionId, QuestionType.SHORT_ANSWER);
          } else {
            console.warn("id is null. Cannot add question type.");
          }
        }}
      >
        <ShortText sx={iconStyle} />
        Short Answer
      </MenuItem>

      <MenuItem
        value={"Paragraph"}
        onClick={() => {
          if (formId) {
            onQuestionTypeAdd(formId, questionId, QuestionType.LONG_ANSWER);
          }
        }}
      >
        <Subject sx={iconStyle} />
        Paragraph
      </MenuItem>

      <MenuItem
        value={"File Upload"}
        onClick={() => {
          if (formId) {
            onQuestionTypeAdd(formId, questionId, QuestionType.FILE_UPLOAD);
          }
        }}
      >
        <FileUpload sx={iconStyle} />
        File Upload
      </MenuItem>

      <MenuItem
        value={"date"}
        onClick={() => {
          if (formId) {
            onQuestionTypeAdd(formId, questionId, QuestionType.DATE);
          }
        }}
      >
        <CalendarMonth sx={iconStyle} />
        Date
      </MenuItem>

      <MenuItem
        value={"Phone"}
        onClick={() => {
          if (formId) {
            onQuestionTypeAdd(formId, questionId, QuestionType.PHONE_NUMBER);
          }
        }}
      >
        <Phone sx={iconStyle} />
        Mobile
      </MenuItem>
    </Select>
  );
};

export default QuestionTypeSelect;
