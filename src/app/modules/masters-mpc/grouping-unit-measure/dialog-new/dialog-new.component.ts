import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { GroupingunitmeasureFilter } from '../../shared/filters/groupingunitmeasure-filter';
import { GroupingunitmeasureService } from '../../shared/services/GroupingUnitMeasureService/groupingunitmeasure.service';
import { OrderCodes } from '../../shared/Utils/order-codes';
import { Validations } from '../../shared/Utils/Validations/Validations';
import { GroupingUnitMeasure } from '../../shared/view-models/grouping-unit-measure.viewmodel';

@Component({
  selector: 'dialog-new-groupingunitmeasure',
  templateUrl: './dialog-new.component.html',
  styleUrls: ['./dialog-new.component.scss']
})
export class DialogNewComponentGroupingUnitMeasure implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_groupingunitmeasure") _groupingunitmeasure: GroupingUnitMeasure;
  @Input("filters") filters: GroupingunitmeasureFilter;
  status: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  submitted: boolean;
  _initStatus: boolean = true;
  refreshattragrupation: GroupingunitmeasureFilter;

  @Output() showDialogChange = new EventEmitter<boolean>();

  _validations: Validations = new Validations();

  constructor(private _groupingunitmeasureservice: GroupingunitmeasureService,
     private messageService: MessageService,
     private confirmationService:ConfirmationService) { }

  ngOnInit(): void {
    if (this._groupingunitmeasure.id <= -1 || this._groupingunitmeasure.id == undefined) {
      this._groupingunitmeasure.active = true;
    }else{
      this._initStatus = this._groupingunitmeasure.active;
    }

  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._groupingunitmeasure = new GroupingUnitMeasure();
    this._groupingunitmeasure.active = true;
  }

  saveGroupingUnitMeasure(): void {

    this.submitted = true;
    if (this._groupingunitmeasure.name.trim() && 
    this._groupingunitmeasure.name.trim().toLocaleUpperCase() !== this._groupingunitmeasure.abbreviation.trim() && 
    ((!this._groupingunitmeasure.active && this._groupingunitmeasure.activeUnitMeasure == 0) || (this._groupingunitmeasure.active))) {
      if(!this._groupingunitmeasure.active && this._initStatus){
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: 'Si inactiva una agrupación de unidad de medida las configuraciones asociadas\ a esta se dejarán de visualizar, ¿desea proceder con la acción?',
          accept: () => {
            this.save();
          },
        });
      }else{
        this.save();
      }
    }

  }

  save(){
    debugger
    this._groupingunitmeasure.id = this._groupingunitmeasure.id == 0 || this._groupingunitmeasure.id == undefined ? - 1 : this._groupingunitmeasure.id;
    this._groupingunitmeasure.name = this._groupingunitmeasure.name.trim();
    this._groupingunitmeasure.name =this._groupingunitmeasure.name.toLocaleUpperCase();
  //  this._groupingunitmeasure.name = this._groupingunitmeasure.name.charAt(0).toLocaleUpperCase() + this._groupingunitmeasure.name.substr(1).toLowerCase();
    this._groupingunitmeasureservice.postGroupingUnitMeasure(this._groupingunitmeasure).subscribe((data: number) => {
      if (data > 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.showDialog = false;
        this._groupingunitmeasure = new GroupingUnitMeasure();
        this._groupingunitmeasure.active = true;
        this._groupingunitmeasureservice.getGroupingUnitMeasureList(this.filters, OrderCodes.CreatedDate)
        this.submitted = false;
      } else if (data == -1) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado" });
      } else if (data == -2) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada" });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar la agrupación de unidades de medida" });
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar la agrupación de unidades de medida" });
    });
  }

}
