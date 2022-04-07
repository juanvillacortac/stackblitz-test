import { IdentifierType } from "../security/IdentifierType";
import { Typevalidationrange } from "./common/typevalidationrange"

export class Validationrange {
  id: number = -1;
  name: string = "";
  minimum: number = 0;
  middle: number = 0;
  maximum: number = 0;
  typeValidationRange: Typevalidationrange;
  createdByUserId: number = -1;
  createdByUser: string = "";
  updatedByUserId: number = -1;
  updatedByUser: string = "";
  createdDate: Date;
  updatedDate: Date;
  active: boolean = false;
  indInitialConfiguration: boolean = false;
}
