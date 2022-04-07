import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Useofpackaging } from 'src/app/models/masters-mpc/useofpackaging'
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { UseofpackagingFilter } from '../../shared/filters/useofpackaging-filter';
import { UseofpackagingService } from  '../../shared/services/UseofPackaging/useofpackaging.service';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'useofpackaging-dialog',
  templateUrl: './useofpackaging-dialog.component.html',
  styleUrls: ['./useofpackaging-dialog.component.scss']
})
export class UseofpackagingDialogComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_useofpackaging") _useofpackaging: Useofpackaging;
  @Input("filters") filters: UseofpackagingFilter;
  @Input("_useofpackagingId") _useofpackagingId: UseofpackagingFilter;
  @Input("activeReg") activeReg: boolean= false;
  status: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  submitted: boolean; 
  refreshclassification: UseofpackagingFilter;

  _validations: Validations = new Validations();

  @Output() showDialogChange = new EventEmitter<boolean>();

  constructor(private _useofpackagingservice: UseofpackagingService, private messageService: MessageService, private confirmationService: ConfirmationService) { }
  //private readonly USER_STATE = '_USER_STATE';
  ngOnInit(): void {
    if(this._useofpackaging.id == 0 || this._useofpackaging.id == -1)
         this._useofpackaging.active = true;
    
    this.onLoaduseofpackaging();
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._useofpackaging = new Useofpackaging();
    this._useofpackaging.active = true;
    this._useofpackagingId = new UseofpackagingFilter();
  }

  saveuseofpackaging(): void {
    this.submitted=true;
    if (this._useofpackaging.usePackaging.trim()) {
      this._useofpackaging.id == 0 ? -1 : this._useofpackaging.id;
      this._useofpackaging.usePackaging = this._useofpackaging.usePackaging.trim();
      this._useofpackaging.usePackaging = this._useofpackaging.usePackaging.toLocaleUpperCase();
     //   this._useofpackaging.usePackaging = this._useofpackaging.usePackaging.charAt(0).toLocaleUpperCase() + this._useofpackaging.usePackaging.substr(1).toLowerCase();

        if(this._useofpackaging.active || !this.activeReg){
          this.submit();
   }else if(this.activeReg && this._useofpackaging.active==false){
      this.confirmationService.confirm({
       header: 'Confirmación',
       icon: 'pi pi-exclamation-triangle',
        message: 'Si inactiva el uso de empaque las configuraciones asociadas\ a este se dejarán de visualizar, ¿desea proceder con la acción?',
        accept: () => {
           this.submit();
          },
          });
       }
         
    }
}

submit(){
  this._useofpackagingservice.postUseofpackaging(this._useofpackaging).subscribe((data: number) => {
    if (data > 0) {
      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
      this.showDialog = false;
      this.showDialogChange.emit(this.showDialog);
      this._useofpackaging = new Useofpackaging();
      this._useofpackaging.usePackaging = "";
      this._useofpackaging.active = true;
      this._useofpackagingservice.getUseofpackagingbyfilter(this.filters).subscribe((data: Useofpackaging[]) => {
        this._useofpackagingservice._UseofpackagingList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

      });
      this.submitted = false;
    }else if (data == -1){
      this.messageService.add({severity:'error', summary:'Alerta', detail: "El nombre ya se encuentra registrado."});
   
    }else{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el uso de empaque."});
    }
  }, (error: HttpErrorResponse)=>{
    this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el uso de empaque."});
});
}
onLoaduseofpackaging() {
    if (this._useofpackagingId.id != -1) {
      this._useofpackagingservice.getUseofpackagingbyfilter(this._useofpackagingId).subscribe((data: Useofpackaging[]) => {
        this._useofpackaging = data[0];
        this._useofpackaging.active = this._useofpackaging.active == true ? true : false;
        
      })
    }
  }

}
