import { SensitivityLevel } from "../masters-mpc/common/sensitivitylevel";
import { Product } from "./product";

export class LogisticDataIndicator {
  id: number = -1;
  product: Product = new Product();
  sensitivityLevel: SensitivityLevel = new SensitivityLevel();
  expirationDate: boolean = false;
  automaticRequest: boolean = false;
  markedPrice: boolean = false;
  manageRecipe: boolean = false;
  refund: boolean = false;
  rounding: boolean = false;
  sadaGuide: boolean = false;
  regulated: boolean = false;
  manageBatch: boolean = false;
  manageSerial: boolean = false;
  createdByUser: string = "";
  updatedByUser: string = "";
}
