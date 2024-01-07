import { Expense } from "src/interfaces";
import { IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { useGetExpensesQuery } from "src/app/services/expenseService";

const columns: IColumn<Expense>[] = [
  {
    minWidth: 50,
    label: "Amount",
    id: "amount",
    align: "left",
  },
  {
    minWidth: 150,
    label: "Total",
    id: "total",
    align: "left",
  },
];

export default function Containers() {
  const { data: expenses, error } = useGetExpensesQuery();

  return (
    <DataGrid
      items={expenses}
      error={error}
      columns={columns}
      noItemsMsg="No Images built"
    />
  );
}
