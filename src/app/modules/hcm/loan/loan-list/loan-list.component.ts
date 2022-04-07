import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { LoanListFilter } from '../../shared/filters/loans/loan-list-filter';
import { LoanTypeFilter } from '../../shared/filters/loans/loan-type-filter';
import { LoanList } from '../../shared/models/loans/loan-list';
import { LoanType } from '../../shared/models/loans/loan-type';
import { LoanService } from '../../shared/services/loans/loan.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ColumnD } from 'src/app/models/common/columnsd';
import { LoanListViewModel } from '../../shared/view-models/loans/loan-list-viewmodel';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {

  loanList: LoanListViewModel[] = [];
  loanPanelObject: LoanList = new LoanList();
  loanFilter: LoanListFilter = new LoanListFilter();
  filterSearch: LoanListFilter = new LoanListFilter();
  arrayFilters: LoanListFilter[] = [];

  showFilters: boolean = true;
  permissionsIDs = { ...Permissions };

displayedColumns: ColumnD<LoanListViewModel>[] =
    [
      { template: (data) => { return data.idLoan; }, header: 'idLoan', field: 'idLoan', display: 'none' },
      { template: (data) => { return data.employmentCode}, header: 'Código', field: 'employmentCode', display: 'table-cell' },
      //{ template: (data) => { return data.pictureSource; }, header: 'Foto', field: 'pictureSource', display: 'table-cell' },
      { template: (data) => { return data.employeeFullName}, header: 'Nombre', field: 'employeeFullName', display: 'table-cell' },
      { template: (data) => { return data.currency }, header: 'Divisa', field: 'currency', display: 'table-cell' },
      { template: (data) => { return data.createDate}, header: 'Fecha de emisión', field: 'createDate', display: 'table-cell' },
      { template: (data) => { return data.loanType }, header: 'Tipo', field: 'loanType', display: 'table-cell' },
      { template: (data) => { return data.amount }, header: 'Monto total', field: 'amount', display: 'table-cell' },
      { template: (data) => { return data.paid }, header: 'Monto abonado', field: 'paid', display: 'table-cell' },
      { template: (data) => { return data.status; }, header: 'Estatus', field: 'status', display: 'table-cell' },
    ];
_Authservice : AuthService = new AuthService(this._httpClient);

  constructor(  private _loanService: LoanService,
                public messageService: MessageService,
                public userPermissions: UserPermissions,
                private activatedRoute: ActivatedRoute,
                public breadcrumbService: BreadcrumbService,
                private _httpClient: HttpClient,
                private router: Router) { 
                  this.breadcrumbService.setItems([
                    { label: 'HCM' },
                    { label: 'Nómina' },
                    { label: 'Prestamos', routerLink: ['/hcm/loan/loan-list'] }
                  ]);
                }

  ngOnInit(): void {

    //this.loadLoanTypes();
    const filterStorage = this.activatedRoute.snapshot.queryParamMap.get('loanFilter');
    if (filterStorage === null || filterStorage === "null") {
      this.arrayFilters = [];
    } else {
      this.arrayFilters = JSON.parse(filterStorage);
      this.loanFilter = this.arrayFilters[0];
      this.filterSearch = this.arrayFilters[1];
      var url = this.router.url.substring(0, this.router.url.indexOf('?')) == "" ? this.router.url : this.router.url.substring(0, this.router.url.indexOf('?'));
      this.router.navigateByUrl(url);
    }
    this.search();
    
  }

  search(){
    this.filterSearch.idCompany = parseInt(this._Authservice.currentCompany);
    this.filterSearch.idCurrency = this.loanFilter.idCurrency == 0 ? -1 : this.loanFilter.idCurrency;
    this.filterSearch.idStatus = this.loanFilter.idStatus == 0 ? -1 : this.loanFilter.idStatus;
    this.filterSearch.idLoanType = this.loanFilter.idLoanType == 0 ? -1 : this.loanFilter.idLoanType;
    this.filterSearch.discountStartDate = this.loanFilter.discountStartDate == null ? "1900-01-01" : this.loanFilter.discountStartDate;
    this.filterSearch.employeeName = this.loanFilter.employeeName == null ? "" : this.loanFilter.employeeName;
    this.filterSearch.employmentCode = this.loanFilter.employmentCode == null ? "" : this.loanFilter.employmentCode;
    this._loanService.getLoanList(this.filterSearch).subscribe((data: LoanList[]) => {
      this.loanList = [];
      data.forEach(element => {
        var object = new LoanListViewModel();
        object.idLoan = element.idLoan;
        object.employmentCode = element.employmentCode;
        object.employeeFullName = element.employeeFirstName+"  "+element.employeeLastName;
        object.currency = element.currency;
        object.createDate = element.createDate;
        object.loanType = element.loanType;
        object.amount = element.loanAmount;
        object.paid = element.paid;
        object.status = element.status;
        this.loanList.push(object);
      });
      
    }, (error: HttpErrorResponse)=>{
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los prestamos." });
    });
  }

  async onEdit(idLoanList) {
    this.arrayFilters = [];
    const queryParams: any = {};
    //this.loanFilter.idLoan = idLoanList;
    this.arrayFilters.push(this.loanFilter);
    this.arrayFilters.push(this.filterSearch);
    queryParams.loanFilter = JSON.stringify(this.arrayFilters);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    sessionStorage.setItem('idLoanList', idLoanList);
    this.router.navigate( ['hcm/loan-detail-generalsection', idLoanList],navigationExtras);
  }

  openNew() {
    debugger;
    const queryParams: any = {};
    this.arrayFilters.push(this.loanFilter);
    this.arrayFilters.push(this.filterSearch);
    queryParams.loanFilter = JSON.stringify(this.arrayFilters);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    sessionStorage.setItem('idLoanList', "-1");
    this.router.navigate(['hcm/loan-detail-generalsection', -1], navigationExtras);
  }
}
