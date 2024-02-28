import { BaseItem } from ".";

export interface Field extends BaseItem<{}>, CreateFieldReq {}

export interface CreateFieldReq {
  name: string;
  price_per_hour: number | "";
}
