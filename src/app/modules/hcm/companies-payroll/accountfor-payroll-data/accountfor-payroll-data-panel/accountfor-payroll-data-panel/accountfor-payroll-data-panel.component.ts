import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Bank } from 'src/app/models/masters/bank';
import { BankFilters } from 'src/app/models/masters/bank-filters';
import { BankAccountTypeFilter } from 'src/app/modules/hcm/shared/filters/bank-account-type-filter';
import { AccountforPayrollDataFilter } from 'src/app/modules/hcm/shared/filters/laborRelationship/accountforpayrolldata-filter';
import { AccountforPayrollData } from 'src/app/modules/hcm/shared/models/laborRelationship/accountforpayrolldata';
import { BankAccountType } from 'src/app/modules/hcm/shared/models/masters/bank-account-type';
import { AccountforPayrollDataService } from 'src/app/modules/hcm/shared/services/accountfor-payroll-data.service';
import { BankAccountTypeService } from 'src/app/modules/hcm/shared/services/bank-account-type.service';
import { BankService } from 'src/app/modules/masters/bank/shared/services/bank.service';

@Component({
  selector: 'app-accountfor-payroll-data-panel',
  templateUrl: './accountfor-payroll-data-panel.component.html',
  styleUrls: ['./accountfor-payroll-data-panel.component.scss']
})

export class AccountforPayrollDataPanelComponent implements OnInit {

  bankArray: Bank[] = [];
  banksList: any[];
  bankAccountTypeList: any[];
  newAccountforPayrollData: AccountforPayrollData;
  submitted: boolean = false;
  messageAccountNumber: string = "";
  @Output() auxLabel: EventEmitter<string> = new EventEmitter<string>();

  @Input() record: AccountforPayrollData;
  @Input() showSidebar: boolean;
  @Input() idCountry: number;
  @Output() backUnChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() recordSave: EventEmitter<AccountforPayrollData> = new EventEmitter<AccountforPayrollData>();
  @ViewChild("formIndActive") formIndActive: ElementRef;

  constructor(
    private messageService: MessageService,
    private _bankAccountTypeService: BankAccountTypeService,
    private _bankService: BankService,
  ) { }

  ngOnInit(): void {
    this.loadAccountsTypeList();
    this.loadBanksList();
  }

  loadAccountsTypeList(){
    var filter = new BankAccountTypeFilter();
    this._bankAccountTypeService.GetBankAccountTypes(filter).subscribe( (data: BankAccountType[]) => {
        if (data != null) {
          this.bankAccountTypeList = data.map<SelectItem>((item)=>( {
              value: item.id,
              label: item.name
            }
        ));
      }
      this.bankAccountTypeList.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipos de cuenta', detail: 'Error al cargar los tipos de cuenta'});
    });
  }

  loadBanksList(){
    var filter = new BankFilters();
    filter.countryId = this.idCountry;
    this._bankService.getBanks(filter).subscribe( (data: Bank[]) => {
        if (data != null) {
          this.bankArray = data;
          this.banksList = data.map<SelectItem>((item)=>( {
              value: item.id,
              label: item.name
            }
        ));
      }
      this.banksList.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de bancos', detail: 'Error al cargar los bancos'});
    });
  }

  outForm(){  //se pasa el control al componente padre, indicando que no hubio cambios (crear o editar)
    this.backUnChanged.emit(false); 
  }

  submit(){
    debugger;
    var error = false;
    
    if(this.record.accountNumber == ""){
      error = true;
      this.messageAccountNumber = "El número de cuenta es requerido";
    }else{
      if(this.record.accountNumber.length == 20){
        if(this.record.bankId != -1){
          var code = this.bankArray.find(x => x.id == this.record.bankId).accountCode;
          var cant = code.length;
          if(code == this.record.accountNumber.substr(0,cant)){
            error = false;
            this.messageAccountNumber = "";
          }else{
            error = true;
            this.messageAccountNumber = "El código de cuenta no corresponde al banco seleccionado";
          }
        }else{
          this.messageAccountNumber = "";
        }
      }else{
        error = true;
        this.messageAccountNumber = "El número de cuenta debe contener 20 dígitos";
      }
    }
    
    if(this.record.bankId == -1 || this.record.typeAccountId == -1){
      error = true;
    }
    if(error){
      this.submitted = true;
    }else{
      this.recordSave.emit(this.record);
    }
  }

  // submitEdit(){
  //   var error = false;
  //   if(this.record.accountNumber == "" || this.record.bankId == -1 || this.record.typeAccountId == -1){
  //     error = true;
  //     this.submitted = true;
  //   }else{
  //     this.recordSave.emit(this.record);
  //   }
  // }

  

// saveAccountforPayrollData(e){
//     debugger;
// }


changeBank(e){
  debugger;
  this.record.bank = e.originalEvent.currentTarget.ariaLabel;
  this.record.accountNumber = this.bankArray.find(x => x.id == e.value).accountCode;
  this.messageAccountNumber = "";
}

asignarNombreTipoCuenta(e){
  // debugger;
  this.record.typeAccount = e.originalEvent.currentTarget.ariaLabel;
}

validateBankNumber(){
  
  if(this.record.accountNumber.length == 0){
    this.messageAccountNumber = "El número de cuenta es requerido";
  }else{
    if(this.record.accountNumber.length == 20){
      if(this.record.bankId != -1){
        var code = this.bankArray.find(x => x.id == this.record.bankId).accountCode;
        var cant = code.length;
        if(code == this.record.accountNumber.substr(0,cant)){
          this.messageAccountNumber = ""
        }else{
          this.messageAccountNumber = "El código de cuenta no corresponde al banco seleccionado"
        }
      }else{
        this.messageAccountNumber = "";
      }
    }else{
      this.messageAccountNumber = "El número de cuenta debe contener 20 dígitos"
    }
  }
}


///////////////////////////////////////////////

}
