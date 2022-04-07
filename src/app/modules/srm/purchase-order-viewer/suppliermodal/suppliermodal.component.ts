import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Supplier } from 'src/app/models/masters/supplier';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { SupplierViewmodel } from 'src/app/modules/masters/supplier/shared/view-models/supplier-viewmodel';
import { FilterPurchaseOrder } from '../../shared/filters/filter-purchase-order';
import { SupplierFilter } from '../../shared/filters/supplier-filter';
import { SuppliercatalogService } from '../../shared/services/suppliercatalog/suppliercatalog.service';
import { SupplierempViewmodel } from '../../shared/view-models/suppliersemp-viewmodel';

@Component({
  selector: 'app-suppliermodal',
  templateUrl: './suppliermodal.component.html',
  styleUrls: ['./suppliermodal.component.scss']
})
export class SuppliermodalComponent implements OnInit {

  loading: boolean = false;
  supplierFilters: SupplierFilter = new SupplierFilter();
  suppliers: Supplier = new Supplier();
  identifierToEdit: number = -1;
  selectedSuppliers: any[] = [];
  load: boolean = false;
  @Input() visible: boolean = false;

  @Input("filters") filters: FilterPurchaseOrder;
  @Input("supplierinput") supplierinput: string;

  @Output("FiltersChange") FiltersChange = new EventEmitter<FilterPurchaseOrder>();
  @Output("supplierinputChange") supplierinputChange = new EventEmitter<string>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();


  displayedColumns: ColumnD<SupplierempViewmodel>[] =
    [
      { template: (data) => { return data.id; }, header: 'Código', field: 'id', display: 'none' },
      { template: (data) => { return data.identifier +"-"+ data.document; }, header: 'Documento', field: 'document', display: 'table-cell' },
      { template: (data) => { return data.socialReason; }, header: 'Razón social', field: 'socialReason', display: 'table-cell' },
      { template: (data) => { return data.classification; }, header: 'Clasificación', field: 'classification', display: 'table-cell' },
      { template: (data) => { return data.country; }, header: 'País', field: 'country', display: 'table-cell' }
    ];

  constructor(private messageService: MessageService,
    public _SupplierService: SuppliercatalogService,
    private _httpClient: HttpClient) { }
  _Authservice: AuthService = new AuthService(this._httpClient);
  ngOnInit(): void {
    this.searchproviders();
    this.emitVisible();
  }


  searchproviders() {
    this.load = true;
    this.supplierFilters.idCom = this._Authservice.currentCompany;
    this._SupplierService.getSupplierListclass(this.supplierFilters).subscribe((data: SupplierempViewmodel[]) => {
      this._SupplierService._SupplierClassiList = data;
      this.load = false;
    }, (error: HttpErrorResponse) => {
      this.load = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los proveedores" });
    });
  }

  onShow() {
    this.ngOnInit();

  }

  onHide() {
    this.emitVisible();
    this.suppliers = new Supplier();
    this.selectedSuppliers = [];
    this.supplierFilters.active=1;
    this.supplierFilters.document="";
    this.supplierFilters.id=-1;
    this.supplierFilters.socialReason="";
    this.supplierFilters.idCountry=-1;
    this.supplierFilters.classificationId=-1;
  }

  emitVisible() {
    this.onToggle.emit(this.visible);
  }

  submitSuppliers() {
    this.supplierinput = "";
    this.filters.idSuppliers = "";
    if (this.selectedSuppliers.length > 0) {
      let cont = 0;
      for (let i = 0; i < this.selectedSuppliers.length; i++) {
        cont += 1;
        this.supplierinput = this.supplierinput == "" ? this.selectedSuppliers[i].socialReason : cont >= 5 ? cont + " proveedores seleccionados" : this.supplierinput + ", " + this.selectedSuppliers[i].socialReason;
        //this.filters.supplierstring= this.supplierstring;
        this.filters.idSuppliers = this.filters.idSuppliers == "" ? this.selectedSuppliers[i].id : this.filters.idSuppliers + "," + this.selectedSuppliers[i].id;
        this.FiltersChange.emit(this.filters);
        this.supplierinputChange.emit(this.supplierinput);
        this.visible = false;
      }
    }else{
      this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Debe seleccionar al menos un proveedor." });
    }
  }
}
