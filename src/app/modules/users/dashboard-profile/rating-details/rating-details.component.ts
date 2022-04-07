import { Component, Input, OnInit } from '@angular/core';
const val2 = 3;

@Component({
  selector: 'app-rating-details',
  templateUrl: './rating-details.component.html',
  styleUrls: ['./rating-details.component.scss']
})
export class RatingDetailsComponent implements OnInit {
  @Input() fullName: '';

  val: number;
  lineData: any;

  constructor() {  }

  ngOnInit(): void {
    this.val = 4;
    this.initChartData()
  }

  initChartData() {
    this.lineData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'Ventas en curso',
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
              backgroundColor: 'rgb(255, 205, 86)',
              borderColor: 'rgb(255, 205, 86)'
          },
          {
              label: 'Ventas completadas',
              data: [28, 48, 40, 19, 86, 27, 90],
              fill: false,
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'rgb(75, 192, 192)'
          }
      ]
  };
  }
}
