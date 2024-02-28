import { VLDN } from "./FormUtils";

/**
 * dates
 */
export const formatDate = (str: Date) => {
  const date = new Date(str);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(2);
  return `${day}/${month}/${year}`;
};

/**
 * string formats
 */
export const removeSpace = (str: string) => {
  str = str.replace(" ", "");
  return str;
};

export const removeExtraSpace = (str: string) => {
  if (str.length === 1) {
    // not allow two consecutive spaces
    str = str.replace(/\s/g, "");
  } else {
    // not allow spaces at beginnign
    str = str.replace(/ +(?= )/g, "");
  }
  return str;
};

export const formatNulls = (value: any) => {
  if (value === "" || value === null) {
    value = "-";
  }
  return value;
};

export const formatMoney = (num: number | "") => {
  if (isNaN(Number(num))) {
    return "NaN";
  }
  const formattedPrice = num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formattedPrice;
};

/**
 * validation
 */
export const isValidNumber = (value: number | undefined): boolean => {
  return (
    value !== undefined &&
    value < VLDN.NN_REAL_NUMBER.max &&
    value > VLDN.NN_REAL_NUMBER.min
  );
};
