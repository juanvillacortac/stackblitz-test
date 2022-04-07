import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { type } from 'os';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { element } from 'protractor';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Specification } from 'src/app/models/products/specification';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { SpecificationFilter } from '../../shared/filters/specification-filter';
import { SpecificationService } from '../../shared/services/specificationservice/specification.service';
import { Typeattributes } from '../../shared/Utils/typeattributes';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Attributetype } from 'src/app/models/masters-mpc/common/attributetype';
import { Attributeagrupation } from 'src/app/models/masters-mpc/attributeagrupation';
import { Attributeoption } from 'src/app/models/masters-mpc/attributeoption';
import { Attribute } from 'src/app/models/masters-mpc/attribute';
import { measurementunits } from 'src/app/models/masters-mpc/measurementunits';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProductcatalogFilter } from '../../shared/filters/productcatalog-filter';
import { SpecificationValues } from '../../shared/view-models/specificationvalues';

@Component({
  selector: 'specifications-list',
  templateUrl: './specifications-list.component.html',
  styleUrls: ['./specifications-list.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class SpecificationsListComponent implements OnInit {
  loading: boolean = false;
  submitted: boolean;
  specificationDialog: boolean = false;
  specificationId: SpecificationFilter = new SpecificationFilter();
  specificationModel: Specification = new Specification();
  specificationFilters: SpecificationFilter = new SpecificationFilter();
  @Input("idproduct") idproduct: number = 0;
  @Output("refreshchanges") refreshchanges = new EventEmitter<number>();
  @Output("clearchanges") clearchanges = new EventEmitter<number>();
  permissionsIDs = { ...Permissions };
  dateaux: Date;
  productcatalogfiltersOfValues: ProductcatalogFilter[] = [];
  typeatribute: typeof Typeattributes = Typeattributes;
  @Output("refreshcompleted") refreshcompleted = new EventEmitter();

  //data.valor === "true" ? "Si" : data.valor === "false" ? "No" : data.valor;
  displayedColumns: ColumnD<Specification>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', field: 'Id', display: 'none' },
      { template: (data) => { return data.attributeagrupation.name; }, field: 'attributeagrupation.name', header: 'Agrupación', display: 'table-cell' },
      { template: (data) => { return data.attributes.name; }, field: 'attributes.name', header: 'Atributo', display: 'table-cell' },
      { template: (data) => { return data.value; }, field: 'value', header: 'Valor', display: 'table-cell' },
      { template: (data) => { return data.unitsmeasurement.name; }, field: 'unitsmeasurement.name', header: 'Unidad de medida', display: 'table-cell' },
      //  {field: 'active', header: 'Estatus', display: 'table-cell'},
      { template: (data) => { return data.createdByUser; }, field: 'createdByUser', header: 'Creado por', display: 'table-cell' }
    ];

  constructor(public _specificationservice: SpecificationService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public userPermissions: UserPermissions,
    public datepipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private confirmationService: ConfirmationService) {
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;

        if (value1 == null && value2 != null)
            result = -1;
        else if (value1 != null && value2 == null)
            result = 1;
        else if (value1 == null && value2 == null)
            result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
            result = value1.localeCompare(value2);
        else
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order * result);
    });
}

  ngOnInit(): void {
    if (this.productcatalogfiltersOfValues.length > 0) {
      this.productcatalogfiltersOfValues = this.productcatalogfiltersOfValues;
    } else {
      if (history.state.queryParams != undefined) {
        const productcatalogfilters = history.state.queryParams.productcatalogfilters;
        if (productcatalogfilters === null) {
          this.productcatalogfiltersOfValues = [];
        } else {
          this.productcatalogfiltersOfValues = JSON.parse(productcatalogfilters);

          sessionStorage.setItem('searchParameters', productcatalogfilters)
        }
      } else {
        this.productcatalogfiltersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }

    }
    this.search();
  }

  search() {
    this.loading = true;
    var filter = new SpecificationFilter();
    filter.productId = +this.idproduct;
    this._specificationservice.getSpecifications(filter).subscribe((data: Specification[]) => {
      console.log(data);
      data.forEach(prodspecification => {
        prodspecification.values.forEach(element => {
          if (prodspecification.attributeTypes.id == this.typeatribute.NumberDecimal) {
            element.value = this.decimalPipe.transform(element.value,'.2');
          }
          if (prodspecification.attributeTypes.id == this.typeatribute.Option) {
            element.value = element.attributeoption.name;
          }
          if (prodspecification.attributeTypes.id == this.typeatribute.Date) {
            this.dateaux = (new Date(element.value));
            //element.value = this.datepipe.transform(this.dateaux, "dd/MM/yyyy");
          }
          else if (prodspecification.attributeTypes.id == this.typeatribute.Time) {
            this.dateaux = (new Date(element.value));
            //element.value = this.datepipe.transform(this.dateaux, "HH:mm");
          } else if (prodspecification.attributeTypes.id == this.typeatribute.DateTime){
            this.dateaux = (new Date(element.value));
            //element.value = this.datepipe.transform(this.dateaux, "dd/MM/yyyy HH:mm");
          }
          else if (prodspecification.attributeTypes.id == this.typeatribute.Binary){
            element.value = element.value == "true" ? "Si" : "No";
          }
          prodspecification.value = prodspecification.value == "" || prodspecification.value == undefined ? element.value : prodspecification.value + ", " + element.value;
        });


      });
      this._specificationservice._specificationList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las especificaciones." });
    });
  }

  newSpecification() {
    this.specificationModel = new Specification();
    this.specificationModel.productId = +this.idproduct;
    this.specificationModel.attributeTypes = new Attributetype();
    this.specificationModel.attributeagrupation = new Attributeagrupation();
    //this.specificationModel.attributeoption = new Attributeoption();
    this.specificationModel.attributes = new Attribute;
    this.specificationModel.unitsmeasurement = new measurementunits();
    this.specificationModel.active = true;
    this.specificationDialog = true;
  }

  onEdit(specificationN: Specification) {
    this.specificationModel = new Specification();
    this.specificationModel.id = specificationN.id;
    this.specificationModel.productId = specificationN.productId;
    this.specificationModel.attributeTypes = new Attributetype();
    this.specificationModel.attributeTypes.id = specificationN.attributeTypes.id;
    this.specificationModel.attributeagrupation = new Attributeagrupation();
    this.specificationModel.attributeagrupation.id = specificationN.attributeagrupation.id;
    //this.specificationModel.attributeoption = new Attributeoption();
    //this.specificationModel.attributeoption.id = specificationN.attributeoption.id;
    this.specificationModel.attributes = new Attribute();
    this.specificationModel.attributes.id = specificationN.attributes.id;
    this.specificationModel.unitsmeasurement = new measurementunits();
    this.specificationModel.unitsmeasurement = specificationN.unitsmeasurement;
    this.specificationModel.values = specificationN.values;

    this.specificationModel.active = true;
    this.specificationDialog = true;
  }
  onRemoveSpecification(specificationN: Specification) {
    this.specificationModel.id = specificationN.id;
    this.specificationModel.productId = specificationN.productId;
    this.specificationModel.idAttribute = specificationN.attributes.id;
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Esta seguro que desea eliminar este atributo del producto?',
      accept: () => {
        this.delete();
      },
    });
  }
  delete() {
    this._specificationservice.deleteSpecification(this.specificationModel).subscribe((data: number) => {
      if (data > 0) {
        this.messageService.add({ severity: 'success', summary: 'Eliminar', detail: "Se ha eliminado el registro." });
        this.search();
      }
      else {

        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar el atributo." });
      }
    }, (error: HttpErrorResponse) => {

      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar el atributo." });
    });

  }

  back() {
    const queryParams: any = {};
    queryParams.productcatalogfilters = JSON.stringify(this.productcatalogfiltersOfValues);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['mpc/productcatalog-list'],navigationExtras);
  }

  voidrefreshcompleted(){
    this.refreshcompleted.emit();
  }

}

