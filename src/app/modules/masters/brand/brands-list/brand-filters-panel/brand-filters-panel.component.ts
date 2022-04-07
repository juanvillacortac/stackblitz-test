import { Component,EventEmitter,Input, OnInit, Output } from '@angular/core';
import {SelectItem} from 'primeng/api';
import { runInThisContext } from 'vm';
import { brandsFilter } from '../../shared/filters/brands-Filters';
import { BrandsService } from '../../shared/services/brands.service';


@Component({
  selector: 'app-brand-filters-panel',
  templateUrl: './brand-filters-panel.component.html',
  styleUrls: ['./brand-filters-panel.component.scss']
})
export class BrandFiltersPanelComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : brandsFilter;
  @Input("loading") loading : boolean = false;

  BrandsClass : SelectItem[];
  statuslist:SelectItem[]=[
    { label: 'Todos', value: '-1' },
    { label: 'Activo', value: '1'},
    { label: 'Inactivo', value: '0'}
    ];

  @Output("onSearch") onSearch = new EventEmitter<brandsFilter>();

  constructor(private brandService:BrandsService) {
  
   }

  ngOnInit(): void {
    this.filters.active=-1;
    this.loadFilters();
  }
  loadFilters(){
    this.brandService.getBrandsClassList()
    .subscribe((data)=>{
      this.BrandsClass = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });   
  }

  search(){
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.active=-1;
    this.filters.id=-1;
    this.filters.idClass=-1;
    this.filters.abbreviation="";
    this.filters.name="";
  }
  

}
