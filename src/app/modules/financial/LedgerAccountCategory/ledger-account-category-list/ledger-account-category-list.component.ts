import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message,MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { LedgerAccountCategory } from 'src/app/models/financial/LedgerAccountCategory';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { LedgerAccountCategoryService } from '../shared/services/ledger-account-category.service';
import { LedgerAccountCategoryFilter, LEDGERACCOUNTCATEGORY_ALL_ACTIVES_FILTER } from 'src/app/models/financial/LedgerAccountCategoryFilter';
import { InitialSetupService } from '../../initial-setup/shared/initial-setup.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';


@Component({
  selector: 'app-ledger-account-category-list',
  templateUrl: './ledger-account-category-list.component.html',
  styleUrls: ['./ledger-account-category-list.component.scss'],
  providers: [MessageService]
})
export class LedgerAccountCategoryListComponent implements OnInit {
  permissionsIDs = {...Permissions};
  msgs: Message[];
  showFilters: boolean = false;
  loading: boolean = false;
  submitted: boolean;
  OcultarC: boolean;
  showDialog = false;
  isCallback = false;
  ledgerAccountCategory = new LedgerAccountCategory();
  ledgerAccountCategories = [] as LedgerAccountCategory[];
  ledgerAccountCategoryFilter =new  LedgerAccountCategoryFilter();
  showPanel = false

  displayedColumns: ColumnD<LedgerAccountCategory>[] =
    [
      /*    {template: (data) => { return data.id; }, header: 'Id',field: 'id', display: 'table-cell'},
         {template: (data) => { return data.createdByUserId; },field: 'createdByUserId', header: 'Creado por', display: 'table-cell'},
         {template: (data) => { return data.updatedByUserId; },field: 'updatedByUserId', header: 'Actualizado por', display: 'table-cell'}, */
      { template: (data) => { return data.accountingAccountCategoryId; }, header: 'Código', field: 'accountingAccountCategoryId', display: 'table-cell' },
      { template: (data) => { return data.accountingAccountCategory; }, field: 'accountingAccountCategory', header: 'Categoría de cuentas contables', display: 'table-cell' },
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, field: 'createdByUser', header: 'Creado por', display: 'table-cell' },
      { template: (data) => { return data.updateByUser; }, field: 'updateByUser', header: 'Actualizado por', display: 'table-cell' },
      /*{template: (data) => { return data.createdDate; },field: 'createdDate', header: 'Fecha de Creación', display: 'table-cell'},
         {template: (data) => { return data.updatedDate; },field: 'updatedDate', header: 'Fecha de Actualización', display: 'table-cell'} */
    ];

  constructor(public _ledgerAccountCategoryService: LedgerAccountCategoryService,
    public breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private router: Router,
    private initialSetup: InitialSetupService) {
    this.initialSetup.validateConfiguration(1, this.router, () => {
      this.breadcrumbService.setItems([
        { label: 'Financiero' },
        { label: 'Maestros' },
        { label: 'Categorías de cuentas contables', routerLink: ['/financial/masters/ledgerAccountCategory-list'] }
      ]);
    })
  }

  ngOnInit(): void {
    this.search();
  }
  search() {

     if (this.loading)
      return;
    
    this.loading = true;
    // this.messageService.clear();
    this.ledgerAccountCategoryFilter.accountingAccountCategoryId = this.ledgerAccountCategoryFilter.IdAccountCategory == "" ? -1 : parseInt(this.ledgerAccountCategoryFilter.IdAccountCategory);
    this._ledgerAccountCategoryService.getLedgerAccountCategoriesList(this.ledgerAccountCategoryFilter).subscribe((data: LedgerAccountCategory[]) => {
      this.ledgerAccountCategories = data.sort((a, b) => 0 - (a.accountingAccountCategoryId < b.accountingAccountCategoryId ? -1 : 1));
     
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las categorías." });
    });
  }
  openNew() {
    this.ledgerAccountCategory = { accountingAccountCategoryId: -1 } as LedgerAccountCategory;

    this.showDialog = true;
  }

  //edit(ledgerAccountCategory: LedgerAccountCategory): void {

  //  this.ledgerAccountCategory = ledgerAccountCategory
  //  this.showDialog = true;


  //}
  edit(id: number, name: string, active: boolean) {
    this.ledgerAccountCategory = new LedgerAccountCategory();
    this.ledgerAccountCategory.accountingAccountCategoryId = id;
    this.ledgerAccountCategory.accountingAccountCategory = name;
    this.ledgerAccountCategory.active = active == false ? false : true;
    this.showDialog = true;

  }

}
