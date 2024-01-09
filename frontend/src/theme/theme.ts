import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    // ddash
    // primary: {
    //   main: "#086DD7",
    // },
    // secondary: {
    //   main: "#384d54",
    // },
    // // ...
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
    //   primary: "#050505",
    // },
    // background: {
    //   default: "#F9F9FA",
    //   paper: "#FFFFFF",
    // },
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
  },
  shape: {
    borderRadius: 5,
  },
  typography: {
    fontFamily: ["Arimo", "sans-serif"].join(","),
    fontSize: 13.5,
  },
  components: {},
});

export default theme;
