import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TelerikReportViewerComponent } from '@progress/telerik-angular-report-viewer';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-printed-report',
  templateUrl: './printed-report.component.html',
  styleUrls: ['./printed-report.component.scss']
})
export class PrintedReportComponent implements OnInit {
  
  // @Input() visible: boolean = false
  // @Input() param1: number = 0
  // @Input() name:string =""
  idBranchTransfer:number;
  @ViewChild('viewer') viewer = new TelerikReportViewerComponent()
  
  title = 'viewer';

  viewerContainerStyle = {
      position: 'relative',
      width: '1000px',
      height: '800px',
      ['font-family']: 'ms sans serif'
  };
  constructor(private actRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.idBranchTransfer = parseInt(this.actRoute.snapshot.params['idBranchTransfer']);
    this.reloadViewer();
  }

  reloadViewer(): void {
    debugger
    var rs = {
      report:'TransferenciaMercancia.trdp',
      parameters:{
        IdTransferenciaSucursal: this.idBranchTransfer
      }
    };
    this.viewer.setReportSource(rs);
    this.viewer.refreshReport();
  }

  back() {
    this.router.navigate(['/tms/merchandise-transfers-list']);
  }

}
