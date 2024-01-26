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
  Toolbar,
  Typography,
  Button,
  Checkbox,
  TablePagination,
  IconButton,
  useTheme,
  lighten,
  Tooltip,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "src/hooks/useRouter";
import { GetList, IColumn } from "src/types";
import { formatNulls } from "src/utils";
import { Loading, ErrorMsg } from "src/components/common";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryActionCreatorResult,
} from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import PageContainer from "../PageContainer/PageContainer";
import { GetExpenseConceptRes, GetExpenseRes } from "src/interfaces";
import NoItems from "../NoItems";
import {
  AddRounded,
  CreateRounded,
  DeleteForeverRounded,
  SearchRounded,
  ClearRounded,
} from "@mui/icons-material";
import { useIsMobile } from "src/hooks";
import {
  isSelected,
  resetSelectedItems,
  setSelectedItems,
  useUISelector,
} from "src/slices/ui/uiSlice";
import { useAppDispatch } from "src/app/store";
import { QueryDefinition } from "@reduxjs/toolkit/query";
import { ListResult } from "pocketbase";
import { PAGE } from "src/constants";

type Item = GetExpenseRes | GetExpenseConceptRes;

// we have to create this Type due to this error message:
// "The expected type comes from property 'columns' which is declared here on type 'IntrinsicAttributes & DataGridProps'."
type Column = IColumn<GetExpenseRes>[] | IColumn<GetExpenseConceptRes>[];

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
      <TableCell
        padding="checkbox"
        sx={{ backgroundColor: "background.paper" }}
      >
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
  isMobile: boolean;
  onClickClear: () => void;
}

function TableToolbar({
  selectedItems,
  isMobile,
  onClickClear,
}: TableToolbarProps) {
  const theme = useTheme();
  const isItemsSelected = selectedItems.length > 0;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        flex: "0 0 auto",
        py: 3,
        backgroundColor: isItemsSelected
          ? lighten(theme.palette.primary.light, 0.8)
          : theme.palette.background.paper,
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          {isItemsSelected ? (
            <Typography
              variant={isMobile ? "subtitle2" : "subtitle1"}
              id="tableTitle"
              component="div"
              color="text.primary"
            >
              {`${selectedItems.length} items selected`}
            </Typography>
          ) : (
            <FormControl variant="outlined" size="small" sx={{ my: -1 }}>
              <InputLabel>Search</InputLabel>
              <OutlinedInput
                startAdornment={
                  <InputAdornment
                    position="start"
                    sx={{ color: theme.palette.text.disabled }}
                  >
                    <SearchRounded />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={onClickClear}>
                      <ClearRounded />
                    </IconButton>
                  </InputAdornment>
                }
                label="Search"
              />
            </FormControl>
          )}
        </Grid>
        <Grid item>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Grid container alignItems="center" sx={{ gap: 2, height: 38 }}>
                {selectedItems.length === 0 && (
                  <CustomButton
                    text="Create"
                    icon={<AddRounded />}
                    onClick={() => {}}
                    isMobile={isMobile}
                  />
                )}
                {selectedItems.length === 1 && (
                  <CustomIconButton
                    text="Update"
                    icon={<CreateRounded />}
                    onClick={() => {}}
                    isMobile={isMobile}
                  />
                )}
                {selectedItems.length > 0 && (
                  <CustomIconButton
                    text="Remove"
                    icon={<DeleteForeverRounded />}
                    onClick={() => {}}
                    isMobile={isMobile}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
}

// move VirtuosoTableComponents outside DataGrid because it causes a constant re rendering on select item.
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

interface DataGridProps {
  data: ListResult<Item> | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
  columns: Column;
  fetchItemsFunc: (
    arg: GetList,
    preferCacheValue?: boolean | undefined
  ) => QueryActionCreatorResult<
    QueryDefinition<
      GetList,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      string,
      ListResult<any>,
      "api"
    >
  >;
}

export default function DataGrid({
  data,
  error,
  isLoading,
  columns,
  fetchItemsFunc,
  ...rest
}: DataGridProps) {
  const dispatch = useAppDispatch();
  const { route } = useRouter();
  const { selectedItems } = useUISelector((state) => state.ui);
  const { isMobile } = useIsMobile();

  const isAllSelected = data?.items.length === selectedItems.length;

  useEffect(() => {
    dispatch(resetSelectedItems());
  }, [route]);

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    fetchItemsFunc({
      page: newPage + 1, // because pagination starts at 0 in MUI TablePagination.
      perPage: PAGE.rowsPerPage,
    });
  };

  const handleSelectItem = useCallback(
    (itemId: string) => {
      dispatch(setSelectedItems(itemId));
    },
    [dispatch]
  );

  const handleSelectAll = () => {
    if (isAllSelected) return dispatch(resetSelectedItems());
    if (data?.items)
      return dispatch(setSelectedItems(data.items.map((item) => item.id)));
  };

  const handleClickClear = () => {
    // do something
  };

  return (
    <PageContainer>
      <>
        {data && data.items && data.items.length > 0 ? (
          <React.Fragment>
            <TableToolbar
              {...rest}
              selectedItems={selectedItems}
              isMobile={isMobile}
              onClickClear={handleClickClear}
            />
            <TableVirtuoso
              style={{
                flex: "1 1 auto",
              }}
              data={data.items}
              components={VirtuosoTableComponents}
              fixedHeaderContent={() =>
                fixedHeaderContent(
                  columns,
                  handleSelectAll,
                  isAllSelected,
                  selectedItems
                )
              }
              itemContent={(_index: number, row: Item) =>
                rowContent(
                  _index,
                  row,
                  columns as IColumn<Item>[],
                  isSelected(selectedItems, row.id),
                  handleSelectItem
                )
              }
              totalCount={data.items.length}
            />
            <Grid container justifyContent="center" flexDirection="column">
              <Divider />
              <TablePagination
                component="div"
                rowsPerPageOptions={[data.perPage]}
                count={data.totalItems}
                rowsPerPage={data.perPage}
                page={
                  // - 1 because pagination starts at 0 in MUI TablePagination.
                  data.page - 1
                }
                onPageChange={handleChangePage}
                labelDisplayedRows={(info) => {
                  return `Results ${info.from} - ${
                    info.to === -1 ? info.count : info.to
                  }, ${"of"} ${data.totalItems} items`;
                }}
                // onRowsPerPageChange={() => {}}
              />
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
  isMobile,
}: {
  color?:
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
  isMobile: boolean;
}) => {
  return (
    <Button
      variant="contained"
      color={color ? color : "primary"}
      size={isMobile ? "small" : "medium"}
      onClick={(e) => onClick(e)}
      startIcon={icon}
    >
      <Typography sx={{ fontWeight: "bold" }}>{text}</Typography>
    </Button>
  );
};

const CustomIconButton = ({
  text,
  onClick,
  icon,
  isMobile,
}: {
  text: string;
  onClick: Function;
  icon: React.ReactNode;
  isMobile: boolean;
}) => {
  return (
    <Tooltip title={text}>
      <IconButton
        color="primary"
        size={isMobile ? "small" : "medium"}
        onClick={(e) => onClick(e)}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};
