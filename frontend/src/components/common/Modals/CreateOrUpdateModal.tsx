import * as React from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface CreateOrUpdateModalProps {
  open: boolean;
  label?: string;
  hanleConfirm: () => void;
  handleClose: () => void;
  loading?: boolean;
  isUpdate?: boolean;
  children: React.ReactNode;
}

export default function CreateOrUpdateModal({
  open,
  label = "Item",
  hanleConfirm,
  handleClose,
  loading = false,
  isUpdate = false,
  children,
}: CreateOrUpdateModalProps) {
  return (
    <Dialog open={open} onClose={handleClose} scroll="paper" maxWidth="md">
      <DialogTitle>{`${
        isUpdate ? "Actualizar" : "Crear nuevo"
      } ${label}`}</DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {children}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancelar
        </Button>
        <LoadingButton
          loading={loading}
          onClick={hanleConfirm}
          type="submit"
          autoFocus
          variant="contained"
        >
          {isUpdate ? "Actualizar" : "Crear"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
