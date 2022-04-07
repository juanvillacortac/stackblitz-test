import { FrequencyRequestSetup } from "./frequencyrequestsetup";

export class RequestSetup {
        requestSetupID:number=-1;
        requestTypeID:number=-1;
        branchOfficeRequestID:number=-1;
        branchOfficeDispatchesID:number=-1;
        categoryID:number=-1;
        priorityID:number=-1;
        operationsDocument:string;
        branchOfficeRequest:string;
        branchOfficeDispatches:string;
        category:string;
        priority:string;
        setUpCode:string;
        frequencyRequestSetup:string;
        frequencyRequestSetupList:FrequencyRequestSetup[];
        active:boolean;
        createdByUserID:number;
        updatedByUserID:number;
        createdByUser:string;
        updatedByUser:string;
        dateOfCreation:Date;
        dateOfModification:Date;
}
