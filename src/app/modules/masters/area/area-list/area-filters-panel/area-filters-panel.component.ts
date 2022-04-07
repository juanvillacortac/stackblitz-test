import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BranchofficeService } from '../../../branchoffice/shared/services/branchoffice.service';
import { AreaFilter } from '../../shared/filters/area-filter';
import { AreaService } from '../../shared/services/area.service';

@Component({
  selector: 'app-area-filters-panel',
  templateUrl: './area-filters-panel.component.html',
  styleUrls: ['./area-filters-panel.component.scss']
})
export class AreaFiltersPanelComponent implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: AreaFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;

  @Output("onSearch") onSearch = new EventEmitter<AreaFilter>();
  statuslist: SelectItem[]=[
    { label: 'Todos', value: '-1' },
    { label: 'Activo', value: '1'},
    { label: 'Inactivo', value: '0'}
    ];
  BranchOfficeList : SelectItem[];
  AreaTypeList : SelectItem[];
  search() {
    this.onSearch.emit(this.filters);
  }

  constructor( private _areaService : AreaService ,private _branchofficeService: BranchofficeService) {
   }

  ngOnInit(): void {
    this.filters.active = -1;
    this.loadFilters();
  }

  loadFilters(){
    this._branchofficeService.getBranchOfficeList(
      {
        active : -1
      })
    .subscribe((data)=>{
      this.BranchOfficeList = data.sort((a, b) => a.branchOfficeName.localeCompare(b.branchOfficeName)).map<SelectItem>((item)=>({
        label: item.branchOfficeName,
        value: item.id
      }));
    }); 
    this._areaService.getareaTypeList()
    .subscribe((data)=>{
      this.AreaTypeList = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });   
  }

  clearFilters() {
    this.filters.name="";
    this.filters.abbreviation= "";
   this.filters.idAreaType=-1;
   this.filters.idBranchOffice=-1;
   this.filters.idFatherArea=-1;
   this.filters.active= -1;
  }

}
