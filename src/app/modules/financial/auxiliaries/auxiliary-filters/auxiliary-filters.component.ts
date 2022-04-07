
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AuxiliaryFilter } from 'src/app/models/financial/AuxiliaryFilter';
import { Auxiliary } from 'src/app/models/financial/auxiliary';
import { AuxiliaryService } from '../../auxiliaries/shared/services/auxiliary.service';
import { Validations } from 'src/app/modules/financial/shared/Utils/Validations/Validations'
import { isThisQuarter } from 'date-fns';

@Component({
  selector: 'app-auxiliary-filters',
  templateUrl: './auxiliary-filters.component.html',
  styleUrls: ['./auxiliary-filters.component.scss']
})
export class AuxiliaryFiltersComponent implements OnInit {
  noneSpecialCharacters:RegExp =/^[a-zA-Z-0-9-äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/
  auxiliariesActive = null;
  auxiliariesName=String;
  auxiliariesCodigo:number;
  @Input() expanded = false;
  @Input() loading = false;
  @Input() filters: AuxiliaryFilter;
  @Output() onSearch = new EventEmitter<AuxiliaryFilter>();
  _validations: Validations = new Validations();
  status: SelectItem[] = [
    {label: 'Todos', value: 0},
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 2}
   
  ];
  constructor(private auxiliaryService: AuxiliaryService, private messageService: MessageService) { }

  ngOnInit(): void {
   this.clearFilters();
  }
  search() {

    this.filters.activo = this.auxiliariesActive ? this.auxiliariesActive === 2 ? 0 : 1 : -1;
    this.filters.auxilliaryName = this.auxiliariesName ? this.auxiliariesName.toString() : ''
    this.filters.id = this.auxiliariesCodigo ? this.auxiliariesCodigo : -1
    this.onSearch.emit(this.filters);
    
  }

  clearFilters() {
    this.auxiliariesActive = null;
    this.auxiliariesCodigo = null;
    this.auxiliariesName = null;
   
  }

}
