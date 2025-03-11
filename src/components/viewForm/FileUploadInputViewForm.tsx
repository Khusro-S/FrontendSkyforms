// viewform/FileUploadInput.tsx
import React, { useRef } from "react";
import { Button } from "@mui/material";
import FileUpload from "@mui/icons-material/FileUpload";
import DeleteForever from "@mui/icons-material/DeleteForever";
import FileDownload from "@mui/icons-material/FileDownload";
import PictureAsPdf from "@mui/icons-material/PictureAsPdf";
import Description from "@mui/icons-material/Description";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import AudioFile from "@mui/icons-material/AudioFile";
import VideoFile from "@mui/icons-material/VideoFile";
import { Question } from "../../types/types";

interface FileUploadInputProps {
  question: Question;
  answer: File | null;
  onAnswerChange: (file: File | null) => void;
}

export default function FileUploadInputViewForm({
  // question,
  answer,
  onAnswerChange,
}: FileUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (file: File) => {
    onAnswerChange(file);
  };

  const handleRemoveFile = () => {
    onAnswerChange(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImage = answer && answer.type.startsWith("image/");

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

  const IconComponent = answer ? getFileIcon(answer.type) : undefined;

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
      {answer ? (
        <div>
          {isImage ? (
            <div className="mt-2 flex flex-col gap-2 items-start">
              <p>File name: {answer.name}</p>
              <img
                src={URL.createObjectURL(answer)}
                alt={answer.name}
                className="max-w-52 rounded-lg object-contain object-center"
              />
              <div className="flex items-center gap-2">
                <DeleteForever onClick={handleRemoveFile} />

                <Button variant="outlined" component="label">
                  Replace File
                  <input
                    ref={fileInputRef}
                    type="file"
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
              <p>File name: {answer.name}</p>
              <p>File type: {getFriendlyFileType(answer.type)}</p>
              <div className="flex gap-2 items-center">
                <a href={URL.createObjectURL(answer)} download={answer.name}>
                  <FileDownload />
                </a>
                <DeleteForever onClick={handleRemoveFile} />
                <Button variant="outlined" component="label">
                  Replace File
                  <input
                    ref={fileInputRef}
                    type="file"
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
