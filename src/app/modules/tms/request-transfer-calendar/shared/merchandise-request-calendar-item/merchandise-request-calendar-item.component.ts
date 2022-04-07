import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-merchandise-request-calendar-item',
  templateUrl: './merchandise-request-calendar-item.component.html',
  styleUrls: ['./merchandise-request-calendar-item.component.scss']
})
export class MerchandiseRequestCalendarItemComponent implements OnInit {

  @Input() event: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
