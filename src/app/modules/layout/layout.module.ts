import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonAppModule } from '../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// *******Components *******//
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LayoutComponent } from './layout/layout.component';
import { SecurityModule } from '../security/security.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { PanelRightComponent } from './panel-right/panel-right.component';
import { PanelConfigComponent } from './panel-config/panel-config.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { PanelMenuComponent } from './panel-menu/panel-menu.component';
import { PanelTopbarComponent } from './panel-topbar/panel-topbar.component';
import { PanelFooterComponent } from './panel-footer/panel-footer.component';
import { PanelMenuItemComponent } from './panel-menu-item/panel-menu-item.component';
import { PanelRightTasksComponent } from './panel-right/panel-right-tasks/panel-right-tasks.component';
import { CurrentOfficeSelectorComponent } from './panel-topbar/current-office-selector/current-office-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardGeneralComponent } from './dashboard/dashboard-general/dashboard-general.component';
import { PrimengModule } from "../primeng/primeng.module";
import { ProfileItemComponent } from './panel-topbar/profile-item/profile-item.component';
import { LoadingComponent } from '../common/components/loading/loading.component';

@NgModule({
  declarations: [
    LandingPageComponent,
    LayoutComponent,
    PanelRightComponent,
    PanelConfigComponent,
    BreadcrumbComponent,
    PanelMenuComponent,
    PanelTopbarComponent,
    PanelFooterComponent,
    PanelMenuItemComponent,
    PanelRightTasksComponent,
    CurrentOfficeSelectorComponent,
    DashboardGeneralComponent,
    LoadingComponent,
    ProfileItemComponent ],
  imports: [
    PrimengModule,
    CommonModule,
    CommonAppModule,
    ReactiveFormsModule,
    LayoutRoutingModule,
    SecurityModule,
    FormsModule,
    TranslateModule
  ],
})
export class LayoutModule { }
