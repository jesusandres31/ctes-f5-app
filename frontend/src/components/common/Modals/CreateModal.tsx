import * as React from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface CreateModalProps {
  open: boolean;
  label?: string;
  hanleConfirm: () => void;
  handleClose: () => void;
  isCreating?: boolean;
  children: React.ReactNode;
}

export default function CreateModal({
  open,
  label = "Item",
  hanleConfirm,
  handleClose,
  isCreating,
  children,
}: CreateModalProps) {
  return (
    <Dialog open={open} onClose={handleClose} scroll="paper" maxWidth="md">
      <DialogTitle>{`Crear nuevo ${label}`}</DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {children}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancelar
        </Button>
        <LoadingButton
          loading={isCreating}
          onClick={hanleConfirm}
          type="submit"
          autoFocus
          variant="contained"
        >
          Crear
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
