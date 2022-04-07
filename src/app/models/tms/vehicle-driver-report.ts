import { report } from "process";

export class VehicleDriverReport {
    vehicleCode:string ="";
    vehicleModelID:number = -1;
    vehicleModel:string ="";
    vehicleTypeID:number = -1;
    vehicleType:string="";
    vehicleRegistrationPlate :string ="";
    vehicleOwner:string = "";
    vehicleYear:number = 0;
    motorSerialNumber:string ="";
    chargeCapacity:number=0;
    kilometers:number=0;
    documentNumber: string= "";
    userDriver:string= "";
    idUserDriver:number=-1;
    idTypeDriver:number=-1;
    typeDriver:string= "";
    indMedicalCertificate:boolean;
    certificateIssueDate:string = ""; 
    certificateExpirationDate:string = ""; 
    indDriverLicense:boolean;
    licenseLevel:string = "";
    licenseIssueDate:string = ""; 
    licenseExpirationDate:string = ""; 
}