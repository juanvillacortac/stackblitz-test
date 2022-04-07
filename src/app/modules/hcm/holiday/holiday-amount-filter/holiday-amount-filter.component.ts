import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';

//Service
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';
import { PayrollClassService } from '../../shared/services/payroll-class.service';

//Model
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { PayrollClassFilter } from '../../shared/filters/laborRelationship/payroll-class-filter';
import { PayrollClass } from '../../shared/models/laborRelationship/payroll-class';
import { HolidaysBalanceFilter } from '../../shared/filters/holidays/holidays-balance-filter';

@Component({
  selector: 'app-holiday-amount-filter',
  templateUrl: './holiday-amount-filter.component.html',
  styleUrls: ['./holiday-amount-filter.component.scss'],
  providers: [DatePipe]
})
export class HolidayAmountFilterComponent implements OnInit {
  @Input() expanded = false;
  @Input() loading = false;
  @Input() filters: HolidaysBalanceFilter = new HolidaysBalanceFilter();
  @Output() onSearch = new EventEmitter<HolidaysBalanceFilter>();
  selectPayrollType: number;
  payrollTypelist : SelectItem[] = [];
  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  incomeDate: Date;

  payrollClasses: SelectItem[] = [];
  _Authservice : AuthService = new AuthService(this._httpClient);

  constructor(private payrolltypeService: PayrollTypeService,
              private _httpClient: HttpClient,
              private messageService: MessageService,
              private _payrollClassService: PayrollClassService, 
              public datepipe: DatePipe,) { }

  ngOnInit(): void {
    this.loadPayrollClasses();
  }

  loadPayrollClasses() {
    var filter = new PayrollClassFilter();
    this._payrollClassService.GetPayrollClasses(filter).subscribe( (data: PayrollClass[]) => {
      if (data != null) {
        this.payrollClasses = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.payrollClassName
            }
        ));
      }
      this.payrollClasses.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de clases de nomina', detail: 'Error al cargar las clases de nomina'});
    });
  }

  send(){
    this.filters.dateEntry = this.datepipe.transform(this.incomeDate,'yyyy-MM-dd');
    this.onSearch.emit(this.filters);
  }
  
  clearFilters(){
    this.filters.idClassPayroll = -1;
    this.filters.numberWorker = '';
    this.filters.name = '';
    this.incomeDate = null;
  }
}
