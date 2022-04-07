import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TabPanel } from 'primeng/tabview';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DetailReception } from 'src/app/models/srm/detailreception';
import { Lot } from 'src/app/models/srm/lot';
import { FilterLot } from '../../../../filters/filter-lot';
import { MerchandiseReceptionService } from '../../../../services/merchandise-reception/merchandise-reception.service';

@Component({
  selector: 'app-lot-list',
  templateUrl: './lot-list.component.html',
  styleUrls: ['./lot-list.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class LotListComponent implements OnInit {
  //@Input
  lotProduct: Lot[] = [];
  selectionLot: any;

  @Input() showDialog: boolean = false;
  @Output() onToggle = new EventEmitter<boolean>();
  //@Output() lotproductChange = new  EventEmitter<Lot>();
  @Output("_sendLotsProduct") _sendLotsProduct = new EventEmitter<{ selectedLots: Lot[] }>();
  @Input() ProductLot: DetailReception = new DetailReception();
  iDate: Date = new Date();
  fDate: Date = new Date();
  selectedLots: Lot[] = [];
  loading: boolean = false;
  @ViewChild('dt', { static: false }) dt: any;
  @ViewChild('dtsele', { static: false }) dtsele: any
  @ViewChild('bsearch') bsearch: TabPanel
  activeIndexsu: number = 0;
  tabdefault: boolean = true;
  tabselected: boolean = false;
  lotFilter: FilterLot = new FilterLot();
  lotPackagin: Lot = new Lot();
  load: boolean = false;
  selecteditem: Lot = new Lot();
  lotselected: Lot[] = [];
  sumpackaging: number = 0;
  displayedColumns: ColumnD<Lot>[] =
    [
      { template: (data) => { return data.id; }, header: 'Código', field: 'id', display: 'none' },
      { template: (data) => { return data.internalNumberLot; }, header: 'Número de lote interno', field: 'internalNumberLot', display: 'table-cell' },
      { template: (data) => { return data.numberLot; }, header: 'Número de lote', field: 'numberLot', display: 'table-cell' },
      { template: (data) => { return data.document; }, header: 'Documento', field: 'document', display: 'table-cell' },
      // { template: (data) => { return data.cantPackaging; }, header: 'Cantidad de empaques', field: 'cantPackaging', display: 'table-cell' },
      { template: (data) => { return data.expiredDate == undefined ? "" : this.datepipe.transform(data.expiredDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.expiredDate, "dd/MM/yyyy"); }, field: 'expiredDate', header: 'Fecha de vencimiento', display: 'table-cell' }
      // { template: (data) => { return data.createdDate == undefined ? "" : this.datepipe.transform(data.createdDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.createdDate, "dd/MM/yyyy"); }, field: 'dateCreate', header: 'Fecha de creación', display: 'table-cell' },
      //{template: (data) => { return data.updatedDate == undefined ? "" : this.datepipe.transform(data.updatedDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.updatedDate, "dd/MM/yyyy"); },field: 'dateUpdate', header: 'Fecha de actualización', display: 'table-cell'}
      // { template: (data) => { return data.socialReason; }, header: 'Razón social', field: 'socialReason', display: 'table-cell' },
      // { template: (data) => { return data.country; }, header: 'País', field: 'country', display: 'table-cell' },
      // { template: (data) => { return data.classification; }, header: 'Clasificación', field: 'classification', display: 'table-cell' }
    ];

  displayedColumns2: ColumnD<Lot>[] =
    [
      { template: (data) => { return data.id; }, header: 'Código', field: 'id', display: 'none' },
      { template: (data) => { return data.internalNumberLot; }, header: 'Número de lote interno', field: 'internalNumberLot', display: 'table-cell' },
      { template: (data) => { return data.numberLot; }, header: 'Número de lote', field: 'numberLot', display: 'table-cell' },
      { template: (data) => { return data.document; }, header: 'Documento', field: 'document', display: 'table-cell' },
      { template: (data) => { return data.cantPackaging; }, header: 'Cantidad de empaques', field: 'cantPackaging', display: 'table-cell' },
      { template: (data) => { return data.expiredDate == undefined ? "" : this.datepipe.transform(data.expiredDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.expiredDate, "dd/MM/yyyy"); }, field: 'expiredDate', header: 'Fecha de vencimiento', display: 'table-cell' }
      // { template: (data) => { return data.createdDate == undefined ? "" : this.datepipe.transform(data.createdDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.createdDate, "dd/MM/yyyy"); }, field: 'dateCreate', header: 'Fecha de creación', display: 'table-cell' },
      //{template: (data) => { return data.updatedDate == undefined ? "" : this.datepipe.transform(data.updatedDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.updatedDate, "dd/MM/yyyy"); },field: 'dateUpdate', header: 'Fecha de actualización', display: 'table-cell'}
      // { template: (data) => { return data.socialReason; }, header: 'Razón social', field: 'socialReason', display: 'table-cell' },
      // { template: (data) => { return data.country; }, header: 'País', field: 'country', display: 'table-cell' },
      // { template: (data) => { return data.classification; }, header: 'Clasificación', field: 'classification', display: 'table-cell' }

    ];
  constructor(public datepipe: DatePipe,
    public decimalPipe: DecimalPipe,
    private svcReception: MerchandiseReceptionService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onShow() {
    this.activeIndexsu = 0;
    this.emitVisible();
    this.lotProduct = [];

  }

  onHide() {
    this.showDialog = false;
    this.emitVisible();
    this.selectionLot = [];
    this.activeIndexsu = 0;
    this.lotselected=[];
    if (this.dt != undefined) {
      this.dt.reset();
    }
  }

  search() {
    this.loading = true;
    // this.lotFilter.idCom = this._authservice.currentOffice;
    this.lotFilter.idPacking = this.ProductLot.detail.packingId;
    this.lotFilter.idProduct = this.ProductLot.productId;
    this.lotFilter.expiredDateIni = this.datepipe.transform(this.iDate, "yyyyMMdd");
    this.lotFilter.expiredDateEnd = this.datepipe.transform(this.fDate, "yyyyMMdd");
    this.lotFilter.active = 1;
    this.svcReception.getLotProductxPackagin(this.lotFilter).subscribe((data: Lot[]) => {
      this.lotProduct = data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los lotes' });
    });
  }
  submitLot() {
    if (this.lotselected.filter(x => x.cantPackaging == 0).length == 0) {
      //this.selectedRateSuppliersOnly = this.selectedContact;
      //this.supplierRate.exchangeRate = this.selectionLot.internalNumberLot;
      this.sumpackaging = 0;
      this.sumpackaging = this.lotselected.reduce((sum, current) => sum + current.cantPackaging, 0);
      if (this.sumpackaging > this.ProductLot.detail.receivedPackaging || this.sumpackaging < this.ProductLot.detail.receivedPackaging) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cantidad de empaques x lote debe ser igual a la recibida." });
      }else{
        this._sendLotsProduct.emit({
          selectedLots: this.lotselected
        });
        // this.onAssig.emit();
        //this.showDialog = false;
        this.onHide();
      }
      
    } else {
      this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "La cantidad es requerida." });
    }

  }
  add() {
    if (this.selectionLot.length > 0) {
      this.lotselected = [];
      this.tabselected = true;
      this.tabdefault = false;
      this.activeIndexsu = 1;
      for (let i = 0; i < this.selectionLot.length; i++) {
        var lot = new Lot();
        lot.id = this.selectionLot[i].id;
        lot.idPacking = this.selectionLot[i].idPacking;
        lot.idProduct = this.selectionLot[i].idProduct;
        lot.expiredDate = this.selectionLot[i].expiredDate;
        lot.createdDate = this.selectionLot[i].createdDate;
        lot.document = this.selectionLot[i].document;
        lot.internalNumberLot = this.selectionLot[i].internalNumberLot;
        lot.numberLot = this.selectionLot[i].numberLot;
        lot.unitperPackaging = this.selectionLot[i].unitperPackaging;
        lot.totalUnidad = this.selectionLot[i].totalUnidad;
        lot.cantPackaging = 0;
        lot.presentacionPackagin = this.selectionLot[i].presentacionPackagin;
        this.lotselected.push(lot);

      }
      this.dtsele.reset();
      this.lotselected = this.lotselected;
    }
  }
  clearFilters() {
    this.lotFilter.numberLot = ""
    this.lotFilter.internalNumberLot = ""
    this.lotFilter.expiredDateEnd = "";
    this.lotFilter.expiredDateIni = "";
    this.fDate = new Date();
    this.iDate = new Date();

  }

  emitVisible() {
    this.onToggle.emit(this.showDialog);
    this.clearFilters();
  }

  handleChange(e) {
    var index = e.index;
    if (index == 1) {
    }
    else { }
  }

  onRowSelect(event) {
    this.lotPackagin.internalNumberLot = event.data.internalNumberLot;
    this.lotPackagin.presentacionPackagin = event.data.presentacionPackagin;
  }

  onRowUnselect(event) {

  }

  removeselected(lot) {
    this.lotselected = this.lotselected.filter(x => x.id != lot.id);

  }

  calculate(value){
    value = value == "" ? "0" : value;
    value = value.replace(/[.]/gi,"");
    value = value.replace(",",".");
    if(value!="0"){
      this.sumpackaging = this.lotselected.reduce((sum, current) => sum + current.cantPackaging, 0);
    }
  }
}
