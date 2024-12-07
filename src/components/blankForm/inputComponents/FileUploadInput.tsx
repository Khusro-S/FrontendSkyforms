import { useDispatch, useSelector } from "react-redux";
import { FileData, formsActions } from "../../../store/formsSlice";
import { RootState } from "../../../store/rootReducer";
import { useRef } from "react";
import selectQuestionsByFormId from "../../SelectedQuestionsByFormId";

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
          formId: currentFormId,
          questionId,
          file: fileData,
        })
      );
  };
  const handleRemoveFile = () => {
    if (currentFormId)
      dispatch(formsActions.removeFile({ formId: currentFormId, questionId }));

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
