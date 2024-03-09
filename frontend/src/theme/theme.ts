import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f37a48",
      // e26544 beerboard
      // f37a48 mandarin orange
      // 0072bb french deep blue
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
      default: "#f5f5f5",
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
    fontSize: 13,
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "text.secondary",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          color: "white",
        },
      },
    },
  },
});

export default theme;
