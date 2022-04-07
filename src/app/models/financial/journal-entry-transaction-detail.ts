import { SelectItem } from "primeng/api"

export class JournalEntryTransactionDetail {
    id: number = -1;
    idTemp: number = -1;
    idCostCenter: number = -1;
    costCenter: string = "";
    idBranchOffice: number = -1;
    branchOffice: string = "";
    idAccountingAccount: number = -1;
    accountingAccount: string = "";
    codeAccountingAccount: string = "";
    idPlanCuentaContableDetalle: number = -1;
    idAuxiliary: number = -1;
    auxiliary: string = "";
    description: string = "";
    referent: string
    debit: number = 0;
    debitBase: number = 0;
    debitConvertion: number = 0;
    assets: number = 0;
    assetsBase: number = 0;
    assetsConvertion: number = 0;
    indActive: boolean = false;
    isModified: boolean = false;
    auxiliaries: SelectItem<number>[] =[];
    indDebit: boolean = false;
    indAssets: boolean = false;
    indAuxiliary: boolean = false;
   }