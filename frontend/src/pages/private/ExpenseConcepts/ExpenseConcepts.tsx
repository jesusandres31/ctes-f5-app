import { GetExpenseConceptRes } from "src/interfaces";
import { IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { useGetExpenseConceptsQuery } from "src/app/services/expenseService";

const columns: IColumn<GetExpenseConceptRes>[] = [
  {
    minWidth: 150,
    label: "Nombre",
    id: "name",
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
    label: "Precio Unit.",
    id: "unit_price",
    align: "right",
  },
];

export default function ExpenseConcepts() {
  const {
    data: expenseConcpets,
    isLoading,
    error,
  } = useGetExpenseConceptsQuery();

  return (
    <DataGrid
      columns={columns}
      items={expenseConcpets}
      error={error}
      isLoading={isLoading}
    />
  );
}
