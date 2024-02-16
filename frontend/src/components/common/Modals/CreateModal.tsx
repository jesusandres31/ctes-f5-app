import * as React from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { closeModal } from "src/slices/ui/uiSlice";
import { useAppDispatch } from "src/app/store";

interface CreateModalProps {
  open: boolean;
  label?: string;
  hanleConfirm: () => Promise<void>;
  isCreating?: boolean;
  children: React.ReactNode;
}

export default function CreateModal({
  open,
  label = "Item",
  hanleConfirm,
  isCreating,
  children,
}: CreateModalProps) {
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(closeModal());

  const handleCreate = async () => {
    await hanleConfirm();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} scroll="paper" maxWidth="md">
      <DialogTitle>{`Crear nuevo ${label}`}</DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <LoadingButton
          loading={isCreating}
          onClick={handleCreate}
          autoFocus
          variant="contained"
        >
          Crear
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
