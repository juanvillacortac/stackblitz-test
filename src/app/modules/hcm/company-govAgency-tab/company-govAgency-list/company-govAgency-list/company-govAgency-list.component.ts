import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Company } from 'src/app/models/masters/company';
import { CompanyGovernmentalAgencyFilter } from 'src/app/modules/hcm/shared/filters/company-governmental-agency-filter';
import { CompanyGovernmentalAgencyService } from 'src/app/modules/hcm/shared/services/company-governmental-agency.service';
import { CompanyViewModel } from 'src/app/modules/hcm/shared/view-models/company-viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { CompanyGovernmentalAgency } from '../../../shared/models/masters/company-governmental-agency';
import { UserService } from 'src/app/modules/security/users/shared/user.service';
import { BranchOfficeService } from '../../../shared/services/branch-office.service';
import { GovernmentalAgencyService } from '../../../shared/services/governmental-agency.service';
import { GovernmentalRecordTypeService } from '../../../shared/services/governmental-record-type.service';
import { GovernmentalRecordService } from '../../../shared/services/governmental-record.service';
import { CompanyGovernmentalAgencyFilterComponent } from '../../company-govAgency-filter/company-govAgency-filter/company-govAgency-filter.component';
import { CompanyGovernmentalAgencyBranchOfficeListComponent } from '../../company-govAgency-branchOffice-list/company-govAgency-branch-office-list/company-govAgency-branch-offices.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-govAgency-list',
  templateUrl: './company-govAgency-list.component.html',
  styleUrls: ['./company-govAgency-list.component.scss']
})
export class CompanyGovernmentalAgencyListComponent implements OnInit {

  // showFilters : boolean = false;
  showFilters : boolean = true;
  loading : boolean = false;
  governmentalAgencies: SelectItem[] = [];
  governmentalAgenciesShortNames: SelectItem[] = [];
  governmentalRecords: SelectItem[] = [];
  governmentalRecordTypes: SelectItem[] = [];
  identifierTypeOptions: SelectItem[] = [];
  statuslist: SelectItem[] = [
    { label: 'Todos', value: '-1' },
    { label: 'Vigente', value: '28' },
    { label: 'Vencido', value: '29' }
  ];
  branchOffices = [];
  
  inMemoryCompanyGovernmentalAgencies: CompanyGovernmentalAgency[] = [];
  @Output("_inMemoryCompanyGovernmentalAgencies") _inMemoryCompanyGovernmentalAgencies = new EventEmitter<CompanyGovernmentalAgency[]>();
  

  @Input() idCompany: number;
  @Input() idCountry: number;
  @Input("_company") _company : Company = new Company();

  @Input() expanded : boolean = false;
  // @Input("filters") filters : CompanyGovernmentalAgencyFilter;

  @Output("_companyGovernmentalAgencies") _companyGovernmentalAgencies = new EventEmitter<CompanyGovernmentalAgency[]>();

  @Output("onSearch") onSearch = new EventEmitter<CompanyGovernmentalAgencyFilter>();

  @ViewChild(CompanyGovernmentalAgencyFilterComponent) _companyGovernmentalAgencyFilter : CompanyGovernmentalAgencyFilterComponent;
  @ViewChild(CompanyGovernmentalAgencyBranchOfficeListComponent) _companyGovernmentalAgencyBranchOffice : CompanyGovernmentalAgencyBranchOfficeListComponent;

  companyGovernmentalAgencyFilters: CompanyGovernmentalAgencyFilter = new CompanyGovernmentalAgencyFilter();

  displayedColumns: ColumnD<CompanyGovernmentalAgency>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', field:'id', display: 'none' },
      { template: (data) => { return data.governmentalAgencyName; }, header: 'Institución/Ente', field:'governmentalAgencyName' },
      { template: (data) => { return `${data.documentTypeIdentifier}-${data.documentNumber}`; }, header: 'Registro fiscal', field:'documentNumber' },
      { template: (data) => { return data.governmentalAgencyShortName; }, header: 'Nombre corto',field:'governmentalAgencyShortName' ,display: 'table-cell' },
      { template: (data) => { return data.governmentalRecordTypeName; }, header: 'Tipo', field:'governmentalRecordTypeName', display: 'table-cell' },
      { template: (data) => { return data.branchOfficeName; }, header: 'Sucursal', field:'branchOfficeName' ,display: 'table-cell' },
      { template: (data) => { return data.estatusName; }, header: 'Estatus', field:'estatusName' ,display: 'table-cell' },
      { template: (data) => { return `${data.firstNameLR} ${data.lastNameLR}`; }, header: 'Representante legal', field:'firstNameLR' ,display: 'table-cell' },
    ];

  constructor(
    private actRoute: ActivatedRoute,
    public _companyGovernmentalAgencyService: CompanyGovernmentalAgencyService,
    public breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    public userPermissions: UserPermissions
  ) { }

  permissionsIDs = {...Permissions};

  ngOnInit(): void {
    this.search();
  }

  // ngAfterViewInit(): void {
  //   this._companyGovernmentalAgencyFilter.loadGovernmentalAgencies(this._company.idCountry);
  //   this._companyGovernmentalAgencyFilter.loadGovernmentalAgenciesShortNames(this._company.idCountry);
  //   this._companyGovernmentalAgencyFilter.loadNotNaturalIdentifierTypes();
  //   // debugger;
  //   this._companyGovernmentalAgencyFilter.idCountry = this._company.idCountry;
  // }

  search(){
    this.loading = true;
    this.companyGovernmentalAgencyFilters.company = parseInt(this.actRoute.snapshot.params['id']);
    this._companyGovernmentalAgencyService.getCompanyGovernmentalAgency(this.companyGovernmentalAgencyFilters).subscribe((data: CompanyGovernmentalAgency[]) => {      
      console.log(data);
      this._companyGovernmentalAgencyService._companyGovernmentalAgencyList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los Entes Gubernamentales por empresa." });
    });
  }

  addRelationship(companyGovernmentalAgency: CompanyGovernmentalAgency){
      this.inMemoryCompanyGovernmentalAgencies.push(companyGovernmentalAgency);
      this._inMemoryCompanyGovernmentalAgencies.emit(this.inMemoryCompanyGovernmentalAgencies);
  }

  editOrNew(company, i){
    // debugger;
    this._companyGovernmentalAgencyBranchOffice.editOrNew(company, i);
  }

}
