import { SerializedError } from "@reduxjs/toolkit";
import { FetchArgs, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";
import {
  BaseQueryFn,
  FetchBaseQueryError,
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import { ListResult } from "pocketbase";
import {
  ExpenseConcept,
  Expense,
  Client,
  Product,
  Field,
  Rental,
  Ball,
  PaymentMethod,
} from "src/interfaces";

/**
 * table
 */
export interface IColumn<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: "right" | "left";
  render?: (item: T) => JSX.Element | string | null;
}

export type Order = "asc" | "desc";

/**
 * Modal and DataGrid configuration
 */
export type Action = "create" | "update" | "delete";

export interface IMenuItem {
  text?: string;
  icon?: React.ReactNode;
  to?: string;
  onClick?: () => void;
  nestedItems?: IMenuItem[];
}

export interface DrawerSection {
  title?: string;
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

/**
 * form
 */
export interface Input<T> {
  required: boolean;
  label: string;
  id: string;
  value: any;
  error: string | undefined;
  max?: number;
  min?: number;
  multiline?: boolean;
  InputProps?: {
    inputComponent: React.ComponentType<any>;
    startAdornment?: JSX.Element;
  };
  options?: T[];
  fetchItemsFunc?: FetchItemsFunc;
  loading?: boolean;
  getOptionLabel?: (option: T) => string;
  startValue?: T;
}

/**
 * DataGrid
 */
type RTKQueryFetchFn<T> = (
  arg: T,
  preferCacheValue?: boolean | undefined
) => QueryActionCreatorResult<
  QueryDefinition<
    T,
    BaseQueryFn<
      string | FetchArgs,
      unknown,
      FetchBaseQueryError,
      {},
      FetchBaseQueryMeta
    >,
    string,
    ListResult<any>,
    "api"
  >
>;

export type FetchItemDetailsFunc = RTKQueryFetchFn<string>;

export type FetchItemsFunc = RTKQueryFetchFn<GetList>;

export type DataGridData = ListResult<Item> | undefined;

export type DataGridError = FetchBaseQueryError | SerializedError | undefined;

/**
 * DataGrid entities
 */
export type Entity =
  | "expenses"
  | "expense_concepts"
  | "products"
  | "clients"
  | "fields"
  | "rentals"
  | "balls"
  | "payment_methods";

// all the app entities goes here
export type Item =
  | Expense
  | ExpenseConcept
  | Product
  | Client
  | Field
  | Rental
  | Ball
  | PaymentMethod;

// we have to create this Type due to this error message:
// "The expected type comes from property 'columns' which is declared here on type 'IntrinsicAttributes & DataGridProps'."
export type Column =
  | IColumn<Expense>[]
  | IColumn<ExpenseConcept>[]
  | IColumn<Product>[]
  | IColumn<Client>[]
  | IColumn<Field>[]
  | IColumn<Rental>[]
  | IColumn<Ball>[]
  | IColumn<PaymentMethod>[];
