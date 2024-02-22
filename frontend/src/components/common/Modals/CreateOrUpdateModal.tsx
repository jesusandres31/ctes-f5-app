import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Input, Item } from "src/types";
import { handleSetFormikValue } from "src/utils/FormUtils";
import { STYLE } from "src/constants";
import { FormikProps } from "formik";
import CustomAutocomplete from "./Inputs/CustomAutocomplete";

interface CreateOrUpdateModalProps {
  open: boolean;
  label?: string;
  hanleConfirm: () => void;
  handleClose: () => void;
  loading?: boolean;
  isUpdate?: boolean;
  inputs: Input<any>[];
  formik: FormikProps<any>;
}

export default function CreateOrUpdateModal({
  open,
  label = "Item",
  hanleConfirm,
  handleClose,
  loading = false,
  isUpdate = false,
  inputs,
  formik,
}: CreateOrUpdateModalProps) {
  return (
    <Dialog open={open} onClose={handleClose} scroll="paper" maxWidth="md">
      <DialogTitle>{`${
        isUpdate ? "Actualizar" : "Crear nuevo"
      } ${label}`}</DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {inputs.map((input) => (
            <Grid item key={input.id}>
              {input.options ? (
                <CustomAutocomplete
                  input={input}
                  formik={formik}
                  fetchItemsFunc={input.fetchItemsFunc}
                  options={input.options}
                  loading={input.loading}
                  getOptionLabel={input.getOptionLabel}
                />
              ) : (
                <TextField
                  required={input.required}
                  label={input.label}
                  id={input.id}
                  name={input.id}
                  value={input.value}
                  onChange={(e) => handleSetFormikValue(e, formik, input.id)}
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
              )}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancelar
        </Button>
        <LoadingButton
          loading={loading}
          onClick={hanleConfirm}
          type="submit"
          autoFocus
          variant="contained"
        >
          {isUpdate ? "Actualizar" : "Crear"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
