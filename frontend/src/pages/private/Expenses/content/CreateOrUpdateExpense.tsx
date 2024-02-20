import { Grid, InputAdornment, TextField } from "@mui/material";
import { useFormik } from "formik";
import { CreateExpenseReq } from "src/interfaces";
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
import { expenseApi } from "src/app/services/expenseService";
import { Input } from "src/types";
import { useEffect } from "react";
import { expenseConceptApi } from "src/app/services/expenseConceptService";

interface CreateOrUpdateExpenseProps {
  open: boolean;
  label: string;
}

export default function CreateOrUpdateExpense({
  open,
  label,
}: CreateOrUpdateExpenseProps) {
  const dispatch = useAppDispatch();
  const { selectedItems, actionModal } = useUISelector((state) => state.ui);
  const [createExpense, { isLoading: isCreating }] =
    expenseApi.useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] =
    expenseApi.useUpdateExpenseMutation();
  const [getExpense, { isFetching }] = expenseApi.useLazyGetExpenseQuery();
  const [
    getExpenseConcepts,
    { data: expenseConcepts, isFetching: isFetchinExpCep, error },
  ] = expenseConceptApi.useLazyGetExpenseConceptsQuery();
  const isUpdate = !!actionModal.update && selectedItems.length === 1;

  const handleGetExpense = async (id: string) => {
    try {
      const payload = await getExpense(id).unwrap();
      formik.setValues({
        expense_concept: payload.expand.expense_concept.id,
        detail: payload.detail,
        amount: payload.amount,
        unit_price: payload.unit_price,
        total: payload.total,
      });
    } catch (err) {
      throw err;
    }
  };

  const handleGetExpenseConcepts = async () => {
    try {
      await getExpenseConcepts({}).unwrap();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (isUpdate) {
      handleGetExpense(selectedItems[0]);
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
      expense_concept: "",
      detail: "",
      amount: "",
      unit_price: "",
      total: "",
    },
    onSubmit: async (data: CreateExpenseReq) => {
      try {
        if (isUpdate) {
          const id = selectedItems[0];
          const res = await updateExpense({ id, data }).unwrap();
          dispatch(
            setSnackbar({
              message: MSG.successUpdate(res.expand.expense_concept.id),
            })
          );
        } else {
          const res = await createExpense(data).unwrap();
          dispatch(
            setSnackbar({
              message: MSG.successCreate(res.expand.expense_concept.id),
            })
          );
        }
        handleClose();
      } catch (err) {
        throw err;
      }
    },
    validationSchema: Yup.object({
      expense_concept: Yup.string()
        .required(MSG.required)
        .min(VLDN.SHORT_STRING.min, MSG.minLength(VLDN.SHORT_STRING.min))
        .max(VLDN.SHORT_STRING.max, MSG.maxLength(VLDN.SHORT_STRING.max)),
      detail: Yup.string()
        .min(VLDN.LONG_STRING.min, MSG.minLength(VLDN.LONG_STRING.min))
        .max(VLDN.LONG_STRING.max, MSG.maxLength(VLDN.LONG_STRING.max)),
      amount: Yup.number()
        .required(MSG.required)
        .min(VLDN.REAL_NUMBER.min, MSG.minLength(VLDN.REAL_NUMBER.min))
        .max(VLDN.REAL_NUMBER.max, MSG.maxLength(VLDN.REAL_NUMBER.max)),
      unit_price: Yup.number()
        .required(MSG.required)
        .min(VLDN.NN_REAL_NUMBER.min, MSG.minLength(VLDN.NN_REAL_NUMBER.min))
        .max(VLDN.NN_REAL_NUMBER.max, MSG.maxLength(VLDN.NN_REAL_NUMBER.max)),
      total: Yup.number()
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
      label: "Concepto",
      id: "concept",
      value: formik.values.expense_concept,
      error: formik.errors.expense_concept,
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
      label: "Cantidad",
      id: "amount",
      value: formik.values.amount,
      error: formik.errors.amount,
      max: VLDN.REAL_NUMBER.max,
      min: VLDN.REAL_NUMBER.min,
      InputProps: {
        inputComponent: NumericFormatFloat as any,
      },
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
    {
      required: true,
      label: "Total",
      id: "total",
      value: formik.values.total,
      error: formik.errors.total,
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
