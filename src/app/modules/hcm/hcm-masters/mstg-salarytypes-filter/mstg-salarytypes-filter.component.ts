import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { SalaryTypeFilter } from '../../shared/filters/salary-type-filter';
import { SalaryTypeService } from '../../shared/services/salary-type.service';

@Component({
  selector: 'app-mstg-salarytypes-filter',
  templateUrl: './mstg-salarytypes-filter.component.html',
  styleUrls: ['./mstg-salarytypes-filter.component.scss']
})
export class MstgSalarytypesFilterComponent implements OnInit {

  @Input() expanded = false;
  @Input() loading = false;
  @Input() filters ;
  @Output() onSearch = new EventEmitter<SalaryTypeFilter>();
  permissionsIDs = { ...Permissions };

  _Authservice : AuthService = new AuthService(this._httpClient);
  coinDropdown: SelectItem[];
  coinOption: number = 0;
  coinFilter: CoinxCompanyFilter = new CoinxCompanyFilter();

  indSalarial: SelectItem[] = [
    {label: 'Todos', value: 0},
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 2}
   
  ];

  indObligatorio: SelectItem[] = [
    {label: 'Todos', value: 0},
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 2}
   
  ];

  indActivo: SelectItem[] = [
    {label: 'Todos', value: 0},
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 2}
   
  ];

  //id:number
  //name:string
  //active:number

  constructor(
    private _httpClient: HttpClient,
    private salarytypeService: SalaryTypeService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    public _Currency: CoinsService,
  ) { }

  ngOnInit(): void {
    this.loadCurrency();
    this.filters = SalaryTypeFilter;
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

  search() {

  /*   this.filters.name = this.name ? this.name.toString() : ''
    this.filters.salaryCharacter = this.salaryCharacter ? this.salaryCharacter === 2 ? 0 : 1 : -1;
    this.filters.required = this.required ? this.required === 2 ? 0 : 1 : -1;      
    this.filters.active = this.active ? this.active === 2 ? 0 : 1 : -1;
    this.filters.currency = this.coinOption ? {label:'Todos', value: -1} : this.coinOption;
    this.onSearch.emit(this.filters); */
    
  }

  clearFilters() {

/*     this.id = null;
    this.articleClassificationName = null;
    this.active = null; */

  }

}
