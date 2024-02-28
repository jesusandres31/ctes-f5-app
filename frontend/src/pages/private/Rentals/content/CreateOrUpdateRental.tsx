import { InputAdornment } from "@mui/material";
import { useFormik } from "formik";
import { CreateRentalReq, Rental } from "src/interfaces";
import * as Yup from "yup";
import CreateOrUpdateModal from "src/components/common/Modals/CreateOrUpdateModal";
import { MSG, VLDN, NumericFormatFloat } from "src/utils/FormUtils";
import { useAppDispatch } from "src/app/store";
import {
  closeModal,
  resetSelectedItems,
  setSnackbar,
  uiInitialState,
  useUISelector,
} from "src/slices/ui/uiSlice";
import { rentalApi } from "src/app/services/rentalService";
import { Input } from "src/types";
import { useEffect } from "react";
import { clientApi } from "src/app/services/clientService";
import { fieldApi } from "src/app/services/fieldService";
import { ballApi } from "src/app/services/ballService";
import { useModal } from "src/hooks";

interface CreateOrUpdateRentalProps {
  open: boolean;
  label: string;
}

export default function CreateOrUpdateRental({
  open,
  label,
}: CreateOrUpdateRentalProps) {
  const dispatch = useAppDispatch();
  const { selectedItems, actionModal } = useUISelector((state) => state.ui);
  const [createRental, { isLoading: isCreating }] =
    rentalApi.useCreateRentalMutation();
  const [updateRental, { isLoading: isUpdating }] =
    rentalApi.useUpdateRentalMutation();
  const [getRental, { data: rental, isFetching }] =
    rentalApi.useLazyGetRentalQuery();
  const [getClients, { data: clients, isFetching: isFetchinClient }] =
    clientApi.useLazyGetClientsQuery();
  const [getFields, { data: fields, isFetching: isFetchinField }] =
    fieldApi.useLazyGetFieldsQuery();
  const [getBalls, { data: balls, isFetching: isFetchinBall }] =
    ballApi.useLazyGetBallsQuery();
  const { isUpdate } = useModal();

  const handleGetExpense = async (id: string) => {
    try {
      const payload = await getRental(id).unwrap();
      formik.setValues({
        client: payload.expand.client.id,
        field: payload.expand.field.id,
        ball: payload.expand.ball,
        hours_amount: payload.hours_amount,
        started_at: payload.started_at,
        total: payload.total,
        paid: payload.paid,
      });
    } catch (err) {
      throw err;
    }
  };

  const handleGetExpenseConcepts = async () => {
    try {
      await getExpenseConcepts({
        page: uiInitialState.page,
        perPage: uiInitialState.perPage,
        filter: uiInitialState.filter,
        order: uiInitialState.order,
        orderBy: uiInitialState.orderBy,
      }).unwrap();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    handleGetExpenseConcepts();
  }, []);

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
      client: "",
      field: "",
      ball: "",
      hours_amount: "",
      started_at: new Date(),
      total: "",
      paid: "",
    },
    onSubmit: async (data: CreateRentalReq) => {
      try {
        if (isUpdate) {
          const id = selectedItems[0];
          await updateRental({ id, data }).unwrap();
          dispatch(
            setSnackbar({
              message: MSG.successUpdate(""),
            })
          );
        } else {
          await createRental(data).unwrap();
          dispatch(
            setSnackbar({
              message: MSG.successCreate(""),
            })
          );
        }
        handleClose();
      } catch (err) {
        throw err;
      }
      dispatch(resetSelectedItems());
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

  const inputs: Input<ExpenseConcept>[] = [
    {
      required: true,
      label: "Concepto",
      id: "expense_concept",
      value: formik.values.expense_concept,
      error: formik.errors.expense_concept,
      max: VLDN.SHORT_STRING.max,
      min: VLDN.SHORT_STRING.min,
      options: expenseConcepts ? expenseConcepts.items : [],
      fetchItemsFunc: getExpenseConcepts,
      loading: isFetchinExpCep,
      getOptionLabel: (option) => option.name,
      startValue:
        isUpdate && expense ? expense.expand.expense_concept : undefined,
    },
    {
      required: false,
      label: "Detalle",
      id: "detail",
      value: formik.values.detail,
      error: formik.errors.detail,
      multiline: true,
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
      inputs={inputs}
      formik={formik}
    />
  );
}
