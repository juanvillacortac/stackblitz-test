import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Panel } from 'primeng/panel';
import { PackagingpresentationFilter } from '../../shared/filters/packagingpresentation-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { PackagingpresentationService } from '../../shared/services/PackagingPresentationService/packagingpresentation.service';
import { Validations } from '../../shared/Utils/Validations/Validations';
import { CommonService } from '../../shared/services/Common/common.service';
import { Packingtype } from 'src/app/models/masters-mpc/common/packingtype';

@Component({
  selector: 'packagingpresentation-filter-panel',
  templateUrl: './packagingpresentation-filter-panel.component.html',
  styleUrls: ['./packagingpresentation-filter-panel.component.scss']
})
export class PackagingpresentationFilterPanelComponent implements OnInit {
  
 
  @Input() expanded: boolean = false;
  @Input("filters") filters:  PackagingpresentationFilter = new PackagingpresentationFilter();
  @Input("loading") loading: boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<PackagingpresentationFilter>();
  status: SelectItem[] = [
    { label: 'Todos', value: "-1" },
    { label: 'Activo', value: "1" },
    { label: 'Inactivo', value: "0" },
  ];
  _packingtype: Packingtype[]=[];
  constructor(private _commonservice: CommonService) { }

  ngOnInit(): void {
    this.filters.active = -1;
    this._commonservice.getPackingTypes()
      .subscribe((data) => {
        this._packingtype = data.map<Packingtype>((item) => ({
          name: item.name,
          id: item.id,
          active:item.active
        }));
      }, (error) => {
        console.log(error);
      });
  }

  search() {
    this.onSearch.emit(this.filters);
  }

  clearFilters() {
    this.filters.idPackagingPresentation = -1;
    this.filters.name = "";
    this.filters.idPackingType = -1;
    this.filters.active = -1;
    this.filters.idUser = -1;
  }
}
