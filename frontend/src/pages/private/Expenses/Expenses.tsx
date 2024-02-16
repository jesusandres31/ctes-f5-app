import { GetExpenseRes } from "src/interfaces";
import { Entity, IColumn, PromiseStatus } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { expenseApi } from "src/app/services/expenseService";
import { formatDate } from "src/utils";
import DeleteModal from "src/components/common/Modals/DeleteModal";
import {
  resetSelectedItems,
  setSnackbar,
  useUISelector,
} from "src/slices/ui/uiSlice";
import { useAppDispatch } from "src/app/store";
import { MSG } from "src/constants";
import CreateModal from "src/components/common/Modals/CreateModal";

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
  const dispatch = useAppDispatch();
  const { actionModal, selectedItems } = useUISelector((state) => state.ui);
  const [getExpenses, { data, isFetching, error }] =
    expenseApi.useLazyGetExpensesQuery();
  const [deleteExpense, { isLoading: isDeleting }] =
    expenseApi.useDeleteExpenseMutation();

  const MODAL = {
    create: actionModal.create === ENTITY,
    update: actionModal.update === ENTITY,
    delete: actionModal.delete === ENTITY,
    label: selectedItems.length > 1 ? "Egresos" : "Egreso",
  };

  const handleCreate = async () => {
    // const res = await deleteExpense(selectedItems).unwrap();
    // if (res.every((item) => item.status === PromiseStatus.FULFILLED)) {
    //   dispatch(resetSelectedItems());
    //   dispatch(setSnackbar({ message: "Egreso eliminado" }));
    // }
  };

  const handleUpdate = async () => {
    // const res = await deleteExpense(selectedItems).unwrap();
    // if (res.every((item) => item.status === PromiseStatus.FULFILLED)) {
    //   dispatch(resetSelectedItems());
    //   dispatch(setSnackbar({ message: "Egreso eliminado" }));
    // }
  };

  const handleDelete = async () => {
    const res = await deleteExpense(selectedItems).unwrap();
    if (res.every((item) => item.status === PromiseStatus.FULFILLED)) {
      dispatch(resetSelectedItems());
      dispatch(setSnackbar({ message: MSG.successDelete(res.length) }));
    }
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
        open={MODAL.delete}
        label={MODAL.label}
        hanleConfirm={handleDelete}
        isDeleting={isDeleting}
      />
      <CreateModal
        open={MODAL.create}
        label={MODAL.label}
        hanleConfirm={handleCreate}
      >
        asd
      </CreateModal>
    </>
  );
}
