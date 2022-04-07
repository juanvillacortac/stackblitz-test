import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { GlobalVariablesFilter } from '../../../shared/filters/Concepts/global-variables-filter';
import { TypesVaryingFilter } from '../../../shared/filters/Concepts/types-varying-filter';
import { TypesVarying } from '../../../shared/models/concepts/types-varying';
import { GlobalVariablesService } from '../../../shared/services/concepts/global-variables.service';
import { TypesVaryingsService } from '../../../shared/services/concepts/types-varying.service';

@Component({
  selector: 'app-global-variables-filter',
  templateUrl: './global-variables-filter.component.html',
  styleUrls: ['./global-variables-filter.component.scss']
})
export class GlobalVariablesFilterComponent implements OnInit {

   //Variables Input
   @Input() expanded: boolean = false;
   @Input() filters: GlobalVariablesFilter;
   @Input() loading: boolean = false;
 
   //Variables Output
   @Output() onSearch = new EventEmitter<GlobalVariablesFilter>();
 
   //Variables Locales
   TypesVarying: SelectItem[] = [];
   typesVaryingFilter: TypesVaryingFilter = new TypesVaryingFilter(); 
   typeVarying: {label: string, value: number};

   listVarType = [
    {id: 1, idVaryingGroup: 1, varyingGroup: "", varyingTypes: "Sistema-Proceso", userCreate: "",userUpdate: ""},
    {id: 2, idVaryingGroup: 1, varyingGroup: "", varyingTypes: "Sistema-Valor fijo", userCreate: "",userUpdate: ""},
    {id: 3, idVaryingGroup: 2, varyingGroup: "", varyingTypes: "Global", userCreate: "",userUpdate: ""}
  ]
 
   //Ctor
   constructor(
          public _globalVariableService: GlobalVariablesService,
          public _typesVaryingService: TypesVaryingsService,
          private messageService: MessageService) { }
 
 
   //Angular LifeCycle Methods
   ngOnInit(): void {
    this.filters.id = -1;
    this.filters.idTypeVarying = -1;
    this.loadTypesVarying();
   }
 
   //Custom Methods
   search() {
     this.onSearch.emit(this.filters);
   }
   
   clearFilters() {
    this.filters.idTypeVarying = -1;
    this.filters.description = "";
    this.filters.varying = "";
    this.typeVarying = null;
   }
 
   //Get Data Methods
   loadTypesVarying() {
    this.TypesVarying = this.listVarType.sort((a, b) => a.varyingTypes.localeCompare(b.varyingTypes)).map<SelectItem>((item) => ({
      value: item.id,
      label: item.varyingTypes
    }));
   }

   changeTypeVarying(){
     this.filters.idTypeVarying = this.typeVarying.value;
   }

}
