import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SensitivityLevel } from 'src/app/models/masters-mpc/common/sensitivitylevel';
import { LogisticDataIndicator } from 'src/app/models/products/logisticDataIndicator';
import { Packing } from 'src/app/models/products/packing';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { Product } from 'src/app/models/products/product';
import { Specification } from 'src/app/models/products/specification';
import { SensitivitylevelFilter } from 'src/app/modules/masters-mpc/shared/filters/common/sensitivitylevel-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { LogisticdataindicatorFilter } from '../../../shared/filters/logisticdataindicator-filter';
import { PackingFilter } from '../../../shared/filters/packing-filter';
import { SpecificationFilter } from '../../../shared/filters/specification-filter';
import { LogisticdataindicatorService } from '../../../shared/services/logisticdataindicatorservice/logisticdataindicator.service';
import { PackingService } from '../../../shared/services/packingservice/packing.service';
import { SpecificationService } from '../../../shared/services/specificationservice/specification.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { SpecificationValues } from '../../../shared/view-models/specificationvalues';
import { Typeattributes } from '../../../shared/Utils/typeattributes';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-logistic-data',
  templateUrl: './logistic-data.component.html',
  styleUrls: ['./logistic-data.component.scss'],
  providers: [DatePipe]
})
export class LogisticDataComponent implements OnInit {

  @Input("productPacking") productPacking: PackingByBranchOffice = new PackingByBranchOffice();
  @Input("showDialog") showDialog : boolean;
  @Output("showDialogChange") showDialogChange = new EventEmitter<boolean>();
  packingList: Packing[];
  _sensitivityLevelOptions: SelectItem[];
  _logisticDataIndicator: LogisticDataIndicator = new LogisticDataIndicator();
  submitted: boolean = false;
  SpecificationAggrupationList: Specification[] = [];
  SpecificationList: Specification[] = [];
  permissionsIDs = { ...Permissions };
  dimensions: string = "";
  displayedColumnsPacking: ColumnD<Packing>[] =
    [
      { template: (data) => { return data.barcode; }, header: 'Barra', field: 'barcode', display: 'table-cell' },
      { template: (data) => { return data.packingType.name; }, field: 'packingType.name', header: 'Tipo de empaque', display: 'table-cell' },
      { template: (data) => { return data.packagingPresentation.name; }, field: 'packagingPresentation.name', header: 'Empaque', display: 'table-cell' },
      { template: (data) => { return data.units; }, field: 'units', header: 'Unidades', display: 'table-cell' },
      { template: (data) => { return data.dimensions; }, field: 'dimensions', header: 'Dimensiones', display: 'table-cell' },
      /* { template: (data) => { return data.high; }, field: 'high', header: 'Altura', display: 'table-cell' },
      { template: (data) => { return data.width; }, field: 'width', header: 'Ancho', display: 'table-cell' },
      { template: (data) => { return data.length; }, field: 'width', header: 'Ancho', display: 'table-cell' },
      { template: (data) => { return data.volume; }, field: 'volume', header: 'Volumen', display: 'table-cell' } */
    ];
    loading: boolean = true;

  constructor(private _packingService: PackingService,
    private messageService: MessageService,
    private _logisticDataIndicatorService: LogisticdataindicatorService,
    private _commonService: CommonService,
    private _specificationservice: SpecificationService,
    public userPermissions: UserPermissions,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
  }

  seacrhPackingandIndicators(idProduct: number) {
    this.loading = true;
    this.loadSensitivityLevel();
    this.searchSpecifications(idProduct);
    this.loadPackings(idProduct);
    this.loadIndicators(idProduct);
  }

  loadPackings(idProduct: number) {
    var filterPacking = new PackingFilter();
    filterPacking.id = -1;
    filterPacking.productId = idProduct;
    this._packingService.getPackingbyfilter(filterPacking).subscribe((data: Packing[]) => {
      this._packingService._packingList = data.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime());
      this.packingList = this._packingService._packingList;
      this.packingList.forEach(packing => {
        packing.dimensions = "Altura: " + packing.high + " cm" + "\n Ancho: " + packing.width + " cm" + "\n Largo: " + packing.length + " cm" + "\n Volumen: " + packing.volume + " cm3";
      });
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los empaques." });
    });
  }

  loadIndicators(idProduct: number) {
    var filterIndicators = new LogisticdataindicatorFilter();
    filterIndicators.productId = +idProduct;
    this._logisticDataIndicatorService.getLogisticDataIndicatorbyfilter(filterIndicators).subscribe((data: LogisticDataIndicator) => {
      if (data == undefined || data == null) {
        data = new LogisticDataIndicator();
        data.product = new Product();
        data.product.productId = +idProduct;
        data.id = -1;
        data.sensitivityLevel = new SensitivityLevel();
        data.sensitivityLevel.id = 0;
      }
      if (data.id == 0) {
        data.id = -1;
      }
      this._logisticDataIndicatorService._LogisticDataIndicator = data;
      this._logisticDataIndicator = this._logisticDataIndicatorService._LogisticDataIndicator;
      this._logisticDataIndicator.product.productId = +idProduct;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los indicadores." });
    });
  }

  loadSensitivityLevel() {
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

  saveIndicatorsLogisticData() {
    this.submitted = true;
    this._logisticDataIndicatorService.postLogisticDataIndicator(this._logisticDataIndicator).subscribe((data: number) => {
      if (data > 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.showDialog = false;
        this.showDialogChange.emit(this.showDialog);
        this.submitted = false;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los indicadores" });
        this.submitted = false;
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los indicadores" });
      this.submitted = false;
    });
  }

  searchSpecifications(idProduct: number) {
    this.SpecificationAggrupationList = [];
    var filter = new SpecificationFilter();
    filter.productId = +idProduct;
    this._specificationservice.getSpecifications(filter).subscribe((data: Specification[]) => {

      data.forEach(specification => {
        if (this.SpecificationAggrupationList.length == 0) {
          this.SpecificationAggrupationList.push(specification);
        }
        else{
          if(this.SpecificationAggrupationList.filter(x => x.attributeagrupation.id == specification.attributeagrupation.id).length == 0){
            this.SpecificationAggrupationList.push(specification);
          }
        }
      });
      this.SpecificationList = data;
      this._specificationservice._specificationList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las especificaciones." });
    });
  }

  getSpecifications(idattributeagrupation: number){
    var specifications = this.SpecificationList.filter(x => x.attributeagrupation.id == idattributeagrupation);
    return specifications;
  }

  getValue(values: SpecificationValues[], idAttributeType: number){
    var rvalue: SpecificationValues[] = [];
    var v: string = "";
    values.forEach(val => {
      
        
        v = v == "" ? idAttributeType == 1 ? val.attributeoption.name : val.value : idAttributeType == 1 ? v + ", " + val.attributeoption.name : v + ", " + val.value;
        if (idAttributeType == Typeattributes.Binary) {
          v = v == "true" ? "Si" : "No";
        }
    });
    var valuee = new SpecificationValues();
    valuee.value = v;
    rvalue.push(valuee);
    return rvalue;
  }
}
