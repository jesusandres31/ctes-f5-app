import React from "react";
import { Grid, Typography, Button, IconButton, Tooltip } from "@mui/material";

export const CustomGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100%" }}
      direction="column"
    >
      {children}
    </Grid>
  );
};

export const CustomButton = ({
  color,
  text,
  onClick,
  icon,
  isMobile,
}: {
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  text: string;
  onClick: Function;
  icon: React.ReactNode;
  isMobile: boolean;
}) => {
  return (
    <Button
      variant="contained"
      color={color ? color : "primary"}
      size={isMobile ? "small" : "medium"}
      onClick={(e) => onClick(e)}
      startIcon={icon}
    >
      <Typography sx={{ fontWeight: "bold" }}>{text}</Typography>
    </Button>
  );
};

export const CustomIconButton = ({
  text,
  onClick,
  icon,
  isMobile,
}: {
  text: string;
  onClick: Function;
  icon: React.ReactNode;
  isMobile: boolean;
}) => {
  return (
    <Tooltip title={text}>
      <IconButton
        sx={{ color: "secondary.light" }}
        size={isMobile ? "small" : "medium"}
        onClick={(e) => onClick(e)}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};
