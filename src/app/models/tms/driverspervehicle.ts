export class DriversPerVehicle {
    idDriverVehicle:number=-1;
    idVehicle:number=-1;
    idDriver:number=-1;
    idTypeDriver:number=-1;
    driver:string="";
    typeDriver:string="";
    observations:string="";
    driverAssignmentDate:Date=new Date(1900,0,1);
    active:boolean=false;
    createdByUserID:number=-1;
    updatedByUserID:number=-1;
    dateOfCreation:Date;
    dateOfModification:Date;
}
