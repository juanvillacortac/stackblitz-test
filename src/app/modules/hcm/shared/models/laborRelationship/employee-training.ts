import { EmployeeTrainingDetail } from "./employee-training-detail";

export class EmployeeTraining{
    
    idEmployee: number = -1;    
    idLaborRelationship: number = -1;    
    focusImproving? : string = "";
    skills? : string = "";
    training : EmployeeTrainingDetail[] = [];
    
}