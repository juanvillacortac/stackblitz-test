import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { CountryFilter } from 'src/app/modules/masters/country/shared/filters/country-filter';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { SupplierClasificationFilter } from 'src/app/modules/masters/supplierclasification/shared/filters/supplier-clasification-filter';
import { SupplierclasificationService } from 'src/app/modules/masters/supplierclasification/shared/services/supplierclasification.service';
import { SupplierFilter } from 'src/app/modules/srm/shared/filters/supplier-filter';
import { SuppliercatalogService } from 'src/app/modules/srm/shared/services/suppliercatalog/suppliercatalog.service';
import { Suppliermodal } from 'src/app/modules/srm/shared/view-models/common/suppliermodal';
import { SupplierempViewmodel } from 'src/app/modules/srm/shared/view-models/suppliersemp-viewmodel';

@Component({
  selector: 'app-supplier-common-modal',
  templateUrl: './supplier-common-modal.component.html',
  styleUrls: ['./supplier-common-modal.component.scss']
})
export class SupplierCommonModalComponent implements OnInit {
  @ViewChild('dt',{static:false})dt:any
  selectedSuppliers: any;
  selectedSuppliersOnly: SupplierempViewmodel = null;
  loading: boolean = false;
  @Input() visible: boolean = false;
  supplierFilters: SupplierFilter = new SupplierFilter();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Input("multiple") multiple : boolean= false;
  @Input() model:boolean=false;
  @Input("suppliermodal") suppliermodal: Suppliermodal = new Suppliermodal();
  @Output("suppliermodalChange") suppliermodalChange= new  EventEmitter<Suppliermodal>();
  @Output("onSubmit") onSubmit = new EventEmitter<{supplier: Suppliermodal, identifier: number}>();

  classificationlist: SelectItem[];
  countryList: SelectItem[];

  displayedColumns: ColumnD<SupplierempViewmodel>[] =
  [
    { template: (data) => { return data.id; }, header: 'Código', field: 'id', display: 'none' },
    { template: (data) => { return data.document; }, header: 'Documento', field: 'document', display: 'table-cell' },
    { template: (data) => { return data.socialReason; }, header: 'Razón social', field: 'socialReason', display: 'table-cell' },
    { template: (data) => { return data.country; }, header: 'País', field: 'country', display: 'table-cell' },
    { template: (data) => { return data.classification; }, header: 'Clasificación', field: 'classification', display: 'table-cell' }

  ];

  constructor(private messageService: MessageService,
    public _SupplierService: SuppliercatalogService,
    private _supplierclasificationservice: SupplierclasificationService,
    private _countryservice: CountryService) { }

  ngOnInit(): void {
    this.onLoadClassification();
    this.onLoadCountry();
  }

  onLoadClassification(){
    var filter: SupplierClasificationFilter = new SupplierClasificationFilter()
    filter.id = -1;
    this._supplierclasificationservice.getSupplierClasificationList(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.supplierclasification.localeCompare(b.supplierclasification));
      this.classificationlist = data.map((item)=>({
        label: item.supplierclasification,
        value: item.id
      }));
    },(error)=>{
    });
  }

  onLoadCountry(){
    var filter: CountryFilter = new CountryFilter();
    filter.idCountry = -1;
    filter.active=1;
    this._countryservice.getCountriesList(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.countryList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
    });
  }

  clearFilters(){
    this.supplierFilters.id=-1;
    this.supplierFilters.document="";
    this.supplierFilters.socialReason="";
    this.supplierFilters.idCountry=-1;
    this.supplierFilters.classificationId=-1;
    this.supplierFilters.active=1;
 
   }
 
   loadSuppliers() {
     this.loading = true;
     this.supplierFilters.idCom = 1;
     this.supplierFilters.active = 1;
     this._SupplierService.getSupplierListclass(this.supplierFilters).subscribe((data: SupplierempViewmodel[]) => {
       this._SupplierService._SupplierClassiList = data;
       this.loading = false;
     }, (error: HttpErrorResponse) => {
       this.loading = false;
       this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los proveedores" });
     });
   }


   onShow() {
    this.loadSuppliers();
    this.emitVisible();
  }

  onHide() {
    this.emitVisible();
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
 }
  }

  emitVisible() {
    this.onToggle.emit(this.visible);
  }

  submitSuppliers() {
    if (this.multiple) {
      if (this.selectedSuppliers.length > 0) {
        this.suppliermodal.socialReason = "";
        this.suppliermodal.id = -1;
        let cont = 0;
        for (let i = 0; i < this.selectedSuppliers.length; i++) {
          cont += 1;
          this.suppliermodal.socialReason = this.suppliermodal.socialReason == "" ? this.selectedSuppliers[i].socialReason : cont >= 5 ? cont + " proveedores seleccionados" : this.suppliermodal.socialReason + ", " + this.selectedSuppliers[i].socialReason;
          this.suppliermodal.idSupplier = this.suppliermodal.idSupplier == "" ? this.selectedSuppliers[i].id.toString() : this.suppliermodal.idSupplier + "," + this.selectedSuppliers[i].id;
          this.suppliermodalChange.emit(this.suppliermodal);
          this.visible = false;
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Seleccione al menos un proveedor." });
      }
    } else {
      if (this.selectedSuppliers!= null && this.selectedSuppliers.length==undefined) {
        this.selectedSuppliersOnly = this.selectedSuppliers;
        this.suppliermodal.socialReason = this.selectedSuppliersOnly.socialReason;
        this.suppliermodal.document= this.selectedSuppliersOnly.identifier+"-"+this.selectedSuppliersOnly.document;
        this.suppliermodal.id = this.selectedSuppliersOnly.id;
        this.suppliermodal.idSupplierCom= this.selectedSuppliersOnly.idSupplierCom;
        this.suppliermodal.direction = this.selectedSuppliersOnly.direction;
        this.suppliermodalChange.emit(this.suppliermodal);
        this.visible = false;
      } else {

        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Seleccione al menos un proveedor." });
      }

    }
  }


}
