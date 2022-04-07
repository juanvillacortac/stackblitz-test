import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-sales',
  templateUrl: './table-sales.component.html',
  styleUrls: ['./table-sales.component.scss']
})
export class TableSalesComponent implements OnInit {
  @Input() displayedColumns: any[] = [];
  @Input() data: any[] = [];
  @Input() rowsToShow = 4;
  @Input() paginator = false;
  @Input() scrollable = false;
  @Input() showCurrentPageReport = true;
  @Input() rowHover = true;
  constructor() { }

  ngOnInit(): void {
  }

}
