export interface Expense {
  id: string;
  expense_concept: string;
  detail: string;
  amount: number;
  unit_price: number;
  total: number;
  created: Date;
  updated: Date;
}

export interface ExpenseConcept {
  id: string;
  name: string;
  detail: string;
  unit_price: number;
  created: Date;
  updated: Date;
}

export interface GetExpenseRes extends Expense {
  expand: { expense_concept: ExpenseConcept };
}

export interface GetExpenseConceptRes extends ExpenseConcept {}
