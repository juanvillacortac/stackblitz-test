import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { chartType } from 'src/app/models/common/chart-type';
import { widgetType } from 'src/app/models/common/widget-type';

@Component({
  selector: 'app-headcount-turnover',
  templateUrl: './headcount-turnover.component.html',
  styleUrls: ['./headcount-turnover.component.scss']
})
export class HeadcountTurnoverComponent implements OnInit {

  dashboardDataEmployeeLevel: any;
  titleout1:any;
  basicOptions:any;
  constructor() { }

  ngOnInit(): void {
    this.loadData();
    //this.createDashboard();
  }

  createDashboard()
  {
            //Empleados
            this.dashboardDataEmployeeLevel = [
              { 'x': 0,  'y': 0, 'cols': 12, 'rows': 4, 'title': 'Grupo Sigo', 'widgetType': widgetType.chart,
              'chartType': chartType.bar, 'data': this.loadData() , 'options': this.applyLightTheme() },
          ];
  }

  loadData() {
    this.dashboardDataEmployeeLevel = {
      labels: ['Sigo', 'Norkut', 'Navibus', 'Sunsol', 'Great Sea', 'Sun Magic', 'Filiales'],
      datasets: [
          {
              label: 'Conteo de empleados por grupo de empresas',
              data: [65, 59, 80, 81, 56, 55, 40],
              backgroundColor: [
                '#ECFEAA',
                '#EFBDC8',
                '#ADECFF',
                '#3bf7e4',
                '#C2F1FF',
                '#ffb4a2',
                '#9bf6ff'

            ],
            hoverBackgroundColor: [
              '#ECFEAA',
              '#EFBDC8',
              '#ADECFF',
              '#3bf7e4',
              '#C2F1FF',
              '#ffb4a2',
              '#9bf6ff'
            ]
          },
      ]
  };
 // return data;
}

applyLightTheme() {
  const basicOptions = {
      responsive: false,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 0,
      legend: {
          labels: {
              fontColor: '#495057'
          }
      },
       scales: {
          xAxes: [{
              ticks: {
                  fontColor: '#17a2b8'
              }
          }],
          yAxes: [{
              ticks: {
                  fontColor: '#17a2b8'
              }
          }]
      } 
  };
return basicOptions;
}


}
