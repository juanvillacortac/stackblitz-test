import { AccountingAccountItem } from "./AccountingAccountItem"
import { Module } from "./Modules"

export class AccountingAccount {
   
 accountingAccountId :number=-1

 planCuentaContableDetalleId:number=-1

 descripcion:string ="";

 accountingAccountName: string ="";

 accountingAccountCode :string ="";
  
 accountingAccountCategoryId :number=-1;

 accountingAccountCategory :string ="";

 tipoSaldoTipicoId :number =-1
 
 typeOfAccountingId:number =-1
  
 typeOfAccounting :string ="";

 createdByUserId :number =-1

 createdByUser :string ="";

 updatedByUserId :number =-1
  
 updateByUser :string ="";

 createdDate :string ="";
  
 updatedDate :string ="";

 auxiliary:AccountingAccountItem []=[];
 
 auxStr?: string
 
 accountingAccountStr:string

 module: Module []=[];
 
 active :boolean = false

 indPermiteAuxiliar:boolean= false


}
