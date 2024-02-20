import React from "react";
import { isValidNumber } from "src/utils";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { capitalize } from "@mui/material";
import { FormikValues } from "formik";
import { removeExtraSpace } from "src/utils";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export const NumericFormatFloat = React.forwardRef<
  NumericFormatProps,
  CustomProps
>(function NumericFormatCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        if (isValidNumber(values.floatValue)) {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }
      }}
      valueIsNumericString
      thousandSeparator
      decimalScale={2}
      allowNegative={false}
      isAllowed={(values) => {
        return isValidNumber(values.floatValue);
      }}
    />
  );
});

export const handleSetText = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  formik: FormikValues,
  prop: string
) => {
  formik.setFieldValue(prop, removeExtraSpace(capitalize(e.target.value)));
  formik.setErrors({});
};

export const handleSetNumber = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  formik: FormikValues,
  prop: string
) => {
  formik.setFieldValue(prop, e.target.value);
  formik.setErrors({});
};

/**
 * validations
 */
export const VLDN = {
  SHORT_STRING: { min: 3, max: 60 },
  LONG_STRING: { min: 3, max: 100 },
  NN_REAL_NUMBER: { min: 0, max: 1000000 },
  REAL_NUMBER: { min: -1000000, max: 1000000 },
};

/**
 * messages
 */
const isFew = (length: number) => (length > 1 ? "s" : "");

export const MSG = {
  required: "Required!",
  invalidEmail: "Invalid email",
  minLength: (len: number) => `Enter ${len} characters at least.`,
  maxLength: (len: number) => `Enter ${len} caracteres maximum.`,
  successDelete: (length: number) =>
    `Item${isFew(length)} eliminado${isFew(length)} satisfactoriamente.`,
  successCreate: (name: string) => `Item ${name} creado satisfactoriamente.`,
  successUpdate: (name: string) =>
    `Item ${name} actualizado satisfactoriamente.`,
};
