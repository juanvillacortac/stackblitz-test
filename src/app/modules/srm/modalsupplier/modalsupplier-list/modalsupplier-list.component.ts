import { HttpErrorResponse } from '@angular/common/http';
import { ElementRef, ViewChild } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Supplier } from 'src/app/models/masters/supplier';
import { Productsxsupplier } from 'src/app/models/srm/productsxsupplier';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CountryFilter } from 'src/app/modules/masters/country/shared/filters/country-filter';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { SupplierViewmodel } from 'src/app/modules/masters/supplier/shared/view-models/supplier-viewmodel';
import { FilterPurchaseOrder } from '../../shared/filters/filter-purchase-order';
import { FilterViewerocSupplier } from '../../shared/filters/filter-vieweroc-supplier';
import { SupplierFilter } from '../../shared/filters/supplier-filter';
import { SuppliercatalogFilter } from '../../shared/filters/suppliercatalog-filter';
import { SuppliercatalogService } from '../../shared/services/suppliercatalog/suppliercatalog.service';
import { SupplierempViewmodel } from '../../shared/view-models/suppliersemp-viewmodel';

@Component({
  selector: 'app-modalsupplier-list',
  templateUrl: './modalsupplier-list.component.html',
  styleUrls: ['./modalsupplier-list.component.scss']
})
export class ModalsupplierListComponent implements OnInit {

  loading: boolean = false;
  supplierFilters: SupplierFilter = new SupplierFilter();
  suppliers: Supplier = new Supplier();
  @ViewChild("dtb") dtb: ElementRef;
  @ViewChild("dt") dt: Table;
  
  identifierToEdit: number = -1;
  selectedSuppliers: any[] = [];
  selectedSuppliersOnly: any = null;
  @Input() visible: boolean = false;
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Input("multiple") multiple: boolean = false;
  @Input("filters") filters: SuppliercatalogFilter;
  @Input("supplierinput") supplierinput: string;
  //datos para el modal de producto
  @Input("supplierxprod") supplierxprod: Productsxsupplier;
  @Input("suppliername") suppliername: string;

  @Output("suppliernameChange") suppliernameChange = new EventEmitter<string>();
  @Output("supplierxprodChange") supplierxprodChange = new EventEmitter<Productsxsupplier>();

  @Output("supplierinputChange") supplierinputChange = new EventEmitter<string>();
  @Output("FiltersChange") FiltersChange = new EventEmitter<SuppliercatalogFilter>();

  @Input("filtersvwsup") filtersvwsup: FilterViewerocSupplier;
  @Output("filtersvwsupChange") filtersvwsupChange = new EventEmitter<FilterViewerocSupplier>();
  //Variables de entrada modulo purchase-order
  @Input("filtersorder") filtersorder: FilterPurchaseOrder;

  classificationlist: SelectItem[];
  countryList: SelectItem[];


  displayedColumns: ColumnD<SupplierempViewmodel>[] =
    [
      { template: (data) => { return data.id; }, header: 'Código', field: 'id', display: 'none' },
      { template: (data) => { return data.document; }, header: 'Documento', field: 'document', display: 'table-cell' },
      // { template: (data) => { return data.documentType; }, header: 'Tipo de documento', field: 'documentType', display: 'table-cell' },
      { template: (data) => { return data.socialReason; }, header: 'Razón social', field: 'socialReason', display: 'table-cell' },
      { template: (data) => { return data.country; }, header: 'País', field: 'country', display: 'table-cell' },
      { template: (data) => { return data.classification; }, header: 'Clasificación', field: 'classification', display: 'table-cell' }

    ];

  constructor(private messageService: MessageService,
    public _SupplierService: SuppliercatalogService,
    private _supplierservice: SupplierService,
    private _countryservice: CountryService,
    private _Authservice: AuthService) { }

  ngOnInit(): void {

  }

  loadSuppliers() {
    this.loading = true;
    this.supplierFilters.idCom = this._Authservice.currentCompany;;
    this.supplierFilters.active = 1;
    this._SupplierService.getSupplierListclass(this.supplierFilters).subscribe((data: SupplierempViewmodel[]) => {
      this._SupplierService._SupplierClassiList = data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los proveedores" });
    });
  }

  searchprove() {
    this.loadSuppliers();
  }

  onShow() {
   
    this.loadSuppliers();
    this.emitVisible();
  }

  onHide() {
    this.suppliers = new Supplier();
    this.identifierToEdit = -1;
    this.selectedSuppliersOnly = null;
    this.selectedSuppliers = [];
    this.supplierFilters.active = 1;
    this.supplierFilters.classificationId = -1;
    this.supplierFilters.document = "";
    this.supplierFilters.socialReason = "";
    this.supplierFilters.idCountry = -1;
    this._SupplierService._SupplierClassiList = [];
    if(this.dt!=undefined){
      this.dt.reset();
  this.dtb.nativeElement.value = "";
  this.emitVisible();
  this.dt.filterGlobal("", 'contains')
 }
  }

  emitVisible() {
    this.onToggle.emit(this.visible);
  }

  submitSuppliers() {
    if (this.multiple) {
      if (this.selectedSuppliers.length > 0) {
        this.supplierinput = "";
        this.filters.idsupplier = "";
        //this.filtersvwsup.idsupplier="";
        let cont = 0;
        for (let i = 0; i < this.selectedSuppliers.length; i++) {
          cont += 1;
          this.supplierinput = this.supplierinput == "" ? this.selectedSuppliers[i].socialReason : cont >= 5 ? cont + " proveedores seleccionados" : this.supplierinput + ", " + this.selectedSuppliers[i].socialReason;
          //this.filters.supplierstring= this.supplierstring;
          this.filters.idsupplier = this.filters.idsupplier == "" ? this.selectedSuppliers[i].id : this.filters.idsupplier + "," + this.selectedSuppliers[i].id;
          this.FiltersChange.emit(this.filters);
          this.supplierinputChange.emit(this.supplierinput);
          this.visible = false;
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Seleccione al menos un proveedor." });
      }
    } else {
      if (this.selectedSuppliers!= null && this.selectedSuppliers.length==undefined) {
        this.selectedSuppliersOnly = this.selectedSuppliers;
        this.suppliername = this.selectedSuppliersOnly.socialReason;
        this.supplierxprod.suppliers.id = this.selectedSuppliersOnly.id;
        this.supplierxprod.suppliers.socialReason = this.selectedSuppliersOnly.socialReason;
        this.suppliernameChange.emit(this.suppliername);
        this.supplierxprodChange.emit(this.supplierxprod);
        this.visible = false;
      } else {

        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Seleccione al menos un proveedor." });
      }

    }
  }

}
