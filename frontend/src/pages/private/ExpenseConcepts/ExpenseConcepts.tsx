import { GetExpenseConceptRes } from "src/interfaces";
import { Entity, IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { expenseApi } from "src/app/services/expenseService";

const COLUMNS: IColumn<GetExpenseConceptRes>[] = [
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
    render: (item) => `$ ${item.unit_price}`,
  },
];

const DEFAULT_ORDER_BY: keyof GetExpenseConceptRes = "name";

const ENTITY: Entity = "expense_concepts";

export default function ExpenseConcepts() {
  const [getExpenseConcepts, { data, isFetching, error }] =
    expenseApi.useLazyGetExpenseConceptsQuery();

  return (
    <DataGrid
      data={data}
      error={error}
      isFetching={isFetching}
      columns={COLUMNS}
      defaultOrderBy={DEFAULT_ORDER_BY}
      fetchItemsFunc={getExpenseConcepts}
      entity={ENTITY}
    />
  );
}
