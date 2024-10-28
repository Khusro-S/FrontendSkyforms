import { useDispatch, useSelector } from "react-redux";
import { FileData, questionsActions } from "../../../store/questionsSlice";
import { RootState } from "../../../store/rootReducer";
import { useRef } from "react";

export default function FileUploadInput({ index }: { index: number }) {
  const dispatch = useDispatch();
  const question = useSelector(
    (state: RootState) => state.questions.questions[index]
  );
  //   const fileData = questions[index].file;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (file: File) => {
    const fileData: FileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file), // For preview purposes
    };
    dispatch(questionsActions.setFile({ index, file: fileData }));
  };
  const handleRemoveFile = () => {
    dispatch(questionsActions.removeFile(index));

    // if (fileInputRef.current) {
    //   fileInputRef.current.value = "";
    // }
  };
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        // disabled
        onChange={(e) => {
          if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
        }}
        className="text-purple"
      />
      {question.file && (
        <div>
          <p>Name: {question.file.name}</p>
          <p>type: {question.file.type}</p>
          <button onClick={handleRemoveFile}>Remove File</button>
        </div>
      )}
    </>
  );
}
