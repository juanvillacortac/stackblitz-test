import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Lot } from 'src/app/models/srm/lot';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { FilterLot } from 'src/app/modules/srm/shared/filters/filter-lot';
import { MerchandiseReceptionService } from 'src/app/modules/srm/shared/services/merchandise-reception/merchandise-reception.service';

@Component({
  selector: 'app-lot-edit',
  templateUrl: './lot-edit.component.html',
  styleUrls: ['./lot-edit.component.scss']
})
export class LotEditComponent implements OnInit {

  @Input() showDialog: boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input() lotedit = new Lot();
  @Output() onRecalculate = new EventEmitter();
  _validations: Validations = new Validations();
  submitted: boolean = false;
  todayDate: Date = new Date();
  load: boolean = false;
  filters = new FilterLot();
  lot: Lot = new Lot();
  constructor(public _service: MerchandiseReceptionService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onShow() {
    this.lot = new Lot();
    this.lot.id = this.lotedit.id;
    this.lot.idReceptionDetail = this.lotedit.idReceptionDetail;
    this.lot.idPacking = this.lotedit.idPacking;
    this.lot.idProduct = this.lotedit.idProduct;
    this.lot.numberLot = this.lotedit.numberLot;
    this.lot.cantPackaging = this.lotedit.cantPackaging;
    this.lot.internalNumberLot = this.lotedit.internalNumberLot;
    this.lot.typePacking = this.lotedit.typePacking;
    this.lot.idTypePacking = this.lotedit.idTypePacking;
    this.lot.totalUnidad = this.lotedit.totalUnidad;
    this.lot.expiredDate = new Date(this.lotedit.expiredDate);
    this.lot.unitperPackaging = this.lotedit.unitperPackaging;
    this.lot.presentacionPackagin = this.lotedit.presentacionPackagin;
    this.changEditdate("");
    console.log(this.lot.expiredDate)
  }
  hideDialog() {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.onRecalculate.emit();
  }

  clear(event) {
    if (event.target.value == "0,0000" || event.target.value == "0,00" || event.target.value == "0") {
      event.target.value = "";
    }
  }
  save() {
    this.load = true
    if (this.lot.numberLot.trim() && this.lot.cantPackaging > 0) {
      this._service.SaveLot(this.lot).subscribe((data: number) => {
        if (data > 0) {

          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
          this.filters.idProduct = this.lot.idProduct//idproducto
          this.filters.idReceptionDetail = this.lot.idReceptionDetail;
          this._service.getLot(this.filters).subscribe((data: Lot[]) => {
            if (data.length > 0)
              this._service._detailLot = data;
            //this.loadingService.stopLoading(); 
          }, (error: HttpErrorResponse) => {
            //this.loadingService.stopLoading(); 
            this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
          });
          this.load = false;
        } else if (data == -1) {
          this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Error al actualizar lote." });
          this.load = true
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Error al actualizar lote." });
          this.load = true
        }
      }, (error: HttpErrorResponse) => {

        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al editar." });
        this.load = true
      });
    }
  }

  changEditdate(event) {
    var date1 = new Date(this.todayDate).getTime();
    var date2 = new Date(this.lot.expiredDate).getTime();

    var diff = this.lot.expiredDate.getTime() - this.todayDate.getTime()
    var daysdif = Math.round(Math.abs((diff) / (1000 * 3600 * 24)));
    this.lot.cantDays = daysdif;

  }

  calculate(value) {
    value = value == "" ? "0" : value;
    value = value.replace(/[.]/gi, "");
    value = value.replace(",", ".");
    if (value != "0")
      this.lot.totalUnidad = parseFloat(value) * this.lot.unitperPackaging;
    else
       this.lot.totalUnidad=0;
  }
}
