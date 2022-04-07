import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { multimediause } from 'src/app/models/masters-mpc/multimediause';
import { MultimediauseService } from '../../shared/services/MultimediaUse/multimediause.service';
import { MultimediaUse } from '../../shared/view-models/multimedia-use.viewmodel'
import { MultimediauseFilter } from '../../shared/filters/multimediause-filter';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'dialog-new-multimediause',
  templateUrl: './dialog-new.component.html',
  styleUrls: ['./dialog-new.component.scss']
})
export class DialogNewComponentMultimediaUse implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_multimediause") _multimediause: MultimediaUse;
  @Input("filters") filters: MultimediauseFilter;
  status: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  submitted: boolean;
  refreshattrmultimedia: MultimediauseFilter;
  _initStatus: boolean = true;
  @Output() showDialogChange = new EventEmitter<boolean>();

  _validations: Validations = new Validations();

  constructor(private _multimediauseservice: MultimediauseService,
     private messageService: MessageService,
     private confirmationService:ConfirmationService) { }

  ngOnInit(): void {
    if (this._multimediause.id <= -1 || this._multimediause.id == undefined) {
      this._multimediause.active = true;
      this._multimediause.maxAmount = 1;
      this._multimediause.color = '#ffffff'
    }else{
      this._initStatus = this._multimediause.active;
    }
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._multimediause = new MultimediaUse();
    this._multimediause.active = true;
  }

  saveMultimediaUse(): void {
    this.submitted = true;
    if (this._multimediause.name.trim() && this._multimediause.color != '' && this._multimediause.color != undefined) {
      if(!this._multimediause.active && this._initStatus){
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: 'Si inactiva un uso multimedia las configuraciones asociadas\ a este se dejarán de visualizar, ¿desea proceder con la acción?',
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
    this._multimediause.id = this._multimediause.id == 0 || this._multimediause.id == undefined ? - 1 : this._multimediause.id;
    this._multimediause.name = this._multimediause.name.trim();
    this._multimediause.maxAmount = +this._multimediause.maxAmount;
    this._multimediause.name =this._multimediause.name.toLocaleUpperCase();
  //  this._multimediause.name = this._multimediause.name.charAt(0).toLocaleUpperCase() + this._multimediause.name.substr(1).toLowerCase();
    this._multimediauseservice.postMultimediaUse(this._multimediause).subscribe((data: number) => {
      if (data > 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.showDialog = false;
        this._multimediause = new MultimediaUse();
        this._multimediause.active = true;
        this._multimediauseservice.getMultimediaUsebyfilter(this.filters).subscribe((data: multimediause[]) => {
          this._multimediauseservice._multimediaUseList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
          this.submitted = false;
         
        });
        
      } else if (data == -1) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado" });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el uso de multimedia" });
      }
      //window.location.reload();
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el uso de multimedia" });
    });
  }

}
