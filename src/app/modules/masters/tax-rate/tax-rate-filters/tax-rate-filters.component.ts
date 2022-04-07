import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { RateType } from 'src/app/models/masters/rate-type';
import { Tax } from 'src/app/models/masters/tax';
import { TaxFilters } from 'src/app/models/masters/tax-filters';
import { TaxRateFilters } from 'src/app/models/masters/tax-rate-filters';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';
import { TaxeTypeApplicationFilters } from 'src/app/models/masters/taxe-type-application-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { TaxService } from '../../taxes/shared/tax.service';
import { TaxRateService } from '../shared/tax-rate.service';

@Component({
  selector: 'app-tax-rate-filters',
  templateUrl: './tax-rate-filters.component.html',
  styleUrls: ['./tax-rate-filters.component.scss']
})
export class TaxRateFiltersComponent implements OnInit { @Input() expanded : boolean = false;
  rateType: SelectItem<RateType[]> = {value: null};
  tax: SelectItem<Tax[]> = {value: null};
  idRateType: number;
  idTax: number;

    @Input("filters") filters : TaxRateFilters;
    @Input("loading") loading : boolean = false;
    @Output("onSearch") onSearch = new EventEmitter<TaxRateFilters>();
    status: SelectItem[] = [
      {label: 'Todos', value: '-1'},
      {label: 'Inactivo', value: '0'},
      {label: 'Activo', value: '1'}
    ];
    _validations: Validations = new Validations();
  
    constructor(
      private _taxRateService: TaxRateService,  
      private _taxService: TaxService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService) {  
    }
  
    onTaxSelected(tax){
      if(tax)
      {
        this.filters.idTax = tax.id;
      }
      else
      {
        this.filters.idTax = -1
      }
  }

  onRateTypeSelected(rateType){
      if(rateType)
      {
        this.filters.idRateType = rateType.id;
      }
      else
      {
        this.filters.idRateType = -1
      }
  }

    ngOnInit(): void {
      this.filters.active =  StatusEnum.alls;
      this.getRatesTypePromise().then(()=>{
        this.getTaxesPromise().then(()=>{});
      });
    }
  
    search(){
      this.onSearch.emit(this.filters);
    }

    
    getRatesTypePromise = () => {
      const filters = StatusEnum.alls;
        return  this._taxRateService.getRatesType(filters)
        .then(results => {
          this.rateType.value = results.sort((a, b) => a.name.localeCompare(b.name));
        }, (error) => {
          this.messageService.add({severity: 'error', summary: 'Cargar tipo de tasas', detail: error.error.message});
          console.log(error.error.message);
        });
      }

      getTaxesPromise = () => {
        const filters = new TaxFilters();
        filters.active = StatusEnum.active;
        return this._taxService.getTaxes(filters)
        .then(results => {
          this.tax.value = results.sort((a, b) => a.name.localeCompare(b.name));
        }, (error) => {
          this.messageService.add({severity: 'error', summary: 'Cargar impuestos', detail: error.error.message});
          console.log(error.error.message);
        });
      }
  
    clearFilters(){
      this.filters.id=-1;
      this.filters.name="";
      this.filters.abbreviation="";
      this.filters.active =  StatusEnum.alls;
      this.filters.idRateType = -1
      this.filters.idTax = -1;
      this.idRateType = null;
      this.idTax = null;
    }
}
