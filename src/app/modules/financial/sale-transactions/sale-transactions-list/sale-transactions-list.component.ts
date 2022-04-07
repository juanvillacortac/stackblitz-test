import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Lots } from 'src/app/models/financial/lots';
import { LotsFilter } from 'src/app/models/financial/lotsFilter';
import { SalesTransactionResult, SaleTransaction, SaleTransactionFilter } from 'src/app/models/financial/sale-transactions';
import { TransactionStatus } from 'src/app/models/financial/TransactionStatus';
import { Coins } from 'src/app/models/masters/coin';
import { CostCenter } from 'src/app/models/masters/cost-center';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { CoinFilter } from 'src/app/modules/masters/coin/shared/filters/CoinFilter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { CostCenterFilters } from 'src/app/modules/masters/cost-center/shared/filters/cost-center-filters';
import { CostCenterService } from 'src/app/modules/masters/cost-center/shared/services/cost-center.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { AccountingAccountService } from '../../AccountingAccounts/shared/services/accounting-account.service';
import { LotsService } from '../../lots/shared/services/lots.service';
import { SaleTransactionsTreeComponent } from '../sale-transactions-tree/sale-transactions-tree.component';
import { SaleTransactionService } from '../shared/sale-transaction.service';

type StringProps<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T];

function sort<T, K extends StringProps<T>>(array: T[], prop: K): T[] {
  return array.sort((a, b) => (a[prop] as unknown as string).localeCompare((b[prop] as unknown as string)));
}

@Component({
  selector: 'app-sale-transactions-list',
  templateUrl: './sale-transactions-list.component.html',
  styleUrls: ['./sale-transactions-list.component.scss']
})

export class SaleTransactionsListComponent implements OnInit {

  currentPage = 1;
  elementsPerPage = 10;
  totalPaginatorElements: number = null;

  transactions: SalesTransactionResult[] = [];
  filter = new SaleTransactionFilter();
  loaded = false;
  loading = false;
  showFilters = false;
  showDialog = false;
  isDirect = false;

  isFiltered = false;

  @ViewChild(SaleTransactionsTreeComponent, { static: true }) treeComp: SaleTransactionsTreeComponent;
  // router: any;

  constructor(
    private saleTransactionService: SaleTransactionService,
    private costCenter: CostCenterService,
    private coinsService: CoinsService,
    private loadingService: LoadingService,
    private accountingAccountService: AccountingAccountService,
    private branchofficeService: BranchofficeService,
    public breadcrumbService: BreadcrumbService,
    private router: Router,
    private lotsService: LotsService,
    private supplierService: SupplierService,
    private route: ActivatedRoute
  ) {

  }

  filterData = {
    costCenter: [] as SelectItem<number>[],
    originModule: [] as SelectItem<number>[],
    currencies: [] as SelectItem<number>[],
    status: [] as SelectItem<number>[],
    branchoffice: [] as SelectItem<number>[],
    clients: [] as SupplierExtend[],
    lots: [] as Lots[],
    date: sort([
      {
        label: 'Fecha de documento',
        value: 1,
      },
      {
        label: 'Fecha de transacción',
        value: 2,
      },
    ], 'label') as SelectItem<number>[],
  };

  currencies: Coins[];

  async fetchData(filter = this.filter, reset = false) {
    if (reset) {
      this.currentPage = 1;
    }

    this.loading = true;

    try {
      // tslint:disable-next-line: max-line-length
      const transactionsPage = await this.saleTransactionService.getTransactions({ ...filter, pageNumber: this.currentPage, pagelogs: this.elementsPerPage }, this.isDirect).toPromise();
      this.transactions = transactionsPage.items;
      this.totalPaginatorElements = transactionsPage.registers;
      this.currencies = await this.coinsService.getCoinsList({ ...new CoinFilter(), active: 1 }).toPromise();
      this.filterData.currencies = sort(this.currencies, 'name')
        .map(t => ({
          value: t.id,
          label: t.name,
        }));
      const status = await this.saleTransactionService.getTransactionStatus().toPromise();
      this.filterData.status = sort(status.map(c => ({
        value: c.transactionStatusTypeId,
        label: c.transactionStatus,
      })), 'label');
      const costCenters = await this.costCenter.getCentersCostsList({ ...new CostCenterFilters(), active: 1 }).toPromise();
      this.filterData.costCenter = sort(costCenters.map(c => ({
        value: c.id,
        label: c.name,
      })), 'label');
      const originModule = await this.accountingAccountService.getModuleList().toPromise();
      this.filterData.originModule = sort(originModule.map(o => ({
        value: o.id,
        label: o.moduleContent,
      })), 'label');
      const branchoffice = await this.branchofficeService.getBranchOfficeList().toPromise(); 
      console.log(branchoffice);
      this.filterData.branchoffice = sort(branchoffice.filter(o => o.active && o.idCompany === 1).map(o => ({
        value: o.id,
        label: o.branchOfficeName,
      })), 'label');
      
      this.filterData.lots = (await this.lotsService.getLotsList({ ...new LotsFilter(), allowsEntry: 1 }).toPromise())
        .find(l => l.moduleContent.toLowerCase() === 'compras')?.lots
        .filter(l => l.indStatusLot === 2)
        .sort((a, b) => a.lotName.localeCompare(b.lotName)) || [];
      this.filterData.clients = (await this.supplierService.getSupplierExtendList().toPromise())
        .sort((a, b) => a.socialReason.localeCompare(b.socialReason));
    } catch (err) {
      console.error(err);
    }

    this.loading = false;
  }

  edit(transact: SaleTransaction) {
    debugger
    this.router.navigate(['/financial/sales/sale-transactions/', transact.saleTransactionId], {queryParams:{indDirect:this.isDirect}});
  }

  newTransact() {
 
      this.router.navigate(['/financial/sales/sale-transactions/new'], {queryParams:{indDirect:this.isDirect}});
    
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    //determinando que tipo de transaccion es por la url
    /*
    this.route.queryParams
      .subscribe((param) => {
        this.isDirect = param.indDirect || false
    })*/

    this.route.url  
      .subscribe((url) => {
        this.isDirect = url[url.length - 1].path  == 'direct'  ? true : false;
        
    })

    this.fetchData()
      // Totalmente cargado sin errores
      .then(() => {
        this.loaded = true;
      })
      // Quitar el indicador de carga aunque existan errores
      .finally(() => {
        this.loadingService.stopLoading();
      });

    if (this.isDirect) {

      this.breadcrumbService.setItems([
        { label: 'FMS' },
        { label: 'Cuentas por cobrar' },
        {
          label: 'Entrada de Documentos',  routerLink: '/financial/sales/sale-transactions', queryParams: { indDirect: true }
        }
      ]);

    } else {
      this.breadcrumbService.setItems([
        { label: 'FMS' },
        { label: 'Cuentas por cobrar' },
        { label: 'Ventas', routerLink: ['/financial/sales/sale-transactions'] }
      ]);
    }



  }
}
