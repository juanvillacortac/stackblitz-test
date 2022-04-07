import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CompanyViewModel } from '../../shared/view-models/company-viewmodel';
import { CompaniesFilter } from '../../shared/filters/companies-filter';
import { CompanyService } from '../../shared/services/company.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Company } from '../../shared/models/masters/company';
import { CompanyBankAccount } from '../../shared/models/masters/company-bank-account';
import { CompanyTypeFilter } from '../../shared/filters/company-type-filter';
import { CompanyClassificationFilter } from '../../shared/filters/company-classification-filter';
import { CompanyGovernmentalAgency } from '../../shared/models/masters/company-governmental-agency';
import { CompanyGovernmentalAgencyFilter } from '../../shared/filters/company-governmental-agency-filter';
import { CompanyGovernmentalAgencyFilterComponent } from '../../company-govAgency-tab/company-govAgency-filter/company-govAgency-filter/company-govAgency-filter.component';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';

@Component({
  selector: 'companies-generalsection',
  templateUrl: './companies-generalsection.component.html',
  styleUrls: ['./companies-generalsection.component.scss']
})
export class CompaniesGeneralSectionComponent implements OnInit {

  idcompany: number = 0;
  _company: Company;
  _companyGovernmentalAgencyFilters: CompanyGovernmentalAgencyFilter = new CompanyGovernmentalAgencyFilter();
  companiesFiltersOfValues: CompaniesFilter[] = [];

  activeIndex: number;
  
  @Output() companyemit = new EventEmitter<Company>();
  companyType: String="";
  @Output() companytypeemit = new EventEmitter<String>();
  companyClass: String="";
  @Output() companyclassemit = new EventEmitter<String>();
  mobile: boolean = false;
  idCountry: number = 0;
  @Output() idCountryemit = new EventEmitter<number>();

  constructor(private activatedRoute: ActivatedRoute,
    private _companyService: CompanyService,
    private messageService: MessageService,
    private breadcrumbService: BreadcrumbService,
    public confirmationService: ConfirmationService,
    private _selectorService: CurrentOfficeSelectorService, //Codigo para seleccionar Compañia/Sucursal
    private router: Router ) {
      this._selectorService.setSelectorType(EnumOfficeSelectorType.company) //Selecciona la compañia en dropdown
      this.idcompany = this.activatedRoute.snapshot.params['id'];
      this.onLoadCompany();
      // this.ngOnInit();
      this.breadcrumbService.setItems([
        { label: 'HCM' },
        { label: 'Recursos humanos' },
      //   { label: 'Empresas', routerLink: ['/hcm/companies-generalsection/'+this.idcompany]},
        { label: 'Empresas', routerLink: ['/hcm/companiescatalog-list'] }
      ]);
    }

  ngOnInit(): void {
    if (window.screen.width >= 800) { // 768px portrait
      this.mobile = true;
    }
    this.activeIndex = 0;
    var filters = this.activatedRoute.snapshot.queryParamMap.get('companiesFilters');
    if (this.companiesFiltersOfValues.length > 0) {
      this.companiesFiltersOfValues = this.companiesFiltersOfValues;
    } else {
      if (filters!=undefined) {
        // const companiesFilters = history.state.queryParams.companiesFilters;  //this.activatedRoute.snapshot.queryParamMap.get('companiesFilters');
        const companiesFilters = filters;
        if (companiesFilters === null) {
          this.companiesFiltersOfValues = [];
        } else {
          this.companiesFiltersOfValues = JSON.parse(companiesFilters);

          sessionStorage.setItem('searchParameters', companiesFilters)
        }
      }else{
        this.companiesFiltersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }
    }
    // this.router.navigateByUrl(this.router.url.substring(0, 28));
    // this.router.navigateByUrl(this.router.url.substring(0, this.router.url.indexOf('?')));
    var url = this.router.url.substring(0, this.router.url.indexOf('?')) == "" ? this.router.url : this.router.url.substring(0, this.router.url.indexOf('?'));
    this.router.navigateByUrl(url);
    
  }
  
  async onLoadCompany(){
    this._company = new Company();
    var filter = new CompaniesFilter();
    filter.idCompany = this.idcompany;
    this._companyService.getCompany(this.idcompany).subscribe((data: Company) => {
      if (data != null) {
        console.log(data);
        this._company = data;
        this.getCompanyType(this._company.idType);
        this.getCompanyClass(this._company.idClassification);
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando la empresa"});
    });
  }

  getCompanyType(pId){
    this.companyType = new String();
    var filter = new CompanyTypeFilter();
    filter.id = pId;
    this._companyService.getCompanyTypesList(filter).subscribe((data) => {
      if (data != null) {
        this.companyType = data[0].name;
        this.companytypeemit.emit(this.companyType);
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando la empresa"});
    });
  }
  
  getCompanyClass(pId){
    this.companyClass = new String();
    var filter = new CompanyClassificationFilter();
    filter.id = pId;
    this._companyService.getCompanyClassificationList(filter).subscribe((data) => {
      if (data != null) {
        this.companyClass = data[0].name;
        this.companyclassemit.emit(this.companyClass);
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando la empresa"});
    });
  }

  regresar() {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea regresar? perderá los datos que no hayan sido guardados.',
        accept: () => {
          const queryParams: any = {};
          queryParams.companiesFilters = JSON.stringify(this.companiesFiltersOfValues);
          const navigationExtras: NavigationExtras = {
            queryParams
          };
          this.router.navigate(['hcm/companiescatalog-list'], navigationExtras);
        }
      });
  } 

}
