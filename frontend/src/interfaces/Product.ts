import { BaseItem } from ".";

export interface Product extends BaseItem<{}>, CreateProductReq {}

export interface CreateProductReq {
  name: string;
  stock: number | "";
  unit_price: number | "";
}
