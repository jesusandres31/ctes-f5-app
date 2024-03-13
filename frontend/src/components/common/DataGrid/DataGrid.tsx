import { useEffect } from "react";
import { Column, Entity, FetchItemsFunc, Item, Order } from "src/types";
import { Loading, ErrorMsg } from "src/components/common";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import PageContainer from "../PageContainer/PageContainer";
import NoItems from "../NoItems";
import {
  resetFilter,
  resetPage,
  resetSelectedItems,
  setOrderBy,
  setSnackbar,
  useUISelector,
} from "src/slices/ui/uiSlice";
import { useAppDispatch } from "src/app/store";
import { ListResult } from "pocketbase";
import CustomTableToolbar from "./content/CustomTableToolbar";
import { CustomGrid } from "./content/utils";
import { TableContainer, Table } from "@mui/material";
import CustomTableHead from "./content/CustomTableHead";
import CustomTablePagination from "./content/CustomTablePagination";
import CustomTableBody from "./content/CustomTableBody";

const styles = {
  sticky: {
    position: "sticky",
    paddingBlock: 0,
  },
  stickyMobile: {
    position: "sticky",
    paddingBlock: 0,
    right: 0,
    padding: 0,
    margin: 0,
  },
};

interface DataGridProps {
  data: ListResult<Item> | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isFetching: boolean;
  columns: Column;
  entity: Entity;
  defaultOrderBy: string;
  fetchItemsFunc: FetchItemsFunc;
  isCollapsible?: boolean;
}

export default function DataGrid({
  data,
  error,
  isFetching,
  columns,
  entity,
  defaultOrderBy,
  fetchItemsFunc,
  isCollapsible = true,
}: DataGridProps) {
  const dispatch = useAppDispatch();
  const { filter, order, orderBy, page, perPage } = useUISelector(
    (state) => state.ui
  );

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

  return (
    <PageContainer>
      <CustomTableToolbar handleFetchItems={handleFetchItems} entity={entity} />
      {data && data.items && data.items.length > 0 ? (
        <TableContainer sx={{ flex: "1 1 auto" }}>
          <Table
            sx={{
              borderCollapse: "separate",
              tableLayout: "fixed",
            }}
          >
            <CustomTableHead
              columns={columns}
              items={data?.items}
              handleFetchItems={handleFetchItems}
              styles={styles}
            />
            <CustomTableBody
              items={data.items}
              columns={columns}
              isCollapsible={isCollapsible}
              styles={styles}
            />
          </Table>
        </TableContainer>
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
      )}
      <CustomTablePagination data={data} />
    </PageContainer>
  );
}
