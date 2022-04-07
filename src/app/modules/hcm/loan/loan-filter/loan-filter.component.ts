import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { LoanListFilter } from '../../shared/filters/loans/loan-list-filter';
import { LoanTypeFilter } from '../../shared/filters/loans/loan-type-filter';
import { LoanType } from '../../shared/models/loans/loan-type';
import { LoanService } from '../../shared/services/loans/loan.service';

@Component({
  selector: 'app-loan-filter',
  templateUrl: './loan-filter.component.html',
  styleUrls: ['./loan-filter.component.scss'],
  providers: [DatePipe]
})
export class LoanFilterComponent implements OnInit {

  @Input() filters: LoanListFilter;
  @Input() expanded: boolean;

  @Output() BackUnChange: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Output() onSearch: EventEmitter<LoanListFilter> = new EventEmitter<LoanListFilter>();


  loanTypeFilter: LoanTypeFilter = new LoanTypeFilter();
  loanTypeList: LoanType[] = [];
  loanTypeDropdown: SelectItem[] =[];

  coinFilter: CoinxCompanyFilter = new CoinxCompanyFilter();
  coinDropdown: SelectItem[] = [];

  fecha: Date;

  _Authservice : AuthService = new AuthService(this._httpClient);

  statusDropdown: SelectItem[] = [
    { label: 'Todos', value: -1 },
    { label: 'Pendiente', value: 95 },
    { label: 'Pagado', value: 96 },
    { label: 'Suspendido', value: 97 },
    { label: 'Exonerado', value: 98 },
];

  constructor(  private _loanService: LoanService,
                private _httpClient: HttpClient,
                public datepipe: DatePipe,
                public messageService: MessageService,
                public _Currency: CoinsService,
              ) { }

  ngOnInit(): void {
    this.loadLoanTypes();
    this.loadCurrency();
  }

  loadLoanTypes(){
    this.loanTypeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._loanService.getLoanType(this.loanTypeFilter).subscribe( (data: LoanType[]) => {
      if (data != null) {
        debugger;
        this.loanTypeDropdown = data.map((item)=>(
            {
              value: item.idLoanType,
              label: item.name
            }
        ));
    }
      this.loanTypeDropdown.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de estados civiles', detail: 'Error al cargar los estados civiles'});
    });
  }

  loadCurrency(){  
    this.coinFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._Currency.getCoinxCompanyList(this.coinFilter).subscribe((valor: Coins[]) => {
      this.coinDropdown = valor.map<SelectItem>((item) => ({
        value: item.id,
        label: item.name
      }));
      this.coinDropdown.push({value: -1, label:'Todos'});
      this.coinDropdown.sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error" });
    });
  }

  search(){
    this.filters.discountStartDate = this.fecha == null ? "1900-01-01" :this.datepipe.transform(this.fecha, "yyyy-MM-dd"); ;
    this.filters.employeeName = this.filters.employeeName == null ? "": this.filters.employeeName;
    this.filters.employmentCode = this.filters.employmentCode == null ? "": this.filters.employmentCode;
    
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.employeeName = null;
    this.filters.employmentCode = null;
    this.filters.idCurrency = 0;
    this.filters.idStatus = 0;
    this.filters.idLoanType = 0;
    this.fecha = null;
  }

}
