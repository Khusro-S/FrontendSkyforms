import { useDispatch, useSelector } from "react-redux";
import { formsActions } from "../../../store/formsSlice";
import { RootState } from "../../../store/rootReducer";
import { useRef } from "react";
import selectQuestionsByFormId from "../../SelectedQuestionsByFormId";
import { FileData } from "../../../types/types";
import {
  AudioFile,
  DeleteForever,
  Description,
  FileDownload,
  FileUpload,
  InsertDriveFile,
  PictureAsPdf,
  VideoFile,
} from "@mui/icons-material";
import { Button } from "@mui/material";

// interface FileUploadInputProps {
//   questionId: string;
//   accept?: string;
// }

export default function FileUploadInput({
  questionId,
}: {
  questionId: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const currentFormId = useSelector(
    (state: RootState) => state.forms.currentFormId
  );

  const questions = useSelector((state: RootState) =>
    currentFormId ? selectQuestionsByFormId(state, currentFormId) : []
  );

  const question = questions.find((q) => q.id === questionId);

  if (!question) {
    return <div>Question not found</div>;
  }

  //   const fileData = questions[index].file;

  const handleFileUpload = (file: File) => {
    const fileData: FileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file), // For preview purposes
    };
    if (currentFormId)
      dispatch(
        formsActions.setFile({
          id: currentFormId,
          questionId,
          file: fileData,
        })
      );
  };
  const handleRemoveFile = () => {
    if (currentFormId)
      dispatch(formsActions.removeFile({ id: currentFormId, questionId }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImage = question.file && question.file.type.startsWith("image/");

  const fileIcons: { [key: string]: React.ComponentType } = {
    "application/pdf": PictureAsPdf,
    "application/msword": Description,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      Description,
    "application/vnd.ms-excel": InsertDriveFile,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      InsertDriveFile,
    "text/plain": Description,
    "audio/mpeg": AudioFile,
    "audio/wav": AudioFile,
    "video/mp4": VideoFile,
    "video/webm": VideoFile,
    "video/quicktime": VideoFile,
  };

  const getFileIcon = (fileType: string): React.ComponentType | undefined => {
    return fileIcons[fileType];
  };

  const IconComponent = question.file
    ? getFileIcon(question.file.type)
    : undefined;

  const fileTypeMappings: { [key: string]: string } = {
    "application/pdf": "PDF",
    "application/msword": "Word",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "Word",
    "application/vnd.ms-excel": "Excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "Excel",
    "text/plain": "Text",
    "audio/mpeg": "Audio",
    "audio/wav": "Audio",
    "video/mp4": "Video",
    "video/webm": "Video",
    "video/quicktime": "Video",
  };

  const getFriendlyFileType = (fileType: string): string => {
    return fileTypeMappings[fileType] || fileType;
  };
  return (
    <>
      {question.file ? (
        <div>
          {isImage ? (
            <div className="mt-2 flex flex-col gap-2 items-start">
              <p>File name: {question.file.name}</p>
              <img
                src={question.file.url}
                alt={question.file.name}
                className="max-w-52 rounded-lg object-contain object-center"
              />
              <div className="flex items-center gap-2">
                <DeleteForever onClick={handleRemoveFile} />

                <Button variant="outlined" component="label">
                  Replace File
                  <input
                    ref={fileInputRef}
                    type="file"
                    // accept={accept}
                    onChange={(e) => {
                      if (e.target.files?.[0])
                        handleFileUpload(e.target.files[0]);
                    }}
                    style={{ display: "none" }}
                  />
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              {IconComponent && (
                <div className="flex gap-2 items-center">
                  <IconComponent />
                </div>
              )}
              <p>File name: {question.file.name}</p>
              <p>File type: {getFriendlyFileType(question.file.type)}</p>
              <div className="flex gap-2 items-center">
                <a href={question.file.url} download={question.file.name}>
                  <FileDownload />
                </a>
                <DeleteForever onClick={handleRemoveFile} />
                <Button variant="outlined" component="label">
                  Replace File
                  <input
                    ref={fileInputRef}
                    type="file"
                    // accept={accept}
                    onChange={(e) => {
                      if (e.target.files?.[0])
                        handleFileUpload(e.target.files[0]);
                    }}
                    style={{ display: "none" }}
                  />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button
          variant="outlined"
          component="label"
          startIcon={<FileUpload />}
          className="w-1/3"
        >
          Upload File
          <input
            ref={fileInputRef}
            type="file"
            // accept={accept}
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
            style={{ display: "none" }}
          />
        </Button>
      )}
    </>
  );
}
