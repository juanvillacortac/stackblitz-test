export class Season{
    id: number = -1;
    name: string = "";
    createdByUser: string = "";
    createdByUserId: number = -1;
    updatedByUser: string = "";
    updatedByUserId: number = -1;
    active: boolean = false;
    startDate: Date = new Date();
    endDate: Date = new Date();
}