import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SegmentType } from '../../shared/models/masters/segment-type';
import { SelectItem } from 'primeng/api';
import { AccountingItemSegment } from '../../shared/models/masters/accounting-item-segment';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';


@Component({
  selector: 'app-companies-account-plan-panel',
  templateUrl: './companies-account-plan-panel.component.html',
  styleUrls: ['./companies-account-plan-panel.component.scss']
})
export class CompaniesAccountPlanPanelComponent implements OnInit {

  @Input() accountPlanshowDialog: boolean;
  constructor(private messageService: MessageService) { }

  @Input() _dataSegment: AccountingItemSegment;
  @Input() showDialog: boolean;
  @Input() segmentList: AccountingItemSegment[];
  @Input() listSegmentType: SegmentType[];
  @Input() loading: boolean = false;
  @Input() maxOrdinal: number;

  @Output() changeDataSegment: EventEmitter<AccountingItemSegment> = new EventEmitter<AccountingItemSegment>();
  @Output() backUnChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  _validations:Validations = new Validations();
  _segmentTypeDropdown: SelectItem[] = [];
  checked: boolean =true;
  description1: string = "";
  description2: string = "";
  identifier1: string = "";
  identifier2: string = "";
  ordinal: string = "";
  submitted: boolean = false;
  confirmation: boolean = false;
  message = "";

  ngOnInit(): void {
    this.onLoadSegmentType();
    this.generateValues();
    // this.ordenarLista();
  }

  onLoadSegmentType(){
    this._segmentTypeDropdown = this.listSegmentType.sort((a, b) => a.segment.localeCompare(b.segment)).map<SelectItem>((item)=>({
      label: item.segment,    //carga el SelectItem con las posiciones ordenadas de menor a mayor
      value: item.idSegmentType
    }));
  }

  generateValues(){   //agrega los valores por defecto o pertenecientes al segmento cuando se muestra el formulario
    var cont = 1;
    if(!this._dataSegment.active){ //si el valor predeterminado es verdadero
      this.description2  = this._dataSegment.description;   //completa los campos descripción e identificador editables
      this.identifier2 = this._dataSegment.identifier;
    }
    this.checked = this._dataSegment.active;
    if(this._dataSegment.idAccountingItemDetail != -1){    //si es una edición
      this.listSegmentType.forEach(element => {
        if(element.idSegmentType == this._dataSegment.idSegmentType){
          this.description1 = element.segment;
          this.identifier1 = element.identifier;
        }
      });
      this.ordinal = this._dataSegment.ordinal.toString();
    }else{
      this.segmentList.forEach(element => { //calcula el ordinal para el próximo segmento a crear
        if(element.ordinal == cont){
          cont++;
        }
      });
      this.ordinal = cont.toString(); //agrega el ordinal recomendado al formulario
    }
  }

  updateType(){ //actualiza los valores del tipo de segmento cuando se cambia el valor del dropdow Tipo
    this.listSegmentType.forEach(element => {
      if(element.idSegmentType == this._dataSegment.idSegmentType){
        this.description1 = element.segment;
        this.identifier1 = element.identifier;
      }
    })
  }

  submit(check: boolean){
    debugger;
    var error = false;
    if(check){  //si es predeterminado
      if(this.description1 == "" || this.identifier1 == ""){ //si falta algún valor requerido
        //this.messageService.add({severity: 'warn', summary: 'Atención', detail: "Debe completar los campos requeridos" });
        error = true;
      }
    }else{  //si es personalizado
      if(this.description2 == "" || this.identifier2 == ""){ //si falta algún valor requerido
        //this.messageService.add({severity: 'warn', summary: 'Atención', detail: "Debe completar los campos requeridos" });
        error = true;
      }else{      //sino, si los campos identificador y descripción fuenron completados con espacios en blanco
        this.description2 = this.description2.trim();
        this.identifier2 = this.identifier2.trim();
        if(!this.checked && (this.description2 == "" || this.identifier2 == "")){
          error = true;
        }
      }
    }
    
    if(this.ordinal == ""){
      this.message = ""
      error = true;
    }else{
      if(isNaN(parseInt(this.ordinal))){  //si el ordinal es inválido
        //this.messageService.add({severity: 'warn', summary: 'Atención', detail: "El campo ordinal debe ser un número entero positivo" });
        this.message = "El ordinal debe ser un número."
        error = true;
      }else if(parseInt(this.ordinal) <= 0){
        this.message = "El ordinal debe ser mayor a cero."
        error = true;
      }else if(parseInt(this.ordinal) > this.maxOrdinal){
        this.message = "El ordinal debe ser menor al número de segmentos establecido."
        error = true;
      }
    }
    
    if(error){
      this.submitted = true;
    }else{
      this.message = "";
      var segmentRepeat = 0;
      var ordinalRepeat = 0;
      this.segmentList.forEach(element => { //busca si existe otro segmento con el tipo que se asignó en el formulario
        if(element.idSegmentType == this._dataSegment.idSegmentType && element.idAccountingItemDetail != this._dataSegment.idAccountingItemDetail){
          segmentRepeat++;
        }
        if(element.identifier == this.identifier2.toUpperCase() && element.idAccountingItemDetail != this._dataSegment.idAccountingItemDetail){
          ordinalRepeat++;
        }
      });
      if (segmentRepeat > 0) {  //si hay más de un segmento con el mismo tipo
        this.messageService.add({severity: 'error', summary: 'Error', detail: "Existe un registro con el mismo tipo de segmento asociado" });
      } else {
        if(ordinalRepeat > 0){
        this.messageService.add({severity: 'error', summary: 'Error', detail: "Existe un registro con el mismo identificador asociado" });
        }else{
          if(check){  //si es predeterminado
            this._dataSegment.description = this.description1;
            this._dataSegment.identifier = this.identifier1;
          }else{  //si es personalizado
            this._dataSegment.description = this.description2;
            this._dataSegment.identifier = this.identifier2.toUpperCase();
          }
          this._dataSegment.ordinal = parseInt(this.ordinal);
          this._dataSegment.active = this.checked;
          this.changeDataSegment.emit(this._dataSegment); //se pasa el control al componente padre
        }
      }
    }
          
  }
      
  outForm(){  //se pasa el control al componente padre, indicando que no hubieron cambios (crear o editar)
    this.backUnChanged.emit(false); 
  }
      
}

 

