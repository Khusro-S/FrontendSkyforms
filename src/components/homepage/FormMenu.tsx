import React from "react";
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from "@mui/material";

interface FormMenuProps {
  activeMenu: string | null;
  anchorRef: React.RefObject<HTMLButtonElement>;
  handleClose: (event: Event | React.SyntheticEvent) => void;
  handleListKeyDown: (event: React.KeyboardEvent) => void;
  handleRenameRequest: (formId: string) => void;
  handleDeleteRequest: (formId: string) => void;
  setActiveMenu: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function FormMenu({
  activeMenu,
  anchorRef,
  handleClose,
  handleListKeyDown,
  handleRenameRequest,
  handleDeleteRequest,
  setActiveMenu,
}: FormMenuProps) {
  const handleCloseInternal = (event: Event | React.SyntheticEvent) => {
    handleClose(event);
    setActiveMenu(null); // Reset activeMenu when closing
  };
  return (
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
            <ClickAwayListener onClickAway={handleCloseInternal}>
              <MenuList
                autoFocusItem
                id="form-menu"
                aria-labelledby={`menu-button-${activeMenu}`}
                onKeyDown={handleListKeyDown}
              >
                <MenuItem
                  onClick={() => {
                    if (activeMenu) handleRenameRequest(activeMenu);
                  }}
                >
                  Rename
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    if (activeMenu) handleDeleteRequest(activeMenu);
                  }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
