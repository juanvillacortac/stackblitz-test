import { Component, OnInit } from '@angular/core';
import { chartType } from 'src/app/models/common/chart-type';
import { widgetType } from 'src/app/models/common/widget-type';

@Component({
  selector: 'app-ticket-promedio',
  templateUrl: './ticket-promedio.component.html',
  styleUrls: ['./ticket-promedio.component.scss']
})
export class TicketPromedioComponent implements OnInit {

  dashboardDataSalesTicket: any;
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
            this.dashboardDataSalesTicket = [
              { 'x': 0,  'y': 0, 'cols': 12, 'rows': 4, 'title': 'Grupo Sigo', 'widgetType': widgetType.chart,
              'chartType': chartType.bar, 'data': this.loadData() , 'options': this.applyLightTheme() },
          ];
  }

  loadData() {
    this.dashboardDataSalesTicket = {
      labels: ['Supermarket Porlamar', 'Supermarket Sambil', 'Supermarket Costazul', 'Bodegón La vela', 'Bodegón Costazul', 'Proveedurias 1', 'Proveedurias 3'],
      datasets: [
          {
              label: 'Promedio($)',
              data: [30,35,20,40,20,25,30],
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


