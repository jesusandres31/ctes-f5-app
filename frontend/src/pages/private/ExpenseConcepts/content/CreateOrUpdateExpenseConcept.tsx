import { Grid, InputAdornment, TextField } from "@mui/material";
import { useFormik } from "formik";
import { CreateExpenseConceptReq } from "src/interfaces";
import * as Yup from "yup";
import { STYLE } from "src/constants";
import CreateOrUpdateModal from "src/components/common/Modals/CreateOrUpdateModal";
import {
  MSG,
  VLDN,
  NumericFormatFloat,
  handleSetText,
} from "src/utils/FormUtils";
import { useAppDispatch } from "src/app/store";
import { closeModal, setSnackbar, useUISelector } from "src/slices/ui/uiSlice";
import { expenseConceptApi } from "src/app/services/expenseConceptService";
import { Input } from "src/types";
import { useEffect } from "react";

interface CreateOrUpdateExpenseConceptProps {
  open: boolean;
  label: string;
}

export default function CreateOrUpdateExpenseConcept({
  open,
  label,
}: CreateOrUpdateExpenseConceptProps) {
  const dispatch = useAppDispatch();
  const { selectedItems, actionModal } = useUISelector((state) => state.ui);
  const [createExpenseConcept, { isLoading: isCreating }] =
    expenseConceptApi.useCreateExpenseConceptMutation();
  const [updateExpenseConcept, { isLoading: isUpdating }] =
    expenseConceptApi.useUpdateExpenseConceptMutation();
  const [getExpenseConcept, { isFetching }] =
    expenseConceptApi.useLazyGetExpenseConceptQuery();
  const isUpdate = !!actionModal.update && selectedItems.length === 1;

  const handleGetExpenseConcept = async (id: string) => {
    try {
      const payload = await getExpenseConcept(id).unwrap();
      formik.setValues({
        name: payload.name,
        detail: payload.detail,
        unit_price: payload.unit_price,
      });
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (isUpdate) {
      handleGetExpenseConcept(selectedItems[0]);
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
      unit_price: "",
    },
    onSubmit: async (data: CreateExpenseConceptReq) => {
      try {
        if (isUpdate) {
          const id = selectedItems[0];
          const res = await updateExpenseConcept({ id, data }).unwrap();
          dispatch(setSnackbar({ message: MSG.successUpdate(res.name) }));
        } else {
          const res = await createExpenseConcept(data).unwrap();
          dispatch(setSnackbar({ message: MSG.successCreate(res.name) }));
        }
        handleClose();
      } catch (err) {
        throw err;
      }
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required(MSG.required)
        .min(VLDN.SHORT_STRING.min, MSG.minLength(VLDN.SHORT_STRING.min))
        .max(VLDN.SHORT_STRING.max, MSG.maxLength(VLDN.SHORT_STRING.max)),
      detail: Yup.string()
        .min(VLDN.LONG_STRING.min, MSG.minLength(VLDN.LONG_STRING.min))
        .max(VLDN.LONG_STRING.max, MSG.maxLength(VLDN.LONG_STRING.max)),
      unit_price: Yup.number()
        .required(MSG.required)
        .min(VLDN.NN_REAL_NUMBER.min, MSG.minLength(VLDN.NN_REAL_NUMBER.min))
        .max(VLDN.NN_REAL_NUMBER.max, MSG.maxLength(VLDN.NN_REAL_NUMBER.max)),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const inputs: Input[] = [
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
    {
      required: true,
      label: "Precio Unit.",
      id: "unit_price",
      value: formik.values.unit_price,
      error: formik.errors.unit_price,
      max: VLDN.NN_REAL_NUMBER.max,
      min: VLDN.NN_REAL_NUMBER.min,
      InputProps: {
        inputComponent: NumericFormatFloat as any,
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      },
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
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        {inputs.map((input) => (
          <Grid item key={input.id}>
            <TextField
              required={input.required}
              label={input.label}
              id={input.id}
              name={input.id}
              value={input.value}
              onChange={(e) => handleSetText(e, formik, input.id)}
              autoComplete="off"
              error={!!input.error}
              helperText={input.error ? input.error : " "}
              variant="outlined"
              inputProps={{
                max: input.max,
                min: input.min,
              }}
              InputProps={input.InputProps}
              sx={{ width: STYLE.width.textfield }}
            />
          </Grid>
        ))}
      </Grid>
    </CreateOrUpdateModal>
  );
}
