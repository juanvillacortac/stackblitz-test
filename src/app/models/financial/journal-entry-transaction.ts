import { BaseModel } from "../common/BaseModel"
import { Coins } from "../masters/coin"
import { JournalEntryTransactionDetail } from "./journal-entry-transaction-detail"
import { Lots } from "./lots"

export class JournalEntryTransaction {
    id: number = -1
    idCompany: number = -1;
    company: string = "";
    idLot: number = -1;
    lot: string = "";
    idCoin: number = -1;
    coin: string = "";
    idFiscalYear: number = -1;
    fiscalYear: string = "";
    idExchangeRateBase: number = -1;
    idExchangeRateConvertion: number = -1;
    idStatus: number = -1;
    status: string = "";
    idType: number = -1;
    type: string = "";
    idCreateUser: number = -1;
    createUser: string = "";
    idUpdateUser: number = -1;
    updateUser: string = "";
    documentNumber: string = "";
    concept: string ="";
    referent: string = "";
    debit: number = 0;
    assets: number = 0;
    indActive: boolean = false;
    annulmentDate: Date;
    cancellationDate: Date;
    createDate: Date = new Date();
    postingDate: Date;
    updateDate: Date = new Date()
    transactionDate: Date;
    details: JournalEntryTransactionDetail[] = []
   }