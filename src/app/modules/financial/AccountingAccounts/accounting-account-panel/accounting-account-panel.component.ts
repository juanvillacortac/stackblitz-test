import { HttpErrorResponse } from '@angular/common/http';
import { Component, Directive, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AccountingAccount } from 'src/app/models/financial/AccountingAccount';
import { AccountingAccountFilter } from 'src/app/models/financial/AccountingAccountFilter';
import { AccountingAccountItem } from 'src/app/models/financial/AccountingAccountItem';
import { Auxiliary } from 'src/app/models/financial/auxiliary';
import { AUXILIAR_ALL_ACTIVES_FILTER } from 'src/app/models/financial/AuxiliaryFilter';
import { LedgerAccountCategory } from 'src/app/models/financial/LedgerAccountCategory';
import { LEDGERACCOUNTCATEGORY_ALL_ACTIVES_FILTER } from 'src/app/models/financial/LedgerAccountCategoryFilter';
import { Module } from 'src/app/models/financial/Modules';
import { TypeOfAccounting } from 'src/app/models/financial/TypeOfAccounting';
import { TypicalBalance } from 'src/app/models/financial/TypicalBalance';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { AccountingAccountService } from '../shared/services/accounting-account.service';

@Component({
  selector: 'app-accounting-account-panel',
  templateUrl: './accounting-account-panel.component.html',
  styleUrls: ['./accounting-account-panel.component.scss']
})

export class AccountingAccountPanelComponent  extends AccountingPlanBase implements OnInit {
 
  @ViewChild('name') name: ElementRef;
  @Input("showDialog") showDialog: boolean; 
  @Input("_data") _data: AccountingAccount = new AccountingAccount();
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() onUpdate = new EventEmitter();
  _validations: Validations = new Validations();
  statuslist: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];
  nomString = false;
  saving :boolean;
  submitted: boolean;
  NdeCuenta:string="";
  ledgeraccountcategorylist: SelectItem[]; 
  typeofaccountinglist: SelectItem[];
  auxiliarylist: SelectItem[];
  auxiliarylist2: SelectItem[];
  modulelist: SelectItem[];
  modulelist2: SelectItem[];
  typicalbalancelist : SelectItem[];
  selectedLedgerAccountCategory: LedgerAccountCategory;
  selectedTypeOfAccounting:TypeOfAccounting;
  selectedTypicalBalance:TypicalBalance;
  selectedAuxiliary: any[] = [];
  selectedModule: any[] = [];
  displayModal: boolean;
  filtrarCuenta: boolean;
  codigoCuenta: string
  idnoActivo:number = 0;
  viewMode = false
  loading: boolean;
  accountingaccountFilter = new AccountingAccountFilter();
  accountingaccounts=[] as AccountingAccount[];
  CuentaExiste: any;
  constructor(private service: AccountingAccountService, private messageService: MessageService,injector:Injector) {
    super(injector)
    debugger
    this.NdeCuenta=this._data.accountingAccountCode;
  }
  
  onBlurEvent(event: any) {
    
     if (event.target.value=="" || event.target.value==" ") {
       this.nomString = true;
     }
     else {
       this.nomString = false;
     }   
   }
   ngOnInit(): void {
     this.fetchInitialSetup();
     if (this.showDialog) {
      this.name.nativeElement.focus();
     }
     
     debugger
    
     this.saving = false
     this.submitted = false;
     this.onLoadLedgerAccountCategoryList(() => {
      let noact = this.ledgeraccountcategorylist.filter(i=> i.value==this._data.accountingAccountCategoryId)
      if (noact?.length == 0 && this._data.accountingAccountId >0 ) {
        this.idnoActivo =this._data.accountingAccountCategoryId;
       this.ledgeraccountcategorylist = [
         ...this.ledgeraccountcategorylist,
         {
           label:this._data.accountingAccountCategory,
           value:this._data.accountingAccountCategoryId  
         }
       ]
      }
     });
     
     
     this.onLoadTypeOfAccountingList();
     this.onLoadAuxiliaryList();
     this.onLoadmoduleList() ;
     this.onLoadTypicalBalanceList();
 
     if (this._data.accountingAccountId >= 0) {
      this.viewMode = true
     }

if (this._data.auxiliary!=undefined) {
  for (let i = 0; i < this._data.auxiliary.length; i++) {
    this.selectedAuxiliary.push(this._data.auxiliary[i].idAuxiliar);           
}  
}

if (this._data.module!=undefined) {
  for (let i = 0; i < this._data.module.length; i++) {
    this.selectedModule.push(this._data.module[i].id);           
}  
}
   
     if (this._data.accountingAccountId <= 0)
       this._data.active = true
       

   }

   showModalDialog(){

     
      this.displayModal = true;
      this.filtrarCuenta = false;
     if (this._data.accountingAccountId >= 0) {
      this.viewMode = true
     }
    
   }

  
 
   hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this.nomString = false;
    this.ClearData();
    this.viewMode = false
  }
  onLoadTypicalBalanceList() {

    this.service.getTypicalBalanceList()
      .subscribe((data) => {
        data.sort((a,b) => 0 - (a.typicalBalanceContent > b.typicalBalanceContent ? -1 : 1));
        this.typicalbalancelist = [...data.map((item) => ({
          label: item.typicalBalanceContent,
          value: item.id,
        }))]
      }, (error) => {
        console.log(error);
      });
  }

  onLoadTypeOfAccountingList() {

    this.service.getTypeOfAccountingList()
      .subscribe((data) => {
        data.sort((a,b) => 0 - (a.typeOfAccountingContent > b.typeOfAccountingContent ? -1 : 1));
        this.typeofaccountinglist = [...data.map((item) => ({
          label: item.typeOfAccountingContent,
          value: item.id,
        }))]
      }, (error) => {
        console.log(error);
      });
  }
  onLoadLedgerAccountCategoryList(onLoad?: () => void) {
      this.service.getLedgerAccountCategoryList(LEDGERACCOUNTCATEGORY_ALL_ACTIVES_FILTER).subscribe((data: LedgerAccountCategory[]) => {      
        data.sort((a,b) => 0 - (a.accountingAccountCategory > b.accountingAccountCategory ? -1 : 1));
       
        this.ledgeraccountcategorylist = [...data.map((item) => ({
          label: item.accountingAccountCategory,
          value: item.accountingAccountCategoryId,
        }))]
        if (onLoad) {
          onLoad()
        }
      }, ()=>{
      
          this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las categorias." });
          
      });
  }
  onLoadAuxiliaryList() {
      this.service.getAuxiliaryList(AUXILIAR_ALL_ACTIVES_FILTER).subscribe((data: Auxiliary[]) => {   
        data.sort((a,b) => 0 - (a.auxilliaryName > b.auxilliaryName ? -1 : 1));
        this.auxiliarylist2 = [...data.map((item) => ({
          label: item.auxilliaryName,
          value: item.id,
        }))]
        this.auxiliarylist = [...data.map((item) => ({
          label: item.auxilliaryName,
          value: {
            cuentaContableAuxiliarId:this._data.accountingAccountId == -1 ? -1 : item.id,
            cuentaContableId: 0,
            idAuxiliar:item.id,
            auxiliar: item.auxilliaryName,
            indAsociado: true

          },
        }))]}, ()=>{
     
          this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los auxiliares." });
          
      });
  }
  

  onLoadmoduleList() {
 
    this.service.getModuleList().subscribe((data) => {
      data.sort((a,b) => 0 - (a.moduleContent > b.moduleContent ? -1 : 1));
      this.modulelist2 = [...data.map((item) => ({
        label: item.moduleContent,
        value: item.id,
      }))]
      this.modulelist = [...data.map((item) => ({
        label: item.moduleContent,
        value: {
          cuentaContableModuloId : this._data.accountingAccountId == -1 ? -1 : item.id,
          id: item.id,
          moduleContent: item.moduleContent,
          active: true
        },
      }))]
    }, (error) => {
      console.log(error);
    });
}


  ClearData(){
    
    this._data.accountingAccountId = -1;
    this._data.planCuentaContableDetalleId = -1;
    this._data.accountingAccountName = "";
    this._data.accountingAccountCategoryId =-1;
    this._data.typeOfAccountingId = -1;
    this._data.tipoSaldoTipicoId  =-1;
    this._data.accountingAccountCode ="";
    this._data.descripcion ="";
    this._data.auxiliary =[];
    this._data.module = [];
    this.selectedAuxiliary = [];
    this.selectedModule =[];
    this.idnoActivo = 0;


    this._data.active = true;
  }

   Auxiliares_Seleccionados(){
    this._data.auxiliary =[];
    this.selectedAuxiliary.forEach(id => {
     for (let index = 0; index < this.auxiliarylist.length; index++) {
      
       if (this.auxiliarylist[index].value.idAuxiliar==id) {
         this._data.auxiliary.push(this.auxiliarylist[index].value)
       }
       
     }   
     
    });
   }

   Modulos_Seleccionados(){
    this._data.module =[];
    this.selectedModule.forEach(id => {
     for (let index = 0; index < this.modulelist.length; index++) {
      
       if (this.modulelist[index].value.id==id) {
         this._data.module.push(this.modulelist[index].value)
       }
       
     }   
     
    });
   }

   CuentasContables(OnloadCuentas?: ()=>void){
    if (this.loading)
      return;
    debugger
    this.loading = true;
    
      
   
    this.service.getAccountingAccountList(this.accountingaccountFilter).subscribe((data: AccountingAccount[]) => {      
      this.accountingaccounts = data;
 
      this.loading = false;
      if (OnloadCuentas) {
        OnloadCuentas();
      }
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las cuentas contables." });
        
    });
 
  
  }

  save(){
    debugger
   
    if (this.idnoActivo== this._data.accountingAccountCategoryId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La categoría se encuentra inactiva,para poder guardar cambios debe seleccionar una categoria activa" });
      return;
    }

    this.CuentasContables(()=>{
     if (!this.viewMode) {
      
      this.CuentaExiste = this.accountingaccounts.filter(h => h.accountingAccountCode == this._data.accountingAccountCode)
      if (this.CuentaExiste.length > 0) {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cuenta seleccionada se encuentra registrada." });
        return;
      }

    }
      this.submitted = true;
      this.Modulos_Seleccionados();
      if (this._data.accountingAccountName != "" 
      && this._data.accountingAccountName.trim()
      && this._data.accountingAccountCategoryId>-1
      && this._data.tipoSaldoTipicoId>-1
      && this._data.tipoSaldoTipicoId>-1
      && this._data.accountingAccountCode!=""
      && this._data.module.length>0) {
  
      this.Auxiliares_Seleccionados();
        
       this.messageService.clear();
       this.saving = true 
        this.service.postAccountingAccount(this._data).subscribe((data) => {
          if (data > 0) {
           this.showDialog = false;
           this.showDialogChange.emit(this.showDialog);
            this.submitted = false;
            this.saving = false;
            this.onUpdate.emit();
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          } else if (data == -1) {
          
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
            this.saving = false;
          }
          else if (data == -3) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
          }
          else {
            this.saving = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
          }
          //window.location.reload();
        }, () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
        });
      }
    })
  }
}
