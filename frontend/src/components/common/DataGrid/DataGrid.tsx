import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import {
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { MenuRounded, SearchOffRounded } from "@mui/icons-material";
import { useRouter } from "src/hooks/useRouter";
import { Image, Container } from "src/interfaces";
import { IColumn } from "src/types";
import { formatNulls } from "src/utils";
import Loading from "src/components/common/Loading";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import PageContainer from "../PageContainer/PageContainer";

type Item = Container | Image;

// we have to create this Type due to this error message:
// "The expected type comes from property 'columns' which is declared here on type 'IntrinsicAttributes & DataGridProps'."
type Column = IColumn<Container>[] | IColumn<Image>[];

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
          key={column.dataKey}
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
        const labe = column.render
          ? column.render(row)
          : formatNulls(row[column.dataKey]);

        return (
          <TableCell
            height={70}
            component="th"
            scope="row"
            size="small"
            key={column.dataKey}
            align={column.align ?? "right"}
            sx={{ cursor: "pointer" }}
          >
            <Tooltip title={labe}>
              <Typography
                variant="subtitle2"
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {labe}
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
  const { getRouteTitle } = useRouter();
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
                {getRouteTitle()}
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Filter list">
                <IconButton>
                  <MenuRounded />
                </IconButton>
              </Tooltip>
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
  columns: Column;
  noItemsMsg: string;
}

export default function DataGrid({
  items,
  error,
  columns,
  noItemsMsg,
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
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%" }}
            direction="column"
            spacing={1}
          >
            <Grid item>
              <SearchOffRounded
                fontSize="large"
                sx={{ color: "text.secondary" }}
              />
            </Grid>
            <Grid item sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" color="text.secondary">
                {noItemsMsg}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%" }}
            direction="column"
          >
            <Loading />
          </Grid>
        )}
      </>
    </PageContainer>
  );
}
