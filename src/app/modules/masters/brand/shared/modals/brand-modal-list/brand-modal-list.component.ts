import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Brands } from 'src/app/models/masters/brands';
import { InventoryExistenceFilter } from 'src/app/modules/ims/inventory-existence/shared/filters/inventory-existence-filter';
import { brandsFilter } from '../../filters/brands-Filters';
import { BrandsService } from '../../services/brands.service';
import { BrandsViewModel } from '../../view-model/brands-viewmodel';

@Component({
  selector: 'app-brand-modal-list',
  templateUrl: './brand-modal-list.component.html',
  styleUrls: ['./brand-modal-list.component.scss']
})
export class BrandModalListComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{brands: Brands, identifier: number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Output("onSearch") onSearch = new EventEmitter<brandsFilter>();
  brandsFilters: brandsFilter = new brandsFilter();
  inventoryExistenceFilter: InventoryExistenceFilter = new InventoryExistenceFilter();
  @Input("filters") filters: InventoryExistenceFilter;
  @Input("filter") filter : brandsFilter;
  BrandsClass : SelectItem[];
  loading : boolean = false;
  identifierToEdit: number = -1;
  brands: Brands = new Brands();
  selectedBrands : any[] = []; 
  selectedBrand : any;
  @Input("BrandsString") BrandsString : string;
  @Output("BrandsStringChange") BrandsStringChange = new EventEmitter<string>();
  @Output("FiltersChange") FiltersChange = new EventEmitter<InventoryExistenceFilter>();
  @ViewChild('dtbm') dtbm: Table;
  @Input() singleSelection = false;

  
  displayedColumns:ColumnD<BrandsViewModel>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Código',field:'id',display:'none' },
    { template: (data) => { return data.name; }, header: 'Marca',field:'name' ,display: 'table-cell' },
    { template: (data) => { return data.brandClass; }, header: 'Clase de marca',field:'brandClass' ,display: 'table-cell' }
  ];

  constructor(public _brandService: BrandsService ,private messageService: MessageService) { }

  ngOnInit(): void {
    //this.loadBrands();
    this.brandsFilters=new brandsFilter();
    this._brandService._brandsList=[];
  }
  


  loadBrands(){
    this.loading = true;
    this._brandService.getBrandsList(this.brandsFilters).subscribe((data: Brands[]) => {
      this._brandService._brandsList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

  onShow(){
      this.loadbrandclass();
    //this.loadBrands();
    this.emitVisible();
    this.ngOnInit();
  }

  onHide(){
    this.emitVisible();
    this.dtbm.reset();
    this.brands = new Brands(); 
    this.identifierToEdit = -1;
  }

  emitVisible(){
    this.onToggle.emit(this.visible);
  }

 loadbrandclass(){
  this._brandService.getBrandsClassList()
  .subscribe((data)=>{
    this.BrandsClass = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
      label: item.name,
      value: item.id
    }));
  }); 
 }
  submitBrands()
  {
    this.BrandsString = "";
    this.filters.idbrand = "";
    if(this.singleSelection) {
      this.emitSingleModel()
    } else {
      this.emitMultipleModel();
    }
   

  }
  emitMultipleModel() {
    let cont = 0;
    for (let i = 0; i < this.selectedBrands.length; i++) {
        cont += 1;
        this.BrandsString = this.BrandsString == "" ? this.selectedBrands[i].name : cont >= 5 ? cont + " Marcas seleccionadas" : this.BrandsString + ", " + this.selectedBrands[i].name;
        this.filters.idbrand = this.filters.idbrand == "" ? this.selectedBrands[i].id : this.filters.idbrand + "," + this.selectedBrands[i].id;
        this.FiltersChange.emit(this.filters);
        this.BrandsStringChange.emit(this.BrandsString);      
        this.visible =false;
      }
  }
  emitSingleModel() {
    this.selectedBrand =  this.selectedBrands;
    this.BrandsString = this.selectedBrand.name;
    this.filters.idbrand =  this.selectedBrand.id;
    this.FiltersChange.emit(this.filters);
    this.BrandsStringChange.emit(this.BrandsString);      
    this.visible =false;
  }
  search()
  {
     if (this.brandsFilters.name != "" || this.brandsFilters.idClass >0)
     {
       this.loadBrands();
     }
  }

  clearFilters(){
    this.brandsFilters.active=-1;
    this.brandsFilters.id=-1;
    this.brandsFilters.idClass=-1;
    this.brandsFilters.abbreviation="";
    this.brandsFilters.name="";
  }
}
