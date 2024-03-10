import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF9900",
      // FF9900 amazon
      // e26544 beerboard
      // f37a48 mandarin orange
      // 0072bb french deep blue
    },
    secondary: {
      main: "#252F3E",
      // f6a92c beerboard
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
      default: "#F2F3F3",
      paper: "#ffffff",
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
    borderRadius: 3,
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
    MuiDialog: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(0,0,30,0.4)",
        },
      },
    },
  },
});

export default theme;
