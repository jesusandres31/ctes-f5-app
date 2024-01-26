import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Typography,
  Toolbar,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListItem,
  List,
  IconButton,
  Drawer,
  Divider,
  CssBaseline,
  Box,
  AppBar,
  useTheme,
  darken,
  ListSubheader,
  Grid,
} from "@mui/material";
import {
  MenuRounded,
  PresentToAllRounded,
  FileUploadRounded,
} from "@mui/icons-material";
import { AppRoutes, version } from "src/config";
import { useRouter } from "src/hooks/useRouter";
import LoginButton from "./LoginButton";
import { DrawerSection, IMenuItem } from "src/types";
import { useIsMobile } from "src/hooks";
import { translateTitle } from "src/constants";

const DRAWER_WIDTH = 230;

const DRAWER_SECTIONS: DrawerSection[] = [
  {
    title: "Egresos",
    menuItems: [
      {
        text: "Egresos",
        icon: <FileUploadRounded />,
        to: AppRoutes.Expenses,
      },
      {
        text: "Concept. Egresos",
        icon: <PresentToAllRounded />,
        to: AppRoutes.ExpenseConcepts,
      },
    ],
  },
];

interface CustomListProps {
  items: IMenuItem[];
  subheader: string;
}

const CustomList = ({ items, subheader }: CustomListProps) => {
  const { handleGoTo, getRoute } = useRouter();
  const theme = useTheme();
  const isSelected = (path: string) => getRoute() === path;
  const backgroundColor = darken(theme.palette.background.default, 0.08);
  const borderRadius = 8;

  return (
    <List
      subheader={
        <ListSubheader>
          <Box py={1.5}>
            <Typography variant="subtitle2">{subheader}</Typography>
          </Box>
        </ListSubheader>
      }
    >
      {items.map((item) => (
        <ListItem
          key={item.text}
          disablePadding
          selected={isSelected(item.to)}
          sx={{
            height: "45px",
            "&.Mui-selected": {
              // color: theme.palette.primary.main,
              backgroundColor /* : lighten(theme.palette.primary.light, 0.7) */,
              borderRadius,
            },
            "&:hover": {
              backgroundColor,
              borderRadius,
            },
            "&.Mui-selected:hover": {
              backgroundColor /* : lighten(theme.palette.primary.light, 0.7) */,
              borderRadius,
            },
            /* border: isSelected(item.to)
              ? `1px solid ${lighten(theme.palette.primary.light, 0.7)}`
              : "none", */
          }}
        >
          <ListItemButton
            onClick={() => handleGoTo(item.to)}
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Box pl={1} display="flex">
              <ListItemIcon
                sx={{
                  minWidth: "40px",
                  // color: isSelected(item.to)
                  //   ? theme.palette.primary.main
                  //   : lighten(theme.palette.text.secondary, 0.2),
                  color: theme.palette.primary.main,
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Box>
            <ListItemText
              primary={
                <Typography
                  variant="subtitle2"
                  color={
                    isSelected(item.to)
                      ? theme.palette.primary.main
                      : "text.secondary"
                  }
                >
                  {item.text}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

const CustomDrawer = () => {
  /* const theme = useTheme(); */

  return (
    <div>
      <Toolbar
        sx={{
          /* backgroundColor: theme.palette.primary.main */ backgroundColor:
            "text.primary",
        }}
      >
        {/* <SportsSoccerRounded sx={{ color: "background.default" }} /> */}
        <Typography variant="subtitle1" color="background.default">
          {`\xa0Ctes F5 v${version}`}
        </Typography>
      </Toolbar>
      {DRAWER_SECTIONS.map((section, index) => (
        <React.Fragment key={section.title}>
          <Box px={1} pt={1}>
            <CustomList items={section.menuItems} subheader={section.title} />
          </Box>
          {index < DRAWER_SECTIONS.length - 1 && <Divider variant="middle" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isMobile } = useIsMobile();
  const { route } = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          backgroundColor: "text.primary",
        }}
      >
        <Toolbar>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuRounded />
            </IconButton>
            <Typography variant="subtitle1" noWrap component="div">
              {translateTitle(route)}
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <LoginButton />
          </Grid>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: DRAWER_WIDTH },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          <CustomDrawer />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          <CustomDrawer />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          height: "100%",
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        <Box sx={{ height: isMobile ? "90%" : { sm: `calc(100% - 60px)` } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
