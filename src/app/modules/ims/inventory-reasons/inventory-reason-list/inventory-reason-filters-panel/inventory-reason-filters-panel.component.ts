import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { GroupinginventoryreasonService } from '../../../grouping-inventory-reasons/shared/service/groupinginventoryreason.service';
import { InventoryReasonFilter } from '../../shared/filters/inventory-reason-filter';
import { InventoryReasonService } from '../../shared/services/inventory-reason.service';

@Component({
  selector: 'app-inventory-reason-filters-panel',
  templateUrl: './inventory-reason-filters-panel.component.html',
  styleUrls: ['./inventory-reason-filters-panel.component.scss']
})
export class InventoryReasonFiltersPanelComponent implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: InventoryReasonFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;
  @Output("onSearch") onSearch = new EventEmitter<InventoryReasonFilter>();
  InventoryReasonConfigList : SelectItem[];
  GroupingInventoryReasonList : SelectItem[];
  statuslist: SelectItem[];
  search() {
    this.onSearch.emit(this.filters);
  }
  valid: RegExp = /^[a-zA-ZÀ-ú\sñÑ] *$/
  constructor(public _InventoryReasonService: InventoryReasonService , public _GroupingInventoryReasonService : GroupinginventoryreasonService) 
  {
    this.statuslist=[
      { label: 'Todos', value: "-1" },
      { label: 'Activo', value: "1"},
      { label: 'Inactivo', value: "0"}
      ];

   }

  ngOnInit(): void {
    this.loadFilters();
  }
  loadFilters(){
    this._InventoryReasonService.getinventoryReasonConfigurationList()
    .subscribe((data)=>{
      this.InventoryReasonConfigList = data.map<SelectItem>((item)=>({
        label: item.name + " " + "( "+item.symbol+")",
        value: item.id
      }));
    });  

    this._GroupingInventoryReasonService.getgroupingInventoryReasonsList()
    .subscribe((data)=>{
      this.GroupingInventoryReasonList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });  
  }

  clearFilters() {
  //this.filters.id = 0;
  this.filters.active= -1;
   this.filters.name="";
   this.filters.idconfiguration=-1;
   this.filters.idgroupingInventoryReason=-1;
  }

}
