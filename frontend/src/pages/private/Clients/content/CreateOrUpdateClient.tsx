import { useFormik } from "formik";
import { CreateClientReq, Expense } from "src/interfaces";
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
import { clientApi } from "src/app/services/clientService";
import { Input } from "src/types";
import { useEffect } from "react";
import { useModal } from "src/hooks";

interface CreateOrUpdateClientProps {
  open: boolean;
  label: string;
}

export default function CreateOrUpdateClient({
  open,
  label,
}: CreateOrUpdateClientProps) {
  const dispatch = useAppDispatch();
  const { selectedItems, actionModal } = useUISelector((state) => state.ui);
  const [createClient, { isLoading: isCreating }] =
    clientApi.useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] =
    clientApi.useUpdateClientMutation();
  const [getClient, { isFetching }] = clientApi.useLazyGetClientQuery();
  const { isUpdate } = useModal();

  const handleGetClient = async (id: string) => {
    try {
      const payload = await getClient(id).unwrap();
      formik.setValues({
        name: payload.name,
        phone: payload.phone,
      });
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (isUpdate) {
      handleGetClient(selectedItems[0]);
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
      phone: "",
    },
    onSubmit: async (data: CreateClientReq) => {
      try {
        if (isUpdate) {
          const id = selectedItems[0];
          const res = await updateClient({ id, data }).unwrap();
          dispatch(setSnackbar({ message: MSG.successUpdate(res.name) }));
        } else {
          const res = await createClient(data).unwrap();
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
      phone: Yup.string()
        .min(VLDN.LONG_STRING.min, MSG.minLength(VLDN.LONG_STRING.min))
        .max(VLDN.LONG_STRING.max, MSG.maxLength(VLDN.LONG_STRING.max)),
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
      label: "Telefono",
      id: "phone",
      value: formik.values.phone,
      error: formik.errors.phone,
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
