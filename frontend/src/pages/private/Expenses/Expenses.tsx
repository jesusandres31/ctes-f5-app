import { Expense } from "src/interfaces";
import { Entity, IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { expenseApi } from "src/app/services/expenseService";
import { formatDate } from "src/utils";
import { useUISelector } from "src/slices/ui/uiSlice";
import DeleteExpenses from "./content/DeleteExpenses";
import CreateOrUpdateExpense from "./content/CreateOrUpdateExpense";

const COLUMNS: IColumn<Expense>[] = [
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

const DEFAULT_ORDER_BY: keyof Expense = "created";

const ENTITY: Entity = "expenses";

export default function Expenses() {
  const { actionModal, selectedItems } = useUISelector((state) => state.ui);
  const [getExpenses, { data, isFetching, error }] =
    expenseApi.useLazyGetExpensesQuery();

  const MODAL = {
    create: actionModal.create === ENTITY,
    update: actionModal.update === ENTITY,
    delete: actionModal.delete === ENTITY,
    label: selectedItems.length > 1 ? "Egresos" : "Egreso",
  };

  return (
    <>
      <DataGrid
        data={data}
        error={error}
        isFetching={isFetching}
        columns={COLUMNS}
        defaultOrderBy={DEFAULT_ORDER_BY}
        fetchItemsFunc={getExpenses}
        entity={ENTITY}
      />
      <DeleteExpenses open={MODAL.delete} label={MODAL.label} />
      <CreateOrUpdateExpense
        open={MODAL.create || MODAL.update}
        label={MODAL.label}
      />
    </>
  );
}
