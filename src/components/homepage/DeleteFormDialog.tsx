import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface DeleteFormDialogProps {
  confirmDelete: string | null;
  setConfirmDelete: React.Dispatch<React.SetStateAction<string | null>>;
  handleDeleteConfirm: () => void;
}

export default function DeleteFormDialog({
  confirmDelete,
  setConfirmDelete,
  handleDeleteConfirm,
}: DeleteFormDialogProps) {
  return (
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
  );
}
