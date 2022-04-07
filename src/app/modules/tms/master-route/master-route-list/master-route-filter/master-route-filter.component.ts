import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BranchOfficeService } from 'src/app/modules/hcm/shared/services/branch-office.service';
import { RouteFilter } from '../../shared/filter/route-filter';
import { RouteService } from '../../shared/service/route.service';

@Component({
  selector: 'app-master-route-filter',
  templateUrl: './master-route-filter.component.html',
  styleUrls: ['./master-route-filter.component.scss']
})
export class MasterRouteFilterComponent implements OnInit {

  branchOfficeOriginList: SelectItem[];
  branchOfficeDestinationList: SelectItem[];
  indViaticList: SelectItem[];
  statusList: SelectItem[];  
  @Input("expanded") _expanded: boolean = true;
  @Input("filter") _filter: RouteFilter;
  @Output("onSearch") onSearch = new EventEmitter<RouteFilter>();

  constructor(private _branchOfficeService: BranchOfficeService ) { }

  ngOnInit(): void { 
    this.loadFilters();   
    this.indViaticList=[
      { label: 'Todos', value: '-1' },
      { label: 'Si', value: '1'},
      { label: 'No', value: '0'}
    ];
    this.statusList=[
      { label: 'Todos', value: '-1' },
      { label: 'Activos', value: '1'},
      { label: 'Inactivos', value: '0'}
    ];
  }

  loadFilters(){          
    this._branchOfficeService.GetBranchOffices()
    .subscribe((data)=>{
      this.branchOfficeOriginList = data.map<SelectItem>((item)=>({
        label: item.branchOfficeName,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });    
    this._branchOfficeService.GetBranchOffices()
    .subscribe((data)=>{
      this.branchOfficeDestinationList = data.map<SelectItem>((item)=>({
        label: item.branchOfficeName,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });    
  }

  search(){
    this.onSearch.emit(this._filter);
  }

  clearFilters(){
    this._filter.id = -1;
    this._filter.codeRoute = "";
    this._filter.idBranchOfficeOrigin = -1;    
    this._filter.idBranchOfficeDestination = -1;
    this._filter.indViatics = -1;    
    this._filter.active = -1;    
  }
}
