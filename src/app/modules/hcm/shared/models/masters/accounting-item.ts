import { AccountingItemSegment } from "./accounting-item-segment";

export class AccountingItem{

    idAccountingItem: number =-1;
    idCompany: number =-1;
    segmentNumber: number =-1;
    idSeparatorType: number =-1;
    separatorType: string ="";
    active: boolean = false;
    accountingItemDetail: AccountingItemSegment[] = [];
}