import { Grid, InputAdornment, TextField } from "@mui/material";
import { useFormik } from "formik";
import { CreateExpenseConceptReq } from "src/interfaces";
import * as Yup from "yup";
import { STYLE } from "src/constants";
import CreateModal from "src/components/common/Modals/CreateModal";
import {
  MSG,
  VLDN,
  NumericFormatFloat,
  handleSetText,
} from "src/utils/FormUtils";
import { useAppDispatch } from "src/app/store";
import { closeModal, setSnackbar } from "src/slices/ui/uiSlice";
import { expenseConceptApi } from "src/app/services/expenseConceptService";
import { Input } from "src/types";

interface CreateOrUpdateExpenseConceptsProps {
  open: boolean;
  label: string;
}

export default function CreateOrUpdateExpenseConcepts({
  open,
  label,
}: CreateOrUpdateExpenseConceptsProps) {
  const dispatch = useAppDispatch();
  const [createExpenseConcept, { isLoading: isCreating }] =
    expenseConceptApi.useCreateExpenseConceptMutation();

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
        const res = await createExpenseConcept(data).unwrap();
        dispatch(setSnackbar({ message: MSG.successCreate(res.name) }));
        handleClose();
      } catch (err) {
        // error handled by global error handler
      }
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required(MSG.required)
        .min(VLDN.NAME.min, MSG.minLength(VLDN.NAME.min))
        .max(VLDN.NAME.max, MSG.maxLength(VLDN.NAME.max)),
      detail: Yup.string()
        .min(VLDN.DETAIL.min, MSG.minLength(VLDN.DETAIL.min))
        .max(VLDN.DETAIL.max, MSG.maxLength(VLDN.DETAIL.max)),
      unit_price: Yup.number()
        .required(MSG.required)
        .min(VLDN.FLOAT_NUMBER.min, MSG.minLength(VLDN.FLOAT_NUMBER.min))
        .max(VLDN.FLOAT_NUMBER.max, MSG.maxLength(VLDN.FLOAT_NUMBER.max)),
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
      max: VLDN.NAME.max,
      min: VLDN.NAME.min,
    },
    {
      required: false,
      label: "Detalle",
      id: "detail",
      value: formik.values.detail,
      error: formik.errors.detail,
      max: VLDN.DETAIL.max,
      min: VLDN.DETAIL.min,
    },
    {
      required: true,
      label: "Precio Unit.",
      id: "unit_price",
      value: formik.values.unit_price,
      error: formik.errors.unit_price,
      max: VLDN.FLOAT_NUMBER.max,
      min: VLDN.FLOAT_NUMBER.min,
      InputProps: {
        inputComponent: NumericFormatFloat as any,
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      },
    },
  ];

  return (
    <CreateModal
      open={open}
      label={label}
      hanleConfirm={hanleConfirm}
      handleClose={handleClose}
      isCreating={isCreating}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        {inputs.map((input) => (
          <Grid item>
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
    </CreateModal>
  );
}
