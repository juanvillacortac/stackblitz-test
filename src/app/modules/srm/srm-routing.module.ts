import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { LayoutComponent } from '../layout/layout/layout.component';
import { DashboardGeneralSrmComponent } from './dashboard/dashboard-general-srm/dashboard-general-srm.component';
import { ReportOrderComponent } from './dashboard/report-order/report-order.component';
import { SuppliercatalogComponent } from './manage-supplier-catalog/supplier-catalog/suppliercatalog/suppliercatalog.component';
import { PurchaseListComponent } from './purchase-order-viewer/purchase-list/purchase-list.component';
import { PurchaseOrderDetailComponent } from './purchase-order-viewer/purchase-order-detail/purchase-order-detail.component';
import { WizardPurchaseOrderComponent } from './purchase-order/wizard-purchase-order/wizard-purchase-order.component';
import { DashboardSupplierComponent } from './vieweroc-supplier/dashboard/dashboard-supplier/dashboard-supplier.component';
import { ReceptionListComponent } from './reception-viewer/reception-list/reception-list.component';
import { ReceptionMainComponent } from './reception/reception-main/reception-main/reception-main.component';
import { ViewerocDocumentsTabpanelComponent } from './vieweroc-supplier/vieweroc-documents-tabpanel/vieweroc-documents-tabpanel.component';
import { WeightInstrumentListComponent } from './weight-instrument/weight-instrument-list/weight-instrument-list.component';
import{ProductReturnViewerComponent} from './product-return/product-return-viewer/product-return-viewer.component'
import { ReceptionChildComponent } from './reception-viewer/reception-child/reception-child.component';
import { ConsignmentIvoiceListComponent } from './consingment-Invoice/consignment-ivoice-list/consignment-ivoice-list.component';
import { ConsigmentInvoicePanelComponent } from './consingment-Invoice/consigment-invoice-panel/consigment-invoice-panel.component';

 const routes: Routes = [
   { path: '',
     component: LayoutComponent,
     canActivate: [AuthGuard],
     children: [
       { path: 'suppliercatalog', component: SuppliercatalogComponent },
       { path: 'purchase-list', component: PurchaseListComponent },
       { path: 'purchase-order/:id', component: WizardPurchaseOrderComponent },
       { path: 'viewer-document', component: ViewerocDocumentsTabpanelComponent },
       { path: 'suppliermodal', component: ViewerocDocumentsTabpanelComponent },
       { path: 'dashboard-general-srm', component: DashboardGeneralSrmComponent },
       { path: 'dashboard-supplier', component: DashboardSupplierComponent },
       { path: 'reception-viewer', component: ReceptionListComponent },
       { path: 'weight-instrument-list', component: WeightInstrumentListComponent },
       { path: 'reception/:id', component: ReceptionMainComponent },
       { path: 'purchase-order-detail/:id', component: PurchaseOrderDetailComponent },
       { path: 'product-return-viewer', component: ProductReturnViewerComponent}, 
       { path: 'simple-reception/:id', component: ReceptionChildComponent },
       { path: 'purchase-order-detail/:id', component: PurchaseOrderDetailComponent },       
       { path: 'report-order', component: ReportOrderComponent },
       { path: 'consingment-invoice-list', component: ConsignmentIvoiceListComponent },
       { path: 'consingment-invoice/:id', component: ConsigmentInvoicePanelComponent }
      
      
       
     ]
   }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SrmRoutingModule {}
