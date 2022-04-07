import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { InventoryPackOperation } from 'src/app/models/ims/inventory-pack-operation';
import { InventoryPackOperationDetail } from 'src/app/models/ims/inventory-pack-operation-detail';
import { PackOperationType } from 'src/app/models/ims/pack-operation-type.enum';
import { Packing } from 'src/app/models/products/packing';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PackingFilter } from 'src/app/modules/products/shared/filters/packing-filter';
import { PackingService } from 'src/app/modules/products/shared/services/packingservice/packing.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { InventoryExistenceViewmodel } from '../../inventory-existence/shared/view-models/inventory-existence-viewmodel';
import { InventoryPackOperationService } from '../shared/services/inventory-pack-operation.service';

@Component({
  selector: 'app-inventory-pack-operation-detail',
  templateUrl: './inventory-pack-operation-detail.component.html',
  styleUrls: ['./inventory-pack-operation-detail.component.scss'],
  providers: [DatePipe]
})
export class InventoryPackOperationDetailComponent implements OnInit {

  @Input() productSelected: InventoryExistenceViewmodel;
  @Input() packOperationType: PackOperationType.repack;
  @Output() public hideDialogForm: EventEmitter<boolean> = new EventEmitter();
  qty: number;
  total:number;
  operationTypeSelected:SelectItem;
  packageTypeSelected: Packing;
  operationTypeList: SelectItem[];
  packageTypeList:  SelectItem<Packing[]> = {value: null};
  packOperation: InventoryPackOperation;
  finalDate = new Date();
  maxDate = new Date();
  showOperatorDialog = false;
  submitted = false;
  operatorId = -1;
  operatorName = '';
  packagesDetails: InventoryPackOperationDetail[] = [];
  packagesDetailsShowing:InventoryPackOperationDetail[] = [];
  cols: any[];
  productRepacked = false;
  title='';
  observation ='';
  productPackage: Packing;
  qtyMax = 0;
  user = '';
  currentExistence = 0;
  packageSaved = false;
  totalUnits = 0;
  constructor(
    private readonly loadingService: LoadingService,
    private _authService: AuthService,
    private dialogService: DialogsService,
    private translateService: TranslateService,
    public userPermissions: UserPermissions,
    public datepipe: DatePipe,
    public _inventoryPackOperationService: InventoryPackOperationService,
    public _packingService: PackingService) { }

  ngOnInit(): void {
    this.loadGlobalParameters();
    this.loadOperationTypeList();
    this.loadPackagetype();
    this.setupColumns();
    this.loadTitle();
  }
  loadGlobalParameters(){
    this.currentExistence = this.getExistence();
    this.user = this._authService.entityName;
  }
  loadTitle() {

    if(this.isRepack) {
      this.title = 'ims.pack_operation.repack';
      this.operationTypeSelected  = this.operationTypeList.find(p => p.value === '1');
    } else {
      this.title ='ims.pack_operation.unpack';
      this.operationTypeSelected  = this.operationTypeList.find(p => p.value === '2');
    }
  }

  filterPackagesListByOperation(data){
    this.productPackage = data.find(p => p.id === this.productSelected.idPackage);
    this.totalUnits = this.getProductUnits();
    this.isRepack ? this.filterPackagesToRepack(data):this.filterPackagesToUnpack(data);
  }
  filterPackagesToRepack(data){
    this.packageTypeList.value =  data.filter(p => p.units > this.productPackage.units && p.id !== this.productPackage.id)
  }

  filterPackagesToUnpack(data){
    this.packageTypeList.value = data;
    this.packageTypeSelected = data.find(p => p.packingType.id === 2 && p.id !== this.productPackage.id) ?? null;
    this.onPackageTypeSelected();
  }
  showOperatorModal() {
    this.showOperatorDialog = true;
  }

  onPackageTypeSelected(){
    this.qty = 0;
    this.qtyMax = this.getQtyMax();
  }

  onSubmitOperator(data)
  {
      this.operatorId = data.operator.id;
      this.operatorName = data.operator.name;
  }

  setupColumns() {
    this.cols = [
      { field: 'id', header: 'id', dataType: 'number', display: 'none' },
      { field: 'qty', header:  this.isRepack ? 'ims.pack_operation.qty_repacked' : 'ims.pack_operation.qty_unpacked', dataType: 'number', display: 'table-cell',
        tooltip:this.isRepack ?'ims.pack_operation.qty_repacked_tooltip' : 'ims.pack_operation.qty_unpacked_tooltip' },
      { field: 'pack', header: 'ims.pack_operation.pack', dataType: 'string', display: 'table-cell',  tooltip:'' },
      { field: 'totals', header: 'ims.pack_operation.totals', dataType: 'number', display: 'table-cell', tooltip:''},
      { field: 'edit', display: 'table-cell', header: '',dataType: '' }
    ];
  }
  onHideOperator(visible: boolean){
    this.showOperatorDialog = visible;
  }

  public onEmitHideForm(reload: boolean): void {
    this.hideDialogForm.emit(reload);
  }
  removePackage(item) {
    this.productRepacked = false;
    this.packagesDetails = this.packagesDetails.filter(x => x.id !== item.id);
    this.filterListByFinalDetail();
    this.currentExistence = this.getExistence();
    this.totalUnits = this.getProductUnits();
    this.qtyMax = this.getQtyMax();
  }
  addPackages(){
    this.packageSaved = true;
    if (this.invalidFields()) {return; }
    this.insertPackages();
    this.currentExistence = this.getExistence();
    this.totalUnits = this.getProductUnits();
    this.clearQty();
  }
  insertPackages(){
    const id = this.getMaxId() + 1;
    this.insertOriginDetail(id);
    this.insertFinalDetail(id);
    this.filterListByFinalDetail();
  }
 
  insertOriginDetail(id){
    this.packagesDetails.push({
      id: id,
      packOperationId: -1,
      areaId: this.productSelected.idinventoryarea,
      productId: this.productSelected.idproduct,
      packId: this.productSelected.idPackage,
      pack: '',
      unitsNumber:  this.productPackage.units,
      unitsShipped: this.isRepack ? this.calculateTotal() : this.qty,
      receivedUnits : 0,
      indOrigin: true,
      qty: this.qty,
      totals : this.calculateTotal()
    })
  }
  insertFinalDetail(id){
    this.packagesDetails.push({
      id: id,
      packOperationId: -1,
      areaId: this.productSelected.idinventoryarea,
      productId: this.productSelected.idproduct,
      packId: this.packageTypeSelected.id,
      pack: this.packageTypeSelected.packagingPresentation.name + ' - ' + this.packageTypeSelected.units,
      unitsNumber:  this.packageTypeSelected.units,
      unitsShipped: 0,
      receivedUnits: this.isRepack ? this.qty: this.calculateTotal(),
      indOrigin: false,
      qty: this.qty,
      totals : this.calculateTotal()
    })
  }
  getTotalUnitsResult(){
    return this.packagesDetailsShowing?.length !== 0 ?
           this.packagesDetailsShowing?.reduce((t, { totals }) => t + totals, 0) : 0;
  }
  getTotalQty(){
    return this.packagesDetailsShowing?.length !== 0 ?
           this.packagesDetailsShowing?.reduce((t, { qty }) => t + qty, 0) : 0;
  }
  getExistence(){
      const existenceUsed = this.isRepack ? this.getTotalUnitsResult() : this.getTotalQty();
    return this.productSelected.existence - existenceUsed ?? this.productSelected.existence;
  }
  getProductUnits(){
    return this.getExistence() * this.productPackage.units ?? 0;
  }
  filterListByFinalDetail() {
    this.packagesDetailsShowing = this.packagesDetails.filter(p => !p.indOrigin);
  }
  calculateTotal(){
    if(this.isRepack) {
      return this.qty * this.packageTypeSelected.units;
    } else {
      return this.qty * this.productPackage.units
    }
  }
  getQtyMax() {
    return ((this.getExistence() / this.packageTypeSelected?.units ?? 0)) ?? 0;
  }

  getMaxId() {
    return this.packagesDetails?.length !== 0 ?
           this.packagesDetails?.reduce((a,b) => a.id > b.id ? a : b).id : 0; 
  }
  clearQty(){
    this.qty = 0;
    this.qtyMax = this.getQtyMax();
    this.packageSaved = false;
    if(this.isRepack){
      this.packageTypeSelected = null;  
    }
  }
  onSave(){
    this.submitted = true;
    if(!this.isProductAdded) {return;}
    const operationDocumentId= this.isRepack ? 185 : 186;
    const modelToSave = this.loadModelToSave();
    this.saveOperation(modelToSave, operationDocumentId);
  }
  private loadModelToSave() {
    const model = new InventoryPackOperation();
          model.id = -1;
          model.areaId = this.productSelected.idinventoryarea;
          model.branchOfficeId = this.productSelected.idbranchoffice;
          model.details = this.packagesDetails;
          model.observations = this.observation;
          model.operationDate = this.datepipe.transform(this.finalDate, 'yyyyMMdd');
          model.operationType = Number(this.packOperationType);
          model.operatorId = this._authService.idUser;
          model.statusId = this.productSelected.idproductestatus ?? -1;
          model.operationDocumentTypeId = this.isRepack ? 18: 19;
    return model;
  }
  private saveOperation(model, operationDocumentId) {
    this.loadingService.startLoading();
    this._inventoryPackOperationService.createOperation(model, operationDocumentId)
        .then(() => this.successResult())
        .then(() => this.onEmitHideForm(false))
        .catch(error => this.handleError(error));
  }
  private loadPackagetype() {
    const filter = new PackingFilter();
    filter.productId = this.productSelected.idproduct;
    this.loadingService.startLoading();
    this._packingService.getPackingPromise(filter)
        .then(data => this.filterPackagesListByOperation(data))
        .then(() => this.loadingService.stopLoading())
        .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage(this.getTranslateLabel(this.isRepack ?'repack': 'unpack'), error?.error?.message ?? 'error_service');
  }
  private successResult() {
    this.loadingService.stopLoading();
    this.dialogService.successMessage(this.getTranslateLabel(this.isRepack ?'repack': 'unpack'), 'saved');
  }

  private loadOperationTypeList() {
    this.operationTypeList = [
      { label: 'Reempaque', value: '1'},
      { label: 'Descomponer', value: '2'}
      ];
  }

  private invalidFields() {
    return !this.isValidatePackageTypeSelected
        || !this.isValidateOperationTypeSelected
        || !this.isValidatedQty
  }
  private getTranslateLabel(key: string) {
    return `ims.pack_operation.${key}`;
  }

  get isRepack() {
    return this.packOperationType === PackOperationType.repack;
  }
  get isValidatePackageTypeSelected() {
    return this.packageTypeSelected?.id > -1 ?? false;
  }
  get isValidateOperationTypeSelected() {
    return this.operationTypeSelected?.value > -1 ?? false;
  }
  get isProductAdded(){
    return this.packagesDetails?.length > 0 ?? false;
  }
  get isValidatedQty(){
    return this.qty >= 1;
  }
  get qtyLabel(){
    const key = this.isRepack ? 'qty' : 'qty_unpack'
    return this.getTranslateLabel(key);
  }
  
}
