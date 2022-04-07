import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { LogisticDataIndicator } from 'src/app/models/products/logisticDataIndicator';
import { Packing } from 'src/app/models/products/packing';
import { SensitivitylevelFilter } from 'src/app/modules/masters-mpc/shared/filters/common/sensitivitylevel-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { PackingFilter } from '../../shared/filters/packing-filter';
import { LogisticdataindicatorService } from '../../shared/services/logisticdataindicatorservice/logisticdataindicator.service';
import { PackingService } from '../../shared/services/packingservice/packing.service';
import { LogisticdataindicatorFilter } from '../../shared/filters/logisticdataindicator-filter';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { SensitivityLevel } from 'src/app/models/masters-mpc/common/sensitivitylevel';
import { Product } from 'src/app/models/products/product';
import { ProductcatalogFilter } from '../../shared/filters/productcatalog-filter';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { hosts } from 'src/environments/environment.prod';

@Component({
  selector: 'logisticdata-main',
  templateUrl: './logisticdata-main.component.html',
  styleUrls: ['./logisticdata-main.component.scss'],
  providers: [DecimalPipe]
})
export class LogisticdataMainComponent implements OnInit {
  @Input("idproduct") idproduct : number = 0;
  @Input("heavyInd") heavyInd : boolean = false;
  _logisticDataIndicator : LogisticDataIndicator = new LogisticDataIndicator();
  _packing : Packing = new Packing();
  _packingList: Packing[];
  _showdialog: Boolean = false;
  submitted: Boolean = false;
  _sensitivityLevelOptions: SelectItem[];
  loading: Boolean = false;
  permissionsIDs = {...Permissions};
  productcatalogfiltersOfValues: ProductcatalogFilter[] = [];
  aireI: Boolean = false;
  aireP: Boolean = false;
  successI: Boolean = false;
  tempCount: number = -2;
  _lockField:boolean=false;


  @Output("refreshchanges") refreshchanges = new EventEmitter<number>();
  @Output("clearchanges") clearchanges = new EventEmitter<number>();
  @Output("refreshcompleted") refreshcompleted = new EventEmitter();
  

  displayedColumns: ColumnD<Packing>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.barcode; },field: 'barcode', header: 'Barra', display: 'table-cell'},
   {template: (data) => { return data.packingType.name; },field: 'packingType.name', header: 'Tipo', display: 'table-cell'},
   {template: (data) => { return data.packagingPresentation.name; },field: 'packagingPresentation.name', header: 'Presentación', display: 'table-cell'},
   {template: (data) => { return data.useofPackaging.usePackaging; },field: 'useofPackaging.usePackaging', header: 'Uso', display: 'table-cell'},
   {template: (data) => { return data.units; },field: 'units', header: 'Número de unidades', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.volume == undefined ? 0 : data.volume, '.2')+" cm3"; },field: 'volume', header: 'Volumen', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.weight == undefined ? 0 : data.weight, '.2')+" Kg"; },field: 'weight', header: 'Peso', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'}
  ];


  constructor(private _logisticDataIndicatorService: LogisticdataindicatorService,
    private router: Router,
    private activatedRoute: ActivatedRoute, 
    private messageService: MessageService,
    private _packingService: PackingService,
    private _commonService: CommonService,
    private confirmationService:ConfirmationService,
    public userPermissions: UserPermissions,
    private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    if (this.productcatalogfiltersOfValues.length > 0) {
      this.productcatalogfiltersOfValues = this.productcatalogfiltersOfValues;
    }else{
      if (history.state.queryParams!=undefined) {
        const productcatalogfilters = history.state.queryParams.productcatalogfilters;
        if (productcatalogfilters === null) {
          this.productcatalogfiltersOfValues = [];
        } else {
          this.productcatalogfiltersOfValues = JSON.parse(productcatalogfilters);
 
          sessionStorage.setItem('searchParameters', productcatalogfilters)
        }
      }else{
        this.productcatalogfiltersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }
      
    }
    this._logisticDataIndicator= new LogisticDataIndicator();
    this._logisticDataIndicator.sensitivityLevel = new SensitivityLevel();
    this.loadSensitivityLevel();
    this.loadIndicators()
    this.loadPackings();
    if(hosts.API_BASE.startsWith('https://erp',0)){
      this._lockField=true;

    }
  }


  changeIndicators(){
    this.aireI = true;
    this.refreshchangesC();
  }

  changePackings(){
    this.aireP = true;
    this.refreshchangesC();
  }

  loadIndicators(){
    var filterIndicators = new LogisticdataindicatorFilter();
    filterIndicators.productId = +this.idproduct;
    this._logisticDataIndicatorService.getLogisticDataIndicatorbyfilter(filterIndicators).subscribe((data: LogisticDataIndicator) => {
      if(data == undefined || data == null){
        data = new LogisticDataIndicator();
        data.product = new Product();
        data.product.productId = +this.idproduct;
        data.id = -1;
        data.sensitivityLevel = new SensitivityLevel();
        data.sensitivityLevel.id = 0;
      }
      if(data.id == 0){
        data.id = -1;
      }
      this._logisticDataIndicatorService._LogisticDataIndicator = data;
      this._logisticDataIndicator = this._logisticDataIndicatorService._LogisticDataIndicator;
      this._logisticDataIndicator.product.productId = +this.idproduct;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los indicadores."});
    });
  }

  loadPackings(){
    var filterPacking = new PackingFilter();
    filterPacking.id = -1;
    filterPacking.productId = this.idproduct;
    this._packingService.getPackingbyfilter(filterPacking).subscribe((data: Packing[]) => {
      this._packingService._packingList = data.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime());
      this._packingList = this._packingService._packingList;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los empaques."});
    });
  }

  loadSensitivityLevel(){
    var filterSensitivity = new SensitivitylevelFilter();
    filterSensitivity.id = -1;
    this._commonService.getSensitivityLevel(filterSensitivity)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this._sensitivityLevelOptions = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onEdit(packing: Packing){
    this._packing = new Packing();
    this._packing.id = packing.id;
    this._packing.product = packing.product;
    this._packing.packingType = packing.packingType;
    this._packing.packagingPresentation = packing.packagingPresentation;
    this._packing.useofPackaging = packing.useofPackaging;
    this._packing.gtinType = packing.gtinType;
    this._packing.measurementUnit = packing.measurementUnit;
    this._packing.units = packing.units;
    this._packing.barcode = packing.barcode;
    this._packing.maxLitters = packing.maxLitters;
    this._packing.packingsByLitters = packing.packingsByLitters;
    this._packing.high = packing.high;
    this._packing.width = packing.width;
    this._packing.length = packing.length;
    this._packing.volume = packing.volume;
    this._packing.weight = packing.weight;
    this._packing.grossWeight = packing.grossWeight;
    this._packing.active = packing.active;
    this._packing.createdByUser = packing.createdByUser;
    this._packing.createdByUserId = packing.createdByUserId;
    this._packing.updatedByUser = packing.updatedByUser;
    this._packing.updatedByUserId = packing.updatedByUserId;
    this._packing.dateCreate = packing.dateCreate;
    this._packing.dateUpdate = packing.dateUpdate;
    this._packing.groupingGenerationBarId = packing.groupingGenerationBarId;
    this._packing.typeGenerationBarId = packing.typeGenerationBarId;
    this._showdialog = true;
  }

  newPacking(){
    this._packing = new Packing();
    this._packing.product = new Product();
    this._packing.product.productId = +this.idproduct
    this._showdialog = true;
    this.tempCount = 2;
    for(let element of this._packingList){
      if(element.id < 0){
        this.tempCount++;
      }
    }
    this.tempCount = this.tempCount*-1;

    
  }

  saveIndicators(){
    this._logisticDataIndicatorService.postLogisticDataIndicator(this._logisticDataIndicator).subscribe((data: number) => {
      if(data > 0) {
        this.successI = true;
        this.aireI=false;
        this.submitted = false;
        this.savePackings();
      }else{
        this.successI = false;
        this.savePackings();
      }
    }, (error: HttpErrorResponse)=>{
      this.successI = false;
      this.savePackings();
    });
  }
  savePackings(){
    for(let element of this._packingList){
      if(element.id < 0){
        element.id = -1;
      }
    }
    this._packingService.postPacking(this._packingList).subscribe((data: number) => {
      if(data > 0) {
        if(this.successI){
          this.messageService.add({severity:'success', summary:'Guardado', detail: "Indicadores y empaques guardados exitosamente"});
          this.clearchanges.emit();
          this.refreshcompleted.emit();
        }else{
          this.messageService.add({severity:'warn', summary:'Guardado parcial', detail: "Solo empaques guardados exitosamente"});
        }
        
        this.aireP=false;
        this.submitted = false;
        this.loadPackings();
      }else{
        if(this.successI){
          this.messageService.add({severity:'warn', summary:'Guardado parcial', detail: "Solo indicadores guardados exitosamente"});
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar los indicadores y empaques"});
        }
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar los indicadores y empaques"});
    });
  }

  saveLogisticData(){
    if(this.userPermissions.allowed(this.permissionsIDs.MANAGE_LOGISTIC_DATA_SECTION_PERMISSION_ID)){
      this.saveIndicators();
    }
  }

  back = () => {
    if (this.aireI || this.aireP) {
      this.ConfirmBack();
    }else{
      const queryParams: any = {};
          queryParams.productcatalogfilters = JSON.stringify(this.productcatalogfiltersOfValues);
          const navigationExtras: NavigationExtras = {
            queryParams
          };
          this.router.navigate(['mpc/productcatalog-list'],navigationExtras);
    }
    
  }

  ConfirmBack(){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'Si regresa al catálogo de productos, todos los cambios pendientes por guardar serán eliminados. ¿Desea continuar?',
      accept: () => {
        const queryParams: any = {};
          queryParams.productcatalogfilters = JSON.stringify(this.productcatalogfiltersOfValues);
          const navigationExtras: NavigationExtras = {
            queryParams
          };
          this.router.navigate(['mpc/productcatalog-list'],navigationExtras);
      },
      reject: (type) => {
      }
    })
  }

  refreshchangesC(){
    this.refreshchanges.emit();
  }

}
