import { GetExpenseConceptRes } from "src/interfaces";
import { Entity, IColumn, PromiseStatus } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { expenseApi } from "src/app/services/expenseService";
import { useAppDispatch } from "src/app/store";
import {
  resetSelectedItems,
  setSnackbar,
  useUISelector,
} from "src/slices/ui/uiSlice";
import DeleteModal from "src/components/common/Modals/DeleteModal";
import { MSG } from "src/constants";
import CreateModal from "src/components/common/Modals/CreateModal";

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
  const dispatch = useAppDispatch();
  const { actionModal, selectedItems } = useUISelector((state) => state.ui);
  const [getExpenseConcepts, { data, isFetching, error }] =
    expenseApi.useLazyGetExpenseConceptsQuery();
  const [deleteExpenseConcept, { isLoading: isDeleting }] =
    expenseApi.useDeleteExpenseConceptMutation();

  const MODAL = {
    create: actionModal.create === ENTITY,
    update: actionModal.update === ENTITY,
    delete: actionModal.delete === ENTITY,
    label:
      selectedItems.length > 1 ? "Conceptos de Egreso" : "Concepto de Egreso",
  };

  const handleCreate = async () => {
    // const res = await deleteExpenseConcept(selectedItems).unwrap();
    // if (res.every((item) => item.status === PromiseStatus.FULFILLED)) {
    //   dispatch(resetSelectedItems());
    //   dispatch(setSnackbar({ message: "Egreso eliminado" }));
    // }
  };

  const handleUpdate = async () => {
    // const res = await deleteExpenseConcept(selectedItems).unwrap();
    // if (res.every((item) => item.status === PromiseStatus.FULFILLED)) {
    //   dispatch(resetSelectedItems());
    //   dispatch(setSnackbar({ message: "Egreso eliminado" }));
    // }
  };

  const handleDelete = async () => {
    const res = await deleteExpenseConcept(selectedItems).unwrap();
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
        fetchItemsFunc={getExpenseConcepts}
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
