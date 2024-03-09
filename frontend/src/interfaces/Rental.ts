import { Ball, BaseItem, Client, Field } from ".";

export interface Rental
  extends BaseItem<{ client: Client; field: Field; ball: Ball }>,
    CreateRentalReq {}

export interface CreateRentalReq {
  client: string;
  field: string;
  ball: string;
  started_at: Date;
  hours_amount: NumberOrEmpty;
  total: NumberOrEmpty;
  paid: NumberOrEmpty;
}
