import React, { ChangeEvent, useCallback, useEffect } from "react";
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
  Typography,
  Checkbox,
  TablePagination,
  debounce,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import {
  Column,
  Entity,
  FetchItemsFunc,
  IColumn,
  Item,
  Order,
} from "src/types";
import { formatNulls } from "src/utils";
import { Loading, ErrorMsg } from "src/components/common";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import PageContainer from "../PageContainer/PageContainer";
import NoItems from "../NoItems";
import { useIsMobile } from "src/hooks";
import {
  isSelected,
  resetFilter,
  resetPage,
  resetSelectedItems,
  setFilter,
  setOrderBy,
  setPage,
  setSelectedItems,
  setSnackbar,
  toggleSortDirection,
  useUISelector,
} from "src/slices/ui/uiSlice";
import { useAppDispatch } from "src/app/store";
import { ListResult } from "pocketbase";
import TableToolbar from "./content/TableToolbar";
import { CustomGrid } from "./content/utils";

// move VirtuosoTableComponents outside DataGrid
// because it causes a constant re rendering on select item.
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
    const { selectedItems } = useUISelector((state) => state.ui);
    return (
      <TableRow selected={isSelected(selectedItems, _item.id)} {...props} />
    );
  },
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent(
  columns: Column,
  handleSelectAll: (e: ChangeEvent<HTMLInputElement>) => void,
  isAllSelected: boolean,
  selectedItems: string[],
  items: Item[] | undefined,
  handleSortTable: (columnId: string) => void
): React.ReactNode {
  const { orderBy, order } = useUISelector((state) => state.ui);

  return (
    <TableRow>
      <TableCell
        padding="checkbox"
        sx={{ backgroundColor: "background.paper" }}
      >
        <Checkbox
          color="primary"
          checked={(items && items.length > 0 && isAllSelected) ?? false}
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
          sortDirection={orderBy === column.id ? order : false}
        >
          <TableSortLabel
            active={orderBy === column.id}
            direction={orderBy === column.id ? order : "asc"}
            onClick={() => handleSortTable(column.id)}
          >
            <Typography variant="body2" fontWeight="bold">
              {column.label}
            </Typography>
          </TableSortLabel>
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
      <TableCell padding="checkbox" sx={{ cursor: "pointer" }}>
        <Checkbox
          color="primary"
          checked={isSelected}
          onClick={() => handleSelectItem(row.id)}
        />
      </TableCell>
      {columns.map((column) => {
        const value = column.render
          ? column.render(row)
          : formatNulls(row[column.id]);

        return (
          <TableCell
            height={55}
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
            </Tooltip>
          </TableCell>
        );
      })}
    </>
  );
}

interface DataGridProps {
  data: ListResult<Item> | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isFetching: boolean;
  columns: Column;
  entity: Entity;
  defaultOrderBy: string;
  fetchItemsFunc: FetchItemsFunc;
}

export default function DataGrid({
  data,
  error,
  isFetching,
  columns,
  entity,
  defaultOrderBy,
  fetchItemsFunc,
  ...rest
}: DataGridProps) {
  const dispatch = useAppDispatch();
  const { selectedItems, filter, order, orderBy, page, perPage } =
    useUISelector((state) => state.ui);
  const { isMobile } = useIsMobile();

  const isAllSelected = data?.items.length === selectedItems.length;

  useEffect(() => {
    dispatch(resetPage());
    dispatch(resetFilter());
    dispatch(resetSelectedItems());
    dispatch(setOrderBy(defaultOrderBy));
  }, []);

  useEffect(() => {
    // fetch in first render.
    if (orderBy && orderBy === defaultOrderBy) {
      handleFetchItems(page, perPage, filter, order, orderBy);
    }
  }, [orderBy, page]);

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    // because pagination starts at 0 in MUI TablePagination.
    dispatch(setPage(newPage + 1));
  };

  const handleFetchItems = async (
    page: number,
    perPage: number,
    filter: string,
    order: Order,
    orderBy: string
  ) => {
    try {
      await fetchItemsFunc({
        page,
        perPage,
        filter,
        order,
        orderBy,
      });
    } catch (err: any) {
      dispatch(setSnackbar({ message: err.data.error, type: "error" }));
    }
  };

  const handleSelectItem = (itemId: string) => {
    dispatch(setSelectedItems(itemId));
  };

  const handleSelectAll = () => {
    if (isAllSelected) return dispatch(resetSelectedItems());
    if (data?.items)
      return dispatch(setSelectedItems(data.items.map((item) => item.id)));
  };

  const debounceFetchItems = useCallback(
    debounce(async (filter: string) => {
      handleFetchItems(page, perPage, filter, order, orderBy);
    }, 300),
    []
  );

  const handleSetFilter = async (filter: string) => {
    dispatch(setFilter(filter));
    debounceFetchItems(filter);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const filter = e.currentTarget.value;
    handleSetFilter(filter);
  };

  const handleClickClear = () => {
    if (filter) {
      handleSetFilter("");
    }
  };

  const handleSortTable = (columnId: string) => {
    const newOrder =
      orderBy === columnId ? (order === "asc" ? "desc" : "asc") : "desc";
    if (orderBy === columnId) {
      dispatch(toggleSortDirection());
    } else {
      dispatch(setOrderBy(columnId));
    }
    handleFetchItems(page, perPage, filter, newOrder, columnId);
  };

  return (
    <PageContainer>
      <>
        <TableToolbar
          {...rest}
          selectedItems={selectedItems}
          isMobile={isMobile}
          onClickClear={handleClickClear}
          onChange={handleSearch}
          entity={entity}
        />
        <TableVirtuoso
          style={{
            flex: "1 1 auto",
          }}
          data={data?.items}
          components={VirtuosoTableComponents}
          fixedHeaderContent={() =>
            fixedHeaderContent(
              columns,
              handleSelectAll,
              isAllSelected,
              selectedItems,
              data?.items,
              handleSortTable
            )
          }
          itemContent={(_index: number, row: Item) =>
            data && data.items && data.items.length > 0 ? (
              rowContent(
                _index,
                row,
                columns as IColumn<Item>[],
                isSelected(selectedItems, row.id),
                handleSelectItem
              )
            ) : data && data.items && data.items.length === 0 ? (
              <CustomGrid>
                <NoItems />
              </CustomGrid>
            ) : error ? (
              <CustomGrid>
                <ErrorMsg />
              </CustomGrid>
            ) : isFetching ? (
              <CustomGrid>
                <Loading />
              </CustomGrid>
            ) : (
              <CustomGrid>
                <></>
              </CustomGrid>
            )
          }
          totalCount={data?.items.length}
        />
        <Grid container justifyContent="center" flexDirection="column">
          <Divider />
          <TablePagination
            component="div"
            rowsPerPageOptions={[data?.perPage || 0]}
            count={data?.totalItems || 0}
            rowsPerPage={data?.perPage || 0}
            page={
              // - 1 because pagination starts at 0 in MUI TablePagination.
              !data?.totalItems || data?.totalItems <= 0 ? 0 : data?.page - 1
            }
            onPageChange={handleChangePage}
            labelDisplayedRows={(info) => {
              return `Results ${info.from} - ${
                info.to === -1 ? info.count : info.to
              }, ${"of"} ${data?.totalItems} items`;
            }}
            // onRowsPerPageChange={() => {}}
          />
        </Grid>
      </>
    </PageContainer>
  );
}
