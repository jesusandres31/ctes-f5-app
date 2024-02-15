import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAppDispatch } from "src/app/store";
import { closeModal, useUISelector } from "src/slices/ui/uiSlice";
import { capitalizeFirst } from "src/utils";

interface DeleteModalProps {
  open: boolean;
  label?: string;
  hanleConfirm: () => void;
}

export default function DeleteModal({
  open,
  label = "item/s",
  hanleConfirm,
}: DeleteModalProps) {
  const dispatch = useAppDispatch();
  const { selectedItems } = useUISelector((state) => state.ui);
  const few = selectedItems.length > 1;

  const handleClose = () => dispatch(closeModal());

  const handleDelete = () => {
    hanleConfirm();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Eliminar ${capitalizeFirst(label)}`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Si eliminas ${
            few ? "estos" : "este"
          } ${label}, no podrás recuperarlo.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleDelete} autoFocus variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
