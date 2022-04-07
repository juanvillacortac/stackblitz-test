import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { Country } from 'src/app/models/masters/country';
import { Tax } from 'src/app/models/masters/tax';
import { TaxFilters } from 'src/app/models/masters/tax-filters';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';
import { Article } from 'src/app/models/financial/article';
import { TaxeTypeApplicationFilters } from 'src/app/models/masters/taxe-type-application-filters';
import { TaxeBaseRatesApplicationFilters } from 'src/app/models/masters/taxe-base-rates-filter';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { TaxeTypeApplicationService } from '../../taxe-type-application/shared/taxe-type-application.service';
import { TaxService } from '../shared/tax.service';
import { TaxeBaseRatesApplication } from '../../../../models/masters/taxe-base-rates';
import { ArticleClassificationService } from '../../../financial/article-classification/shared/services/article-classification.service';
import { AccountingPlanBase } from '../../../financial/initial-setup/shared/accounting-plan-base.component';
// import { TaxeBaseApplication } from '../../../../models/masters/taxe-base;
import { filter } from 'rxjs/operators';
import { CostsOfTheArticleModal } from 'src/app/models/financial/CostsOfTheArticleModal';
import { Coins } from 'src/app/models/masters/coin';
import { BankTransaction } from 'src/app/models/financial/bank-transactions';
import { AuxiliariesAccountingAccountFilter } from 'src/app/models/financial/AuxiliariesAccountingAccount';
import { CompaniesCatalogEditDialogComponent } from 'src/app/modules/hcm/companies-catalog/companies-catalog-edit-dialog/companies-catalog-edit-dialog.component';
import { TypeTaxFilters} from 'src/app/models/masters/type-tax-filters';
import { TaxType } from 'src/app/models/masters/tax-type';

@Component({
  selector: 'app-tax-detail',
  templateUrl: './tax-detail.component.html',
  styleUrls: ['./tax-detail.component.scss']
})
export class TaxDetailComponent  extends AccountingPlanBase implements OnInit {
  submitted = false;
  countries: SelectItem<Country[]> = { value: null };
  TaxeBaseRates: SelectItem<TaxeBaseRatesApplication[]> = { value: null };
  TaxeBases: SelectItem<TaxeBaseRatesApplication[]> = { value: null };
  TaxTypes: TaxType[];

  //Selected ComboValues
  selectedTaxTypeApplication: number=0;
  selectedtaxType: number=0;
  selectedTaxBaseRate:number=0;
  selectedTaxBaseApplication:number=0;
  //Selected ComboValues

  requiredd: string = "*";
  idCuentaValue:number=0;

  taxeTypeApplication: TaxeTypeApplication[]
  selectedtaxeTypeApplication: TaxeTypeApplication[];
  selectedtaxeType: TaxeTypeApplication[];
  TAList: TaxeTypeApplication[];


  selectedTaxeBaseApplication: TaxeBaseRatesApplication;
  isSelectedtaxeTypeApplication = false;
  taxForm: FormGroup;
  isEdit = false;
  formTitle: string;
  taxAdded: boolean;
  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() tax: Tax;
  @Input() taxList: Tax[];
  status: SelectItem[] = [
    { label: 'Inactivo', value: '0' },
    { label: 'Activo', value: '1' }
  ];
  _validations: Validations = new Validations();

  //Article Variables
  showDialog = false;
  viewMode = false;
  article = new Article();
  displayModal: boolean;
  coins: Coins[]
  accountingAccountCode : string = "";
  costsOfTheArticleModals = [] as CostsOfTheArticleModal[];
  accountCode = "";
  accountCodeId = "";
  idPlanCuentaContableDetalle: number;
  transact = new BankTransaction()
  idAuxiliar =0;
  auxiliarylist: SelectItem[];
  filter: AuxiliariesAccountingAccountFilter = new AuxiliariesAccountingAccountFilter();

  getCoinName = (id: number) => this.coins.find(c => c.id == id)
  // (onCreate)="onCreate($event)"(onUpdate)="onUpdate($event)"
  //Articles Variables

  //Constructor
  constructor(
    private _taxService: TaxService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    injector: Injector,
    private _taxeTypeApplicationService: TaxeTypeApplicationService,
    private _articleClassificationService: ArticleClassificationService,
    private _countryService: CountryService) {
      super(injector)
    this.taxForm = this.setNewTaxForm();
  }

  //Articles Method
  onCreate(data: any) {}
  onUpdate(data: any) {}
  //Articles Method


  showModalDialog() {

    this.displayModal = true;

  }

  //Get IdCuentacontable
  getIdCuentaContable(param:number){
    this.idCuentaValue = param;
  }


  formatCode = (
    str: string | string[], separator: string = this.currentSeparator.separatorContent || '0',
    options = this.formatCodeOptions
  ) => Array.isArray(str)
      ? str.join(separator)
      : str
        .split(options.innerSeparator)
        .join(separator)

  getaccountingAccountCode(param:string){
    if(param) {
    this.accountCode = this.formatCode(param,'-');
    }
  }

  onLoadAuxiliariesAssociatedList(_onLoad?: () => void) {
    debugger
    this.auxiliarylist = [];
    this.filter.idCuentaContable = this.idPlanCuentaContableDetalle || -1;

    this.filter.active = 1;
    //this.AuxiliarID=-1;

    this._articleClassificationService.getAuxiliariesAssociatedList(this.filter)
      .subscribe((data) => {
        data.sort((a, b) => 0 - (a.id > b.id ? -1 : 1));
        this.auxiliarylist = data.map((item) => ({
          label: item.auxiliar,
          value: item.id,
        }))
      }, (error) => {
        console.log(error);
      });
  }

  //onInit Method
  ngOnInit(): void {
    // se obtienen los paises
    this.getCountriesPromise().then(() => {
      this.getTaxesTypeApplicationsPromise().then(() => {
        if (this.tax) {
          this.formTitle = "Editar impuesto"
          this.isEdit = true;
          this.onEditForm();
        }
        else {
          this.formTitle = "Nuevo impuesto"
          this.isEdit = false;
          this.taxForm.controls.statusValue.setValue('1');
        }
      });
    });
    // se obtienen los tipos de impuestos base
    this.getTaxesBaseRatesApplicationsPromise();
    // se obtiene los impuestos bases
    this.getTaxesBaseApplicationsPromise(0);
    this.getTaxesTypePromise();

    if (this.accountCode!=""){
    this.accountCode = this.formatCode(this.accountCode,'-');
    }
  }

  //On Edit Form
  onEditForm() {
debugger;
    this.taxForm.patchValue({
      id: this.tax.id,
      name: this.tax.name,
      abbreviation: this.tax.abbreviation,
      statusValue: this.tax.active ? String(StatusEnum.active) : String(StatusEnum.inactive),
      selectedCountries: this.countries.value.find(p => Number(p.id) === Number(this.tax.country.id)),

    });

    this.selectedtaxType = this.tax.taxTypeId;
    this.selectedTaxBaseRate = this.tax.taxBaseTypeId;
    this.accountCode = this.tax.accounts.length > 0 ? this.tax.accounts[0].accountingAccountCode : "";
    this.selectedtaxeTypeApplication = [];
    this.addTaxeTypeApplicationSelected();
    this.isSelectedtaxeTypeApplication = true;

  }


  //Add Type Application When Select Combo
  private addTaxeTypeApplicationSelected() {
    debugger;
    this.tax.taxeTypeApplication.forEach(element => {
      const taxeTypeEdited = this.taxeTypeApplication.find(p => element.id === p.id)
      if (taxeTypeEdited) {
        this.selectedtaxeTypeApplication.push(taxeTypeEdited);
        debugger;
      }
    });

  }

   // Selected Tax Base Rates Application
 onTaxeBaseRatesApplicatioSelected(event) {
 // this.selectedTaxBaseApplication = event;
  this.selectedTaxBaseRate = event;
  this.getTaxesBaseApplicationsPromise(event);
}
 // Selected Tax Base Application
 onTaxeBaseSelected(event) {
  this.selectedTaxBaseApplication = event;
}

  // Selected Tax Type Aplication Event
  onTaxeTypeApplicatioSelected(taxeTypeApplicationSelected) {
    this.selectedtaxeTypeApplication = taxeTypeApplicationSelected;
    if (this.selectedtaxeTypeApplication?.length === 0) {
      this.isSelectedtaxeTypeApplication = false;
    }
    else {
      this.isSelectedtaxeTypeApplication = true;
    }
  }

    // Selected Tax Type Aplication Event
    onTaxTypeSelected(taxeTypeApplicationSelected) {
      this.selectedtaxType = taxeTypeApplicationSelected.taxTypeId;
    }


  // Selected Tax Base Rates Application
  onAuxiliarSelected(event) {
    this.idAuxiliar = event.value;
  }

  //Get Countries
  getCountriesPromise = () => {
    const filters = new CountryFilter();
    filters.active = StatusEnum.active;
    return this._countryService.getCountriesPromise(filters)
      .then(results => {
        this.countries.value = results.sort((a, b) => a.name.localeCompare(b.name));
      }, (error) => {
        this.messageService.add({ key: 'tax', severity: 'error', summary: 'Cargar paises', detail: error.error.message });
        console.log(error.error.message);
      });
  }

  //Get TaxTypesApplication (TaxeTypeApplication)
  getTaxesTypeApplicationsPromise = () => {
    const filters = new TaxeTypeApplicationFilters();
    filters.id = -1;
    this.taxeTypeApplication = [];
    return this._taxeTypeApplicationService.getTaxeTypeApplications(filters)
      .then((results: TaxeTypeApplication [])  => {
        this.TAList = results.sort((a, b) => a.name.localeCompare(b.name));
        this.TAList.forEach(element => {
          var Rat = new TaxeTypeApplication();
          Rat.name= element.name,
          Rat.id=element.id
          this.taxeTypeApplication.push(Rat);
        });

      }, (error) => {
        this.messageService.add({ key: 'tax', severity: 'error', summary: 'Cargar tipo aplicación', detail: error.error.message });
        console.log(error.error.message);
      });
  }

  //Get TaxBaseRates (Tipo de impuesto Base - Estandar/Impuesto) - (TaxeBaseRatesApplication)
  getTaxesBaseRatesApplicationsPromise = () => {
    const filters = new TaxeBaseRatesApplicationFilters();
    filters.id = -1;
    filters.taxBaseRateId = -1;
    return this._taxService.getTaxesBaseRates(filters)
      .then((results) => {
        debugger;
        this.TaxeBaseRates = results.map(item => ({
          label: item.taxBaseRateName,
          value: item.taxBaseRateId
        }));
      }, (error) => {
        this.messageService.add({ key: 'tax', severity: 'error', summary: 'Cargar tasa de impuesto base', detail: error.error.message });
        console.log(error.error.message);
      });
  }

  //Get TaxBase (impuesto Base) -
  getTaxesBaseApplicationsPromise = (seletedValue: number) => {
    const filters = new TaxFilters();
    return this._taxService.getTaxes(filters)
      .then((results_TB) => {
        this.TaxeBases = results_TB.filter(x => x.taxTypeId == 1).map(item => ({
          label: item.name,
          value: item.id
        }));
        this.selectedTaxBaseApplication = this.TaxeBases[0].value;
      }, (error) => {
        this.messageService.add({ key: 'tax', severity: 'error', summary: 'Cargar impuesto base', detail: error.error.message });
        console.log(error.error.message);
      });
  }

  //Get TaxTypes (tipo de impuesto) -
  getTaxesTypePromise = () => {
    const filters = new TypeTaxFilters();
    this.TaxTypes = [];
    return this._taxService.getTypetax(filters)
      .then((results_TB) => {

        results_TB.forEach(element => {
          debugger;
          var em = new TaxType();
          em.taxTypeName = element.taxTypeName;
          em.taxTypeId = element.taxTypeId;
          em.active = element.active;
          this.TaxTypes.push(em);
        });
        debugger;
      }, (error) => {
        this.messageService.add({ key: 'tax', severity: 'error', summary: 'Cargar tipo de impuesto', detail: error.error.message });
        console.log(error.error.message);
      });
    }

  showModal(){
    this.showDialog = true;
  }

  new() {
    this.viewMode = false;
    this.showDialog = true;
  }

  //push TaxTypeApplication
  pushToSaveTaxeTypeApplication() {
    if (this.isEdit) {
      const newtaxeTypeApplications: TaxeTypeApplication[] = [];
      this.taxeTypeApplication.forEach(element => {
        const taxeTypeExisted = this.tax.taxeTypeApplication.find(p => element.id === p.id);
        const taxeTypeSelected = this.selectedtaxeTypeApplication.find(p => element.id === p.id);
        if (taxeTypeSelected) {
          newtaxeTypeApplications.push(taxeTypeSelected);
        }
        else if (taxeTypeExisted) {
          element.active = false;
          newtaxeTypeApplications.push(element);
        }
      });
      return newtaxeTypeApplications;
    }
    else {
      return this.selectedtaxeTypeApplication;
    }
  }

   //
  toTaxModel() {
    debugger;
    let model = new Tax();
    this.accountCode;
    model.BusinessId = 1;
    model.id = this.taxForm.controls.id.value;
    model.name = this.taxForm.controls.name.value;
    model.abbreviation = this.taxForm.controls.abbreviation.value;
    model.active = this.taxForm.controls.statusValue.value === '0' ? false : true;
    model.taxeTypeApplication = this.pushToSaveTaxeTypeApplication();
    model.country = this.taxForm.controls.selectedCountries.value;
    model.taxTypeId=this.selectedtaxType;
    model.taxBaseTypeId=this.selectedTaxBaseRate;
    model.taxBaseId=this.selectedTaxBaseApplication;
    model.AccountingAccountId=this.idCuentaValue;
    model.AuxiliaryId = this.idAuxiliar==0?-1:this.idAuxiliar;

    return model;
  }

  // on Save Data
  onSave() {
    this.submitted = true;
    if (this.taxForm.invalid) {
     return;
    }
    const newTax = this.toTaxModel();
    if (this.isValidateTax(newTax)) {
      this._taxService.addTax(newTax).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.onEmitHideForm(true);
        } else if (data == -1) {
          this.messageService.add({ key: 'tax', severity: 'error', summary: 'Alerta', detail: "Este impuesto ya existe" });
        } else {
          this.messageService.add({ key: 'tax', severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el impuesto" });
        }
      }, () => {
        this.messageService.add({ key: 'tax', severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el impuesto" });
      });
    }
  }

  //is ValidateTax
  isValidateTax(newTax: Tax) {
    let inValidateName = this.taxList.find(p => p.name.trim().toUpperCase() === newTax.name.trim().toUpperCase() && p.country.id === newTax.country.id && p.id !== newTax.id);
    let inValidateAbbreviation = this.taxList.find(p => p.abbreviation.trim().toUpperCase() === newTax.abbreviation.trim().toUpperCase() && p.country.id === newTax.country.id && p.id !== newTax.id);

    if (inValidateName) {
      this.messageService.add({ key: 'tax', severity: 'error', summary: 'Alerta', detail: "El nombre del impuesto ya se encuentra registrado en el país seleccionado." });
      return false;
    }

    if (inValidateAbbreviation) {
      this.messageService.add({ key: 'tax', severity: 'error', summary: 'Alerta', detail: "La abreviatura del impuesto ya se encuentra registrada en el país seleccionado." });
      return false;
    }

    return true;
  }

  //SetNewTax
  private setNewTaxForm() {
    return this.formBuilder.group({
      id: -1,
      name: ['', Validators.required],
      abbreviation: ['', Validators.required],
      selectedCountries: [null, Validators.required],
      statusValue: ['', Validators.required]
    });
  }

  //Emit Data Modal
  public onEmitHideForm(reload: boolean): void {
    this.onHideDialogForm.emit(reload);
  }
}

