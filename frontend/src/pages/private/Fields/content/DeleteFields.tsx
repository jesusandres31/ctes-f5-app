import { PromiseStatus } from "src/types";
import { fieldApi } from "src/app/services/fieldService";
import { useAppDispatch } from "src/app/store";
import {
  resetSelectedItems,
  setSnackbar,
  useUISelector,
} from "src/slices/ui/uiSlice";
import DeleteModal from "src/components/common/Modals/DeleteModal";
import { MSG } from "src/utils/FormUtils";

interface DeleteFieldsProps {
  open: boolean;
  label: string;
}

export default function DeleteFields({ open, label }: DeleteFieldsProps) {
  const dispatch = useAppDispatch();
  const { selectedItems } = useUISelector((state) => state.ui);
  const [deleteField, { isLoading: isDeleting }] =
    fieldApi.useDeleteFieldMutation();

  const handleDelete = async () => {
    const res = await deleteField(selectedItems).unwrap();
    if (res.every((item) => item.status === PromiseStatus.FULFILLED)) {
      dispatch(resetSelectedItems());
      dispatch(setSnackbar({ message: MSG.successDelete(res.length) }));
    }
  };

  return (
    <DeleteModal
      open={open}
      label={label}
      hanleConfirm={handleDelete}
      isDeleting={isDeleting}
    />
  );
}
