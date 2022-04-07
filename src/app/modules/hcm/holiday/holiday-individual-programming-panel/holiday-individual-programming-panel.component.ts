import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { DatePipe } from '@angular/common';
//Service
import { MessageService, SelectItem } from 'primeng/api';
import { HolidaysConfigurationService } from '../../shared/services/holidays/holidays-configuration.service';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';
import { PayrollCalendarService } from '../../shared/services/payroll-calendar.service';
import { HolidaysProgramationService } from '../../shared/services/holidays/holidays-programming.service';
//Model
import { SalaryByLaborRelationship } from '../../shared/models/salaries/salary-labor-relationship';
import { HolidaysIndividualProgramation } from '../../shared/models/holidays/holidays-individual-programation';
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { PayrollCalendarFilter } from '../../shared/filters/payroll-calendar-filter';
import { PayrollCalendar } from '../../shared/models/masters/payroll-calendar';
import { CalculateHolidayCycleFilter } from '../../shared/filters/holidays/calculate-holiday-cycle-filter';
import { CalculateHolidayCycle } from '../../shared/models/holidays/calculate-holiday-cycle';
import { HolidayCycle } from '../../shared/models/holidays/holiday-cycle';
import { HolidaysConfiguration } from '../../shared/models/holidays/holidays-configuration';
import { HolidaysConfigurationFilter } from '../../shared/filters/holidays/holidays-configuration-filter';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-holiday-individual-programming-panel',
  templateUrl: './holiday-individual-programming-panel.component.html',
  styleUrls: ['./holiday-individual-programming-panel.component.scss'],
  providers: [DatePipe]
})
export class HolidayIndividualProgrammingPanelComponent implements OnInit {
  @Input() showDialog: boolean;
  @Input() model: HolidaysIndividualProgramation;
  @Input() data: HolidayCycle;
  @Output() backUnChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveData: EventEmitter<HolidayCycle> = new EventEmitter<HolidayCycle>();
  
  _Authservice : AuthService = new AuthService(this._httpClient);
  typeHolidaysOption: any[];
  typeHolidaysSelect: {name:string , value: number};
  statusHolidaysOption: any [];
  statusHolidaysSelect: {name:string , value: number};
  enjoymentDay: number = 0;
  maxEnjoyDay: number = 0;
  noProgrammed: number = 0;

  selectPayrollType: number = 0;
  payrollTypelist : SelectItem[] = [];
  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  payrollCalendarFilter = new  PayrollCalendarFilter();
  payDateList: SelectItem[] = [];

  holidaysConfigurationFilter: HolidaysConfigurationFilter = new HolidaysConfigurationFilter();
  holidaysConfiguration = new HolidaysConfiguration();

  calculateHolidayCycleFilter: CalculateHolidayCycleFilter = new CalculateHolidayCycleFilter();
  calculateHolidayCycleModel: CalculateHolidayCycle = new  CalculateHolidayCycle();

  startDate: Date;
  endDate: Date;
  dateMin: Date;
  paymentDate: {name:string, value:number};
  submitted: boolean = false;
  activeInputs: boolean = false;

  showStatus: boolean = true;
  showAnticipated: boolean = false;

  constructor(private messageService: MessageService,
              private _payrollCalendarService :PayrollCalendarService,
              private _holidaysProgramationService: HolidaysProgramationService,
              public datepipe: DatePipe,
              private payrolltypeService: PayrollTypeService,
              private _httpClient: HttpClient,
              private _holidaysConfigurationService: HolidaysConfigurationService,
    ) { }

  ngOnInit(): void {
    
    this.statusHolidaysOption = [{name:'Registradas', value: 83},{name:'Programadas', value: 84},{name:'Disfrutadas', value:85}];  
    this.statusHolidaysSelect = {name:'Programadas', value:84};
   if(this.data.idStatus == 84){
    this.typeHolidaysOption = [{name:'Anticipadas', value: 1},{name:'Proporcionales', value:2}];
    this.startDate = new Date(this.data.starDate);
    this.startDate.setMinutes(this.startDate.getMinutes() + this.startDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
    this.endDate = new Date(this.data.endDate);
    this.endDate.setMinutes(this.endDate.getMinutes() + this.endDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
    this.selectPayrollType = this.data.idPayrollType;
    this.calculateHolidayCycleModel.cycleHolidays = this.data.cycleHolidays;
    this.paymentDate = {name:this.data.payDate.split('-').reverse().join('/'), value:this.data.idCalendar};
    this.enjoymentDay = this.data.enjoyDays + this.data.additionalDays ;
    this.maxEnjoyDay = this.model.balance.noProgrammed;
    this.noProgrammed = this.model.balance.noProgrammed;
    this.loadPayDates(1);
    this.loadTypeHolidays(this.data.idTypeHoliday);
    this.activeInputs= false;
    this.showAnticipated= true; 
   }else{
    this.loadHolidaysConfiguration();
   }
    this.loadPayrollTypes();
  }
  
  loadHolidaysConfiguration(){
    this.holidaysConfigurationFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._holidaysConfigurationService.GetHolidaysConfiguration(this.holidaysConfigurationFilter).subscribe((data:HolidaysConfiguration[]) => {
      this.holidaysConfiguration = data[0];
      if(this.holidaysConfiguration.enableAnticipated == true){
        this.typeHolidaysOption = [{name:'Anticipadas', value: 1},{name:'Proporcionales', value:2}];
        this.activeInputs= true;
      }else{
        this.typeHolidaysOption = [{name:'Proporcionales', value:2}];
        this.loadTypeHolidays(2);
        this.startDate = new Date(this.data.minDate);
        this.dateMin = new Date(this.data.minDate);
        this.CalculateEndDate();
        this.activeInputs= false;
        this.showAnticipated= true;      
      }
      
    })
    
  }

  loadTypeHolidays(id){
    switch(id){
      case 1: this.typeHolidaysSelect = {name:'Anticipadas', value:1};
      break;

      case 2: this.typeHolidaysSelect = {name:'Proporcionales', value:2};
      break;

      default:
        break;
    }
  }


  loadPayrollTypes() {
    this.payrollTypeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this.payrolltypeService.GetPayrollTypes(this.payrollTypeFilter).subscribe((data: PayrollType[]) => {
    this.payrollTypelist = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
      value: item.id,
      label: item.name
      }));
    }, (error: HttpErrorResponse) => {
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los Tipo de nómina" });
    });
  }

  GetDataCalculateEndDate(){
    let toDay = new Date();
    if(this.typeHolidaysSelect.value == 1){
      this.calculateHolidayCycleFilter.idTypeHoliday = 1;
      this.startDate = new Date(toDay);
      this.startDate.setDate(this.startDate.getDate() + 1)
      this.startDate.setMinutes(this.startDate.getMinutes() + this.startDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
      
      this.dateMin = new Date(toDay);
      this.dateMin.setDate(this.dateMin.getDate() + 1)
      this.dateMin.setMinutes(this.dateMin.getMinutes() + this.dateMin.getTimezoneOffset());  //evita que la fecha disminuya un dia
    }else{
      this.calculateHolidayCycleFilter.idTypeHoliday = 2;
      this.startDate = new Date(this.data.minDate);
      this.startDate.setMinutes(this.startDate.getMinutes() + this.startDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
      this.dateMin = new Date(this.startDate);
    }
    this.CalculateEndDate();
    this.activeInputs = false;
  }

  loadPayDates(value){   
    let thisYear = new Date().getFullYear();

    switch(value){
      case 1: this.payrollCalendarFilter.idPayrollType = this.data.idPayrollType;
      break;

      case 2: this.payrollCalendarFilter.idPayrollType = this.selectPayrollType;
      break;

      default:
        break;
    }
    this.payrollCalendarFilter.year = thisYear;
    this._payrollCalendarService.GetPayrollCalendarList(this.payrollCalendarFilter).subscribe((data: PayrollCalendar) => {    
      this.payDateList = data.payrollCalendarDetail.filter(x => x.idStatus == 72).map<SelectItem>((item) =>({
        value: item.id,
        name: item.paymentDate.split('-').reverse().join('/')
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar la fecha de pago." });        
    });
  }

  CalculateEndDate(){
    if(this.startDate != null){
      this.calculateHolidayCycleFilter.enjoyDays = this.enjoymentDay;
      this.calculateHolidayCycleFilter.idCycleHolidays = this.data.idCycleHolidays;
      this.calculateHolidayCycleFilter.startDate =this.datepipe.transform(this.startDate,'yyyy-MM-dd');
      this._holidaysProgramationService.GetCalculateHolidaysCycle(this.calculateHolidayCycleFilter).subscribe((data: CalculateHolidayCycle) => {
        this.calculateHolidayCycleModel = data;    
        this.endDate = new Date(this.calculateHolidayCycleModel.endDate);
        this.endDate.setMinutes(this.endDate.getMinutes() + this.endDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
        this.enjoymentDay= this.calculateHolidayCycleModel.daysAvailable;
        this.noProgrammed = this.calculateHolidayCycleModel.daysAvailable; 
        this.maxEnjoyDay = this.calculateHolidayCycleModel.daysAvailable;
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al calcular la fecha fin." });
      });
    }
  }

  CalculateEndDate1(){
    if(this.startDate != null){
      this.calculateHolidayCycleFilter.enjoyDays = this.enjoymentDay;
      this.calculateHolidayCycleFilter.idCycleHolidays = this.data.idCycleHolidays;
      this.calculateHolidayCycleFilter.startDate =this.datepipe.transform(this.startDate,'yyyy-MM-dd');
      this._holidaysProgramationService.GetCalculateHolidaysCycle(this.calculateHolidayCycleFilter).subscribe((data: CalculateHolidayCycle) => {
        this.calculateHolidayCycleModel = data;    
        this.endDate = new Date(this.calculateHolidayCycleModel.endDate);
        this.endDate.setMinutes(this.endDate.getMinutes() + this.endDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
        
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al calcular la fecha fin." });
      });
    }
  }

  sumit(){
    if(this.typeHolidaysSelect == null || this.startDate == null || this.selectPayrollType == 0 || this.enjoymentDay == 0 || this.statusHolidaysSelect == null){ 
      this.submitted = true;
    }else{
      debugger
        this.data.enjoyDays = this.enjoymentDay;
        this.data.idStatus = this.statusHolidaysSelect.value;
        this.data.idTypeHoliday = this.typeHolidaysSelect.value;
        this.data.typeHoliday = this.typeHolidaysSelect.name;
        this.data.idCalendar = this.paymentDate.value;
        this.data.idHolidayProgramation = this.data.idHolidayProgramation == 0 ? -1 : this.data.idHolidayProgramation;
        this.data.starDate = this.datepipe.transform(this.startDate,'yyyy-MM-dd');
        this.data.endDate = this.datepipe.transform(this.endDate,'yyyy-MM-dd');
        this.data.payDate = this.paymentDate.name.split('/').reverse().join('-');
        this.data.status = this.statusHolidaysSelect.name;  
      this.saveData.emit(this.data);
    } 
  }

  onRowSelect(event) {
    this.messageService.add({detail: event.data.name});
  }
  outForm(){
    this.backUnChange.emit(false);
  }

}
