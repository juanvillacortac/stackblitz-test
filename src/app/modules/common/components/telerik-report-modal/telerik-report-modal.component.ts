import {ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ReportViewerComponent} from "../../../reports/report-viewer/report-viewer.component";

@Component({
  selector: 'app-telerik-report-modal',
  templateUrl: './telerik-report-modal.component.html',
  styleUrls: ['./telerik-report-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TelerikReportModalComponent implements OnInit {

  @Input() visible: boolean = false
  @Input() param1: number = 0
  @Input() name: string = ""
  @ViewChild('viewer', { static: false }) viewer: ReportViewerComponent

  reportSource = { report: 'TransferenciaMercancia.trdp', parameters: { IdTransferenciaSucursal: 345} }
  showReport = false
  constructor(private changeDetectorRef: ChangeDetectorRef){}

  onShow(){
    //this.ngOnInit();
  }

  ngOnInit(): void { }

  title = 'viewer';

  viewerContainerStyle = {
      position: 'relative',
      width: '1000px',
      height: '800px',
      ['font-family']: 'ms sans serif'
  };

  reloadViewer(param1:number): void {
    this.showReport = true
    this.changeDetectorRef.detectChanges();
    this.reportSource.parameters.IdTransferenciaSucursal = param1
    this.viewer.reloadViewer();
  }
}

