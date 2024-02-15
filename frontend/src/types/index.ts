import { GetExpenseConceptRes, GetExpenseRes } from "src/interfaces";

export interface IColumn<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: "right" | "left";
  render?: (item: T) => JSX.Element | string | null;
}

export type Order = "asc" | "desc";

// all the app entities goes here
export type Item = GetExpenseRes | GetExpenseConceptRes;

// modal configuration
export type Entity = "expenses" | "expense_concepts";
export type Action = "create" | "update" | "delete";

// we have to create this Type due to this error message:
// "The expected type comes from property 'columns' which is declared here on type 'IntrinsicAttributes & DataGridProps'."
export type Column = IColumn<GetExpenseRes>[] | IColumn<GetExpenseConceptRes>[];

export interface IMenuItem {
  text: string;
  icon: React.ReactNode;
  to: string;
  onClick?: () => void;
}

export interface DrawerSection {
  title: string;
  menuItems: IMenuItem[];
}

export type GetList = {
  page: number;
  perPage: number;
  filter?: string;
  order?: Order;
  orderBy?: string;
};

/**
 * Promise settled statuses
 */
export enum PromiseStatus {
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}
