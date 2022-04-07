import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { chartType } from 'src/app/models/common/chart-type';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { Typeindicator } from 'src/app/models/common/type-indicator';
import { widgetType } from 'src/app/models/common/widget-type';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { AnalyticsTMS } from 'src/app/models/tms/dashboard/analytics';
import { AnalyticsFilter } from 'src/app/models/tms/dashboard/analytics-filter';
import { AnalyticsIndicatorFilter } from 'src/app/models/tms/dashboard/analytics-indicator-filter';
import { IndicatorModuleFilter } from 'src/app/models/tms/dashboard/indicator-module-filter';
import { LoadingService } from '../../common/components/loading/shared/loading.service';
import { AuthService } from '../../login/shared/auth.service';
import { BranchofficeFilter } from '../../masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from '../../masters/branchoffice/shared/services/branchoffice.service';
import { TmsDashboardService } from './service/tms-dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data: any;
  paginator: boolean = false;
  listTypeindicatorsProfitability: Typeindicator[];
  listTypeindicatorsInventoryValuation: Typeindicator[];
  listTypeindicatorsInventoryDay: Typeindicator[];
  dataViewModel: DataviewModel = new DataviewModel();
  dataViewModelAvatar: DataviewModel = new DataviewModel();
  dataViewListModel: DataviewListModel = new DataviewListModel();
  branchOfficeList: { label: string; value: number; }[];
  selection: any;
  //Data de paneles del dashboard
  salesMetricsData: any;
  lossMetricsData: any;
  profitabilityMetricsData: any;
  precisionMetricsData: any;
  productivityMetricsData: any;
  inventoryValuationMetricsData: any;

  //Titulos de los paneles del dashboard
  titleSales: any;
  titleLoss: any;
  titleProfitability: any;
  titlePrecision: any;
  titleProductivity: any;
  titleInventoryValuation: any;
  effectiveness:any;
  percent:any;
  optionsTime: any[];
  value1: number = 15;
  id: any;
  frencuencia: number;
  UpdateDate:any;
  Indicators: AnalyticsIndicatorFilter [];
  IndicatorModuleFilter = new IndicatorModuleFilter();
  AnalyticsFilter = new AnalyticsFilter();
  DataIndicators:AnalyticsTMS[];
  dataSalesBarMetrics: any;
  constructor(private branchofficeService: BranchofficeService,private _Authservice: AuthService,
    private messageService: MessageService,
    public _tmsDashboardService: TmsDashboardService,
    private loadingService: LoadingService) { }

    loadBrancoffices() {

      var filter = new BranchofficeFilter();
      filter.idCompany = this._Authservice.currentCompany;
      this.branchofficeService.getBranchOfficeList(filter).subscribe((data: Branchoffice[]) => {
        data = data.sort((a, b) => a.branchOfficeName.localeCompare(b.branchOfficeName));
        this.branchOfficeList = data.map((item) => ({
          label: item.branchOfficeName,
          value: item.id
        }));
      }, (error: HttpErrorResponse) => {
        // this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las sucursales" });
      });
    }
    ngOnDestroy() {
      if (this.id) {
        clearInterval(this.id);
      }
    }

    ngOnInit(): void {
      this.loadBrancoffices();
      this.selection = this._Authservice.currentOffice;
      this.loadFrequency();
    }

    async loadFrequency() {
    clearInterval(this.id);
    this.id = setInterval(() => {
      this.loadFrequency();
    }, 60000*5);

    const fecha = new Date();
    let mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(new Date());
    this.frencuencia = this.value1;
    this.UpdateDate ="Su última actualización fue el "+fecha.getDate()+" de "+ mesActual +" del "+ fecha.getFullYear()+", a las "+fecha.toLocaleTimeString('en-US');

   this.salesMetricsData = [];
   this.lossMetricsData = [];
   this.profitabilityMetricsData = [];
   this.effectiveness= [];
   this.percent=[];
    this.frencuencia = this.value1;
    this.optionsTime = [
      { title: 'Hoy', value: 15 },

      { title: 'Este mes', value: 2 },

      { title: 'Últimos 3 meses', value: 5 },

      { title: 'Últimos 6 meses', value: 7 }

    ];
    this.titleSales = "Transferencias de mercancia";
    this.titleLoss = "Transferencias - Solicitudes";
    this.titleProfitability = "Solicitudes de mercancia";
    this.titlePrecision = "Indicadores de precisión de inventario";
    this.titleProductivity = "Indicadores de productividad";
    this.titleInventoryValuation = "Valorizado de inventario";

    this.loadingService.startLoading()
    await this.IndicatorspTMSxModules()
    await this.fetchTaxData();
    this.percent=this.Percentage(170)
    this.effectiveness =this.Percentage(25);
    await this.createDashboard()

    this.loadingService.stopLoading()

    // this.titleout1 = "Facturación";

  }


  IndicatorspTMSxModules() {

    return this._tmsDashboardService.getListIndicatorsModule(this.IndicatorModuleFilter).toPromise()
      .then(Indicator => {
        this.Indicators = Indicator

      })
      .catch((err) => {
        this.createDashboard()
      })
  }

  createDashboard() {
    this.search();
    this.searchAvartar();
    this.onLoadIndicators();
    this.onLoadData();
  }

  fetchTaxData() {
    this.AnalyticsFilter.indicators = this.Indicators;
    this.AnalyticsFilter.idBranchOffice = +this.selection;
    this.AnalyticsFilter.indicators.forEach(item => {
      item.idFilterType = this.frencuencia
    });

    return this._tmsDashboardService.getAnalyticsIndicators(this.AnalyticsFilter).toPromise()
      .then(data => {
        this.DataIndicators = data

      })
  }

  search() {
    var count = 0;
    this.branchofficeService.getBranchOfficeList().subscribe((data: Branchoffice[]) => {
      this.branchofficeService._branchOfficeList = data;
      this.dataViewModel.dataviewlist = [];
      this.branchofficeService._branchOfficeList.forEach(element => {
        if (count < 10) {
          this.dataViewListModel = new DataviewListModel();
          this.dataViewListModel.id = element.id;
          this.dataViewListModel.name = element.branchOfficeName;
          this.dataViewListModel.mainDescription = element.branchOfficeManager;
          this.dataViewListModel.secundaryDescription = element.branchOfficeTypeName;
          this.dataViewListModel.mainDescriptionSide = element.branchOfficeCode;
          this.dataViewListModel.secundaryDescriptionSide = element.companyName;
          this.dataViewListModel.image = true;
          this.dataViewListModel.imagePath = this.dataViewModel.imagePathEmpaque;
          this.dataViewModel.dataviewlist.push(this.dataViewListModel);
        }
        count = count + 1;
      });

    }, (error: HttpErrorResponse) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Consulta',
        detail: "Ha ocurrido un error al cargar los datos"
      });
    });
  }

  searchAvartar() {
    var count = 0;
    this.branchofficeService.getBranchOfficeList().subscribe((data: Branchoffice[]) => {
      this.branchofficeService._branchOfficeList = data;
      this.dataViewModelAvatar.dataviewlist = [];
      this.branchofficeService._branchOfficeList.forEach(element => {
        if (count < 5) {
          this.dataViewListModel = new DataviewListModel();
          this.dataViewListModel.id = element.id;
          this.dataViewListModel.name = element.branchOfficeName;
          this.dataViewListModel.mainDescription = element.branchOfficeManager;
          this.dataViewListModel.secundaryDescription = element.branchOfficeTypeName;
          this.dataViewListModel.mainDescriptionSide = element.branchOfficeCode;
          this.dataViewListModel.secundaryDescriptionSide = element.companyName;
          this.dataViewListModel.image = true;
          this.dataViewListModel.imagePath = this.dataViewModel.imagePathAvatar;
          this.dataViewModelAvatar.dataviewlist.push(this.dataViewListModel);
        }
        count = count + 1;
      });

    }, (error: HttpErrorResponse) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Consulta',
        detail: "Ha ocurrido un error al cargar los datos"
      });
    });
  }

  onLoadIndicators() {

    this.listTypeindicatorsProfitability = [{
        id: 1,
        indicator: 'Transferencias de mercancia',
        value: '45'
      },
      {
        id: 2,
        indicator: 'Transfrencias certificadas',
        value: '73'
      },
      {
        id: 3,
        indicator: 'Cantidad en ejecucion',
        value: '50'
      },
      {
        id: 4,
        indicator: 'Cantidad enviadas',
        value: '69'
      },
      {
        id: 3,
        indicator: 'Cantidad recibidas',
        value: '35'
      },
      {
        id: 4,
        indicator: 'Cantidad finalizadas',
        value: '15'
      }
    ];

    this.listTypeindicatorsInventoryValuation = [{
        id: 1,
        indicator: 'Solicitudes de mercancia',
        value: '120'
      },
      {
        id: 2,
        indicator: 'solicitudes de mercancia automaticas',
        value: '350'
      },
      {
        id: 3,
        indicator: 'Solicitudes pendientes por recibir',
        value: '54'
      },
      {
        id: 4,
        indicator: 'Solicitudes recibidas',
        value: '165'
      }
    ];

    this.listTypeindicatorsInventoryDay = [{
        id: 1,
        indicator: 'Productos activos',
        value: '145,65K'
      },
      {
        id: 2,
        indicator: 'Productos inactivos',
        value: '1,25K'
      },
      {
        id: 3,
        indicator: 'Productos con inventario en negativo',
        value: '65'
      }
    ];
  }


  Percentage(ind: number) {
    debugger

    const evaluate = (a: any, b: any, op: '==' | '<=' | '>=' | '<' | '>' | '!=') => {
      switch (op) {
        case '==':
          return a == b
        case '<=':
          return a <= b
        case '>=':
          return a >= b
        case '<':
          return a < b
        case '>':
          return a > b
        case '!=':
          return a != b
      }
    }
    let data = this.DataIndicators?.filter(f => f.idIndicator == ind)
    let temp = [];
    if (data?.length)
      data[0].results
        .forEach((a) => {
          temp.push({
            colorHex: a.colorHex,
            etiqueta: a.etiqueta,
            comparacion:a.comparator,
            valorActual: a.currentValue,
            meta: a.goal,
            porcentaje: a.percent,
            direccion: evaluate(a.currentValue, a.goal, a.comparator as any)?'mayor':'menor'
          })
        })

    return temp;

  }
  onLoadData() {
    debugger
    //#region Dashboard Sales
    this.salesMetricsData = [{
        'id':25,
        'cols': 4,
        'rows': 2,
        'title': 'Efectividad en envío de transferencias',
        'caption': 'Enviadas vs recibidas',
        'widgetType': widgetType.percentInd,
        'objectiveDescription': 'Efectividad: ' + this.effectiveness[0].comparacion,
        'color': this.effectiveness[0].direccion,
        'currentValue': this.effectiveness[0].valorActual,
        'target': this.effectiveness[0].meta,
        'valueVsTarget': this.effectiveness[0].porcentaje,
        'symbol': '%',
        'image': this.effectiveness[0].direccion=='mayor'? 'assets/layout/images/dashboard/rateup.svg' :'assets/layout/images/dashboard/ratedown.svg'
        //'image': 'assets/layout/images/dashboard/rateup.svg'
      },
       {
        'id':80,
        'cols': 4,
        'rows': 3,
        'title': 'Cantidad enviada vs recibidas',
        'widgetType': widgetType.chart,
        'chartType': chartType.bar,
        'data': this.loadSalesBarMetrics(80),
        'options': this.barTheme()
      },
      {
        'id':78,
        'cols': 4,
        'rows': 4,
        'title': 'Transferencias al dia - Valores generales',
        'widgetType': widgetType.listnumberindicator,
        'data': this.GeneralIndicators(78)
      },
    ];
    //#endregion

//#region Dashboard Loss
    this.lossMetricsData = [{
       
        'cols': 4,
        'rows': 2,
        'title': 'Tiempo de transporte',
        'widgetType': widgetType.targetInd,
        'currentValue': '165',
        'target': '112',
        'valueVsTarget': '67,87',
        'sublegend': 'Promedio de tiempo en minutos',
        'image': 'assets/layout/images/dashboard/ratedown.svg',
        'symbol':'%',
        'disabled': true
      },
      {
      
        'cols': 4,
        'rows': 3,
        'title': 'Tiempo promedio en traslado de transferencias',
        'widgetType': widgetType.chart,
        'chartType': chartType.line,
        'data': this.loadInventoryValuationMetrics(),
        'options': this.lineTheme(),
        'disabled': true
      },
// {
//   'cols': 4,
//   'rows': 3,
//   'title': 'Perdidas por motivos',
//   'widgetType': widgetType.chart,
//   'chartType': chartType.pie,
//   'data': this.loadLossMetrics(),
//   'options': this.pieTheme()
// },
// {
//   'cols': 4,
//   'rows': 5,
//   'title': 'Top 5 productos con mayor perdida',
//   'widgetType': widgetType.dataviewList,
//   'data': this.loadSalesMetricsList()
// },
    ];
//#endregion


    //#region Dashboard Profitability
      this.profitabilityMetricsData = [{
        'id':170,
        'cols': 4,
        'rows': 2,
        'title': 'Porcentaje de envio',
        'caption': 'Creadas vs Enviadas',
        'widgetType': widgetType.percentInd,
        'objectiveDescription': 'Envios: ' + this.percent[0].comparacion,
        'color': this.percent[0].direccion,
        'currentValue': this.percent[0].valorActual,
        'target': this.percent[0].meta,
        'valueVsTarget': this.percent[0].porcentaje,
        'symbol': '%',
        'image': this.percent[0].direccion=='mayor'? 'assets/layout/images/dashboard/rateup.svg' :'assets/layout/images/dashboard/ratedown.svg'
      },
      {
        'id':169,
        'cols': 4,
        'rows': 3,
        'title': 'Cantidad creadas vs envidas',
        'widgetType': widgetType.chart,
        'chartType': chartType.bar,
        'data': this.loadSalesBarMetrics(169),
        'options': this.barTheme(),
       
      },
      {
       
        'cols': 4,
        'rows': 3,
        'title': 'Solicitudes al dia - Valores generales',
        'widgetType': widgetType.listnumberindicator,
        'data': this.listTypeindicatorsInventoryValuation,
        'disabled': true
      },
      // {
      //   'cols': 4,
      //   'rows': 3,
      //   'title': 'Rentabiliada por categorias',
      //   'widgetType': widgetType.chart,
      //   'chartType': chartType.doughnut,
      //   'data': this.loadProfitabilityMetrics(),
      //   'options': this.doughnutTheme()
      // },
      // {
      //   'cols': 4,
      //   'rows': 5,
      //   'title': 'Top 5 productos con mayor rentabilidad',
      //   'widgetType': widgetType.dataviewList,
      //   'data': this.loadSalesMetricsList()
      // },
      // {
      //   'cols': 4,
      //   'rows': 3,
      //   'title': 'Utilidad en operación - Valores generales',
      //   'widgetType': widgetType.listnumberindicator,
      //   'data': this.listTypeindicatorsProfitability
      // },
    ];
  //#endregion

  }

  GeneralIndicators(Indicator: number) {
   let monto;
debugger
    let indicatorsnumber = [];

      monto = this.DataIndicators?.filter(f => f.idIndicator == Indicator)
      monto[0].results[0].detailsResults
      .forEach((a, idx) => {
        indicatorsnumber.push({
          id: idx,
          indicator: a.etiqueta,
          value: a.value
        })
      })
    return indicatorsnumber;

  }
   //#region Sales
   loadSalesMetrics() {
    const data = {
      labels: [
        'Categoria 1',
        'Categoria 2',
        'Categoria 3',
        'Categoria 4',
        'Categoria 5',
        'Categoria 6',
        'Categoria 7',
        'Categoria 8',
        'Categoria 9',
        'Categoria 10',
        'Categoria 11',
        'Categoria 12'
      ],
      datasets: [{
        label: 'Monto ($)',
        backgroundColor: '#b0c2f2',
        data: [
          10350,
          9300,
          8800,
          7300,
          7000,
          6750,
          6050,
          5000,
          4500,
          3000,
          2500,
          500
        ]
      }]
    };
    return data;
  }

  loadSalesMetricsList() {
    this.data = this.dataViewModel;
    return this.data;
  }
//#endregion

//#region Productivity
loadSalesBarMetrics(ind:number) {
  debugger
  this.dataSalesBarMetrics = this.DataIndicators?.filter(f => f.idIndicator == ind)
  let data;
  let dataBarMetrics = [];

  if (this.dataSalesBarMetrics?.length)
    this.dataSalesBarMetrics[0].results
      .forEach((a) => {

        dataBarMetrics.push({
          label:a.etiqueta,
          data: a.valuesLabels.map(vl => vl.value),
          backgroundColor: a.colorHex,

        })
      })
    data = {
      labels: this.dataSalesBarMetrics[0].results[0].valuesLabels.map(f => f.label),
      datasets: dataBarMetrics

    }

   return data;
  // const data = {
  //   labels: [
  //     'Semana 1',
  //     'Semana 2',
  //     'Semana 3',
  //     'Semana 4',
  //     'Semana 5'
  //   ],
  //   datasets: [{
  //       label: 'Cantidad enviada',
  //       backgroundColor: '#bbdefb',
  //       data: [
  //         985,
  //         586,
  //         654,
  //         878,
  //         504
  //       ]
  //     },
  //     {
  //       label: 'Cantidad recibida',
  //       backgroundColor: '#68d8d6',
  //       data: [
  //         1085,
  //         486,
  //         604,
  //         978,
  //         554
  //       ]
  //     }
  //   ]
  // };
  // return data;
}

loadProfitabilityBarMetrics() {
  const data = {
    labels: [
      'Semana 1',
      'Semana 2',
      'Semana 3',
      'Semana 4',
      'Semana 5'
    ],
    datasets: [{
        label: 'Cantidad solcitudes creadas',
        backgroundColor: '#b7e4c7',
        data: [
          985,
          586,
          654,
          878,
          504
        ]
      },
      {
        label: 'Cantidad solicitudes enviadas',
        backgroundColor: '#ffafcc',
        data: [
          1085,
          486,
          604,
          978,
          554
        ]
      }
    ]
  };
  return data;
}

loadProductivityMetricsList() {
  this.data = this.dataViewModelAvatar;
  return this.data;
}
//#endregion

//#region Inventory Valuation
loadInventoryValuationMetrics() {
  const data = {
    labels: [
      'Sucursal 1',
      'Sucursal 2',
      'Sucursal 3',
      'Sucursal 4',
      'Sucursal 5'
    ],
    datasets: [{
        label: 'Tiempo programado',
        backgroundColor: '#b0c2f2',
        fill: false,
        borderColor: '#b0c2f2',
        data: [
          86,
          65,
          102,
          70,
          65,
         
        ]
      },
      {
        label: 'Tiempo real',
        backgroundColor: '#d8f8e1',
        fill: false,
        borderColor: '#d8f8e1',
    
        data: [
          102,
          85,
          95,
          85,
          100,
          80
        ]
      }
    ]
  };
  return data;
}
//#endregion


 //#region Themes

 barTheme() {
  const theme = {
    responsive: false,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 0,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false
        }
      }]
    }
  };
  return theme;
}

horizontalBarTheme() {
  const theme = {
    responsive: false,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 0,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false
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

pieTheme() {
  const theme = {
    responsive: false,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 0,
    legend: {
      position: 'right',
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false
        }
      }]
    }
  };
  return theme;
}

doughnutTheme() {
  const theme = {
    responsive: false,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 0,
    legend: {
      position: 'right',
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false
        }
      }]
    }
  };
  return theme;
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

//#endregion

}
