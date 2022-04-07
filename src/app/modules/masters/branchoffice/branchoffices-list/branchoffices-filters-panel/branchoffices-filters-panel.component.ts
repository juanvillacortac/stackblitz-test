import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BranchofficeFilter } from '../../shared/filters/branchoffice-filter';
import { BranchofficeService } from '../../shared/services/branchoffice.service';

@Component({
  selector: 'app-branchoffices-filters-panel',
  templateUrl: './branchoffices-filters-panel.component.html',
  styleUrls: ['./branchoffices-filters-panel.component.scss']
})
export class BranchofficesFiltersPanelComponent implements OnInit {


  @Input() expanded : boolean = false;
  @Input("filters") filters : BranchofficeFilter;
  @Input("loading") loading : boolean = false;

  branchOfficeTypes : SelectItem[];  
  companyList : SelectItem[];  
  statusList: SelectItem[];

  @Output("onSearch") onSearch = new EventEmitter<BranchofficeFilter>();

  constructor(private branchOfficeservice: BranchofficeService) { 
    this.statusList=[
      { label: 'Todos', value: '-1' },
      { label: 'Activos', value: '1'},
      { label: 'Inactivos', value: '0'}
      ];
  }

  ngOnInit(): void {
    this.loadFilters();
  }

  loadFilters(){  
    this.branchOfficeservice.getBranchOfficeTypeList()
    .subscribe((data)=>{
      this.branchOfficeTypes = data.map<SelectItem>((item)=>({
        label: item.branchOfficeTypeName,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });

    this.branchOfficeservice.getCompaniesByOrderName()
    .subscribe((data)=>{
      this.companyList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  search(){
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.id = -1;
    this.filters.idBranchOfficeType = -1;
    this.filters.idCompany = -1;
    this.filters.branchOfficeName = "";
    this.filters.branchOfficeCode = "";
    this.filters.branchOfficeManager = "";
    this.filters.active = -1;    
  }

}
