import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit {

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
