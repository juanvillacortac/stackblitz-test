export class Normative{
    id: number = -1;
    name: string = "";
    description: string = "";
    createdByUser: string = "";
    createdByUserId: number = -1;
    updatedByUser: string = "";
    updatedByUserId: number = -1;
    expirationDate: Date = new Date();
    createdDate: Date;
    updatedDate: Date;
    active: boolean = false;
    indInitialConfiguration: boolean = false;
}