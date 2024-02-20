import { ExpenseConcept } from ".";

export interface Expense {
  id: string;
  expense_concept: string;
  detail: string;
  amount: number;
  unit_price: number;
  total: number;
  created: Date;
  updated: Date;
  expand: { expense_concept: ExpenseConcept };
}

export interface CreateExpenseReq {
  expense_concept: string;
  detail: string;
  amount: number | "";
  unit_price: number | "";
  total: number | "";
}

export interface UpdateExpenseReq {
  id: string;
  data: CreateExpenseReq;
}
