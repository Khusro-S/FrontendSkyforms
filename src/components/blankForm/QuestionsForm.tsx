// import { useEffect } from "react";
import { Button } from "@mui/material";

// import Theme from "../../theme/Theme";
import QuestionsUI from "./QuestionsUI";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import {
  createFormThunk,
  fetchFormByIdThunk,
  formsActions,
  updateFormThunk,
} from "../../store/formsSlice";
import { AppDispatch } from "../../store/Store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form } from "../../types/types";
// import selectQuestionsByFormId from "../SelectedQuestionsByFormId";
// import { useEffect } from "react";
// import axios from "axios";
// import { formSliceActions } from "../../store/formSlice";

export default function QuestionsForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id: currentFormId } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [localForm, setLocalForm] = useState<Form | null>(null);

  const { error } = useSelector((state: RootState) => state.forms);
  const { isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.auth
  );

  //  const currentFormId = useSelector(
  //    (state: RootState) => state.forms.currentFormId
  //  );
  const currentReduxForm = useSelector((state: RootState) =>
    state.forms.forms.find((form) => form.id === currentFormId)
  );
  // const forms = useSelector((state: RootState) => state.forms.forms);
  const currentForm = localForm || currentReduxForm;

  useEffect(() => {
    if (currentFormId) {
      setLoading(true);
      dispatch(fetchFormByIdThunk(currentFormId))
        .unwrap()
        .then((fetchedForm) => {
          setLocalForm(fetchedForm);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching form:", error);
          setLoading(false);
        });
    }
  }, [dispatch, currentFormId, currentForm]);

  const formTitle = currentForm?.formTitle || "";
  const formDescription = currentForm?.formDescription || "";

  // Check authentication status when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      // navigate("/auth", { state: { returnTo: window.location.pathname } });
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmitForm = async () => {
    if (!currentForm) {
      alert("No form data found.");
      return;
    }
    if (!currentUser) {
      alert("You must be logged in to save forms.");
      navigate("/login");
      return;
    }
    const { id, formTitle, formDescription, questions } = currentForm;

    if (!formTitle || !formDescription || questions.length === 0) {
      alert(
        "Please fill in all the required fields and add at least one question."
      );
      return;
    }

    const formData = {
      id,
      formTitle,
      formDescription,
      questions,
      lastOpened: new Date().toISOString(),
      newForm: false,
      userId: currentUser.id,
    };

    try {
      // Check if this form already exists in the store

      if (currentForm.newForm) {
        await dispatch(createFormThunk(formData)).unwrap();
        // dispatch(formsActions.createNewForm(formData));
        alert("Form created successfully!");
      } else {
        await dispatch(updateFormThunk(formData)).unwrap();
        // dispatch(formsActions.updateForm(formData));
        alert("Form updated successfully!");
      }

      // const existingFormIndex = forms.findIndex((form) => form.id === id);
      // const isExistingForm = existingFormIndex !== -1;

      // if (isExistingForm) {
      //   // If form exists, update it
      //   await dispatch(updateFormThunk(formData)).unwrap();
      //   alert("Form updated successfully!");
      // } else {
      //   // If form doesn't exist, create it
      //   await dispatch(createForm(formData)).unwrap();
      //   alert("Form created successfully!");
      // }
      navigate("/");
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("There was an error submitting the form.");
    }
  };

  //   try {
  //     await dispatch(createForm(formData)).unwrap(); // Unwrap to handle errors directly

  //     alert("Form created successfully!");
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Failed to create form:", error);
  //     alert("There was an error creating the form.");
  //   }
  // };

  // const questions = useSelector((state: RootState) => state.questions.questions);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentFormId) {
      dispatch(
        formsActions.setFormTitle({
          id: currentFormId,
          formTitle: e.target.value,
        })
      );
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentFormId) {
      dispatch(
        formsActions.setFormDescription({
          id: currentFormId,
          formDescription: e.target.value,
        })
      );
    }
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
  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="questionform h-full pb-4 flex flex-col justify-center items-center px-5">
      <div className="section md:w-[800px] w-full space-y-5">
        <div className="questionTitleSection">
          <div className="questionFormTop border border-solid border-purple bg-black rounded-xl p-5 md:space-y-5 space-y-4">
            <input
              type="text"
              placeholder="Untitled Form"
              value={formTitle}
              onChange={handleTitleChange}
              className="w-full outline-none border-b border-solid border-purple focus:border-b-4 md:pb-2 pb-1 bg-black transition-all ease-linear duration-200 md:text-5xl sm:text-4xl text-3xl"
            />
            <input
              type="text"
              placeholder="Untitled Description"
              value={formDescription}
              onChange={handleDescriptionChange}
              className="w-full outline-none border-b border-solid border-purple focus:border-b-4 md:py-2 py-1 bg-black transition-all ease-linear duration-200 md:text-3xl sm:text-2xl text-xl"
            />
          </div>
        </div>

        {currentFormId && <QuestionsUI />}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitForm}
          disabled={loading}
        >
          {loading && !error
            ? !currentForm?.newForm
              ? "Updating form"
              : "Creating Form"
            : !loading && !currentForm?.newForm
            ? "Update Form"
            : "Create Form"}
        </Button>
      </div>
    </div>
  );
}
