import { useNavigate } from "react-router-dom";
import AddFormLogo from "/AddFormLogo.svg";
import { useDispatch } from "react-redux";
import { formsActions } from "../../store/formsSlice";

export default function Template() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    const id = crypto.randomUUID();
    dispatch(formsActions.createNewForm(id));
    navigate(`/blank-form/${id}`);
  };
  return (
    <div className="border-y border-solid border-purple flex flex-col justify-center items-center gap-5 w-full bg-black lg:px-[5.5rem] md:px-16 sm:px-12 px-10 lg:py-5 md:py-4 sm:py-3 py-2">
      <div className="flex justify-between w-full md:text-xl sm:text-lg text-base">
        <h2 className=" ">Start a new Form</h2>
        <h2>Templates</h2>
      </div>

      <div className="flex gap-5 w-full">
        <div className=" flex flex-col gap-3">
          <button
            className="bg-blackbg px-12 py-10 hover:ring-1 hover:ring-purple transition-all ease-linear duration-200 cursor-pointer rounded-lg"
            onClick={handleClick}
          >
            <img src={AddFormLogo} alt="Add blank form logo" />
          </button>
          <p className="md:text-lg text-base px-2">Blank form</p>
        </div>

        {/* <div>card</div>
          <div>card</div> */}
      </div>
    </div>
  );
}
