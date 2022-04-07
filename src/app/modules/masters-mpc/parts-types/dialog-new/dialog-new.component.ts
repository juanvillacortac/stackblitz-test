import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Typeofparts } from 'src/app/models/masters-mpc/typeofparts'
import { TypeofpartsService } from '../../shared/services/TypeofPartsService/typeofparts.service';
import { TypeofpartsFilter } from '../../shared/filters/typeofparts-filter';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Validations } from '../../shared/Utils/Validations/Validations';


@Component({
  selector: 'dialog-new-ToP',
  templateUrl: './dialog-new.component.html',
  styleUrls: ['./dialog-new.component.scss']
})
export class DialogNewComponentTypeofParts implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("_typeofparts") _typeofparts : Typeofparts;
  @Input("filters") filters : TypeofpartsFilter;
  @Input("_typeofpartsId") _typeofpartsId : TypeofpartsFilter;
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  submitted: boolean;
  _initStatus: boolean = true;
  refreshtypeofparts : TypeofpartsFilter;
  _validations: Validations = new Validations();

  @Output() showDialogChange = new EventEmitter<boolean>();

  constructor(private _typeofpartsservice: TypeofpartsService, private messageService: MessageService, private confirmationService:ConfirmationService) { }

  ngOnInit(): void {
    if(this._typeofparts.id == 0 || this._typeofparts.id == -1){
      this._typeofparts.active = true;
    }else{
      this._initStatus = this._typeofparts.active;
    }
  }

  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._typeofparts = new Typeofparts();
    this._typeofparts.active = true;
    this._typeofpartsId = new TypeofpartsFilter();
  }

  saveTypeofparts(): void{
    
    this.submitted = true;
    if(this._typeofparts.name.trim()){
      if(!this._typeofparts.active && this._initStatus){
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: 'Si inactiva un tipo de partes de producto las configuraciones asociadas\ a este se dejarán de visualizar, ¿desea proceder con la acción?',
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
    this._typeofparts.id == 0 ? -1 : this._typeofparts.id;
    this._typeofparts.name = this._typeofparts.name.trim();
    this._typeofparts.name = this._typeofparts.name.toLocaleUpperCase();
 //   this._typeofparts.name = this._typeofparts.name.charAt(0).toLocaleUpperCase() + this._typeofparts.name.substr(1).toLowerCase();
    this._typeofpartsservice.postTypeofparts(this._typeofparts).subscribe((data: number) => {
      if(data > 0) {
        this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
        this.showDialog = false;
        this.showDialogChange.emit(this.showDialog);
        this._typeofparts = new Typeofparts();
        this._typeofparts.name = "";
        this._typeofparts.active = true;
        this._typeofpartsservice.getTypeofpartsbyfilter(this.filters).subscribe((data: Typeofparts[]) => {
          this._typeofpartsservice._typeofPartsList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        });
        this.submitted = false;
      }else if(data == -1){
        this.messageService.add({severity:'error', summary:'Alerta', detail: "El nombre ya se encuentra registrado"});
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de partes"});
      }
      //window.location.reload();
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de partes"});
    });
  }
}
