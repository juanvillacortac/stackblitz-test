import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { PayrollClassFilter } from '../../shared/filters/laborRelationship/payroll-class-filter';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { PayrollClass } from '../../shared/models/laborRelationship/payroll-class';
import { PayrollClassService } from '../../shared/services/payroll-class.service';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';
import {} from 'primeng/calendar';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { HolidaysProgramationEmployeeFilter } from '../../shared/filters/holidays/holidays-programation-employe-filter';
import { HolidaysProgramationEmployee } from '../../shared/models/holidays/holidays-programation-employe';
import { HolidaysProgramationService } from '../../shared/services/holidays/holidays-programming.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-holiday-massive-programming-filter',
  templateUrl: './holiday-massive-programming-filter.component.html',
  styleUrls: ['./holiday-massive-programming-filter.component.scss'],
  providers: [DatePipe]
})
export class HolidayMassiveProgrammingFilterComponent implements OnInit {

  @Input() showPanel: boolean;
  @Input() idCompany: number;     
  @Input() cycleHoliday: string;
  @Input() startDate: Date;
  @Input() idHolidayType: number;
  @Input() idHolidayProgramation: number;
  @Input() programationHolidayId: number;
  @Input() holidayEmployeeList: HolidaysProgramationEmployee[];     

  @Output() backUnChange: EventEmitter<boolean> = new EventEmitter<boolean>();  
  @Output() returnList: EventEmitter<HolidaysProgramationEmployee[]> = new EventEmitter<HolidaysProgramationEmployee[]>();

  // payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  payrollClassFilter: PayrollClassFilter = new PayrollClassFilter();
  payrollTypeDropdown: SelectItem[] = [];
  payrollClassDropdown: SelectItem[] = [];
  submitted: boolean = false;
  messageSearch: string = "";


  statuslist: SelectItem[] = [
    { label: 'Todos', value: -1 },
    { label: 'Disfrutada', value: 85 },
    { label: 'Programada', value: 84 },
    { label: 'Registrada', value: 83 },
  ];

  constructor(  private _holidayProgramation: HolidaysProgramationService, 
                private _payrollClassService: PayrollClassService,
                private messageService: MessageService,
                public datepipe: DatePipe,) { }
  
  selectType: number = -1;
  selectClass: number = -1;
  employmentDate: Date;
  seniorityDate: Date;
  employeeFilter: HolidaysProgramationEmployeeFilter = new HolidaysProgramationEmployeeFilter();
  employeeList: HolidaysProgramationEmployee[] =[];


  ngOnInit(): void {
    this.loadPayrollClass();
    if(this.idHolidayProgramation == 3){
      this.searchEmployee();
    }
  }

  loadPayrollClass(){
    this._payrollClassService.GetPayrollClasses(this.payrollClassFilter).subscribe((data: PayrollClass[]) =>{
      this.payrollClassDropdown = data.map((item) =>({
        label: item.payrollClassName,
        value: item.id
      }));
    })
  }

  clearFilters(){
    this.employmentDate = null;
    this.seniorityDate = null;
    this.selectClass = -1;

  }

  searchEmployee(){
    this.employeeList = [];
    this.employeeFilter.idCompany = this.idCompany;
    this.employeeFilter.idPayrollClass = this.selectClass;
    this.employeeFilter.idHolidayType = this.idHolidayType;
    this.employeeFilter.startDate = this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
    this.employeeFilter.idHolidayProgramation = this.programationHolidayId;
    this.employeeFilter.seniorityDate = this.seniorityDate == null ? "1900-01-01" : this.datepipe.transform(this.seniorityDate, 'yyyy-MM-dd');
    this.employeeFilter.employmentDate = this.employmentDate == null ? "1900-01-01" : this.datepipe.transform(this.employmentDate, 'yyyy-MM-dd');
    this._holidayProgramation.GetHolidaysProgramationEmployee(this.employeeFilter).subscribe((data: HolidaysProgramationEmployee[]) => {
      debugger;
      if(data.length == 0){
        this.messageSearch = "No existen resultados que coincidan con la búsqueda."
      }else{
        this.messageSearch ="";
        data.forEach(element => {
          var valido = this.holidayEmployeeList.find(x => x.idLaborRelationship == element.idLaborRelationship);
          if(element.holidayCycle == this.cycleHoliday){
            element.selected = true;
          }
          if(!valido){
            this.employeeList.push(element);
          }
        });
        if(this.employeeList.length == 0){
          this.messageSearch = "No existen resultados que coincidan con la búsqueda."
        }
      }
    })
  }

  submit(){
    debugger;
    var listChecked = this.employeeList.filter(x => x.selected);
    if(listChecked.length == 0){
      this.messageService.add({severity: 'error', summary: 'Error', detail: "Debe agregar por lo menos un trabajador válido"});
    }else{
      this.returnList.emit(listChecked);
    }
  }


  outForm(){
    this.backUnChange.emit(false);
  }


}
