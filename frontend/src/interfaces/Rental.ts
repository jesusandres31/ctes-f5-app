import { BaseItem, Client, Field } from ".";

export interface Rental
  extends BaseItem<{ client: Client; field: Field }>,
    CreateRentalReq {}

export interface CreateRentalReq {
  client: string;
  field: string;
  started_at: Date;
  hours_amount: NumberOrEmpty;
  total: NumberOrEmpty;
  paid: NumberOrEmpty;
}
