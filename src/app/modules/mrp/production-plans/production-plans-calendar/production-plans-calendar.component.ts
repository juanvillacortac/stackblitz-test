import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { startOfDay, addDays } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { ProductionPlansService } from '../shared/production-plans.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductionPlan } from 'src/app/models/mrp/production-plan';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ProductionPlansResumeComponent } from '../production-plans-resume/production-plans-resume.component';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { Router } from '@angular/router';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { DateHelperService } from 'src/app/modules/common/services/date-helper/date-helper.service';

@Component({
  selector: 'app-production-plans-calendar',
  templateUrl: './production-plans-calendar.component.html',
  styleUrls: ['./production-plans-calendar.component.scss']
})
export class ProductionPlansCalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('op') overlayPanel: OverlayPanel;
  @ViewChild('planResume') planResume: ProductionPlansResumeComponent;

  view: CalendarView = CalendarView.Month;
  calendarView = CalendarView;
  permissionsIDs = {...Permissions};

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  productionPlans: ProductionPlan[] = [];

  activeDayIsOpen = false;
  isLoading = false;

  constructor(
    public userPermissions: UserPermissions,
    private router: Router,
    private service: ProductionPlansService,
    private dialogService: DialogsService,
    private readonly dateHelper: DateHelperService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.setItems([
      { label: 'MRP' },
      { label: 'Producción' },
      { label: 'Plan de producción', routerLink: ['/mrp/production-plans-schedule'] }
    ]);
  }

  ngOnInit() {
    this.loadProductionPlans();
    this.refresh.subscribe(() => this.loadProductionPlans());
  }

  addNewPlan() {
    this.router.navigate(['/mrp/production-plans-new']);
  }

  getPlanById(idPlan: number) {
    return this.productionPlans.find(plan => plan.id === idPlan);
  }

  getPlanStatusColor(idPlan: number) {
    const plan = this.getPlanById(idPlan);
    return this.service.getPlanStatusColor(plan);
  }

  planClicked(event, idPlan: number) {
    const plan = this.getPlanById(idPlan);
    if (this.userPermissions.allowed(this.permissionsIDs.CHECK_PRODUCTION_PLANS_PERMISSION_ID)) {
      this.overlayPanel.toggle(event, event.target);
      this.planResume.productionPlan = plan;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.refresh.next();
    this.activeDayIsOpen = false;
  }

  private loadProductionPlans() {
    this.isLoading = true;
    this.service.loadProductionPlansAt(this.viewDate.getMonth() + 1, this.viewDate.getFullYear())
      .then((productionPlans) => this.productionPlansLoaded(productionPlans))
      .then(_ => this.isLoading = false)
      .catch(error => this.handleError(error));
  }

  private productionPlansLoaded(productionPlans: ProductionPlan[]) {
    this.productionPlans = productionPlans;
    this.events = productionPlans.map((plan) => this.productionPlanToEvent(plan));
  }

  private productionPlanToEvent(plan: ProductionPlan) {
    const datee = this.dateHelper.gmtToUTC(new Date(plan.deliveryDate));
    return {
      id: plan.id,
      start: startOfDay(datee),
      end: addDays(datee, 0),
      title: plan.name,
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      allDay: true,
      draggable: false
    };
  }

  private handleError(error: HttpErrorResponse) {
    this.isLoading = false;
    this.dialogService.errorMessage('mrp.production_plan.production_plans', error?.error?.message ?? 'error_service');
  }
}
