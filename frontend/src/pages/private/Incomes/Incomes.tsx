import { GetExpenseRes } from "src/interfaces";
import { IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { useGetExpensesQuery } from "src/app/services/expenseService";

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
  },
  {
    minWidth: 100,
    label: "Total",
    id: "total",
    align: "right",
  },
];

export default function Incomes() {
  const { data: expenses, isLoading, error } = useGetExpensesQuery();

  return (
    <DataGrid
      columns={columns}
      items={expenses}
      error={error}
      isLoading={isLoading}
    />
  );
}
