import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InsertType } from 'src/app/models/masters-mpc/insert-type'
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { InsertTypeFilter } from '../../shared/filters/insert-type-filter';
import { InsertTypeService } from  '../../shared/services/InsertTypeService/insert-type.service';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'insert-type-dialog',
  templateUrl: './insert-type-dialog.component.html',
  styleUrls: ['./insert-type-dialog.component.scss']
})
export class InsertTypeDialogComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_insertType") _insertType: InsertType;
  @Input("filters") filters: InsertTypeFilter;
  @Input() _insertTypeId: InsertTypeFilter;
  status: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  submitted: boolean;
  refreshclassification: InsertTypeFilter;
  _initStatus: boolean = true;
  _validations: Validations = new Validations();

  @Output() showDialogChange = new EventEmitter<boolean>();

  constructor(private _insertTypeservice: InsertTypeService, private messageService: MessageService, private confirmationService: ConfirmationService) { }
  //private readonly USER_STATE = '_USER_STATE';
  ngOnInit(): void {
    if(this._insertType.id == -1)
         this._insertType.active = true;
    else
      this._initStatus = this._insertType.active;
    this.onLoadinsertType();
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._insertType = new InsertType();
    this._insertType.active = true;
    this._insertTypeId = new InsertTypeFilter();
  }

  saveinsertType(): void {
    this.submitted = true;
    if (this._insertType.name.trim()) {
      this._insertType.id == 0 ? -1 : this._insertType.id;
      this._insertType.name = this._insertType.name.trim();
       // this._insertType.name = this._insertType.name.charAt(0).toLocaleUpperCase() + this._insertType.name.substr(1).toLowerCase();
        if(!this._insertType.active && this._initStatus){
            this.confirmationService.confirm({
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
             message: 'Si inactiva el tipo de encarte las configuraciones asociadas\ a esta se dejarán de visualizar, desea proceder con la acción?',
              accept: () => {
                 this.submit();
                },
            });
         }else{
           this.submit();
       }

    }
}
submit(){

  this._insertTypeservice.postInsertType(this._insertType).subscribe((data: number) => {
    if (data > 0) {
      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
      this.showDialog = false;
      this.showDialogChange.emit(this.showDialog);
      this._insertType = new InsertType();
      this._insertType.name = "";
      this._insertType.active = true;
      this._insertTypeservice.getInsertTypebyfilter(this.filters).subscribe((data: InsertType[]) => {
        this._insertTypeservice._insertTypeList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

      });
      this.submitted = false;
    }else if (data == -1){
      this.messageService.add({severity:'error', summary:'Alerta', detail: "El nombre ya se encuentra registrado."});

    }else{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de encarte."});
    }
  }, (error: HttpErrorResponse)=>{
    this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de encarte."});
});

}
  onLoadinsertType() {
    if (this._insertTypeId.id != -1) {
        this._insertTypeservice.getInsertTypebyfilter(this._insertTypeId).subscribe((data: InsertType[]) => {
        this._insertType = data[0];
        this._insertType.active = this._insertType.active == true;
      })
    }
  }

}
