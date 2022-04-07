import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { Country } from 'src/app/models/masters/country';
import { DocumentTypeFilter } from 'src/app/models/masters/document-type-filters';
import { EntityType } from 'src/app/models/masters/entity-type';
import { EntityTypeFilters } from 'src/app/models/masters/entity-type-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { DocumentTypeService } from '../shared/services/document-type.service';

@Component({
  selector: 'app-document-type-filters',
  templateUrl: './document-type-filters.component.html',
  styleUrls: ['./document-type-filters.component.scss']
})
export class DocumentTypeFiltersComponent implements OnInit { @Input() expanded : boolean = false;
  entityTypes: SelectItem<EntityType[]> = {value: null};
  countries: SelectItem<Country[]> = {value: null};
  idEntityType: number;
  idCountry: number;

    @Input("filters") filters : DocumentTypeFilter;
    @Input("loading") loading : boolean = false;
    @Output("onSearch") onSearch = new EventEmitter<DocumentTypeFilter>();
    status: SelectItem[] = [
      {label: 'Todos', value: '-1'},
      {label: 'Inactivo', value: '0'},
      {label: 'Activo', value: '1'}
    ];
    _validations: Validations = new Validations();
  
    constructor(
      private _countryService: CountryService,
      private _documentTypeService: DocumentTypeService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService) {  
    }
  
    onEntityTypeSelected(entityType){
      if(entityType)
      {
        this.filters.idEntityType = entityType.id;
      }
      else
      {
        this.filters.idEntityType = -1
      }
  }
    
  onCountrySelected(country){
    if(country)
    {
      this.filters.idCountry = country.id;
    }
    else
    {
      this.filters.idCountry = -1
    }
}

    ngOnInit(): void {
      this.filters.active =  StatusEnum.alls;
      this.getEntityTypeListPromise().then(()=>{

        this.getCountriesPromise().then(()=>{})
      });
    }
  
    search(){
      this.onSearch.emit(this.filters);
    }

    
      getEntityTypeListPromise = () => {
        const filters = new EntityTypeFilters();
        filters.active = StatusEnum.active;;
        return this._documentTypeService.getEntityTypeListPromise(filters)
        .then(results => {
          this.entityTypes.value = results.sort((a, b) => a.name.localeCompare(b.name));
        }, (error) => {
          this.messageService.add({severity: 'error', summary: 'Cargar tipos de entidades', detail: error.error.message});
          console.log(error.error.message);
        });
      }
      
      getCountriesPromise = () => {
        const filters =  new CountryFilter();
        filters.active = StatusEnum.alls;
        return  this._countryService.getCountriesPromise(filters)
        .then(results => {
          this.countries.value = results.sort((a, b) => a.name.localeCompare(b.name));
        }, (error) => {
          this.messageService.add({key:'price-type',severity: 'error', summary: 'Cargar paises', detail: error.error.message});
          console.log(error.error.message);
        });
      }
      
      
    
    clearFilters(){
      this.filters.id=-1;
      this.filters.name="";
      this.filters.active =  StatusEnum.alls;
      this.filters.idEntityType = -1;
      this.filters.idCountry = -1;
      this.idCountry = null;
      this.idEntityType = null;
    }
}
