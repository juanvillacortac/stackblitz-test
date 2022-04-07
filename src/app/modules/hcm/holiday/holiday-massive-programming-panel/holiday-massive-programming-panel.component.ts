import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { HolidaysConfigurationFilter } from '../../shared/filters/holidays/holidays-configuration-filter';
import { HolidaysProgramationEmployeeFilter } from '../../shared/filters/holidays/holidays-programation-employe-filter';
import { PayrollCalendarFilter } from '../../shared/filters/payroll-calendar-filter';
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { HolidaysBalance } from '../../shared/models/holidays/holidays-balance';
import { HolidaysConfiguration } from '../../shared/models/holidays/holidays-configuration';
import { HolidaysProgramationMassive } from '../../shared/models/holidays/holidays-massive-programation';
import { HolidaysProgramation } from '../../shared/models/holidays/holidays-programation';
import { HolidaysProgramationEmployee } from '../../shared/models/holidays/holidays-programation-employe';
import { PayrollCalendar } from '../../shared/models/masters/payroll-calendar';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { HolidaysConfigurationService } from '../../shared/services/holidays/holidays-configuration.service';
import { HolidaysProgramationService } from '../../shared/services/holidays/holidays-programming.service';
import { PayrollCalendarService } from '../../shared/services/payroll-calendar.service';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';

@Component({
  selector: 'app-holiday-massive-programming-panel',
  templateUrl: './holiday-massive-programming-panel.component.html',
  styleUrls: ['./holiday-massive-programming-panel.component.scss'],
  providers: [DatePipe]
})
export class HolidayMassiveProgrammingPanelComponent implements OnInit {

  @Input() showDialog: boolean;   
  @Input() holidayProgramationType: number;
  @Input() record: HolidaysProgramationMassive;
  @Input() holidaysTypeList: SelectItem[];

  @Output() backUnChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveRecord: EventEmitter<HolidaysProgramationMassive> = new EventEmitter<HolidaysProgramationMassive>();

  submitted: boolean = false;
  employee: boolean = false;
  displayModal: boolean = false;
  startDate: Date = null;
  endDate: Date = null;
  //payDate: Date = null;
  today = new Date();
  tomorrow: Date = new Date();
  cycleHoliday: string;
  startCycleHoliday: number;
  endCycleHoliday: number;
  status: number = 83;
  holidayType: number = -1;
  employeeList: HolidaysProgramation[] = [];
  showBalance: HolidaysProgramation = new HolidaysProgramation();

  selectPayrollType: number;
  payrollTypelist : SelectItem[];
  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  payrollCalendarFilter = new  PayrollCalendarFilter();
  payDateList: SelectItem[];
  selectPayDate: number;
  _Authservice : AuthService = new AuthService(this._httpClient);
  advancedHome: boolean;

  dialogTitle: string = "";
  holidaysConfigurationFilter: HolidaysConfigurationFilter = new HolidaysConfigurationFilter();

  statuslist: SelectItem[] = [
    { label: 'Todos', value: -1 },
    { label: 'Disfrutada', value: 85 },
    { label: 'Programada', value: 84 },
    { label: 'Registrada', value: 83 },
  ];

  constructor(  public datepipe: DatePipe, 
                private confirmationService: ConfirmationService,
                private payrolltypeService: PayrollTypeService,
                private _httpClient: HttpClient,
                private _holidaysConfigurationService: HolidaysConfigurationService,
                private activatedRoute: ActivatedRoute,
                private _holidayProgramation: HolidaysProgramationService,
                private messageService: MessageService,
                private _payrollCalendarService: PayrollCalendarService) { }

  ngOnInit(): void {
    debugger;
    this.loadHolidaysConfiguration();
    this.tomorrow.setDate(this.today.getDate() + 1);
    this.showBalance.balance = new HolidaysBalance();
    this.startCycleHoliday = this.today.getFullYear();
    this.endCycleHoliday = this.startCycleHoliday + 1;
    this.loadPayrollTypes();
    this.loadData();
    this.dialogTitle = this.holidayProgramationType == 2 ? "Programación masiva" : "Programación colectiva";
  }

  outForm(){
    this.backUnChange.emit(false);
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

  loadPayDates(){
    
    let thisYear = new Date().getFullYear();
    this.payrollCalendarFilter.idPayrollType = this.selectPayrollType;    ///buscar para edicion
    this.payrollCalendarFilter.year = thisYear;
    this._payrollCalendarService.GetPayrollCalendarList(this.payrollCalendarFilter).subscribe((data: PayrollCalendar) => {    
      this.payDateList = data.payrollCalendarDetail.filter(x => x.idStatus == 72).map<SelectItem>((item) =>({
        value: item.id,
        label: item.paymentDate.split('-').reverse().join('/')
      }));
      this.selectPayDate = this.record.idCalendar;
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar la fecha de pago." });        
    });
  }

  loadData(){
    debugger;
    this.selectPayrollType = this.record.idPayrollType;
    this.selectPayDate = this.record.idCalendar;
    this.record.idCompany = parseInt(this._Authservice.currentCompany);
    if(this.record.idHolidayProgramation != -1){
      this.holidayType = this.record.idHolidayType;
      var cycleList = this.record.cycleHolidays.split("-");
      this.startCycleHoliday = parseInt(cycleList[0]);
      this.endCycleHoliday = parseInt(cycleList[1]);
      this.status = this.record.idStatus;
      this.startDate = new Date(this.record.startDate);
      this.endDate = new Date(this.record.endDate);
      //this.payDate = new Date(this.record.payDate);
      this.startDate.setMinutes(this.startDate.getMinutes() + this.startDate.getTimezoneOffset());
      this.endDate.setMinutes(this.endDate.getMinutes() + this.endDate.getTimezoneOffset());
      //this.payDate.setMinutes(this.payDate.getMinutes() + this.payDate.getTimezoneOffset());
      this.employeeList = this.record.detail == null ? [] : this.record.detail;
      this.loadPayDates();
    }
  }

  showModalEmployeeList(){
    debugger;
    if(this.startDate == null || this.holidayType == -1){
      this.employee = true;
    }else{
      this.record.cycleHolidays = this.startCycleHoliday+"-"+this.endCycleHoliday;
      this.displayModal = true;
    }
  }

  submit(){
    if(this.holidayType == -1 || this.startDate == null || this.endDate == null){
      this.submitted = true;
    }else{
      this.record.idHolidayType =  this.holidayType;
      this.record.cycleHolidays = this.startCycleHoliday+"-"+this.endCycleHoliday;
      this.record.idStatus = this.status;
      this.record.idProgramationType = this.holidayProgramationType;
      this.record.startDate = this.datepipe.transform(this.startDate,'yyyy-MM-dd');
      this.record.endDate = this.datepipe.transform(this.endDate,'yyyy-MM-dd');
      //this.record.payDate = this.datepipe.transform(this.payDate,'yyyy-MM-dd');
      this.record.detail = this.employeeList;
      this.record.idCalendar = this.selectPayDate;
      this.saveRecord.emit(this.record);
    }
    
  }

  cycleHolidayChange(num: number){
    this.endCycleHoliday = num + 1;
  }

  setEndDay(start: Date){
    var employeeFilter = new HolidaysProgramationEmployeeFilter()
    employeeFilter.idCompany = this.record.idCompany;
    employeeFilter.idPayrollClass = -1;
    employeeFilter.startDate = this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
    employeeFilter.idHolidayProgramation = this.record.idHolidayProgramation;
    employeeFilter.seniorityDate = "1900-01-01";
    employeeFilter.employmentDate = "1900-01-01";
    this._holidayProgramation.GetHolidaysProgramationEmployee(employeeFilter).subscribe((data: HolidaysProgramationEmployee[]) => {
      debugger;
      this.endDate = null;
      this.employeeList.forEach(element => {
        var valido = data.find(x => x.idLaborRelationship == element.idLaborRelationship);
        if(valido){
          element.endDate = valido.endDate;
        }
        if(this.endDate == null){
          this.endDate = new Date(element.endDate);
          this.endDate.setMinutes(this.endDate.getMinutes() + this.endDate.getTimezoneOffset()); 
        }else{
          var newDate = new Date(element.endDate);
          newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset()); 
          if(this.endDate > newDate){
            this.endDate = newDate;
          }
        }
      });
    })
  }

  uploadListEmployee(list: HolidaysProgramationEmployee[]){
    var newList = [];
    list.forEach(element =>{
      var object = new HolidaysProgramation();
      object.idLaborRelationship = element.idLaborRelationship;
      object.idDetailHolidayProgramation = -1;
      object.idPayrollClass = element.idPayrollClass;
      object.identifier = element.identifier;
      object.employmentCode = element.employmentCode;
      object.employeeFirstName = element.employeeFirstName;
      object.employeeLastName = element.employeeLastName;
      object.employeeSecondName = element.employeeSecondName;
      object.employeeSecondLastName = element.employeeSecondLastName;
      object.documentNumber = element.documentNumber;
      object.documentType = element.documentNumber;
      object.idDocumentType = element.idDocumentType;
      object.abbreviation = element.documentNumber;
      object.payrollClass = element.payrollClass;
      object.idHolidayCycle = element.idHolidayCycle;
      object.holidayCycle = element.holidayCycle;
      object.endDate = element.endDate;
      if(this.endDate == null){
        this.endDate = new Date(element.endDate);
        this.endDate.setMinutes(this.endDate.getMinutes() + this.endDate.getTimezoneOffset()); 
      }else{
        var newDate = new Date(element.endDate);
        newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset()); 
        if(this.endDate > newDate){
          this.endDate = newDate;
        }
      }
      newList.push(object);
    })
    this.employeeList = newList.concat(this.employeeList);
    this.displayModal = false;
  }

  onHideModal(opt: boolean){
    this.displayModal = opt;
  }

  loadBalance(event){
    debugger;
    this.showBalance = this.employeeList[event];
  }

  onDeleted(record: HolidaysProgramation){
    debugger;
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar a este trabajador de la lista?',
      accept: () => {
        this.employeeList = this.employeeList.filter(x => x.employmentCode != record.employmentCode);
        this.endDate = null;
        this.employeeList.forEach(element =>{
          if(this.endDate == null){
            this.endDate = new Date(element.endDate);
            this.endDate.setMinutes(this.endDate.getMinutes() + this.endDate.getTimezoneOffset()); 
          }else{
            var newDate = new Date(element.endDate);
            newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset()); 
            if(this.endDate > newDate){
              this.endDate = newDate;
            }
          }
        });
      },
      reject: () => {
        
      }
    }); 
  }

  loadHolidaysConfiguration(){
    this.holidaysConfigurationFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._holidaysConfigurationService.GetHolidaysConfiguration(this.holidaysConfigurationFilter).subscribe((data:HolidaysConfiguration[]) => {
      this.advancedHome = data[0].enableAnticipated;
      if(!this.advancedHome){
        this.holidaysTypeList = this.holidaysTypeList.filter(x => x.label != "Anticipadas");
        this.holidayType = this.holidaysTypeList[0].value;
      }
    })
    
  }
 

}
