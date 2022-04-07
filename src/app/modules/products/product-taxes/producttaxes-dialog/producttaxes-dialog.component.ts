import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { ProductTaxes } from 'src/app/models/products/producttaxes'
import { ProducttaxesService } from '../../shared/services/producttaxes/producttaxes.service';
import { ProductTaxesFilter } from '../../shared/filters/productaxes-filter';
import { ProductTaxesAvailableFilter } from '../../shared/filters/producttaxesavailable-filter';
import { Product } from 'src/app/models/products/product';
import { Country } from 'src/app/models/masters/country';
import { CountryFilter } from 'src/app/modules/masters/country/shared/filters/country-filter';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { TaxRate } from 'src/app/models/masters/tax-rate';
import { Tax } from 'src/app/models/masters/tax';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { TaxRateService } from 'src/app/modules/masters/tax-rate/shared/tax-rate.service';
@Component({
  selector: 'producttaxes-dialog',
  templateUrl: './producttaxes-dialog.component.html',
  styleUrls: ['./producttaxes-dialog.component.scss']
})
export class ProducttaxesDialogComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("_productTaxes") _productTaxes : ProductTaxes;
  @Input("_productTaxesList") _productTaxesList : ProductTaxes[];
  @Input("idproduct") idproduct : number = 0;
  submitted: boolean;
  @Output() showDialogChange = new EventEmitter<boolean>();
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  _countries: SelectItem[];
  _taxes: SelectItem[];
  _taxRates: SelectItem[];
  _taxRatesList: TaxRate[];
  _taxList: Tax[];
  _initStatus: boolean;
  _validations: Validations = new Validations();
  @Output("refreshcompleted") refreshcompleted = new EventEmitter();
  saving: boolean = false;

  youCanDoIt: boolean = true;
  
  constructor(private _productTaxesService: ProducttaxesService, 
    private messageService: MessageService,
    private _countryService: CountryService, 
    private confirmationService:ConfirmationService,
    private taxRateService: TaxRateService) { }

  ngOnInit(): void {
    if(this._productTaxes.id == -1 || this._productTaxes.id == undefined){
      this._productTaxes.active = true;
      this._productTaxes.product = new Product();
      this._productTaxes.taxRate = new TaxRate();
      this._productTaxes.taxRate.tax = new Tax();
      this._productTaxes.taxRate.tax.country = new Country();
      this._productTaxes.product.productId = +this.idproduct;
    }else{
      this._initStatus = this._productTaxes.active;
      this.listAll();
    }

    var filterC = new CountryFilter();
    filterC.active = 1;
    this._countryService.getCountriesList(filterC)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this._countries = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }


  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._productTaxes = new ProductTaxes();
    this._productTaxes.product = new Product();
    this._productTaxes.taxRate = new TaxRate();
    this._productTaxes.taxRate.tax = new Tax();
    this._productTaxes.taxRate.tax.country = new Country();
    this._productTaxes.active = true;
  }

  listTaxes(){
    this._taxes = new Array<SelectItem>();
    this._taxRates = new Array<SelectItem>();
    this._productTaxes.taxRate.id = -1;
    this._productTaxes.taxRate.tax.id = -1;
    this._productTaxes.taxRate.value = 0;

    this.taxRateService.getTaxRatesByCountry(this._productTaxes.taxRate.tax.country.id)
      .subscribe((data) => {
        this._taxRatesList = data;
        this._taxList = new Array<Tax>();
        var exist = false;
        for(let element of data){
          exist = false;
          for(let element2 of this._taxList){
            if(element2.id == element.tax.id){
              exist = true;
            }
          }
          if(exist == false){
            this._taxList.push(element.tax);
          }
          
        }
        this._taxes = this._taxList.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  listTaxRates(){
    var auxTaxRates : TaxRate[] = new Array<TaxRate>();
    this._productTaxes.taxRate.id = -1;
    this._productTaxes.taxRate.value = 0;
    for(let element of this._taxRatesList){
      if(element.tax.id == this._productTaxes.taxRate.tax.id){
        auxTaxRates.push(element);
      }
    }
    this._taxRates = auxTaxRates.map<SelectItem>((item) => ({
      label: item.name,
      value: item.id
    }));

  }



  listAll(){
    this._taxes = new Array<SelectItem>();
    this._taxRates = new Array<SelectItem>();

    this.taxRateService.getTaxRatesByCountry(this._productTaxes.taxRate.tax.country.id)
      .subscribe((data) => {
        this._taxRatesList = data;
        this._taxList = new Array<Tax>();
        var exist = false;
        for(let element of data){
          exist = false;
          for(let element2 of this._taxList){
            if(element2.id == element.tax.id){
              exist = true;
            }
          }
          if(exist == false){
            this._taxList.push(element.tax);
          }
        }
        this._taxes = this._taxList.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));

        var auxTaxRates : TaxRate[] = new Array<TaxRate>();
        for(let element of this._taxRatesList){
          if(element.tax.id == this._productTaxes.taxRate.tax.id){
            auxTaxRates.push(element);
          }
        }
        this._taxRates = auxTaxRates.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  getValue(){
    for(let element of this._taxRatesList){
      if(element.id == this._productTaxes.taxRate.id){
        this._productTaxes.taxRate.value = element.value;
      }
    }
  }

  saveProductTaxe(): void{
    this.saving = true;
    this.submitted = true;
    this.youCanDoIt = true;
    if(this._productTaxes.id == -1){
      for(let element of this._productTaxesList){
        if(element.taxRate.id == this._productTaxes.taxRate.id){
          this.youCanDoIt = false;
        }
      }
    }
    if((this._productTaxes.taxRate.id != -1 && this._productTaxes.taxRate.id != undefined) && 
      (this._productTaxes.taxRate.tax.id != -1 && this._productTaxes.taxRate.tax.id != undefined) && 
      (this._productTaxes.taxRate.tax.country.id != -1 && this._productTaxes.taxRate.tax.country.id != undefined) && 
      (this._productTaxes.taxRate.value != -1 && this._productTaxes.taxRate.value != undefined) &&
      (this._productTaxes.product.productId != -1 && this._productTaxes.product.productId != undefined) && this.youCanDoIt){
      if(!this._productTaxes.active && this._initStatus){
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: 'Si inactiva un impuesto las configuraciones asociadas\ a este se dejarán de visualizar, ¿desea proceder con la acción?',
          accept: () => {
            this.save();
          },
          reject: () => {
            this.saving = false;
          }
        });
      }else{
        this.save();
      }
    }else{
      this.saving = false;
    }
  }


  save(){
    this._productTaxesService.posttProductTaxes(this._productTaxes).subscribe((data: number) => {
      if(data > 0) {
        this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
        this.showDialog = false;
        this.refreshcompleted.emit();
        this.showDialogChange.emit(this.showDialog);
        this._productTaxes = new ProductTaxes();
        this._productTaxes.product = new Product();
        this._productTaxes.taxRate = new TaxRate();
        this._productTaxes.taxRate.tax = new Tax();
        this._productTaxes.taxRate.tax.country = new Country();
        this._productTaxes.active = true;
        var filter = new ProductTaxesFilter();
        filter.productId = this.idproduct;
        this.saving = false;
        this._productTaxesService.getProductTaxesbyfilter(filter).subscribe((data: ProductTaxes[]) => {
          this._productTaxesService._productTaxes = data.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime());
        });
        this.submitted = false;
      }else if(data == -1){
        this.saving = false;
        this.messageService.add({severity:'error', summary:'Error', detail: "El impuesto seleccionado ya esta asignado actualmente al producto"});
      }else{
        this.saving = false;
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el impuesto"});
      }
    }, (error: HttpErrorResponse)=>{
      this.saving = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el impuesto"});
    });
  }
}
