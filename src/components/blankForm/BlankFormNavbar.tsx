import { Link } from "react-router-dom";
import skyformLogo from "/skyformsLogo.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
export default function BlankFormNavbar() {
  //   const handleKeyDown = (e: React.KeyboardEvent) => {
  //     if (e.key === "Enter") {
  //       e.preventDefault();
  //     }
  //   };
  //   const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center lg:px-7 lg:py-4 md:px-5 py-2 px-2 md:text-2xl sm:text-xl text-lg w-full h-full">
      <div className="flex md:gap-x-4 gap-x-3 items-center w-full">
        {/* <HomeTooltip title="Home"> */}
        <Link to="/">
          <img
            src={skyformLogo}
            alt="skyforms logo"
            className="max-sm:w-9 hover: cursor-pointer hover:drop-shadow-standard transition-all ease-linear duration-200"
            title="Home"
            // onClick={() => navigate("/")}
          />
        </Link>

        {/* <input
          type="text"
          className="border-b-2 border-solid border-transparent focus:border-purple focus:outline-none transition-all md:max-w-[30rem] sm:max-w-[25rem] max-w-[16.5rem] whitespace-nowrap overflow-hidden bg-transparent inline-block w-full"
          placeholder="Untitled form"
        /> */}
        {/* <span
          contentEditable
          className="border-b-2 border-solid border-transparent focus:border-purple focus:outline-none transition-all md:max-w-[30rem] sm:max-w-[25rem] max-w-[16.5rem] whitespace-nowrap overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          Untitled Form
        </span> */}
      </div>
      <div className="flex lg:gap-x-8 md:gap-x-6 gap-x-4 items-center">
        <VisibilityIcon
          titleAccess="View form"
          className="hover:cursor-pointer"
          sx={{
            fontSize: {
              xs: "24px",
              sm: "28px",
              md: "32px",
              lg: "40px",
            },
          }}
        />
        <div className="rounded-full md:h-14 md:w-14 sm:w-11 sm:h-11 w-9 h-9 bg-black border border-solid border-purple flex justify-center items-center hover:shadow hover:cursor-pointer transition-all ease-linear duration-200">
          K
        </div>
      </div>
    </nav>
  );
}
