import {
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Dialog,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "src/app/store";
import { closeModal, useUISelector } from "src/slices/ui/uiSlice";

interface DeleteModalProps {
  open: boolean;
  label?: string;
  hanleConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export default function DeleteModal({
  open,
  label = "Item/s",
  hanleConfirm,
  isDeleting,
}: DeleteModalProps) {
  const dispatch = useAppDispatch();
  const { selectedItems } = useUISelector((state) => state.ui);
  const few = selectedItems.length > 1;

  const handleClose = () => dispatch(closeModal());

  const handleDelete = async () => {
    await hanleConfirm();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Eliminar nuevo ${label}`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Si eliminas ${few ? "los siguientes" : "el siguiente"} 
          item${few ? "s" : ""}, no podrás recuperarlo.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <LoadingButton
          loading={isDeleting}
          onClick={handleDelete}
          autoFocus
          variant="contained"
        >
          Eliminar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
