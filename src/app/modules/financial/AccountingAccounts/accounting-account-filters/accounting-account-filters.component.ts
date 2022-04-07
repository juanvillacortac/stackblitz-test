import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AccountingAccountFilter, ACCOUNTING_ACCOUNT_ALL_ACTIVES_FILTER } from 'src/app/models/financial/AccountingAccountFilter';
import { Auxiliary } from 'src/app/models/financial/auxiliary';
import { AUXILIAR_ALL_ACTIVES_FILTER } from 'src/app/models/financial/AuxiliaryFilter';
import { LedgerAccountCategory } from 'src/app/models/financial/LedgerAccountCategory';
import { LEDGERACCOUNTCATEGORY_ALL_ACTIVES_FILTER } from 'src/app/models/financial/LedgerAccountCategoryFilter';
import { Separator } from 'src/app/models/financial/separator';
import { TypeOfAccounting } from 'src/app/models/financial/TypeOfAccounting';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { AccountingAccountService } from '../shared/services/accounting-account.service';

@Component({
  selector: 'app-accounting-account-filters',
  templateUrl: './accounting-account-filters.component.html',
  styleUrls: ['./accounting-account-filters.component.scss']
})
export class AccountingAccountFiltersComponent extends AccountingPlanBase implements OnInit {
  

  validacionRegex: RegExp
  accountingAccountId :number
  accountingAccountName :string 
  accountingAccountCategoryId :number 
  typeOfAccountingId :number 
  accountingAccountCode :string 
  planCuentaContableDetalleId:number
  indPermiteAuxiliar: boolean
  filtrarCuenta:boolean = true;
  active :number 
  displayModal: boolean;

  @Input() separator: Separator
  @Input() expanded = false;
  @Input() loading = false;
  @Input() filters: AccountingAccountFilter;
  @Output() onSearch = new EventEmitter<AccountingAccountFilter>();
  _validations: Validations = new Validations();
  status: SelectItem[] = [
    {label: 'Todos', value: 0},
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 2}
   
  ];

  ledgeraccountcategorylist: SelectItem[]; 
  typeofaccountinglist: SelectItem[];
  auxiliarylist: SelectItem[];
  selectedLedgerAccountCategory: LedgerAccountCategory;
  selectedTypeOfAccounting:TypeOfAccounting;
  selectedAuxiliary: any[] = [];
  


  constructor(private _accountingAccountService: AccountingAccountService, private messageService: MessageService,injector:Injector) {
    super(injector)
   }

  ngOnInit(): void {
   this.fetchInitialSetup(() => {
    this.validacionRegex = new RegExp(`[0-9${this.currentSeparator.separatorContent}]`)
   });
   debugger
   this.clearFilters();
   this.onLoadTypeOfAccountingList();
   this.onLoadLedgerAccountCategoryList();
   this.onLoadAuxiliaryList();
  }


  showModalDialog(){
    this.displayModal = true;
    this.filtrarCuenta = true;
   }

  onLoadTypeOfAccountingList() {
 
    this._accountingAccountService.getTypeOfAccountingList()
      .subscribe((data) => {
        this.typeofaccountinglist = [...data.map((item) => ({
          label: item.typeOfAccountingContent,
          value: item,
        }))]
      }, (error) => {
        console.log(error);
      });
  }
  onLoadLedgerAccountCategoryList() {
    
      this._accountingAccountService.getLedgerAccountCategoryList(LEDGERACCOUNTCATEGORY_ALL_ACTIVES_FILTER).subscribe((data: LedgerAccountCategory[]) => {      
        data = data.sort((a,b) => 0 - (a.accountingAccountCategory > b.accountingAccountCategory ? -1 : 1));
        this.ledgeraccountcategorylist = [...data.map((item) => ({
          label: item.accountingAccountCategory,
          value: item,
        }))]}, (error)=>{
        this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las categorias." });
          
      });
  }


  onLoadAuxiliaryList() {
  
      this._accountingAccountService.getAuxiliaryList(AUXILIAR_ALL_ACTIVES_FILTER).subscribe((data: Auxiliary[]) => {      
        data = data.sort((a,b) => 0 - (a.auxilliaryName > b.auxilliaryName ? -1 : 1));
        this.auxiliarylist = [...data.map((item) => ({
          label: item.auxilliaryName,
          value: item,
        }))]}, (error)=>{
        this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los auxiliares." });
          
      });
  }

   ValidateChecksAuxiliaries(){
    
     this.filters.auxiliary = "";
     if(this.selectedAuxiliary.length > 0){
       for (let i = 0; i < this.selectedAuxiliary.length; i++) {
         this.filters.auxiliary = this.filters.auxiliary == "" ? this.selectedAuxiliary[i].id.toString(): this.filters.auxiliary + "," + this.selectedAuxiliary[i].id.toString();;
     }
   }
   }

  search() {
debugger
    this.filters.accountingAccountId = this.accountingAccountId ? this.accountingAccountId : -1
    this.filters.accountingAccountName = this.accountingAccountName ? this.accountingAccountName.toString() :''
    this.filters.accountingAccountCategoryId = this.selectedLedgerAccountCategory ? this.selectedLedgerAccountCategory.accountingAccountCategoryId : -1
    this.filters.typeOfAccountingId = this.selectedTypeOfAccounting ? this.selectedTypeOfAccounting.id : -1
    let codigo = this.accountingAccountCode ? this.accountingAccountCode.split(this.currentSeparator.separatorContent).join(""):'';
    this.filters.accountingAccountCode = this.accountingAccountCode ? codigo :''
    this.filters.active = this.active ? this.active === 2 ? 0 : 1 : -1;
    this.onSearch.emit(this.filters);
    
  }

  clearFilters() {

    this.accountingAccountId = null;
    this.accountingAccountName = null;
    this.selectedLedgerAccountCategory = null;
    this.selectedTypeOfAccounting = null; 
    this.selectedAuxiliary = null;
    this.filters.auxiliary="";
    this.accountingAccountCode = null;
    this.active = null;

  }

}
