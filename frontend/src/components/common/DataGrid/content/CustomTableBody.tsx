import {
  Column,
  DataGridData,
  DataGridError,
  FetchItemDetailsFunc,
  IColumn,
  Item,
} from "src/types";
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
import { formatNulls, renderValue } from "src/utils/format";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import React from "react";
import { TableRow } from "@mui/material";
import { TableBody, Table, Box, Collapse } from "@mui/material";
import NoItems from "../../NoItems";
import { ErrorMsg, Loading } from "../..";
import { CustomGrid } from "./utils";

interface CustomTableBodyProps {
  items: Item[];
  columns: Column;
  dataDetail?: DataGridData;
  errorDetail?: DataGridError;
  isFetchingDetail?: boolean;
  detailColumns?: Column;
  fetchItemDetailsFunc?: FetchItemDetailsFunc;
  styles: any;
}

export default function CustomTableBody({
  items,
  columns,
  dataDetail,
  errorDetail,
  isFetchingDetail,
  detailColumns,
  fetchItemDetailsFunc,
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
      if (fetchItemDetailsFunc) return fetchItemDetailsFunc(id);
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
                          {renderValue(value)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </React.Fragment>
                );
              })}

              {fetchItemDetailsFunc ? (
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
                  // + 2 if collapsed because of the checkbox and the collapse cell.
                  columns.length + (fetchItemDetailsFunc ? 2 : 1)
                }
              >
                <Collapse in={collapsed} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Table size="small">
                      <Head>
                        <TableRow>
                          {detailColumns &&
                            detailColumns.map((column) => (
                              <TableCell
                                size="small"
                                key={column.id}
                                align={column.align ?? "right"}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                        </TableRow>
                      </Head>

                      {dataDetail &&
                      dataDetail.items &&
                      dataDetail.items.length > 0 ? (
                        <TableBody
                          sx={{ width: "100%", backgroundColor: "red" }}
                        >
                          {/* {dataDetail.items.map((item) =>
                            (detailColumns as IColumn<Item>[]).map((column) => {
                              const value = column.render
                                ? column.render(item)
                                : formatNulls(item[column.id]);

                              return (
                                <TableCell component="th" scope="item">
                                  {renderValue(value)}
                                </TableCell>
                              );
                            })
                          )} */}
                        </TableBody>
                      ) : dataDetail &&
                        dataDetail.items &&
                        dataDetail.items.length ? (
                        <CustomGrid>
                          <NoItems />
                        </CustomGrid>
                      ) : errorDetail ? (
                        <CustomGrid>
                          <ErrorMsg />
                        </CustomGrid>
                      ) : isFetchingDetail ? (
                        <CustomGrid>
                          <Loading />
                        </CustomGrid>
                      ) : null}
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
