import { Grid, Typography } from "@mui/material";
import { SearchOffRounded } from "@mui/icons-material";

const NoItems = ({ message = "No items found." }: { message?: string }) => {
  return (
    <>
      <Grid item>
        <SearchOffRounded fontSize="large" sx={{ color: "text.secondary" }} />
      </Grid>
      <Grid item sx={{ textAlign: "center" }}>
        <Typography variant="subtitle1" color="text.secondary">
          {message}
        </Typography>
      </Grid>
    </>
  );
};

export default NoItems;
