import { GetExpenseRes } from "src/interfaces";
import { IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { expenseApi } from "src/app/services/expenseService";
import { formatDate } from "src/utils";

const DEFAULT_ORDER_BY: keyof GetExpenseRes = "created";

const COLUMNS: IColumn<GetExpenseRes>[] = [
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
  {
    minWidth: 100,
    label: "Fecha Creación",
    id: "created",
    align: "right",
    render: (item) => formatDate(item.created),
  },
];

export default function Expenses() {
  const [getExpenses, { data, isFetching, error }] =
    expenseApi.useLazyGetExpensesQuery();

  return (
    <DataGrid
      data={data}
      error={error}
      isFetching={isFetching}
      columns={COLUMNS}
      defaultOrderBy={DEFAULT_ORDER_BY}
      fetchItemsFunc={getExpenses}
    />
  );
}
