// import { useEffect, useState } from "react";
import RecentForm from "./RecentForm";
// import axios from "axios";
import { Link } from "react-router-dom";
// import skylabLogoPruple from "/skylabLogoPurple.svg";

const dummyData = [
  {
    name: "Sky Days registration",
    lastOpened: "25 July 2024",
    id: 1,
  },
  {
    name: "Art Lab registration",
    lastOpened: "10 January 2024",
    id: 2,
  },
  {
    name: "Sky Jam registration",
    lastOpened: "20 May 2024",
    id: 3,
  },
  {
    name: "Club registration",
    lastOpened: "25 September 2024",
    id: 4,
  },
  {
    name: "Team Acceptance Tasks",
    lastOpened: "25 November 2024",
    id: 5,
  },
];

// interface Form {
//   id: string;
//   title: string;
//   description: string;
//   lastOpened: Date;
// }

export default function RecentFormsList() {
  // const [forms, setForms] = useState<Form[]>([]);

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
  return (
    <div className="px-[5.5rem] py-5">
      <h2 className="md:text-xl text-lg mb-5"> Recent forms</h2>

      <div className="recentforms w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
        {dummyData.length > 0 ? (
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
        )}
        {/* {forms.length > 0 ? (
          forms.map((form) => (
            <Link to={`/form/${form.id}`} className="text-blue-500">
              <RecentForm
                title={form.title}
                lastOpened={new Date(form.lastOpened)}
                key={form.id}
              />
            </Link>
            // <Link to={`/responses/${form.id}`} className="text-green-500">
            //   Responses
            // </Link>
          ))
        ) : (
          <p>No recent forms found</p>
        )} */}
      </div>
    </div>
  );
}
