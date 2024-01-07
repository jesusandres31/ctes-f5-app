import { CssBaseline, Box, Typography, Grid } from "@mui/material";
import { WarningRounded } from "@mui/icons-material";

const ErrorMsg = ({
  top = true,
  message = "Something went wrong.",
}: {
  top?: boolean;
  message?: string;
}) => {
  return (
    <Grid sx={{ width: "100%", pt: top ? 35 : 0 }}>
      <CssBaseline />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <WarningRounded fontSize="large" color="disabled" />
        <Box component="span" pt={2}>
          <Typography variant="h6" color="text.secondary">
            {message}
          </Typography>
        </Box>
      </div>
    </Grid>
  );
};

export default ErrorMsg;
