export interface ExpenseConcept {
  id: string;
  name: string;
  detail: string;
  unit_price: number;
  created: Date;
  updated: Date;
}

export interface CreateExpenseConceptReq {
  name: string;
  detail: string;
  unit_price: number | "";
}

export interface UpdateExpenseConceptReq {
  id: string;
  data: CreateExpenseConceptReq;
}
