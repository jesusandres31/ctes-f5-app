import React, { ChangeEvent, useEffect } from "react";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import {
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Divider,
  Grid,
  Toolbar,
  Typography,
  Button,
  Checkbox,
  TablePagination,
} from "@mui/material";
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
import {
  AddCircleOutlineRounded,
  CreateRounded,
  DeleteForeverRounded,
} from "@mui/icons-material";
import { useIsMobile } from "src/hooks";
import {
  isSelected,
  resetSelectedItems,
  setSelectedItems,
  useUISelector,
} from "src/slices/ui/uiSlice";
import { useAppDispatch } from "src/app/store";

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
 * DataGrid components
 */
function fixedHeaderContent(
  columns: Column,
  handleSelectAll: (e: ChangeEvent<HTMLInputElement>) => void,
  isAllSelected: boolean,
  selectedItems: string[]
): React.ReactNode {
  return (
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isAllSelected}
          indeterminate={selectedItems.length > 0 && !isAllSelected}
          onChange={handleSelectAll}
          inputProps={{
            "aria-label": "select all desserts",
          }}
        />
      </TableCell>

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

function rowContent(
  _index: number,
  row: Item,
  columns: IColumn<Item>[],
  isSelected: boolean,
  handleSelectItem: (item: string) => void
) {
  return (
    <>
      <TableCell
        padding="checkbox"
        sx={{ cursor: "pointer" }}
        onClick={() => handleSelectItem(row.id)}
      >
        <Checkbox color="primary" checked={isSelected} />
      </TableCell>
      {columns.map((column) => {
        const value = column.render
          ? column.render(row)
          : formatNulls(row[column.id]);

        return (
          <TableCell
            height={60}
            component="th"
            scope="row"
            size="small"
            key={column.id}
            align={column.align ?? "right"}
            sx={{ cursor: "pointer" }}
            onClick={() => handleSelectItem(row.id)}
          >
            {/* <Tooltip title={value}> */}
            <Typography
              variant="subtitle2"
              noWrap
              color="text.secondary"
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
            {/* </Tooltip> */}
          </TableCell>
        );
      })}
    </>
  );
}

interface TableToolbarProps {
  selectedItems: string[];
}

function TableToolbar({ selectedItems }: TableToolbarProps) {
  const { route } = useRouter();

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        flex: "0 0 auto",
        pt: 2,
        pb: 3,
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
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
        <Grid item>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Grid container alignItems="center" sx={{ gap: 2 }}>
                {selectedItems.length === 0 && (
                  <CustomButton
                    color="success"
                    text="Create"
                    icon={<AddCircleOutlineRounded />}
                    onClick={() => {}}
                  />
                )}
                {selectedItems.length === 1 && (
                  <CustomButton
                    color="info"
                    text="Update"
                    icon={<CreateRounded />}
                    onClick={() => {}}
                  />
                )}
                {selectedItems.length > 0 && (
                  <CustomButton
                    color="error"
                    text="Remove"
                    icon={<DeleteForeverRounded />}
                    onClick={() => {}}
                  />
                )}
              </Grid>
            </Grid>
            {/* <Grid item>
              <IconButton onClick={() => {}}>
                <MoreVertRounded />
              </IconButton>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
}

interface DataGridProps {
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
  const dispatch = useAppDispatch();
  const { route } = useRouter();
  const { selectedItems } = useUISelector((state) => state.ui);

  const isAllSelected = items?.length === selectedItems.length;

  useEffect(() => {
    dispatch(resetSelectedItems());
  }, [route]);

  const handleSelectItem = (itemId: string) => {
    dispatch(setSelectedItems(itemId));
  };

  const handleSelectAll = () => {
    if (isAllSelected) return dispatch(resetSelectedItems());
    if (items) return dispatch(setSelectedItems(items.map((item) => item.id)));
  };

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
    TableRow: ({ item: _item, ...props }) => {
      return (
        <TableRow selected={isSelected(selectedItems, _item.id)} {...props} />
      );
    },
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };

  const itemContent = (_index: number, row: Item) =>
    rowContent(
      _index,
      row,
      columns as IColumn<Item>[],
      isSelected(selectedItems, row.id),
      handleSelectItem
    );

  return (
    <PageContainer>
      <>
        {items && items.length > 0 ? (
          <React.Fragment>
            <TableToolbar {...rest} selectedItems={selectedItems} />
            <TableVirtuoso
              style={{
                flex: "1 1 auto",
              }}
              data={items}
              fixedHeaderContent={() =>
                fixedHeaderContent(
                  columns,
                  handleSelectAll,
                  isAllSelected,
                  selectedItems
                )
              }
              components={VirtuosoTableComponents}
              itemContent={itemContent}
              totalCount={items.length}
            />
            <Grid container justifyContent="center" flexDirection="column">
              <Divider />
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={/* rows.length */ 10}
                rowsPerPage={/* rowsPerPage */ 10}
                page={/* page */ 1}
                onPageChange={/* handleChangePage */ () => {}}
                onRowsPerPageChange={/* handleChangeRowsPerPage */ () => {}}
              />
              {/* <Grid item p={2}>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Typography
                      variant="subtitle2"
                      color="text.primary"
                      sx={{ mt: 1 }}
                    >
                      {`Showing ${items.length} items`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid> */}
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

const CustomButton = ({
  color,
  text,
  onClick,
  icon,
}: {
  color:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  text: string;
  onClick: Function;
  icon: React.ReactNode;
}) => {
  const { isMobile } = useIsMobile();

  return (
    <Button
      variant="outlined"
      color={color}
      size={isMobile ? "small" : "medium"}
      onClick={(e) => onClick(e)}
      startIcon={icon}
    >
      <Typography sx={{ fontWeight: "bold" }}>{text}</Typography>
    </Button>
  );
};
