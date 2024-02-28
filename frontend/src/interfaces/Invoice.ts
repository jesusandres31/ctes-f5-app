import { BaseItem, Client, Product } from ".";

export interface Invoice
  extends BaseItem<{ client: Client }>,
    CreateInvoiceReq {}

export interface CreateInvoiceReq {
  client: string;
  data: Date;
  total: number | "";
  paid: number | "";
}

export interface InvoiceItem
  extends BaseItem<{ invoice: Invoice; product: Product }>,
    CreateInvoiceReq {}

export interface CreateInvoiceItemReq {
  invoice: string;
  product: string;
  amount: number | "";
  unit_price: number | "";
  total: number | "";
  paid: number | "";
}
