import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { getDate } from 'date-fns';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DetailReception } from 'src/app/models/srm/detailreception';
import { Lot } from 'src/app/models/srm/lot';
import { Produclot } from 'src/app/models/srm/produclot';
import { PurchaseReception } from 'src/app/models/srm/purchasereception';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { MerchandiseReceptionService } from '../../../../services/merchandise-reception/merchandise-reception.service';

@Component({
  selector: 'app-lot',
  templateUrl: './lot.component.html',
  styleUrls: ['./lot.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class LotComponent implements OnInit {
  lotProduct: Lot = new Lot();
  lotsList: Lot[] = [];
  //lotsProducts: Produclot = new Produclot();

  today: Date = new Date();
  _validations: Validations = new Validations();
  submitted: boolean;
  valid: RegExp = /^[a-zA-Z0-9Á-ú\sñÑ._-]*$/;
  @Input("showDialog") showDialog: boolean = false;
  @Input() DetailProduct: DetailReception = new DetailReception();
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() onToggle = new EventEmitter<boolean>();
  @Output("_sendLots") _sendLots = new EventEmitter<{ selectedLots: Lot[] }>();
  load: boolean = false;
  selectedLots: Lot[] = [];
  cont: number = 0;
  @ViewChild('dt', { static: false }) dt: any

  constructor(private _authservice: AuthService,
    private messageService: MessageService,
    private svcReception: MerchandiseReceptionService,
    public datepipe: DatePipe,
    public decimalPipe: DecimalPipe) { }

  displayedColumns: ColumnD<Lot>[] =
    [
      { template: (data) => { return data.id; }, header: 'Código', field: 'id', display: 'none' },
      { template: (data) => { return data.numberLot; }, header: 'Número de lote', field: 'numberLot', display: 'table-cell' },
      { template: (data) => { return data.cantPackaging; }, header: 'Cantidad de empaques', field: 'cantPackaging', display: 'table-cell' },
      { template: (data) => { return data.unitperPackaging; }, header: 'Unid x emp', field: 'unitperPackaging', display: 'table-cell' },
      { template: (data) => { return data.totalUnidad; }, header: 'Total', field: 'totalUnidad', display: 'table-cell' },
      { template: (data) => { return data.expiredDate == undefined ? "" : this.datepipe.transform(data.expiredDate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.expiredDate, "dd/MM/yyyy"); }, field: 'expiredDate', header: 'Fecha de vecimiento', display: 'table-cell' }
    ];

  ngOnInit(): void {
  }

  onShow() {
    this.selectedLots=[];
    this.emitVisible();
    this.lotProduct.expiredDate = new Date();

  }

  AddLot() {
    this.load=true;
    debugger;
    let save:boolean=false;
    let date: Date = new Date();
    let date2:Date = new Date();
    if (this.lotProduct.cantPackaging > 0 && this.lotProduct.numberLot.trim())  {
      if(this.lotProduct.expiredDate.getTime() == date.getTime()){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La fecha de vencimiento al menos debe tener un plazo de 7 días." });
        
      }else{
        date.setDate(date.getDate()+7);
        date2=this.lotProduct.expiredDate;
        date2.setMonth(date2.getMonth()+1);
        if(this.lotProduct.expiredDate>=date && this.lotProduct.expiredDate<=date2){
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "La fecha de vencimiento es menor a un mes." });
          save=true;
        }else{
          //date.setDate(date.getDate()+7);
          if(this.lotProduct.expiredDate<date){
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: "La fecha de vencimiento al menos debe tener un plazo de 7 días." });
          }
        }
      }
if (save){
  this.lotProduct.idcont = this.cont + 1;
  this.lotProduct.totalUnidad = (this.lotProduct.cantPackaging * this.DetailProduct.detail.unitsPerPackaging);
  this.lotProduct.unitperPackaging = this.DetailProduct.detail.unitsPerPackaging;
  this.lotProduct.idPacking= this.DetailProduct.detail.packingId;
  this.lotProduct.idProduct= this.DetailProduct.productId
  //this.lotProduct.idProduct=
  this.lotsList.push(this.lotProduct);
  this.dt.reset()
  this.lotsList = this.lotsList;
  this.lotProduct = new Lot();
}
     
      this.load=false;
    }
  }
  onRemove(id) {
    this.lotsList = this.lotsList.filter(x => x != id);
    this.selectedLots= this.selectedLots.filter(x => x != id);
  }
  hideDialog() {
    this.cont = 0;
    this.lotProduct = new Lot();
    this.emitVisible();
    this.lotsList = [];
    this.selectedLots=[];
  }

  save() {
    this.submitted = true;
    if (this.selectedLots.length > 0) {
      var sumempaque =0;
      var sumempaque = this.selectedLots.reduce((sum, current) => sum + current.cantPackaging, 0);
      if (sumempaque > this.DetailProduct.detail.receivedPackaging || sumempaque < this.DetailProduct.detail.receivedPackaging ) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cantidad de empaques x lote debe ser igual a la recibida." });
      }
      else{
      this._sendLots.emit({
        selectedLots: this.selectedLots
      });
      this.showDialog=false;
      this.hideDialog();
     }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar al menos un lote" });
      this.submitted=false;
    }
  }

  emitVisible() {
    this.onToggle.emit(this.showDialog);
  }

  changEditdate(event) {
    debugger;
    console.log("chanedidate");
    console.log(this.lotProduct.expiredDate);
    var date1 = new Date(this.today).getTime();
    var date2 = new Date(this.lotProduct.expiredDate).getTime();
    
    var diff = this.lotProduct.expiredDate.getTime() - this.today.getTime()
    var time=Math.round(Math.abs((diff)));
    var daysdif = Math.round(Math.abs((diff) / (1000 * 3600 * 24)));
    this.lotProduct.cantDays = daysdif;

  }

}
