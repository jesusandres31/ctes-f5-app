import React, { useEffect, useState } from "react";
import {
  Typography,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListItem,
  List,
  Box,
  useTheme,
  ListSubheader,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useRouter } from "src/hooks";
import { IMenuItem } from "src/types";
import { removeForeslash, translateTitle } from "src/constants";
import { useUISelector } from "src/slices/ui/uiSlice";

interface CustomListProps {
  items: IMenuItem[];
  subheader?: string;
  isNested?: boolean;
}

export default function CustomList({
  items,
  subheader,
  isNested,
}: CustomListProps) {
  const { handleGoTo, route } = useRouter();
  const { openDrawer } = useUISelector((state) => state.ui);
  const theme = useTheme();
  const isSelected = (path?: string) => route === path;
  const backgroundColor = "darken(theme.palette.background.default, 0.08)";
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
                  backgroundColor,
                  borderRadius,
                },
                "&:hover": {
                  backgroundColor: item.to ? backgroundColor : "transparent",
                  borderRadius,
                },
                "&.Mui-selected:hover": {
                  backgroundColor,
                  borderRadius,
                },

                display: "block",
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

                  minHeight: 48,
                  justifyContent: openDrawer ? "initial" : "center",
                  px: 2.5,
                }}
              >
                {item.icon && (
                  <Box pl={1} display="flex">
                    <ListItemIcon
                      sx={{
                        /* minWidth: "40px", */
                        color: "secondary.light",

                        minWidth: 0,
                        mr: openDrawer ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Box>
                )}
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: isNested ? 12 : 13,
                        opacity: openDrawer ? 1 : 0,
                      }}
                      fontWeight={isSelected(item.to) ? "bold" : ""}
                      color={
                        isSelected(item.to)
                          ? theme.palette.primary.main
                          : "text.primary"
                      }
                    >
                      {item.text || translateTitle(removeForeslash(item.to))}
                    </Typography>
                  }
                />
                {item.nestedItems && (
                  <div
                    style={{
                      /* display: "flex", */
                      alignItems: "center",
                      color: theme.palette.text.disabled,
                      padding: 5,
                      display: openDrawer ? "flex" : "none",
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
}
