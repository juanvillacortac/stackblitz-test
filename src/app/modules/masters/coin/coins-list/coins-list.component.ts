import { Component, OnInit } from '@angular/core';
import { Coins } from 'src/app/models/masters/coin';
import { ColumnD } from 'src/app/models/common/columnsd';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CoinFilter } from '../shared/filters/CoinFilter';
import { CoinsService } from '../shared/service/coins.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';


@Component({
  selector: 'app-coins-list',
  templateUrl: './coins-list.component.html',
  styleUrls: ['./coins-list.component.scss']
})
export class CoinsListComponent implements OnInit {
  loading: boolean = false
  showFilters: boolean = false
  showDialog: boolean = false
  CoinhowDialog: boolean = false;
  _coinViewModel: Coins=new Coins();
  permissions: number[] = [];
  permissionsIDs = {...Permissions};
  _status:boolean=true;

  coinsFilter: CoinFilter = new CoinFilter();

  displayedColumns: ColumnD<Coins>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', display: 'none',field:'id' },
      { template: (data) => { return data.name; }, header: 'Moneda', display: 'table-cell',field: 'name' },
      { template: (data) => { return data.coinType; }, header: 'Tipo', display: 'table-cell',field: 'coinType' },
      { template: (data) => { return data.symbology; }, header: 'Símbolo', display: 'table-cell',field: 'symbology' },
      { template: (data) => { return data.abbreviation; }, header: 'Abreviatura', display: 'table-cell',field: 'abbreviation' },
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', display: 'table-cell',field: 'createdByUser' },
      { template: (data) => { return data.updateByUser; }, header: 'Actualizado por', display: 'table-cell',field: 'updateByUser' }
    ];
  constructor(public _coinService: CoinsService,private breadcrumbService: BreadcrumbService,private messageService: MessageService,public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Monedas', routerLink: ['masters/coins-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }
  search() {
    this.loading = true;
    this._coinService.getCoinsList(this.coinsFilter).subscribe((data: Coins[]) => {
      this._coinService._coinsList = data;
      this.loading = false;
    }, (_: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
  Edit(coin:Coins) {
    this._coinViewModel=new Coins();
    this._coinViewModel.id=coin.id;
    this._coinViewModel.name=coin.name;
    this._coinViewModel.abbreviation=coin.abbreviation;
    this._coinViewModel.idType=coin.idType;
    this._coinViewModel.symbology=coin.symbology;
    this._coinViewModel.active=coin.active;
    this._status=coin.active;
    this.CoinhowDialog = true;
  }
}
