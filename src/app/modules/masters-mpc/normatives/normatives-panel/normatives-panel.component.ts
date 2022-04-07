import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Normative } from 'src/app/models/masters-mpc/normative';
import { NormativeFilter } from '../../shared/filters/normative-filter';
import { NormativeService } from '../../shared/services/NormativeService/normative.service';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'app-normatives-panel',
  templateUrl: './normatives-panel.component.html',
  styleUrls: ['./normatives-panel.component.scss']
})
export class NormativesPanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("_normative") _normative : Normative;
  @Input("filters") filters : NormativeFilter;
  @Input("normativeList") normativeList : Normative[] = [];
  @Output() normativeListChange = new EventEmitter<Normative[]>();
    submitted: boolean;
    refreshPOT : NormativeFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  _initStatus: boolean = true;
  _validations: Validations = new Validations();
  
  constructor(private _normativeService: NormativeService, private messageService: MessageService,
    private confirmationService:ConfirmationService) { }

  ngOnInit(): void {
    if(this._normative.id <= 0){
      this._normative.active = true;
    }else{
      this._initStatus = this._normative.active;
    }
  }
  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._normative = new Normative();
    this._normative.active = true;
  }
  saveProductorigintype(): void{
    this.submitted = true;
    var date: Date = new Date();
    if(this._normative.name.trim()){
        if(!this._normative.active && this._initStatus){
          this.confirmationService.confirm({
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            message: 'Si inactiva esta normativa las configuraciones asociadas\ a este se dejarán de visualizar, ¿desea proceder con la acción?',
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
    this._normative.id = this._normative.id == 0 ? -1 : this._normative.id;
    this._normative.name = this._normative.name.trim();
    this._normative.name=this._normative.name.toLocaleUpperCase() ;
    //this._normative.name = this._normative.name.charAt(0).toLocaleUpperCase() + this._normative.name.substr(1).toLowerCase();
    this._normativeService.postNormative(this._normative).subscribe((data: number) => {
      if(data > 0) {
        this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
        this.showDialog = false;
        this.showDialogChange.emit(this.showDialog);
        this._normative = new Normative();
        this._normative.active = true;
        this._normativeService.getNormativesbyfilter(this.filters).subscribe((data: Normative[]) => {
          this.normativeList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
          this.normativeListChange.emit(this.normativeList);
        });
        this.submitted = false;
      }else if(data == -1){
        this.messageService.add({severity:'error', summary:'Error', detail: "El nombre ya se encuentra registrado"});
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la normativa"});
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la normativa"});
    });
  }
}
