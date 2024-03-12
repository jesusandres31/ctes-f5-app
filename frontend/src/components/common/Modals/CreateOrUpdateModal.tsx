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
import { Input } from "src/types";
import { handleSetFormikValue } from "src/utils/FormUtils";
import { STYLE } from "src/constants";
import { FormikProps } from "formik";
import CustomAutocomplete from "./Inputs/CustomAutocomplete";
import { useIsMobile } from "src/hooks";

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
  const { isMobile } = useIsMobile();
  const maxWidth = inputs.length > 6 ? "md" : "sm";
  const columns = inputs.length > 6 ? { sm: 12 } : { sm: 8 };
  const direction = isMobile || inputs.length <= 3 ? "column" : "row";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      maxWidth={maxWidth}
    >
      <DialogTitle>
        {`${isUpdate ? "Actualizar" : "Crear nuevo"} ${label}`}
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          pt: 4,
        }}
      >
        <Grid container spacing={2} columns={columns} direction={direction}>
          {inputs.map((input) => (
            <Grid
              item
              xs={2}
              sm={4}
              md={6}
              key={input.id}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
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
                  multiline={input.multiline}
                  placeholder={""}
                  onChange={(e) => handleSetFormikValue(e, formik, input.id)}
                  autoComplete="off"
                  error={!!input.error}
                  helperText={input.error ? input.error : " "}
                  variant="outlined"
                  size="small"
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
        <Button variant="outlined" color="secondary" onClick={handleClose}>
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
