import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { AnalyticFinancialFilter, DataAnalyticsDao, IndicatorAnalyticsFilter, ResultAnalytics, ValuesLabelAnalytics } from 'src/app/models/financial/AnalyticFinancial';
import { FinancialDashboardService } from '../shared/services/financial-dashboard.service';

type GroupUnion = ResultAnalytics | DataAnalyticsDao

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent implements OnInit {
  showFilters: boolean = false;
  //expanded:boolean =true;
  expanded: { [key: string]: boolean } = {}
  partidas: ResultAnalytics[] = [];
  partidasCols: any[] = []
  periodCols: { field: string; header: string; display: string; }[];
  partidasCols2: any[] = [];

  colors = {
    red: "#F38BA0",
    lightRed: "#f5a7b7",
    green: "#70AF85",
    yellow: "#FFEB99",
    blue: "#98D6EA",
    lightBlue: "#b0dfef",
    grey: "#6D8299",
    purple: "#BEAEE2",
    orange: "#F39189",
    brown: "#DEBA9D"

  };

  columns: ColumnD<GroupUnion>[] = [
    { template: v => 'valor1' in v ? v.valor1 : null, field: 'year', header:'', display: 'table-cell' },
    { template: v => 'valor2' in v ? '$'+this.formatAmount(v.valor2) : null, field: 'period',  headerTemplate: () => this.partidas?.length ? this.partidas[0].valuesLabels[0].labels : null, display: 'table-cell' },
    { template: v => 'valor3' in v ? '$'+this.formatAmount(v.valor3) : null, field: 'active',  headerTemplate: () => this.partidas?.length ? this.partidas[0].valuesLabels[1].labels : null, display: 'table-cell' },
    { template: v => 'valor4' in v ? '$'+this.formatAmount(v.valor4) : null, field: 'createdByUser', headerTemplate: () => this.partidas?.length ? this.partidas[0].valuesLabels[2].labels : null, display: 'table-cell' },
    { template: v => 'valor5' in v ? '$'+this.formatAmount(v.valor5) : null, field: 'updatedByUser',  headerTemplate: () => this.partidas?.length ? this.partidas[0].valuesLabels[3].labels : null, display: 'table-cell' },
    { template: v => 'valor6' in v ? '$'+this.formatAmount(v.valor6) : null, field: 'updatedByUser',  headerTemplate: () => this.partidas?.length ? this.partidas[0].valuesLabels[4].labels : null, display: 'table-cell' },
  ]
  value1: number = 1;
  optionsTime: { title: string; value: number; }[];
  dashboardData: any;
  AnalyticFinancialFilter = new AnalyticFinancialFilter();
  items: ({ label: string; icon: string; url?: undefined; routerLink?: undefined; } | { label: string; icon: string; url: string; routerLink?: undefined; } | { label: string; icon: string; routerLink: string; url?: undefined; })[];
  years: ({ label: string; icon: string; routerLink: string; url?: undefined; } | { label: string; icon: string; url: string; routerLink?: undefined; })[];
  constructor(public _financialDashboardService: FinancialDashboardService,
    public breadcrumbService: BreadcrumbService,
    private messageService: MessageService) {

    this.breadcrumbService.setItems([ 
      { label: 'FMS' },
      { label: 'Resultado financiero', routerLink: ['/financial/balance-sheet'] }
    ]);
  }

  year: SelectItem[] = [
    {label: '2021', value: 0},
    {label: '2020', value: 1},
    {label: '2019', value: 2},
   
  ];

  PeridoFiscal: SelectItem[] = [
    {label: '2021-2022', value: 0},
    {label: '2020-2021', value: 1},
    {label: '2019-2020', value: 2},
   
  ];
  ngOnInit(): void {

    this.optionsTime = [

      {title: '1er semestre', value: 1},
  
      {title: '2do semestre', value: 2},

  ];
    this.items = [

      {
        label: '3 años anteriores',
        icon: ' pi pi-table',
        url: 'http://angular.io'
      },
      {
          label: '1er semestre',
          icon: ' pi pi-table',
          routerLink: '/fileupload'
      },
      {
        label: '2do semestre',
        icon: ' pi pi-table',
        url: 'http://angular.io'
      }
  ];

  this.years = [
    {
        label: '2020',
        icon: ' pi pi-table',
        routerLink: '/fileupload'
    },
    {
      label: '2021',
      icon: ' pi pi-table',
      url: 'http://angular.io'
    }
];
    this.partidasCols = [
      //{ field: 'year', header: '', display: 'table-cell' },

    ];
    this.search();
 
    this.periodCols = [
      { field: 'periodNumber', header: 'Período N°', display: 'table-cell' },
      { field: 'name', header: 'Nombre', display: 'table-cell' },
      { field: 'period', header: 'Período', display: 'table-cell' },
      { field: 'indClosed', header: 'Cerrado', display: 'table-cell' },
    ];

    
    this.dashboardData = [

      {
        'x': 0, 'y': 0, 'cols': 4.5, 'rows': 7, 'title': 'Detalle por Partida contable', 'widgetType': 'chart',
        'chartType': 'doughnut', 'data': this.loadDataBalanceSheetDetail(), 'options': this.applyLightThemedoughnut(), 'value': '$5500.8979,0000', 'caption': 'Monto'
      }

    ];


  }

  applyLightThemedoughnut() {
    const basicOptions = {
      responsive: true,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 0,

      legend: {
        position: 'bottom',
        labels: {
          fontColor: '#495057'
        },
        title: {
          display: true,
          text: 'Prueba'
        }
      }
    };
    return basicOptions;
  }

  formatAmount(amount: any) {
    return parseFloat(amount).toLocaleString('es-Ve', { minimumFractionDigits: 4 })
  }

  loadDataBalanceSheetDetail() {

    const data = {

      labels: ['COSTOS Y GASTOS($)',
        'INGRESOS($)',
        'INGRESOS PROCEDENTES DE OPERACIONES($)',
        'OTROS INGRESOS (GASTOS)'
      ],

      datasets: [

        {

          label: 'Conteo de empleados por grupo de empresas',

          data: [22670.8967, 25670.0000, 30670.0000, 90670.0000],

          backgroundColor: [

            this.colors.blue,

            this.colors.red,

            '#66cdaa',



          ],

          hoverBackgroundColor: [

            this.colors.green,

            this.colors.red,

            '#66cdaa',



          ]

        },

      ]

    };
    return data;

  }



  // fetchTaxData() {
  //   debugger
  //   this.AnalyticFinancialFilter.indicators = this.Indicators
  //   return this._financialDashboardService.getIndicatorsFMS(this.AnalyticFinancialFilter).toPromise()
  //     .then(data => {
  //       this.DataIndicators = data

  //     })

  // }
  // idIndicator: number = -1;//37

  // idFilterType: number = -1;//11

  // parameters: object = null;
  // getIndicatorsF
  // indicators: IndicatorAnalyticsFilter[] = [];

  search() {
    debugger

    this.AnalyticFinancialFilter.indicators = [{
      ... new IndicatorAnalyticsFilter(),
      idIndicator: 128,
      idFilterType: -1,
      parameters: null
    }]
    this._financialDashboardService.getIndicatorsFMS(this.AnalyticFinancialFilter).subscribe((data: any) => {

      this.partidas = data[0].result;
      this.partidasCols2 = [
        { field: 'year', header: 'Cuenta contable', display: 'table-cell' },
        { field: 'period', header: this.partidas[0].valuesLabels[0].labels, display: 'table-cell' },
        { field: 'active', header: this.partidas[0].valuesLabels[1].labels, display: 'table-cell' },
        { field: 'createdByUser', header: 'periodo3', display: 'table-cell' },
        { field: 'updatedByUser', header: 'periodo 4', display: 'table-cell' },
      ];
      this.toggleExpanded(true);


    }, (error: HttpErrorResponse) => {

      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el balance general." });

    });
  }

  search2() {
    debugger

    this.AnalyticFinancialFilter.indicators = [{
      ... new IndicatorAnalyticsFilter(),
      idIndicator: 146,
      idFilterType: -1,
      parameters: null
    }]
    this._financialDashboardService.getIndicatorsFMS(this.AnalyticFinancialFilter).subscribe((data: any) => {

      this.partidas = data[0].result;
      this.partidasCols2 = [
        { field: 'year', header: 'Cuenta contable', display: 'table-cell' },
        { field: 'period', header: this.partidas[0].valuesLabels[0].labels, display: 'table-cell' },
        { field: 'active', header: this.partidas[0].valuesLabels[1].labels, display: 'table-cell' },
        { field: 'createdByUser', header: 'periodo3', display: 'table-cell' },
        { field: 'updatedByUser', header: 'periodo 4', display: 'table-cell' },
      ];
      this.toggleExpanded(true);


    }, (error: HttpErrorResponse) => {

      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el balance general." });

    });
  }

  log = console.log

  toggleExpanded(status: boolean) {
    this.partidas.forEach(x => {
      this.expanded[x.etiqueta] = status
    })
  }

}
