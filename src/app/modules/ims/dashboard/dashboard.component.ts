import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { chartType } from 'src/app/models/common/chart-type';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { Typeindicator } from 'src/app/models/common/type-indicator';
import { widgetType } from 'src/app/models/common/widget-type';
import { Analytics } from 'src/app/models/ims/dashboard/analytics';
import { AnalyticsFilter } from 'src/app/models/ims/dashboard/analytics-filter';
import { AnalyticsIndicatorFilter } from 'src/app/models/ims/dashboard/analytics-indicator-filter';
import { IndicatorModuleFilter } from 'src/app/models/ims/dashboard/indicator-module-filter';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { LoadingService } from '../../common/components/loading/shared/loading.service';
import { DialogsService } from '../../common/services/dialogs.service';
import { AuthService } from '../../login/shared/auth.service';
import { BranchofficeFilter } from '../../masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from '../../masters/branchoffice/shared/services/branchoffice.service';
import { DashboardService } from './shared/service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  Indicators: AnalyticsIndicatorFilter[];
  AnalyticsFilter = new AnalyticsFilter();

  data: any;
  paginator: boolean = false;
  listTypeindicatorsProfitability: Typeindicator[];
  listTypeindicatorsInventoryValuation: Typeindicator[];
  listTypeindicatorsInventoryDay: Typeindicator[];
  dataViewModel: DataviewModel = new DataviewModel();
  dataViewModelAvatar: DataviewModel = new DataviewModel();
  dataViewListModel: DataviewListModel = new DataviewListModel();

  _indicatorModuleFilter = new IndicatorModuleFilter();
  _dashboardDataModule: Analytics[];
  private dialogService: DialogsService;

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

  optionsTime: any[];
  value1: number = 15;
  selection: any;
  branchOfficeList: { label: string; value: number; }[];
  id: any;
  frencuencia: number;
  UpdateDate: any;
  DataIndicators: Analytics[];
  topOperatorData: Analytics[];
  dataViewModelTopOperator: any;

  LossesTemp: any;
  Productivity:any;
  Inventory:any
  Precision:any
  RotationIndex:any
  ProfitInOperation:any

  constructor(private branchofficeService: BranchofficeService, private _Authservice: AuthService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private breadcrumbService: BreadcrumbService,
    public _dashboardService: DashboardService) { }

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






  // }


  async loadFrequency() {
    clearInterval(this.id);
    this.id = setInterval(() => {
      this.loadFrequency();
    }, 60000 * 5);

    const fecha = new Date();
    let mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
    this.frencuencia = this.value1;
    this.UpdateDate = "Su última actualización fue el " + fecha.getDate() + " de " + mesActual + " del " + fecha.getFullYear() + ", a las " + fecha.toLocaleTimeString('en-US');

    this.productivityMetricsData = [];
    this.precisionMetricsData = [];
    this.inventoryValuationMetricsData = [];
    this.salesMetricsData = [];
    this.lossMetricsData = [];
    this.profitabilityMetricsData = [];
    this.LossesTemp = [];
    this.Productivity= [];
    this.Inventory= [];
    this.Precision=[];

    this.RotationIndex=[];
    this.ProfitInOperation=[];
    // this.LossesTemp = [];
    // this.LossesTemp = [];

    // this.Indicators=[];
    // this.DataIndicators=[];
    // this.DataIndicatorsIMS=[];
    // this.DataIndicatorsSRM=[];
    // this.DataIndicatorsTMS=[];

    this.frencuencia = this.value1;
    this.optionsTime = [
      { title: 'Hoy', value: 15 },

      { title: 'Este mes', value: 2 },

      { title: 'Últimos 3 meses', value: 5 },

      { title: 'Últimos 6 meses', value: 7 }

    ];

    this.loadingService.startLoading()
    this.setBreadcrumb();
    this.search();
    this.searchAvartar();
    this.onLoadIndicators();
    await this.IndicatorsIMSxModules()
    await this.fetchTaxData();
    await this.DataLoad();
    this.createDashboard()
    this.loadingService.stopLoading()

    this.titleSales = "Indicadores de rotacion de inventario";
    this.titleLoss = "Indicadores de perdida";
    this.titleProfitability = "Indicadores de utilidad en operación";
    this.titlePrecision = "Indicadores de precisión de inventario";
    this.titleProductivity = "Indicadores de productividad";
    this.titleInventoryValuation = "Valorizado de inventario";

  }


  private setBreadcrumb() {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'IMS' },
      { label: 'Dashboard', routerLink: ['/ims/dashboard'] }
    ]);
  }


  IndicatorsIMSxModules() {
    debugger
    return this._dashboardService.getListIndicatorsModule(this._indicatorModuleFilter).toPromise()
      .then(Indicator => {
        this.Indicators = Indicator

      })
      .catch((err) => {

        this.createDashboard()
      })
  }
  // IndicatorsIMSxModules() {
  //   this.filterIndicatorModule();
  //   this._dashboardService.getListIndicatorsModule(this._indicatorModuleFilter).subscribe((data) => {
  //     this._dashboardDataModule = data; 
  //     return this._dashboardDataModule;     
  //   }, (error: HttpErrorResponse) => {
  //     //this.dialogService.errorMessage('mrp.processing_room.rooms', error?.error?.message ?? 'error_service');    
  //     this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el indicador de balance general." });    
  //   });
  // }


  fetchTaxData() {
    debugger
    this.AnalyticsFilter.indicators = this.Indicators;
    this.AnalyticsFilter.idBranchOffice = +this.selection;

    this.AnalyticsFilter.indicators.forEach(item => {
      item.idFilterType = this.frencuencia
    });

    return this._dashboardService.getAnalyticsIndicators(this.AnalyticsFilter).toPromise()
      .then(data => {
        this.DataIndicators = data

      })
  }

  DataLoad() {
    this.LossesTemp = this.Percentage(150)
    this.Productivity =this.Percentage(171)
    this.Inventory=this.Percentage(172)
    this.Precision=this.Percentage(173)
    this.RotationIndex=this.Percentage(174)
    this.ProfitInOperation=this.Percentage(175)
  }


  // filterIndicatorModule() {
  //   this._indicatorModuleFilter.idModule = 53;//IMS
  //   this._indicatorModuleFilter.idGroupCompany = 1;
  //   this._indicatorModuleFilter.idUser = -1;
  //   this._indicatorModuleFilter.indIndicatorMain = -1;
  //   this._indicatorModuleFilter.idBranchOffice = -1;
  //   this._indicatorModuleFilter.idCompany = -1;
  // }

  search() {
    var count = 0;
    this.branchofficeService.getBranchOfficeList().subscribe((data: Branchoffice[]) => {
      this.branchofficeService._branchOfficeList = data;
      this.dataViewModel.dataviewlist = [];
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
          this.dataViewListModel.name = 'Pedro Perez';
          this.dataViewListModel.mainDescription = 'Operador de inventario';
          this.dataViewListModel.secundaryDescription = 'Jesus Salazar';
          this.dataViewListModel.mainDescriptionSide = '97,45%';
          this.dataViewListModel.secundaryDescriptionSide = '1.145 Und.';
          this.dataViewListModel.image = true;
          this.dataViewListModel.imagePath = 'assets/layout/images/topbar/avatar-gaspar.png';
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
      indicator: 'Total de ventas ($)',
      value: '2,25MM'
    },
    {
      id: 2,
      indicator: 'Total de costos ($)',
      value: '1,50MM'
    },
    {
      id: 3,
      indicator: 'Total de perdidas ($)',
      value: '50,60K'
    },
    {
      id: 4,
      indicator: 'Total de utilidad en operacion ($)',
      value: '699,40K'
    }
    ];

    this.listTypeindicatorsInventoryValuation = [{
      id: 1,
      indicator: 'Total de productos',
      value: '220K'
    },
    {
      id: 2,
      indicator: 'Total de ingredientes',
      value: '1.05K'
    },
    {
      id: 3,
      indicator: 'Total de costos de productos ($)',
      value: '545,65K'
    },
    {
      id: 4,
      indicator: 'Total de costos de ingredientes ($)',
      value: '65,54K'
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

  formatAmount(amount: any) {
    return parseFloat(amount).toLocaleString('es-Ve', { minimumFractionDigits: 0 })
  }
  formatAmount1(amount: any) {
    return parseFloat(amount).toLocaleString('es-Ve', { minimumFractionDigits: 2 })
  }
  createDashboard() {

  
    this.salesMetricsData = [{
     
      'id': 174,
      'cols': 12,
      'rows': 6,
      'title': 'Indice de rotación de inventario',
      'widgetType': widgetType.percentInd,
      'objectiveDescription': 'Objetivo de rotación:',
      'color': this.RotationIndex[0].direccion,
      'currentValue': this.RotationIndex[0].valorActual,
      'target': this.RotationIndex[0].meta,
      'valueVsTarget': this.RotationIndex[0].porcentaje,
      'sublegend': 'Porcentaje de rotación',
      'symbol': '%',
      'image': this.RotationIndex[0].direccion=='mayor'? 'assets/layout/images/dashboard/rateup.svg' :'assets/layout/images/dashboard/ratedown.svg'
    },
    // {
    //   'cols': 12,
    //   'rows': 2,
    //   'title': 'Ventas',
    //   'widgetType': widgetType.targetInd,
    //   'currentValue': '9,6K $',
    //   'target': '10K $',
    //   'objectiveDescription':'Ventas: >=',
    //   'color':'mayor',
    //   'valueVsTarget': '96',
    //   'sublegend': 'Mes de octubre (Pca Supermarket)',
    //   'image': 'assets/layout/images/dashboard/rateup.svg'
    // },
    {
      'id':54,
      'cols': 12,
      'rows': 10,
      'title': 'Indice de rotacion por categoria',
      'widgetType': widgetType.chart,
      'chartType': chartType.bar,
      'data': this.loadData(54),//this.loadSalesMetrics(),
      'options': this.barTheme()
     
    },
    {
     
      'cols': 12,
      'rows': 10,
      'title': 'Top 10 productos con mayor indice de rotacion',
      'widgetType': widgetType.dataviewList,
      'data': this.loadSalesMetricsList(),
      'disabled': true
    },
      // {
      //   'cols': 12,
      //   'rows': 3,
      //   'title': 'Ventas por categorías ($)',
      //   'widgetType': widgetType.chart,
      //   'chartType': chartType.horizontalBar,
      //   'data': this.loadSalesMetrics(),
      //   'options': this.horizontalBarTheme()
      // },
      // {
      //   'cols': 12,
      //   'rows': 5,
      //   'title': 'Top 5 productos mas vendidos',
      //   'widgetType': widgetType.dataviewList,
      //   'data': this.loadSalesMetricsList()
      // },
    ];
    //#endregion

    //#region Dashboard Loss
    this.lossMetricsData = [{
      'id': 150,
      'cols': 12,
      'rows': 6,
      'title': 'Perdidas',
      'widgetType': widgetType.percentInd,
      'objectiveDescription': 'Objetivo de perdidas:',
      'color': this.LossesTemp[0].direccion,
      'currentValue': this.LossesTemp[0].valorActual,
      'target': this.LossesTemp[0].meta,
      'valueVsTarget': this.LossesTemp[0].porcentaje,
      'sublegend': 'Porcentaje de perdida',
      'symbol': '%',
      'image': this.LossesTemp[0].direccion=='mayor'? 'assets/layout/images/dashboard/rateup.svg' :'assets/layout/images/dashboard/ratedown.svg'
   
    },
    {
      'id': 99,
      'cols': 12,
      'rows': 10,
      'title': 'Perdidas por motivos (Und.)',
      'widgetType': widgetType.chart,
      'chartType': chartType.pie,
      'data': this.loadData(99),//this.loadLossMetrics(),
      'options': this.pieTheme()
    },
    {
      'id': 93,
      'cols': 12,
      'rows': 10,
      'title': 'Top 10 productos con mayor perdida',
      'widgetType': widgetType.dataviewList,
      'data': this.searchTopOperator(93)
    },
    ];
    //#endregion

    //#region Dashboard Profitability
    this.profitabilityMetricsData = [{
     
      'id': 175,
      'cols': 12,
      'rows': 6,
      'title': 'Utilidad en operación',
      'widgetType': widgetType.percentInd,
      'objectiveDescription': 'Objetivo de utilidad:',
      'color': this.ProfitInOperation[0].direccion,
      'currentValue': this.ProfitInOperation[0].valorActual,
      'target': this.ProfitInOperation[0].meta,
      'valueVsTarget': this.ProfitInOperation[0].porcentaje,
      'sublegend': 'Porcentaje de utilidad',
      'symbol': '%',
      'image': this.ProfitInOperation[0].direccion=='mayor'? 'assets/layout/images/dashboard/rateup.svg' :'assets/layout/images/dashboard/ratedown.svg'
    },
    {
      'id':52,
      'cols': 12,
      'rows': 10,
      'title': 'Utilidad por categorias ($)',
      'widgetType': widgetType.chart,
      'chartType': chartType.doughnut,
      'data': this.loadData(52),//this.loadProfitabilityMetrics(),
      'options': this.doughnutTheme()
    },
    // {
    //   'cols': 12,
    //   'rows': 5,
    //   'title': 'Top 5 productos con mayor rentabilidad',
    //   'widgetType': widgetType.dataviewList,
    //   'data': this.loadSalesMetricsList()
    // },
    {
      
      'cols': 12,
      'rows': 10,
      'title': 'Utilidad en operación - Valores generales',
      'widgetType': widgetType.listnumberindicator,
      'data': this.listTypeindicatorsProfitability,
      'disabled': true
    },
    ];
    //#endregion

    //#region Dashboard Precision
    this.precisionMetricsData = [{
      
      'id':173,
      'cols': 12,
      'rows': 6,
      'title': 'Precisión de inventario',
      'widgetType': widgetType.percentInd,
      'objectiveDescription': 'Objetivo de precisión:',
      'color': this.Precision[0].direccion,
      'currentValue':this.Precision[0].valorActual,
      'target':this.Precision[0].meta,
      'valueVsTarget': this.Precision[0].porcentaje,
      'sublegend': 'Precisión',
      'symbol': '%',
      'image': this.Precision[0].direccion=='mayor'? 'assets/layout/images/dashboard/rateup.svg' :'assets/layout/images/dashboard/ratedown.svg'
    },
    {
     
      'cols': 12,
      'rows': 10,
      'title': 'Precisión por semama',
      'widgetType': widgetType.chart,
      'chartType': chartType.bar,
      'data': this.loadPrecisionMetrics(),
      'options': this.barTheme(),
      'disabled': true
    },
    {
      
      'cols': 12,
      'rows': 10,
      'title': 'Inventario - Valores generales',
      'widgetType': widgetType.listnumberindicator,
      'data': this.listTypeindicatorsInventoryDay,
      'disabled': true
    },
      // {
      //   'cols': 12,
      //   'rows': 5,
      //   'title': 'Top 5 productos mas vendidos',
      //   'widgetType': widgetType.dataviewList,
      //   'data': this.loadSalesMetricsList()
      // },
    ];
    //#endregion

    //#region Dashboard InventoryValuation
    this.inventoryValuationMetricsData = [{
      'id':52,
      'cols': 12,
      'rows': 6,
      'title': 'Valorizado de inventario',
      'widgetType': widgetType.percentInd,
      'objectiveDescription': 'Objetivo de valorizado:',
      'color': this.Inventory[0].direccion,
      'currentValue':  this.formatAmount1(this.Inventory[0].valorActual),
      'target': this.formatAmount1(this.Inventory[0].meta),
      'valueVsTarget': this.Inventory[0].porcentaje,
      'sublegend': 'Valorizado actual',
      'symbol': '$',
      'image': this.Inventory[0].direccion=='mayor'? 'assets/layout/images/dashboard/rateup.svg' :'assets/layout/images/dashboard/ratedown.svg'
      //'image': 'assets/layout/images/dashboard/rateup.svg'
    },
    {
     
      'cols': 12,
      'rows': 10,
      'title': 'Movimientos de inventario por semana',
      'widgetType': widgetType.chart,
      'chartType': chartType.line,
      'data': this.loadInventoryValuationMetrics(),
      'options': this.lineTheme(),
      'disabled': true,
    },
    {
      
      'cols': 12,
      'rows': 10,
      'title': 'Valorizado de inventario al dia - Valores generales',
      'widgetType': widgetType.listnumberindicator,
      'data': this.listTypeindicatorsInventoryValuation,
      'disabled': true,
    },
      // {
      //   'cols': 12,
      //   'rows': 3,
      //   'title': 'Inventario al dia - Valores generales',
      //   'widgetType': widgetType.listnumberindicator,
      //   'data': this.listTypeindicatorsInventoryDay
      // },
    ];
    //#endregion

    //#region Dashboard Productivity
    this.productivityMetricsData = [{
      
      'id': 52,
      'cols': 12,
      'rows': 6,
      'title': 'Productividad en los conteos de inventario',
      'widgetType': widgetType.percentInd,
      'objectiveDescription': 'Objetivo de productividad: ',
      'color': this.Productivity[0].direccion,
      'currentValue': this.Productivity[0].valorActual,
      'target': this.Productivity[0].meta,
      'valueVsTarget': this.Productivity[0].porcentaje,
      'sublegend': 'Productividad',
      'symbol': '%',
      'image': this.Productivity[0].direccion=='mayor'? 'assets/layout/images/dashboard/rateup.svg' :'assets/layout/images/dashboard/ratedown.svg'
     
    },
    {
     
      'cols': 12,
      'rows': 10,
      'title': 'Conteos planificados vs ejecutados',
      'widgetType': widgetType.chart,
      'chartType': chartType.bar,
      'data': this.loadProductivityMetrics(),
      'options': this.barTheme(),
      'disabled': true,
    },
    {
      'id': 141,
      'cols': 12,
      'rows': 10,
      'title': 'Top 10 operadores con mayor productividad',
      'widgetType': widgetType.dataviewList,
      'data': this.searchTopOperator(141)
    },
    ];
    //#endregion
  }

  //#region Load Data


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


  //#region Sales
  loadSalesMetrics() {
    return {
      labels: [
        'Víveres',
        'Chuchería',
        'Panaderia',
        'Pastelería',
        'Electrónica',
        'Licores',
        'Frulever',
        'Farmacia',
        'Carnicería',
        'Charcutería'
      ],
      datasets: [{
        label: '(N) Veces',
        backgroundColor: '#b0c2f2',
        data: [
          3.25,
          2.15,
          1.14,
          1.68,
          2.01,
          0.95,
          1.23,
          1.05,
          0.36,
          0.99,
          0
        ]
      }]
    };
  }

  loadSalesMetricsList() {
    this.data = {
      imagePathEmpaque: 'assets/layout/images/empaque.png',
      imagePathAvatar: 'assets/layout/images/avatar-unisex.jpg',
      linkTitleIn: true,
      codModal: 0,
      codModalImg: 0,
      dataviewlist: [
        {
          id: 1,
          image: true,
          mainDescription: '7591031001980',
          mainDescriptionSide: '2,52',
          name: 'Harina de maíz precocido pan',
          secundaryDescription: 'Viveres',
          secundaryDescriptionSide: '1ero',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876'
        },
        {
          id: 6,
          image: true,
          mainDescription: '7593524545840',
          mainDescriptionSide: '2,40',
          name: 'Aceite de oliva chacon con ajo en spary 200ml',
          secundaryDescription: 'Viveres',
          secundaryDescriptionSide: '2do',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/aceitechaconcinajojpg_03112021_10:37:53202111031438232368'
        },
        {
          id: 19,
          image: true,
          mainDescription: '7591032154875',
          mainDescriptionSide: '2,38',
          name: 'Cereal con dulce de leche flips 120g',
          secundaryDescription: 'Viveres',
          secundaryDescriptionSide: '3ero',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipsduldeleche3_03112021_10:20:48202111031421191126'
        },
        {
          id: 20,
          image: true,
          mainDescription: '7592458956681',
          mainDescriptionSide: '2,22',
          name: 'Cereal de chocoavellana flips 220g',
          secundaryDescription: 'Viveres',
          secundaryDescriptionSide: '4to',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipschocoave_03112021_10:22:47202111031423181886'
        },
        {
          id: 15,
          image: true,
          mainDescription: '7594587584576',
          mainDescriptionSide: '2,03',
          name: 'Batería fulgor 24mr - 1100 amp.',
          secundaryDescription: 'Viveres',
          secundaryDescriptionSide: '5to',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/bateriafulgor_03112021_11:09:37202111031510073194'
        },
        {
          id: 21,
          image: true,
          mainDescription: '7596589513254',
          mainDescriptionSide: '1,99',
          name: 'Cereal de chocolate flips 220g',
          secundaryDescription: 'Viveres',
          secundaryDescriptionSide: '6to',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipschocolate_03112021_10:20:14202111031420451515'
        },
        {
          id: 6,
          image: true,
          mainDescription: '7593256848686',
          mainDescriptionSide: '1,92',
          name: 'Arroz risotto flora 1kg',
          secundaryDescription: 'Viveres',
          secundaryDescriptionSide: '7mo',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/rissotoflorajpg_03112021_11:05:55202111031506251672'
        },
        {
          id: 7,
          image: true,
          mainDescription: '7596485765425',
          mainDescriptionSide: '1,91',
          name: 'Harina d/trigo rey del norte 45kg',
          secundaryDescription: 'Viveres',
          secundaryDescriptionSide: '8vo',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harinareynortejpg_03112021_10:59:54202111031500244142'
        },
        {
          id: 8,
          image: true,
          mainDescription: '7596586589542',
          mainDescriptionSide: '1,89',
          name: 'Aceite de oliva  monini  extra virgen 500ml',
          secundaryDescription: 'Viveres',
          secundaryDescriptionSide: '9no',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/aceitemonini_03112021_10:56:40202111031457108921'
        },
        {
          id: 9,
          image: true,
          mainDescription: '7596587458135',
          mainDescriptionSide: '1,88',
          name: 'Mezcla la lucha para panqueca 500g',
          secundaryDescription: 'Viveres',
          secundaryDescriptionSide: '10mo',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/panquecaslalauchajpg_03112021_11:02:22202111031502531188'
        },

      ]
    }
    return this.data;
  }

  loadLossMetricsList() {
    this.data = {
      imagePathEmpaque: 'assets/layout/images/empaque.png',
      imagePathAvatar: 'assets/layout/images/avatar-unisex.jpg',
      linkTitleIn: true,
      codModal: 0,
      codModalImg: 0,
      dataviewlist: [
        {
          id: 1,
          image: true,
          mainDescription: '7591031001980',
          mainDescriptionSide: '3256 Und.',
          name: 'Harina de maíz precocido pan',
          secundaryDescription: 'Hurto interno',
          secundaryDescriptionSide: '2990$',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876'
        },
        {
          id: 6,
          image: true,
          mainDescription: '7593524545840',
          mainDescriptionSide: '2540 Und.',
          name: 'Aceite de oliva chacon con ajo en spary 200ml',
          secundaryDescription: 'Hurto externo',
          secundaryDescriptionSide: '2732$',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/aceitechaconcinajojpg_03112021_10:37:53202111031438232368'
        },
        {
          id: 19,
          image: true,
          mainDescription: '7591032154875',
          mainDescriptionSide: '2450 Und.',
          name: 'Cereal con dulce de leche flips 120g',
          secundaryDescription: 'Hurto externo',
          secundaryDescriptionSide: '2654$',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipsduldeleche3_03112021_10:20:48202111031421191126'
        },
        {
          id: 20,
          image: true,
          mainDescription: '7592458956681',
          mainDescriptionSide: '2115 Und.',
          name: 'Cereal de chocoavellana flips 220g',
          secundaryDescription: 'Hurto interno',
          secundaryDescriptionSide: '2652$',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipschocoave_03112021_10:22:47202111031423181886'
        },
        {
          id: 15,
          image: true,
          mainDescription: '7594587584576',
          mainDescriptionSide: '1998 Und.',
          name: 'Batería fulgor 24mr - 1100 amp.',
          secundaryDescription: 'Hurto en traslado',
          secundaryDescriptionSide: '2524$',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/bateriafulgor_03112021_11:09:37202111031510073194'
        },
        {
          id: 21,
          image: true,
          mainDescription: '7596589513254',
          mainDescriptionSide: '1765 Und.',
          name: 'Cereal de chocolate flips 220g',
          secundaryDescription: 'Mercancia dañada',
          secundaryDescriptionSide: '2511$',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipschocolate_03112021_10:20:14202111031420451515'
        },
        {
          id: 6,
          image: true,
          mainDescription: '7593256848686',
          mainDescriptionSide: '1522 Und.',
          name: 'Arroz risotto flora 1kg',
          secundaryDescription: 'Mercancia dañada',
          secundaryDescriptionSide: '2425$',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/rissotoflorajpg_03112021_11:05:55202111031506251672'
        },
        {
          id: 7,
          image: true,
          mainDescription: '7596485765425',
          mainDescriptionSide: '1458 Und.',
          name: 'Harina d/trigo rey del norte 45kg',
          secundaryDescription: 'Hurto externo',
          secundaryDescriptionSide: '2325$',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harinareynortejpg_03112021_10:59:54202111031500244142'
        },
        {
          id: 8,
          image: true,
          mainDescription: '7596586589542',
          mainDescriptionSide: '1457 Und.',
          name: 'Aceite de oliva  monini  extra virgen 500ml',
          secundaryDescription: 'Mercancia dañada en traslado',
          secundaryDescriptionSide: '2324$',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/aceitemonini_03112021_10:56:40202111031457108921'
        },
        {
          id: 9,
          image: true,
          mainDescription: '7596587458135',
          mainDescriptionSide: '1325 Und.',
          name: 'Mezcla la lucha para panqueca 500g',
          secundaryDescription: 'Hurto consignación',
          secundaryDescriptionSide: '2250$',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/panquecaslalauchajpg_03112021_11:02:22202111031502531188'
        },

      ]
    }
    return this.data;
  }

  //#endregion

  //#region Loss
  loadLossMetrics() {
    return {
      labels: ['Hurto interno', 'Hurto en traslado', 'Hurto consignacion', 'Hurto externo', 'Merma', 'Mercancia dañada', 'Mercancia dañada en traslado', 'Faltante en container'],
      datasets: [{
        label: 'Monto ($)',
        data: [250, 235, 230, 5, 145, 252, 65, 96],
        backgroundColor: [
          '#CAF0F8',
          '#ADE8F4',
          '#90E0EF',
          '#48CAE4',
          '#00B4D8',
          '#0096C7',
          '#0081a7',
          '#0077B6'
        ],
        hoverBackgroundColor: [
          '#cddafd',
          '#cddafd',
          '#cddafd',
          '#cddafd',
          '#cddafd',
          '#cddafd',
          '#cddafd',
          '#cddafd'
        ]
      }]
    };
  }

  //#endregion

  //#region Profitability
  loadProfitabilityMetrics() {
    return {
      labels: [
        'Víveres',
        'Chuchería',
        'Panaderia',
        'Pastelería',
        'Electrónica',
        'Licores',
        'Frulever',
        'Farmacia',
        'Carnicería',
        'Charcutería',
        'Electrodomésticos',
        'Cuidado personal'

      ],
      datasets: [{
        data: [2505, 2354, 2300, 500, 1454, 2524, 6565, 9614, 6584, 985, 2015, 654],
        backgroundColor: [
          '#8ecae6',
          '#219ebc',
          '#a8dadc',
          '#48cae4',
          '#ade8f4',
          '#b7e4c7',
          '#74c69d',
          '#f5cac3',
          '#ffafcc',
          '#e5b3fe',
          '#dbcdf0',
          '#9c89b8'
        ]
      }]
    };
  }

  //#endregion

  //#region Precision
  loadPrecisionMetrics() {
    return {
      labels: [
        'Semana 1',
        'Semana 2',
        'Semana 3',
        'Semana 4',
        'Semana 5',
        'Semana 6',
        'Semana 7',
        'Semana 8'
      ],
      datasets: [
        {
          label: 'Porcentaje de precisión %',
          backgroundColor: '#ffccd5',
          data: [
            98.78,
            97.25,
            99.06,
            99.10,
            98.86,
            96.43,
            98.95,
            97.45,
            95,
          ]
        }
      ]
    };
  }

  //#endregion

  //#region Inventory Valuation
  loadInventoryValuationMetrics() {
    return {
      labels: [
        'Semana 1',
        'Semana 2',
        'Semana 3',
        'Semana 4',
        'Semana 5',
        'Semana 6',
        'Semana 7',
        'Semana 8'
      ],
      datasets: [{
        label: 'Entradas',
        backgroundColor: '#b0c2f2',
        fill: false,
        borderColor: '#b0c2f2',
        tension: .4,
        data: [
          10350,
          11500,
          8800,
          7300,
          9560,
          7485,
          5045,
          8000,
          6000,
          2000
        ]
      },
      {
        label: 'Salidas',
        backgroundColor: '#d8f8e1',
        fill: false,
        borderColor: '#d8f8e1',
        tension: .4,
        data: [
          12350,
          8500,
          10000,
          9000,
          7350,
          8350,
          6550,
          9550,
          6000,
          2000
        ]
      }
      ]
    };
  }

  //#endregion

  //#region Productivity
  loadProductivityMetrics() {
    return {
      labels: [
        'Semana 1',
        'Semana 2',
        'Semana 3',
        'Semana 4',
        'Semana 5'
      ],
      datasets: [{
        label: 'Conteos planificados',
        backgroundColor: '#bbdefb',
        data: [
          985,
          586,
          654,
          878,
          504
        ]
      },
      {
        label: 'Conteos ejecutados',
        backgroundColor: '#68d8d6',
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
  }

  searchTopOperator(ind: number) {
    debugger
    this.topOperatorData = this.DataIndicators?.filter(f => f.idIndicator == ind)
    let dataTopOperator = [];
    if (this.topOperatorData?.length)
      this.topOperatorData[0].results
        .forEach((a, idx) => {
          dataTopOperator.push({
            id: a.value,
            indPerson: 2,
            image: a.etiqueta == "" ? false : true,
            mainDescription: a.etiqueta == "" ? "No se encontraron resultados." : ind==141?"": a.valores.valor4,
            mainDescriptionSide: a.etiqueta == "" ? " " :ind==141? a.valores.valor5 + '%': a.valores.valor1 + ' Unds.',
            name: a.etiqueta,
            secundaryDescription: ind==141?"": a.valores.valor3,
            secundaryDescriptionSide: a.etiqueta == "" ? " " : ind==141? a.valores.valor1 + ' Unds.':a.valores.valor2 +'$',
            //imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Orlando-D\'-Leo¦ün.png202110131429240173'
            imagePath: a.campoURL ? 'https://gruposigo1.s3.amazonaws.com/' + a.campoURL : 'https://ui-avatars.com/api/?name=' + a.etiqueta + '&background=17a2b8&color=fff&rounded=true&bold=true&size=200'
           // imagePath: 'https://ui-avatars.com/api/?name=' + a.etiqueta + '&background=17a2b8&color=fff&rounded=true&bold=true&size=200'
          })

        })

    this.dataViewModelTopOperator = {
      imagePathEmpaque: 'assets/layout/images/empaque.png',
      imagePathAvatar: 'assets/layout/images/topbar/avatar-cayla.png',
      linkTitleIn: true,
      codModal: 0,
      codModalImg: 0,
      dataviewlist: dataTopOperator
    }
    return this.dataViewModelTopOperator
  }


  loadData(ind: number) {

    this.data = this.DataIndicators?.filter(f => f.idIndicator == ind)
    let dataReturn;
    let dataTemp = [];
    let etiqueta=ind==54?'(N) Veces' : 'Departamentos($)'
    if (this.data?.length)
      this.data[0].results
        .forEach((a) => {
          dataTemp
            .push({
              label:etiqueta,
              data: a.detailsResults.map(vl => vl.value),
              backgroundColor: a.detailsResults.map(vl => vl.colorHex),
            })

        })
    dataReturn = {
      labels: this.data[0].results[0].detailsResults.map(f => f.etiqueta),
      datasets: dataTemp

    }
    return dataReturn;
  }


  loadProductivityMetricsList() {
    this.data = {
      imagePathEmpaque: 'assets/layout/images/empaque.png',
      imagePathAvatar: 'assets/layout/images/avatar-unisex.jpg',
      linkTitleIn: true,
      codModal: 0,
      codModalImg: 0,
      dataviewlist: [
        {
          id: 1,
          image: true,
          mainDescription: 'Director General Norkut',
          mainDescriptionSide: '102%',
          name: 'Orlando D\'Leon',
          secundaryDescription: '',
          secundaryDescriptionSide: '13956 Und.',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Orlando-D\'-Leo¦ün.png202110131429240173'
        },
        {
          id: 6,
          image: true,
          mainDescription: 'Director de Operaciones Norkut',
          mainDescriptionSide: '100%',
          name: 'Joniz Gonzalez',
          secundaryDescription: '',
          secundaryDescriptionSide: '12548 Und.',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Joniz-Gonzalez.png202110141531414763'
        },
        {
          id: 19,
          image: true,
          mainDescription: 'Team Leader - Consultor de Desarrollo',
          mainDescriptionSide: '100%',
          name: 'Randy Caraballo',
          secundaryDescription: '',
          secundaryDescriptionSide: '11325 Und.',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Randy-Caraballo.png202110141532080179'
        },
        {
          id: 20,
          image: true,
          mainDescription: 'Team Leader - Consultor de Desarrollo',
          mainDescriptionSide: '99,95%',
          name: 'Madelyn Leos',
          secundaryDescription: '',
          secundaryDescriptionSide: '10524 Und.',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Madelyn-Leos.png202110141529477524'
        },
        {
          id: 15,
          image: true,
          mainDescription: 'Lider de Proyectos - PMO',
          mainDescriptionSide: '99,56%',
          name: 'Amaranta Hernandez',
          secundaryDescription: '',
          secundaryDescriptionSide: '9958 Und.',
          imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Amaranta-hernandez.png202110141530252611'
        },
      ]
    }
    return this.data;
  }

  //#endregion

  //#endregion

  //#region Themes

  barTheme() {
    return {
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
  }

  horizontalBarTheme() {
    return {
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
  }

  pieTheme() {
    return {
      responsive: false,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 0,
      legend: {
        display: true,
        position: 'right'
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
  }

  doughnutTheme() {
    return {
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
  }

  lineTheme() {
    return {
      responsive: false,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 0,
      // plugins: {
      //   legend: {
      //     labels: {
      //       color: '#495057'
      //     }
      //   }
      // },
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
  }

  //#endregion

}
