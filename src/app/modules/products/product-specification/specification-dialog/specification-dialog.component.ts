import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Specification } from 'src/app/models/products/specification';
import { AttributeFilter } from 'src/app/modules/masters-mpc/shared/filters/attribute-filter';
import { AttributeoptionFilter } from 'src/app/modules/masters-mpc/shared/filters/attributeoption-filter';
import { AttributesagrupationFilter } from 'src/app/modules/masters-mpc/shared/filters/attributesagrupation-filter';
import { AttributeagrupationService } from 'src/app/modules/masters-mpc/shared/services/attributeagrupation.service';
import { AttributeoptionService } from 'src/app/modules/masters-mpc/shared/services/AttributeOptionService/attributeoption.service';
import { AttributeService } from 'src/app/modules/masters-mpc/shared/services/AttributeService/attribute.service';
import { Attribute } from "src/app/models/masters-mpc/attribute";
import { OrderCodes } from 'src/app/modules/masters-mpc/shared/Utils/order-codes';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SpecificationFilter } from '../../shared/filters/specification-filter';
import { SpecificationService } from '../../shared/services/specificationservice/specification.service';
import { Typeattributes } from '../../shared/Utils/typeattributes';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Attributetype } from 'src/app/models/masters-mpc/common/attributetype';
import { Attributeagrupation } from 'src/app/models/masters-mpc/attributeagrupation';
import { Attributeoption } from 'src/app/models/masters-mpc/attributeoption';
import { SpecificationValues } from '../../shared/view-models/specificationvalues';
import { OptionxAttribute } from 'src/app/modules/masters-mpc/shared/filters/optionxattribute';

@Component({
  selector: 'specification-dialog',
  templateUrl: './specification-dialog.component.html',
  styleUrls: ['./specification-dialog.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class SpecificationDialogComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_specification") _specification: Specification;
  @Input("idproduct") idproduct: number;
  @Input("specificationList") specificationList: Specification[] = [];
  listspecification: Specification[] = [];
  listspecificationValues: SpecificationValues[] = [];
  submitted: boolean;
  _validations: Validations = new Validations();
  idAttributeOrigin: number = -1;
  _attributeagrupation: SelectItem[];
  _attribute: SelectItem[];
  _attributeoptionSelected: SelectItem[];
  _attributeoption: SelectItem[];
  _visibleOption: boolean = false;
  _typeAttribute: number;
  _date: Date;
  _check: boolean = false;
  typeatribute: typeof Typeattributes = Typeattributes;
  value: string = "";
  @Output("refreshcompleted") refreshcompleted = new EventEmitter();
  editDisabled = false;


  @Output() showDialogChange = new EventEmitter<boolean>();

  constructor(private _specificationservice: SpecificationService,
    private messageService: MessageService,
    private _attributeagrupationService: AttributeagrupationService,
    private _attributeService: AttributeService,
    private _attributeoptionService: AttributeoptionService,
    private confirmationService: ConfirmationService,
    public datepipe: DatePipe,
    private decimalPipe: DecimalPipe) { }
  //private readonly USER_STATE = '_USER_STATE';
  async ngOnInit() {
    if (this._specification.id == undefined || this._specification.id == -1) {
      this._specification.attributeTypes = new Attributetype()
      this._specification.attributeagrupation = new Attributeagrupation()
      this._specification.attributes = new Attribute()
      this._specification.values = [];
      this.editDisabled = false;
      this.onLoadAttributeagrupation();
    } else {
      this.editDisabled = true;
      this.onLoadSpecification();
    }
    this._attribute = [];
    this._specification.active = true;
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._specification = new Specification();
    this._specification.active = true;
    this.value = "";
    this._date = new Date();
    this._typeAttribute = 0;
  }

  saveSpecification(): void {
    var listValidate: Specification[] = [];
    this.submitted = true;
    this.evaluarValorOption();
    if (this._specification.id == 0) {
      if (this.idAttributeOrigin == this._specification.attributes.id) {
        this.specificationList = this.specificationList.filter(esp => esp.attributes.id != this._specification.attributes.id)
      }
    }
    if (this.specificationList.filter(esp => esp.attributes.id == this._specification.attributes.id).length == 0) {
      this.listspecification = [];
      this._specification.values = [];
      this._specification.idAttribute = this._specification.attributes.id;
      this._specification.values = this.listspecificationValues;
      this._specification.id = -1;
      this.listspecification.push(this._specification);
      if ((this._specification.values.length > 0 || (this._typeAttribute == Typeattributes.Option && this._attributeoptionSelected.length > 0)) && (this._specification.attributeagrupation.id >= 1 && this._specification.attributes.id >= 1)) {
        this._specification.id == 0 ? -1 : this._specification.id;
        this.submit();
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este attributo ya se encuentra registrado para este producto." });
    }
  }
  submit() {
    //this._specification.productId = +this.idproduct;
    //this._specification.active = true;
    // if (this._typeAttribute != Typeattributes.Option) {

    //}
    this._specificationservice.postSpecifications(this.listspecification).subscribe((data: number) => {
      if (data > 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.showDialog = false;
        this.showDialogChange.emit(this.showDialog);
        this.refreshcompleted.emit();
        this._specification = new Specification();
        // this._specification.name = "";
        this._specification.active = true;
        var filter = new SpecificationFilter();
        filter.productId = parseInt(this.idproduct.toString());
        filter.active = -1;
        this._specificationservice.getSpecifications(filter).subscribe((data: Specification[]) => {
          data.forEach(prodspecification => {
            prodspecification.values.forEach(element => {
              if (prodspecification.attributeTypes.id == this.typeatribute.NumberDecimal) {
                element.value = this.decimalPipe.transform(element.value,'.2');
              }
              if (prodspecification.attributeTypes.id == this.typeatribute.Option) {
                element.value = element.attributeoption.name;
              }
              if (prodspecification.attributeTypes.id == this.typeatribute.Date) {
                this._date = (new Date(element.value));
                //element.value = this.datepipe.transform(this._date, "dd/MM/yyyy");
              }
              else if (prodspecification.attributeTypes.id == this.typeatribute.Time) {
                this._date = (new Date(element.value));
                //element.value = this.datepipe.transform(this._date, "HH:mm");
              } else if (prodspecification.attributeTypes.id == this.typeatribute.DateTime) {
                this._date = (new Date(element.value));
                //element.value = this.datepipe.transform(this._date, "dd/MM/yyyy HH:mm");
              }
              else if (prodspecification.attributeTypes.id == this.typeatribute.Binary) {
                element.value = element.value == "true" ? "Si" : "No";
              }
              prodspecification.value = prodspecification.value == "" || prodspecification.value == undefined ? element.value : prodspecification.value + ", " + element.value;
            });

           
          });
          this._specificationservice._specificationList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

        });
        this.submitted = false;
      } else if (data == -1) {
        console.log(data);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este attributo ya se encuentra registrado para este producto." });

      } else if (data == -2) {
        console.log(data);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El tipo de encarte ya existe para este producto." });

      } else {
        console.log(data);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el atributo." });
      }
    }, (error: HttpErrorResponse) => {

      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el atributo." });
    });

  }
  onLoadSpecification() {
    var selected: any[] = [];
    this.idAttributeOrigin = this._specification.attributes.id;
    this._specification.values.forEach(value => {
      this._typeAttribute = this._specification.attributeTypes.id;
      if (this._typeAttribute != this.typeatribute.Option)
        value.attributeoption.id = -1;
      if (value.attributeoption.id == 0)
        value.attributeoption.id = -1;
      if (this._typeAttribute == this.typeatribute.Date) {
        var valuesplit = value.value.split("/");
        this._date = new Date(valuesplit[1] + "/" + valuesplit[0] + "/" + valuesplit[2]);
      }
      if (this._typeAttribute == this.typeatribute.DateTime) {
        var valuesplit = value.value.split("/");
        this._date = new Date(valuesplit[1] + "/" + valuesplit[0] + "/" + valuesplit[2]);
      }
      if (this._typeAttribute == this.typeatribute.Time)
        this._date = new Date(this.datepipe.transform(new Date(), "MM/dd/yyyy") + " " + value.value);
      if (this._typeAttribute == this.typeatribute.Binary) {
        if (value.value == "Si")
          this._check = true;
        else
          this._check = false;
      }
      if (this._typeAttribute == this.typeatribute.Option) {

        selected.push(
          value.attributeoption.id,
        );
      }
      this.value = value.value;
    });
    this._attributeoptionSelected = selected;
    console.log(this._attributeoptionSelected);
    
    this.onLoadAttributeagrupation();
    var filter: AttributeFilter = new AttributeFilter();
    filter.idAttributeAgrupation = this._specification.attributeagrupation.id;
    filter.active = 1;
    this._attributeService.getAttributebyfilter(filter, OrderCodes.CreatedDate)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this._attribute = data.map((item) => ({
          label: item.name,
          value: item.id,
          title: item.attributeType.id.toString()
        }));

        //this._attributeoptionSelected = new Array<SelectItem>();
        var filterO = new OptionxAttribute();
        filterO.idAttribute = this._specification.attributes.id;

        this._attributeoptionService.getOptionsxAttributebyfilter(filterO)
          .subscribe((data) => {
            var list: any[] = [];
            for (let index = 0; index < this._attributeoptionSelected.length; index++) {
              if (data.filter(x => x.id.toString() == String(this._attributeoptionSelected[index])).length > 0) {
                list.push(
                  this._attributeoptionSelected[index],
                );
              }
            }
            this._attributeoptionSelected = list;
            this._attributeoption = data.map<SelectItem>((item) => ({
              label: item.name,
              value: item.id
            }));
          }, (error) => {
            console.log(error);
          });

        console.log(this._attribute);
      }, (error) => {
        console.log(error);
      });

  }

  async onLoadAttributeagrupation() {
    var filter: AttributesagrupationFilter = new AttributesagrupationFilter()
    filter.active = 1;
    this._attributeagrupationService.getAttributesAgrupationbyfilter(filter, OrderCodes.Name)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this._attributeagrupation = data.map((item) => ({
          label: item.name,
          value: item.id
        }));

      }, (error) => {
        console.log(error);
      });
  }

  async listarAtributos() {
    var filter: AttributeFilter = new AttributeFilter();
    filter.idAttributeAgrupation = this._specification.attributeagrupation.id;
    filter.active = 1;
    this._attributeService.getAttributebyfilter(filter, OrderCodes.CreatedDate)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this._attribute = data.map((item) => ({
          label: item.name,
          value: item.id,
          title: item.attributeType.id.toString()
        }));
        this._specification.attributes.id = -1;
        this._typeAttribute = -1;
        //this._specification.valor = "";
      }, (error) => {
        console.log(error);
      });
  }

  async listatributeoptions() {
    this._attributeoptionSelected = new Array<SelectItem>();
    var filterO = new AttributeoptionFilter();
    filterO.idAttributeAgrupation = this._specification.attributeagrupation.id;
    filterO.active = 1;

    this._attributeoptionService.getAttributeoptionbyfilter(filterO, OrderCodes.Name)
      .subscribe((data) => {
        this._attributeoption = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  async listoptionsxattribute() {
    this._attributeoptionSelected = new Array<SelectItem>();
    this.listspecificationValues = [];
    var filterO = new OptionxAttribute();
    filterO.idAttribute = this._specification.attributes.id;

    this._attributeoptionService.getOptionsxAttributebyfilter(filterO)
      .subscribe((data) => {
        this._attributeoption = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  evaluarVisileOption() {
    this.value = "";
    this._typeAttribute = parseInt(this._attribute.find(element => element.value == this._specification.attributes.id).title);
    if (this._typeAttribute == Typeattributes.Option)
      this.listoptionsxattribute();
  }
  evaluarValorOption() {
    if (this._attribute.length > 0) {
      var valor = this._attribute.find(element => element.value == this._specification.attributes.id)
      if (valor != undefined) {
        if (this._typeAttribute != Typeattributes.Option) {
          this.listspecificationValues = [];
        }
        this._typeAttribute = parseInt(valor.title);
        switch (this._typeAttribute) {
          case Typeattributes.Text: {
            var specificationvalue = new SpecificationValues();
            specificationvalue.value = this.value;
            specificationvalue.attributeoption = new Attributeoption();
            specificationvalue.attributeoption.id = 0;
            if (specificationvalue.value != "") {
              this.listspecificationValues.push(specificationvalue);
            }
            //this._specification.attributeoption.id = -1;
            break;
          }
          case Typeattributes.Date: {
            var specificationvalue = new SpecificationValues();
            specificationvalue.value = this.datepipe.transform(this._date, "dd/MM/yyyy");
            specificationvalue.attributeoption = new Attributeoption();
            specificationvalue.attributeoption.id = 0;
            if (specificationvalue.value != null) {
            this.listspecificationValues.push(specificationvalue);
            }
            //this._specification.valor = this.datepipe.transform(this._date, "dd/MM/yyyy")
            break;
          }
          case Typeattributes.DateTime: {
            var specificationvalue = new SpecificationValues();
            specificationvalue.value = this.datepipe.transform(this._date, "dd/MM/yyyy HH:mm");
            specificationvalue.attributeoption = new Attributeoption();
            specificationvalue.attributeoption.id = 0;
            if (specificationvalue.value != null) {
            this.listspecificationValues.push(specificationvalue);
            }
            //this._specification.valor = this._date.toString();
            break;

          }
          case Typeattributes.Time: {
            var specificationvalue = new SpecificationValues();
            specificationvalue.value = this.datepipe.transform(this._date, "HH:mm");
            specificationvalue.attributeoption = new Attributeoption();
            specificationvalue.attributeoption.id = 0;
            if (specificationvalue.value != null) {
            this.listspecificationValues.push(specificationvalue);
            }
            //this._specification.valor = this._date.toString();//this.datepipe.transform(this._specification.valor, "h:mm:ss a")
            break;


          }
          case Typeattributes.Option: {
            //this._specification.valor = "";
            break;

          }
          case Typeattributes.Binary: {
            var specificationvalue = new SpecificationValues();
            specificationvalue.value = this._check.toString();
            specificationvalue.attributeoption = new Attributeoption();
            specificationvalue.attributeoption.id = 0;
            this.listspecificationValues.push(specificationvalue);
            //this._specification.valor = this._check.toString();//this.datepipe.transform(this._specification.valor, "h:mm:ss a")
            break;

          }
          case this.typeatribute.NumberDecimal: {
            var specificationvalue = new SpecificationValues();
            specificationvalue.value = this.value == null || this.value.toString() == "" ? "0" : this.value.toString();
            specificationvalue.attributeoption = new Attributeoption();
            specificationvalue.attributeoption.id = 0;

            //if (this.value != "") {
              this.listspecificationValues.push(specificationvalue);
            //}
            //this._specification.valor = this._specification.valor.toString();
          }

          case this.typeatribute.NumberInteger: {
            var specificationvalue = new SpecificationValues();
            specificationvalue.value = this.value == null || this.value.toString() == "" ? "0" : this.value.toString();
            specificationvalue.attributeoption = new Attributeoption();
            specificationvalue.attributeoption.id = 0;
            //if (this.value != "") {
              this.listspecificationValues.push(specificationvalue);
            //}
            //this._specification.valor = this._specification.valor.toString();
          }
        }

      }
    }
  }

  clear(event) {
    if (event.target.value == "0,0000" || event.target.value == "0,00") {
      event.target.value = "";
    }
  }

  ValidateChecksAttributes() {
    console.log(this._attributeoptionSelected);
    this.listspecificationValues = [];
    this._attributeoptionSelected.forEach(attributeselected => {
      /* var specification = new Specification();
      specification.id = -1;
      specification.productId = +this.idproduct;
      specification.attributeTypes.id = this._specification.attributeTypes.id;
      specification.attributeagrupation.id = this._specification.attributeagrupation.id;
      //specification.attributeoption.id = parseInt(attributeselected.toString());
      specification.attributes.id = this._specification.attributes.id;
      //specification.valor = "";
      specification.unitsmeasurement.id = this._specification.unitsmeasurement.id;
      specification.active = true;
      this.listspecification.push(specification); */
      var specificationvalue = new SpecificationValues();
      specificationvalue.value = "";
      specificationvalue.attributeoption = new Attributeoption();
      specificationvalue.attributeoption.id = parseInt(attributeselected.toString());
      this.listspecificationValues.push(specificationvalue);
    });
  }
}
