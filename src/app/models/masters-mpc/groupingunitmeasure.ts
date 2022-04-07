import { IdentifierType } from "../security/IdentifierType";

export class groupingunitmeasure {
  id: number = -1;
  name: string = "";
  abbreviation: string = "";
  activeUnitMeasure: number = 0;
  createdByUserId: number = 0;
  createdByUser: string = "";
  updatedByUserId: number = 0;
  updatedByUser: string = "";
  createdDate: Date;
  updatedDate: Date;
  active: boolean = true;
  indInitialConfiguration: boolean = false;
}
