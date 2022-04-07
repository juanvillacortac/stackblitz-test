import { AddressSupplier } from "./addres-supplier";
import { Company } from "./company";
import { ContactNumberSupplier } from "./contactnumber-supllier";
import { ExchangeRatesSupplier } from "./exchange-rates-suppliers";
import { UserSupplier } from "./usersuppliers";

export class SupplierBankAccount {
  supplierBankAccountId = -1
  companyId = 1
  clientSupplierId = -1
  accountTypeId = -1
  bankId = -1
  currencyId = -1
  accountNumber = ''
  indSupplier = true
}

export class SupplierAccountingAccount {
  supplierBankAccountId = -1
  companyId = 1
  clientSupplierId = -1
  accountingAccountId = -1
  accountingAccount = ''
  accountingAccountCode = ''
  indAuxiliar = false
  active = true
  useId = -1
  use = ''
  auxiliarId = -1
  auxiliar = ''
  indSupplier = true
}

export class SupplierFinancialSetup {
  clientSupplierId?: number
  accountingAccounts?: SupplierAccountingAccount[] = []
  bankAccounts?: SupplierBankAccount[] = []
}

export class SupplierExtend {
  idclientsupplier: number = -1;
  idcompaniesupplier: number = -1;
  idcompany: number = -1;
  idsuppliertype: number = -1;
  iddocumentType: number = -1;
  documenttype: string = "";
  idcountry: number = -1;
  country: string = "";
  ididentifier: number = -1;
  identifier: string = "";
  documentnumber: string = "";
  socialReason: string = "";
  commercialreason: string = "";
  active: boolean = false;
  indclient: boolean = false;
  indsupplier: boolean = false;
  createdByUser: string = "";
  supplierclasification: string = "";
  idsupplierclasification: number = -1;
  idClientClasification: number = -1;
  personType: number = 1;
  clientClasification: string = "";
  idOperationalDocumentType: number = -1;
  idtaxpayertype: number = -1;
  idcurrency: number = -1;
  idexchangetype: number = -1;
  idpaymentcondition: number = -1;
  createdByUserId: number = -1;
  updatedByUser: string = "";
  updatedByUserId: number = -1;
  indCustomexchangetype: boolean = false;
  indconsignment: boolean = false;
  phone: string = "";
  email: string = "";
  website: string = "";
  createdate: Date = new Date();
  companies: Company[] = [];
  contactNumbers: ContactNumberSupplier[] = [];
  addresses: AddressSupplier[] = [];
  users: UserSupplier[] = [];
  exchangeRates: ExchangeRatesSupplier[] = [];

  financialSetup?: SupplierFinancialSetup
}
