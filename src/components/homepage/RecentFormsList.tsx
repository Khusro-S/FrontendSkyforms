import { useEffect, useRef, useState } from "react";
import RecentForm from "./RecentForm";
import { Link } from "react-router-dom";
import {
  formsActions,
  getForms,
  updateLastOpenedThunk,
} from "../../store/formsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { AppDispatch } from "../../store/Store";
import { MoreVert } from "@mui/icons-material";
import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  // TextField,
  Input,
} from "@mui/material";

export default function RecentFormsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { forms, error, loading } = useSelector(
    (state: RootState) => state.forms
  );

  // Single active menu state instead of an object of states
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // State for rename modal
  const [renameFormId, setRenameFormId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState<string>("");

  useEffect(() => {
    dispatch(getForms());
  }, [dispatch]);

  const handleFormClick = (formId: string) => {
    dispatch(formsActions.setCurrentFormId(formId));
    const currentDate = new Date();
    dispatch(updateLastOpenedThunk({ formId, lastOpened: currentDate }));
    dispatch(
      formsActions.setLastOpened({
        formId,
        lastOpened: currentDate.toISOString(),
      })
    ); // navigate(`/blank-form/${formId}`);
  };
  // Toggle menu open/close with stopPropagation
  const handleToggle = (formId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setActiveMenu(activeMenu === formId ? null : formId);
    anchorRef.current = event.currentTarget as HTMLButtonElement;
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setActiveMenu(null);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab" || event.key === "Escape") {
      event.preventDefault();
      setActiveMenu(null);
    }
  }

  // Open rename modal
  const handleRenameRequest = (formId: string) => {
    const form = forms.find((f) => f.formId === formId);
    setRenameInput(form?.formTitle || "");
    setRenameFormId(formId);
    setActiveMenu(null);
  };

  // Handle rename with validation
  const handleRenameConfirm = () => {
    if (renameFormId && renameInput.trim()) {
      dispatch(
        formsActions.setFormTitle({
          formId: renameFormId,
          formTitle: renameInput.trim(),
        })
      );
      setRenameFormId(null);
    }
  };

  // Show confirmation before deleting
  const handleDeleteRequest = (formId: string) => {
    setConfirmDelete(formId);
    setActiveMenu(null);
  };

  const handleDeleteConfirm = () => {
    if (confirmDelete) {
      dispatch(formsActions.removeForm(confirmDelete));
      setConfirmDelete(null);
    }
  };

  return (
    <div className="px-[5.5rem] py-5">
      <h2 className="md:text-xl text-lg mb-5">Recent forms</h2>
      {loading && <p>Loading forms...</p>}
      {!loading && error && <p>Error: {error}</p>}

      <div className="recentforms w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
        {forms && forms.length > 0
          ? forms.map((form) => (
              <div key={form.formId} className="relative">
                <Link
                  to={`/blank-form/${form.formId}`}
                  onClick={() => handleFormClick(form.formId)}
                >
                  <RecentForm
                    title={form.formTitle}
                    lastOpened={
                      form.lastOpened ? new Date(form.lastOpened) : new Date()
                    }
                  />
                </Link>
                <div className="absolute bottom-5  right-2 z-10">
                  <Button
                    id={`menu-button-${form.formId}`}
                    aria-controls={
                      activeMenu === form.formId ? "form-menu" : undefined
                    }
                    aria-expanded={
                      activeMenu === form.formId ? "true" : undefined
                    }
                    aria-haspopup="true"
                    onClick={(e) => handleToggle(form.formId, e)}
                    className="min-w-0 p-1"
                  >
                    <MoreVert className="text-black hover:scale-105 active:scale-100 transition-transform ease-in-out duration-300" />
                  </Button>
                </div>
              </div>
            ))
          : !error && <p>No recent forms</p>}
      </div>

      {/* Single Popper for active menu */}
      {activeMenu && (
        <Popper
          className="max-w-60 min-w-28 z-50"
          open={Boolean(activeMenu)}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem
                    id="form-menu"
                    aria-labelledby={`menu-button-${activeMenu}`}
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={() => handleRenameRequest(activeMenu)}>
                      Rename
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteRequest(activeMenu)}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      )}

      {/* Rename Dialog */}
      <Dialog
        open={Boolean(renameFormId)}
        onClose={() => setRenameFormId(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Rename Form</DialogTitle>
        <DialogContent>
          <Input
            autoFocus
            margin="dense"
            // label="Form Title"
            type="text"
            fullWidth
            value={renameInput}
            onChange={(e) => setRenameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRenameConfirm();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameFormId(null)}>Cancel</Button>
          <Button
            onClick={handleRenameConfirm}
            variant="contained"
            color="primary"
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this form? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
