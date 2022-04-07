import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { InventoryExistence } from 'src/app/models/ims/inventory-existence';
import { PackOperationType } from 'src/app/models/ims/pack-operation-type.enum';
import { Brands } from 'src/app/models/masters/brands';
import { Packing } from 'src/app/models/products/packing';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { BrandsService } from 'src/app/modules/masters/brand/shared/services/brands.service';
import { PackingFilter } from 'src/app/modules/products/shared/filters/packing-filter';
import { PackingService } from 'src/app/modules/products/shared/services/packingservice/packing.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { InventoryLotAndExpirationDateModalComponent } from '../inventory-lot-and-expiration-date-modal/inventory-lot-and-expiration-date-modal.component';
import { InventoryExistenceFilter } from '../shared/filters/inventory-existence-filter';
import { InventoryExistenceService } from '../shared/services/inventory-existence.service';
import { InventoryExistenceViewmodel } from '../shared/view-models/inventory-existence-viewmodel';

@Component({
  selector: 'app-inventory-existence-list',
  templateUrl: './inventory-existence-list.component.html',
  styleUrls: ['./inventory-existence-list.component.scss']
})



export class InventoryExistenceListComponent implements OnInit {
  InventoryExistenceshowDialog = false;
  showFilters = true;
  showDialog = false;
  loading = false;
  selectedProduct: InventoryExistenceViewmodel = new InventoryExistenceViewmodel();
  inventoryExistenceFilters: InventoryExistenceFilter = new InventoryExistenceFilter();
  @ViewChild(InventoryLotAndExpirationDateModalComponent, { static: true }) modal: InventoryLotAndExpirationDateModalComponent;

  displayedColumns: ColumnD<InventoryExistenceViewmodel>[] =
  [
    {field: 'edit', header: '', display: 'table-cell'},
    { template: (data) => data.branchoffice, header: 'Sucursal', field: 'branchoffice', display: 'table-cell' },
    { template: (data) => data.inventoryarea, header: 'Área', field: 'inventoryarea', display: 'table-cell' },
    { template: (data) => data.existence.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}), header: 'Existencia', field: 'existence' , display: 'table-cell' },
    { template: (data) => data.bar, header: 'Barra', field: 'bar', display: 'table-cell' },
    { template: (data) => data.productname, header: 'Nombre del producto', field: 'productname' , display: 'table-cell' },
    { template: (data) => data.reference, header: 'Referencia interna', field: 'reference' , display: 'table-cell' },
    { template: (data) => data.factoryreference, header: 'Referencia fábrica', field: 'factoryreference' , display: 'table-cell' },
    // { template: (data) => { return data.sku; }, header: 'SKU',field:'sku' ,display: 'table-cell' },
    
    { template: (data) => data.presentation, header: 'Presentación', field: 'presentation' , display: 'table-cell' },
    { template: (data) => data.scalecode, header: 'Código de balanza', field: 'scalecode' , display: 'table-cell' },
    { template: (data) => data.productestatus, header: 'Estatus del producto', field: 'productestatus' , display: 'table-cell' },
    { template: (data) => data.producttype, header: 'Tipo de producto', field: 'producttype' , display: 'table-cell' },
    { template: (data) => data.category, header: 'Categoría', field: 'category' , display: 'table-cell' },
    { template: (data) => data.brand, header: 'Marca', field: 'brand' , display: 'table-cell' },
    { template: (data) => data.supplier, header: 'Proveedor', field: 'supplier' , display: 'table-cell' },
    { template: (data) => data.clasification, header: 'Clasificación', field: 'clasification' , display: 'table-cell' },
    { template: (data) => data.indheavyproduct, header: 'Pesado', field: 'indheavyproduct' , display: 'table-cell' },
    { template: (data) => data.basecost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), header: 'Costo base', field: 'basecost' , display: 'table-cell' },
    { template: (data) => data.conversioncost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), header: 'Costo base conversión', field: 'conversioncost' , display: 'table-cell' },
    // { template: (data) => data.ciffactor.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), header: 'Factor CIF', field: 'ciffactor' , display: 'table-cell' },
    { template: (data) => data.netfactor.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), header: 'Factor neto', field: 'netfactor' , display: 'table-cell' },
    { template: (data) => data.basenetcost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), header: 'Costo neto base', field: 'basenetcost' , display: 'table-cell' },
    { template: (data) => data.netcostconversion.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), header: 'Costo neto conversión', field: 'netcostconversion' , display: 'table-cell' },
    { template: (data) => data.netsalesfactor.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), header: 'Factor neto ventas', field: 'netsalesfactor' , display: 'table-cell' },
    { template: (data) => data.netcostsellbase.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), header: 'Costo neto ventas base', field: 'netcostsellbase' , display: 'table-cell' },
    { template: (data) => data.netcostsellconversion.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                header: 'Costo neto ventas conversión', field: 'netcostsellconversion' , display: 'table-cell' },
    { template: (data) => data.sellfactor.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), header: 'Factor venta', field: 'sellfactor' , display: 'table-cell' },
    { template: (data) => data.basePvp.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                header: 'PVP', field: 'basepvp' , display: 'table-cell' },
    { template: (data) => data.pvpconversion.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), header: 'PVP conversión', field: 'pvpconversion' , display: 'table-cell' }    
  ];
  permissionsIDs = {...Permissions};
  packOperationType = PackOperationType.repack;
  packOperationOptions: MenuItem[];
  packOperationSidebarShow = false;
  productPackages: Packing[];

  constructor(private breadcrumbService: BreadcrumbService ,
              public _inventoryExistenceService: InventoryExistenceService,
              private messageService: MessageService,
              public userPermissions: UserPermissions,
              private route: Router,
              private readonly loadingService: LoadingService,
              private dialogService: DialogsService,
              private _httpClient: HttpClient,
              private _packingService: PackingService
             ) {
              this.breadcrumbService.setItems([
                { label: 'OSM' },
                { label: 'IMS' },
                { label: 'Existencias de inventario', routerLink: ['/ims/inventory-existence-list'] }
                ]);
              }

   _Authservice: AuthService = new AuthService(this._httpClient);
  ngOnInit(): void {
    // this.search();
  }

  search() {
    this.loading = false;
    this.loadInventoryExistenceList();
  }

  private loadInventoryExistenceList() {
    debugger
    this.loadingService.startLoading();
    this.inventoryExistenceFilters.idbranchoffice=this._Authservice.currentOffice;
    this._inventoryExistenceService
    .getInventoryExistenceList({...this.inventoryExistenceFilters})
    .then(data =>  this._inventoryExistenceService._inventoryExistenceList = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('ims.inventory_existences.inventory_existence', error?.error?.message ?? 'error_service');
  }

  onShowProductDetail(productExistence: InventoryExistenceViewmodel) {
    this._inventoryExistenceService.selectedProduct = productExistence;
    this.route.navigate(['/ims/product-existence-detail', productExistence.idproduct]);
  }
  onShowModal(){
    this.modal.showModal = true;

  }
  toggleMenu(menu, $event, product) {
    this.loadDefaultOptions();
    this.loadPackagetype(product);
    //this.loadPackOperationOptions(product);
    menu.toggle($event);
  }

  private loadDefaultOptions(){
    this.packOperationOptions = [];
    this.packOperationOptions.push(
      {label: 'Cargando...', icon: 'pi pi-spin pi-spinner'});
  }
  private loadPackagetype(product) {
    const filter = new PackingFilter();
    filter.id = product.idPackage;
    filter.productId =product.idproduct
    this._packingService.getPackingPromise(filter)
        .then(data => this.loadPackOperationOptions(data,product))
        .catch(error => this.handleError(error));
  }

  loadPackOperationOptions(data, productExistence: InventoryExistenceViewmodel) {
    this.packOperationOptions = [];
    const isIndividualPack = data.filter(p=> p.packingType.id === 2)?.length > 0 ?? false;
    const operationLabel = isIndividualPack ? 'Reempacar': 'Descomponer';
    const operationIcon =  isIndividualPack ? 'pi pi-inbox': 'pi pi-clone';
    this.packOperationOptions.push(
      {label: operationLabel, icon: operationIcon, command: () => {
          this.packOperationType = isIndividualPack ? PackOperationType.repack : PackOperationType.unpack;
          this.packOperationSidebarShow = true;
          this.selectedProduct = productExistence;
      }}
    );
  }
  childCallBack(value){
    this.packOperationSidebarShow = false;
  }
}
