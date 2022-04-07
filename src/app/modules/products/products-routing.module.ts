import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductcatalogComponent } from './product-catalog/productcatalog/productcatalog.component';
import { MenuComponent } from './common-mpc/menu/menu.component';
import { ProductsBranchListComponent } from './viewer-products-branch/products-branch-list/products-branch-list.component';
import { LayoutComponent } from '../layout/layout/layout.component';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { DashboardMpcComponent } from './dashboard/dashboard-mpc/dashboard-mpc.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'productcatalog-list', component: ProductcatalogComponent },
      { path: 'productgeneralsection/:id/:idFather/:ind', component: MenuComponent },
      { path: 'productbranch-list', component: ProductsBranchListComponent },
      { path: 'dashboard-mpc', component: DashboardMpcComponent }
      
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
