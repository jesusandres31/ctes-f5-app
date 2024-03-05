import { PaymentMethod } from "src/interfaces";
import { Entity, IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { paymentMethodApi } from "src/app/services/paymentMethodService";
import { useUISelector } from "src/slices/ui/uiSlice";
import CreateOrUpdatePaymentMethod from "./content/CreateOrUpdatePaymentMethod";
import DeletePaymentMethods from "./content/DeletePaymentMethods";
import { formatDate } from "src/utils";

const COLUMNS: IColumn<PaymentMethod>[] = [
  {
    minWidth: 150,
    label: "Nombre",
    id: "name",
    align: "left",
  },
  {
    minWidth: 100,
    label: "Detalle",
    id: "detail",
    align: "right",
  },
  {
    minWidth: 100,
    label: "Fecha Creación",
    id: "created",
    align: "right",
    render: (item) => formatDate(item.created),
  },
];

const DEFAULT_ORDER_BY: keyof PaymentMethod = "created";

const ENTITY: Entity = "payment_methods";

export default function PaymentMethods() {
  const { actionModal, selectedItems } = useUISelector((state) => state.ui);
  const [getPaymentMethods, { data, isFetching, error }] =
    paymentMethodApi.useLazyGetPaymentMethodsQuery();

  const MODAL = {
    create: actionModal.create === ENTITY,
    update: actionModal.update === ENTITY,
    delete: actionModal.delete === ENTITY,
    label: selectedItems.length > 1 ? "Metodo de Pago" : "Metodos de Pago",
  };

  return (
    <>
      <DataGrid
        data={data}
        error={error}
        isFetching={isFetching}
        columns={COLUMNS}
        defaultOrderBy={DEFAULT_ORDER_BY}
        fetchItemsFunc={getPaymentMethods}
        entity={ENTITY}
      />
      <DeletePaymentMethods open={MODAL.delete} label={MODAL.label} />
      <CreateOrUpdatePaymentMethod
        open={MODAL.create || MODAL.update}
        label={MODAL.label}
      />
    </>
  );
}
