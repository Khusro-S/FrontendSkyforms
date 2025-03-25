// import { Close, Search } from "@mui/icons-material";
// import skyformLogo from "/skyformsLogo.svg";
// import { useDispatch, useSelector } from "react-redux";
// import { formsActions } from "../../store/formsSlice";
// import { AppDispatch } from "../../store/Store";
// import { RootState } from "../../store/rootReducer";
// import { useCallback, useState } from "react";

import { useCallback } from "react";
import { formsActions } from "../../store/formsSlice";
import AppNavbar from "../AppNavbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";

// export default function Navbar() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { searchQuery } = useSelector((state: RootState) => state.forms);
//   const [inputValue, setInputValue] = useState(searchQuery);

//   const debouncedSearch = useCallback(
//     (value: string) => {
//       let timeoutId: number;
//       return () => {
//         window.clearTimeout(timeoutId);
//         timeoutId = setTimeout(() => {
//           dispatch(formsActions.setSearchQuery(value));
//         }, 300);
//       };
//     },
//     [dispatch]
//   );

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setInputValue(value);
//     debouncedSearch(value)();
//   };

//   // Clear search
//   const handleClearSearch = () => {
//     setInputValue("");
//     dispatch(formsActions.setSearchQuery(""));
//   };

//   // Handle keyboard events
//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     // Clear search on Escape key
//     if (e.key === "Escape") {
//       handleClearSearch();
//     }
//   };

//   return (
//     <nav className="flex justify-between items-center lg:px-7 lg:pt-4 md:px-5 pt-2 px-2 md:text-2xl sm:text-xl text-lg ">
//       <div className="flex gap-4 justify-center items-center">
//         <img src={skyformLogo} alt="skyforms logo" className="max-sm:w-9" />
//         <h2 className=" hover:text-shadow-lg transition-all ease-linear duration-200 max-sm:hidden">
//           SKY FORMS
//         </h2>
//       </div>
//       <div className="rounded-xl border border-purple border-solid md:px-4 md:py-2 px-3 py-1 bg-black w-1/2 focus-within:ring-2 focus-within:ring-purple outline-none transition-all ease-linear duration-200 flex items-center gap-2">
//         <Search />
//         {/* <form action="" className="w-full"> */}
//         {/* <input
//             type="text"
//             placeholder="Search"
//             className="bg-black outline-none w-full"
//           /> */}
//         <input
//           type="text"
//           placeholder="Search ....."
//           className="bg-black outline-none w-full"
//           value={inputValue}
//           onChange={handleSearchChange}
//           onKeyDown={handleKeyDown}
//         />

//         <button
//           type="button"
//           onClick={handleClearSearch}
//           className="text-purple hover:text-white"
//           aria-label="Clear search"
//         >
//           <Close
//             className={`transition-transform ${
//               searchQuery ? "fade-in" : "fade-out"
//             }`}
//           />
//         </button>
//         {/* )} */}
//       </div>

//       <div className="rounded-full md:h-14 md:w-14 sm:w-11 sm:h-11 w-9 h-9 bg-black border border-solid border-purple flex justify-center items-center hover:shadow hover:cursor-pointer transition-all ease-linear duration-200">
//         K
//       </div>
//     </nav>
//   );
// }

export default function Navbar() {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state: RootState) => state.forms);

  const debouncedSearch = useCallback(
    (value: string) => {
      let timeoutId: number | undefined;
      return () => {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => {
          dispatch(formsActions.setSearchQuery(value));
        }, 300);
      };
    },
    [dispatch]
  );

  const handleSearchChange = (value: string) => {
    debouncedSearch(value)();
  };

  return (
    <AppNavbar
      showSearch
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
    />
  );
}
