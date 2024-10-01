import Navbar from "../components/homepage/Navbar";
import RecentFormsList from "../components/homepage/RecentFormsList";
import Template from "../components/homepage/Template";

export default function HomePage() {
  // const [forms, setForms] = useState<Form[]>([]);

  // useEffect(() => {
  //   // Fetch forms from backend
  //   axios
  //     .get("/api/forms")
  //     .then((response) => setForms(response.data))
  //     .catch((error) => console.error("Error fetching forms:", error));
  // }, []);

  return (
    //     <div>
    //       <h1 className="text-2xl font-bold mb-4">Your Forms</h1>
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //         {forms.map((form) => (
    //           <div key={form.id} className="border p-4 rounded shadow">
    //             <h2 className="text-xl font-semibold">{form.title}</h2>
    //             <p className="text-gray-600">{form.description}</p>
    //             <div className="mt-4 flex justify-between">
    //               <Link to={`/form/${form.id}`} className="text-blue-500">
    //                 View
    //               </Link>
    //               <Link to={`/responses/${form.id}`} className="text-green-500">
    //                 Responses
    //               </Link>
    //             </div>
    //           </div>
    //         ))}
    // <Template />
    //         <RecentFormsList />
    //       </div>
    //     </div>

    <div className="flex flex-col lg:gap-5 gap-3">
      <header>
        <Navbar />
      </header>
      <main>
        <Template />
        <RecentFormsList />
      </main>
    </div>
  );
}
