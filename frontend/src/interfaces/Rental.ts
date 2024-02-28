import { BaseItem, Ball, Client, Field } from ".";

export interface Rental
  extends BaseItem<{ client: Client; field: Field; ball: Ball[] }>,
    CreateRentalReq {}

export interface CreateRentalReq {
  client: string;
  field: string;
  ball: string[];
  hours_amount: number | "";
  started_at: Date;
  total: number | "";
  paid: number | "";
}
