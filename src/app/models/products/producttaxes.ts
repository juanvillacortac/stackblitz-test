import { TaxRate } from "../masters/tax-rate";
import { Product } from "./product";

export class ProductTaxes {
  id: number = -1;
  product: Product = new Product();
  taxRate: TaxRate = new TaxRate();
  active: boolean = true;
  createdByUser: string = "";
  createdByUserId: number = -1;
  updatedByUser: string = "";
  updatedByUserId: number = -1;
  dateCreate: Date = new Date();
  dateUpdate: Date = new Date();
}
