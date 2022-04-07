import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { ValueValidatorRateType } from 'src/app/helpers/confirmed.validator';
import { RateTypeEnum } from 'src/app/models/common/rate-type-enum';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { RateType } from 'src/app/models/masters/rate-type';
import { Tax } from 'src/app/models/masters/tax';
import { TaxFilters } from 'src/app/models/masters/tax-filters';
import { TaxRate } from 'src/app/models/masters/tax-rate';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { TaxService } from '../../taxes/shared/tax.service';
import { TaxRateService } from '../shared/tax-rate.service';
import { TaxRateFilters } from 'src/app/models/masters/tax-rate-filters';
import { HttpErrorResponse } from '@angular/common/http';
import { TaxRateApplication } from 'src/app/models/masters/tax-rate-application';


@Component({
  selector: 'app-tax-rate-detail',
  templateUrl: './tax-rate-detail.component.html',
  styleUrls: ['./tax-rate-detail.component.scss']
})
export class TaxRateDetailComponent implements OnInit {
  submitted = false;
  rateType: SelectItem<RateType[]> = { value: null };
  rateTypeOrigin: SelectItem<RateType[]> = { value: null };
  tax: SelectItem<Tax[]> = {value: null};

  selectedtaxesRatesApplication: TaxRate[];
  taxeTypeApplication: TaxRate[] = null;
  isSelectedtaxeApplication = false;
  idRateType: number;
  idTax: number;
  taxRateForm: FormGroup;
  isAvailable = true;
  isEdit = false;
  formTitle: string;
  taxRateAdded: boolean;
  nameBase = '';
  baseId: number = 0;
  taxRateFilters: TaxRateFilters = new TaxRateFilters();
  conRate=false;
  rats: TaxRateApplication[] = [];

  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() taxRate: TaxRate;
  @Input() taxRateList: TaxRate[];
  RateList: TaxRate[];
  Rates: TaxRate[];
  RatesSelect: TaxRate[];
  RateListSelect: TaxRate[];
  status: SelectItem[] = [
    {label: 'Inactivo', value: '0'},
    {label: 'Activo', value: '1'}
  ];

  _validations: Validations = new Validations();
  isConRate: boolean;
  constructor(
    private _taxRateService: TaxRateService,
    private _taxService: TaxService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
    this.taxRateForm = this.setNewTaxRateForm();

  }
  ngOnInit(): void {
    this.formTitle = "Tasa de impuesto";
    this.getRatesTypePromise().then(()=>{
      this.getTaxesPromise().then(() => {
        debugger;
            if(this.taxRate)
            {

              this.formTitle="Editar tasa de impuesto"
              this.isEdit = true;
              this.onEditForm();
            }
            else
            {
              /*this.formTitle="Nueva tasa de impuesto"*/
              this.isEdit = false;
              this.taxRateForm.controls.statusValue.setValue('1');
            }
      });
    });
}
  onEditForm() {

    if(this.taxRate.rateType.id === RateTypeEnum.formula)
    {
      this.taxRateForm.controls.value.disable();
    }

    const filters = new TaxFilters();
    filters.active = StatusEnum.active;
    filters.id = this.taxRate.tax.id;
    return this._taxService.getTaxes(filters)
    .then(results => {
      debugger;

       this.baseId =results[0].taxBaseTypeId!=1?results[0].taxBaseId:0;
         this.taxRateForm.patchValue({

              id: this.taxRate.id,
              name: this.taxRate.name,
              abbreviation: this.taxRate.abbreviation,
              value: Number(this.taxRate.value),
              statusValue: this.taxRate.active ? String(StatusEnum.active) : String(StatusEnum.inactive),
              selectedTax: this.tax.value.find(p => Number(p.id) === Number(this.taxRate.tax.id)),
              selectedRateType: this.rateType.value.find(p => Number(p.id) === Number(this.taxRate.rateType.id)),
              taxBase:results[0].taxBaseTypeId!=1? results[0].taxBase +'('+ results[0].abbreviationTaxBase +')':""
           });
           if(this.baseId!=0){
             debugger;
           this.getTaxeRatePromise(this.baseId).then( () => {
            this.selectedtaxesRatesApplication = [];
            this.addTaxeApplicationSelected();
            this.isSelectedtaxeApplication = true;
              }, error => {
            console.error( 'Función de rechazo llamada: ', error );
           });

             }


      }, (error) => {
        this.messageService.add({ severity: 'error', summary: 'Cargar impuestos', detail: error.error.message });
        console.log(error.error.message);
      });


}

getRatesTypePromise = () => {
/*  const filters = new TaxFilters();*/
/*  filters.active = StatusEnum.active;*/
  return this._taxRateService.getRatesType()
    .then(results => {
      this.rateType.value = results.sort((a, b) => a.name.localeCompare(b.name));
      this.rateTypeOrigin.value = results.sort((a, b) => a.name.localeCompare(b.name));
    }, (error) => {
      this.messageService.add({severity: 'error', summary: 'Cargar tipo de tasas', detail: error.error.message});
      console.log(error.error.message);
    });
  }

  getTaxesPromise = () => {

    const filters = new TaxFilters();
    filters.active = StatusEnum.active;
    return this._taxService.getTaxes(filters)
      .then(results => {
       this.tax.value = results.sort((a, b) => a.name.localeCompare(b.name));

    }, (error) => {
      this.messageService.add({severity: 'error', summary: 'Cargar impuestos', detail: error.error.message});
      console.log(error.error.message);
    });
  }

  getTaxeRatePromise(TaxId) {
    debugger;
    this.RateList = [];
    this.taxRateFilters.active = StatusEnum.active;
    this.taxRateFilters.idTax=TaxId;
    this.Rates = [];
    this.RatesSelect= [];
    return this._taxRateService.getTaxRates(this.taxRateFilters)
      .then((results: TaxRate []) => {
        // this.RateList = results.sort((a, b) => a.name.localeCompare(b.name)).filter(x=> x.tax.id==TaxId);
        this.RateList = results.sort((a, b) => a.name.localeCompare(b.name));
        this.RateListSelect = this.RateList.filter(x=> x.baseTaxRateId!=0);

        this.RateList.forEach(element => {
          var Rat = new TaxRate();
          var RatSelec = new TaxRate();

          Rat.name= `${element.abbreviation || element.name} - ${element.value}${element.rateType.id == 1 ? '%' : ''}`,
          Rat.id=element.id
          // Rat.id= element.id,
          // Rat.taxBaseId = element.taxBaseId,
           //Rat.taxBase= element.taxBase

          this.Rates.push(Rat);
        });



        if (this.RateList.length> 0){
          this.conRate=true;
        }
        else {
          this.conRate=false;
        }

      }, (error) => {
        this.messageService.add({ key: 'tax', severity: 'error', summary: 'Cargar tsas', detail: error.error.message });
        console.log(error.error.message);
      });
  }
  // se cargar las tasas de los impuestos base seleccionadas
  private addTaxeApplicationSelected() {

     this.taxRate.taxRateApplication.forEach(element => {
       const taxeTypeEdited =this.Rates.find(p => element.idRate === p.id && element.indAppliesBaseTaxRate==true && element.active==true)
        if (taxeTypeEdited) {
           debugger;
          this.selectedtaxesRatesApplication.push(taxeTypeEdited);
        }
    });
  }
  // Selected Tax Type Aplication Event
  onTaxeApplicatioSelected(taxeTypeApplicationSelected) {
    this.selectedtaxesRatesApplication = taxeTypeApplicationSelected;
    if (this.selectedtaxesRatesApplication?.length === 0) {
      this.isSelectedtaxeApplication = false;
    }
    else {
      this.isSelectedtaxeApplication = true;
    }
  }

  // se llenan las tasas dependiendo del impuesto
  onTaxSelected(TaxId) {
    debugger;
    if (TaxId) {
      if (TaxId.id != 0) {
        this.selectedtaxesRatesApplication = [];
       const filters = new TaxFilters();
        filters.active = StatusEnum.active;
        filters.id = TaxId.id;
        this._taxService.getTaxes(filters)
          .then(results => {

               if(results[0].taxBaseId!=0){

                  this.baseId = results[0].taxBaseId;
                  this.nameBase =  results[0].taxBase +'('+ results[0].abbreviationTaxBase +')';
                  this.taxRateForm.patchValue({
                    taxBase: this.nameBase
                  });
                  this.getTaxeRatePromise(this.baseId);
                  }

            }, (error) => {
            this.messageService.add({ severity: 'error', summary: 'Cargar impuestos', detail: error.error.message });
            console.log(error.error.message);
          });

      }

    }
  }

  onRateTypeSelected(rateType){
    if(rateType)
    {
      /*this.isConRate = false;*/
      if(rateType.id === RateTypeEnum.formula)
      {
        this.taxRateForm.controls.value.setValue(0);
        this.taxRateForm.controls.value.disable();
      }
      else
      {
        this.taxRateForm.controls.value.enable();
      }
    }
  }

  // se llenan los campos del select tasa
  pushToSaveTaxeTypeApplication() {
    debugger;
    const newtaxeTypeApplications: TaxRateApplication[] = [];
    if (this.isEdit) {

      this.Rates.forEach(element => { /*combo*/
        const taxeTypeExisted = this.taxRate.taxRateApplication.find(p => element.id === p.idRate);
        const taxeTypeSelected = this.selectedtaxesRatesApplication.find(p => element.id === p.id);

        if (taxeTypeSelected) {

            var Ratse = new TaxRateApplication();
            Ratse.baseTaxRateId=-1;
            Ratse.idRate=taxeTypeSelected.id;
            Ratse.indAppliesBaseTaxRate=true;
            newtaxeTypeApplications.push(Ratse);

        }
        else if (taxeTypeExisted) {
         taxeTypeExisted.indAppliesBaseTaxRate= false;
         newtaxeTypeApplications.push(taxeTypeExisted);
        }
      });
      return newtaxeTypeApplications;
    }
    else {
      debugger;
      this.selectedtaxesRatesApplication.forEach(element => {
        var Ratse2 = new TaxRateApplication();
            Ratse2.baseTaxRateId=-1;
            Ratse2.idRate=element.id;
            Ratse2.indAppliesBaseTaxRate=true;
            newtaxeTypeApplications.push(Ratse2);
      });
      return newtaxeTypeApplications;
    }
  }
  // se llena el modelo para guardar
  toTaxRateModel() {
    debugger;
      let model = new TaxRate();

          model.id = this.taxRateForm.controls.id.value;
          model.name = this.taxRateForm.controls.name.value;
          model.abbreviation = this.taxRateForm.controls.abbreviation.value;
          model.active = this.taxRateForm.controls.statusValue.value === '0' ? false : true;
          model.rateType = this.taxRateForm.controls.selectedRateType.value;
          model.tax = this.taxRateForm.controls.selectedTax.value;
          model.value = Number(this.taxRateForm.controls.value.value);
          model.abbreviation = this.taxRateForm.controls.abbreviation.value;
          if(this.baseId!=0){
          // model.baseTaxRateId = this.pushToSaveTaxeTypeApplication()[0].id;
           model.taxRateApplication = this.pushToSaveTaxeTypeApplication();
           }
          // model.IdTax=this.taxRateForm.controls.selectedTax.value.id;
          // model.TaxOpc=this.taxRateForm.controls.selectedTax.value.name;


      return model;
  }

  onSave() {
    debugger;
    this.submitted = true;
    if (this.taxRateForm.invalid && (this.baseId == 0 && this.isConRate)) {
      return;
    }
    if (this.taxRateForm.invalid && (this.isConRate && this.baseId!=0)) {
     return;
    }
    const newTaxRate = this.toTaxRateModel();
    if(this.isValidateTaxRate(newTaxRate))
    {
      this._taxRateService.addTaxRate(newTaxRate).subscribe((data: number) => {
        if(data > 0) {
          this.messageService.add({ severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
          this.onEmitHideForm(true);
        }else if(data == -1){
          this.messageService.add({key:'tax-rate', severity:'error', summary:'Alerta', detail: "Esta tasa de impuesto ya existe"});
        }else{
          this.messageService.add({key:'tax-rate', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la tasa de impuesto"});
        }
      }, ()=>{
        this.messageService.add({key:'tax-rate', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la tasa de impuesto"});
      });

    }
}
  isValidateTaxRate(newTaxRate: TaxRate)
  {
    debugger;
      let inValidateName = this.taxRateList.find(p=> p.name.trim().toUpperCase() === newTaxRate.name.trim().toUpperCase() && p.tax.id === newTaxRate.tax.id &&p.id !== newTaxRate.id);
      let inValidateAbbreviation = this.taxRateList.find(p=> p.abbreviation.trim().toUpperCase() === newTaxRate.abbreviation.trim().toUpperCase() && p.tax.id === newTaxRate.tax.id && p.id !== newTaxRate.id);

      if(inValidateName)
      {
        this.messageService.add({key:'tax-rate', severity:'error', summary:'Alerta', detail: "Ya existe una tasa de impuesto con el nombre ingresado"});
        return false;
      }

      if(inValidateAbbreviation)
      {
        this.messageService.add({key:'tax-rate', severity:'error', summary:'Alerta', detail: "La abreviatura de la tasa de impuesto ya se encuentra registrada en el impuesto seleccionado."});
        return false;
      }

      return true;
  }

  public resetForm() {
    if (this.taxRateForm.dirty) {
      this.confirmationService.confirm({
        message: '¿Desea cancelar el proceso de registrar tipo de aplicación impuesto?',
        accept: () => {
          this.taxRateForm.reset(this.setNewTaxRateForm());
          this.onEmitHideForm(false);
        }
      });
    } else {
      this.onEmitHideForm(false);
    }
  }

  private setNewTaxRateForm() {
      return this.formBuilder.group({
        id:-1,
        name: ['', Validators.required],
        abbreviation: [''],
        value: [0, Validators.required],
        statusValue : ['', Validators.required],
        selectedTax:[null, Validators.required],
        selectedRateType: [null, Validators.required],
        taxBase: [''],


      },
      {validators: ValueValidatorRateType('value', 'selectedRateType')}
      );
    }

  public onEmitHideForm(reload: boolean): void {
      this.onHideDialogForm.emit(reload);
  }

  public positiveVal(control:AbstractControl):{ [key: string]: any; } {
    if(this.taxRateForm.controls.selectedRateType.value !== RateTypeEnum.formula)
    {
      if (Number(control.value) <= 0) {
        return {nonZero: true};
      } else {
        return null;
      }
    }
    return null;
  }
  onTaxeSelected(RateId) {
    debugger;
    if (RateId!=0) {
      this.isConRate = false;
      this.selectedtaxesRatesApplication = RateId;
    }
    else {
      this.isConRate = true;
    }

    if (this.selectedtaxesRatesApplication?.length === 0) {
      this.isSelectedtaxeApplication = false;
    }
    else {
      this.isSelectedtaxeApplication = true;
    }
  }

}

