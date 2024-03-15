import { Rental } from "src/interfaces";
import { Entity, IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { rentalApi } from "src/app/services/rentalService";
import { formatDate, formatMoney } from "src/utils/format";
import { useUISelector } from "src/slices/ui/uiSlice";
import DeleteRentals from "./content/DeleteRentals";
import CreateOrUpdateRental from "./content/CreateOrUpdateRental";

const COLUMNS: IColumn<Rental>[] = [
  {
    minWidth: 100,
    label: "Cliente",
    id: "client",
    render: (item) => item.expand.client.name,
    align: "left",
  },
  {
    minWidth: 150,
    label: "Cancha",
    id: "field",
    align: "right",
    render: (item) => item.expand.field.name,
  },
  {
    minWidth: 100,
    label: "Pelota",
    id: "ball",
    align: "right",
    render: (item) => item.expand.ball.name,
  },
  {
    minWidth: 100,
    label: "Horas",
    id: "hours_amount",
    align: "right",
  },
  {
    minWidth: 100,
    label: "Hora Inicio",
    id: "started_at",
    align: "right",
    render: (item) => formatDate(item.started_at),
  },
  {
    minWidth: 100,
    label: "Total",
    id: "total",
    align: "right",
    render: (item) => formatMoney(item.total),
  },
  {
    minWidth: 100,
    label: "Pagado",
    id: "paid",
    align: "right",
    render: (item) => formatMoney(item.paid),
  },
];

const DEFAULT_ORDER_BY: keyof Rental = "created";

const ENTITY: Entity = "rentals";

export default function Rentals() {
  const { actionModal, selectedItems } = useUISelector((state) => state.ui);
  const [getRentals, { data, isFetching, error }] =
    rentalApi.useLazyGetRentalsQuery();

  const MODAL = {
    create: actionModal.create === ENTITY,
    update: actionModal.update === ENTITY,
    delete: actionModal.delete === ENTITY,
    label: selectedItems.length > 1 ? "Alquileres" : "Alquier",
  };

  return (
    <>
      <DataGrid
        data={data}
        error={error}
        isFetching={isFetching}
        columns={COLUMNS}
        defaultOrderBy={DEFAULT_ORDER_BY}
        fetchItemsFunc={getRentals}
        entity={ENTITY}
      />
      <DeleteRentals open={MODAL.delete} label={MODAL.label} />
      <CreateOrUpdateRental
        open={MODAL.create || MODAL.update}
        label={MODAL.label}
      />
    </>
  );
}
