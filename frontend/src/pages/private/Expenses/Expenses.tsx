import { GetExpenseRes } from "src/interfaces";
import { IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { expenseApi } from "src/app/services/expenseService";
import { PAGE } from "src/constants";
import { useEffect } from "react";

const columns: IColumn<GetExpenseRes>[] = [
  {
    minWidth: 150,
    label: "Concepto",
    id: "expense_concept",
    render: (item) => item.expand.expense_concept.name,
    align: "left",
  },
  {
    minWidth: 150,
    label: "Detalle",
    id: "detail",
    align: "left",
  },
  {
    minWidth: 100,
    label: "Cantidad",
    id: "amount",
    align: "right",
  },
  {
    minWidth: 100,
    label: "Precio Unit.",
    id: "unit_price",
    align: "right",
    render: (item) => `$ ${item.unit_price}`,
  },
  {
    minWidth: 100,
    label: "Total",
    id: "total",
    align: "right",
    render: (item) => `$ ${item.total}`,
  },
];

export default function Expenses() {
  const [getExpenses, { data, isFetching, error }] =
    expenseApi.useLazyGetExpensesQuery();

  useEffect(() => {
    getExpenses({
      page: PAGE.firstPage,
      perPage: PAGE.rowsPerPage,
    });
  }, []);

  return (
    <DataGrid
      columns={columns}
      data={data}
      error={error}
      isFetching={isFetching}
      fetchItemsFunc={getExpenses}
    />
  );
}
