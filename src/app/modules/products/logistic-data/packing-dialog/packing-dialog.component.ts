import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Gtintype } from 'src/app/models/masters-mpc/gtintype';
import { Packing } from 'src/app/models/products/packing';
import { PackingtypeFilter } from 'src/app/modules/masters-mpc/shared/filters/common/packingtype-filter';
import { PackagingpresentationFilter } from 'src/app/modules/masters-mpc/shared/filters/packagingpresentation-filter';
import { UseofpackagingFilter } from 'src/app/modules/masters-mpc/shared/filters/useofpackaging-filter';
import { GtintypeFilter } from 'src/app/modules/masters-mpc/shared/filters/gtintype-filter';
import { GroupingunitmeasureFilter } from 'src/app/modules/masters-mpc/shared/filters/groupingunitmeasure-filter';
import { MeasurementunitsFilter } from 'src/app/modules/masters-mpc/shared/filters/measurementunits-filter';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { PackingFilter } from '../../shared/filters/packing-filter';
import { CommonService } from '../../../masters-mpc/shared/services/Common/common.service';
import { PackingService } from '../../shared/services/packingservice/packing.service';
import { ProductService } from '../../shared/services/productservice/product.service';
import { PackagingpresentationService } from '../../../masters-mpc/shared/services/PackagingPresentationService/packagingpresentation.service';
import { UseofpackagingService } from '../../../masters-mpc/shared/services/UseofPackaging/useofpackaging.service';
import { GtintypeService } from '../../../masters-mpc/shared/services/GtinType/gtintype.service';
import { GroupingunitmeasureService } from '../../../masters-mpc/shared/services/GroupingUnitMeasureService/groupingunitmeasure.service';
import { MeasurementunitsService } from '../../../masters-mpc/shared/services/measurementunits.service';
import { OrderCodes } from 'src/app/modules/masters-mpc/shared/Utils/order-codes';
import { MeasurementUnits } from 'src/app/modules/masters-mpc/shared/view-models/measurement-units.viewmodel';
import { Product } from 'src/app/models/products/product';
import { Packingtype } from 'src/app/models/masters-mpc/common/packingtype';
import { GroupinggenerationbarFilter } from 'src/app/modules/masters-mpc/shared/filters/common/groupinggenerationbar-filter';


@Component({
  selector: 'packing-dialog',
  templateUrl: './packing-dialog.component.html',
  styleUrls: ['./packing-dialog.component.scss']
})
export class PackingDialogComponent implements OnInit {


  @Input("showDialog") showDialog: boolean = false;
  @Input("_packing") _packing: Packing;
  @Input("filters") filters: PackingFilter;
  @Input("idproduct") idproduct: number= 0;
  @Input("_packingList") _packingList: Packing[];
  @Input("aireP") aireP: boolean = false;
  @Input("tempCount") tempCount: number;
  @Output("refreshchanges") refreshchanges = new EventEmitter<number>();

  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() airePChange = new EventEmitter<boolean>();
  @Output() _packingListChange = new EventEmitter<Packing[]>();
  status: SelectItem[] = [
    {label: 'Activo', value: true}
  ];
  _packingtypes: SelectItem[];
  _packagingpresentations: SelectItem[];
  _useofpackagings: SelectItem[];
  _gtintypes: SelectItem[];
  _measurementunits: SelectItem[];
  _groupingunitsmeasure: SelectItem[];
  submitted: boolean;
  _validations: Validations = new Validations();
  _gtintypeList: Gtintype[] = new Array<Gtintype>();
  messagevalidationgtin: string;
  IndGtin: Boolean = false;
  _single: Boolean = false;
  _selectDisable: Boolean = false;
  _maxGTIN: number = 0;
  _barraRepetida: Boolean = false;
  _originalBarcode: string = "";
  _empaqueRepetido: Boolean = false;
  _aplhaNumeric: Boolean = false;
  groupinggenerationbarlist: SelectItem[];
  IdTypeGenerationBar: number = -1;
  _showdialogbarcode: boolean = false;
  IndGenerationBar: number = 2;

  constructor(private _packingService: PackingService, 
    private messageService: MessageService,
    private _packagingpresentationService: PackagingpresentationService, 
    private _useofpackagingService: UseofpackagingService,
    private _gtintypeService: GtintypeService,
    private _commonService: CommonService,
    private confirmationService: ConfirmationService,
    private _groupingunitmeasureService: GroupingunitmeasureService,
    private _measurementunitsService: MeasurementunitsService,
    private _productService: ProductService) { }

  ngOnInit(): void {
    if(this._packing.id == -1 || this._packing.id == undefined){
      this._packing.active = true;
      this._packing.measurementUnit = new MeasurementUnits();
      this._single = true;
      this._selectDisable = false;
      this._packing.product = new Product();
      this._packing.product.productId = +this.idproduct;
      this._packing.high = 0;
      this._packing.length = 0;
      this._packing.width = 0;
      this._packing.weight = 0;
      this._packing.volume = 0;
      this._packing.maxLitters = 0;
      this._packing.packingsByLitters = 0;
      this._packing.groupingGenerationBarId = 1;
      this.IndGtin = true;
      this._packing.packingType = new Packingtype();
      this._packing.packingType.id = 1;
    }else{
      if(this._packing.packingType.id == 2){
        this._single = false;
        this._selectDisable = true;
        this.IndGtin = false;
      }else{
        this._single = true;
        this._selectDisable = true; 
        this.IndGtin = false;
      }
      this._originalBarcode = this._packing.barcode;
    }
    this.onLoadGroupingGenerationBarList();

    var filterPT = new PackingtypeFilter();
    filterPT.active = 1;
    var single:number = 0;
    if(this._single){
      single = 1;
    }
    this._commonService.getPackingTypes(filterPT, single)
      .subscribe((data) => {
        this._packingtypes = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
    
    if(this._packing.packingType.id != -1 && this._packing.packingType.id != undefined){
      this.getPackingPresentation();
    }
    
    

    var filterUP = new UseofpackagingFilter();
    filterUP.active = 1;
    this._useofpackagingService.getUseofpackagingbyfilter(filterUP)
      .subscribe((data) => {
        this._useofpackagings = data.map<SelectItem>((item) => ({
          label: item.usePackaging,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });

    var filterGT = new GtintypeFilter();
    filterGT.active = 1;
    filterGT.gtinGroupingId =this._single ? 2 : 1;
    this._gtintypeService.getGtinTypebyfilter(filterGT)
      .subscribe((data) => {
        this._gtintypeList = data;

        if(this._packing.id != -1 && this._packing.id != undefined){
          var gtinselected = this._gtintypeList.find(x => x.id == this._packing.gtinType.id);
          this._maxGTIN = gtinselected.digitAmount;
        }
        


        this._gtintypes = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });

    var filterGU = new GroupingunitmeasureFilter();
    filterGU.active = 1;
    this._groupingunitmeasureService.getGroupingUnitMeasurebyfilter(filterGU, OrderCodes.Name)
      .subscribe((data) => {
        this._groupingunitsmeasure = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });


    if(this._packing.id != -1 && this._packing.id != undefined){
      var filterMU = new MeasurementunitsFilter(); 
      filterMU.idGroupingUnitofMeasure = this._packing.measurementUnit.groupingUnitofMeasure.id;
      filterMU.active = 1;
      this._measurementunits = [];
      this._measurementunitsService.getMeasurementUnitsbyfilter(filterMU, OrderCodes.Name)
        .subscribe((data) => {
          this._measurementunits = data.map<SelectItem>((item) => ({
            label: item.name,
            value: item.id
          }));
          console.log(this._measurementunits);
        }, (error) => {
          console.log(error);
        });
    }
  }

  setSize(){
    var gtinselected = this._gtintypeList.find(x => x.id == this._packing.gtinType.id);
    this._maxGTIN = gtinselected.digitAmount;
    this._aplhaNumeric = gtinselected.alphanumeric;
    this._packing.barcode = "";
  }

  getPackingPresentation(){
    this._packagingpresentations = new Array<SelectItem>();
    var filterPP = new PackagingpresentationFilter();
    filterPP.active = 1;
    filterPP.idPackingType = this._packing.packingType.id;
    this._packagingpresentationService.getPackagingpresentationbyfilter(filterPP)
      .subscribe((data) => {
        this._packagingpresentations = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  getVolume(){
    if(this._packing.high != undefined && this._packing.length != undefined && this._packing.width != undefined ){
      // this._packing.high = +this._packing.high;
      // this._packing.length = +this._packing.length;
      // this._packing.width = +this._packing.width;
      this._packing.volume = +this._packing.high * +this._packing.length * +this._packing.width;
    }else{
      this._packing.volume = 0;
    }
  }





  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this.IndGtin = false;
    this.messagevalidationgtin = "";
    this._barraRepetida = false;
  }

  listmeasurementunits(){
    this._packing.measurementUnit.id = -1;
    var filterMU = new MeasurementunitsFilter(); 
    filterMU.idGroupingUnitofMeasure = this._packing.measurementUnit.groupingUnitofMeasure.id;
    filterMU.active = 1;

    this._measurementunitsService.getMeasurementUnitsbyfilter(filterMU, OrderCodes.Name)
      .subscribe((data) => {
        this._measurementunits = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }




  savePacking(){
    this.submitted = true;
    let count = 0;
    let auxId = 0;
    this._empaqueRepetido = false;
    for(let element of this._packingList){
      if(element.packagingPresentation.id == this._packing.packagingPresentation.id && element.units == this._packing.units){
        count++;
        auxId = element.id; 
      }
    }

    if(count == 0 || (count == 1 && this._packing.id != -1 && this._packing.id == auxId)){
      this._empaqueRepetido = false;
    }else{
      this._empaqueRepetido = true
    }

    if(this._empaqueRepetido == false){
      count = 0;
      auxId = 0;
      for(let element of this._packingList){
        if(element.barcode == this._packing.barcode){
          count++;
          auxId = element.id; 
        }
      }
      if(count == 0 || (count == 1 && this._packing.id != -1 && this._packing.id == auxId)){
        this._barraRepetida = false;
      }else{
        this._barraRepetida = true
      }


      if(this._barraRepetida == false && this._packing.barcode != this._originalBarcode){
        this._productService.getVerifyBarCode(this._packing.barcode)
        .subscribe((data) => {
          if(data == false){
            this.save();
          }else{
            this.messageService.add({severity:'error', summary:'Error', detail: "La barra ingresada ya existe en el sistema."});
          }
        }, (error) => {
          console.log(error);
        });
      }else{
        this.save();
      }
    }else{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ya existe este empaque en el sistema, cambie su presentación o la cantidad de unidades"});
    }

    



    

    
  }


  save(){
    this._packing.typeGenerationBarId = this._packing.groupingGenerationBarId == 1 ? 0 : 1;
    this._packing.high = this._packing.high == undefined ? 0 : this._packing.high
    this._packing.width = this._packing.width == undefined ? 0 : this._packing.width
    this._packing.length = this._packing.length == undefined ? 0 : this._packing.length
    this._packing.volume = this._packing.volume == undefined ? 0 : this._packing.volume
    this._packing.weight = this._packing.weight == undefined ? 0 : this._packing.weight

    if((this._packing.barcode.trim() != '' && this._packing.barcode != undefined) &&
    (this._packing.packingType.id != -1 && this._packing.packingType.id != undefined) &&
    (this._packing.packagingPresentation.id != -1 && this._packing.packagingPresentation.id != undefined) &&
    (this._packing.useofPackaging.id != -1 && this._packing.useofPackaging.id != undefined) &&
    (this._packing.measurementUnit.groupingUnitofMeasure.id != -1 && this._packing.measurementUnit.groupingUnitofMeasure.id != undefined) &&
    (this._packing.measurementUnit.id != -1 && this._packing.measurementUnit.id != undefined) &&
    (this._packing.units >= 0 && this._packing.units != undefined) &&
    (this._packing.units > 1 || this._packing.packingType.id == 2) &&
    (this._packing.gtinType.id != -1 && this._packing.gtinType.id != undefined) &&
    (this._packing.maxLitters != undefined && this._packing.maxLitters >= 0 ) &&
    (this._packing.packingsByLitters != undefined && this._packing.packingsByLitters >= 0 ) &&
    (this._packing.high != undefined && this._packing.high >= 0 ) &&
    (this._packing.width != undefined  && this._packing.width >= 0 ) &&
    (this._packing.length != undefined && this._packing.length >= 0 ) &&
    (this._packing.volume != undefined && this._packing.volume >= 0 ) &&
    (this._packing.weight != undefined && this._packing.weight >= 0 ) && this.IndGtin == false && this._barraRepetida == false){
      for(let element of this._packingtypes){
        if(element.value == this._packing.packingType.id){
          this._packing.packingType.name = element.label; 
        }
      }
  
      for(let element of this._packagingpresentations){
        if(element.value == this._packing.packagingPresentation.id){
          this._packing.packagingPresentation.name = element.label;
        }
      }
  
      for(let element of this._useofpackagings){
        if(element.value == this._packing.useofPackaging.id){
          this._packing.useofPackaging.usePackaging = element.label;
        }
      }
  
      for(let element of this._gtintypes){
        if(element.value == this._packing.gtinType.id){
          this._packing.gtinType.name = element.label;
        }
      }
  
      for(let element of this._measurementunits){
        if(element.value == this._packing.measurementUnit.id){
          this._packing.measurementUnit.name = element.label;
        }
      }
  
  
  
      if(this._packing.id == -1 || this._packing.id == undefined){
        this._packing.product.productId = +this._packing.product.productId;
        this._packing.id = +this.tempCount;
        this._packing.units = +this._packing.units;
        this._packing.maxLitters = +this._packing.maxLitters;
        this._packing.packingsByLitters = +this._packing.packingsByLitters;
        this._packing.high = +this._packing.high;
        this._packing.width = +this._packing.width;
        this._packing.length = +this._packing.length;
        this._packing.volume = +this._packing.volume;
        this._packing.weight = +this._packing.weight;
        this._packing.grossWeight = +this._packing.grossWeight;
        this._packingList.push(this._packing);
      }else{
        for(let elemento of this._packingList){
          if(elemento.id == this._packing.id){
            elemento.id = +this._packing.id;
            elemento.product = this._packing.product;
            elemento.packingType = this._packing.packingType;
            elemento.packagingPresentation = this._packing.packagingPresentation;
            elemento.useofPackaging = this._packing.useofPackaging;
            elemento.gtinType = this._packing.gtinType;
            elemento.measurementUnit = this._packing.measurementUnit;
            elemento.units = +this._packing.units;
            elemento.barcode = this._packing.barcode;
            elemento.maxLitters = +this._packing.maxLitters;
            elemento.packingsByLitters = +this._packing.packingsByLitters;
            elemento.high = +this._packing.high;
            elemento.width = +this._packing.width;
            elemento.length = +this._packing.length;
            elemento.volume = +this._packing.volume;
            elemento.weight = +this._packing.weight;
            elemento.grossWeight = +this._packing.grossWeight;
            elemento.active = this._packing.active;
            elemento.createdByUser = this._packing.createdByUser;
            elemento.createdByUserId = this._packing.createdByUserId;
            elemento.updatedByUser = this._packing.updatedByUser;
            elemento.updatedByUserId = this._packing.updatedByUserId;
            elemento.dateCreate = this._packing.dateCreate;
            elemento.dateUpdate = this._packing.dateUpdate;
          }
        }
      }
      this._packingListChange.emit(this._packingList);
      this.aireP = true;
      this.airePChange.emit(this.aireP);
      this.refreshchanges.emit();
      this.hideDialog();
    }
  }




  ValidateGtin(barcode){
    this._barraRepetida = false;
    if(barcode != ""){
      var gtinselected = this._gtintypeList.find(x => x.id == this._packing.gtinType.id);
      var digitamount = gtinselected.digitAmount;
      if(gtinselected.checkDigit == true){
        if(barcode.length == digitamount){
          var barcodecut = barcode.substr(0,digitamount-1);
          let result = 0;
          let i = 1;
          for (let counter = barcodecut.length-1; counter >=0; counter--){
              result = result + parseInt(barcodecut.charAt(counter)) * (1+(2*(i % 2)));
              i++;
          }
          var resul = (10 - (result % 10)) % 10;
          if(barcode != (barcodecut + resul)){
            this.messagevalidationgtin = "El GTIN es incorrecto";
            this.IndGtin = true;
          }else{
            this.messagevalidationgtin = "";
            this.IndGtin = false;
          }
        }else{
          this.messagevalidationgtin = "El GTIN es incorrecto, debe tener una longitud exacta de " + digitamount + " caracteres";
          this.IndGtin = true;
        }
      }else{
        if(barcode.length != digitamount){
          this.messagevalidationgtin = "El GTIN es incorrecto, debe tener una longitud exacta de " + digitamount + " caracteres";
          this.IndGtin = true;
        }else{
          this.messagevalidationgtin = "";
            this.IndGtin = false;
        }
      }
    }else{
      this.messagevalidationgtin = "";
            this.IndGtin = false;
    }
  }

  ValidateGenerationType(){
    this._packing.gtinType.id = 0;
    this._packing.barcode = "";
    if (this._packing.groupingGenerationBarId == 1) {
      this.IdTypeGenerationBar = 2;
      this.IndGtin = true;
    }else{
      this.IdTypeGenerationBar = 1;
      this.IndGtin = false;
    }
    //this.typegenerationbarchange.emit(this.IdTypeGenerationBar);
  }

  async onLoadGroupingGenerationBarList(){
    var filter: GroupinggenerationbarFilter = new GroupinggenerationbarFilter()
    filter.active = 1;
    this._commonService.getGroupingGenerationBar(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.groupinggenerationbarlist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  clearInputBarCode(){
    this._packing.barcode = "";
  }

  showDialogBarCode(){
    this._showdialogbarcode = true;
  }
}
