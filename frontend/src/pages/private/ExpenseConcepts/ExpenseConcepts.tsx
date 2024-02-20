import { ExpenseConcept } from "src/interfaces";
import { Entity, IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { expenseConceptApi } from "src/app/services/expenseConceptService";
import { useUISelector } from "src/slices/ui/uiSlice";
import CreateOrUpdateExpenseConcept from "./content/CreateOrUpdateExpenseConcept";
import DeleteExpenseConcepts from "./content/DeleteExpenseConcepts";

const COLUMNS: IColumn<ExpenseConcept>[] = [
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

const DEFAULT_ORDER_BY: keyof ExpenseConcept = "name";

const ENTITY: Entity = "expense_concepts";

export default function ExpenseConcepts() {
  const { actionModal, selectedItems } = useUISelector((state) => state.ui);
  const [getExpenseConcepts, { data, isFetching, error }] =
    expenseConceptApi.useLazyGetExpenseConceptsQuery();

  const MODAL = {
    create: actionModal.create === ENTITY,
    update: actionModal.update === ENTITY,
    delete: actionModal.delete === ENTITY,
    label:
      selectedItems.length > 1 ? "Conceptos de Egreso" : "Concepto de Egreso",
  };

  return (
    <>
      <DataGrid
        data={data}
        error={error}
        isFetching={isFetching}
        columns={COLUMNS}
        defaultOrderBy={DEFAULT_ORDER_BY}
        fetchItemsFunc={getExpenseConcepts}
        entity={ENTITY}
      />
      <DeleteExpenseConcepts open={MODAL.delete} label={MODAL.label} />
      <CreateOrUpdateExpenseConcept
        open={MODAL.create || MODAL.update}
        label={MODAL.label}
      />
    </>
  );
}
