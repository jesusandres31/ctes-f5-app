import { BaseItem } from ".";

export interface PaymentMethod extends BaseItem<{}>, CreatePaymentMethodReq {}

export interface CreatePaymentMethodReq {
  name: string;
  detail: string;
}
