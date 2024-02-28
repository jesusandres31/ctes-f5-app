import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    // beerboard
    primary: {
      main: "#e26544",
    },
    secondary: {
      main: "#f6a92c",
    },
    info: {
      main: "#50aaff",
    },
    warning: {
      main: "#ffa726",
    },
    error: {
      main: "#fc3535",
    },
    success: {
      main: "#5faf69",
    },
    text: {
      primary: "#050505",
    },
    background: {
      default: "#fafafa",
      paper: "#fafafa",
    },
    // vite
    // primary: {
    //   main: "#747BFF",
    // },
    // secondary: {
    //   main: "#FFCE25",
    // },
    // info: {
    //   main: "#50aaff",
    // },
    // warning: {
    //   main: "#ffa726",
    // },
    // error: {
    //   main: "#fc3535",
    // },
    // success: {
    //   main: "#5faf69",
    // },
    // text: {
    //   // primary: "#050505",
    //   primary: "#3C3C43",
    // },
    // background: {
    //   default: "#F6F6F7",
    //   paper: "#fafafa",
    // },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
    fontSize: 13.5,
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "text.secondary",
        },
      },
    },
  },
});

export default theme;
