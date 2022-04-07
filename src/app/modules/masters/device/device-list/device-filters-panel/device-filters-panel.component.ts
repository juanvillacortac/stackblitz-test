import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BrandsService } from '../../../brand/shared/services/brands.service';
import { DeviceTypeService } from '../../../device-types/shared/services/device-type.service';
import { DeviceFilter } from '../../shared/filters/device-filter';

@Component({
  selector: 'app-device-filters-panel',
  templateUrl: './device-filters-panel.component.html',
  styleUrls: ['./device-filters-panel.component.scss']
})
export class DeviceFiltersPanelComponent implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: DeviceFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;
  //@Input() idRoleType: number;

  @Output("onSearch") onSearch = new EventEmitter<DeviceFilter>();

  BrandFilters: DeviceFilter   = new DeviceFilter();

  BrandsList : SelectItem[];
  DeviceTypeList : SelectItem[];
  statuslist: SelectItem[]=[
    { label: 'Todos', value: '-1' },
    { label: 'Activo', value: '1'},
    { label: 'Inactivo', value: '0'}
    ];
  search() {
    this.onSearch.emit(this.filters);
  }
  constructor(private brandService:BrandsService , private deviceTypeService: DeviceTypeService) {
   }

  ngOnInit(): void {
    this.filters.Active = -1;
    this.loadFilters();
  }
  loadFilters(){
    this.brandService.getBrandsList(
      {
        id:-1,
        name:"",
        active:-1,
        idClass:-1,
        abbreviation:""
      }
      )
    .subscribe((data)=>{
      this.BrandsList = data.sort((a, b) => a.name.localeCompare(b.name)).filter(brand => brand.id != 0 ).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });  
    this.deviceTypeService.getdeviceTypeList(
      {
        Id:-1,
        Active:-1,
        Name: "",
        Abbreviation:"" 
      })
    .subscribe((data)=>{
      this.DeviceTypeList = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });  

  }
  clearFilters() {
    this.filters.Abbreviation="";
    this.filters.Active= -1;
   this.filters.Name="";
   this.filters.IdBrand=-1;
   this.filters.IdDeviceType=-1;
  }

}
