import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PayrollCalendarFilter } from '../../shared/filters/payroll-calendar-filter';
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { PayrollCalendarDetail } from '../../shared/models/masters/payroll-calendar-detail';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';

@Component({
  selector: 'app-payroll-calendar-modal',
  templateUrl: './payroll-calendar-modal.component.html',
  styleUrls: ['./payroll-calendar-modal.component.scss'],
  providers: [DatePipe]
})
export class PayrollCalendarModalComponent implements OnInit {

  @Input() record: PayrollCalendarDetail;
  @Input() filter: PayrollCalendarFilter;
  @Input() showDialog: boolean; 
  @Input() tope: string; 

  @Output() backUnChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveData: EventEmitter<PayrollCalendarDetail> = new EventEmitter<PayrollCalendarDetail>();
  permissionsIDs = { ...Permissions };

  _Authservice : AuthService = new AuthService(this._httpClient);
  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  payrollTypeObject: PayrollType = new PayrollType();
  startDate: Date;
  endDate: Date;
  paymentDate: Date;
  paymentMaxDate: Date; // Max date select for pay payroll
  submitted: boolean = false;
  dayB: Date;
  payDay: string = "0";
  periodicity: number;
  
              
    constructor(  private messageService: MessageService,
                  private confirmationService: ConfirmationService,
                  public datepipe: DatePipe,
                  private payrollTypeService: PayrollTypeService,
                  private _httpClient: HttpClient,
                  public userPermissions: UserPermissions,
                ) { }

  ngOnInit(): void {
    this.initialValues();

  }

  initialValues(){
    this.payrollTypeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this.dayB = new Date(this.tope);
    this.dayB.setDate(this.dayB.getDate() + 1);
    this.dayB.setMinutes(this.dayB.getMinutes() + this.dayB.getTimezoneOffset());  //evita que la fecha disminuya un dia
    this.payrollTypeService.GetPayrollTypes(this.payrollTypeFilter).subscribe((data: PayrollType[]) => {
      this.payrollTypeObject = data.find(x => x.id == this.filter.idPayrollType);
      this.periodicity = this.payrollTypeObject.periodicity;
      if(this.record.id != -1){
        this.startDate = new Date(this.record.startDate);
        this.endDate = new Date(this.record.finishDate); 
        this.paymentDate = new Date(this.record.paymentDate);
        //this.payDay = this.record.paymentDay.toString();
      }else{
        this.startDate = new Date(this.record.startDate);
        this.startDate.setDate(this.startDate.getDate() + 1);
        this.setEndDay(this.startDate);
        //this.setPayDate("0");
      }
      
      this.paymentMaxDate = new Date(this.endDate);
      this.paymentMaxDate.setDate(this.endDate.getDate() + this.periodicity);
      this.paymentMaxDate.setMinutes(this.paymentMaxDate.getMinutes() + this.paymentMaxDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
      this.startDate.setMinutes(this.startDate.getMinutes() + this.startDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
      this.endDate.setMinutes(this.endDate.getMinutes() + this.endDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
      this.paymentDate.setMinutes(this.paymentDate.getMinutes() + this.paymentDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
      this.setPaymentDate();
      // this.payrollTypeDropdown = this.payrollTypeList.map<SelectItem>((item) => ({
        //     value: item.id,
        //     label: item.name
        //   }));
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los Tipo de Nómina" });
      });
  }

  setPayDate(value: string) {
    let valend = new Date(this.endDate);
    let valor = parseInt(value);
    if(valor <= this.payrollTypeObject.periodicity) {
      let weekInMilliseconds = 1000 * 60 * 60 * 24 * valor;
      let sum = valend.getTime() + weekInMilliseconds; //getTime devuelve milisegundos de esa fecha
      this.paymentDate = new Date(sum);
    }else{
      this.payDay = "0";
      this.paymentDate = this.endDate;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La fecha de pago no puede ser mayor al periodo de pago de la nomina " });
    }
  }

  setEndDay(value: Date){
    let valini = new Date(value);
    let weekInMilliseconds = 1000 * 60 * 60 * 24 * this.periodicity;
    let sum = valini.getTime() + weekInMilliseconds; //getTime devuelve milisegundos de esa fecha
    this.endDate = new Date(sum);
    this.paymentDate = new Date(sum);
    this.setPaymentDate();
  }

  setPaymentDate(){
    let fecha1 = moment(this.startDate);
    let fecha2 = moment(this.paymentDate);
    var time1 = moment(this.startDate).format('YYYY-MM-DD');
    var time2 = moment(this.paymentDate).format('YYYY-MM-DD');
    // // var tiempo = event.getTime() - this.startDate.getTime(); 
    // // this.payDay = Math.floor(tiempo / (1000 * 60 * 60 * 24) + 1) ;

    if (time2 < time1 ){
      this.setEndDay(this.startDate)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La fecha de pago no puede ser menor a la fecha de Inicio" });
    }else{
      var result = fecha2.diff(fecha1, 'days') + 1;
      this.payDay = result.toString();
    }
    
  }

  submit(){
    debugger
    if(this.startDate != null && this.payDay != null){
     
          this.startDate.setMinutes(this.startDate.getMinutes() + this.startDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
          this.endDate.setMinutes(this.endDate.getMinutes() + this.endDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
          this.paymentDate.setMinutes(this.paymentDate.getMinutes() + this.paymentDate.getTimezoneOffset());  //evita que la fecha disminuya un dia        
          this.record.paymentDay = parseInt(this.payDay);
          this.record.startDate = this.datepipe.transform(this.startDate,'yyyy-MM-dd');
          this.record.finishDate = this.datepipe.transform(this.endDate,'yyyy-MM-dd');
          this.record.paymentDate = this.datepipe.transform(this.paymentDate,'yyyy-MM-dd');
          this.record.idCurrency = this.payrollTypeObject.currency;
          if(this.record.id == -1){
            this.saveData.emit(this.record);
          }else{
            this.confirmationService.confirm({
              header: 'Confirmación',
              icon: 'pi pi-exclamation-triangle',
              message: 'Se modificará las fechas futuras \n ¿Deseas realizar esta acción? ',
              accept: () => {         
                this.saveData.emit(this.record);
              },
              reject: () => {
                
              }
            });
            
          }
    }else{
      this.submitted = true;
    } 
  }

  outForm(){
    this.backUnChange.emit(false);
  }

}
