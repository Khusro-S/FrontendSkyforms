import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import RecentForm from "./RecentForm";
import FormMenu from "./FormMenu";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/Store";
import { updateLastOpenedThunk, formsActions } from "../../store/formsSlice";

interface RecentFormWrapperProps {
  form: {
    id: string;
    formTitle: string;
    lastOpened: string | null;
  };
  handleRenameRequest: (formId: string) => void;
  handleDeleteRequest: (formId: string) => void;
}

export default function RecentFormWrapper({
  form,
  handleRenameRequest,
  handleDeleteRequest,
}: RecentFormWrapperProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  const handleFormClick = (id: string) => {
    const currentDate = new Date();
    dispatch(formsActions.setCurrentFormId(id));
    dispatch(updateLastOpenedThunk({ id, lastOpened: currentDate }));
  };

  const handleToggle = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      setActiveMenu(activeMenu === form.id ? null : form.id);
      anchorRef.current = event.currentTarget as HTMLButtonElement;
    },
    [activeMenu, form.id]
  );

  const handleClose = useCallback((event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setActiveMenu(null);
  }, []);

  const handleListKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Tab" || event.key === "Escape") {
      event.preventDefault();
      setActiveMenu(null);
    }
  }, []);

  return (
    <div className="relative">
      <Link
        to={`/blank-form/${form.id}`}
        onClick={() => handleFormClick(form.id)}
      >
        <RecentForm
          title={form.formTitle}
          lastOpened={form.lastOpened ? new Date(form.lastOpened) : new Date()}
        />
      </Link>
      <div className="absolute bottom-5 right-2 z-10">
        <Button
          id={`menu-button-${form.id}`}
          aria-controls={activeMenu === form.id ? "form-menu" : undefined}
          aria-expanded={activeMenu === form.id ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          className="min-w-0 p-1"
        >
          <MoreVert className="text-black hover:scale-105 active:scale-100 transition-transform ease-in-out duration-300" />
        </Button>
      </div>
      <FormMenu
        activeMenu={activeMenu}
        anchorRef={anchorRef}
        handleClose={handleClose}
        handleListKeyDown={handleListKeyDown}
        handleRenameRequest={useCallback(
          () => handleRenameRequest(form.id),
          [form.id, handleRenameRequest]
        )}
        handleDeleteRequest={useCallback(
          () => handleDeleteRequest(form.id),
          [form.id, handleDeleteRequest]
        )}
        setActiveMenu={setActiveMenu}
      />
    </div>
  );
}
