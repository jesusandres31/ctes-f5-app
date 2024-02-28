import { useFormik } from "formik";
import { CreateFieldReq, Expense } from "src/interfaces";
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
import { fieldApi } from "src/app/services/fieldService";
import { Input } from "src/types";
import { useEffect } from "react";
import { useModal } from "src/hooks";

interface CreateOrUpdateFieldProps {
  open: boolean;
  label: string;
}

export default function CreateOrUpdateField({
  open,
  label,
}: CreateOrUpdateFieldProps) {
  const dispatch = useAppDispatch();
  const { selectedItems, actionModal } = useUISelector((state) => state.ui);
  const [createField, { isLoading: isCreating }] =
    fieldApi.useCreateFieldMutation();
  const [updateField, { isLoading: isUpdating }] =
    fieldApi.useUpdateFieldMutation();
  const [getField, { isFetching }] = fieldApi.useLazyGetFieldQuery();
  const { isUpdate } = useModal();

  const handleGetField = async (id: string) => {
    try {
      const payload = await getField(id).unwrap();
      formik.setValues({
        name: payload.name,
        price_per_hour: payload.price_per_hour,
      });
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (isUpdate) {
      handleGetField(selectedItems[0]);
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
      price_per_hour: "",
    },
    onSubmit: async (data: CreateFieldReq) => {
      try {
        if (isUpdate) {
          const id = selectedItems[0];
          const res = await updateField({ id, data }).unwrap();
          dispatch(setSnackbar({ message: MSG.successUpdate(res.name) }));
        } else {
          const res = await createField(data).unwrap();
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
      price_per_hour: Yup.string()
        .min(VLDN.NN_REAL_NUMBER.min, MSG.minLength(VLDN.NN_REAL_NUMBER.min))
        .max(VLDN.NN_REAL_NUMBER.max, MSG.maxLength(VLDN.NN_REAL_NUMBER.max)),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const inputs: Input<Expense>[] = [
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
      label: "Precio por Hora",
      id: "price_per_hour",
      value: formik.values.price_per_hour,
      error: formik.errors.price_per_hour,
      max: VLDN.NN_REAL_NUMBER.max,
      min: VLDN.NN_REAL_NUMBER.min,
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
