import { GetExpenseRes } from "src/interfaces";
import { Entity, IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { expenseApi } from "src/app/services/expenseService";
import { formatDate } from "src/utils";
import DeleteModal from "src/components/common/Modals/DeleteModal";
import { useUISelector } from "src/slices/ui/uiSlice";

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

const DEFAULT_ORDER_BY: keyof GetExpenseRes = "created";

const ENTITY: Entity = "expenses";

export default function Expenses() {
  const { actionModal, selectedItems } = useUISelector((state) => state.ui);
  const [getExpenses, { data, isFetching, error }] =
    expenseApi.useLazyGetExpensesQuery();
  const [deleteExpense] = expenseApi.useDeleteExpenseMutation();

  const createModalOpen = actionModal.create === ENTITY;
  const updateModalOpen = actionModal.update === ENTITY;
  const deleteModalOpen = actionModal.delete === ENTITY;
  const label = selectedItems.length === 1 ? "egreso" : "egresos";

  const handleDelete = async () => {
    const res = await deleteExpense(selectedItems).unwrap();
    /* console.log(res); */
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
      <DeleteModal
        open={deleteModalOpen}
        label={label}
        hanleConfirm={handleDelete}
      />
    </>
  );
}
