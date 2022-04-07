import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Season } from 'src/app/models/masters-mpc/season';
import { Validationrange } from 'src/app/models/masters-mpc/validationrange';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { PointOrder } from 'src/app/models/products/pointorder';
import { ValidationFactor } from 'src/app/models/products/validationfactor';
import { SeasonFilter } from 'src/app/modules/masters-mpc/shared/filters/season-filter';
import { ValidationrangeFilter } from 'src/app/modules/masters-mpc/shared/filters/validationrange-filter';
import { SeasonService } from 'src/app/modules/masters-mpc/shared/services/SeasonService/season.service';
import { ValidationrangeService } from 'src/app/modules/masters-mpc/shared/services/ValidationRange/validationrange.service';
import { PointOrderFilter } from '../../../shared/filters/pointorderfilter';
import { ValidationFactorFilter } from '../../../shared/filters/validationfactorfilter';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.scss']
})
export class ValuesComponent implements OnInit {

  @Input("productPacking") productPacking: PackingByBranchOffice = new PackingByBranchOffice();
  validationRangeListPO: SelectItem[];
  validationRangeListFV: SelectItem[];
  seasonList: SelectItem[];
  pointOrder: PointOrder = new PointOrder();
  pointOrderList: PointOrder[] = [];
  pointOrderListDB: PointOrder[] = [];
  submittedPO: boolean = false;
  submittedFV: boolean = false;
  validationFactor: ValidationFactor = new ValidationFactor();
  listValidationRange: Validationrange[] = [];
  indPointOrder: boolean = false;
  indFactorValidation: boolean = false;
  saveIndPointOrder: boolean = false;
  saveIndFactorValidation: boolean = false;
  permissionsIDs = { ...Permissions };
  clonedProducts: { [s: string]: PointOrder; } = {};
  editing: boolean = false;
  disabledcheck: boolean = false;
  seasonselected: number = 0;

  constructor(private messageService: MessageService,
    private seasonService: SeasonService,
    private validationRange: ValidationrangeService,
    private productBrachOfficeService: ProductbranchofficeService,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {
  }

  load(idProduct: number, idBranchOffice: number, idPacking: number) {

    this.searchValidationsRange();
    this.searchValidationFactorbyBranchOffice(idProduct, idBranchOffice, idPacking);
    this.searchPointOrdersbyBranchOffice(idProduct, idBranchOffice, idPacking);
  }

  changeSeason(){
    this.pointOrder = this.pointOrderList.find(x => x.season.id == this.seasonselected);
  }

  searchValidationsRange() {
    var filters = new ValidationrangeFilter();
    filters.typeValidationRangeId = 1;
    filters.active = 1;
    this.validationRange.geValidationRangebyfilter(filters).subscribe((data: Validationrange[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.listValidationRange = data;
      this.validationRangeListPO = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
      this.validationRangeListFV = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los rangos de validación" });
    });
  }

  changeValidationRangePO() {
    var validarionrange = this.listValidationRange.find(x => x.id == this.pointOrder.idValidationRange);
    this.pointOrder.minFactor = validarionrange.minimum;
    this.pointOrder.midFactor = validarionrange.middle;
    this.pointOrder.maxFactor = validarionrange.maximum;
  }

  changeValidationRangeFV() {
    var validarionrange = this.listValidationRange.find(x => x.id == this.validationFactor.idValidationRange);
    this.validationFactor.minFactor = validarionrange.minimum;
    this.validationFactor.midFactor = validarionrange.middle;
    this.validationFactor.maxFactor = validarionrange.maximum;
  }

  clear(event) {
    if (event.target.value == "0,00") {
      event.target.value = "";
    }
  }

  savePointOrder() {
    this.submittedPO = true;
    if (this.pointOrder.idPacking > 0 && this.pointOrder.season.id > 0 && this.pointOrder.minFactor > 0 && this.pointOrder.midFactor >= this.pointOrder.minFactor && this.pointOrder.maxFactor >= this.pointOrder.midFactor) {
      var pointOrderlist: PointOrder[] = [];
      this.pointOrder.idProduct = parseInt(this.productPacking.idProduct.toString());
      this.pointOrder.idPacking = parseInt(this.productPacking.idPacking.toString());
      this.pointOrder.active = true;
      this.pointOrder.idSeason = this.pointOrder.season.id;
      this.pointOrder.idBranchOffice = parseInt(this.productPacking.idBranchOffice.toString());
      pointOrderlist.push(this.pointOrder);
      this.productBrachOfficeService.postPointOrder(pointOrderlist).subscribe((data) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.submittedPO = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el punto de pedido" });
        }
      }, (error) => {
        console.log(error);
      });
    }
  }


  saveFactorValidation() {
    this.submittedFV = true;
    if (this.validationFactor.idPacking > 0 && this.validationFactor.minFactor > 0 && this.validationFactor.midFactor >= this.validationFactor.minFactor && this.validationFactor.maxFactor >= this.validationFactor.midFactor) {
      var validationfactorlist: ValidationFactor[] = [];
      this.validationFactor.idProduct = parseInt(this.productPacking.idProduct.toString());
      this.validationFactor.idPacking = parseInt(this.productPacking.idPacking.toString());
      this.validationFactor.idBranchOffice = parseInt(this.productPacking.idBranchOffice.toString());
      this.validationFactor.active = true;
      validationfactorlist.push(this.validationFactor);
      this.productBrachOfficeService.postValidationFactor(validationfactorlist).subscribe((data) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.submittedFV = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el factor de validación" });
        }
      }, (error) => {
        console.log(error);
      });
    }
  }

  searchValidationFactorbyBranchOffice(idProduct: number, idBranchOffice: number, idPacking: number) {
    var validationFactorFilter = new ValidationFactorFilter()
    validationFactorFilter.idBranchOffice = parseInt(idBranchOffice.toString());
    validationFactorFilter.idProduct = parseInt(idProduct.toString());
    validationFactorFilter.idPacking = parseInt(idPacking.toString());
    this.productBrachOfficeService.getValidationFactorbyfilter(validationFactorFilter).subscribe((data: ValidationFactor[]) => {
      if (data.length > 0) {
        this.validationFactor = data[0];
        this.indFactorValidation = true;
      }else{
        this.validationFactor = new ValidationFactor();
        this.indFactorValidation = false;
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los factores de validacion" });
    });
  }

  searchPointOrdersbyBranchOffice(idProduct: number, idBranchOffice: number, idPacking: number) {
    var pointOrderFilter = new PointOrderFilter();
    pointOrderFilter.idBranchOffice = parseInt(idBranchOffice.toString());
    pointOrderFilter.idProduct = parseInt(idProduct.toString());
    pointOrderFilter.idPacking = parseInt(idPacking.toString());
    this.productBrachOfficeService.getPointOrderbyfilter(pointOrderFilter).subscribe((data: PointOrder[]) => {
      if (data.length > 0) {
        this.seasonList = data.map((item) => ({
          label: item.season.name,
          value: item.season.id
        }));
        this.pointOrderList = data;
        this.pointOrderListDB = data;
        this.indPointOrder = true;
      }else{
        this.pointOrder = new PointOrder();
        this.indPointOrder = false;
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los puntos de pedidos" });
    });
  }
}
