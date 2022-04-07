import { AccountingItemSegmentViewModel } from "./accounting-item-segment-viewmodel";

export class AccountingItemViewModel{

    idAccountingItem: number;
    segmentNumber: number;
    idSeparatorCharacter: number;
    accountingItemDetail: AccountingItemSegmentViewModel[];
}