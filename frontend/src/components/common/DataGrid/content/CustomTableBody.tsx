import { Column, IColumn, Item } from "src/types";
import {
  isCollapsed,
  isSelected,
  resetCollapse,
  setCollapse,
  setSelectedItems,
  useUISelector,
} from "src/slices/ui/uiSlice";
import { useAppDispatch } from "src/app/store";
import { useIsMobile } from "src/hooks";
import { useTheme } from "@mui/material";
import {
  TableCell,
  Typography,
  Checkbox,
  Tooltip,
  IconButton,
  lighten,
  TableHead as Head,
} from "@mui/material";
import { formatNulls } from "src/utils/format";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import React from "react";
import { TableRow } from "@mui/material";
import { TableBody, Table, Box, Collapse } from "@mui/material";

interface CustomTableBodyProps {
  items: Item[];
  columns: Column;
  isCollapsible: boolean;
  styles: any;
}

export default function CustomTableBody({
  items,
  columns,
  isCollapsible,
  styles,
}: CustomTableBodyProps) {
  const dispatch = useAppDispatch();
  const { selectedItems, collapseItem } = useUISelector((state) => state.ui);
  const { isMobile } = useIsMobile();
  const theme = useTheme();

  const handleSelectItem = (itemId: string) => {
    dispatch(setSelectedItems(itemId));
  };

  const handleCollapse = (id: string) => {
    if (id === collapseItem) {
      dispatch(resetCollapse());
    } else {
      dispatch(setCollapse(id));
    }
  };

  return (
    <TableBody>
      {items.map((row, index) => {
        const selected = isSelected(selectedItems, row.id);
        const collapsed = isCollapsed(collapseItem, row.id);

        return (
          <React.Fragment key={`${index}-${row.id}`}>
            <TableRow
              selected={selected}
              sx={{
                "& > *": { borderBottom: selected ? "0px" : "unset" },
              }}
            >
              <TableCell padding="checkbox" sx={{ cursor: "pointer" }}>
                <Checkbox
                  color="primary"
                  size="small"
                  checked={selected}
                  onClick={() => handleSelectItem(row.id)}
                />
              </TableCell>

              {(columns as IColumn<Item>[]).map((column) => {
                const value = column.render
                  ? column.render(row)
                  : formatNulls(row[column.id]);

                return (
                  <React.Fragment key={`${index}-${column.id}`}>
                    <TableCell
                      height={50}
                      component="th"
                      scope="row"
                      size="small"
                      key={column.id}
                      align={column.align ?? "right"}
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleSelectItem(row.id)}
                    >
                      <Tooltip title={value}>
                        <Typography
                          variant="subtitle2"
                          noWrap
                          color={lighten(theme.palette.text.primary, 0.2)}
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {typeof value === "string"
                            ? value.charAt(0).toUpperCase() + value.slice(1)
                            : value}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </React.Fragment>
                );
              })}

              {isCollapsible ? (
                <TableCell
                  align="right"
                  sx={isMobile ? styles.stickyMobile : styles.sticky}
                  onClick={() => handleCollapse(row.id)}
                >
                  <IconButton>
                    {collapsed ? (
                      <KeyboardArrowUpRounded />
                    ) : (
                      <KeyboardArrowDownRounded />
                    )}
                  </IconButton>
                </TableCell>
              ) : null}
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  paddingBottom: 0,
                  paddingTop: 0,
                  borderInline: "none",
                  borderBlock: collapsed ? "" : "none",
                }}
                colSpan={
                  // + 2 because of the checkbox and the collapse cell.
                  columns.length + 2
                }
              >
                <Collapse in={collapsed} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      History
                    </Typography>
                    <Table size="small">
                      <Head>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Total price ($)</TableCell>
                        </TableRow>
                      </Head>
                      <TableBody>
                        {[
                          {
                            date: "2020-01-05",
                            customerId: "11091700",
                            amount: 3,
                          },
                          {
                            date: "2020-01-02",
                            customerId: "Anonymous",
                            amount: 1,
                          },
                        ].map((historyRow) => (
                          <TableRow key={historyRow.date}>
                            <TableCell component="th" scope="row">
                              {historyRow.date}
                            </TableCell>
                            <TableCell>{historyRow.customerId}</TableCell>
                            <TableCell align="right">
                              {historyRow.amount}
                            </TableCell>
                            <TableCell align="right">
                              {Math.round(historyRow.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        );
      })}
    </TableBody>
  );
}
