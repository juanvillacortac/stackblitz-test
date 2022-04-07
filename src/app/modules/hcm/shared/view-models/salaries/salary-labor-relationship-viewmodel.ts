import { SalariesViewModel } from "./salaries-viewmodel";

export class SalaryByLaborRelationshipViewModel {
    idLaborRelationship: number;                                                     
    employmentCode: string;                                                    
    idDocumentType: number; 
    documentType: string;
    identifier: string;
    documentNumber: string;
    employeeFirstName: string;
    employeeSecondName: string;
    employeeLastName: string;
    employeeSecondLastName: string;
    idCompany: number;   
    company: number;                                                          
    idBranchOffice: number;                                          
    branchOffice: string;     
    idJobPosition: number;                                                           
    jobPosition: string;  
    fixedPositionInd: boolean; 
    salaries: SalariesViewModel[];
    
}