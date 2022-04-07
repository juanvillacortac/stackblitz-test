import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { LandingPageComponent } from '../layout/landing-page/landing-page.component';
import { LayoutComponent } from '../layout/layout/layout.component';
import { TasksDashboardComponent } from './tasks-dashboard/tasks-dashboard.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TasksSupervisorContainerComponent } from './tasks-supervisor/tasks-supervisor-container/tasks-supervisor-container.component';
import { TasksSupervisorDashboardComponent } from './tasks-supervisor/tasks-supervisor-dashboard/tasks-supervisor-dashboard.component';

const routes: Routes = [
    {
      path: '',
      component: LayoutComponent,
      canActivate: [AuthGuard],
      children:
      [
        { path: '', component: LandingPageComponent },
        { path: 'dashboard', component: TasksDashboardComponent },
        { path: 'list', component: TasksListComponent },
        { path: 'supervisor', component: TasksSupervisorContainerComponent },
        { path: 'supervisor-dashboard', component: TasksSupervisorDashboardComponent }
      ]
    },
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class TasksRoutingModule { }
