import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Supplier } from 'src/app/models/masters/supplier';
import { InventoryExistenceFilter } from 'src/app/modules/ims/inventory-existence/shared/filters/inventory-existence-filter';
import { SupplierFilter } from '../../filters/supplier-filter';
import { SupplierService } from '../../services/supplier.service';
import { SupplierViewmodel } from '../../view-models/supplier-viewmodel';

@Component({
  selector: 'app-supplier-modal-list',
  templateUrl: './supplier-modal-list.component.html',
  styleUrls: ['./supplier-modal-list.component.scss']
})
export class SupplierModalListComponent implements OnInit {
  loading : boolean = false;
  supplierFilters: SupplierFilter = new SupplierFilter();
  suppliers: Supplier = new Supplier();
  identifierToEdit: number = -1;
  selectedSuppliers : any[] = []; 
  selectedSupplier : any; 
  @Input() visible: boolean = false;
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  
  @Input("filters") filters: InventoryExistenceFilter;
  @Input("supplierinput") supplierstring : string;
 
  @Output("supplierchange") supplierchange = new EventEmitter<string>();
  @Output("FiltersChange") FiltersChange = new EventEmitter<InventoryExistenceFilter>();
  @ViewChild('dtsm') dtsm: Table;
  @Input() singleSelection = false;
  

  displayedColumns:ColumnD<SupplierViewmodel>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Código',field:'id',display:'none' },
    { template: (data) => { return data.document; }, header: 'RIF',field:'document' ,display: 'table-cell' },
    { template: (data) => { return data.socialReason; }, header: 'Razón social',field:'socialReason' ,display: 'table-cell' }
  ];
  
  constructor(public _SupplierService:SupplierService,private messageService: MessageService) { }

  ngOnInit(): void 
  {
    this.supplierFilters = new SupplierFilter();
    this._SupplierService._suppliersList=[]; 
  }


  loadSuppliers(){
    this.loading = true;
    this._SupplierService.getSupplierList(this.supplierFilters).subscribe((data: Supplier[]) => {
      this._SupplierService._suppliersList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los proveedores" });
    });
  }

  onShow(){
    this.loadSuppliers();
    this.emitVisible();
    this.ngOnInit();
  }

  onHide(){
    this.emitVisible();
    this.dtsm.reset();
    this.suppliers = new Supplier(); 
    this.identifierToEdit = -1;
    this.selectedSuppliers=[];
  }

  emitVisible(){
    this.onToggle.emit(this.visible);
  }

  submitSuppliers()
  {
    this.supplierstring = "";
    this.filters.idsupplier = "";
    if(this.singleSelection) {
      this.emitSingleModel()
    } else {
      this.emitMultipleModel();
    }

  }
  emitMultipleModel() {
    let cont = 0;
    for (let i = 0; i < this.selectedSuppliers.length; i++) {
        cont += 1;
        this.supplierstring = this.supplierstring == "" ? this.selectedSuppliers[i].socialReason : cont >= 5 ? cont + " proveedores seleccionados" : this.supplierstring + ", " + this.selectedSuppliers[i].socialReason;
        this.filters.supplierstring= this.supplierstring;
        this.filters.idsupplier = this.filters.idsupplier == "" ? this.selectedSuppliers[i].id : this.filters.idsupplier + "," + this.selectedSuppliers[i].id;
        this.FiltersChange.emit(this.filters);
        this.supplierchange.emit(this.supplierstring);
        this.visible =false;
      }
  }
  emitSingleModel() {
    this.selectedSupplier =  this.selectedSuppliers;
    this.supplierstring = this.selectedSupplier.socialReason;
    this.filters.supplierstring= this.supplierstring;
    this.filters.idsupplier =  this.selectedSupplier.id;
    this.FiltersChange.emit(this.filters);
    this.supplierchange.emit(this.supplierstring);      
    this.visible =false;
  }

  search()
  {
     if (this.supplierFilters.document != "" || this.supplierFilters.socialreason!="")
     {
       this.loadSuppliers();
     }
  }

  clearFilters(){
    this.supplierFilters.active=-1;
    this.supplierFilters.id=-1;
    this.supplierFilters.socialreason="";
    this.supplierFilters.document="";
    this.supplierFilters.commercialreason="";
  }

}
