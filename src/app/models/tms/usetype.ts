export class UseType{
    id: number = -1;
    name: string = "";
    createByUserID: number = -1;
    updateByUserID: number = -1;
    internal: boolean = false;
    external: boolean = false;
    active : boolean = false;
    createDate: Date = new Date();
    updateDate: Date = new Date();
}