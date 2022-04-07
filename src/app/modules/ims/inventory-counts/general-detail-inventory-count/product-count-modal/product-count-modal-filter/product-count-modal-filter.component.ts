import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DetailInventoryCount } from 'src/app/models/ims/detail-inventory-count';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { ProductCountInventoryFilter } from '../../../shared/filter/product-count-detail-filter';
import { InventorycountService } from '../../../shared/service/inventorycount.service';

@Component({
  selector: 'product-count-modal-filter',
  templateUrl: './product-count-modal-filter.component.html',
  styleUrls: ['./product-count-modal-filter.component.scss']
})
export class ProductCountModalFilterComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : ProductCountInventoryFilter;
  @Input("loading") loading : boolean = false;
  @Input("productlist") productlist : DetailInventoryCount[];
  @Output("onSearch") onSearch = new EventEmitter<ProductCountInventoryFilter>();
  @Output() changes = new EventEmitter();

  statuslist:any[];
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
  ];
  BrandsString: string;
  supplierstring: string;
  BrandDialogVisible = false;
  SupplierDialogVisible = false;
  configurationList:SelectItem[]=[];
  valid:RegExp = /^[a-zA-Z0-9Á-ú\sñÑ.-]*$/;

  constructor(public _commonservice:CommonService,public _service:InventorycountService ) { }

  ngOnInit(): void {
    this.onLoadStatusCreationList();
    //this.supplierstring="";
  }
  onLoadStatusCreationList(){
    var filter : StatusFilter = new StatusFilter();
    filter.IdStatusType =1;
    this._commonservice.getStatus(filter)
    .subscribe((data)=>{
      this.statuslist = data.sort((a, b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  onToggleSupplier(visible: boolean){
    this.SupplierDialogVisible = visible;
  }

  onToggleBrand(visible: boolean){
    this.BrandDialogVisible = visible;
  }
  search(){
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.gtin="";
    this.filters.name="";
    this.filters.idbrand="";
    this.filters.idsupplier="";
    this.filters.idstatus=-1;
    this.filters.references="";
    this.BrandsString = "";
    this.supplierstring= "";
  }

}
