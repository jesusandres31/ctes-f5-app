import { GetExpenseConceptRes } from "src/interfaces";
import { IColumn } from "src/types";
import DataGrid from "src/components/common/DataGrid/DataGrid";
import { expenseApi } from "src/app/services/expenseService";
import { PAGE } from "src/constants";
import { useEffect } from "react";

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
    render: (item) => `$ ${item.unit_price}`,
  },
];

export default function ExpenseConcepts() {
  const [getExpenseConcepts, { data, isLoading, error }] =
    expenseApi.useLazyGetExpenseConceptsQuery();

  useEffect(() => {
    getExpenseConcepts({
      page: PAGE.firstPage,
      perPage: PAGE.rowsPerPage,
    });
  }, []);

  return (
    <DataGrid
      columns={columns}
      data={data}
      error={error}
      isLoading={isLoading}
      fetchItemsFunc={getExpenseConcepts}
    />
  );
}
