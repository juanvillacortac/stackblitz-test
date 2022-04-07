import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksSupervisorContainerComponent } from './tasks-supervisor/tasks-supervisor-container/tasks-supervisor-container.component';
import { TasksSupervisorListComponent } from './tasks-supervisor/tasks-supervisor-list/tasks-supervisor-list.component';
import { TasksSupervisorCalendarComponent } from './tasks-supervisor/tasks-supervisor-calendar/tasks-supervisor-calendar.component';
import { TasksSupervisorAddComponent } from './tasks-supervisor/tasks-supervisor-add/tasks-supervisor-add.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TasksDashboardComponent } from './tasks-dashboard/tasks-dashboard.component';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CommonAppModule } from '../common/common.module';
import { MessageModule } from 'primeng/message';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TasksSupervisorDashboardComponent } from './tasks-supervisor/tasks-supervisor-dashboard/tasks-supervisor-dashboard.component';
import { RequiredFieldComponent } from './shared/required-field/component/required-field/required-field.component';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProgressBarModule } from 'primeng/progressbar';



@NgModule({
  declarations: [
    TasksDashboardComponent,
    TasksListComponent,
    TasksSupervisorContainerComponent,
    TasksSupervisorListComponent,
    TasksSupervisorCalendarComponent,
    TasksSupervisorAddComponent,
    TasksSupervisorDashboardComponent,
    RequiredFieldComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CommonAppModule,
    TasksRoutingModule,
    TranslateModule,
    TableModule,
    ButtonModule,
    MessageModule,
    SidebarModule,
    CalendarModule,
    DropdownModule,
    DialogModule,
    InputTextModule,
    AutoCompleteModule,
    ProgressBarModule
  ]
})
export class TasksModule { }
