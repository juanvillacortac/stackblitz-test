import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Supplier } from 'src/app/models/masters/supplier';
import { ClassificationFilter } from 'src/app/modules/masters-mpc/shared/filters/classification-filter';
import { ClassificationService } from 'src/app/modules/masters-mpc/shared/services/ClassificationService/classification.service';
import { CountryFilter } from 'src/app/modules/masters/country/shared/filters/country-filter';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { SupplierClasificationFilter } from 'src/app/modules/masters/supplierclasification/shared/filters/supplier-clasification-filter';
import { SupplierclasificationService } from 'src/app/modules/masters/supplierclasification/shared/services/supplierclasification.service';
import { SupplierFilter } from '../../../shared/filters/supplier-filter';

@Component({
  selector: 'app-supplier-filter',
  templateUrl: './supplier-filter.component.html',
  styleUrls: ['./supplier-filter.component.scss']
})
export class SupplierFilterComponent implements OnInit {
  // @Input() expanded : boolean = false;
  @Input("filters") filters : SupplierFilter;
  @Input("load") load : boolean = false;
  @Input("supplierlist") supplierlist : Supplier[];
  @Input("_selectedColumns") _selectedColumns : any[];
  @Output("onSearchprov") onSearchprov = new EventEmitter<SupplierFilter>();
  classificationlist: SelectItem[];
  countryList: SelectItem[];

  constructor(private _supplierservice: SupplierService,
    private _countryservice: CountryService,
    private supplierClasificationService: SupplierclasificationService) { }

  ngOnInit(): void {
    this.onLoadClassification();
    this.onLoadCountry();
  }

  onLoadClassification(){
    var filter: SupplierClasificationFilter = new SupplierClasificationFilter()
    filter.id = -1;
    filter.active=1;
    this.supplierClasificationService.getSupplierClasificationList(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.supplierclasification.localeCompare(b.supplierclasification));
      this.classificationlist = data.map((item)=>({
        label: item.supplierclasification,
        value: item.id
      }));
    },(error)=>{
    });
  }

  onLoadCountry(){
    var filter: CountryFilter = new CountryFilter();
    filter.idCountry = -1;
    filter.active=1;
    this._countryservice.getCountriesList(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.countryList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
    });
  }

  search(){
    this.filters.active=1;
    this.onSearchprov.emit(this.filters);
  }
  clearFilters(){
   this.filters.id=-1;
   this.filters.document="";
   this.filters.socialReason="";
   this.filters.idCountry=-1;
   this.filters.classificationId=-1;
   this.filters.active=1;

  }
}
