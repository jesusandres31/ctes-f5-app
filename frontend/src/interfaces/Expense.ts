export interface Expense {
  id: string;
  expense_concept_id: string;
  detail: string;
  amount: number;
  unit_price: number;
  total: number;
  created: Date;
  updated: Date;
}
