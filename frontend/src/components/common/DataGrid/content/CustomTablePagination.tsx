import React from "react";
import { Divider, Grid, TablePagination } from "@mui/material";
import { Item } from "src/types";
import { setPage } from "src/slices/ui/uiSlice";
import { useAppDispatch } from "src/app/store";
import { ListResult } from "pocketbase";

interface CustomTablePaginationProps {
  data: ListResult<Item> | undefined;
}

export default function CustomTablePagination({
  data,
}: CustomTablePaginationProps) {
  const dispatch = useAppDispatch();

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    // because pagination starts at 0 in MUI TablePagination.
    dispatch(setPage(newPage + 1));
  };

  return (
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
  );
}
