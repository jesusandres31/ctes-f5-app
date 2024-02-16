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
