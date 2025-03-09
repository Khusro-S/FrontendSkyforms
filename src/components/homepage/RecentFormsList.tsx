import { useEffect, useRef, useState } from "react";
import RecentForm from "./RecentForm";
import { Link } from "react-router-dom";
import {
  deleteFormThunk,
  formsActions,
  getForms,
  updateFormTitleThunk,
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
  Select,
  SelectChangeEvent,
} from "@mui/material";

export default function RecentFormsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { forms, error, loading } = useSelector(
    (state: RootState) => state.forms
  );

  // Pagination state
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(8); // 2x4 grid

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

  // Get paginated forms
  const paginatedForms = forms.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(forms.length / rowsPerPage);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  // const handleRowsPerPageChange = (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0); // Reset to first page when changing rows per page
  // };
  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(parseInt(event.target.value as string, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  const handleFormClick = (id: string) => {
    dispatch(formsActions.setCurrentFormId(id));
    const currentDate = new Date();
    dispatch(updateLastOpenedThunk({ id, lastOpened: currentDate }));
    dispatch(
      formsActions.setLastOpened({
        id,
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
    const form = forms.find((f) => f.id === formId);
    setRenameInput(form?.formTitle || "");
    setRenameFormId(formId);
    setActiveMenu(null);
  };

  // Handle rename with validation
  const handleRenameConfirm = () => {
    if (renameFormId && renameInput.trim()) {
      dispatch(
        updateFormTitleThunk({
          formId: renameFormId,
          formTitle: renameInput.trim(),
        })
      );
      dispatch(
        formsActions.setFormTitle({
          id: renameFormId,
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
      dispatch(deleteFormThunk(confirmDelete));
      setConfirmDelete(null);
    }
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5; // Show at most 5 page buttons

    // Always show first page
    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(0)}
        className={`px-3 py-1 mx-1 rounded text-black ${
          page === 0
            ? "bg-purple"
            : "bg-black text-purple hover:bg-purple hover:text-black"
        }`}
        disabled={page === 0}
      >
        1
      </button>
    );

    // Calculate range of visible page buttons
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2);

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 2) {
      startPage = Math.max(1, endPage - (maxVisiblePages - 2));
    }

    // Add ellipsis after first page if needed
    if (startPage > 1) {
      buttons.push(
        <span key="ellipsis-start" className="px-3 py-1">
          ...
        </span>
      );
    }

    // Add middle page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded text-black ${
            page === i
              ? "bg-purple "
              : "bg-black text-purple hover:bg-purple hover:text-black"
          }`}
        >
          {i + 1}
        </button>
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="ellipsis-end" className="px-3 py-1">
          ...
        </span>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 5 && page != totalPages - 1) {
      buttons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages - 1)}
          className={`px-3 py-1 mx-1 rounded ${
            page === totalPages - 1
              ? "bg-purple"
              : "bg-black text-purple hover:bg-purple hover:text-black"
          }`}
          disabled={page === totalPages - 1}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="px-[5.5rem] py-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="md:text-xl text-lg">Recent forms</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="rows-per-page" className="text-purple">
            Forms per page:
          </label>
          <Select
            id="rows-per-page"
            variant="outlined"
            sx={{ padding: 0, margin: 0 }}
            onChange={handleRowsPerPageChange}
            value={rowsPerPage}
            size="small"
            className="bg-black text-purple"
          >
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={16}>16</MenuItem>
          </Select>
          {/* <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="p-1 border rounded text-sm bg-black text-purple"
          >
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </select> */}
        </div>
      </div>

      {loading && <p>Loading forms...</p>}
      {!loading && error && <p>Error: {error}</p>}

      <div className="recentforms w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
        {paginatedForms && paginatedForms.length > 0
          ? paginatedForms.map((form) => (
              <div key={form.id} className="relative">
                <Link
                  to={`/blank-form/${form.id}`}
                  onClick={() => handleFormClick(form.id)}
                >
                  <RecentForm
                    title={form.formTitle}
                    lastOpened={
                      form.lastOpened ? new Date(form.lastOpened) : new Date()
                    }
                  />
                </Link>
                <div className="absolute bottom-5 right-2 z-10">
                  <Button
                    id={`menu-button-${form.id}`}
                    aria-controls={
                      activeMenu === form.id ? "form-menu" : undefined
                    }
                    aria-expanded={activeMenu === form.id ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={(e) => handleToggle(form.id, e)}
                    className="min-w-0 p-1"
                  >
                    <MoreVert className="text-black hover:scale-105 active:scale-100 transition-transform ease-in-out duration-300" />
                  </Button>
                </div>
              </div>
            ))
          : !error && <p>No recent forms</p>}
      </div>

      {/* Pagination controls */}
      {/* {!loading && !error && forms.length > 0 && ( */}
      {!loading && forms.length > 0 && (
        <div className="mt-6 flex justify-center items-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="px-3 py-1 rounded bg-purple text-black hover:text-purple hover:bg-black disabled:opacity-50 mr-2 disabled:hover:none"
          >
            &lt; Prev
          </button>
          <div className="flex mx-2">{renderPaginationButtons()}</div>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 rounded bg-purple text-black hover:text-purple hover:bg-black disabled:opacity-50 ml-2"
          >
            Next &gt;
          </button>
        </div>
      )}

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