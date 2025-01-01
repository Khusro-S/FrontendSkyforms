// import { useEffect, useState } from "react";
import { useEffect } from "react";
import RecentForm from "./RecentForm";
// import axios from "axios";
import { Link } from "react-router-dom";
import { getForms, formsActions } from "../../store/formsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { AppDispatch } from "../../store/Store";
// import skylabLogoPurple from "/skylabLogoPurple.svg";

// const dummyData = [
//   {
//     name: "Sky Days registration",
//     lastOpened: "25 July 2024",
//     id: 1,
//   },
//   {
//     name: "Art Lab registration",
//     lastOpened: "10 January 2024",
//     id: 2,
//   },
//   {
//     name: "Sky Jam registration",
//     lastOpened: "20 May 2024",
//     id: 3,
//   },
//   {
//     name: "Club registration",
//     lastOpened: "25 September 2024",
//     id: 4,
//   },
//   {
//     name: "Team Acceptance Tasks",
//     lastOpened: "25 November 2024",
//     id: 5,
//   },
// ];

// interface Form {
//   id: string;
//   title: string;
//   description: string;
//   lastOpened: Date;
// }

export default function RecentFormsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { forms, error, loading } = useSelector(
    (state: RootState) => state.forms
  );
  // const forms = useSelector((state: RootState) => state.questions.forms);
  // const loading = useSelector((state: RootState) => state.questions.loading);
  // const error = useSelector((state: RootState) => state.questions.error);

  // const lastOpened = useSelector((state: RootState) => state.questions.lastOpened);

  const handleFormClick = (formId: string) => {
    const currentDate = new Date();
    dispatch(
      formsActions.setLastOpened({
        formId,
        lastOpened: currentDate.toISOString(),
      })
    );
  };

  useEffect(() => {
    dispatch(getForms());
  }, [dispatch]);

  // useEffect(() => {
  //   // Fetch forms from backend
  //   axios
  //     .get("/api/forms")
  //     .then((response) => setForms(response.data))
  //     .catch((error) => console.error("Error fetching forms:", error));
  // }, []);
  // useEffect(() => {
  //   // Fetch forms from backend
  //   axios
  //     .get("/api/forms")
  //     .then((response) => {
  //       const data = response.data;

  //       // Check if response data is an array before setting the state
  //       if (Array.isArray(data)) {
  //         setForms(data);
  //       } else {
  //         console.error("Unexpected data format:", data);
  //       }
  //     })
  //     .catch((error) => console.error("Error fetching forms:", error));
  // }, []);

  // if (forms.loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="px-[5.5rem] py-5">
      <h2 className="md:text-xl text-lg mb-5"> Recent forms</h2>
      {loading && <p>Loading forms...</p>}
      {!loading && error && <p>Error: {error}</p>}

      <div className="recentforms w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
        {/* {dummyData.length > 0 ? (
          dummyData.map((form) => (
            <Link to={`form/${form.id}`} className="text-blue-500">
              <RecentForm
                title={form.name}
                lastOpened={new Date(form.lastOpened)}
                key={form.id}
              />
            </Link>
          ))
        ) : (
          <p>No recent forms found.</p>
        )} */}
        {forms && forms.length > 0
          ? forms.map((form) => (
              <Link
                to={`/form/${form.formId}`}
                onClick={() => handleFormClick(form.formId)}
                key={form.formId}
              >
                <RecentForm
                  title={form.formTitle}
                  lastOpened={
                    form.lastOpened ? new Date(form.lastOpened) : new Date()
                  }
                />
              </Link>
              // <Link to={`/responses/${form.id}`} className="text-green-500">
              //   Responses
              // </Link>
            ))
          : !error && <p>No recent forms</p>}
      </div>
    </div>
  );
}
