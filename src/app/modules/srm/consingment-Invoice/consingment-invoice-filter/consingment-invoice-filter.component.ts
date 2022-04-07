import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { PaymentMethodResult } from 'src/app/models/masters/payment-method';
import { PaymentMethodFilters } from 'src/app/models/masters/payment-method-filters';
import { PaymentMethodFilter } from 'src/app/modules/hcm/shared/filters/laborRelationship/payment-method-filter';
import { PaymentMethodService } from 'src/app/modules/masters/payment-method/shared/services/payment-method.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinFilter } from 'src/app/modules/masters/coin/shared/filters/CoinFilter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ConsingmentInvoiceFilter } from '../../shared/filters/consigment-invoice/consigmentinvoicefilter';
import { ConsingmentInvoiceList } from '../../shared/filters/consigment-invoice/consigmentinvoicelis';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CommonsrmService } from '../../shared/services/common/commonsrm.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { OperatorModal } from '../../shared/view-models/common/operatormodal';
import { jsPDF } from 'jspdf';
import { RangeService } from 'src/app/modules/masters/range/shared/range.service';
import { RangeFilter } from 'src/app/models/masters/range-filter';
import { RangeResult } from 'src/app/models/masters/range';
import { OperationdocumentFilters } from 'src/app/models/common/operationdocument-filters';
import { Operationdocument } from 'src/app/models/masters/operationdocument';
import { OperationMastersService } from 'src/app/modules/masters/operation-master/shared/operationmasters.service';
import { TypedateFilter } from 'src/app/models/common/typedate-filter';
import { Typedate } from 'src/app/models/common/typedate';
import { CommonMastersService } from 'src/app/modules/masters/shared/services/common-masters.service';

@Component({
  selector: 'app-consingment-invoice-filter',
  templateUrl: './consingment-invoice-filter.component.html',
  styleUrls: ['./consingment-invoice-filter.component.scss'],
  providers: [DatePipe]
})
export class ConsingmentInvoiceFilterComponent implements OnInit {

  @Input() expanded: boolean = false;
  @Input("filters") filters:ConsingmentInvoiceFilter ;
  @Input("loading") loading: boolean = false;
  @Input("supplierstring") supplierstring: string = "";
  @Input("fClist") fClist: ConsingmentInvoiceList[];
  @Input("_selectedColumns") _selectedColumns: any[];
  @Output("onSearch") onSearch = new EventEmitter<ConsingmentInvoiceFilter>();
  @Output() changes = new EventEmitter();
  @ViewChild('focus') focusButton: any;
  
  iDate: Date = new Date();
  fDate: Date = new Date();
  nDate: Date = new Date();
  numFCselected: any[] = [];
  numFCwritte: string[] = [];
  statusselected: any[] = [];
  typeFcSelected: any[] = [];
  typeDateList: SelectItem[];
  typedates: SelectItem[];
  typeFclist: SelectItem[];
  statusFCList: SelectItem[];
  rangelist:SelectItem[];
  numbersFcList: SelectItem[];
  coinsList: SelectItem[];
  waytopayList: SelectItem[];
  SupplierDialogVisible = false;
  indPartial = false;
  operatorDialogVisible = false;
  operatorAuthDialogVisible = false;
  operatormodal: OperatorModal = new OperatorModal();
  operatorAuthmodal: OperatorModal = new OperatorModal();
  userType:number=1;//interno
  selectedSuppliers: any[] = [];
  items: MenuItem[] = [
    {
      label: 'Excel', icon: 'pi pi-file-excel', command: () => {
        this.exportExcel();
      }
    },
    {
      label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
        this.exportPdf();
      }
    }
  ];


  constructor(public _coinService: CoinsService,private _commonmasterservice: CommonMastersService, 
    private _Authservice: AuthService, public datepipe: DatePipe,  
    private _commonservicempc: CommonService,  private _operationMaster: OperationMastersService,
    private messageService: MessageService,private _paymentMethodService: PaymentMethodService, 
     private _commonService: CommonsrmService,public _rangeservice:RangeService) { }

  ngOnInit(): void {
    this.searchCoins()
    this.GetWayTopay()
    this.GetTypeDocumentFC();
    this.onLoadStatusList()
    this.Getrange()
    this.searchTypesDate()
  }
 

   //Obtener todas las monedas
   searchCoins() {
    var filter = new CoinFilter();
    filter.id = -1;
    this._coinService.getCoinsList(filter).subscribe((data: Coins[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.coinsList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de monedas" });
    });
  }

  GetTypeDocumentFC() {
    var filter = new OperationdocumentFilters();
    filter.id = -1;
    filter.idTypeDocumentOperation = 21;//FACTURA
    this._operationMaster.getDocumentsOperations(filter).subscribe((data: Operationdocument[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.typeFclist = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de distribución" });
    });
  }
  //Get waytopay 
  GetWayTopay() {
    let filters = new PaymentMethodFilters();
    filters.id = -1;
    this._paymentMethodService.getPaymentMethods(filters).subscribe((data: PaymentMethodResult[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.waytopayList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las formas de pago" });
    });
  }
  onToggleSupplier(visible: boolean) {
    this.SupplierDialogVisible = visible;
  }
  onBlurMethod(event: any) {
    let dates = new Date(event);
    if (dates > this.fDate) {
      this.fDate = dates;
      this.filters.finalDate = this.datepipe.transform(this.fDate, "yyyyMMdd");
      this.changes.emit(this.filters.finalDate);
    }
    
  }
  Getrange() {
    let filters = new RangeFilter();
    filters.idRange = -1;
    filters.idTypeRange = -1;
    this._rangeservice.getRangeFilter(filters).subscribe((data: RangeResult[]) => {
      this.rangelist = data.map((item) => ({
        label: item.description,
        value: item.idRange
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las formas de pago" });
    });
  }

  onLoadStatusList() {
    var filter: StatusFilter = new StatusFilter();
    filter.IdStatusType = 22;//factura consignacion
    this._commonservicempc.getStatus(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.statusFCList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }
  searchTypesDate() {
    var filter = new TypedateFilter();
    filter.id = -1;
    filter.idTypeDocumentOperational = 187;
    this._commonmasterservice.getTypesDate(filter).subscribe((data: Typedate[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.typedates = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las sucursales" });
    });
  }

  onToggleOperator(visible: boolean, operatorAuthDialogVisible) {
    this.operatorDialogVisible = !operatorAuthDialogVisible ? visible : false;
    this.operatorAuthDialogVisible = operatorAuthDialogVisible ? visible : false;
  }

  onSubmitOperator(data) {
    if (this.operatorAuthDialogVisible) {
        this.operatorAuthmodal.idOpetator = data.operator.id;
        this.operatorAuthmodal.namesoperators = data.operator.name;
    } else {
      this.operatormodal.idOpetator = data.operator.id;
      this.operatormodal.namesoperators = data.operator.name;
      this.filters.receptionOperator=data.operator.id;
    }
  }
  admittedCharacters(event){
    var character;
    character = event.charCode;
    return((character > 64 && character < 91) 
    || (character > 96 && character < 123) 
    || character == 45 || (character >= 48 && character <= 57)); 
  }
  ValidateChecksstatus() {
    // this.filters.idStatus = "";
    // if (this.statusselected.length > 0) {
    //   for (let i = 0; i < this.statusselected.length; i++) {
    //     this.filters.idStatus = this.filters.idStatus == "" ? this.statusselected[i] : this.filters.idStatus + "," + this.statusselected[i];
    //   }
    // }
  }

  ValidateChecksTypesFC() {
    // this.filters.typeFC = "";
    // if (this.typeFcSelected.length > 0) {
    //   for (let i = 0; i < this.typeFcSelected.length; i++) {
    //     this.filters.typeFC = this.filters.typeFC == "" ? this.typeFcSelected[i] : this.filters.typeFC + "," + this.typeFcSelected[i];
    //   }
    // }
    // this.focusButton.nativeElement.focus();
  }
  clearFilters() {
    this.filters.id=-1;
    this.filters.idCoin = -1;
    this.filters.idStatus = -1;
    this.filters.idWayToPay = -1;
    this.filters.numberFC = "";
    this.filters.typeFC = -1;
    this.filters.idSuppliers = -1;
    this.filters.receptionOperator=-1;
    this.filters.idRange=-1
    this.numFCselected = [];
    this.statusselected = [];
    this.typeFcSelected = [];
    this.filters.idTypeDate = -1;
    this.supplierstring = "";
    this.iDate = new Date();
    this.fDate = new Date();
    this.numFCwritte = [];
    this.operatormodal.idOpetator = -1;
    this.operatormodal.namesoperators = "";
  }


  exportPdf() {
    if (this.fClist.length > 0) {
      var cols: any[] = [];
      var cols1: any[] = ['Número de factura'];
      this._selectedColumns.forEach(col => {
        if (col.field != "numberFC" && col.field != 'numberDocument' && col.field !='edit') {
          cols1.push(col.header);
        }
      })
      cols.push(cols1);
      var list = this.fClist.map(lstItem => {
        var itm: Array<string> = [];
        itm.push(lstItem.numberFC);
        this._selectedColumns.forEach(col => {
          if (col.field == "area") {
            itm.push(lstItem.area)
          }
          if (col.field == "numberInvoice") {
            itm.push(lstItem.numberInvoice)
          }
          // if (col.field == "numberDocument") {
          //   itm.push(lstItem.numberDocument)
          // }

          if (col.field == "coin") {
            itm.push(lstItem.coin)
          }
          if (col.field == "status") {
            itm.push(lstItem.status)
          }

          if (col.field == "wayToPay") {
            itm.push(lstItem.wayToPay)
          }

          if (col.field == "typeFC") {
            itm.push(lstItem.typeFC)//lstItem.plannedby)
          }
          if (col.field == "exchangeRate") {
            itm.push(lstItem.exchangeRate)
          }
          if (col.field == "cantItems") {
            itm.push(lstItem.cantItems.toString())
          }

          if (col.field == "responsibleOperator") {
            itm.push(lstItem.responsibleOperator)
          }
          if (col.field == "authorizeOperator") {
            itm.push(lstItem.authorizeOperator)
          }

          if (col.field == "createdby") {
            itm.push(lstItem.createdby)
          }
          if (col.field == "amountInvoice") {
            itm.push(lstItem.amountInvoice.toString())
          }
          if (col.field == "amountBase") {
            itm.push(lstItem.amountBase.toString())
          }
          if (col.field == "amountInvoiceConvertion") {
            itm.push(lstItem.amountInvoiceConvertion.toString())
          }
          if (col.field == "amountConvertion") {
            itm.push(lstItem.amountConvertion.toString())
          }    
          if (col.field == "dateCreate") {
            itm.push(this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy"))
          }
          if (col.field == "startDate") {
            var dateupdate= lstItem.startDate == undefined ? "" : this.datepipe.transform(lstItem.startDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(lstItem.startDate, "dd/MM/yyyy");
            itm.push(dateupdate)
          }
          if (col.field == "finalizeDate") {
            var dateupdate= lstItem.finalizeDate == undefined ? "" : this.datepipe.transform(lstItem.finalizeDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(lstItem.finalizeDate, "dd/MM/yyyy");
            itm.push(dateupdate)
          }
          if (col.field == "authorizeDate") {
            var dateupdate= lstItem.authorizeDate == undefined ? "" : this.datepipe.transform(lstItem.authorizeDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(lstItem.authorizeDate, "dd/MM/yyyy");
            itm.push(dateupdate)
          }
        });
        return itm;
      })
      var doc = new jsPDF('p', 'pt');
      var dateday = new Date();

      var namedocument = "Factura consignación " + this.datepipe.transform(dateday, "dd/MM/yyyy") + ".pdf";;
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
    if (this.fClist.length > 0) {
      var list = this.fClist.map(lstItem => {
        var itm = <any>{};
        // itm.numOC = lstItem.numOC;
        this._selectedColumns.forEach(col => {

          if (col.field == "numberFC") {
            itm['Número de Factura'] = lstItem.numberFC;
          }
          if (col.field == "area") {
            itm['Área'] = lstItem.area;
          }
          if (col.field == "numberInvoice") {
            itm['Factura'] = lstItem.numberInvoice;
          }
          if (col.field == "numberDocument") {
            itm['Número de documento'] = lstItem.numberDocument;
          }
          if (col.field == "coin") {
            itm['Móneda de pago'] = lstItem.coin;
          }
          if (col.field == "status") {
            itm['Estatus'] = lstItem.status;
          }
          if (col.field == "wayToPay") {
            itm['Forma de pago'] = lstItem.wayToPay;
          }
          if (col.field == "typeFC") {
            itm['Tipo de FC'] = lstItem.typeFC;
          }
          if (col.field == "exchangeRate") {
            itm['Tasa de cambio'] =lstItem.exchangeRate;
          }
          if (col.field == "cantItems") {
            itm["Cantidad de ítems"] = lstItem.cantItems;
          }
          if (col.field == "responsibleOperator") {
            itm['Responsable'] = lstItem.responsibleOperator;
          }

          if (col.field == "authorizeOperator") {
            itm['Autorizado por'] = lstItem.authorizeOperator;
          }

          if (col.field == "createdby") {
            itm['Creado por'] = lstItem.createdby;
          }

          if (col.field == "amountInvoice") {
            itm['Monto factura base'] = lstItem.amountInvoice;
          }
          if (col.field == "amountBase") {
            itm['Monto total base'] = lstItem.amountBase;
          }
          if (col.field == "amountInvoiceConvertion") {
            itm['Monto factura conversión'] = lstItem.amountInvoiceConvertion;
          }
          if (col.field == "amountConvertion") {
            itm['Monto total conversión'] = lstItem.amountConvertion;
          }
          if (col.field == "dateCreate") {
          
            itm['Fecha de creación'] =   lstItem.dateCreate == undefined ? "" : this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy"); //this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy")=="";
            // this.dateday=this.datepipe.transform(lstItem.dateCreate, "dd/MM/yyyy");
          }
          if (col.field == "startDate") {
            itm['Fecha de inicio'] =   lstItem.startDate == undefined ? "" : this.datepipe.transform(lstItem.startDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(lstItem.startDate, "dd/MM/yyyy"); //this.datepipe.transform(lstItem.dateUpdate, "dd/MM/yyyy");
          }
          if (col.field == "finalizeDate") {
            itm['Fecha de finalización'] =   lstItem.finalizeDate == undefined ? "" : this.datepipe.transform(lstItem.finalizeDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(lstItem.finalizeDate, "dd/MM/yyyy"); //this.datepipe.transform(lstItem.dateUpdate, "dd/MM/yyyy");
          }
          if (col.field == "authorizeDate") {
            itm['Fecha de autorización'] =   lstItem.authorizeDate == undefined ? "" : this.datepipe.transform(lstItem.authorizeDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(lstItem.authorizeDate, "dd/MM/yyyy"); //this.datepipe.transform(lstItem.dateUpdate, "dd/MM/yyyy");
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

  CallFocus(){
    this.focusButton.nativeElement.focus();
  }
  ValidatenumberfC() {
    this.filters.numberFC = "";
    if (this.numFCwritte.length > 0) {
      for (let i = 0; i < this.numFCwritte.length; i++) {
        this.filters.numberFC = this.filters.numberFC == "" ? this.numFCwritte[i] : this.filters.numberFC + "," + this.numFCwritte[i];
      }
    }
  }

  search() {
    this.ValidatenumberfC();
    this.filters.idbranchOffice=this._Authservice.currentOffice;
    this.filters.id=-1;
    this.filters.idTypeDate= this.filters.idTypeDate== null ? -1 : this.filters.idTypeDate
    this.filters.idWayToPay= this.filters.idWayToPay ==null ? -1 : this.filters.idWayToPay;
    this.filters.idCoin = this.filters.idCoin== null ? -1 : this.filters.idCoin;
    this.filters.idRange=this.filters.idRange== null ? -1 : this.filters.idRange;
    if (this.filters.idTypeDate != -1) {
      this.filters.initialDate = this.datepipe.transform(this.iDate, "yyyyMMdd");
      this.filters.finalDate = this.datepipe.transform(this.fDate, "yyyyMMdd");
    }

    this.onSearch.emit(this.filters);
  }
  getSuppliersId(suppliersSelected: any) {
    this.supplierstring = '';
    this.selectedSuppliers.push(suppliersSelected);
    this.supplierstring = suppliersSelected ? suppliersSelected?.socialReason : '';
    this.filters.idSuppliers =  this.selectedSuppliers[0]?.id ?? -1;
  }
}
