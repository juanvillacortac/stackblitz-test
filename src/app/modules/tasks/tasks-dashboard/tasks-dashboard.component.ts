import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { chartType } from 'src/app/models/common/chart-type';
import { widgetType } from 'src/app/models/common/widget-type';
import { AuthService } from '../../login/shared/auth.service';

@Component({
  selector: 'app-tasks-dashboard',
  templateUrl: './tasks-dashboard.component.html',
  styleUrls: ['./tasks-dashboard.component.scss']
})
export class TasksDashboardComponent implements OnInit {
  optionSelection: number;
  displayedColumns: any[] = [];
  leftDashboardData: any;
  centerDashboardData: any;
  rightDashboardData: any;
  leftTitle: any;
  centerTitle: any;
  rightTitle: any;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private _authService: AuthService) {
    this.breadcrumbService.setItems([
        { label: 'Tareas' },
        { label: 'Dashboard', routerLink: ['/tasks/supervisor-dashboard'] }
    ]);
  }

    ngOnInit(): void {
        this.configurateDashboard();
    }
    configurateDashboard() {
        this.leftDashboardLoad();
        this.centerDashboardLoad();
        this.rightDashboardLoad();
    }
    leftDashboardLoad() {

        this.leftTitle = 'Resúmen';
        this.leftDashboardData = [
          { 'x': 0,  'y': 0, 'cols': 12, 'rows': 12, 'title': 'Tareas', 'subTitle': '30 días', 'widgetType': widgetType.stat,
          'total': 35, 'subTotalRight': 2, 'subTotalLeft': 6, 'totalTittle': 'Tareas completadas',
          'subtotalRightTittle': 'Canceladas', 'subTotalLeftTittle': 'Pendientes',
          'showLeftCostIncreaseArrow': false, 'showRightCostIncreaseArrow': false  },

          { 'x': 0,  'y': 12, 'cols': 12, 'rows': 12, 'title': 'Actividades', 'subTitle': '30 días', 'widgetType': widgetType.stat,
          'total': 12,  'totalTittle': 'distintas culminadas', 'mainTittle': 'Has participado en',
          'showLeftCostIncreaseArrow': false, 'showRightCostIncreaseArrow': false, 'centered': true  },
    ];
    }
    centerDashboardLoad() {
      this.centerTitle = 'Mi Ranking';
      this.centerDashboardData = [

        { 'x': 0,  'y': 0, 'cols': 12, 'rows': 12, 'title': 'Por cantidad ', 'subTitle' : 'En estatus Finalizado',
        'widgetType': widgetType.rankingStat, 'position': 3 , 'positionSummary': 'a 5 tareas finalizadas del 1er lugar',
        'subPosition': 1, 'userId': 6, 'userName': 'Amaranta Hernandez',
        'img': 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Amaranta-hernandez.png202110141530252611'},

        { 'x': 0,  'y': 12, 'cols': 12, 'rows': 12, 'title': 'Por tiempo de ejecución ', 'subTitle': 'comparado con el promedio',
        'widgetType': widgetType.rankingStat, 'position': 1 , 'positionSummary': '00:15 mins por encima del promedio',
        'subPosition': 2, 'userId': 8, 'userName': 'Randy Caraballo',
        'img': 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Randy-Caraballo.png202110141532080179'},

      ];
  }
  rightDashboardLoad() {
        this.rightTitle = 'Mi Perfil';
        this.rightDashboardData = [
          { 'x': 0,  'y': 0, 'cols': 12, 'rows': 12, 'title': 'Información', 'subTitle' : '',
          'widgetType': widgetType.profileDetails, 'id': 2 , 'name': this._authService.entityName,
          'image': this._authService.userImage},

          { 'x': 0,  'y': 12, 'cols': 12, 'rows': 12, 'title': 'Tareas asignadas vs completadas ', 'subTitle': 'Por semana',
          'widgetType': widgetType.chart, 'chartType': chartType.line,
          'data': this.loadInventoryValuationMetrics(),
          'options': this.lineTheme()},
        ];
    }

    loadInventoryValuationMetrics() {
      const data = {
        labels: [
          'Semana 1',
          'Semana 2',
          'Semana 3',
          'Semana 4',
          'Semana 5'
        ],
        datasets: [{
            label: 'Asignadas',
            backgroundColor: '#b0c2f2',
            fill: false,
            borderColor: '#b0c2f2',
            tension: .4,
            data: [
              10,
              11,
              8,
              7,
              9,
              6
            ]
          },
          {
            label: 'Completadas',
            backgroundColor: '#d8f8e1',
            fill: false,
            borderColor: '#d8f8e1',
            tension: .4,
            data: [
              9,
              10,
              5,
              4,
              2,
              5
            ]
          }
        ]
      };
      return data;
    }
    lineTheme() {
      const theme = {
        responsive: false,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 0,
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              display: true
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              display: true
            }
          }]
        }
      };
      return theme;
    }

    setOptionSelection(selectionValue: number): void {
      this.optionSelection = selectionValue;
    }
}
