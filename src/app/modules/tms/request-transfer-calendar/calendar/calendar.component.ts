import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { addDays, startOfDay } from 'date-fns';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subject } from 'rxjs';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { MerchandiseRequest } from 'src/app/models/tms/merchandiserequest';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DateHelperService } from 'src/app/modules/common/services/date-helper/date-helper.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import * as MerchandiseRequestStatus from 'src/app/modules/tms/shared/utils/merchandise-request-status-cont';
import { StatusRequest } from '../../merchandise-request/shared/enum/status-request';
import { MerchandiseRequestFilter } from '../../merchandise-request/shared/filters/merchandise-request-filter';
import { MerchandiseRequestService } from '../../merchandise-request/shared/service/merchandise-request.service';
import { MerchandiseRequestCalendarResumeComponent } from '../shared/merchandise-request-calendar-resume/merchandise-request-calendar-resume.component';

const colors: any = {
  planned: {
    primary: '#8a427a',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DialogService]
})
export class CalendarComponent implements OnInit {

  constructor(private breadcrumbService: BreadcrumbService,
    public merchandiseRequestService: MerchandiseRequestService,
    private readonly loadingService: LoadingService,
    private dialogService: DialogsService,
    private readonly dateHelper: DateHelperService,
    private _authService: AuthService,
    private router: Router) { }

  @ViewChild('op') overlayPanel: OverlayPanel;
  @ViewChild('merchandiseRequestResume') merchandiseRequestResume: MerchandiseRequestCalendarResumeComponent;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  merchandiseRequestFilters: MerchandiseRequestFilter = new MerchandiseRequestFilter();

  activeDayIsOpen = false;
  showResume = false;
  showInventoryCount = false;

  menuItems: MenuItem[];

  viewDate: Date = new Date();
  selectedDate = new Date();

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
  ];

  merchandiseRequestList: MerchandiseRequest[] = [];  
  
  ngOnInit(): void {
    this.setBreadcrumb();
    this.merchandiseRequestFilters.demandBranchId = this._authService.currentOffice;
    this.getMerchandiseRequest();
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  countClicked(event, item) {
    this.overlayPanel.toggle(event, event.target);
    this.merchandiseRequestResume.merchandiseRequest = this.getMerchandiseRequests(item.id);
  }

  private getMerchandiseRequests(id: number) {
    return this.merchandiseRequestList.find(x => x.id === id);
  }

  addCount(day) {
    this.selectedDate = day.date;
    this.showInventoryCount = true;
  }

  dayOver(day) {
    if (day.isToday) {
      day.isMouseOver = true;
    }
  }

  dayOut(day) {
      day.isMouseOver = false;
 }

 childCallBack(item): void {
  this.getMerchandiseRequest();
  this.showInventoryCount = false;
  }

  hideDialog() {
    this.showInventoryCount = false;
  }

  private setBreadcrumb() {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'TMS' },
      { label: 'Calendario de solicitudes de mercancía', routerLink: ['/tms/calendar']}
    ]);
  }


  private getMerchandiseRequest() {
    this.loadingService.startLoading('wait_loading');
    this.merchandiseRequestService.getMerchandiseRequestList(this.merchandiseRequestFilters).toPromise()
    .then(data => this.getMerchandiseRequestSucceded(data))
    .catch(error => this.loadingHandleError(error));
  }


  private getMerchandiseRequestSucceded(data: MerchandiseRequest[]) {
    this.loadingService.stopLoading();
    this.merchandiseRequestList = data;
    this.events = this.merchandiseRequestList.map((plan) => this.merchandiseRequestToEvent(plan));
    this.refresh.next();
    this.merchandiseRequestList.forEach(Element => {
      Element.imageUpdateByUser = Element.imageUpdateByUser == "" ? `https://ui-avatars.com/api/?name=${Element.updateByUser}&background=17a2b8&color=fff&rounded=true&bold=true&size=50` :  "https://gruposigo1.s3.amazonaws.com/" + Element.imageUpdateByUser;
    });    
  }

  private merchandiseRequestToEvent(merchandiseRequest: MerchandiseRequest) {
    const datee = this.dateHelper.gmtToUTC(new Date(merchandiseRequest.createDate));
    return {
      id: merchandiseRequest.id,
      description: merchandiseRequest.demandBranch.branchOfficeName,
      start: startOfDay(datee),
      end: addDays(datee, 0),
      title: merchandiseRequest.requestNumber,
      color: colors.blue,
      allDay: false,
      draggable: false,
      status: this.getStatus(merchandiseRequest.status.id),
      responsibleUser: merchandiseRequest.updateByUser,
      quantity: merchandiseRequest.quantityItems
    };
  }


  private getStatus(status: number) {
    switch (status) {
      case StatusRequest.ERASER: return 'eraser';
      case StatusRequest.EXECUTION: return 'execution';
      case StatusRequest.FINALIZED: return 'finalized';
      case StatusRequest.CANCELED: return 'cancelled';
      case StatusRequest.PROCESSED: return 'processed';
      case StatusRequest.DISPATCHED: return 'dispatched';
      // case MerchandiseRequest.FINALIZED_ADJUSTEMENT_STATUS_ID: return 'finalized';
      // case MerchandiseRequest.CANCELED_STATUS_ID: return 'cancelled';
      // case MerchandiseRequest.DELAYED_STATUS_ID: return 'delayed';
    }
  }


  private loadingHandleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.handleError(error);
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }


  createMerchandiseRequest(){
    this.router.navigate(['/tms/merchandise-request', 0,2]);
  }
}
