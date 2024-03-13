import React from "react";
import { Outlet } from "react-router-dom";
import {
  Typography,
  Toolbar,
  IconButton,
  Divider,
  CssBaseline,
  Box,
  Drawer as BaseDrawer,
  useTheme,
  Grid,
  CSSObject,
  Theme,
  styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import {
  MenuRounded,
  ChevronRightRounded,
  ChevronLeftRounded,
} from "@mui/icons-material";
import { useRouter } from "src/hooks";
import CustomList from "./content/CustomList";
import LoginButton from "./content/LoginButton";
import { useIsMobile } from "src/hooks";
import { translateTitle } from "src/constants";
import { DRAWER_SECTIONS } from "src/config/drawer";
import { toggleOpenDrawer, useUISelector } from "src/slices/ui/uiSlice";
import { useAppDispatch } from "src/app/store";

const DRAWER_WIDTH = 220;

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const CustomDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerContent = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ overflow: "hidden" }}>
      <Toolbar variant="dense" />
      <DrawerHeader>
        <IconButton onClick={() => dispatch(toggleOpenDrawer())}>
          {theme.direction === "rtl" ? (
            <ChevronRightRounded />
          ) : (
            <ChevronLeftRounded />
          )}
        </IconButton>
      </DrawerHeader>
      <Box sx={{ overflow: "auto", height: "100%" }}>
        {DRAWER_SECTIONS.map((section, index) => (
          <React.Fragment key={section.title}>
            <Box px={1} pt={1}>
              <CustomList items={section.menuItems} subheader={section.title} />
            </Box>
            {index < DRAWER_SECTIONS.length - 1 && <Divider variant="middle" />}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default function Dashboard() {
  const { isMobile } = useIsMobile();
  const { route } = useRouter();
  const { openDrawer } = useUISelector((state) => state.ui);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          /* width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` }, */
          backgroundColor: "secondary.main",
        }}
      >
        <Toolbar variant="dense">
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => dispatch(toggleOpenDrawer())}
                sx={{
                  mr: 2,
                  display: { sm: "none" },
                  color: "white",
                }}
              >
                <MenuRounded />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ color: "white" }}
              >
                {translateTitle(route)}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ width: 50, color: "white" }}
          >
            <LoginButton />
          </Grid>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        /* sx={{
          width: { sm: DRAWER_WIDTH },
          flexShrink: { sm: 0 },
        }} */
      >
        {isMobile ? (
          <BaseDrawer
            variant="temporary"
            open={openDrawer}
            onClose={() => dispatch(toggleOpenDrawer())}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              /* "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            }, */
            }}
          >
            <DrawerContent />
          </BaseDrawer>
        ) : (
          <CustomDrawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              /* "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
              }, */
            }}
            open={openDrawer}
          >
            <DrawerContent />
          </CustomDrawer>
        )}
      </Box>
      <Box
        component="main"
        /* sx={{
          height: "100%",
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflow: "hidden",
        }} */
        sx={{ flexGrow: 1, p: 3, overflow: "hidden" }}
      >
        <Toolbar variant="dense" />
        <Box
          sx={{
            height: isMobile
              ? "90%"
              : { sm: `calc(100% - 60px)`, md: `calc(100% - 50px)` },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
