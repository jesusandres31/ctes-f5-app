import { AppRoutes } from "src/config";

/**
 * title
 */
export const translateTitle = (title?: string) => {
  switch (title) {
    case AppRoutes.Expenses:
      return "Egresos";
    case AppRoutes.ExpenseConcepts:
      return "Conceptos de Egresos";
    case AppRoutes.Clients:
      return "Clientes";
    case AppRoutes.Rentals:
      return "Alquileres";
    case AppRoutes.Sales:
      return "Ventas";
    case AppRoutes.Products:
      return "Productos";
    case AppRoutes.Fields:
      return "Canchas";
    case AppRoutes.Balls:
      return "Pelotas";
    case AppRoutes.StatsIncomes:
      return "Ventas";
    case AppRoutes.StatsClients:
      return "Clientes";
    case AppRoutes.StatsProducts:
      return "Productos";
    case AppRoutes.PaymenMethods:
      return "Metodos de Pago";
    default:
      return title;
  }
};

export const removeForeslash = (str?: string) => {
  str = str || "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
