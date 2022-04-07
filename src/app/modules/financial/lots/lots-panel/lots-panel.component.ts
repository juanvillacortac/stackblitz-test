import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { LotsService } from '../shared/services/lots.service';

import { Lots } from '../../../../models/financial/lots';
import { LotsFilter } from '../../../../models/financial/lotsFilter';

import {CheckboxModule} from 'primeng/checkbox';


import { Module } from '../../../../models/financial/Module';
@Component({
  selector: 'app-lots-panel',
  templateUrl: './lots-panel.component.html',
  styleUrls: ['./lots-panel.component.scss']
})
export class LotsPanelComponent implements OnInit {
  noneSpecialCharacters:RegExp =/^[a-zA-Z0-9äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/
  @Input("showDialog") showDialog: boolean = true;
  @Input("_data") _data: Lots =  new Lots();
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("onUpdate") onUpdate = new EventEmitter();
  @Output() filterChange = new EventEmitter<LotsFilter>();
  @Input("filters") filters: LotsFilter;
  @Input('module') module = 0;
  moduleList: SelectItem[];
  _validations: Validations = new Validations();
  selectedValues: boolean = false;
  value: boolean;
  submitted = false;
  nomString = false;
  statuslist: SelectItem[] = [
    { label: 'Financiero', value: 1 },
    { label: 'Inactivo', value: 2 }
  ];

  saving: boolean;

  constructor(
    private service: LotsService,
    private messageService: MessageService,
  ) { }

  onBlurEvent(event: any) {

    if (event.target.value=="" || event.target.value==" ") {
      this.nomString = true;

    }
    else {
      this.nomString = false;
    }
  }

  getModules(){
    this.service.getModules().subscribe(data => {
      this.moduleList = data.sort((a, b) => a.moduleContent.localeCompare(b.moduleContent)).map((item) => ({
      /*this.moduleList = data.map<SelectItem>((item) => ({​​​​​​​​*/
      label:item.moduleContent,
      value: item.id}));
    }, (error) => {
      console.log(error);
    });


  }

  changeCheckGenAutomatico() {
  if(this.selectedValues){
   this. _data.lotName ="";

  }
}


  ngOnInit(): void {
    this. selectedValues = false;
    this._data =  new Lots();
    this.saving = false;
    this.submitted = false;
    this.getModules();
    // if(this._data.accountingAccountCategoryId<=0)
    //  this._data.active=true

  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this.nomString = false;
    //tomar en cuenta no realizar este tipo de instancia this._data = new LedgerAccountCategory();
    // porque genera error en consola,se debe asignar valor individual.
    // this._data.accountingAccountCategoryId = -1
    // this._data.accountingAccountCategory="";
    // this._data.active = true

  }

  isNan(value: any): boolean {
    if (value != "") {
      if (isNaN(+value))
        return true;
      else
        return false
    }
    else
      return true;
  }
  save(): void {
    if(this.saving == false){

      this.saving = true;
      this.submitted = true;
      debugger
      this.messageService.clear();

     if(this._data.idModule >= 0 &&
      ((this._data.lotName == '' && this.selectedValues == true) ||
       (this._data.lotName != '' && this.selectedValues== false))){

         this.service.saveLots(this._data).subscribe((data) => {

         if (data > 0) {

            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
           this.showDialog = false;
           this.showDialogChange.emit(this.showDialog);
            this.submitted = false;

               this.nomString = false;
               this.filterChange.emit(this.filters);
             this.onUpdate.emit();
           } else if (data == -1) {

              this.messageService.add({ severity: 'error', summary: 'Error', detail: "El número de lote ya se encuentra registrado." });
               this.saving = false;
          }
         else if (data == -3) {
          this.saving = false;
             this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
            }
           else {
            this.saving = false;
             this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
              }
            },
             () => {
              this.saving = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
           });
       }
       else{
        this.saving = false;

       }



    }
  }

  changeStatus(event) {
    if (event.target.checked) {
      //this.enabledLote = true;
    } else {
      //his.enabledLote = false;
    }
  }

}

