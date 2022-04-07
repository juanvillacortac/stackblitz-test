export class RequestType{
    id: number = -1;
    name: string = "";
    createByUserID: number = -1;
    updateByUserID: number = -1;
    active : boolean = false;
    createDate: Date = new Date();
    updateDate: Date = new Date();
}