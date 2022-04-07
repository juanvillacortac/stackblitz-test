import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Company } from 'src/app/models/masters/company';
import { CompaniesFilter } from 'src/app/modules/hcm/shared/filters/companies-filter';
import { CompanyService } from 'src/app/modules/hcm/shared/services/company.service';
import { CompanyViewModel } from 'src/app/modules/hcm/shared/view-models/company-viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { CompaniesCatalogEditDialogComponent } from 'src/app/modules/hcm/companies-catalog/companies-catalog-edit-dialog/companies-catalog-edit-dialog.component';
import { NavigationExtras, Router } from '@angular/router';



@Component({
  selector: 'app-companies-catalog-list',
  templateUrl: './companies-catalog-list.component.html',
  styleUrls: ['./companies-catalog-list.component.scss'],
  // providers: [DatePipe]

})
export class CompaniesCatalogListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;

  @ViewChild(CompaniesCatalogEditDialogComponent) CompaniesCatalogEditDialogComponent: CompaniesCatalogEditDialogComponent; 

  companiesFilters: CompaniesFilter = new CompaniesFilter();

  displayedColumns: ColumnD<CompanyViewModel>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', field:'id', display: 'none' },
      { template: (data) => { return data.name + `\n` + data.socialName + `\n` + `${data.identifier}-${data.identification}`;
                           }, header: 'Empresa', field:'name' },
      // { template: (data) => { return data.socialName; }, header: 'Razón social',field:'socialName' , display: 'table-cell' },
      // { template: (data) => { return `${data.identifier}-${data.identification}`; }, header: 'Número de documento',field:'identification' ,display: 'table-cell' },
      // { template: (data) => { return data.identifier; }, header: 'Tipo de identificacion',field:'identifier' ,display: 'none' },
      { template: (data) => { return data.type; }, header: 'Tipo',field:'type' ,display: 'table-cell' },
      { template: (data) => { return data.country; }, header: 'País',field:'country' ,display: 'table-cell' },
      { template: (data) => { return data.classification; }, header: 'Clasificación', field:'classification' ,display: 'table-cell' },
      { field: 'active', header: 'Estatus',display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', field:'createdByUser' ,display: 'table-cell' },
      { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', field:'updatedByUser' ,display: 'table-cell' }
    ];

  // constructor() { }
  constructor(public _companyService: CompanyService, public breadcrumbService: BreadcrumbService, public messageService: MessageService, public userPermissions: UserPermissions, private router: Router) {
    // this.breadcrumbService.setItems([
    //   { label: 'Configuración' },
    //   { label: 'Maestros generales' },
    //   { label: 'Empresas', routerLink: ['/company-list'] }
    // ]);
    

  }
  permissionsIDs = {...Permissions};

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    this._companyService.getCompaniesList(this.companiesFilters).subscribe((data: Company[]) => {      
      this._companyService._companiesList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las empresas." });
    });
  }

  async onEdit(id) {
    const queryParams: any = {};
    // this.listproductcatalogFilters = [];
    // this.listproductcatalogFilters.push(this.productcatalogFilters);
    // this.listproductcatalogFilters.push(this.productcatalogFiltersSearch);
    
    // queryParams.productcatalogfilters = JSON.stringify(this.listproductcatalogFilters);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    // this.router.navigate(['companiescataloggeneralsection', id,0,0], navigationExtras);
    this.router.navigate(['companies-generalsection', id]);
  }

}
