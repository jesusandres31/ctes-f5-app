import { LockOutlined } from "@mui/icons-material";
import {
  Avatar,
  CssBaseline,
  TextField,
  Link,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { URL } from "src/config";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SignInReq } from "src/interfaces";
import { MSG, VLDN } from "src/constants";
import { removeSpace } from "src/utils";
import { setSnackbar } from "src/slices/ui/uiSlice";
import { useAppDispatch } from "src/app/store";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAuth } from "src/hooks";

export default function SignIn() {
  const dispatch = useAppDispatch();
  const { handleSignIn, isSigningIn } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(MSG.invalidEmail)
        .required(MSG.required)
        .min(VLDN.EMAIL.min, MSG.minLength(VLDN.EMAIL.min))
        .max(VLDN.EMAIL.max, MSG.maxLength(VLDN.EMAIL.max)),
      password: Yup.string()
        .required(MSG.required)
        .min(VLDN.PSSWD.min, MSG.minLength(VLDN.PSSWD.min))
        .max(VLDN.PSSWD.max, MSG.maxLength(VLDN.PSSWD.max)),
    }),
    onSubmit: async (data: SignInReq) => {
      try {
        handleSignIn(data);
        // dispatch(setSnackbar({ message: "Login success" }));
        formik.setValues(formik.initialValues);
        handleResetError();
      } catch (err: any) {
        console.log(err);
        dispatch(setSnackbar({ message: err.data.error, type: "error" }));
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  });

  const handleResetError = () => {
    formik.setErrors({});
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "success.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={(e) => {
              formik.setFieldValue("email", removeSpace(e.target.value));
              handleResetError();
            }}
            error={!!formik.errors.email}
            helperText={formik.errors.email ? formik.errors.email : " "}
            variant="outlined"
            inputProps={{
              max: VLDN.EMAIL.max,
              min: VLDN.EMAIL.min,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={(e) => {
              formik.setFieldValue("password", removeSpace(e.target.value));
              handleResetError();
            }}
            error={!!formik.errors.password}
            helperText={formik.errors.password ? formik.errors.password : " "}
            variant="outlined"
            inputProps={{
              max: VLDN.PSSWD.max,
              min: VLDN.PSSWD.min,
            }}
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={isSigningIn}
          >
            Sign In
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
}
