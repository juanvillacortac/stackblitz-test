import { Component, Injector, OnInit } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Lots } from 'src/app/models/financial/lots';
import { LotsFilter } from 'src/app/models/financial/lotsFilter';
import { ExchangeRateByCurrency } from 'src/app/models/masters/exchangeRateByCurrency';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { SupplierclasificationService } from 'src/app/modules/masters/supplierclasification/shared/services/supplierclasification.service';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { LotsService } from '../../lots/shared/services/lots.service';
import { AccountingAccount } from 'src/app/models/financial/AccountingAccount';
import { ArticleClassification } from 'src/app/models/financial/ArticleClassification';
import { Article } from 'src/app/models/financial/article';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { CollectionTransactionsService } from '../../collection-transactions/shared/collection-transactions.service';
import { CollectionTransaction, CollectionTransactionCharges, CollectionTransactionDistribution, CollectionTransactionDocument, CollectionTransactionDocumentCharges, CollectionTransactionFilter } from 'src/app/models/financial/collectiontransactions';
import { BranchOffice } from 'src/app/modules/hcm/shared/models/masters/branch-office';
import { BranchOfficeService } from 'src/app/modules/hcm/shared/services/branch-office.service';
import { BranchOfficeFilter } from 'src/app/modules/hcm/shared/filters/branch-office-filter';
import { accountingAccounts } from '../../sale-transactions/sale-transactions-details/sale-transactions-details.component';
import { environment } from 'src/environments/environment';
import { CollectionTransactionPost, CollectionTransactionPostChargesDetail, CollectionTransactionPostChargesDocument, CollectionTransactionPostChargesDocumentDetail, CollectionTransactionPostDetail } from './models';


enum DistributionType {
  VENTA = 'Venta',
  CLIENT = 'Cobro',
  COBRO = 'Depósito',
  TAX = 'Impuesto',
  RETENCION = 'Retención',
  DISCOUNT = 'Descuento',
}






@Component({
  selector: 'app-collection-transactions-details',
  templateUrl: './collection-transactions-details.component.html',
  styleUrls: ['./collection-transactions-details.component.scss']
})
export class CollectionTransactionsDetailsComponent extends AccountingPlanBase implements OnInit {

  loaded = false;
  required = '*';
  saving: boolean;
  showDialog: boolean;
  showFilters: boolean;
  submitted: boolean;
  record: boolean;
  idItem = 0;
  loading: any;
  maxPostingDate: Date;
  distributions: CollectionTransactionDistribution[] = [];
  chargeCounter: number = 0;
  transact = new CollectionTransaction();
  oldTransact = new CollectionTransaction();
  transactFilter = new CollectionTransactionFilter();
  initDate = new Date();
  addAccountingAccountId:number = -1;
  documents: CollectionTransactionDocument[] = [];
  charges: CollectionTransactionCharges[] = [];
  aAccount = new accountingAccounts();

  constructor(
    private actRoute: ActivatedRoute,
    private branchOfficeService: BranchOfficeService,
    public breadcrumbService: BreadcrumbService,
    private loadingService: LoadingService,
    private supplierService: SupplierService,
    private collectionService: CollectionTransactionsService,
    private supplierClassificationService: SupplierclasificationService,
    // private paymentConditionsService: PaymentconditionService,
    private lotsService: LotsService,
    // private branchOfficeService: BranchOfficeService,
    // private bankAccountsService: BankAccountsService,
    private coinsService: CoinsService,
    private messageService: MessageService,
    // private taxPlanService: TaxPlanService,
    private confirmationService: ConfirmationService,
    private router: Router,
    // private accountingAccountsService: AccountingAccountService,
    // private artClassiService: ArticleClassificationService,
    // private articleService: ArticleService,
    injector: Injector,
  ) {
    super(injector);
    this.breadcrumbService.setItems([
      { label: 'FMS' },
      { label: 'Cuentas por cobrar' },
      { label: 'Pagos', routerLink: ['/financial/collection/collection-transactions'] }
    ]);
  }

  // branchOffices: BranchOffice[];
  bankAccountExchangeRateByCurrency: ExchangeRateByCurrency[];

  client: SupplierExtend;
  clients: SupplierExtend[] = [];
  lot: Lots = new Lots();
  lots: Lots[] = [];
  clientClassifications: SupplierClasification[] = [];
  branchOffices: BranchOffice[] = []


  // discounts : SalesTransactionDiscount[] = [];
  clientModal = false;
  lotModal = false;
  accountingAccountsModal = false;

  articlesTotal = 0;


  get clientAAcountExist(): boolean {
    const data = this.distributions.find(data => { return data.isClient })
    return !!data;
  }

  get chargesTotal(): number {
    return this.transact.charges.reduce((acum, a) => acum + a.amount, 0)
  }

  get creditTotal(): number {
    return this.distributions.reduce((acum, a) => acum + a.credit, 0)
  }

  get debitTotal(): number {
    return this.distributions.reduce((acum, a) => acum + a.debit, 0)
  }

  distributionsCols: ColumnD<CollectionTransactionDistribution>[] = [
    { template: d => d.accountingAccount, header: 'Descripción' },
    { template: d => d.accountingAccountCode ? this.formatCode(d.accountingAccountCode) : null, header: 'Cuent acontable' },
    { template: d => d.acientType, header: 'Tipo' },
    { template: d => d.branchOffice ? d.branchOffice : "N/A", header: 'Sucursal' },
    { template: d => d.costCenter || 'N/A', header: 'Centro de costo' },
    { template: d => d.indAux ? d.auxiliar || 'Sin auxiliar' : 'N/A', header: 'Auxiliar' },
    { field: 'debit', template: d => '$' + (d.debit || 0).toLocaleString('es', { maximumFractionDigits: 2, minimumFractionDigits: 2 }), header: 'Débito', style: 'font-weight: bold', textAlign: 'right' },
    { field: 'credit', template: d => '$' + (d.credit || 0).toLocaleString('es', { maximumFractionDigits: 2, minimumFractionDigits: 2 }), header: 'Crédito', style: 'font-weight: bold', textAlign: 'right' },
  ]

  getClientAccountingAccount() {
    const aa = this.client?.financialSetup?.accountingAccounts.find(aa => aa.use.toLocaleLowerCase() == 'cuentas por cobrar')
    const rawAA = this.accountingAccounts.find(raw => raw.accountingAccountId == aa.accountingAccountId)
    return {
      account: aa,
      raw: rawAA,
    }
  }

 

  removeChargeRecursively() {
    this.transact.documents.forEach(p => {
      p.chargesApplied = p.chargesApplied.filter(p => this.transact.charges.includes(p as any));
    })
  }



  addCharge($event: any) {
    if ($event.length <= this.transact.charges.length) {
      this.transact.charges = $event;
      const clientAccount = this.distributions.find(p => p.isClient);
       

      if (clientAccount) {
        clientAccount.credit = this.chargesTotal;
      }

      if($event.length == this.transact.charges.length){
        this.addChargesToDocuments();
        return;
      }

      this.removeChargeRecursively();
      return;
    }
    
    this.transact.charges = $event;
    this.addLastChargeToDocuments();
    const clientAccount = this.distributions.find(p => p.isClient);
    if (!clientAccount) {
      return;
    }
     clientAccount.credit = this.chargesTotal;
   }

  checkClient($event: any) {
    if (this.clientAAcountExist) {
      this.distributions = this.distributions.filter(data => !data.isClient);
    }
    this.transact.providerCustomerId = $event.idclientsupplier;
    this.client = $event;
    const data = $event.financialSetup.accountingAccounts[0];
    const newDist = new CollectionTransactionDistribution();
    this.transact.details = [];
    console.log(data);
    newDist.accountingAccountId = data.accountingAccountId;
    newDist.accountingAccountCode = data.accountingAccountCode;
    newDist.acientType = data.use;
    newDist.branchOffice = data.branchOffice;
    newDist.costCenter = data.chargeCenter;
    newDist.costCenterId = data.chargeCenterId;
    newDist.branchOfficeId = -1;
    newDist.auxiliarId = data.auxiliarId;
    newDist.indAux = data.indPermiteAuxiliar
    newDist.auxiliar = data.auxiliar;
    newDist.isClient = true;
    this.transact.details.push(newDist);


  }

  appendToList(data: any) {
    console.log(data)
    const newDist = new CollectionTransactionDistribution();
    newDist.accountingAccount = data.accountingAccount;
    newDist.accountingAccountId = data.idAssociate;
    newDist.accountingAccountCode = data.accountingAccountCode;
    newDist.acientType = data.tipoUsoCuenta;
    newDist.branchOffice = data.branchOffice;
    newDist.costCenter = data.chargeCenter;
    newDist.costCenterId = data.chargeCenterId;
    newDist.branchOfficeId = data.branchOfficeId;
    newDist.auxiliarId = data.auxiliarId;
    newDist.indAux = data.indPermiteAuxiliar
    newDist.auxiliar = data.auxiliar;
    this.transact.details.push(newDist);
  }

  getDistTotals() {
    const dists = this.getDistributions()
    const debit = dists.map(d => d.debit).reduce((a, b) => a + b, 0)
    const credit = dists.map(d => d.credit).reduce((a, b) => a + b, 0)
    const diff = debit - credit
    const format = (value: number) => '$' + (value || 0).toLocaleString('es', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    return {
      debit: format(debit),
      credit: format(credit),
      diff: format(diff),
      color: diff === 0 ? 'green' : 'red',
    }
  }

  getDistributions() {
    if (!this.accountingAccounts) {
      return []
    }
    const dists: CollectionTransactionDistribution[] = []
    if (this.client) {
      const aa = this.getClientAccountingAccount()
      console.log(aa)    
      dists.unshift({
        accountingAccount: `CxC - ${aa.raw.accountingAccountName}`,
        branchOffice: 'Porlamar',
        accountingAccountCode: aa.account.accountingAccountCode,
        auxiliar: aa.account.auxiliar,
        indAux: aa.account.indAuxiliar,
        acientType: DistributionType.CLIENT,
        debit: this.articlesTotal,
        credit: 0,
      } as CollectionTransactionDistribution)
    }


    const folded: CollectionTransactionDistribution[] = []
    dists.forEach(d => {
      const idx = folded.findIndex(f => d.accountingAccountCode == f.accountingAccountCode && d.costCenter == f.costCenter && d.acientType == f.acientType)
      if (idx >= 0) {
        folded[idx] = {
          ...folded[idx],
          credit: d.credit + folded[idx].debit
        }
      } else {
        folded.push(d)
      }
    })
    return folded
  }

  showAccountingAccountsModal() {
    this.accountingAccountsModal = !this.accountingAccountsModal;
  }

  accountingAccounts: AccountingAccount[]
  artClassifications: ArticleClassification[]
  artData: Article[]

  async fetchDataHeader() {
    try {
      this.lots = (await this.lotsService.getLotsList({ ...new LotsFilter(), allowsEntry: 1 }).toPromise())
        .find(l => l.moduleContent.toLowerCase() === 'compras')?.lots
        .filter(l => l.indStatusLot === 2)
        .sort((a, b) => a.lotName.localeCompare(b.lotName)) || [];

      const fmsClients = await this.supplierService.getFMSSetupList().toPromise();
      this.clients = (await this.supplierService.getSupplierExtendList().toPromise())
        .map(c => ({
          ...c,
          financialSetup: fmsClients.find(fms => fms.clientSupplierId === c.idclientsupplier)
        }))
        .filter(c => c.financialSetup?.accountingAccounts?.length)
        .filter(c => c.financialSetup?.accountingAccounts.find(aa => aa.use.toLocaleLowerCase() === 'cuentas por cobrar'))
        .sort((a, b) => a.socialReason.localeCompare(b.socialReason));

      this.clientClassifications = (await this.supplierClassificationService.getSupplierClasificationList().toPromise())
        .sort((a, b) => a.supplierclasification.localeCompare(b.supplierclasification));
    } catch (err) {
      console.log(err);
    }
  }
  async fetchData() {
    try {

      await this.fetchDataHeader();

      this.idItem = this.actRoute.snapshot.params['id'];
      debugger
      if (this.idItem !== 0 && this.idItem !== undefined) {

        this.getDetails();

        if (this.transact.transactionStatusTypeId === 2) {
          this.saving = true;
        }

        if (this.transact.transactionStatusTypeId === 1) {
          this.saving = false;
        }

      } else {
        this.transact.indActive = true;
        this.required = '';
      }

      this.branchOffices = (await this.branchOfficeService.GetBranchOffices({ ...new BranchOfficeFilter(), idCompany: 1 }).toPromise())
        .sort((a, b) => a.branchOfficeName.localeCompare(b.branchOfficeName));

    } catch (err) {
      console.error(err);
    }
  }

  getDetails() {
    
    this.charges = undefined;
    if (this.loading)
      return;
    this.loading = true;
    this.transactFilter.collectionTransactionId = this.idItem;
    this.collectionService.getTransactionDetail(this.transactFilter).subscribe((data: CollectionTransaction) => { 
      this.transact = {
        ...data,
        ...(data?.accountingDate ? { accountingDate: new Date(data.accountingDate) } : {}),
       ...(data?.collectionDate ? { collectionDate: new Date(data.collectionDate) } : {}),
      };
      console.log(this.transact);
      this.lot.id = this.transact.lotId;
      this.documents = this.transact.documents;
      this.charges = this.transact.charges as any[];      
      
      this.transact.charges.forEach((data,i) =>{
        this.transact.documents.forEach(p => {
          console.log(data.paymentMethod)
          p.chargesApplied[i].paymentMethod = data.paymentMethod

        })
      })
      console.log(this.transact)

      if (data == null) {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar la transaccion de cobro.' });
        this.loading = false;
        return;
      }

      this.loading = false;



      this.client = this.clients.find(c => c.idclientsupplier == this.transact.providerCustomerId);


    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el detalle del ajuste bancario." });

    });
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.maxPostingDate = new Date();
    this.fetchInitialSetup().then(() => this.fetchData())
      // Totalmente cargado sin errores
      .then(() => {
        this.loaded = true;
      })
      // Quitar el indicador de carga aunque existan errores
      .finally(() => {
        this.loadingService.stopLoading();
      });
  }


  back() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea regresar? perderá los cambios realizados.',
      accept: () => {
        this.saving = true;
        this.router.navigate(['/financial/collection/collection-transactions']);
      }
    });
  }



  Cancel() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar? luego no se podran editar los datos.',
      accept: () => {
        this.collectionService.PostTransactionsDetailCancel(this.oldTransact, this.idItem).subscribe((data: number) => {
          if (data > 0) {
            this.showDialog = false;
            this.submitted = false;
            this.saving = false;
            this.router.navigate(['/financial/collection/collection-transactions']);
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Guardado exitoso' });

          } else if (data == -1) {

            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre ya se encuentra registrado.' });
            this.saving = false;

          }
          else if (data == -3) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Este registro no existe' });
          }
          else {
            this.saving = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar los datos' });

          }
        });

      }
    });
  }


  transformAmount(value: number): string {
    return " $ " + value.toLocaleString('es') + " - " + "Bs. " + (value * 2500000).toLocaleString('es')

  }

  Revoke() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea anular el ajuste? Esta acción no es reversible.',
      accept: () => {
        this.collectionService.PostTransactionsDetailRevoke(this.oldTransact, this.idItem).subscribe((data: number) => {
          if (data > 0) {
            this.showDialog = false;
            this.submitted = false;
            this.saving = false;
            this.router.navigate(["/financial/collection/collection-transactions"]);
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });

          } else if (data == -1) {

            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
            this.saving = false;
            //this.article.associatedAccount = asso
          }
          else if (data == -3) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
          }
          else {
            this.saving = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });

          }
        });
      }
    });
  }


  send() {
    const postTransactionData = this.mapDataToSend();            
    /*
    console.log(postTransactionData);
    return*/
    this.collectionService.postTransaction(postTransactionData).subscribe((data) => {
      if (data > 0) {
        this.router.navigate([`/financial/collection/collection-transactions`]);
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
      } else {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
    })


  }

  mapDataToSend() {
    let postData: CollectionTransactionPost = new CollectionTransactionPost();
    postData.chargesDetails = Array<CollectionTransactionPostChargesDetail>();
    postData.chargesDocument = Array<CollectionTransactionPostChargesDocument>();
    postData.details = Array<CollectionTransactionPostDetail>();
    postData.chargesDocumentDetails = Array<CollectionTransactionPostChargesDocumentDetail>();
    postData.collectionTransactionId = this.transact?.collectionTransactionId;
    postData.clientSupplierId = this.transact?.providerCustomerId;
    postData.documentNumber = "";
    postData.lotId = this.transact.lotId;
    postData.description = this.transact.description
    postData.activeInd = this.transact.indActive;
    postData.paymentDate = this.transact.accountingDate;
    postData.contabilizationDate = this.transact.accountingDate;
    postData.transferenceDate = this.transact.transferDate;

    this.transact.charges.forEach((p: any, i :number) => {
      const newCharge = new CollectionTransactionPostChargesDetail();
      newCharge.collectionTransactionPaymentDetailsId = p.collectionTransactionPaymentDetailsId ? p.collectionTransactionPaymentDetailsId : -1;
      newCharge.bankId = p.bankId;
      newCharge.bankAccountId = p.bankAccountId;
      newCharge.paymentMethodByCurrency = p.paymentMethodByCurrency;
      newCharge.currencyId = p.currencyId;
      //Todo Falta el tipo de aplicacion de cobro;
      //HARDCODED!!!!!!!!!!!!!!
      newCharge.paymentTypeApplicationId = 2;
      //HARDCODED!!!!!!!!!!!!!!
      newCharge.exchangeRateId = p.exchangeRateId;
      newCharge.exchangeRateConvertionId = p.exchangeRateConvertionId;
      newCharge.amount = p.amount;
      newCharge.appliedAmount = this.calculateChargeTotal(i);
      newCharge.reference = p.reference;
      newCharge.activeInd = p.indActive
      postData.chargesDetails?.push(newCharge);
    });

    this.transact.documents.forEach(p => {
      const newDocument = new CollectionTransactionPostChargesDocument();
      newDocument.activeInd = p.activeInd;
      newDocument.chargeDocumentTransactionId = this.transact.collectionTransactionId; 
      newDocument.documentId = p.saleTransactionId;
      newDocument.documentTypeId = p.documentTypeId;
      newDocument.appliedAmount = p.amountApplied;
      newDocument.remainingAmount = p.remainingAmount - p.amountToApply;
      newDocument.totalAmount = p.totalAmount;
      newDocument.amountToApply = p.amountToApply;
      newDocument.documentNumber = p.documentNumber;
      newDocument.expirationDate = p.expirationDate;
      postData.chargesDocument.push(newDocument);
    });


    this.transact.details.forEach(p => { 
      console.log(p);
      const newDistribution = new CollectionTransactionPostDetail();
      newDistribution.accountingAccountId = p.accountingAccountId;
      newDistribution.transactionDetailId = p.transactionDetailsId;
      //newDistribution.transactionalMasterType = p.transactionalMasterTypeId;
      newDistribution.transactionalMasterType =5;
      newDistribution.transactionalChargeId = -1;
      newDistribution.seatTypeId = p.seatTypeId;
      newDistribution.centerCostId = p.costCenterId ? p.costCenterId : -1;
      newDistribution.branchOfficeId = p.branchOfficeId ? p.branchOfficeId : -1
      //TODO falta el id de las cuentas contables;
      newDistribution.auxiliarId = p.auxiliarId;
      newDistribution.debit = p.debit;
      newDistribution.credit = p.credit
      postData.details.push(newDistribution);
    })


    for (let i = 0; i < postData.chargesDocument.length; i++) {
      const chargesDocumentDetails = postData.chargesDetails.map((q) => {
        const newDetail = new CollectionTransactionPostChargesDocumentDetail();
        newDetail.documentDetailChargeTransactionId = -1 
        newDetail.chargeTransactionDetailId = postData.chargesDocument[i].chargeDocumentTransactionId;
        //TODO faltan los calculos de los montos!!!!!!!!!!!!!!!!!!!!!!!!!
        return newDetail;
      })
      postData.chargesDocumentDetails = [...postData.chargesDocumentDetails, ...chargesDocumentDetails];
    }
    return postData;
  }

  selectLot($event: any) {
    this.transact.lotId = $event.id;
    this.transact.lot = $event.lotName
  }
  addChargesToDocuments() {
    const chargesFormatted = this.transact.charges.map(charge => ( { ...charge, amountApplied: 0, remainingAmount: charge.amount }) )
  
    
    this.transact.documents.forEach((p) => {
      p.chargesApplied = chargesFormatted as any;
    })
  }
  addLastChargeToDocuments() {
    const lastCharge = this.transact.charges[this.transact.charges.length - 1];
    this.transact.documents.forEach((p) => {
      p.chargesApplied.push({ ...lastCharge, amountApplied: 0, remainingAmount: lastCharge.amount } as any)
    })
  }

  addDocument($event: any) {
    console.log($event);
    if ($event.length < this.transact.documents.length) {
      this.transact.documents = $event;
      return;
    }

    const lastDocument = $event[$event.length - 1];
    lastDocument.chargesApplied = this.transact.charges.map(p => { return { ...p, amountApplied: 0, remainingAmount: p.amount } });
    this.transact.documents.push(lastDocument);

  }

  calculateChargeTotal(index): number {
    let total = 0;
    this.transact.documents.forEach(p => {
      const data = p.chargesApplied[index]
      total += data.amountToApply;
    })
    return total
  }

  updateAmounts(index: number) {


    let total = this.calculateChargeTotal(index);

    this.transact.charges[index].amountToApply = total;
    total = this.transact.charges[index].amount - total
    this.transact.charges[index].remainingAmount = total;
    this.transact.documents.forEach(p => {
      p.chargesApplied[index].remainingAmount = total
    })

    this.updateDocumentAmount();

  }

  updateDocumentAmount() {
    this.transact.documents.forEach(p => {
      const semiTotal = p.chargesApplied.reduce((prev, current) => {
        return prev + current.amountToApply
      }, 0)
      p.amountToApply = semiTotal;
    })
  }

}

