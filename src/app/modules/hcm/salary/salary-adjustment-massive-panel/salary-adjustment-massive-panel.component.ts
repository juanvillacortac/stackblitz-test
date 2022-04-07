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
  selector: 'app-salary-adjustment-massive-panel',
  templateUrl: './salary-adjustment-massive-panel.component.html',
  styleUrls: ['./salary-adjustment-massive-panel.component.scss'],
  providers: [DatePipe]
})
export class SalaryAdjustmentMassivePanelComponent implements OnInit {

  @Input() title: string;
  @Input() showDialog: boolean;
  @Input() record: Salaries;
  @Input() companyId: number;
  @Input() idJobPosition: number; 
  
  @Output() backUnChanges : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() recordSave : EventEmitter<Salaries> = new EventEmitter<Salaries>();
  
  constructor(public datepipe: DatePipe, 
    private messageService: MessageService,
    private RateExchangeService: RateExchangexTypeSalaryService,
    private _motiveService: MotivesService,
    private salaryRangeService: SalaryRangeService) 
    { 
      
    }
    
  submitted: boolean = false;
  effectiveDate: Date;
  factorDate: Date = new Date();
  effectiveDateText: string = "";
  testDate: Date = new Date();
  selectMotive: SelectItem = {label:"", value:-1};
  salaryRangeFilter: SalaryRangeFilter = new SalaryRangeFilter();
  salaryRateFilter: RateExchangexTypeSalaryFilter = new RateExchangexTypeSalaryFilter();
  salaryRange: SalaryRange = new SalaryRange();
  salaryRateExchange: RateExchangexTypeSalary = new RateExchangexTypeSalary();
  motives: SelectItem[];
  motiveFilter: MotivesFilters = new MotivesFilters();

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

  opc: string = "val1";
  locked: string = "val1";
  today: Date = new Date();


  ngOnInit(): void {
    this.loadSalaryRateExchange();
    this.loadMotives();
    //this.record = JSON.parse(JSON.stringify(this.record));
  }

  loadData(){
    if(this.record.adjustment.idSalaryAdjustment != -1){
      if(this.record.adjustment.validityDate == null){
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
        this.record.adjustment.adjustmentPercentage = this.percentage;
        // if(this.percentage < 0){
        //   this.percentage = 0
        // }else{
        //   this.record.adjustment.adjustmentPercentage = this.percentage;
        // }
      }else{
        this.percentage = this.record.adjustment.adjustmentPercentage;
      }
      debugger;
      //let juandc = 
    }else{
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

  loadMotives(){
    this.motiveFilter.idMotivesType = 3;
    this._motiveService.getMotives(this.motiveFilter).then((data: MotivesType[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.motives = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
      debugger;
      
   }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Carga de tipo de motivos', detail: "Ha ocurrido un error cargando los motivos"});
    });
  }

  submit(){
    debugger;
    if((this.percentage == null || this.percentage <= 0 && this.locked == 'val2') || (this.amount == null || this.amount <= 0 && this.locked == 'val1') || this.effectiveDate == null || this.selectMotive.value == -1){
      this.submitted = true;
    }else{
      var salaryType = this.record.salary.salaryType.toLocaleLowerCase() == 'sueldo base';
      if(salaryType && this.record.salary.amount > this.amount){
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


}
