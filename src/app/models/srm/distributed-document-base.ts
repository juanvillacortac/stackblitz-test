import { DistributedDocument } from "./distributed-document";

export class DistributedDocumentBase {
    
idOrderPurchase : number=-1;

idBranchOffice : number=-1;

branchOfficeName : string="";

idStatus  : number=-1;

status: string="";

idOperationDocumentBase : number=-1;

operationDocumentBase : string="";

createdbyId : number=-1;

createdby : string="";

idDistributionType : number=-1;

distributionType: string="";

baseDocumentIdentifierNumber : string="";

items : number=-1;

distributedDocuments:DistributedDocument[]=[];

}
