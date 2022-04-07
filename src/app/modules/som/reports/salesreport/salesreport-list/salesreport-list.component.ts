import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SalesReport } from 'src/app/models/som/reports/reportsales';
import { SalesReportFilter } from 'src/app/models/som/reports/reportsalesfilter';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { SalesReportDetail } from 'src/app/models/som/reports/reportsalesdetail';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Router } from '@angular/router';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { Coins } from 'src/app/models/masters/coin';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportsService } from '../../../shared/services/reports/reports.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';

@Component({
  selector: 'app-salesreport-list',
  templateUrl: './salesreport-list.component.html',
  styleUrls: ['./salesreport-list.component.scss'],
  providers: [DecimalPipe,DatePipe]
})
export class SalesreportListComponent implements OnInit {

  showFilters: boolean = true;
  loading: boolean = false;
  submitted: boolean;
  showExpressTab: boolean = false;
  filters: SalesReportFilter = new SalesReportFilter();
  permissionsIDs = { ...Permissions };
  listreport: SalesReport[] = [];
  listDB: SalesReport[] = [];
  indtabsactive: number = -1;
  totalsales:number=0;
  totalsalesconv:number=0;
  displayedColumnsProduct: ColumnD<SalesReport>[] =
    [
      { template: (data) => { return data.name; }, field: 'name', header: 'Producto', display: 'table-cell' },
      { template: (data) => { return data.category; }, field: 'category', header: 'Categoría', display: 'table-cell' },
      { template: (data) => { return data.references; }, field: 'references', header: 'Referencia', display: 'table-cell' },
      { template: (data) => { return data.brand; }, field: 'brand', header: 'Marca', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.totalQtySold, '.4'); }, field: 'totalQtySold', header: 'Total cantidad vendida', display: 'table-cell' }, 
      { template: (data) => { return this.basesymbolcoin + " " + this.decimalPipe.transform(data.totalSales, '.4'); }, field: 'totalSales', header: 'Total ventas base', display: 'table-cell' },
      { template: (data) => { return this.conversionsymbolcoin + " " + this.decimalPipe.transform(data.totalSalesConv, '.4'); }, field: 'totalSalesConv', header: 'Total ventas conversión', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.totalExistences, '.4'); }, field: 'totalExistences', header: 'Existencia total', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.totalExistencesUnds, '.4'); }, field: 'totalExistencesUnds', header: 'Existencia total unds', display: 'table-cell' },
    ];
  displayedColumns: ColumnD<SalesReportDetail>[] =
    [
      { template: (data) => { return data.gtin; }, field: 'gtin', header: 'Barra', display: 'table-cell' },
      { template: (data) => { return data.supplier; }, field: 'supplier', header: 'Proveedor', display: 'table-cell' },
      { template: (data) => { return data.presentation; }, field: 'presentation', header: 'Empaque', display: 'table-cell' },
      { template: (data) => { return data.typePacket; }, field: 'typePacket', header: 'Tipo empaque', display: 'table-cell' },
      { template: (data) => { return data.unitperpackagin; }, field: 'unitperpackagin', header: 'Unds por empaque', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.quantitySold, '.3'); }, field: 'quantitySold', header: 'Cantidad vendida', display: 'table-cell' },
      { template: (data) => { return this.basesymbolcoin + " " + this.decimalPipe.transform(data.cost, '.4'); }, field: 'cost', header: 'Total costo', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.totalPVP, '.2'); }, field: 'totalPVP', header: 'Total PVP', display: 'table-cell' },   
      { template: (data) => { return this.basesymbolcoin + " " + this.decimalPipe.transform(data.costbase, '.4'); }, field: 'costbase', header: 'Costo base', display: 'table-cell' },
      { template: (data) => { return this.conversionsymbolcoin + " " + this.decimalPipe.transform(data.costConvertion, '.4'); }, field: 'costConvertion', header: 'Costo conversión', display: 'table-cell' },
      { template: (data) => { return this.basesymbolcoin + " " + this.decimalPipe.transform(data.pvp, '.2'); }, field: 'pvp', header: 'PVP', display: 'table-cell' },
      { template: (data) => { return this.conversionsymbolcoin + " " + this.decimalPipe.transform(data.pvpConvertion, '.2'); }, field: 'pvpConvertion', header: 'PVP conversión', display: 'table-cell' },
      { template: (data) => { return this.decimalPipe.transform(data.msv, '.2'); }, field: 'msv', header: 'MSV', display: 'table-cell' },
      //{ template: (data) => { return this.decimalPipe.transform(data.existences, '.3'); }, field: 'existences', header: 'Existencia', display: 'table-cell' },
      //{ template: (data) => { return this.decimalPipe.transform(data.existencesUnds, '.3'); }, field: 'existences', header: 'Existencia en Unds', display: 'table-cell' },


    ];
  _selectedColumns: any[] = [];
  rowGroupMetadata: any;
  showDialogReason: boolean = false;
  idproduct: number = -1;
  idBranchOffice: number = -1;
  idModule: number = 0;
  basesymbolcoin: string = "";
  conversionsymbolcoin: string = "";
  constructor(private service:ReportsService,
    private messageService: MessageService,
    public breadcrumbService: BreadcrumbService,
    private router: Router,
    private decimalPipe: DecimalPipe,
    public userPermissions: UserPermissions,
    private coinsService: CoinsService,
    private _Authservice: AuthService,
    private loadingService: LoadingService) { 
      this.breadcrumbService.setItems([
        { label: 'SOM', routerLink: ['/som/dashboard-som'] },
        { label: 'Reportes' },
        { label: 'Reporte de ventas', routerLink: ['/som/salesreport'] }
      ]);
    }

  ngOnInit(): void {
    this.displayedColumnsProduct.forEach(colum => {
      this._selectedColumns.push(colum)
    });
    this.displayedColumns.forEach(colum => {
      this._selectedColumns.push(colum)
    });
    this.searchCoinsxCompany();
  }
  
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col));
  }

  SearchReport() {
    this.filters.idBranchOffice = this._Authservice.currentOffice;;
    this.loading = true;
    this.loadingService.startLoading()
    this.totalsales=0
    this.totalsalesconv=0
    this.service.getsalesReport(this.filters).subscribe((data: SalesReport[]) => {
      if (data.length > 0)
      {    
        this.totalsales=data.reduce((subtotal, item) => subtotal + item.totalSales, 0)
        this.totalsalesconv=data.reduce((subtotal, item) => subtotal + item.totalSalesConv, 0)  
        for (let i = 0; i < data.length; i++) {
          data[i].totalQtySold = data[i].detail.reduce((subtotal, item) => subtotal + item.quantitySold, 0);       
        }   
      }
      this.listreport =data ;
      this.listDB = data;
      this.loading = false;
      this.loadingService.stopLoading()
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.loadingService.stopLoading()
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los datos" });
    });
  }

  getPackings(idProduct: number) {
    return this.listDB.filter(x => x.idProduct === idProduct);
  }
  searchCoinsxCompany() {
    var filter = new CoinxCompanyFilter();
    filter.idCompany = this._Authservice.currentCompany;
    this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
      data.forEach(coin => {
        if (coin.legalCurrency == true) {
          this.basesymbolcoin = coin.symbology;
        } else {
          this.conversionsymbolcoin = coin.symbology;
        }
      });
    })
  } 
   
}
