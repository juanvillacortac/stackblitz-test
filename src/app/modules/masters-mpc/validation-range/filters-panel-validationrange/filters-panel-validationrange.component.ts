import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Panel } from 'primeng/panel';
import { ValidationrangeFilter } from '../../shared/filters/validationrange-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { ValidationrangeService } from '../../shared/services/ValidationRange/validationrange.service';

@Component({
  selector: 'app-filters-panel-validationrange',
  templateUrl: './filters-panel-validationrange.component.html',
  styleUrls: ['./filters-panel-validationrange.component.scss']
})
export class FiltersPanelValidationrangeComponent implements OnInit {

  @Input() expanded: boolean = false;
  @Input("filters") filters: ValidationrangeFilter;
  @Input("loading") loading: boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<ValidationrangeFilter>();
  status: SelectItem[] = [
    { label: 'Todos', value: '-1' },
    { label: 'Activo', value: '1' },
    { label: 'Inactivo', value: '0' },
  ];
  _validationtype: SelectItem[];
  constructor(private _validationrangeService: ValidationrangeService) { }

  ngOnInit(): void {
    this.filters.active = -1;
    this._validationrangeService.getTypeValidationRange()
      .subscribe((data) => {
        this._validationtype = data.map<SelectItem>((item) => ({
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
    this.filters.typeValidationRangeId = -1;
    this.filters.active = -1;
    this.filters.createdByUserId = -1;
  }

}
