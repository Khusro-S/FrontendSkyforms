import { Search } from "@mui/icons-material";
import skyformLogo from "/skyformsLogo.svg";
export default function Navbar() {
  // absolute top-0 left-0 w-full
  return (
    <nav className="flex justify-between items-center lg:px-7 lg:pt-4 md:px-5 pt-2 px-2 md:text-2xl sm:text-xl text-lg ">
      <div className="flex gap-4 justify-center items-center">
        <img src={skyformLogo} alt="skyforms logo" className="max-sm:w-9" />
        <h2 className=" hover:text-shadow-lg transition-all ease-linear duration-200 max-sm:hidden">
          SKY FORMS
        </h2>
      </div>
      <div className="rounded-xl border border-purple border-solid md:px-4 md:py-2 px-3 py-1 bg-black w-1/2 focus-within:ring-2 focus-within:ring-purple outline-none transition-all ease-linear duration-200 flex items-center gap-2">
        <Search />
        <input
          type="text"
          placeholder="Search"
          className="bg-black outline-none w-full"
        />
      </div>

      <div className="rounded-full md:h-14 md:w-14 sm:w-11 sm:h-11 w-9 h-9 bg-black border border-solid border-purple flex justify-center items-center hover:shadow hover:cursor-pointer transition-all ease-linear duration-200">
        K
      </div>
    </nav>
  );
}
