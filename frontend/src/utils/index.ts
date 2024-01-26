/**
 * formats
 */
export const removeSpace = (str: string) => {
  str = str.replace(" ", "");
  return str;
};

export const removeExtraSpace = (str: string) => {
  if (str.length === 1) {
    str = str.replace(/\s/g, ""); // not allow two consecutive spaces
  } else {
    str = str.replace(/ +(?= )/g, ""); // not allow spaces at beginnign
  }
  return str;
};

export const formatNulls = (value: any) => {
  if (value === "" || value === null) {
    value = "-";
  }
  return value;
};
