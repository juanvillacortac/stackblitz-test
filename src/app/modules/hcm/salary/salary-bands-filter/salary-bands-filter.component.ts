import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
//Models
import { SalaryRangeViewFilter } from '../../shared/filters/salaries/salary-range-view-filter';



@Component({
  selector: 'app-salary-bands-filter',
  templateUrl: './salary-bands-filter.component.html',
  styleUrls: ['./salary-bands-filter.component.scss']
})

export class SalaryBandsFilterComponent implements OnInit {
  //var
  @Input() expanded = false;
  @Input() loading = false;
  @Input() showList = true;
  @Input() filters: SalaryRangeViewFilter;
  @Output() onSearch = new EventEmitter<SalaryRangeViewFilter>();
  @Output() clearList = new EventEmitter<boolean>();
 
  
  @Input() coinModelOpction: SelectItem[];
  @Input() jobPositionSelect: SelectItem[];
  @Input() salaryTypeSelect: SelectItem[];

  salaryTypeItem: SelectItem = {label:"", value:0};
  jobPositionItem: SelectItem = {label:'', value:0};
  
  //coinFilter: CoinxCompanyFilter = new CoinxCompanyFilter();
 // coinModel: Coins [] = [];
  
  coinItem: SelectItem = {label:'', value:0};
  
  

   
  constructor(
    
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    
  }


  search(){
    //debugger
    this.filters.jobPosition = this.jobPositionItem  == null || this.jobPositionItem.value == 0 ? {label:'Todos', value: -1} : this.jobPositionItem ;
    this.filters.typeSalary = this.salaryTypeItem == null || this.salaryTypeItem.value == 0 ? {label:'Todos', value: -1} : this.salaryTypeItem;
    this.filters.Currency = this.coinItem == null || this.coinItem.value == 0 ? {label:'Todos', value: -1} : this.coinItem;
    
    if((this.jobPositionItem  == null || this.jobPositionItem.value == 0) && (this.salaryTypeItem == null || this.salaryTypeItem.value == 0) && (this.coinItem == null || this.coinItem.value == 0) ){
      this.jobPositionItem = {label:'Todos', value: '-1'};
      this.salaryTypeItem = {label:'Todos', value: '-1'};
      this.coinItem = {label:'Todos', value: '-1'};
    }

    this.onSearch.emit(this.filters);
    
  }

  clearFilters(){
    this.jobPositionItem = null;
    this.salaryTypeItem = null;
    this.coinItem = null;
    this.showList = false;
    this.clearList.emit(this.showList);
  }

}
