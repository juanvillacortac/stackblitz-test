import { GroupingInfo } from "./groupingInfo";

export class Concept {
  conceptId: number = -1;
  conceptTypeId: number = -1;
  conceptType: string = '';
  countryId: number = -1;
  bussinnesGroupID : number = 1;
  accumulationLevelId: number = 1;
  accumulationLevel: string = '';
  unitId: number = -1;
  conceptCode: string = '';
  calcPriority: number = 0;
  concept: string = '';
  abbreviation: string = '';
  indIncident: boolean;
  indOmitZeroAmount: boolean;
  active: boolean;
  userCreate: string = '';
  userUpdate: string = '';
  groupings: GroupingInfo[] = [];

}