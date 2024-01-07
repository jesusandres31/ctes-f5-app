// validations
export const VLDN = {
  EMAIL: { min: 5, max: 60 },
  PSSWD: { min: 4, max: 50 },
};

export const MSG = {
  required: "Required!",
  invalidEmail: "Invalid email",
  minLength: (len: number) => `Enter ${len} characters at least.`,
  maxLength: (len: number) => `Enter ${len} caracteres maximum.`,
};
