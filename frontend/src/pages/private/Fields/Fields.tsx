import { Field } from "src/interfaces";
import { Entity, IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { fieldApi } from "src/app/services/fieldService";
import { useUISelector } from "src/slices/ui/uiSlice";
import CreateOrUpdateField from "./content/CreateOrUpdateField";
import DeleteFields from "./content/DeleteFields";
import { formatDate, formatMoney } from "src/utils";

const COLUMNS: IColumn<Field>[] = [
  {
    minWidth: 150,
    label: "Nombre",
    id: "name",
    align: "left",
  },
  {
    minWidth: 100,
    label: "Precio por Hora",
    id: "price_per_hour",
    align: "right",
    render: (item) => formatMoney(item.price_per_hour),
  },
  {
    minWidth: 100,
    label: "Fecha Creación",
    id: "created",
    align: "right",
    render: (item) => formatDate(item.created),
  },
];

const DEFAULT_ORDER_BY: keyof Field = "created";

const ENTITY: Entity = "fields";

export default function Fields() {
  const { actionModal, selectedItems } = useUISelector((state) => state.ui);
  const [getFields, { data, isFetching, error }] =
    fieldApi.useLazyGetFieldsQuery();

  const MODAL = {
    create: actionModal.create === ENTITY,
    update: actionModal.update === ENTITY,
    delete: actionModal.delete === ENTITY,
    label: selectedItems.length > 1 ? "Cancha" : "Canchas",
  };

  return (
    <>
      <DataGrid
        data={data}
        error={error}
        isFetching={isFetching}
        columns={COLUMNS}
        defaultOrderBy={DEFAULT_ORDER_BY}
        fetchItemsFunc={getFields}
        entity={ENTITY}
      />
      <DeleteFields open={MODAL.delete} label={MODAL.label} />
      <CreateOrUpdateField
        open={MODAL.create || MODAL.update}
        label={MODAL.label}
      />
    </>
  );
}
