import { AccountingTemplateDetail } from "./accounting-template-detail";
export class AccountingTemplate {

    idAccountingTemplate: number = -1;
    sequence: number = 0;
    implementationRate: number = 0;
    movementType: string = "";
    stringCount: string = "";
    detail: AccountingTemplateDetail[] = [];
	
}