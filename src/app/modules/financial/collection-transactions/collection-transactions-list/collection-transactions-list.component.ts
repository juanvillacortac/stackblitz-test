import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { CollectionTransactionsTreeComponent } from '../collection-transactions-tree/collection-transactions-tree.component';
import { CollectionTransaction, CollectionTransactionFilter } from 'src/app/models/financial/collectiontransactions';
import { CollectionTransactionsService } from '../shared/collection-transactions.service';
import { BankService } from 'src/app/modules/masters/bank/shared/services/bank.service';
import { BankFilters } from 'src/app/models/masters/bank-filters';
import { SaleTransactionService } from '../../sale-transactions/shared/sale-transaction.service';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { SupplierclasificationService } from 'src/app/modules/masters/supplierclasification/shared/services/supplierclasification.service';

type StringProps<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T];

function sort<T, K extends StringProps<T>>(array: T[], prop: K): T[] {
  return array.sort((a, b) => (a[prop] as unknown as string).localeCompare((b[prop] as unknown as string)));
}

@Component({
  selector: 'app-collection-transactions-list',
  templateUrl: './collection-transactions-list.component.html',
  styleUrls: ['./collection-transactions-list.component.scss']
})
export class CollectionTransactionsListComponent implements OnInit {

  currentPage = 1;
  elementsPerPage = 10;
  totalPaginatorElements: number = null;

  transactions: CollectionTransaction[] = [];
  filter = new CollectionTransactionFilter();
  loaded = false;
  loading = false;
  showFilters = false;
  showDialog = false;

  isFiltered = false;

  @ViewChild(CollectionTransactionsTreeComponent, { static: true }) treeComp: CollectionTransactionsTreeComponent;
  // router: any;

  constructor(
    private collectionTransactionService: CollectionTransactionsService,
    private saleTransactionService: SaleTransactionService,
    private supplierClassificationService: SupplierclasificationService,
    private bankService: BankService,
    private loadingService: LoadingService,
    public breadcrumbService: BreadcrumbService,
    private router: Router,
    private supplierService: SupplierService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'FMS' },
      { label: 'Cuentas por cobrar' },
      { label: 'Pagos', routerLink: ['/financial/collection/collection-transactions'] }
    ]);
  }

  filterData = {
    banks: [] as SelectItem<number>[],
    status: [] as SelectItem<number>[],
    clients: [] as SupplierExtend[],
    clientsClasiffications: [] as SupplierClasification[],
    type: [] as SelectItem<number>[],
    date: sort([
      {
        label: 'Fecha de decumento',
        value: 1,
      },
      {
        label: 'Fecha de transacción',
        value: 2,
      },
    ], 'label') as SelectItem<number>[],
  };

  // currencies: Coins[];

  async fetchData(filter = this.filter, reset = false) {
    if (reset) {
      this.currentPage = 1;
    }

    this.loading = true;

    try {
      // tslint:disable-next-line: max-line-length
      const transactionsPage = await this.collectionTransactionService.getTransactions({ ...filter, pageNumber: this.currentPage, pagelogs: this.elementsPerPage }).toPromise();
      debugger
      this.transactions = transactionsPage.items;
      this.totalPaginatorElements = transactionsPage.registers;

      const bank = await this.bankService.getBanks({ ...new BankFilters(), active: 1 }).toPromise();
      this.filterData.banks = sort(bank.map(c => ({
        value: c.id,
        label: c.name,
      })), 'label');

      const status = await this.saleTransactionService.getTransactionStatus().toPromise();
      this.filterData.status = sort(status.map(c => ({
        value: c.transactionStatusTypeId,
        label: c.transactionStatus,
      })), 'label');

      const types = await this.collectionTransactionService.getTypes().toPromise();
      this.filterData.type = sort(types.map(c => ({
        value: c.id,
        label: c.name,
      })), 'label'); 

      const fmsClients = await this.supplierService.getFMSSetupList().toPromise();
          
      this.filterData.clients = (await this.supplierService.getSupplierExtendList().toPromise())
        .map(c => ({
          ...c,
          financialSetup: fmsClients.find(fms => fms.clientSupplierId === c.idclientsupplier)
        }))
        .filter(c => c.financialSetup?.accountingAccounts?.length)
        .filter(c => c.financialSetup?.accountingAccounts.find(aa => aa.use.toLocaleLowerCase() === 'cuentas por cobrar'))
        .sort((a, b) => a.socialReason.localeCompare(b.socialReason));

      this.filterData.clientsClasiffications = (await this.supplierClassificationService.getSupplierClasificationList().toPromise())
        .sort((a, b) => a.supplierclasification.localeCompare(b.supplierclasification));  
        
    } catch (err) {
      console.error(err);
    }    

    this.loading = false;
    console.log(this.transactions);
  }

  edit(transact: CollectionTransaction) {
    // tslint:disable-next-line: no-debugger
    debugger;
    this.router.navigate(['/financial/collection/collection-transactions/', transact.collectionTransactionId]);
  }

  newTransact() {
    this.router.navigateByUrl('/financial/collection/collection-transactions/new');
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.fetchData()
      // Totalmente cargado sin errores
      .then(() => {
        this.loaded = true;
      })
      // Quitar el indicador de carga aunque existan errores
      .finally(() => {
        this.loadingService.stopLoading();
      });
  }

}
