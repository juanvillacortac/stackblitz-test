import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { chartType } from 'src/app/models/common/chart-type';
import { widgetType } from 'src/app/models/common/widget-type';

@Component({
  selector: 'app-tasks-supervisor-dashboard',
  templateUrl: './tasks-supervisor-dashboard.component.html',
  styleUrls: ['./tasks-supervisor-dashboard.component.scss']
})
export class TasksSupervisorDashboardComponent implements OnInit {
  optionSelection: number;
  displayedColumns: any[] = [];
  leftDashboardData: any;
  centerDashboardData: any;
  rightDashboardData: any;
  titleActivities: any;
  titleProductivity: any;
  titleRankings: any;

  constructor(
    private breadcrumbService: BreadcrumbService) {
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
        this.titleProductivity = 'Productividad';
        this.leftDashboardData = [
            { 'x': 0,  'y': 0, 'cols': 12, 'rows': 6, 'title': 'Productividad general del Equipo ', 'subTitle': 'Última semana',
               'widgetType': widgetType.percentInd, 'target': '90', 'currentValue': 92, 'valueVsTarget': '1,8' , 'image': 'assets/layout/images/dashboard/rateup.svg',
               'totalIcon': 'query_builder', 'statSubTitle': 'Objetivo: 90%'},
            { 'x': 0,  'y': 6, 'cols': 12, 'rows': 8, 'title': 'Promedio de horas efectivas por trabajador ', 'sublegend': 'Última semana',
               'widgetType': widgetType.targetInd, 'target': '40', 'currentValue': 42, 'valueVsTarget': '1,92' , 'totalIcon': 'query_builder', 'statSubTitle': 'Objetivo: 50'},
           { 'x': 0,  'y': 14, 'cols': 12, 'rows': 12, 'title': '% Actividades culminadas en tiempo', 'subTitle': 'Último mes',
               'widgetType': widgetType.circleNumber, 'maxValue': 100, 'targetValue': 70, 'currentValue': 68.5, 'legend': 'Objetivo: 70%' }
       ];
    }

    centerDashboardLoad() {
        this.titleActivities = 'Resumen Actividades';
        this.centerDashboardData = [
            { 'x': 0,  'y': 0, 'cols': 12, 'rows': 6, 'title': 'Cantidad de Actividades', 'sublegend': 'Ultimos 7 días',
                'widgetType': widgetType.targetInd, 'currentValue': 150 , 'icon': 'pi-file', 'legend': 'Total'},
            { 'x': 0,  'y': 6, 'cols': 12, 'rows': 8, 'title': 'Porcentaje de Actividades completadas', 'widgetType': widgetType.knob,
            'currentValue': 80, 'targetValue': 100, 'size': 150 },
            {  'x': 0,  'y': 14, 'cols': 12, 'rows': 12, 'title': 'Actividades por estatus ', 'widgetType': widgetType.chart,
                'chartType': chartType.pie, 'data': this.loadTasksByStatus(), 'options': this.loadBasicOptions()},
        ];
    }

    rightDashboardLoad() {
        this.titleRankings = 'Equipo';
        this.rightDashboardData = [
            { 'x': 0,  'y': 0, 'cols': 12, 'rows': 12, 'title': 'Ranking de Personas por Tareas Completadas', 'subTitle': 'Última semana',
                'widgetType': widgetType.rankingTable,  'data': this.loadRankingByCompletedTask(), 'valueTittle': 'Tareas completadas'},
            { 'x': 0,  'y': 12, 'cols': 12, 'rows': 12, 'title': 'Ranking de Personas por Tiempo efectivo', 'subTitle': 'Última semana',
                'widgetType': widgetType.rankingTable,  'data': this.loadRankingByTimeTask(), 'valueTittle': 'Tiempo efectivo registrado'},
        ];
    }

    loadTasksByStatus() {
    const data = {
        labels: ['Pendiente', 'Iniciada', 'Pausada', 'Cancelada', 'Finalizada'],
        datasets: [
            {
                data: [15, 30, 9, 12, 25],
                backgroundColor: [
                    '#8fbffe',
                    '#827cea',
                    '#d9f3c4',
                    '#ffb6af',
                    '#c7f6d4'
                ],
                hoverBackgroundColor: [
                    '#8fbffe',
                    '#968eff',
                    '#d9f3c4',
                    '#ffb6af',
                    '#c7f6d4'
                ]
            }
        ]
    };
    return data;
    }
    loadRankingByCompletedTask() {
        const data = [
                {
                    id: 6,
                    position: 1,
                    userId: 6,
                    name: 'Amaranta Hernandez',
                    image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Amaranta-hernandez.png202110141530252611',
                    value: 20
                },
                {
                    id: 4,
                    position: 3,
                    userId: 4,
                    name: 'Ana DLeon',
                    image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/WhatsApp_Image_2021-10-21_at_4.53.22_PM.jpeg202110221420109824',
                    value: 14
                },
                {
                    id: 11,
                    position: 2,
                    userId: 11,
                    name: 'Juan Salazar',
                    image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/WhatsApp_Image_2021-10-14_at_15.56.09.jpeg202110142027525353',
                    value: 18
                },
                {
                    id: 8,
                    position: 5,
                    userId: 8,
                    name: 'Randy Caraballo',
                    image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Randy-Caraballo.png202110141532080179',
                    value: 9
                },
                {
                    id: 7,
                    position: 4,
                    userId: 7,
                    name: 'Madelyn Leos',
                    image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Madelyn-Leos.png202110141529477524',
                    value: 12
                },
                {
                    id: 3,
                    position: 6,
                    userId: 3,
                    name: 'Orlando DLeon',
                    image: "https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Orlando-D'-Leo¦ün.png202110132050517560",
                    value: 5
                }
            ];
        return data;
    }
    loadRankingByTimeTask() {
    const data = [
    {
    id: 3,
    position: 3,
    userId: 3,
    name: 'Orlando DLeon',
    image: "https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Orlando-D'-Leo¦ün.png202110132050517560",
    value: 20
    },
    {
    id: 7,
    position: 1,
    userId: 7,
    name: 'Madelyn Leos',
    image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Madelyn-Leos.png202110141529477524',
    value: 29
    },
    {
    id: 8,
    position: 5,
    userId: 8,
    name: 'Randy Caraballo',
    image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Randy-Caraballo.png202110141532080179',
    value: 10
    },
    {
    id: 2,
    position: 2,
    userId: 2,
    name: 'Joniz Gonzalez',
    image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Joniz-Gonzalez.png202110141531414763',
    value: 25
    },
    {
    id: 9,
    position: 4,
    userId: 9,
    name: 'Anyela Ramos',
    image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Anyela_ramos.jpg202110141532343931',
    value: 18
    },
    {
    id: 10,
    position: 6,
    userId: 10,
    name: 'Nilda Vasquez',
    image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Nilda-Vasquez.png202110141533146871',
    value: 9
    }
    ];
    return data;
    }

    loadBasicOptions() {
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
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                }
            }
        }
    };
    return basicOptions;
    }

    setOptionSelection(selectionValue: number) {
        this.optionSelection = selectionValue;
    }
}
