import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { CollectionTransactionFilter } from 'src/app/models/financial/collectiontransactions';
import { bankAccounts, bankAccountsFilter } from 'src/app/models/masters/bankAccounts';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { BankAccountsService } from 'src/app/modules/masters/bank-accounts/shared/services/bank-accounts.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { Validations } from '../../shared/Utils/Validations/Validations';

const formatDate = (str: string | Date) => {
  if (!str) {
    return undefined;
  }
  const d = new Date(str);
  const padLeft = (n: number) => ('00' + n).slice(-2);
  const dformat = [
    d.getFullYear(),
    padLeft(d.getMonth() + 1),
    padLeft(d.getDate()),
  ].join('.');
  return dformat;
};

@Component({
  selector: 'app-collection-transactions-filters',
  templateUrl: './collection-transactions-filters.component.html',
  styleUrls: ['./collection-transactions-filters.component.scss']
})
export class CollectionTransactionsFiltersComponent implements OnInit {

  noneSpecialCharacters: RegExp = /^[a-zA-Z-0-9-äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/;
  filters = new CollectionTransactionFilter();
  @Input() filterData;
  @Input() expanded = false;
  @Input() loading = false;
  @Input() modules: SelectItem<number>[];

  @Output() onSearch = new EventEmitter<CollectionTransactionFilter>();

  _validations: Validations = new Validations();

  clientClassifications: SupplierClasification[] = [];
  clients: SupplierExtend[] = [];
  client: SupplierExtend;
  bankAccounts: SelectItem<number>[];

  clientModal = false;

  constructor(
    private bankAccountsService: BankAccountsService,
    private messageService: MessageService,
    private supplierService: SupplierService,
  ){}

  log = console.log;

  ngOnInit(): void {
    console.log(this.filterData);
  }

  async fetchSupplierData(){

    const fmsClients = await this.supplierService
      .getFMSSetupList()
      .toPromise();

    this.clients = (
      await this.supplierService.getSupplierExtendList().toPromise()
    )
      .filter(s => !s.indclient)
      .map((c) => ({
        ...c,
        financialSetup: fmsClients.find(
          (fms) => fms.clientSupplierId == c.idclientsupplier
        ),
      }))
      .filter((c) => c.financialSetup?.accountingAccounts?.length)
      .filter((c) =>
        c.financialSetup?.accountingAccounts.find(
          (aa) => aa.use.toLocaleLowerCase() == "ventas"
        )
      )
      .sort((a, b) => a.socialReason.localeCompare(b.socialReason));
    
  }

  search() {  
    console.log(this.filters);
    this.onSearch.emit({
      ...this.filters,
      startDate: formatDate(this.filters.startDate) || '',
      endDate: formatDate(this.filters.endDate) || '',
    });
  }

  clearFilters() {
    this.filters = new CollectionTransactionFilter();
  }

  onChangebank(event) {
    if(event.value >= 1) {
      this.bankAccountsService.getbankAccountsList({ ...new bankAccountsFilter(), bankId: event.value }).subscribe((data) => {
        this.bankAccounts = data.map( c => ({
          label: c.accountNumber,
          value: c.bankAccountId
        }));
      }, (error: HttpErrorResponse) => { this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar las cuentas bancarias.' }); });
    }
  } 

  checkClient({socialReason, idclientsupplier}){
    this.filters.clientSocialReason = socialReason;
    this.filters.client = idclientsupplier
  }
}
