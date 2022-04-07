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
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';

@Component({
  selector: 'app-companies-catalog-list',
  templateUrl: './companies-catalog-list.component.html',
  styleUrls: ['./companies-catalog-list.component.scss'],
})

export class CompaniesCatalogListComponent implements OnInit {

  // showFilters : boolean = false;
  showFilters : boolean = true;
  loading : boolean = false;

  @ViewChild(CompaniesCatalogEditDialogComponent) CompaniesCatalogEditDialogComponent: CompaniesCatalogEditDialogComponent; 
  listCompaniesFilters: CompaniesFilter[] = [];
  companiesFiltersSearch: CompaniesFilter = new CompaniesFilter();
  companiesFilters: CompaniesFilter = new CompaniesFilter();
  permissionsIDs = {...Permissions};

  displayedColumns: ColumnD<CompanyViewModel>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', field:'id', display: 'none' },
      { template: (data) => { return data.fullDocument }, header: 'Documento', field: 'fullDocument', display: 'table-cell' },
      { template: (data) => { return data.socialName; }, header: 'Razón social', field: 'socialName', display: 'table-cell' },
      { template: (data) => { return data.name; }, header: 'Razón comercial', field:'name', display: 'table-cell' },
      { template: (data) => { return data.type; }, header: 'Tipo',field:'type' ,display: 'table-cell' },
      { template: (data) => { return data.country; }, header: 'País',field:'country' ,display: 'table-cell' },
      { template: (data) => { return data.classification; }, header: 'Clasificación', field:'classification' ,display: 'table-cell' },
      { field: 'active', header: 'Estatus',display: 'table-cell' },
    ];

  constructor(public _companyService: CompanyService,
     public breadcrumbService: BreadcrumbService,
     public messageService: MessageService, 
     public userPermissions: UserPermissions,
     private activatedRoute: ActivatedRoute, 
     private _selectorService: CurrentOfficeSelectorService, //Codigo para seleccionar Compañia/Sucursal
     private router: Router) {
      this._selectorService.setSelectorType(EnumOfficeSelectorType.company) //Selecciona la compañia en dropdown
     this.breadcrumbService.setItems([
       { label: 'HCM' },
       { label: 'Recursos Humanos' },
       { label: 'Empresas', routerLink: ['/hcm/companiescatalog-list'] }
     ]);
    
  }

  ngOnInit(): void {
    const companiesFilters = this.activatedRoute.snapshot.queryParamMap.get('companiesFilters');
    
    if (companiesFilters === null || companiesFilters === "null") {
      this.listCompaniesFilters = [];
    } else {
      this.listCompaniesFilters = JSON.parse(companiesFilters);
      this.companiesFilters = this.listCompaniesFilters[0];
      this.companiesFiltersSearch = this.listCompaniesFilters[1];
      // this.router.navigateByUrl(this.router.url.substring(0, 22));
      this.router.navigateByUrl(this.router.url.substring(0, this.router.url.indexOf('?')));
    }
    
    this.search();
  }

  searchCompanies() {
    this.companiesFiltersSearch = {
      idCompany : this.companiesFilters.idCompany,
      name : this.companiesFilters.name,
      socialName : this.companiesFilters.socialName,
      idType : this.companiesFilters.idType,
      idClassification : this.companiesFilters.idClassification,
      identifier : this.companiesFilters.identifier,
      identification : this.companiesFilters.identification,
      NIT : this.companiesFilters.NIT,
      active : this.companiesFilters.active
    }

    this.companiesFilters;
    this.search();
  }

  search() {
    this.loading = true;
    this._companyService.getCompaniesList(this.companiesFiltersSearch).subscribe((data: Company[]) => {      
      this._companyService._companiesList = data;
      this._companyService._companiesList.forEach((element) =>{
        element.fullDocument = element.identifier+"-"+element.identification;
      });
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las empresas." });
    });
  }

  async onEdit(id) {
    const queryParams: any = {};
    this.listCompaniesFilters = [];
    this.listCompaniesFilters.push(this.companiesFilters);
    this.listCompaniesFilters.push(this.companiesFiltersSearch);
    

    queryParams.companiesFilters = JSON.stringify(this.listCompaniesFilters);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate( ['/hcm/companies-generalsection', id], navigationExtras );
  }

}
