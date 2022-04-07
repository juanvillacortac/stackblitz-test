import { Component, OnInit } from '@angular/core';
import { chartType } from 'src/app/models/common/chart-type';
import { widgetType } from 'src/app/models/common/widget-type';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  dashboardDataSales: any;
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
            this.dashboardDataSales = [
              { 'x': 0,  'y': 0, 'cols': 12, 'rows': 4, 'title': 'Grupo Sigo', 'widgetType': widgetType.chart,
              'chartType': chartType.bar, 'data': this.loadData() , 'options': this.applyLightTheme() },
          ];
  }

  loadData() {
    this.dashboardDataSales = {
      labels: ['Supermarket Porlamar', 'Supermarket Sambil', 'Supermarket Costazul', 'Bodegón La vela', 'Bodegón Costazul', 'Proveedurias 1', 'Proveedurias 3'],
      datasets: [
          {
              label: 'Monto total de venta por sucursal($)',
              data: [150.000, 250.000, 240.000, 50.000, 40.000, 100.00, 100.00],
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
