import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesType } from 'src/app/models/masters/motives-type';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { RateExchangexTypeSalaryFilter } from '../../shared/filters/salaries/rate-exchange-xtype-salary-filter';
import { SalaryRangeFilter } from '../../shared/filters/salaries/salary-range-filter';
import { RateExchangexTypeSalary } from '../../shared/models/salaries/rate-exchange-xtype-salary';
import { Salaries } from '../../shared/models/salaries/salaries';
import { SalaryRange } from '../../shared/models/salaries/salary-range';
import { RateExchangexTypeSalaryService } from '../../shared/services/salaries/rate-exchange-xtype-salary.service';
import { SalaryRangeService } from '../../shared/services/salaries/salary-range.service';

@Component({
  selector: 'app-salary-adjustment-job-position-panel',
  templateUrl: './salary-adjustment-job-position-panel.component.html',
  styleUrls: ['./salary-adjustment-job-position-panel.component.scss'],
  providers: [DatePipe]
})
export class SalaryAdjustmentJobPositionPanelComponent implements OnInit {

  @Input() title: string;
  @Input() showDialog: boolean;
  @Input() record: Salaries;
  @Input() companyId: number;
  @Input() idJobPosition: number;
  @Input() salaryTypesDropdown: SelectItem[];

  @Output() backUnChanges : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() recordSave : EventEmitter<Salaries> = new EventEmitter<Salaries>();

  motiveFilter: MotivesFilters = new MotivesFilters();
  
  constructor(public datepipe: DatePipe, 
              private motiveService: MotivesService, 
              private messageService: MessageService,
              private RateExchangeService: RateExchangexTypeSalaryService,
              private salaryRangeService: SalaryRangeService) 
              { 
                
              }
 
  submitted: boolean = false;
  motives: SelectItem[] = [];
  effectiveDate: Date;
  factorDate: Date;
  effectiveDateText: string = "";
  testDate: Date = new Date();
  selectMotive: SelectItem = {label:"", value:-1};
  salaryRangeFilter: SalaryRangeFilter = new SalaryRangeFilter();
  salaryRateFilter: RateExchangexTypeSalaryFilter = new RateExchangexTypeSalaryFilter();
  salaryRange: SalaryRange = new SalaryRange();
  salaryRateExchange: RateExchangexTypeSalary = new RateExchangexTypeSalary();

  symbolCoin1: string = "";
  symbolCoin2: string = "";
  amount: number = 0;
  conversion: number = 0;
  rateExchange: number = 0;
  percentage: number =0;
  min: number = 0;
  max: number = 0;

  selectedPercentage: boolean = true;
  selectedAmount: boolean = false;
  lockedPercentage: boolean = false;

  opc: string = "";
  today: Date = new Date();
  salaryTypeCreate: any;


  ngOnInit(): void {
    this.loadMotives();
    if(this.record.salary.idSalaryType != -1){
      this.loadSalaryRateExchange();
    }
    //this.record = JSON.parse(JSON.stringify(this.record));
  }

  loadData(){
    if(this.record.salary.amount <= 0){   //si se esta creando un nuevo salario, se bloquea la opcion de porcentaje
      this.lockedPercentage = true;
    }
    if(this.record.salary.idSalaryByLaborRelationship != -1){

      if(this.record.adjustment.validityDate == null){  /// se asigna la fecha de vigencia del registro, de lo contrario se asigna la fecha actual
        this.effectiveDate = new Date();
      }else{
        this.effectiveDate = new Date(this.record.adjustment.validityDate);
      }
      this.effectiveDate.setMinutes(this.effectiveDate.getMinutes() + this.effectiveDate.getTimezoneOffset());
      this.selectMotive.value = this.record.adjustment.idSalaryReason;
      this.selectMotive.label = this.record.adjustment.salaryReason;
      this.min = this.record.salary.minAmount;
      this.max = this.record.salary.maxAmount;
      this.amount = this.record.adjustment.adjustmentAmount;
      this.rateExchange = this.record.salary.conversionFactor;
      this.conversion = this.rateExchange*this.amount;

      if(this.record.adjustment.adjustmentPercentage == 0){
        if(this.record.salary.amount == 0){
          this.percentage = 100;
        }else{
          this.percentage = (this.record.adjustment.adjustmentAmount * 100 / this.record.salary.amount) - 100;
        }
        
        if(this.percentage < 0){
          this.percentage = 0
        }else{
          this.record.adjustment.adjustmentPercentage = this.percentage;
        }
        
        switch (this.amount) {
          case this.min:
            this.opc="val1";
            break;
          case this.max:
            this.opc="val2";
            break;
          default:
            this.opc="val3";
            break;
        }

      }else{
        this.percentage = this.record.adjustment.adjustmentPercentage;
        this.opc="val3";
      }
      debugger;
      //let juandc = 
    }else{
      this.opc="val3";
      this.loadSalaryRange();
    }
  }

  loadSalaryRange(){
    this.salaryRangeFilter.idCompany = this.companyId;
    this.salaryRangeFilter.idTypeSalary = this.record.salary.idSalaryType;
    this.salaryRangeService.GetSalaryRangeList(this.salaryRangeFilter).subscribe((data: SalaryRange[]) =>{
      debugger;
      this.salaryRange = data.find(x => x.idJobPosition == this.idJobPosition);
      if(this.salaryRange != null){
        this.min = this.salaryRange.minAmount
        this.max = this.salaryRange.maxAmount
      }
    });
  }

  loadSalaryRateExchange(){
    this.salaryRateFilter.idCompany = this.companyId;
    this.salaryRateFilter.idTypeSalary = this.record.salary.idSalaryType;
    this.RateExchangeService.GetRateExchangexTypeSalary(this.salaryRateFilter).subscribe((data: RateExchangexTypeSalary) =>{
      this.salaryRateExchange = data;
      this.loadData();
      this.rateExchange = this.salaryRateExchange.conversionFactor;
      this.conversion = this.rateExchange*this.amount;
      this.symbolCoin2 = this.salaryRateExchange.symbolDestination;
      this.symbolCoin1 = this.salaryRateExchange.symbol;
      this.factorDate = new Date(this.salaryRateExchange.dateFactor);
    });
  }

  loadMotives (){
    debugger;
    this.motiveFilter.idMotivesType = 3;
    this.motiveService.getMotives(this.motiveFilter).then((data: MotivesType[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      debugger;
      this.motives = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
      
   }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Carga de tipo de motivos', detail: "Ha ocurrido un error cargando los motivos"});
    });
  }

  submit(){
    if(this.amount == null || this.amount <= 0 || this.effectiveDate == null || this.selectMotive.value == -1){
      this.submitted = true;
    }else{
      var salaryType = this.record.salary.salaryType.toLocaleLowerCase() == 'sueldo base';

      if(salaryType && this.record.salary.amount > this.amount){//se verifica que no disminuya el sueldo base por la creacion del ajuste
        this.messageService.add({severity:'error', summary:'Crear ajuste', detail: "El ajuste no puede disminuir el sueldo de tipo "+this.record.salary.salaryType.toLocaleLowerCase()});
      }else{
        this.record.adjustment.validityDate = this.datepipe.transform(this.effectiveDate,'yyyy-MM-dd');
        this.record.adjustment.adjustmentAmount = this.amount;
        this.record.adjustment.adjustmentPercentage = this.percentage;
        this.record.adjustment.idSalaryReason = this.selectMotive.value
        this.record.adjustment.salaryReason = this.selectMotive.label
        this.record.salary.conversionFactor = this.rateExchange;
        this.record.salary.currencySymbol = this.symbolCoin1;
        this.record.salary.maxAmount = this.max;
        this.record.salary.minAmount = this.min;
        this.recordSave.emit(this.record);
      }
    }
  }

  outForm(){
    this.backUnChanges.emit(false);
  }

  changeMotive(){
    this.record.adjustment.idSalaryReason = this.selectMotive.value;
    this.record.adjustment.salaryReason = this.selectMotive.label;
  }
  calculateValues(num: number){
    debugger;
    if(num < 4){  //si el monto se ingresa por una opcion diferente al porcentaje

      if(this.record.salary.amount == 0){//si es un nuevo salario, se asigna 100 al porcentaje, de lo contrario se calcula
        this.percentage = 100;
      }else{
        this.percentage = (this.amount * 100 / this.record.salary.amount) - 100;
      }
    }else{  //si el monto se crea a traves de la opcion porcentaje
      this.amount = this.record.salary.amount + (this.percentage * this.record.salary.amount / 100);
    }
    //se calcula el salario en la moneda de conversion
    this.conversion = this.rateExchange*this.amount;
    
  }

  changeAmount(){
    debugger;
    console.log(this.opc);
    switch (this.opc) {

      case "val1":  //si elige banda maxima, se asigna el valor automaticamente y se bloquean los campos
        this.amount = this.min;
        this.selectedAmount = true;
        this.selectedPercentage = true;
        this.calculateValues(1);
        break;

      case "val2":  //si elige banda minima, se asigna el valor automaticamente y se bloquean los campos
        this.amount = this.max;
        this.selectedAmount = true;
        this.selectedPercentage = true;
        this.calculateValues(2);
        break;

      case "val3":  //si elige personalizado, se habilita el input monto y se bloquea el input porncetaje
        this.amount = 0;
        this.selectedAmount = false;
        this.selectedPercentage = true;
        this.calculateValues(3);
        break;

      case "val4":  //si elige porncetaje, se habilita el input porncetaje y se bloquea el input monto
        this.percentage = 0;
        this.selectedAmount = true;
        this.selectedPercentage = false;
        this.calculateValues(4);
        break;
    }
  }

}
