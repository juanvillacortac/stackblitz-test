import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory-counts-calendar-item',
  templateUrl: './inventory-counts-calendar-item.component.html',
  styleUrls: ['./inventory-counts-calendar-item.component.scss']
})
export class InventoryCountsCalendarItemComponent implements OnInit {

  @Input() event: any;

  constructor() { }

  ngOnInit(): void {
  }

}
