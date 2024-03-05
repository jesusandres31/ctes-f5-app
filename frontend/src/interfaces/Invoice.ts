import { BaseItem, Client, Product } from ".";

export interface Invoice
  extends BaseItem<{ client: Client }>,
    CreateInvoiceReq {}

export interface CreateInvoiceReq {
  client: string;
  data: Date;
  total: NumberOrEmpty;
  paid: NumberOrEmpty;
}

export interface InvoiceItem
  extends BaseItem<{ invoice: Invoice; product: Product }>,
    CreateInvoiceReq {}

export interface CreateInvoiceItemReq {
  invoice: string;
  product: string;
  amount: NumberOrEmpty;
  unit_price: NumberOrEmpty;
  total: NumberOrEmpty;
  paid: NumberOrEmpty;
}
