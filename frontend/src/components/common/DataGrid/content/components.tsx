import React from "react";
import { TableComponents } from "react-virtuoso";
import {
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Divider,
  Typography,
  Box,
  Collapse,
} from "@mui/material";
import { Item } from "src/types";
import { isCollapsed, isSelected, useUISelector } from "src/slices/ui/uiSlice";

export default function components(columnsLength: number) {
  const VirtuosoTableComponents: TableComponents<Item> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
      <TableContainer {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table
        {...props}
        sx={{
          borderCollapse: "separate",
          tableLayout: "fixed",
        }}
      />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => (
      <TableRowComponent
        item={_item}
        columnsLength={columnsLength}
        {...props}
      />
    ),
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };
  return VirtuosoTableComponents;
}

interface TableRowComponentProps {
  item: Item;
  columnsLength: number;
}

function TableRowComponent({
  item: _item,
  columnsLength,
  ...props
}: TableRowComponentProps) {
  const { selectedItems, collapseItem } = useUISelector((state) => state.ui);

  return (
    <React.Fragment>
      <TableRow
        selected={isSelected(selectedItems, _item.id)}
        sx={{
          "& > *": { borderBottom: "unset" },
        }}
        {...props}
      />
      <TableRowContent
        item={_item}
        collapseItem={collapseItem}
        columnsLength={columnsLength}
      />
    </React.Fragment>
  );
}

interface TableRowContentProps {
  item: Item;
  collapseItem: string;
  columnsLength: number;
}

function TableRowContent({
  item,
  collapseItem,
  columnsLength,
}: TableRowContentProps) {
  return (
    <TableRow>
      <TableCell
        sx={{
          paddingBottom: 0,
          paddingTop: 0,
          border: "none",
        }}
        colSpan={
          // + 2 because of the checkbox and collapse cell.
          columnsLength + 2
        }
      >
        <Collapse
          in={isCollapsed(collapseItem, item.id)}
          timeout="auto"
          unmountOnExit
        >
          <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
              History
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Total price ($)</TableCell>
                </TableRow>
              </TableHead>
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
                    <TableCell align="right">{historyRow.amount}</TableCell>
                    <TableCell align="right">
                      {Math.round(historyRow.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
        {isCollapsed(collapseItem, item.id) && <Divider />}
      </TableCell>
    </TableRow>
  );
}
