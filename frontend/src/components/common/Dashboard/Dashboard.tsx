import React, { useEffect, useState } from "react";
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
  Collapse,
} from "@mui/material";
import {
  MenuRounded,
  StorefrontRounded,
  ShoppingCartRounded,
  PeopleRounded,
  ExpandLess,
  ExpandMore,
  DataSaverOffRounded,
  LocalActivityRounded,
  ConstructionRounded,
  CurrencyExchangeRounded,
} from "@mui/icons-material";
import { AppRoutes, version } from "src/config";
import { useRouter } from "src/hooks";
import LoginButton from "./content/LoginButton";
import { DrawerSection, IMenuItem } from "src/types";
import { useIsMobile } from "src/hooks";
import { removeForeslash, translateTitle } from "src/constants";

const DRAWER_WIDTH = 230;

const DRAWER_SECTIONS: DrawerSection[] = [
  {
    title: "Menu",
    menuItems: [
      {
        icon: <LocalActivityRounded />,
        to: AppRoutes.Rentals,
      },
      {
        icon: <StorefrontRounded />,
        to: AppRoutes.Sales,
      },
      {
        icon: <CurrencyExchangeRounded />,
        to: AppRoutes.Expenses,
      },
      {
        icon: <ShoppingCartRounded />,
        to: AppRoutes.Products,
      },
      {
        icon: <PeopleRounded />,
        to: AppRoutes.Clients,
      },
    ],
  },
  {
    title: "Config",
    menuItems: [
      {
        text: "Administrar",
        icon: <ConstructionRounded />,
        to: "",
        nestedItems: [
          {
            to: AppRoutes.Balls,
          },
          {
            to: AppRoutes.Fields,
          },
          {
            to: AppRoutes.ExpenseConcepts,
          },
          {
            to: AppRoutes.PaymenMethods,
          },
        ],
      },
    ],
  },
  {
    title: "Reportes",
    menuItems: [
      {
        text: "Estadisticas",
        icon: <DataSaverOffRounded />,
        to: "",
        nestedItems: [
          {
            to: AppRoutes.StatsIncomes,
          },
          {
            to: AppRoutes.StatsProducts,
          },
          {
            to: AppRoutes.StatsClients,
          },
        ],
      },
    ],
  },
];

interface CustomListProps {
  items: IMenuItem[];
  subheader?: string;
  isNested?: boolean;
}

const CustomList = ({ items, subheader, isNested }: CustomListProps) => {
  const { handleGoTo, route } = useRouter();
  const theme = useTheme();
  const isSelected = (path?: string) => route === path;
  const backgroundColor = darken(theme.palette.background.default, 0.08);
  const borderRadius = 8;

  return (
    <List
      component="div"
      subheader={
        <ListSubheader>
          {subheader && (
            <Box py={1.5}>
              <Typography variant="subtitle2">{subheader}</Typography>
            </Box>
          )}
        </ListSubheader>
      }
    >
      {items.map((item, index) => {
        const [open, setOpen] = useState(route === item.to);

        useEffect(() => {
          if (item.nestedItems) {
            item.nestedItems.map((nestedItem) => {
              if (route === nestedItem.to) setOpen(true);
            });
          }
        }, []);

        const handleCollapse = (
          e: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) => {
          setOpen(!open);
          e.stopPropagation();
        };

        return (
          <React.Fragment key={`${index}-${item.to}`}>
            <ListItem
              disablePadding
              selected={isSelected(item.to)}
              sx={{
                pl: isNested ? 1.5 : 0,
                height: "45px",
                "&.Mui-selected": {
                  // color: theme.palette.primary.main,
                  backgroundColor /* : lighten(theme.palette.primary.light, 0.7) */,
                  borderRadius,
                },
                "&:hover": {
                  backgroundColor: item.to ? backgroundColor : "transparent",
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
                onClick={(e) => {
                  item.to ? handleGoTo(item.to) : handleCollapse(e);
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                {item.icon && (
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
                )}

                <ListItemText
                  primary={
                    <Typography
                      sx={{ fontSize: isNested ? 13 : 15 }}
                      variant="subtitle2"
                      color={
                        isSelected(item.to)
                          ? theme.palette.primary.main
                          : "text.secondary"
                      }
                    >
                      {item.text || translateTitle(removeForeslash(item.to))}
                    </Typography>
                  }
                />
                {item.nestedItems && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: theme.palette.text.disabled,
                      padding: 5,
                    }}
                    onClick={(e) => handleCollapse(e)}
                  >
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </div>
                )}
              </ListItemButton>
            </ListItem>
            {item.nestedItems && (
              <Collapse in={open} timeout="auto" unmountOnExit>
                <CustomList items={item.nestedItems} isNested={true} />
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
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
        <Typography variant="subtitle1" color="background.paper">
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
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuRounded />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant="h6" noWrap component="div">
                {translateTitle(route)}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ width: 50 }}
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
        <Box
          sx={{
            height: isMobile ? "90%" : { sm: `calc(100% - 60px)` },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
