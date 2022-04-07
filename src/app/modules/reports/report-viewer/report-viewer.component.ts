import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TelerikReportViewerComponent } from "@progress/telerik-angular-report-viewer";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportViewerComponent implements OnInit {
  reportServiceURL = `${environment.API_BASE_URL_TELERIK_REPORT}/api/reports/`
  @Input() title = 'viewer';
  @Input() viewMode: string = 'INTERACTIVE'
  @Input() scaleMode: string = 'SPECIFIC'
  @Input() reportSource: any
  @Input() viewerContainerStyle: any = {
    position: 'relative',
    width: '1000px',
    height: '800px',
    ['box-sizing']: 'unset',
    ['font-family']: 'ms sans serif'
  };
  @ViewChild('viewer') viewer = new TelerikReportViewerComponent()

  constructor() { }

  ngOnInit(): void {
  }

  reloadViewer(): void {
    this.viewer.setReportSource(this.reportSource);
    this.viewer.refreshReport();
  }
}
