import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { NotFoundComponent } from './notFound/notFound.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/layout/layout.module').then(m => m.LayoutModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'security',
    loadChildren: () => import('./modules/security/security.module').then(m => m.SecurityModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mrp',
    loadChildren: () => import('./modules/mrp/mrp.module').then(m => m.MrpModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'financial',
    loadChildren: () => import('./modules/financial/financial.module').then(m => m.FinancialModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'som',
    loadChildren: () => import('./modules/som/som.module').then(m => m.SomModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'masters',
    loadChildren: () => import('./modules/masters/masters.module').then(m => m.MastersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ims',
    loadChildren: () => import('./modules/ims/inventory.module').then(m => m.InventoryModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tms',
    loadChildren: () => import('./modules/tms/tms.module').then(m => m.TmsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'hcm',
    loadChildren: () => import('./modules/hcm/hcm.module').then(m => m.HcmModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tasks',
    loadChildren: () => import('./modules/tasks/tasks.module').then(m => m.TasksModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mpc',
    loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'masters-mpc',
    loadChildren: () => import('./modules/masters-mpc/masters-mpc.module').then(m => m.MastersMPCModule),
    canActivate: [AuthGuard]
  },
 {
    path: 'srm',
    loadChildren: () => import('./modules/srm/srm.module').then(m => m.SrmModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tms',
    loadChildren: () => import('./modules/tms/tms.module').then(m => m.TmsModule),
    canActivate: [AuthGuard]
  },
 {
  path: '**',
  component: NotFoundComponent,
  redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
declarations: []
})

export class AppRoutingModule { }
