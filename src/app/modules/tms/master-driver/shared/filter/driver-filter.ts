import { Operator } from "src/app/models/common/operator";

export class DriverFilter {
    id:number= -1;
    idUserDriver:number= -1;    
    idTypeDriver:number= -1;
    idLicenseLevel:number =-1;
    idTypeIdentification:number=-1;
    identification:string= "";
    indMedicalCertificate:number=-1;
    indDriverLicense:number=-1;
    active:number=-1;

    UserDriver:string = "";
    operator:Operator;
}
