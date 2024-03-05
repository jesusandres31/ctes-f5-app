import { BaseItem } from ".";

export interface Product extends BaseItem<{}>, CreateProductReq {}

export interface CreateProductReq {
  name: string;
  stock: NumberOrEmpty;
  unit_price: NumberOrEmpty;
}
