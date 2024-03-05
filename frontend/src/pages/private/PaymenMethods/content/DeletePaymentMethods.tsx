import { PromiseStatus } from "src/types";
import { paymentMethodApi } from "src/app/services/paymentMethodService";
import { useAppDispatch } from "src/app/store";
import {
  resetSelectedItems,
  setSnackbar,
  useUISelector,
} from "src/slices/ui/uiSlice";
import DeleteModal from "src/components/common/Modals/DeleteModal";
import { MSG } from "src/utils/FormUtils";

interface DeletePaymentMethodsProps {
  open: boolean;
  label: string;
}

export default function DeletePaymentMethods({
  open,
  label,
}: DeletePaymentMethodsProps) {
  const dispatch = useAppDispatch();
  const { selectedItems } = useUISelector((state) => state.ui);
  const [deletePaymentMethod, { isLoading: isDeleting }] =
    paymentMethodApi.useDeletePaymentMethodMutation();

  const handleDelete = async () => {
    const res = await deletePaymentMethod(selectedItems).unwrap();
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
