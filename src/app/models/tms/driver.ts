export class Driver {

    id:number= -1;
    
    observations:string= "";

    identifier: string= "";

    documentNumber: string= "";

    userDriver:string= "";

    idUserDriver:number=-1;

    idTypeDriver:number=-1;

    typeDriver:string= "";

    idLicenseLevel:number=-1;

    licenseLevel:string = "";
    
    indMedicalCertificate:boolean;

    indDriverLicense:boolean;

    certificateIssueDate:string = ""; 

    certificateExpirationDate:string = ""; 
    
    ciDate:Date= new Date(1900,0,1);

    ceDate:Date= new Date(1900,0,1);

    licenseIssueDate:string = ""; 

    licenseExpirationDate:string = ""; 

    liDate:Date= new Date(1900,0,1);

    leDate:Date= new Date(1900,0,1);
    
    createdByUserId:number=-1;
    
    createdByUser:string="";
    
    updatedByUserId:number=-1;
    
    updatedByUser:string="";
    
    dateCreate:Date; 
    
    dateUpdate:Date; 
    
    active:boolean=false;

}
