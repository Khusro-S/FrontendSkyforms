import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Input,
  DialogActions,
  Button,
} from "@mui/material";

interface RenameFormDialogProps {
  renameFormId: string | null;
  setRenameFormId: React.Dispatch<React.SetStateAction<string | null>>;
  renameInput: string;
  setRenameInput: React.Dispatch<React.SetStateAction<string>>;
  handleRenameConfirm: () => void;
}

export default function RenameFormDialog({
  renameFormId,
  setRenameFormId,
  renameInput,
  setRenameInput,
  handleRenameConfirm,
}: RenameFormDialogProps) {
  return (
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
  );
}
