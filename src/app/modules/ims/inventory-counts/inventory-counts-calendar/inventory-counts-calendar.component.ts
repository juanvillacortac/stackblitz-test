import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { addDays, startOfDay } from 'date-fns';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subject } from 'rxjs';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { InventoryCountFilter } from '../shared/filter/inventory-count-filter';
import { InventorycountService } from '../shared/service/inventorycount.service';
import * as CountStatus from '../shared/service/count-status-const';
import { InventoryCountsCalendarResumeComponent } from './shared/inventory-counts-calendar-resume/inventory-counts-calendar-resume.component';
import { MenuItem } from 'primeng/api';
import { DateHelperService } from 'src/app/modules/common/services/date-helper/date-helper.service';
import { OperatorInventoryCount } from 'src/app/models/ims/operator-count';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

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
  selector: 'app-inventory-counts-calendar',
  templateUrl: './inventory-counts-calendar.component.html',
  styleUrls: ['./inventory-counts-calendar.component.scss'],
  providers: [DialogService]
})
export class InventoryCountsCalendarComponent implements OnInit {

  constructor(
    private dialogService: DialogsService,
    private readonly loadingService: LoadingService,
    private breadcrumbService: BreadcrumbService,
    private readonly inventoryCountService: InventorycountService,
    private readonly dateHelper: DateHelperService,
    private _authService: AuthService
  ) { }

  @ViewChild('op') overlayPanel: OverlayPanel;
  @ViewChild('countResume') countResume: InventoryCountsCalendarResumeComponent;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  activeDayIsOpen = false;
  showResume = false;
  showInventoryCount = false;

  menuItems: MenuItem[];

  viewDate: Date = new Date();
  selectedDate = new Date();

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
  ];

  inventoryCounts: InventoryCount[] = [];
  inventoryCountFilters: InventoryCountFilter = new InventoryCountFilter ();

  ngOnInit(): void {
    this.setBreadcrumb();
    this.inventoryCountFilters.idBranchOffice = this._authService.currentOffice;
    this.getInventoryCounts();
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  countClicked(event, item) {
    this.overlayPanel.toggle(event, event.target);
    this.countResume.inventoryCount = this.getInventorycount(item.id);
  }

  addCount(day) {
    this.selectedDate = day.date;
    this.showInventoryCount = true;
  }

  dayOver(day) {
    if (day.isFuture || day.isToday) {
      day.isMouseOver = true;
    }
  }

  dayOut(day) {
      day.isMouseOver = false;
 }

 childCallBack(item): void {
  this.getInventoryCounts();
  this.showInventoryCount = false;
  }

  hideDialog() {
    this.showInventoryCount = false;
  }

  private setBreadcrumb() {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'IMS' },
      { label: 'Calendario de conteos', routerLink: ['/ims/inventory-count-calendar']}
    ]);
  }

  private inventoyCountToEvent(inventoryCount: InventoryCount) {
    const datee = this.dateHelper.gmtToUTC(new Date(inventoryCount.inicialDate));

    return {
      id: inventoryCount.id,
      description: inventoryCount.description,
      start: startOfDay(datee),
      end: addDays(datee, 0),
      title: inventoryCount.numberDocument,
      color: colors.blue,
      allDay: false,
      draggable: false,
      status: this.getStatus(inventoryCount.idstatus),
      responsibleUser: inventoryCount.responsibleUser,
      quantity: inventoryCount.count
    };
  }

  private getStatus(status: number) {
    switch (status) {
      case CountStatus.WAITING_FOR_ADJUSTMENT_STATUS_ID: return 'pending';
      case CountStatus.IN_DRAFT_STATUS_ID: return 'planned';
      case CountStatus.IN_ACTION_STATUS_ID: return 'processing';
      case CountStatus.FINALIZED_STATUS_ID: return 'finalized';
      case CountStatus.FINALIZED_ADJUSTEMENT_STATUS_ID: return 'finalized';
      case CountStatus.CANCELED_STATUS_ID: return 'cancelled';
      case CountStatus.DELAYED_STATUS_ID: return 'delayed';
    }
  }

  private getInventoryCounts() {
    debugger
    this.loadingService.startLoading('wait_loading');
    this.inventoryCountService.getInventoryCountList(this.inventoryCountFilters).toPromise()
    .then(data => this.getInventoryCountsSucceded(data))
    .catch(error => this.loadingHandleError(error));
    debugger
  }

  private getInventorycount(id: number) {
    return this.inventoryCounts.find(x => x.id === id);
  }

  private getInventoryCountsSucceded(data: InventoryCount[]) {
    this.loadingService.stopLoading();
    this.inventoryCounts = data;
    this.events = this.inventoryCounts.map((plan) => this.inventoyCountToEvent(plan));
    this.refresh.next();

    this.inventoryCounts.forEach(Element => {
      Element.imageResponsibleUser = Element.imageResponsibleUser == "" ? `https://ui-avatars.com/api/?name=${Element.responsibleUser}&background=17a2b8&color=fff&rounded=true&bold=true&size=50` :  "https://gruposigo1.s3.amazonaws.com/" + Element.imageResponsibleUser;
      Element.operators.forEach(Elements =>{
        Elements.imageOperator = Elements.imageOperator == "" ? `https://ui-avatars.com/api/?name=${Elements.operator}&background=17a2b8&color=fff&rounded=true&bold=true&size=50` :  "https://gruposigo1.s3.amazonaws.com/" +  Elements.imageOperator;
      });
    });
    debugger
  }

  private loadingHandleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.handleError(error);
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }

}
