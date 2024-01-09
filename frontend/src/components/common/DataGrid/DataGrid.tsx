import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import { Divider, Grid, Toolbar, Tooltip, Typography } from "@mui/material";
import { useRouter } from "src/hooks/useRouter";
import { IColumn } from "src/types";
import { formatNulls } from "src/utils";
import { Loading, ErrorMsg } from "src/components/common";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import PageContainer from "../PageContainer/PageContainer";
import { GetExpenseConceptRes, GetExpenseRes } from "src/interfaces";
import NoItems from "../NoItems";
import { AppRoutes } from "src/config";

type Item = GetExpenseRes | GetExpenseConceptRes;

// we have to create this Type due to this error message:
// "The expected type comes from property 'columns' which is declared here on type 'IntrinsicAttributes & DataGridProps'."
type Column = IColumn<GetExpenseRes>[] | IColumn<GetExpenseConceptRes>[];

// translate title in grid
const translateTitle = (title: string) => {
  switch (title) {
    case AppRoutes.Expenses:
      return "Egresos";
    case AppRoutes.ExpenseConcepts:
      return "Conceptos de Egresos";
    default:
      return title;
  }
};

/**
 * Virtualized table components
 */
const VirtuosoTableComponents: TableComponents<Item, IColumn<Item>[]> = {
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
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent(columns: Column): React.ReactNode {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.id}
          variant="head"
          align={column.align ?? "right"}
          style={{ width: column.minWidth }}
          sx={{
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {column.label}
          </Typography>
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index: number, row: Item, columns: IColumn<Item>[]) {
  return (
    <>
      {columns.map((column) => {
        const value = column.render
          ? column.render(row)
          : formatNulls(row[column.id]);

        return (
          <TableCell
            height={70}
            component="th"
            scope="row"
            size="small"
            key={column.id}
            align={column.align ?? "right"}
            sx={{ cursor: "pointer" }}
          >
            <Tooltip title={value}>
              <Typography
                variant="subtitle2"
                noWrap
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
        );
      })}
    </>
  );
}

interface TableToolbarProps {}

function TableToolbar({}: TableToolbarProps) {
  const { route } = useRouter();

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        flex: "0 0 auto",
      }}
    >
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
                color="text.primary"
              >
                {translateTitle(route)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
}

interface DataGridProps extends TableToolbarProps {
  items: Item[] | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
  columns: Column;
}

export default function DataGrid({
  items,
  error,
  isLoading,
  columns,
  ...rest
}: DataGridProps) {
  return (
    <PageContainer>
      <>
        {items && items.length > 0 ? (
          <React.Fragment>
            <TableToolbar {...rest} />
            <TableVirtuoso
              style={{
                flex: "1 1 auto",
              }}
              data={items}
              components={VirtuosoTableComponents}
              fixedHeaderContent={() => fixedHeaderContent(columns)}
              itemContent={(_index, row) =>
                rowContent(_index, row, columns as IColumn<Item>[])
              }
            />
            <Grid container justifyContent="center" flexDirection="column">
              <Divider />
              <Grid item p={2}>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Typography
                      variant="subtitle1"
                      color="text.primary"
                      sx={{ mt: 1 }}
                    >
                      {`Showing ${items.length} items`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        ) : error ? (
          <CustomGrid>
            <ErrorMsg />
          </CustomGrid>
        ) : isLoading ? (
          <CustomGrid>
            <Loading />
          </CustomGrid>
        ) : (
          <CustomGrid>
            <NoItems />
          </CustomGrid>
        )}
      </>
    </PageContainer>
  );
}

const CustomGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100%" }}
      direction="column"
    >
      {children}
    </Grid>
  );
};
