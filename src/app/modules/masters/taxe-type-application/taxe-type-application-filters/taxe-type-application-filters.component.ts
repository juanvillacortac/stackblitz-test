import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';
import { TaxeTypeApplicationFilters } from 'src/app/models/masters/taxe-type-application-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';

@Component({
  selector: 'app-taxe-type-application-filters',
  templateUrl: './taxe-type-application-filters.component.html',
  styleUrls: ['./taxe-type-application-filters.component.scss']
})
export class TaxeTypeApplicationFiltersComponent implements OnInit { @Input() expanded : boolean = false;
    @Input("filters") filters : TaxeTypeApplicationFilters;
    @Input("loading") loading : boolean = false;
    @Output("onSearch") onSearch = new EventEmitter<TaxeTypeApplicationFilters>();
    status: SelectItem[] = [
      {label: 'Todos', value: '-1'},
      {label: 'Inactivo', value: '0'},
      {label: 'Activo', value: '1'}
    ];
    _validations: Validations = new Validations();
  
    constructor(
      private _securityService: SecurityService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService) {  
    }
  
    ngOnInit(): void {
      this.filters.active = -1;
    }
  
    search(){
      this.onSearch.emit(this.filters);
    }
  
    clearFilters(){
      this.filters.id=-1;
      this.filters.name="";
      this.filters.active = -1;
    }
}
