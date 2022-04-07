import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { AccountingAccount } from 'src/app/models/financial/AccountingAccount';
import { ColumnD } from 'src/app/models/common/columnsd';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { Router } from '@angular/router';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { AccountingAccountService } from '../shared/services/accounting-account.service';
import { MessageService, SelectItem } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountingAccountFilter } from 'src/app/models/financial/AccountingAccountFilter';
import { InitialSetupService } from '../../initial-setup/shared/initial-setup.service';
import { AccountingAccountItem } from 'src/app/models/financial/AccountingAccountItem';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { Separator } from 'src/app/models/financial/separator';

@Component({
  selector: 'app-accounting-account-list',
  templateUrl: './accounting-account-list.component.html',
  styleUrls: ['./accounting-account-list.component.scss']
})
export class AccountingAccountListComponent extends AccountingPlanBase implements OnInit  {
  
  @ViewChild('partida') partida: ElementRef;
  @ViewChild('name') name: ElementRef;
  permissionsIDs = {...Permissions};
  showDialog = false;
  showFilters : boolean = false;
  loading = false;
  accountingaccount = new  AccountingAccount();
  accountingaccounts=[] as AccountingAccount[];
  accountingaccountFilter = new AccountingAccountFilter();
  currentSeparator: Separator
  typeofaccountinglist: SelectItem[];
  typeofaccounting :{
    id :number
    typeOfAccountingContent :string
 }
  displayedColumns: ColumnD<AccountingAccount>[] =
  [

  {template: (data) => { return data.accountingAccountId; }, field: 'accountingAccountId', header: 'Código', display: 'none'},
  {template: (data) => { return data.accountingAccountName; }, field: 'accountingAccountName', header: 'Nombre de la cuenta', display: 'table-cell'},
  {template: (data) => { return this.formatCode(data.accountingAccountCode) }, field: 'accountingAccountStr', header: 'Número de cuenta', display: 'table-cell'},
  {template: (data) => { return data.typeOfAccounting; }, field: 'typeOfAccounting', header: ' Tipo de contabilización', display: 'table-cell'},
  {template: (data) => { return data.accountingAccountCategory}, field: 'accountingAccountCategory', header: 'Categoría', display: 'table-cell'},
  {template: (data) => { return null}, field: 'auxStr', header: 'Auxiliares', display: 'table-cell'},
  {field: 'active', header: 'Estatus', display: 'table-cell' },
  {template: (data) => { return data.createdByUser; }, field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
  {template: (data) => { return data.updateByUser; }, field: 'updateByUser', header: 'Actualizado por', display: 'table-cell'},

  ];

  constructor(public _accountingAccountService: AccountingAccountService, 
   public breadcrumbService: BreadcrumbService,
  private messageService: MessageService,
 public userPermissions: UserPermissions,private router :Router,
  private initialSetupService: InitialSetupService, injector:Injector) { 
    super(injector)
   this.breadcrumbService.setItems([
  { label: 'Financiero' },
  { label: 'Configuración' },
  { label: 'Cuentas contables', routerLink: ['/financial/configuration/accounting-account-list'] }
   ]);
  }

  ngOnInit(): void {
    this.fetchInitialSetup(() => {
      this.initialSetupService.validateConfiguration(1, this.router, () => {
        this.search();
      })
      this.initialSetupService.getCurrentSeparator(1).then(s => this.currentSeparator = s)
    });
  }

  isolatedAux(aux: AccountingAccountItem[]){
    return aux.slice(1, aux.length).map(a => a.auxiliar).join(', ')
  }
 
  edit(_accountingaccount: AccountingAccount): void {
    debugger
    this.accountingaccount.accountingAccountId = _accountingaccount.accountingAccountId;
    this.accountingaccount.planCuentaContableDetalleId = _accountingaccount.planCuentaContableDetalleId;
    this.accountingaccount.descripcion = _accountingaccount.descripcion;
    this.accountingaccount.accountingAccountName = _accountingaccount.accountingAccountName;
    this.accountingaccount.accountingAccountCode = _accountingaccount.accountingAccountCode;
    this.accountingaccount.accountingAccountCategoryId = _accountingaccount.accountingAccountCategoryId;
    this.accountingaccount.accountingAccountCategory = _accountingaccount.accountingAccountCategory;
    this.accountingaccount.typeOfAccountingId = _accountingaccount.typeOfAccountingId;
    this.accountingaccount.typeOfAccounting = _accountingaccount.typeOfAccounting;
    this.accountingaccount.createdByUser = _accountingaccount.createdByUser;
    this.accountingaccount.updateByUser = _accountingaccount.updateByUser;
    this.accountingaccount.auxiliary =_accountingaccount.auxiliary;
    this.accountingaccount.module =_accountingaccount.module;
    this.accountingaccount.tipoSaldoTipicoId =_accountingaccount.tipoSaldoTipicoId;
    this.accountingaccount.active = _accountingaccount.active;
    this.accountingaccount.indPermiteAuxiliar =_accountingaccount.indPermiteAuxiliar;
    this.showDialog = true;
  
  }


  // search(reset = false) {
  //   if (reset) {
  //     this.currentPage = 1
  //   }
  //   return this._articleService.getArticleList({ ...this.articleFilter, numeroPagina: this.currentPage, registrosPagina: this.elementsPerPage }).toPromise().then((data: ArticlePage) => {
  //     this.totalPaginatorElements = data.registers
  //     console.log(data)
  //     this.articles = data.articles.sort((a, b) => 0 - (a.articleId < b.articleId ? -1 : 1)).map<ArticleTable>(aa => ({
  //       ...aa,
  //       taxation: aa.taxes.map(a => a.abreviatura).join(' '),
  //       dateStr: this.toDate(aa.createdDate),
  //       taxPlanStr: aa.planImpuestoArt || '',
  //       costoStr: aa.cost.map(c => `${c.costo} ${c.costoLetras}`).join(' '),
  //       taxStr: aa.taxes.length ? aa.taxes.map(c => c.abreviatura).join(' ') : ''
  //     }));
  //     this.loading = false;
  //   }, (error: HttpErrorResponse) => {
  //     this.loading = false;
  //     this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los artículos." });
  //   });
  // }


  search(){
    if (this.loading)
      return;
    this.loading = true;
    this._accountingAccountService.getAccountingAccountList(this.accountingaccountFilter).subscribe((data: AccountingAccount[]) => {      
      this.accountingaccounts = data.sort((a,b) => 0 - (a.accountingAccountId < b.accountingAccountId ? -1 : 1)).map(aa => ({
        ...aa,
        auxStr: !aa.indPermiteAuxiliar ? 'N/A' : (!aa.auxiliary.length ? 'Ninguno' : aa.auxiliary.map(a => a.auxiliar).join(' ')),
        accountingAccountStr: this.formatCode(aa.accountingAccountCode, '')
      }));
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las cuentas contables." });
        
    });
  
  
  }

}
