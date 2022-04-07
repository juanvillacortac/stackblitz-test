import { IdentifierType } from "../security/IdentifierType";
import { Gtingrouping } from "./common/gtingrouping";

export class Gtintype {
  id: number = -1;
  name: string = "";
  abbreviation: string = "";
  digitAmount: number = 0;
  alphanumeric: boolean = false;
  checkDigit: boolean = false;
  gtinGrouping: Gtingrouping;
  createdByUserId: number = 0;
  createdByUser: string = "";
  updatedByUserId: number = 0;
  updatedByUser: string = "";
  createdDate: Date;
  updatedDate: Date;
  active: boolean = false;
  initialSetup: boolean = false;
}
