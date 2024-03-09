import { useEffect } from "react";
import { TableVirtuoso } from "react-virtuoso";
import {
  Column,
  Entity,
  FetchItemsFunc,
  IColumn,
  Item,
  Order,
} from "src/types";
import { Loading, ErrorMsg } from "src/components/common";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import PageContainer from "../PageContainer/PageContainer";
import NoItems from "../NoItems";
import {
  isCollapsed,
  isSelected,
  resetCollapse,
  resetFilter,
  resetPage,
  resetSelectedItems,
  setCollapse,
  setOrderBy,
  setSelectedItems,
  setSnackbar,
  useUISelector,
} from "src/slices/ui/uiSlice";
import { useAppDispatch } from "src/app/store";
import { ListResult } from "pocketbase";
import TableToolbar from "./content/TableToolbar";
import { CustomGrid } from "./content/common/utils";
import components from "./content/components";
import fixedHeaderContent from "./content/fixedHeaderContent";
import rowContent from "./content/rowContent";
import TablePagination from "./content/TablePagination";
import { useIsMobile } from "src/hooks";

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
  const { selectedItems, collapseItem, filter, order, orderBy, page, perPage } =
    useUISelector((state) => state.ui);
  const { isMobile } = useIsMobile();

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
    <PageContainer>
      <>
        <TableToolbar
          {...rest}
          handleFetchItems={handleFetchItems}
          entity={entity}
        />
        {data && data.items && data.items.length > 0 ? (
          <TableVirtuoso
            style={{
              flex: "1 1 auto",
            }}
            data={data?.items}
            components={components(columns.length)}
            fixedHeaderContent={() =>
              fixedHeaderContent(columns, data?.items, handleFetchItems)
            }
            itemContent={(_index: number, row: Item) =>
              rowContent(
                _index,
                row,
                columns as IColumn<Item>[],
                isMobile,
                isSelected(selectedItems, row.id),
                isCollapsed(collapseItem, row.id),
                handleSelectItem,
                handleCollapse
              )
            }
            totalCount={data?.items.length}
          />
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
        <TablePagination data={data} />
      </>
    </PageContainer>
  );
}
