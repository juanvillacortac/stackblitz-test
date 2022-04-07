import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Supplier } from 'src/app/models/masters/supplier';
import { CountryFilter } from 'src/app/modules/masters/country/shared/filters/country-filter';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { SupplierClasificationFilter } from 'src/app/modules/masters/supplierclasification/shared/filters/supplier-clasification-filter';
import { SupplierclasificationService } from 'src/app/modules/masters/supplierclasification/shared/services/supplierclasification.service';
import { SupplierFilter } from '../../shared/filters/supplier-filter';

@Component({
  selector: 'app-filter-suppliermodal',
  templateUrl: './filter-suppliermodal.component.html',
  styleUrls: ['./filter-suppliermodal.component.scss']
})
export class FilterSuppliermodalComponent implements OnInit {
  @Input("filters") filters : SupplierFilter;
  @Input("load") load : boolean = false;
  @Input("supplierlist") supplierlist : Supplier[];
  //@Input("_selectedColumns") _selectedColumns : any[];
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
  
    loadSuppliers(){
        this.onSearchprov.emit(this.filters);
    }
    
    onLoadClassification(){
      var filter: SupplierClasificationFilter = new SupplierClasificationFilter()
      filter.id = -1;
      this.supplierClasificationService.getSupplierClasificationList(filter)
      .subscribe((data)=>{
        data = data.sort((a, b) => a.supplierclasification.localeCompare(b.supplierclasification));
        this.classificationlist = data.map((item)=>({
          label: item.supplierclasification,
          value: item.id
        }));
        console.log("prueba");
        console.log(this.classificationlist);
      },(error)=>{
      });
    }
  
    onLoadCountry(){
      var filter: CountryFilter = new CountryFilter();
      filter.idCountry = -1;
      this._countryservice.getCountriesList(filter)
      .subscribe((data)=>{
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.countryList = data.map((item)=>({
          label: item.name,
          value: item.id
        }));
        console.log("paises");
        console.log(this.countryList);
      },(error)=>{
      });
    }
  
    
    clearFilters(){
     this.filters.id=-1;
     this.filters.document="";
     this.filters.socialReason="";
     this.filters.idCountry=-1;
     this.filters.classificationId=-1;
    }
}
