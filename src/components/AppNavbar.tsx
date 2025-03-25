import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import skyformLogo from "/skyformsLogo.svg";
import { Menu, MenuItem, IconButton, Tooltip } from "@mui/material";

import {
  Close,
  Search,
  Visibility as VisibilityIcon,
  FileCopy,
} from "@mui/icons-material";
import { AppDispatch } from "../store/Store";
import { RootState } from "../store/rootReducer";
import { logout } from "../store/authSlice";

interface AppNavbarProps {
  showSearch?: boolean;
  showFormActions?: boolean;
  formId?: string;
  onCopyLink?: () => void;
  onSearchChange?: (value: string) => void;
  searchQuery?: string;
}

const AppNavbar: React.FC<AppNavbarProps> = ({
  showSearch = false,
  //   showFormActions = false,
  formId,
  onCopyLink,
  onSearchChange,
  searchQuery,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [inputValue, setInputValue] = useState(searchQuery || "");

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
    setAnchorEl(null);
  };

  const userInitial = currentUser?.email
    ? currentUser.email.charAt(0).toUpperCase()
    : "U";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onSearchChange?.(e.target.value);
  };

  const handleClearSearch = () => {
    setInputValue("");
    onSearchChange?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClearSearch();
    }
  };

  return (
    <nav className="flex justify-between items-center lg:px-7 lg:pt-4 md:px-5 pt-2 px-2 md:text-2xl sm:text-xl text-lg w-full">
      {/* <div className="flex md:gap-x-4 gap-x-3 items-center w-full"> */}
      <Link to="/" className="flex gap-4 justify-center items-center">
        <img
          src={skyformLogo}
          alt="skyforms logo"
          className="max-sm:w-9"
          title="Home"
        />

        <h2 className=" hover:text-shadow-lg transition-all ease-linear duration-200 max-sm:hidden">
          SKY FORMS
        </h2>
      </Link>
      {showSearch && (
        <div className="rounded-xl border border-purple border-solid md:px-4 md:py-2 px-3 py-1 bg-black w-1/2 focus-within:ring-2 focus-within:ring-purple outline-none transition-all ease-linear duration-200 flex items-center gap-2">
          <Search />
          <input
            type="text"
            placeholder="Search ....."
            className="bg-black outline-none w-full"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-purple hover:text-white"
            aria-label="Clear search"
          >
            <Close
              className={`transition-transform ${
                inputValue ? "fade-in" : "fade-out"
              }`}
            />
          </button>
        </div>
      )}
      {/* </div> */}

      <div className="flex lg:gap-x-8 md:gap-x-6 gap-x-4 items-center">
        {!showSearch && (
          <>
            <Link
              to={`/form/${formId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <VisibilityIcon
                titleAccess="View form"
                className="hover:cursor-pointer"
              />
            </Link>
            {onCopyLink && (
              <Tooltip title="Copy Shareable link" color="primary">
                <IconButton onClick={onCopyLink}>
                  <FileCopy />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          color="inherit"
          ref={anchorRef}
        >
          <div className="rounded-full md:h-14 md:w-14 sm:w-11 sm:h-11 w-9 h-9 bg-black border border-solid border-purple flex justify-center items-center hover:shadow hover:cursor-pointer transition-all ease-linear duration-200">
            {userInitial}
          </div>
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default AppNavbar;
