import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DescriptionType } from 'src/app/models/masters-mpc/description-type'
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DescriptionTypeFilter } from '../../shared/filters/descriptionType-filter';
import { DescriptionTypeService } from  '../../shared/services/DescriptionType/description-type.service';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'description-dialog',
  templateUrl: './description-dialog.component.html',
  styleUrls: ['./description-dialog.component.scss']
})
export class DescriptionDialogComponent implements OnInit {
  @Input("showDialog") showDialog: boolean = false;
  @Input("_description") _description: DescriptionType;
  @Input("filters") filters: DescriptionTypeFilter;
  @Input("_descriptionId") _descriptionId: DescriptionTypeFilter;
  @Input("activeReg") activeReg: boolean= false;
  status: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  submitted: boolean;
  refreshclassification: DescriptionTypeFilter;

  _validations: Validations = new Validations();

  @Output() showDialogChange = new EventEmitter<boolean>();

  constructor(private _descriptionservice: DescriptionTypeService, private messageService: MessageService, private confirmationService: ConfirmationService) { }
  //private readonly USER_STATE = '_USER_STATE';
  ngOnInit(): void {
    if(this._description.id == 0 || this._description.id == -1)
         this._description.active = true;
    
    this.onLoadDescription();
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._description = new DescriptionType();
    this._description.active = true;
    this._descriptionId = new DescriptionTypeFilter();
  }

  saveDescription(): void {
    this.submitted = true;
    if (this._description.name.trim()) {
      this._description.id == 0 ? -1 : this._description.id;
      this._description.name = this._description.name.trim();
       this._description.name = this._description.name.toLocaleUpperCase();
       //this._description.name = this._description.name.charAt(0).toLocaleUpperCase() + this._description.name.substr(1).toLowerCase();
       
       if(this._description.active || !this.activeReg){
        this.submit();
       }else if(this.activeReg && this._description.active==false){
         this.confirmationService.confirm({
         header: 'Confirmación',
         icon: 'pi pi-exclamation-triangle',
          message: 'Si inactiva el tipo de descripción las configuraciones asociadas\ a esta se dejarán de visualizar, ¿desea proceder con la acción?',
           accept: () => {
              this.submit();
             },
         });
     }
         
    }
}
submit(){
  this._descriptionservice.postDescription(this._description).subscribe((data: number) => {
    if (data > 0) {
      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
      this.showDialog = false;
      this.showDialogChange.emit(this.showDialog);
      this._description = new DescriptionType();
      this._description.name = "";
      this._description.active = true;
      this._descriptionservice.getDescriptionbyfilter(this.filters).subscribe((data: DescriptionType[]) => {
        this._descriptionservice._descriptionList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

      });
      this.submitted = false;
    }else if (data == -1){
      this.messageService.add({severity:'error', summary:'Alerta', detail: "El nombre ya se encuentra registrado."});
   
    }else{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de descripción."});
    }
  }, (error: HttpErrorResponse)=>{
    this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de descripción."});
});
}
onLoadDescription() {
    if (this._descriptionId.id != -1) {
      this._descriptionservice.getDescriptionbyfilter(this._descriptionId).subscribe((data: DescriptionType[]) => {
        this._description = data[0];
        this._description.active = this._description.active == true ? true : false;
      })
    }
  }

}
