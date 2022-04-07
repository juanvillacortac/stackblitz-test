import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider-list',
  templateUrl: './slider-list.component.html',
  styleUrls: ['./slider-list.component.scss']
})
export class SliderListComponent implements OnInit {

  @Input() data: any[];
  @Input() maxRow = 10;
  dataPerPage: any[];
  constructor() { }

  ngOnInit(): void {
    this.dataPerPage = this.data.slice(0, this.maxRow);
  }

  paginate(event) {
    this.dataPerPage = this.data.slice(event.first, event.first + event.rows);
 }

}
