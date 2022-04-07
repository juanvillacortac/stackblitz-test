import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AccountingAccount } from 'src/app/models/financial/AccountingAccount';
import { AccountingAccountFilter } from 'src/app/models/financial/AccountingAccountFilter';
import { AssociatedAccounts } from 'src/app/models/financial/AssociatedAccounts';
import { Bank } from 'src/app/models/masters/bank';
import { BankType } from 'src/app/models/masters/bank-type';
import { Country } from 'src/app/models/masters/country';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { AccountingAccountService } from 'src/app/modules/financial/AccountingAccounts/shared/services/accounting-account.service';
import { AccountingPlanBase } from 'src/app/modules/financial/initial-setup/shared/accounting-plan-base.component';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { BankService } from '../shared/services/bank.service';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss']
})
export class BankDetailComponent  extends AccountingPlanBase implements OnInit {

  formTitle: string;
  isEdit = false;
  bankActive: number;
  submitted = false;
  loading = false;

  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() bank: Bank;

  countries: SelectItem<Country[]> = {value: null};
  bankTypes: SelectItem<BankType[]> = {value: null};

  selectedCountry: Country;
  selectedBankType: BankType;

  status: SelectItem[] = [
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 2}

  ];
  displayModal: boolean;
  filtrarCuenta: boolean;
  viewMode: boolean;
  accountName:string;
  accountCode:string = null;
  _validations: Validations = new Validations();
  accountingaccountFilter = new AccountingAccountFilter();
  nomString: boolean;

  constructor( private _accountingAccountService: AccountingAccountService,private bankService: BankService, private countryService: CountryService, private messageService: MessageService, 
    private loadingService: LoadingService,public injector:Injector) { 
      super(injector) ;
    }

  ngOnInit(): void {
    this.getCountries();
    this.getBankTypes();
debugger
    if (this.bank && this.bank.id > 0) {
      this.formTitle = 'Editar banco';
      this.bankActive = this.bank.active ? 1 : 2;
      this.isEdit = true;
      this.viewMode=true;
      //this.accountCode=this.bank.associatedAccount[0].accountingAccountCode;
      //this.accountName=this.bank.associatedAccount[0].a
    } else {
      this.viewMode=false;
      this.formTitle = 'Nuevo banco';
      this.isEdit = false;
      this.bankActive = 1;
     
    }

  }

  selectImage(base64Image) {
    this.bank.binaryImage = base64Image;
  }

  getCountries = () => {
    return  this.countryService.getCountriesList({ idCountry: -1, active: 1 } as CountryFilter).subscribe((data: Country[]) => {
      this.countries.value = data;
      if (this.bank.country) {
          this.selectedCountry = data.find(x => x.name === this.bank.country);
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los paises' });
    });

  }

  getBankTypes = () => {
    return  this.bankService.getBankTypes().subscribe((data: BankType[]) => {
      this.bankTypes.value = data;

      if (this.bank.bankType) {
        this.selectedBankType = data.find(x => x.name === this.bank.bankType);
      }

    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los tipos de bancos' });
    });
  }

  onSave() {

    this.submitted = true;

    if (this.bankIsValid()) {

      this.loading = true;
      this.loadingService.startLoading('wait_saving');
      this.setBankProperties();
      this.bankService.saveBank(this.bank)
      .then((result: number) => {
        this.saveSucceeded();
      }, (error: HttpErrorResponse) => this.handlerError(error));
    }

  }

  showModalDialog() {
  
   this.cuentaExiste()
     
  }
  onBlurEvent(event: any) {
    
    if (event.target.value=="" || event.target.value==" ") {
      this.nomString = true;
    }
    else {
      this.nomString = false;
    }   
  }
  cuentaExiste() {
    if (this.loading)
    return false;
  this.loading = true;
  this.messageService.clear();
  this._accountingAccountService.getAccountingAccountList(this.accountingaccountFilter).subscribe((data: AccountingAccount[]) => {      
    this.loading = false;

if(data.length){
  this.displayModal = true;   
  this.filtrarCuenta = false;
  // if (this.bank?.associatedAccount[0]?.idAssociate >= 0) {
  //   this.viewMode = true
  // }
  return;
}

this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "No existen cuentas registradas" });
return;

   
      
  }, (error: HttpErrorResponse)=>{
    this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las cuentas contables." });
      
  });

  }


  bankIsValid() {
    return (this.bank.name && this.bank.name.length > 0) && (this.bankActive >= 1 && this.bankActive <= 2) &&
    this.selectedCountry && this.selectedBankType &&
    (this.bank.swiftCode && this.bank.swiftCode.length > 0) && this.bank.binaryImage.length > 0;
  }

  saveSucceeded() {
    this.loadingService.stopLoading();
    this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Guardado exitoso'});
    this.onEmitHideForm(true);
    this.clearGlobalProperties();
  }
  foo(){

  }
  handlerError(error) {
    this.loadingService.stopLoading();
    this.messageService.add({key: 'bank', severity: 'error', summary: 'Error',
    detail: error.error.message});
    this.clearGlobalProperties();
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  clearGlobalProperties() {
    this.submitted = false;
    this.loading = false;
  }

  setBankProperties() {
    this.bank.bankTypeId = this.selectedBankType.id;
    this.bank.countryId = this.selectedCountry.id;
    this.bank.active = this.bankActive === 2 ? false : true;
  }

  swiftCodeIsValid() {
    return this.bank && this.bank.swiftCode ? (this.bank.swiftCode.length < 8) : false;
  }

  public onEmitHideForm(reload: boolean): void {
    this.onHideDialogForm.emit(reload);
}

}
