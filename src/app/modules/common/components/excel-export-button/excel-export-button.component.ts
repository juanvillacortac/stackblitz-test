import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ExcelExportService } from './shared/excel-export.service';

@Component({
  selector: 'app-excel-export-button',
  templateUrl: './excel-export-button.component.html',
  styleUrls: ['./excel-export-button.component.scss']
})
export class ExcelExportButtonComponent implements OnInit {
  @Input() initListToExport: any[];
  @Input() initFileName: string;
  @Input() disabled = false;

  listToExport: any[] = [];
  fileName = '';
  constructor(private excelExportService: ExcelExportService) { }


  ngOnInit() {
        this.listToExport = this.initListToExport;
        this.fileName = this.initFileName;
  }


}
