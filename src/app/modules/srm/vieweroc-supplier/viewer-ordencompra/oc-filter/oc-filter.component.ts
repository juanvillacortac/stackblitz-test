import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { jsPDF } from 'jspdf';
import { MenuItem, MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api/selectitem';
import { Typedate } from 'src/app/models/common/typedate';
import { TypedateFilter } from 'src/app/models/common/typedate-filter';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { Coins } from 'src/app/models/masters/coin';
import { PaymentMethodResult } from 'src/app/models/masters/payment-method';
import { PaymentMethodFilters } from 'src/app/models/masters/payment-method-filters';
import { NumbersOrder } from 'src/app/models/srm/common/numbers-order';
import { TypesDelivery } from 'src/app/models/srm/common/types-delivery';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { CoinFilter } from 'src/app/modules/masters/coin/shared/filters/CoinFilter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { OperationMastersService } from 'src/app/modules/masters/operation-master/shared/operationmasters.service';
import { PaymentMethodService } from 'src/app/modules/masters/payment-method/shared/services/payment-method.service';
import { CommonMastersService } from 'src/app/modules/masters/shared/services/common-masters.service';
import { NumbersordersFilter } from '../../../shared/filters/common/numbersorders-filter';
import { TypesDeliveryFilter } from '../../../shared/filters/common/types-delivery-filter';
import { FilterViewerocSupplier } from '../../../shared/filters/filter-vieweroc-supplier';
import { CommonsrmService } from '../../../shared/services/common/commonsrm.service';
import { PurchaseorderService } from '../../../shared/services/purchaseorder/purchaseorder.service';
import { ViewerDocumentsSupplierService } from '../../../shared/services/vieweroc-supplier/viewer-documents-supplier.service';
import { OperatorModal } from '../../../shared/view-models/common/operatormodal';
import { PurchaselistViewmodel } from '../../../shared/view-models/purchaselist-viewmodel';
import * as FileSaver from 'file-saver';
import { PurchaserOrderStatus } from 'src/app/models/srm/purchase-order-status';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { StatusPurchase } from '../../../shared/Utils/status-purchase';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

//require('jspdf-autotable');
@Component({
  selector: 'app-oc-filter',
  templateUrl: './oc-filter.component.html',
  styleUrls: ['./oc-filter.component.scss'],
  
})
export class OcFilterComponent implements OnInit {

  
  @Input() expanded : boolean = false;
  @Input("filters") filters : FilterViewerocSupplier;
  @Input("operatormodal") operatormodal: OperatorModal = new OperatorModal();
  @Input("loading") loading : boolean = false;
  @Input("supplierstring") supplierstring: string="";
  @Input("ordersviewerlist") ordersviewerlist : PurchaselistViewmodel[];
  @Input("_selectedColumns") _selectedColumns : any[];
  @Output("onSearch") onSearch = new EventEmitter<FilterViewerocSupplier>();
  @Output() changes = new EventEmitter();

  iDate:Date=new Date();
  fDate:Date=new Date();
  nDate:Date=new Date();
  numOCselected : any []=[];
  statusselected: any []=[];
  typeOcSelected: any []=[];
  coinsList: SelectItem[]; 
  branchOfficeList: SelectItem[];
  typeDateList: SelectItem[];
  typeDistributionList: SelectItem[];
  waytopayList: SelectItem [];
  typedates: SelectItem [];
  typeOClist: SelectItem[];
  statusOCList: SelectItem[];
  typeDeliveryList: SelectItem[];
  numbersOrdersList: SelectItem[];
  OperatorDialogVisible = false;
  indPartial= false;
  SupplierDialogVisible = false;
  statuspurchase: typeof StatusPurchase = StatusPurchase;

  items: MenuItem[]= [
    {label: 'Excel', icon: 'pi pi-file-excel', command: () => {
        this.exportExcel();
    }},
    {label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
        this.exportPdf();
    }}
  ];


  constructor(public _coinService: CoinsService,
    private messageService: MessageService,
    public _branchofficeService: BranchofficeService, 
    private _commonService: CommonsrmService,
    private _paymentMethodService: PaymentMethodService,
    private _operationMaster: OperationMastersService, 
    private _commonmasterservice : CommonMastersService,
    private _commonservicempc: CommonService,
    public datepipe: DatePipe,
    public  _purchaseorderService: PurchaseorderService,
    public _viwerdocument: ViewerDocumentsSupplierService,
    private _authservice: AuthService) { }

  ngOnInit(): void {
       this.searchCoins();
       this.searchBrancoffices();
       this.GetWayTopay();
      //  this.GetTypeDistribution();
      //  this.GetTypeDocumentOC();
       this.searchTypesDate();
       this.onLoadStatusList();
       this.GetTypeDelivery();
       this.getNumbersOrders();
       this.filters.indPartialdelivery=1;
  }

  search(){
    
    if(this.filters.idTypeDate!=-1){
      this.filters.initialDate = this.datepipe.transform(this.iDate, "yyyyMMdd");
      this.filters.finalDate = this.datepipe.transform(this.fDate, "yyyyMMdd");
    }
    if(this.operatormodal.namesoperators!=""){
        this.filters.idUserAuthorize=this.operatormodal.idOpetator;
    }
    if(this.filters.idsupplier!=''){
       this.ValidateChecksnumberOC();
       this.filters.idOriginBranch=this._authservice.currentOffice;
       this.onSearch.emit(this.filters);
    } else{
      this.messageService.add({severity:'warn', summary:'Alerta', detail: "Debe seleccionar un proveedor"});

    }
  }
  ValidateChecksnumberOC(){
    this.filters.numberOC = "";
    if(this.numOCselected.length > 0){
      for (let i = 0; i < this.numOCselected.length; i++) {
        this.filters.numberOC = this.filters.numberOC == "" ? this.numOCselected[i] : this.filters.numberOC + "," + this.numOCselected[i];
      }
    }
  }

  ValidateChecksstatus(){
    this.filters.idStatus = "";
    if(this.statusselected.length > 0){
      for (let i = 0; i < this.statusselected.length; i++) {
           this.filters.idStatus = this.filters.idStatus == "" ? this.statusselected[i] : this.filters.idStatus + "," + this.statusselected[i];
      }
    }
  }

  // ValidateChecksTypesOC(){
  //   this.filters.idTypeOC = "";
  //   if(this.typeOcSelected.length > 0){
  //     for (let i = 0; i < this.typeOcSelected.length; i++) {
  //          this.filters.idTypeOC = this.filters.idTypeOC == "" ? this.typeOcSelected[i] : this.filters.idTypeOC + "," + this.typeOcSelected[i];
  //     }
  //   }
  // }

  //Obtener todas las monedas
  searchCoins(){
    var filter = new CoinFilter();
    filter.id = -1;
    this._coinService.getCoinsList(filter).subscribe((data: Coins[]) => {
      this.coinsList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de monedas"});
    });
  }

  //Obtener sucursales 
  searchBrancoffices(){
     var filter= new BranchofficeFilter();
      filter.idCompany=this._authservice.currentCompany;
    this._branchofficeService.getBranchOfficeList(filter).subscribe((data: Branchoffice[]) => {
      this.branchOfficeList = data.map((item)=>({
        label: item.branchOfficeName,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las sucursales"});
    });
  }

  //Get TypesDate
  searchTypesDate(){
    var filter= new TypedateFilter();
     filter.id=-1;
     filter.idTypeDocumentOperational=4;
   this._commonmasterservice.getTypesDate(filter).subscribe((data: Typedate[]) => {
     this.typedates = data.map((item)=>({
       label: item.name,
       value: item.id
     }));
   }, (error: HttpErrorResponse)=>{
     this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las sucursales"});
   });
 }

 //Get waytopay 
 GetWayTopay(){
  var filter= new PaymentMethodFilters();
   filter.id=-1;
   this._paymentMethodService.getPaymentMethods(filter).subscribe((data: PaymentMethodResult[]) => {
   this.waytopayList = data.map((item)=>({
     label: item.name,
     value: item.id
   }));
 }, (error: HttpErrorResponse)=>{
   this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las formas de pago"});
 });
}

//Get typedistribution 
//  GetTypeDistribution(){
//   var filter= new DistributiontypesFilter();
//    filter.id=-1;
//  this._commonService.getDistributiontypes(filter).subscribe((data: Distributiontypes[]) => {
//    this.typeDistributionList = data.map((item)=>({
//      label: item.name,
//      value: item.id
//    }));
//  }, (error: HttpErrorResponse)=>{
//    this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de distribución"});
//  });
// }


GetTypeDelivery(){
  var filter= new TypesDeliveryFilter();
  filter.id=-1;
 this._commonService.getTypesDelivery(filter).subscribe((data: TypesDelivery[]) => {
   this.typeDeliveryList = data.map((item)=>({
     label: item.name,
     value: item.id
   }));
 }, (error: HttpErrorResponse)=>{
   this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de entrega."});
 });
}


// GetTypeDocumentOC(){
//   var filter= new OperationdocumentFilters();
//    filter.id=-1;
//    filter.idTypeDocumentOperation=2;//orden compra
//    this._operationMaster.getDocumentsOperations(filter).subscribe((data:Operationdocument []) => {
//    this.typeOClist = data.map((item)=>({
//      label: item.name,
//      value: item.id
//    }));
//  }, (error: HttpErrorResponse)=>{
//    this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de distribución"});
//  });
// }

 //Get TypesDate
 getNumbersOrders(){
  var filter= new NumbersordersFilter();
   filter.idOrderPurchase=-1;
  
 this._purchaseorderService.getnumbersOrdersfilter(filter).subscribe((data: NumbersOrder[]) => {
   this.numbersOrdersList = data.map((item)=>({
     label: item.identifierNumber,
     value: item.identifierNumber
   }));
 }, (error: HttpErrorResponse)=>{
   this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las sucursales"});
 });
}

onToggleOperator(visible: boolean){
  this.OperatorDialogVisible = visible;
}

onToggleSupplier(visible: boolean) {
  this.SupplierDialogVisible = visible;
}

onBlurMethod(event: any)
  {
    let dates = new Date(event);
    if(dates > this.fDate)
    {
      this.fDate=dates;
       this.filters.finalDate=this.datepipe.transform(this.fDate, "yyyyMMdd");
       this.changes.emit(this.filters.finalDate);
    }     
  }

  onLoadStatusList(){
    var filter : StatusFilter = new StatusFilter();
    filter.IdStatusType = 5;
    this._commonservicempc.getStatus(filter)
    .subscribe((data)=>{
      this.onLoadStatusListSuccessed(data);
       this.statusOCList = this.statusOCList.filter(x => x.value == StatusPurchase.RejectedBySupplier || x.value == StatusPurchase.Received
        || x.value == StatusPurchase.ReceptionRejected || x.value == StatusPurchase.ReviewCompleted || x.value == StatusPurchase.Authorized || x.value == StatusPurchase.Reception || x.value == StatusPurchase.PendingForReview)
    },(error)=>{
      console.log(error);
    });
  }

  onLoadStatusListSuccessed(data: Status[]) {
    if (data?.length > 0 ) {
      const allowedStatus = data.filter(x => this.isAllowedStatus(x.id));

      this.statusOCList = allowedStatus.map((item)=>({
        label: item.name,
        value: item.id
      })); 
      // }, (error) => {
      //     console.log(error);
      // });

    }
  }
  

  private isAllowedStatus(id: number) {
    return id === PurchaserOrderStatus.authorized || id === PurchaserOrderStatus.pending || id === PurchaserOrderStatus.inReview 
    || id === PurchaserOrderStatus.reviewFinalized || id === PurchaserOrderStatus.rejectedBySupplier
    || id === PurchaserOrderStatus.receptionRejected || id === PurchaserOrderStatus.inReception;
    //|| id === PurchaserOrderStatus.receptionFinalized;
  }

  clearFilters(){

      this.filters.idCoin=-1;
      this.filters.idStatus="";
      //this.filters.idTypeDistribution=-1;
      this.filters.idWayToPay=-1;
      this.filters.numberOC= "";
      this.filters.indPartialdelivery= -1;
     // this.filters.idTypeOC= "";
     // this.filters.idSuppliers="";
      this.filters.idDestBranch=-1;
      this.filters.idOriginBranch=-1;
      this.filters.idUserAuthorize=-1;
      this.filters.idUserCreated=-1;
      this.numOCselected=[];
      this.statusselected=[];
      this.typeOcSelected=[];
      this.filters.idTypeDate=-1;
      this.filters.indModalUserCreated=false;
      this.filters.userCreated="";
      this.filters.idsupplier="";
      this.supplierstring="";
  }
//   exportPdf2() {
//     import("jspdf").then(jsPDF => {
//         import("jspdf-autotable").then(x => {
//             const doc = new jsPDF.default('p', 'pt');
//             doc.autoTable(this._selectedColumns, this.ordersviewerlist);
//             doc.save('products.pdf');
//         })
//     })
// }
exportPdf() {
  if (this.ordersviewerlist.length > 0) {
    var cols: any[] = [];
    var cols1: any[] = ['Número de orden'];
    this._selectedColumns.forEach(col => {
      if (col.field != "numOC") {
        cols1.push(col.header);
      }
    })
    cols.push(cols1);
    var list = this.ordersviewerlist.map(lstItem => {
      var itm: Array<string> = [];
      itm.push(lstItem.numOC);
      this._selectedColumns.forEach(col => {
        //  if (col.field == "numOC") {
        //     itm.push(lstItem.numOC)
        //  }

        //  if (col.field == "typePacking") {
        //    itm.push(lstItem.typePacking)
        //  }
        if (col.field == "branchRequest") {
          itm.push(lstItem.branchRequest)
        }
        if (col.field == "supReasonCommercial") {
          itm.push(lstItem.supReasonCommercial)
        }
        if (col.field == "country") {
          itm.push(lstItem.country)
        }

        if (col.field == "status") {
          itm.push(lstItem.status)
        }
        if (col.field == "partialDelivery") {
          itm.push(lstItem.partialDelivery)
        }

        if (col.field == "typeDistribution") {
          itm.push(lstItem.typeDistribution)
        }

        if (col.field == "typeDocumentOC") {
          itm.push(lstItem.typeDocumentOC)//lstItem.plannedby)
        }

        if (col.field == "cantItems") {
          itm.push(lstItem.cantItems.toString())
        }

        if (col.field == "totalAmountBase") {
          itm.push(lstItem.totalAmountBase.toString())
        }
        if (col.field == "totalAmountConversion") {
          itm.push(lstItem.totalAmountConversion.toString())
        }
        if (col.field == "createdby") {
          itm.push(lstItem.createdby)
        }

        if (col.field == "responsible") {
          itm.push(lstItem.responsible)
        }
        if (col.field == "approvedby") {
          itm.push(lstItem.approvedby)
        }
        if (col.field == "plannedby") {
          itm.push(lstItem.plannedby)
        }
      
        if (col.field == "dateCreate") {
          itm.push(this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy"))
        }
        if (col.field == "dateUpdate") {
          var dateupdate= lstItem.dateUpdate == undefined ? "" : this.datepipe.transform(lstItem.dateUpdate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(lstItem.dateUpdate, "dd/MM/yyyy");
          itm.push(dateupdate)
        }
      });
      return itm;
    })
    var doc = new jsPDF('p', 'pt');
    var dateday = new Date();

    var namedocument = "Órdenes de compra " + this.datepipe.transform(dateday, "dd/MM/yyyy") + ".pdf";;
    // @ts-ignore
    doc = new jsPDF('l', 'pt', 'legal');
    // }


    // @ts-ignore
    doc.autoTable({
      head: cols,
      body: list,
      styles: { fontSize: 7 }
    });
    doc.save(namedocument);
  }else{
    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe realizar una búsqueda." });
  }
}
  
  exportExcel() {
    if (this.ordersviewerlist.length > 0) {
      var list = this.ordersviewerlist.map(lstItem => {
        var itm = <any>{};
        // itm.numOC = lstItem.numOC;
        this._selectedColumns.forEach(col => {

          if (col.field == "numOC") {
            itm['Número de orden'] = lstItem.numOC;
          }
          if (col.field == "branchRequest") {
            itm['Sucursal destino'] = lstItem.branchRequest;
          }
          if (col.field == "supReasonCommercial") {
            itm['Proveedor'] = lstItem.supReasonCommercial;
          }
          if (col.field == "country") {
            itm['País'] = lstItem.country;
          }
          if (col.field == "status") {
            itm['Estatus'] = lstItem.status;
          }
          if (col.field == "partialDelivery") {
            itm['Tipo de entrega'] = lstItem.partialDelivery;
          }
          if (col.field == "typeDistribution") {
            itm['Tipo de distribución'] = lstItem.typeDistribution;
          }
          if (col.field == "typeDocumentOC") {
            itm['Tipo de OC'] = lstItem.typeDocumentOC;
          }
          if (col.field == "cantItems") {
            itm["Cantidad de ítems"] = lstItem.cantItems;
          }
          if (col.field == "totalAmountBase") {
            itm['Monto total costo base'] = lstItem.totalAmountBase;
          }
          if (col.field == "totalAmountConversion") {
            itm['Monto total costo conversión'] = lstItem.totalAmountConversion;
          }
          if (col.field == "createdby") {
            itm['Creado por'] = lstItem.createdby;
          }

          if (col.field == "responsible") {
            itm['Responsable'] = lstItem.responsible;
          }

          if (col.field == "approvedby") {
            itm['Autorizado por'] = lstItem.approvedby;
          }

          if (col.field == "plannedby") {
            itm['Planificado por'] = lstItem.plannedby;
          }
          if (col.field == "dateCreate") {
          
            itm['Fecha de creación'] =   lstItem.dateCreate == undefined ? "" : this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy"); //this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy")=="";
            // this.dateday=this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy");
          }
          if (col.field == "dateUpdate") {
            itm['Fecha de actualización'] =   lstItem.dateUpdate == undefined ? "" : this.datepipe.transform(lstItem.dateUpdate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(lstItem.dateUpdate, "dd/MM/yyyy"); //this.datepipe.transform(lstItem.dateUpdate, "dd/MM/yyyy");
          }

        });
        return itm;
      })
      import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(list);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        var dateday = new Date();

        var namedocument = "Órdenes de compra " + this.datepipe.transform(dateday, "dd/MM/yyyy");;
        this.saveAsExcelFile(excelBuffer, namedocument);
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe realizar una búsqueda." });
    }

  }
  
  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    });
  }

  showDialogOperator(ind:boolean){
    this.filters.indModalUserCreated= ind;
    this.OperatorDialogVisible= true;
  }
}
