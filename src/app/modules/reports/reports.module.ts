import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportViewerComponent } from './report-viewer/report-viewer.component';
import { TelerikReportingModule } from '@progress/telerik-angular-report-viewer';


@NgModule({
  declarations: [ReportViewerComponent],
  exports: [
    ReportViewerComponent
  ],
  imports: [
    CommonModule,
    TelerikReportingModule
  ]
})
export class ReportsModule { }
