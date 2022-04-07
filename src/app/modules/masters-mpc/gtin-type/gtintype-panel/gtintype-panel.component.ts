import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Gtintype } from 'src/app/models/masters-mpc/gtintype'
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { GtintypeFilter } from '../../shared/filters/gtintype-filter';
import { GtintypeService } from '../../shared/services/GtinType/gtintype.service';
import { Validations } from '../../shared/Utils/Validations/Validations';
import { Gtingrouping } from '../../../../models/masters-mpc/common/gtingrouping';

@Component({
  selector: 'app-gtintype-panel',
  templateUrl: './gtintype-panel.component.html',
  styleUrls: ['./gtintype-panel.component.scss']
})
export class GtintypePanelComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_gtintype") _gtintype: Gtintype;
  @Input("filters") filters: GtintypeFilter;
  submitted: boolean;
  refreshmeaunits: GtintypeFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  status: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  alphanumeric: SelectItem[] = [
    { label: 'Si', value: true },
    { label: 'No', value: false },
  ];
  checkDigit: SelectItem[] = [
    { label: 'Si', value: true },
    { label: 'No', value: false },
  ];
  _gtingrouping: SelectItem[];
  _initStatus: boolean = true;
  _validations: Validations = new Validations();

  constructor(private _gtintypeService: GtintypeService,
     private messageService: MessageService,
     private confirmationService:ConfirmationService) { }

  ngOnInit(): void {

    if (this._gtintype.id == -1) {
      this._gtintype.active = true;
      this._gtintype.gtinGrouping = new Gtingrouping();
      this._gtintype.alphanumeric = undefined;
      this._gtintype.checkDigit = undefined;
    }else{
      this._initStatus = this._gtintype.active;
    }
    this.getGtinGroupingSelect();
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._gtintype = new Gtintype();
    this._gtintype.active = true;
    this._gtintype.gtinGrouping = new Gtingrouping();
  }

  saveGtintype(): void {
    this.submitted = true;
    if (this._gtintype.name.trim() && this._gtintype.name.trim().toLocaleUpperCase() !== this._gtintype.abbreviation.trim() && this._gtintype.digitAmount > 0 && this._gtintype.gtinGrouping.id > 0
    && this._gtintype.alphanumeric != undefined && this._gtintype.checkDigit != undefined) {
      if(!this._gtintype.active && this._initStatus){
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: 'Si inactiva un tipo de GTIN las configuraciones asociadas\ a este se dejarán de visualizar, ¿desea proceder con la acción?',
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
    this._gtintype.id = this._gtintype.id == 0 ? -1 : this._gtintype.id;
    this._gtintype.name = this._gtintype.name.trim();
    this._gtintype.digitAmount = +this._gtintype.digitAmount;
    this._gtintypeService.postGtinType(this._gtintype).subscribe((data: number) => {
      if (data > 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.showDialog = false;
        this.showDialogChange.emit(this.showDialog);
        this._gtintype = new Gtintype();
        this._gtintype.gtinGrouping = new Gtingrouping();
        this._gtintype.active = true;
        this._gtintypeService.getGtinTypebyfilter(this.filters).subscribe((data: Gtintype[]) => {
          this._gtintypeService._gtinTypeList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
          this.submitted = false;
         
        });
        
        this.submitted = false;
      } else if (data == -1) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado" });
      } else if (data == -2) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada" });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el tipo GTIN" });
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el tipo gtin" });
    });
  }


  getGtinGroupingSelect() {
    this._gtintypeService.getGtinGrouping()
      .subscribe((data) => {
        this._gtingrouping = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

}
