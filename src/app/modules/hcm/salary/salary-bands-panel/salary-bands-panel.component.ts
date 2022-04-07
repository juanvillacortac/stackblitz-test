import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//Services
import { RateExchangexTypeSalaryService } from '../../shared/services/salaries/rate-exchange-xtype-salary.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

//Model
import { SalaryRangeViewFilter } from '../../shared/filters/salaries/salary-range-view-filter';
import { SalaryRange } from '../../shared/models/salaries/salary-range';
import { RateExchangexTypeSalaryFilter } from '../../shared/filters/salaries/rate-exchange-xtype-salary-filter';
import { RateExchangexTypeSalary } from '../../shared/models/salaries/rate-exchange-xtype-salary';

@Component({
  selector: 'app-salary-bands-panel',
  templateUrl: './salary-bands-panel.component.html',
  styleUrls: ['./salary-bands-panel.component.scss']
})
export class SalaryBandsPanelComponent implements OnInit {
  @Input() showDialog: boolean;
  @Input() index: number;
  @Input() salaryRangeView: SalaryRangeViewFilter;
  @Input() record: SalaryRange;  // Array for save new data salary range
  @Input() data: SalaryRange[]; // All data salary range
  @Input() jobPositionSelect: SelectItem[];
  @Input() salaryTypeSelect: SelectItem[];

  @Output() backUnChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveData: EventEmitter<SalaryRange> = new EventEmitter<SalaryRange>();

  _Authservice : AuthService = new AuthService(this._httpClient);
  
  rateExchangeFilter: RateExchangexTypeSalaryFilter = new RateExchangexTypeSalaryFilter() ;
  rateExchange: RateExchangexTypeSalary = new RateExchangexTypeSalary();

  salaryTypeItem: number = 0;
  jobPositionItem: number = 0;
  minAmount: number = 0;
  maxAmount: number = 0;
  conversionFactor: number = 0;
  conversionMin: number = 0;
  conversionMax: number = 0;
  percentMin:  number = 0;
  percentMax: number = 0;
  symbolShow: string = "";
  symbolDestiSwhow: string ="";
  submitted: boolean = false;
  isVisible: boolean = false;

  _validations:Validations = new Validations();
  today=  new Date().toLocaleString();

  constructor(private confirmationService: ConfirmationService,
              private _rateExchangexTypeSalaryService: RateExchangexTypeSalaryService,
              private _httpClient: HttpClient,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.initialValues();
    this.onLoadRateExchange();
  }

  initialValues(){
    debugger
    if(this.record.idSalaryRange!= -1){
      this.minAmount = this.record.minAmount;
      this.maxAmount = this.record.maxAmount;
      this.jobPositionItem = this.record.idJobPosition;
      this.salaryTypeItem = this.record.idTypeSalary
      this.isVisible = true
      this.symbolShow = this.record.symbol;
    }else{
      this.minAmount = 0;
      this.maxAmount = 0;
    }
  }

  onLoadRateExchange(){
    this.rateExchangeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this.rateExchangeFilter.idTypeSalary = this.record.idTypeSalary == -1 ? this.salaryTypeItem : this.record.idTypeSalary;
    this._rateExchangexTypeSalaryService.GetRateExchangexTypeSalary(this.rateExchangeFilter).subscribe((data: RateExchangexTypeSalary) => {
      this.rateExchange = data;
      this.symbolShow = this.rateExchange.symbol;
      this.symbolDestiSwhow = this.rateExchange.symbolDestination;
      this.calculateFactorAndPorcent(1);
      this.calculateFactorAndPorcent(2);
      }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar la tasa de cambio" });
  });
  }

  sumit(){
    if(this.jobPositionItem == 0 || this.salaryTypeItem == 0 || this.minAmount == 0 && this.maxAmount == 0){ 
      this.submitted = true;
    }else{    
      if(this.minAmount > this.maxAmount){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El monto mínimo no debe ser mayor al monto máximo" });
        this.minAmount = 0;
        this.maxAmount = 0;
        this.submitted = true;
      }else{
        if(this.record.idSalaryRange == -1){
          this.record.idJobPosition = this.jobPositionItem;
          this.record.jobPosition = this.jobPositionSelect.find(x => x.value == this.jobPositionItem).label;
          this.record.idTypeSalary = this.salaryTypeItem;
          this.record.typeSalary = this.salaryTypeSelect.find(x => x.value == this.salaryTypeItem).label;
          this.record.minAmount = this.minAmount;
          this.record.maxAmount = this.maxAmount;
          this.record.idCurrency = this.rateExchange.idCurrency; 
          this.record.abbreviation = this.rateExchange.abbreviation;
          this.record.currency = this.rateExchange.currency;
          this.record.symbol = this.rateExchange.symbol
          this.record.conversionFactor = this.rateExchange.conversionFactor
          this.record.dateFactor = this.rateExchange.dateFactor;  
          this.saveData.emit(this.record);
        }else{
          this.confirmationService.confirm({
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            message: '¿Deseas realizar la actualización de la banda salarial? ',
            accept: () => {      
              this.record.minAmount = this.minAmount;
              this.record.maxAmount = this.maxAmount;  
              this.saveData.emit(this.record);
              //console.log(this.record);
            },
            reject: () => {
              
            }
          });
        }     
      }
    } 
  }
  
  calculateFactorAndPorcent(id: number){
    debugger
    switch (id){
      case 1:
        this.percentMin = 0;
        debugger
        if(this.record.idSalaryRange != -1){
          this.percentMin = Math.trunc(((this.minAmount - this.record.minAmount ) / this.record.minAmount) * 100);
          if(isNaN(this.percentMin) || this.percentMin == Infinity){
            this.percentMin= 0
            this.record.minAmount = this.minAmount
          }
          this.conversionMin = this.record.conversionFactor * this.minAmount;      
        }else{
          this.conversionMin = this.rateExchange.conversionFactor * this.minAmount;
        }         
        break;
      case 2:
        this.percentMax = 0;
        if(this.record.idSalaryRange != -1){      
          this.percentMax = Math.trunc(((this.maxAmount - this.record.maxAmount ) / this.record.maxAmount) * 100);
          if(isNaN(this.percentMax) || this.percentMax == Infinity){
            this.percentMax= 0
            this.record.maxAmount = this.maxAmount
          }
          this.conversionMax = this.record.conversionFactor * this.maxAmount;             
        }else{
          this.conversionMax = this.rateExchange.conversionFactor * this.maxAmount; 
        }
        break;
    }
  }
  onChangeJobPosition(e){
    this.salaryTypeItem = this.salaryTypeItem == undefined ? 0 : this.salaryTypeItem;
    this.onChange(e.value,  this.salaryTypeItem);
  }

  onChangeSalaryType(e){
    this.jobPositionItem = this.jobPositionItem == undefined ? 0 : this.jobPositionItem;
    this.onChange(this.jobPositionItem, e.value);
  }

  onChange(jobPosition: number, salaryType: number){
    if(this.data.find(x => x.idJobPosition === jobPosition && x.idTypeSalary === salaryType)){  
      this.messageService.add({ severity: 'error', summary: 'Registro', detail: "La cambinación cargo con tipo de salario selecionado, ya existe."});
      this.jobPositionItem = null;
      this.salaryTypeItem = null;
      this.rateExchange.conversionFactor = 0;
    }
  }

  outForm(){
    this.backUnChange.emit(false);
  }

}
