import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { GtintypeFilter } from '../../shared/filters/gtintype-filter';
import { GtintypeService } from '../../shared/services/GtinType/gtintype.service';

@Component({
  selector: 'gtintype-filter-panel',
  templateUrl: './gtintype-filter-panel.component.html',
  styleUrls: ['./gtintype-filter-panel.component.scss']
})
export class GtintypeFilterPanelComponent implements OnInit {

  @Input() expanded: boolean = false;
  @Input("filters") filters: GtintypeFilter;
  @Input("loading") loading: boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<GtintypeFilter>();
  status: SelectItem[] = [
    { label: 'Todos', value: "-1" },
    { label: 'Activo', value: "1" },
    { label: 'Inactivo', value: "0" },
  ];
  _gtingrouping: SelectItem[];
  constructor(private _gtintypeService: GtintypeService) { }

  ngOnInit(): void {
    this.filters.active = -1;
    this._gtintypeService.getGtinGrouping()
      .subscribe((data) => {
        this._gtingrouping = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  search() {
    this.onSearch.emit(this.filters);
  }

  clearFilters() {
    this.filters.id = -1;
    this.filters.name = "";
    this.filters.gtinGroupingId = -1;
    this.filters.active = -1;
    this.filters.createdByUserId = -1;
  }

}
