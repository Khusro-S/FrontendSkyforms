// import { useEffect } from "react";
import { ThemeProvider } from "@mui/material";

import Theme from "../../theme/Theme";
import QuestionsUI from "./QuestionsUI";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { questionsActions } from "../../store/questionsSlice";
// import { useEffect } from "react";
// import axios from "axios";
// import { formSliceActions } from "../../store/formSlice";

export default function QuestionsForm() {
  const dispatch = useDispatch();
  // const questions = useSelector((state: RootState) => state.questions.questions);
  const formTitle = useSelector(
    (state: RootState) => state.questions.formTitle
  );
  const formDescription = useSelector(
    (state: RootState) => state.questions.formDescription
  );
  //   const formId = useSelector((state: RootState) => state.questions.formId);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(questionsActions.setFormTitle(e.target.value));
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(questionsActions.setFormDescription(e.target.value));
  };
  // useEffect(()=>{
  //     async function FetchData(){
  //         const req = await axios.get(`http://example.com/example/${formId}`);
  //         const questionData=req?.data.questions;
  //         console.log(questionData);
  //         const formTitle = req.data.formTitle;
  //         const formDescription = req.data.formDescription;
  //         dispatch(questionsActions.setFormDescription(formDescription));
  //         dispatch(questionsActions.setFormTitle(formTitle));
  //         dispatch(questionsActions.setQuestions(questionData))
  //     }
  //     FetchData()
  // },[dispatch, formId])

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
                onChange={handleTitleChange}
                className="w-full outline-none border-b border-solid border-purple focus:border-b-4 md:pb-2 pb-1 bg-black transition-all ease-linear duration-200 md:text-6xl sm:text-5xl text-4xl"
              />
              <input
                type="text"
                placeholder="Untitled Description"
                value={formDescription}
                onChange={handleDescriptionChange}
                className="w-full outline-none border-b border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-4xl sm:text-3xl text-2xl"
              />
            </div>
          </div>

          <QuestionsUI />
          {/* <Button variant="contained" color="primary" onClick={commitToDB}>Create form</Button> */}
        </div>
      </div>
    </ThemeProvider>
  );
}
