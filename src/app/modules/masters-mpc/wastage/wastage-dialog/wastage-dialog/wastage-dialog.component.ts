import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Wastage} from '../../../../../models/masters-mpc/wastage'
import { MessageService, SelectItem } from 'primeng/api';
import { WastageFilter } from '../../../shared/filters/wastage-filter';
import { WastageService } from  '../../../shared/services/WastageService/wastage.service';
import { Validations } from '../../../shared/Utils/Validations/Validations';

@Component({
  selector: 'wastage-dialog',
  templateUrl: './wastage-dialog.component.html',
  styleUrls: ['./wastage-dialog.component.scss']
})
export class WastageDialogComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_wastage") _wastage: Wastage;
  @Input("filters") filters: WastageFilter;
  @Input("_wastageId") _wastageId: WastageFilter;
  status: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  submitted: boolean;
  refreshclassification: WastageFilter;

  _validations: Validations = new Validations();

  @Output() showDialogChange = new EventEmitter<boolean>();

  constructor(private _wastageservice: WastageService, private messageService: MessageService) { }
  //private readonly USER_STATE = '_USER_STATE';
  ngOnInit(): void {
    if(this._wastage.id == 0 || this._wastage.id == -1)
       this._wastage.active = true;
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._wastage = new Wastage();
    this._wastage.active = true;
    this._wastageId = new WastageFilter();
  }

  saveWastage(): void {
    this.submitted = true;
    if (this._wastage.name.trim() && this._wastage.name.trim().toLocaleUpperCase() !== this._wastage.abbreviation.trim()  ) {
      this._wastage.id == 0 ? -1 : this._wastage.id;
      this._wastage.name = this._wastage.name.trim();
       this._wastage.name = this._wastage.name.charAt(0).toLocaleUpperCase() + this._wastage.name.substr(1).toLowerCase();
          this._wastageservice.postWastage(this._wastage).subscribe((data: number) => {
            if (data > 0) {
              this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
              this.showDialog = false;
              this.showDialogChange.emit(this.showDialog);
              this._wastage = new Wastage();
              this._wastage.name = "";
              this._wastage.active = true;
              this._wastageservice.getWastagebyfilter(this.filters).subscribe((data: Wastage[]) => {
                this._wastageservice._wastageList = data;

              });
              this.submitted = false;
            }else if (data == -1){
              this.messageService.add({severity:'error', summary:'Alerta', detail: "El tipo de merma ya existe."});
            }else if(data == -2){
              this.messageService.add({severity:'error', summary:'Alerta', detail: "La abreviatura ya existe."});
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de merma."});
            }
          }, (error: HttpErrorResponse)=>{
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de merma."});
        });
    }
}
  onLoadwastage() {
    if (this._wastageId.id != -1) {
      this._wastageservice.getWastagebyfilter(this._wastageId).subscribe((data: Wastage[]) => {
        this._wastage = data[0];
        this._wastage.active = this._wastage.active == true ? true : false;
      })
    }
  }

}
