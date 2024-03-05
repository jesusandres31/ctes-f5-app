import { useFormik } from "formik";
import { CreatePaymentMethodReq, PaymentMethod } from "src/interfaces";
import * as Yup from "yup";
import CreateOrUpdateModal from "src/components/common/Modals/CreateOrUpdateModal";
import { MSG, VLDN } from "src/utils/FormUtils";
import { useAppDispatch } from "src/app/store";
import {
  closeModal,
  resetSelectedItems,
  setSnackbar,
  useUISelector,
} from "src/slices/ui/uiSlice";
import { paymentMethodApi } from "src/app/services/paymentMethodService";
import { Input } from "src/types";
import { useEffect } from "react";
import { useModal } from "src/hooks";

interface CreateOrUpdatePaymentMethodProps {
  open: boolean;
  label: string;
}

export default function CreateOrUpdatePaymentMethod({
  open,
  label,
}: CreateOrUpdatePaymentMethodProps) {
  const dispatch = useAppDispatch();
  const { selectedItems, actionModal } = useUISelector((state) => state.ui);
  const [createPaymentMethod, { isLoading: isCreating }] =
    paymentMethodApi.useCreatePaymentMethodMutation();
  const [updatePaymentMethod, { isLoading: isUpdating }] =
    paymentMethodApi.useUpdatePaymentMethodMutation();
  const [getPaymentMethod, { isFetching }] =
    paymentMethodApi.useLazyGetPaymentMethodQuery();
  const { isUpdate } = useModal();

  const handleGetPaymentMethod = async (id: string) => {
    try {
      const payload = await getPaymentMethod(id).unwrap();
      formik.setValues({
        name: payload.name,
        detail: payload.detail,
      });
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (isUpdate) {
      handleGetPaymentMethod(selectedItems[0]);
    }
  }, [actionModal, selectedItems]);

  const hanleConfirm = async () => {
    formik.handleSubmit();
  };

  const handleClose = () => {
    dispatch(closeModal());
    formik.resetForm();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      detail: "",
    },
    onSubmit: async (data: CreatePaymentMethodReq) => {
      try {
        if (isUpdate) {
          const id = selectedItems[0];
          const res = await updatePaymentMethod({ id, data }).unwrap();
          dispatch(setSnackbar({ message: MSG.successUpdate(res.name) }));
        } else {
          const res = await createPaymentMethod(data).unwrap();
          dispatch(setSnackbar({ message: MSG.successCreate(res.name) }));
        }
        handleClose();
      } catch (err) {
        throw err;
      }
      dispatch(resetSelectedItems());
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required(MSG.required)
        .min(VLDN.SHORT_STRING.min, MSG.minLength(VLDN.SHORT_STRING.min))
        .max(VLDN.SHORT_STRING.max, MSG.maxLength(VLDN.SHORT_STRING.max)),
      detail: Yup.string()
        .min(VLDN.LONG_STRING.min, MSG.minLength(VLDN.LONG_STRING.min))
        .max(VLDN.LONG_STRING.max, MSG.maxLength(VLDN.LONG_STRING.max)),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const inputs: Input<PaymentMethod>[] = [
    {
      required: true,
      label: "Nombre",
      id: "name",
      value: formik.values.name,
      error: formik.errors.name,
      max: VLDN.SHORT_STRING.max,
      min: VLDN.SHORT_STRING.min,
    },
    {
      required: false,
      label: "Detalle",
      id: "detail",
      value: formik.values.detail,
      error: formik.errors.detail,
      max: VLDN.LONG_STRING.max,
      min: VLDN.LONG_STRING.min,
    },
  ];

  return (
    <CreateOrUpdateModal
      open={open}
      label={label}
      hanleConfirm={hanleConfirm}
      handleClose={handleClose}
      loading={isFetching || isCreating || isUpdating}
      isUpdate={isUpdate}
      inputs={inputs}
      formik={formik}
    />
  );
}
