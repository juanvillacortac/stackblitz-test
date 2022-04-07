import { Salaries } from "./salaries";

export class SalaryByLaborRelationship {
    idLaborRelationship: number = -1;                                                     
    employmentCode: string = "";                                                    
    idDocumentType: number = -1; 
    documentType: string = "";
    identifier: string = "";
    documentNumber: string = "";
    employeeFirstName: string = "";
    employeeSecondName: string = "";
    employeeLastName: string = "";
    employeeSecondLastName: string = "";
    idCompany: number = 0;   
    company: number = 0;                                                          
    idBranchOffice: number = 0;                                          
    branchOffice: string = "";     
    idJobPosition: number = -1;                                                           
    jobPosition: string = "";  
    fixedPositionInd: boolean = false; 
    salaries: Salaries[] = [];
    
}