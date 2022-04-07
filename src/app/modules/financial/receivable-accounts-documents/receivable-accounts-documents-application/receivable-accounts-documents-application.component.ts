import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api/selectitem';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { CollectionTransactionDocument } from 'src/app/models/financial/collectiontransactions';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { SupplierclasificationService } from 'src/app/modules/masters/supplierclasification/shared/services/supplierclasification.service';
import { CollectionTransactionPostChargesDocumentDetail } from '../../collection-transactions/collection-transactions-details/models';
import { ReceivableAccountsDocumentsService } from '../receivable-accounts-documents.service';

@Component({
  selector: 'app-receivable-accounts-documents-application',
  templateUrl: './receivable-accounts-documents-application.component.html',
  styleUrls: ['./receivable-accounts-documents-application.component.scss']
})
export class ReceivableAccountsDocumentsApplicationComponent implements OnInit {
  
  // Arreglos con lista de datos 
 
  clients: SupplierExtend[] = []; 

  selectCollectionTransactionEnable: boolean = false;

  clientClassifications: SupplierClasification[] = []; 

  documentTypes : SelectItem[] = [];
 
  documentToApply : SelectItem[] = [ ];

  chargesToApply: SelectItem[] = [];

  amountApplied = 0;

  // indicadores de modales
  clientModal: boolean = false


  // etiquetas
  clientLabel : string;
  
  currenciesShowed : number = -1;

  data = new ReceivableAccountsDocument();

  submitted = false;


  get countAppliedTotal(): number {
    const result = this.data.documents.reduce((previous, actual) => {
      return previous + actual.amountToApply;
    }, 0);    
    
    return result;
  }

  

  constructor(
    private breadcrumbService: BreadcrumbService,
    private documentsService: ReceivableAccountsDocumentsService,
    private supplierClassificationService:  SupplierclasificationService,
    private messageService: MessageService,
    private router: Router,
    private supplierService: SupplierService,
    private loadingService: LoadingService
  ) { 
    this.breadcrumbService.setItems([
      { label: 'FMS' },
      { label: 'Cuentas por cobrar' },
      { label: 'Aplicacion de documentos', routerLink: ['/financial/receivable-accounts/document-application'] }
    ])
  }

  ngOnInit(): void {

    

    this.loadingService.startLoading();
    
    // Obtener data de inicio
    Promise.all([
      this.getDocumentTypes(),
      this.getClients()
    ]).then( () => {
      this.loadingService.stopLoading();
    });
    
      


  } 
  //Obtener tipos de documentos
  async getDocumentTypes() {
    const data =  await this.documentsService.getDocumentTypes().toPromise(); 
    data.forEach( p => { 
      if (p.name.trim().toUpperCase() === "COBRO" || p.name.trim().toUpperCase() === "NOTA DE CRÉDITO" ){
          if (p.name.trim().toUpperCase() === "COBRO"){
            this.data.documentTypeId = p.id;
          }
  
          this.documentTypes.push({
            label : p.name,
            value: p.id
          })
          
        
      }
    })  
    console.log(this.documentTypes);      
  } 

  // Obtener clientes
  async getClients() {           
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
  }

  async getCollectionsTransactions(){
    console.log(this.data);
    // nota esra cableado la linea comentada es la correcta
    //const data =  await (this.documentsService.getCollectionTransactions($event.idclientsupplier).toPromise()); 
    const data =  await (this.documentsService.getCollectionTransactions(1,this.data.documentTypeId).toPromise());  
    console.log(data)
    this.documentToApply = [];
    data.forEach(p =>{
      this.documentToApply.push(
        {
          label: `Numero Documento:${p.documentNumber}; Tipo de aplicacion:${p.typeApplicationCollection}; Monto:${p.amount}`,
          value: p,
        }
      )
    })
  }



  async updateClient($event:any ){
    this.data.client = $event;    
    this.getCollectionsTransactions();
    
  }

  send(){
    
    const postData = this.mapDataToSend();
    console.log(postData);
    this.documentsService.postApplication(this.data.document.collectionTransactionId,5,postData).subscribe(data =>{
      if (data) {
        this.router.navigate([`/financial/collection/collection-transactions`]);
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
    });

  }

  mapDataToSend(): CollectionTransactionPostChargesDocumentDetail[] {
    return this.data.documents.map( p =>{
      return{
        documentDetailChargeTransactionId: -1,
        chargeTransactionId: this.data.document.collectionTransactionId,
        chargeTransactionDetailId: this.data.document.collectionDetailTransactionId,
        documentChargeTransactionId: p.saleTransactionId,
        amountToApply : p.amountToApply,
        appliedAmount: p.amountApplied ,
        remainingTotal: p.remainingAmount  - p.amountToApply, 
        totalAmount: p.totalAmount 
      } as CollectionTransactionPostChargesDocumentDetail
    })
  }
  

}

export class ReceivableAccountsDocument  {
  currencyId: number = -1;
  client: SupplierExtend = undefined;
  documentTypeId: number = -1;
  document : CollectionTransactionApplicacion = undefined; //
  applicationDate:string = " ";
  documents: CollectionTransactionDocument[] =[];
  documentId:number = -1;
}  

export class ReceivableAccountsDocumentShowTable  {
  id: number = -1;
  documentNumber:string = " ";
  expirationDate:string = " ";
  type:string = " ";
  totalAmount:number =  -1;
  appliedAmount:number =  -1;
  amountNextToApply:number =  -1;
  amountToApply:number =  -1;
} 

export class CollectionTransactionApplicacion {
  collectionDetailTransactionId: number = -1;
  collectionTransactionId:       number = 0;
  documentNumber:                string = "";
  description:                   string = "";
  typeApplicationCollectionId:   number = 0;
  typeApplicationCollection:     string = "";
  bankId:                        number = 0;
  bank:                          string = "";
  bankCode:                      string = "";
  swiftCode:                     string = "";
  accountingAccountId:           number = 0;
  accountingAccountName:         string = "";
  accountingAccountCode:         string = "";
  bankAccountId:                 number = 0;
  bankAccountNumber:             string = "";
  currencyId:                    number = 0;
  currency:                      string = "";
  amount:                        number = 0;
  appliedAmount:                 number = 0;
  remainingAmount:               number = 0;
  auxiliaryBankAccountOriginId:  number = 0;
  auxiliaryBankAccountOrigin:    string = "";
}