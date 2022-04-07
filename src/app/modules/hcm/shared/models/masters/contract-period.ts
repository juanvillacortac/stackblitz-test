
export class ContractPeriod {
    id: number = -1;
    unityId: number = -1;
    createdByUserId: number = -1;
    updatedByUserId: number = -1;
    contractPeriodName: string = "";
    abbreviation: string = "";
    duration: number = -1;
    active: boolean = true;
    indInitialConfiguration: number = -1;
    createdDate: Date;
    updatedDate: Date;
}