import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ClassificationFilter } from '../../shared/filters/classification-filter';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'classification-filter-panel',
  templateUrl: './classification-filter-panel.component.html',
  styleUrls: ['./classification-filter-panel.component.scss']
 /* name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]]*/
})
export class ClassificationFilterPanelComponent implements OnInit {

  @Input() expanded: boolean = false;
  @Input("filters") filters: ClassificationFilter;
  @Input("loading") loading: boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<ClassificationFilter>();
  status: SelectItem[] = [
    { label: 'Todos', value:'-1' },
    { label: 'Activo', value:'1' },
    { label: 'Inactivo', value:'0' },
  ];
  _validations: Validations = new Validations();
  constructor() { }

  ngOnInit(): void {
    this.filters.active = -1;
  }
  search() {
    this.onSearch.emit(this.filters);
  }
  clearFilters() {
 // this.filters = new ClassificationFilter();
 this.filters.id = -1;
 this.filters.name= "";
 this.filters.active=-1;
 this.filters.abbreviation="";
 this.filters.internalCode="";
 this.filters.createdByUserId=-1;
  }

}
