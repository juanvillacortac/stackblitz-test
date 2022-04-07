import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Supplier } from 'src/app/models/masters/supplier';
import { CountryFilter } from 'src/app/modules/masters/country/shared/filters/country-filter';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { SupplierClasificationFilter } from 'src/app/modules/masters/supplierclasification/shared/filters/supplier-clasification-filter';
import { SupplierclasificationService } from 'src/app/modules/masters/supplierclasification/shared/services/supplierclasification.service';
import { SupplierFilter } from '../../../filters/supplier-filter';
import { SuppliercatalogService } from '../../../services/suppliercatalog/suppliercatalog.service';
import { Suppliermodal } from '../../../view-models/common/suppliermodal';
import { SupplierempViewmodel } from '../../../view-models/suppliersemp-viewmodel';

@Component({
  selector: 'app-modal-suppliergenerico',
  templateUrl: './modal-supplier.component.html',
  styleUrls: ['./modal-supplier.component.scss']
})
export class ModalSupplierComponent implements OnInit {
  @ViewChild('dt', {static: false})dt: any;
  selectedSuppliersOnly: any = null;
  loading = false;

  @Input() selectedSuppliers = [];
  @Input() getSelected = false;
  @Input() visible = false;
  supplierFilters: SupplierFilter = new SupplierFilter();
  @Output() onToggle = new EventEmitter<boolean>();
  @Input() multiple = false;
  @Input() model = false;

  @Input() suppliermodal: Suppliermodal;
  @Output() suppliermodalChange = new  EventEmitter<Suppliermodal>();
  @Output() suppliers = new  EventEmitter<any[]>();

  classificationlist: SelectItem[];
  countryList: SelectItem[];


  displayedColumns: ColumnD<SupplierempViewmodel>[] =
    [
      { template: (data) => { return data.id; }, header: 'Código', field: 'id', display: 'none' },
      { template: (data) => { return data.identifier +"-"+ data.document; }, header: 'Documento', field: 'document', display: 'table-cell' },
      // { template: (data) => { return data.documentType; }, header: 'Tipo de documento', field: 'documentType', display: 'table-cell' },
      { template: (data) => { return data.socialReason; }, header: 'Razón social', field: 'socialReason', display: 'table-cell' },
      { template: (data) => { return data.country; }, header: 'País', field: 'country', display: 'table-cell' },
      { template: (data) => { return data.classification; }, header: 'Clasificación', field: 'classification', display: 'table-cell' }

    ];

  constructor(private messageService: MessageService,
    public _SupplierService: SuppliercatalogService,
    private _supplierservice: SupplierService,
    private _supplierclasificationservice: SupplierclasificationService,
    private _countryservice: CountryService,
    private _authservice: AuthService) { }

  ngOnInit(): void {

  }

  onLoadClassification() {
    const filter: SupplierClasificationFilter = new SupplierClasificationFilter();
    filter.id = -1;
    filter.active=1;
    this._supplierclasificationservice.getSupplierClasificationList(filter)
    .subscribe((data) => {
      data = data.sort((a, b) => a.supplierclasification.localeCompare(b.supplierclasification));
      this.classificationlist = data.map((item) => ({
        label: item.supplierclasification,
        value: item.id
      }));
    }, (error) => {
    });
  }

  onLoadCountry() {
    const filter: CountryFilter = new CountryFilter();
    filter.idCountry = -1;
    filter.active = 1;
    this._countryservice.getCountriesList(filter)
    .subscribe((data) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.countryList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error) => {
    });
  }

  clearFilters() {
   this.supplierFilters.id = -1;
   this.supplierFilters.document = '';
   this.supplierFilters.socialReason = '';
   this.supplierFilters.idCountry = -1;
   this.supplierFilters.classificationId = -1;
   this.supplierFilters.active = 1;

  }

  loadSuppliers() {
    this.loading = true;
    this.supplierFilters.idCom = this._authservice.currentCompany;
    this.supplierFilters.active = 1;
    this._SupplierService.getSupplierListclass(this.supplierFilters).subscribe((data: SupplierempViewmodel[]) => {
     this.loadSupplierSuccess(data);
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los proveedores' });
    });
  }

loadSupplierSuccess(data: SupplierempViewmodel[]) {
  const list =  data.map(e => e['id'])
  // store the indexes of the unique objects
  .map((e, i, final) => final.indexOf(e) === i && i)
  // eliminate the false indexes & return unique objects
 .filter((e) => data[e]).map(e => data[e]);
 this._SupplierService._SupplierClassiList = list;
  this.loading = false;
}

  onShow() {
   this.onLoadClassification();
    this.onLoadCountry();
    this.loadSuppliers();
    this.emitVisible();
  }

  onHide() {
    this.emitVisible();
    this.selectedSuppliersOnly = null;
    if (!this.getSelected) {
     this.selectedSuppliers = [];
    }

    this.supplierFilters.active = 1;
    this.supplierFilters.classificationId = -1;
    this.supplierFilters.document = '';
    this.supplierFilters.socialReason = '';
    this.supplierFilters.idCountry = -1;
    this._SupplierService._SupplierClassiList = [];
    if (this.dt !== undefined) {
      this.dt.reset();
 }
  }

  emitVisible() {
    this.onToggle.emit(this.visible);
  }

  submitSuppliers() {
    if (this.getSelected) {
        this.submitSelectedMode();
    } else {
      this.submitCurrentMode();
    }
  }
  submitSelectedMode() {
    if (this.selectedSuppliers?.length > 0 || (!this.multiple && this.selectedSuppliers)) {
        this.suppliers.emit(this.selectedSuppliers);
        this.visible = false;
      } else {
        this.showErrorMessage();
      }
  }
  submitCurrentMode() {
    if (this.multiple) {
      if (this.selectedSuppliers.length > 0) {
          this.extractSupplierData();
      } else {
        this.showErrorMessage();
      }
    } else {
      if (this.selectedSuppliers != null && this.selectedSuppliers.length === undefined) {
        this.completeSingleSupplierModel();
      } else {
        this.showErrorMessage();
      }
    }
  }
  showErrorMessage() {
    this.messageService.add({ severity: 'error', summary: 'Alerta', detail: 'Seleccione al menos un proveedor.' });
  }
  completeSingleSupplierModel() {
    this.selectedSuppliersOnly = this.selectedSuppliers;
    this.suppliermodal.socialReason = this.selectedSuppliersOnly.socialReason;
    this.suppliermodal.document = this.selectedSuppliersOnly.identifier + '-' + this.selectedSuppliersOnly.document;
    this.suppliermodal.id = this.selectedSuppliersOnly.id;
    this.suppliermodal.idSupplierCom = this.selectedSuppliersOnly.idSupplierCom;
    this.suppliermodal.direction = this.suppliermodal.direction === '' ?
                                   this.selectedSuppliersOnly.direction : this.selectedSuppliersOnly.direction;
    this.suppliermodal.idPaymentCondition = this.selectedSuppliersOnly.idPaymentCondition;
    this.suppliermodal.indconsignment= this.selectedSuppliersOnly.indconsignment;
    this.suppliermodalChange.emit(this.suppliermodal);
    this.visible = false;
  }
  extractSupplierData() {
    this.suppliermodal.socialReason = '';
    this.suppliermodal.id = -1;
    this.suppliermodal.idSupplier = '';
    let cont = 0;
    for (let i = 0; i < this.selectedSuppliers.length; i++) {
      cont += 1;
      this.suppliermodal.socialReason = this.suppliermodal.socialReason === '' ?
                  this.selectedSuppliers[i].socialReason : cont >= 5 ? cont + ' proveedores seleccionados' :
                  this.suppliermodal.socialReason + ', ' + this.selectedSuppliers[i].socialReason;
      this.suppliermodal.idSupplier = this.suppliermodal.idSupplier === '' ?
                  this.selectedSuppliers[i].id : this.suppliermodal.idSupplier + ',' + this.selectedSuppliers[i].id;
      this.suppliermodal.direction = this.suppliermodal.direction === '' ?
                  this.selectedSuppliers[i].direction : this.selectedSuppliers[i].direction;
      this.suppliermodalChange.emit(this.suppliermodal);
      this.visible = false;
    }
  }
}
