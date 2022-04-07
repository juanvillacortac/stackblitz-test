import { DriversPerVehicle } from "./driverspervehicle";

export class Vehicle {
    id:number =-1;
    vehicleOwnerID:number = -1;
    vehicleDriver:string ="";
    vehicleTypeID:number = -1;
    vehicleType:string="";
    vehicleModelID:number = -1;
    vehicleModel:string ="";
    vehicleTrailerID:number = -1;
    createdByUserId:number = -1;
    updatedByUserId:number = -1;
    vehicleYear:number = 0;
    vehicleCode:string ="";
    vehicleOwner:string ="";    
    vehicleColor:string ="";
    vehicleRegistrationPlate:string ="";
    motorSerialNumber:string ="";
    chargeCapacity:number=0;
    kilometers:number=0;
    observation:string ="";
    trailerObservation:string ="";
    vehicleTrailer:string ="";
    vehiclePicture:string ="";
    driversPerVehicleList:DriversPerVehicle[];
    active:boolean=false;
    trailerSetupDate:Date = new Date(1900,0,1);
    creationDate:Date;
    updateDate:Date;
}
