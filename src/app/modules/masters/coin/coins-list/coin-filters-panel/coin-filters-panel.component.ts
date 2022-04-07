import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { CoinFilter } from '../../shared/filters/CoinFilter';
import { CoinsService } from '../../shared/service/coins.service';



@Component({
  selector: 'app-coin-filters-panel',
  templateUrl: './coin-filters-panel.component.html',
  styleUrls: ['./coin-filters-panel.component.scss']
})
export class CoinFiltersPanelComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : CoinFilter;
  @Input("loading") loading : boolean = false;

  CoinType : SelectItem[];
  statuslist: SelectItem[]=[
    { label: 'Todos', value: '-1'},
    { label: 'Activo', value: '1'},
    { label: 'Inactivo', value: '0'}
    ];;

  @Output("onSearch") onSearch = new EventEmitter<CoinFilter>();

  constructor(private coinService: CoinsService) {  
  }

  ngOnInit(): void {
    this.filters.active=-1;
    this.loadFilters();   
  }
  loadFilters(){
    this.coinService.getCoinTypesList()
    .subscribe((data)=>{
      this.CoinType = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
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
    this.filters.idtype=-1;
    this.filters.abbreviation="";
    this.filters.name="";
  }
}
