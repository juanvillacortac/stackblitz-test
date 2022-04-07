import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { LayoutComponent } from '../layout/layout/layout.component';
import { DashboardSomComponent } from './dashboard-som/dashboard-som.component';
import { SalesreportListComponent } from './reports/salesreport/salesreport-list/salesreport-list.component';

const routes: Routes = [
  { path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [   
      { path: 'dashboard-som', component: DashboardSomComponent },
      { path: 'salesreport', component: SalesreportListComponent  }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SomRoutingModule { }
