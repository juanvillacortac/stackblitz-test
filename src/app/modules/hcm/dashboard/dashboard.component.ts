import { Component, OnInit } from '@angular/core';
import { id } from 'date-fns/locale';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import {BaseModel} from 'src/app/models/common/BaseModel';
import { chartType } from 'src/app/models/common/chart-type';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { Typeindicator } from 'src/app/models/common/type-indicator';
import { widgetType } from 'src/app/models/common/widget-type';
import { ResultAnalytics } from 'src/app/models/financial/AnalyticFinancial';
import { AnalyticHCMFilter, AnalyticsHCM, IndicatorAnalyticsFilter, IndicatorsHCMxModulesFilter } from 'src/app/models/hcm/analytics-hcm';
import { LoadingService } from '../../common/components/loading/shared/loading.service';
import { CurrentOfficeSelectorService } from '../../layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { HCMDashboardService } from '../shared/services/analytics-hcm.service.';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  indicatorsnumberEmployee: Typeindicator[];
  indicatorsnumberHiring: Typeindicator[];
  indicatorsnumberAbsenteeism: Typeindicator[];
  indicatorsnumberPayroll: Typeindicator[];
  indicatorsnumberConcept: Typeindicator[];
  dashboardData: any;
  dashboardDataEmployee: any;
  dashboardDataHiring: any;
  dashboardDataTurnover:any;
  dashboardDataAbsenteeism: any;
  dashboardDataJobPosition: any;
  dashboardDataMovement: any;
  displayedColumns: any[] = [];
  titleout1: any;
  titleout2: any;
  titleout3: any;
  titleout4: any;
  titleout5: any;
  titleout6: any;
  titleout7: any;

  dataJobPosition: any;
  dataSubsidiary: any;
  paginator: boolean = false;
  dataViewModelJobPosition: DataviewModel = new DataviewModel();
  dataViewModelSubsidiary: DataviewModel = new DataviewModel();
  dataViewListModelJobPosition: any;
  dataViewListModelSubsidiary: any;
  AnalyticHCMFilter = new AnalyticHCMFilter();
  IndicatorsHCMxModulesFilter = new IndicatorsHCMxModulesFilter();
  Indicators: IndicatorAnalyticsFilter[];
  behaviorGenderCount: AnalyticsHCM[]=[];
  topOfficeBranchMove: AnalyticsHCM[]=[];
  topJobPositionProm: AnalyticsHCM[]=[];
  totalCountEmployee: AnalyticsHCM[]=[];
  totalCountEmployeeOB: AnalyticsHCM[]=[];
  countEmployeexStatus: AnalyticsHCM[]=[];
  totalCountHiring: AnalyticsHCM[]=[];
  totalCountTurnover:AnalyticsHCM[]=[];
  totalCountIncident:AnalyticsHCM[]=[];
  countIncidentxGroup: AnalyticsHCM[]=[];
  topTurnoverMotives: AnalyticsHCM[]=[];
  countGenerationxOB: AnalyticsHCM[]=[];
  employeeProfileOB:DataviewListModel[]=[];
  employeeProfileJP:DataviewListModel[]=[];
  behaviorDashboard: AnalyticsHCM[]=[];
  optionsTime: any[];
  value1: number = 1;
  labelResponse: string = "";
  constructor(
      public _hcmDashboardService: HCMDashboardService,
      private messageService: MessageService,
      private loadingService: LoadingService,
      private _selectorService: CurrentOfficeSelectorService, //Codigo para seleccionar Compañia/Sucursal
      private breadcrumbService: BreadcrumbService,
  ) {
    this._selectorService.setSelectorType(EnumOfficeSelectorType.company) //Selecciona la compañia en dropdown

    this.breadcrumbService.setItems([
        { label: 'HCM' },
        { label: 'Dashboard', routerLink: ['/hcm/dashboard'] }
      ]);
  }

  ngOnInit(): void {

    this.IndicatorsHCMxModules().then(()=>this.fetchDashboardData()).then(()=>
    this.createDashboard()
    )
   // this.loadDataTopJobPosition();
   // this.loadDataTopSubsidiary();

   this.optionsTime = [
    {title: 'Este mes', value: 1},
    {title: 'Últimos 3 meses', value: 2},
    {title: 'Últimos 6 meses', value: 3}
];

    this.indicatorsnumberEmployee = [
        { id: 1,indicator: 'Altas',
        value:'50'},
        { id: 2,indicator: 'Bajas',
        value:'10'},
    ];



        this.indicatorsnumberHiring = [
            { id: 1,indicator: 'Fijas',value:'65'},
            { id: 2,indicator: 'Temporales',value:'59'},
            { id: 1,indicator: 'Fijas ocupadas',value:'28'},
            { id: 2,indicator: 'Temporales ocupadas',value:'48'},
        ];




    this.indicatorsnumberAbsenteeism = [
        { id: 1,indicator: 'Justificadas',value:'50'},
        { id: 2,indicator: 'Injustificadas',value:'20'},
    ];

    this.indicatorsnumberPayroll= [
        { id: 1,indicator: 'Directiva',value:'3K $', value2:'15K BsD'},
        { id: 2,indicator: 'Ejecutiva',value:'2K $', value2:'10K BsD'},
        { id: 3,indicator: 'Empleado',value:'7K $', value2:'35K BsD'},
        { id: 4,indicator: 'Obrero',value:'3K $', value2:'15K BsD'},
    ];

    this.indicatorsnumberConcept= [
        { id: 1,indicator: 'Salario',value:'7K $', value2:'35K BsD'},
        { id: 2,indicator: 'Cestaticket',value:'1K $', value2:'5K BsD'},
        { id: 3,indicator: 'Sigo Créditos',value:'3K $', value2:'15K BsD'},
        { id: 4,indicator: 'Bono de retencion',value:'4K $', value2:'20K BsD'},
    ];

    this.titleout1= 'Empleados';
    this.titleout2= 'Contratación';
    this.titleout3= 'Ausentismo';
    this.titleout4= 'Rotación';
    this.titleout5= 'Sucursales';
    this.titleout6= 'Nómina';
    this.titleout7= 'Default';

    //this.createDashboard();
  }

  LoadIndicators(onLoad?: () => void) {
    if (onLoad) {
      onLoad()
    }

  }

  fetchDashboardData() {
    this.AnalyticHCMFilter.indicators =this.Indicators
    return this._hcmDashboardService.getIndicatorsHCM(this.AnalyticHCMFilter).toPromise()
      .then(indGraph => {
        this.behaviorGenderCount = indGraph.filter(x=>x.idIndicator==11 && x.idFilterType==1)
        this.topOfficeBranchMove = indGraph.filter(x=>x.idIndicator==95 && x.idFilterType==2)
        this.topJobPositionProm = indGraph.filter(x=>x.idIndicator==94 && x.idFilterType==2)
        this.totalCountEmployee = indGraph.filter(x=>x.idIndicator==2 && x.idFilterType==1)
        this.totalCountEmployeeOB = indGraph.filter(x=>x.idIndicator==3 && x.idFilterType==1)
        this.countEmployeexStatus = indGraph.filter(x=>x.idIndicator==71 && x.idFilterType==2)
        this.totalCountHiring = indGraph.filter(x=>x.idIndicator==84 && x.idFilterType==1)
        this.totalCountTurnover = indGraph.filter(x=>x.idIndicator==115 && x.idFilterType==2)
        this.countIncidentxGroup = indGraph.filter(x=>x.idIndicator==139 && x.idFilterType==2)
        this.totalCountIncident = indGraph.filter(x=>x.idIndicator==138 && x.idFilterType==2)
        this.topTurnoverMotives = indGraph.filter(x=>x.idIndicator==116 && x.idFilterType==2)
        this.countGenerationxOB = indGraph.filter(x=>x.idIndicator==127 && x.idFilterType==2)

        this.labelResponse = indGraph[0].result[0].etiqueta

      })
  }

  IndicatorsHCMxModules() {

    return this._hcmDashboardService.getIndicatorsHCMxModules(this.IndicatorsHCMxModulesFilter).toPromise()
      .then(Indicator => {
        this.Indicators = Indicator

      })


  }

  Indicatorsnumber( data:any ){
    //let tempTotal=this.totalCountTurnover
    let tempTotal=[]
    data[0].result[0].valuesLabels.forEach(item => {

        tempTotal.push(
            {id: 1,
            indicator:item.labels,
            value:item.value
        }
        )
    });

    return tempTotal
}




  createDashboard() {
    //Empleados
    this.dashboardDataEmployee = [
        { 'x': 0,  'y': 0, 'cols': 4, 'rows': 2, 'title': 'Conteo', 'nroModal': 2, 'widgetType': widgetType.targetInd,
        'currentValue': this.totalCountEmployee[0].result.map(x => x.totalValue),
        'sublegend': this.totalCountEmployee[0].result[0].details.map(x => x.labelDet),
        'caption': 'Rentabilidad = 25%',
        'image': 'assets/layout/images/dashboard/coworkers.jpg' },
        { 'x': 0,  'y': 3, 'cols': 4, 'rows': 3, 'title': 'Conteo de empleados por sucursal', 'widgetType': widgetType.chart,
        'chartType': chartType.bar,
         'data': this.loadData7() ,
        'options': this.applyLightTheme() },
/*         {  'x': 0,  'y': 7, 'cols': 4, 'rows': 2, 'title': 'Movimientos',  'widgetType': widgetType.listnumberindicator,
        'currentValue': 25,
        'targetValue': 10,
        'legend': 'Ordenes' ,
        'data': this.indicatorsnumberEmployee ,
        'nroModal':3, 'icon': 'pi-arrow-right'}, */ //Se comenta de manera temporal, falta consulta BD
        { 'x': 0,  'y': 8, 'cols': 4, 'rows': 3, 'title': 'Conteo por género', 'widgetType': widgetType.chart,
        'chartType': chartType.doughnut, 'data': this.loadData6() , 'options': this.applyLightTheme() },
    ];

    //Contratacion
    this.dashboardDataHiring = [
        { 'x': 0,  'y': 0, 'cols': 4, 'rows': 2, 'title': 'Plazas', 'widgetType': widgetType.percentInd,
        'objectiveDescription':'Objetivo:',
        'color':'menor',
        'currentValue': this.totalCountHiring[0].result.map(x => x.currentValue),
        'target': this.totalCountHiring[0].result.map(x => x.targetValue),
        'valueVsTarget': this.totalCountHiring[0].result.map(x => x.percentValue),
        'sublegend': 'Indice de plazas',
        'image': 'assets/layout/images/dashboard/hiring.svg' },
        { 'x': 0,  'y': 3, 'cols': 4, 'rows': 3, 'title': 'Ingresos por sucursal', 'plusVisible': 'true', 'widgetType': widgetType.chart,
        'chartType': chartType.bar,
        'data': this.loadData10() ,
        'options': this.applyLightTheme() },
        /* Se comenta de manera temporal */
/*         {  'x': 0,  'y': 6, 'cols': 4, 'rows': 3, 'title': 'Plazas programadas vs ocupadas para la empresa', 'nroModal':10, 'widgetType': widgetType.listnumberindicator,
        'currentValue': 25,'targetValue': 10, 'legend': 'Ordenes' ,'data': this.indicatorsnumberHiring , 'icon': 'pi-arrow-right'}, */
        { 'x': 0,  'y': 9, 'cols': 4, 'rows': 3, 'title': 'Ingresos por generación', 'widgetType': widgetType.chart,
        'chartType': chartType.doughnut, 'data': this.loadData11() , 'options': this.applyLightTheme()/*, 'value': '1000', 'caption': 'Ingresos'*/},
    ];

    //Cambio de cargo
    this.dashboardDataJobPosition = [
        {
            'x': 0,
            'y': 0,
            'cols': 12,
            'rows': 7.2,
            'title': 'Últimas promociones de cargo',
            'widgetType': widgetType.dataviewList,
            'data': this.loadDataTopJobPosition(),
            'options': this.applyLightTheme()
        }, //Se mudó de manera temporal a sección de Sucursales
        {
            'x': 0,
            'y': 0,
            'cols': 12,
            'rows': 7.2,
            'title': 'Últimos cambios de sucursal',
            //'nroModal':11,
            'widgetType': widgetType.dataviewList,
            'data': this.loadDataTopSubsidiary(),
            'options': this.applyLightTheme()
        },
        /* -----Se comenta cuando se liberen las funcionalidades que alimenten los origenes de datos---- */
/*                 { 'x': 0,  'y': 11, 'cols': 4, 'rows': 2.6, 'title': 'Situación trabajadores', 'nroModal':14,  'widgetType': widgetType.chart,
        'chartType': chartType.bar,
        'data': this.loadDataEmployeeSituation() ,
        'options': this.applyLightTheme() }, */
        { 'x': 0,  'y': 11, 'cols': 3, 'rows': 2.4, 'title': 'Empleados por generación', 'widgetType': widgetType.chart,
        'chartType': chartType.bar,
        'data': this.loadDataGeneration() ,
        'options': this.applyLightTheme() },
    ];

    //Ausentismo
    this.dashboardDataAbsenteeism = [
        { 'x': 0,  'y': 0, 'cols': 4, 'rows': 2, 'title': 'Tasa de ausentismo', 'widgetType': widgetType.percentInd,
        'objectiveDescription':'Objetivo:',
        'color':'mayor',
        'currentValue': 25.00, 'target': 5.00, 'valueVsTarget': 500.00, 'sublegend': 'Niveles de ausentismo por empresas', 'image': 'assets/layout/images/dashboard/rateup.svg' },
        { 'x': 0,  'y': 3, 'cols': 4, 'rows': 3.5, 'title': 'Principales motivos de ausencia', 'widgetType': widgetType.chart,
        'chartType': chartType.bar, 'data': this.loadData9() , 'options': this.applyLightTheme() },
        {  'x': 0,  'y': 7, 'cols': 4, 'rows': 2, 'title': 'Causas de ausentismo',  'widgetType': widgetType.listnumberindicator,
        'currentValue': 25,'targetValue': 10, 'legend': 'Ordenes' ,'data': this.indicatorsnumberAbsenteeism ,'nroModal':3, 'icon': 'pi-arrow-right'},
    ];

    //Rotacion
    this.dashboardDataTurnover = [
        { 'x': 0,  'y': 0, 'cols': 4, 'rows': 2, 'title': 'Indicador de rotacion de personal', 'widgetType': widgetType.percentInd,
        'objectiveDescription':'Objetivo:',
        'color':'mayor',
        'currentValue': 25.00, 'target': 5.00, 'valueVsTarget': 500.00, 'sublegend': 'Indice de rotacion por empresas', 'image': 'assets/layout/images/dashboard/rateup.svg' },
        { 'x': 0,  'y': 3, 'cols': 4, 'rows': 3.5, 'title': 'Principales motivos de rotación de personal', 'widgetType': widgetType.chart,
        'chartType': chartType.bar, 'data': this.loadDataTurnoverMotives(),  'options': this.applyLightTheme() },
        {  'x': 0,  'y': 7, 'cols': 4, 'rows': 2, 'title': 'Movimientos',  'widgetType': widgetType.listnumberindicator,
        'currentValue': 25,'targetValue': 10, 'legend': 'Ordenes' ,'data': this.Indicatorsnumber(this.totalCountTurnover) ,'nroModal':3, 'icon': 'pi-arrow-right'},
    ];

    //Cambios de sucursal
    this.dashboardDataMovement = [
        { 'x': 0,  'y': 0, 'cols': 4, 'rows': 2, 'title': 'Costo estimado mensual', 'widgetType': widgetType.targetInd,
        'currentValue': '15K $',
        'target': '75K BsD',
        'objectiveDescription':'Conversión:',
        'sublegend': '',
        'caption': 'Rentabilidad = 25%',
        'image': 'assets/layout/images/dashboard/nomina-icon.png',
        'symbol': 'K$',
    },
        {  'x': 0,  'y': 13, 'cols': 4, 'rows': 3.3, 'title': 'Costo por clase de nómina',  'widgetType': widgetType.listnumberindicator,
        'currentValue': 25,'targetValue': 10, 'legend': 'Ordenes' ,'data': this.indicatorsnumberPayroll , 'icon': 'pi-arrow-right'},
        {  'x': 0,  'y': 13, 'cols': 4, 'rows': 3.3, 'title': 'Costo por concepto',  'widgetType': widgetType.listnumberindicator,
        'currentValue': 25,'targetValue': 10, 'legend': 'Ordenes' ,'data': this.indicatorsnumberConcept , 'icon': 'pi-arrow-right'},
        {
            'x': 0,
            'y': 0,
            'cols': 12,
            'rows': 7.2,
            'title': 'Últimas promociones de cargo',
            'widgetType': widgetType.dataviewList,
            'data': this.loadDataTopJobPosition(),
            'options': this.applyLightTheme()
        }, //Se muda de manera temporal a sección de Sucursales
/*         { 'x': 0,  'y': 17, 'cols': 3, 'rows': 3.1, 'title': 'Incidencias generadas por motivo', 'widgetType': widgetType.chart,
        'chartType': chartType.bar,
         'data': this.loadDataIncident(),
        'options': this.applyLightTheme() }, */
    ];
  }

  loadDataTopJobPosition() {
     this.searchJobPosition();
    this.dataJobPosition = this.dataViewModelJobPosition;
    return this.dataJobPosition;
  }

  loadDataTopSubsidiary() {
     this.searchSubsidiary();
    this.dataSubsidiary = this.dataViewModelSubsidiary;
    return this.dataSubsidiary;
  }

  searchJobPosition(){
    this.topJobPositionProm[0].result
    .forEach((a,idx) => {

        this.employeeProfileJP.push(

                {   id: a.identificator,
                    image: true,
                    mainDescription:'',
                    mainDescriptionSide: a.valuesData.valueData3,
                    name: a.etiqueta,
                    secundaryDescription:'',
                    secundaryDescriptionSide: 'Anterior: ' + a.valuesData.valueData2,
                    imagePath: a.labelUrl? 'https://gruposigo1.s3.amazonaws.com/'+a.labelUrl:'https://ui-avatars.com/api/?name='+a.valuesData.valueData5+'&background=3bf7e4&color=17a2b8&rounded=true&bold=true&size=200'}
        )

    })

    this.dataViewModelJobPosition = {
      imagePathEmpaque: 'assets/layout/images/empaque.png',
      imagePathAvatar:'assets/layout/images/topbar/avatar-cayla.png',
      linkTitleIn:true,
      codModal:2,
      codModalImg: 1,
      dataviewlist:this.employeeProfileJP
    }

  }


searchSubsidiary(){

    this.topOfficeBranchMove[0].result

    .forEach((a,idx) => {

        this.employeeProfileOB.push(

                {   id: a.identificator,
                    image: true,
                    mainDescription:'',
                    mainDescriptionSide: a.valuesData.valueData3,
                    name: a.etiqueta,
                    secundaryDescription:'',
                    secundaryDescriptionSide: 'Anterior: ' + a.valuesData.valueData2,
                    imagePath: a.labelUrl? 'https://gruposigo1.s3.amazonaws.com/'+a.labelUrl:'https://ui-avatars.com/api/?name='+a.valuesData.valueData5+'&background=3bf7e4&color=17a2b8&rounded=true&bold=true&size=200'}
        )

    })

  this.dataViewModelSubsidiary = {
    imagePathEmpaque: 'assets/layout/images/empaque.png',
    imagePathAvatar:'assets/layout/images/topbar/avatar-cayla.png',
    linkTitleIn:true,
    codModal:2,
    codModalImg: 1,
    dataviewlist:this.employeeProfileOB

  }

}


  loadDataGeneration() {
      const data = {
        labels: this.countGenerationxOB[0].result.map(x => x.etiqueta),
        datasets: [
            {
                label: 'Baby boomers',
                backgroundColor: '#ECFEAA',
                data: [5, 2, 3, 4]
            },
            {
                label: 'Generación X',
                backgroundColor: '#EFBDC8',
                data: [10, 15, 12, 6]
            },
            {
                label: 'Generación Z',
                backgroundColor: '#ADECFF',
                data: [7, 9, 8, 10]
            },
            {
                label: 'Millenials',
                backgroundColor: '#3bf7e4',
                data: [15, 12, 10, 20]
            }
        ]
    };
    return data;
  }
  loadDataEmployeeSituation() {
    const data = {
      labels: this.countGenerationxOB[0].result.map(x => x.etiqueta),
      datasets: [
          {
              label: 'Vacaciones',
              backgroundColor: '#ECFEAA',
              data: [5, 2, 3, 4]
          },
          {
              label: 'Reposo',
              backgroundColor: '#EFBDC8',
              data: [10, 15, 12, 6]
          },
          {
              label: 'Día descanso',
              backgroundColor: '#ADECFF',
              data: [7, 9, 8, 10]
          },
          {
              label: 'Ausencia justificada',
              backgroundColor: '#3bf7e4',
              data: [15, 12, 10, 20]
          },
          {
            label: 'Ausencia no justificada',
            backgroundColor: '#b0c2f2',
            data: [10, 15, 12, 6]
        }
      ]
  };
  return data;
}
  loadData2() {
    const data = {
      labels: ['A', 'B', 'C'],
      datasets: [
          {
              data: [300, 50, 100],
              backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56'
              ],
              hoverBackgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56'
              ]
          }]
      };
  return data;
  }
  loadData3() {
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'First Dataset',
              backgroundColor: '#42A5F5',
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: 'Second Dataset',
              backgroundColor: '#FFA726',
              data: [28, 48, 40, 19, 86, 27, 90]
          }
      ]
  };
  return data;
  }
  loadData4() {
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'First Dataset',
              backgroundColor: '#FFA726',
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: 'Second Dataset',
              backgroundColor: '#42A5F5',
              data: [28, 48, 40, 19, 86, 27, 90]
          }
      ]
  };
  return data;
  }
  loadData5() {
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'First Dataset',
              backgroundColor: '#42A5F5',
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: 'Second Dataset',
              backgroundColor: '#FFA726',
              data: [28, 48, 40, 19, 86, 27, 90]
          }
      ]
  };
  return data;
  }
    loadData6() {
        const data = {
            labels: this.behaviorGenderCount[0].result.map(x => x.etiqueta),
            datasets: [
                {
                    data: [this.behaviorGenderCount[0].result[0].valuesLabels.map(x => x.value),
                    this.behaviorGenderCount[0].result[1].valuesLabels.map(x => x.value)],
                    backgroundColor:[
                        '#EFBDC8',
                        '#ADECFF'
                    ],
                    hoverBackgroundColor: [
                        '#BE4B87',
                        '#13B6F6'
                    ]
                },
            ]
        };

  return data;
  }
  loadData7() {
    const data = {
         labels: this.totalCountEmployeeOB[0].result[0].details.map(x => x.labelDet),
         datasets: [
            {
                label: '',
                data: this.totalCountEmployeeOB[0].result[0].details.map(x => x.valueDet),
                backgroundColor: this.totalCountEmployeeOB[0].result[0].details.map(x => x.colorHexDet),
                hoverBackgroundColor:this.totalCountEmployeeOB[0].result[0].details.map(x => x.colorHexDet)
            },
        ]
  };
  return data;
}

loadDataIncident(){
    const data = {
        labels: this.countIncidentxGroup[0].result[0].details.map(x => x.labelDet),
        datasets: [
           {
               label: '',
               data: this.countIncidentxGroup[0].result[0].details.map(x => x.valueDet),
               backgroundColor: this.countIncidentxGroup[0].result[0].details.map(x => x.colorHexDet),
               hoverBackgroundColor:this.countIncidentxGroup[0].result[0].details.map(x => x.colorHexDet)
           },
       ]
 };
 return data;
}

loadDataTurnoverMotives(){
    const data = {
        labels: this.topTurnoverMotives[0].result[0].details.map(x => x.labelDet),
        datasets: [
           {
               label: 'Principales motivos de rotación de personal',
               data: this.topTurnoverMotives[0].result[0].details.map(x => x.valueDet),
               backgroundColor: this.topTurnoverMotives[0].result[0].details.map(x => x.colorHexDet),
               hoverBackgroundColor:this.topTurnoverMotives[0].result[0].details.map(x => x.colorHexDet)
           },
       ]
 };
 return data;
}

loadData8() {
  const data = {
    labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020'],
    datasets: [
        {
            label: 'Histórico de índice de rotación de personal',
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
return data;
}

loadData9() {
    const data = {
      labels: ['No justificada', 'Reposo', 'Post-Parto', 'Feriado', 'Matrimonio', 'Capacitación', 'Viaje'],
      datasets: [
          {
              label: 'Principales motivos de ausencia',
              data: [65, 59, 80, 81, 56, 55, 40],
              backgroundColor: [
                '#ECFEAA',
                '#EFBDC8',
                '#ADECFF',
                '#3bf7e4',
                '#C2F1FF',
                '#D6F5FF',
                '#EBFAFF'

            ],
            hoverBackgroundColor: [
                '#ECFEAA',
                '#EFBDC8',
                '#ADECFF',
                '#3bf7e4',
                '#C2F1FF',
                '#D6F5FF',
                '#EBFAFF'
            ]
          },
      ]
  };
  return data;
}

loadData10() {
    const data = {
      labels: ['Parque Porlamar', 'Parque Costazul', 'Sambil', 'Bodegón La Vela', 'Corporativo', 'CPA', 'AP'],
      datasets: [
          {
              label: 'Nuevos empleados por sucursal',
              data: [65, 59, 80, 81, 56, 55, 40],
              backgroundColor: [
                '#ECFEAA',
                '#EFBDC8',
                '#ADECFF',
                '#3bf7e4',
                '#F3CED6',
                '#b0c2f2',
                '#EBFAFF'
            ],
            hoverBackgroundColor: [
                '#ECFEAA',
                '#EFBDC8',
                '#ADECFF',
                '#3bf7e4',
                '#F3CED6',
                '#b0c2f2',
                '#FBEFF1'
            ]
          },
      ]
  };
  return data;
}

loadData11() {
    const data = {
      labels: ['Baby boomers (1949 - 1968)', 'Generacion X (1969 - 1980)', 'Millenials (1981 - 1993)', 'Generacion Z (1994 - 2010)'],
      datasets: [
          {
              label: 'Conteo de empleados por grupo de empresas',
              data: [65, 59, 80, 81],
              backgroundColor: [
                '#ECFEAA',
                '#EFBDC8',
                '#ADECFF',
                '#3bf7e4'
            ],
            hoverBackgroundColor: [
                '#ECFEAA',
                '#EFBDC8',
                '#ADECFF',
                '#3bf7e4'
            ]
          },
      ]
  };
  return data;
}

loadJobPositionMovements() {
    const data = [
            {
                id: 1,
                picture: [{image: 'assets/layout/images/topbar/avatar-cayla.png', name: 'Claudia'},
                        ],
                employee: 'Claudia',
                previous: 'Analista',
                new: 'Consultor'
            },
            {
                id: 2,
                picture: [{image: 'assets/layout/images/topbar/avatar-gabie.png', name: 'Gabriela'},
                        ],
                employee: 'Gabriela',
                previous: 'Consultor',
                new: 'Lider'
            },
            {
                id: 3,
                picture: [{image: 'assets/layout/images/topbar/avatar-gaspar.png', name: 'Manuel'},
                        ],
                employee: 'Manuel',
                previous: 'Consultor',
                new: 'Gerente'
            },
             {
                id: 4,
                picture: [{image: 'assets/layout/images/topbar/avatar-tatiana.png', name: 'Tatiana'},
                        ],
                employee: 'Panaderia',
                previous: 'Analista',
                new: 'Consultor'
            },
            {
                id: 5,
                picture: [{image: 'assets/layout/images/dashboard/avatar-athar.png', name: 'Athar'},
                        ],
                employee: 'Athar',
                previous: 'Gerente',
                new: 'Director'
            },
             {
                id: 6,
                picture: [{image: 'assets/layout/images/dashboard/avatar-tokunaga.png', name: 'Tokunaga'},
                        ],
                employee: 'Panaderia',
                previous: 'Analista',
                new: 'Consultor'
            }
        ];
    return data;
}

loadBranchOfficeMov() {
    const data = [
            {
                id: 1,
                picture: [{image: 'assets/layout/images/topbar/avatar-cayla.png', name: 'Claudia'},
                        ],
                employee: 'Claudia',
                previous: 'Parque Porlamar',
                new: 'Corporativo'
            },
            {
                id: 2,
                picture: [{image: 'assets/layout/images/topbar/avatar-gabie.png', name: 'Gabriela'},
                        ],
                employee: 'Gabriela',
                previous: 'Corporativo',
                new: 'Parque Costazul'
            },
            {
                id: 3,
                picture: [{image: 'assets/layout/images/topbar/avatar-gaspar.png', name: 'Manuel'},
                        ],
                employee: 'Manuel',
                previous: 'Parque Costazul',
                new: 'Sambil'
            },
             {
                id: 4,
                picture: [{image: 'assets/layout/images/topbar/avatar-tatiana.png', name: 'Tatiana'},
                        ],
                employee: 'Panaderia',
                previous: 'Analista',
                new: 'Consultor'
            },
            {
                id: 5,
                picture: [{image: 'assets/layout/images/dashboard/avatar-athar.png', name: 'Athar'},
                        ],
                employee: 'Athar',
                previous: 'Fabrica',
                new: 'Corporativo'
            },
             {
                id: 6,
                picture: [{image: 'assets/layout/images/dashboard/avatar-tokunaga.png', name: 'Tokunaga'},
                        ],
                employee: 'Panaderia',
                previous: 'Analista',
                new: 'Consultor'
            }
        ];
    return data;
}

loadColumns() {
  return  this.displayedColumns = [
        {field: 'id', header: 'id', display: 'none', dataType: 'number'},
        {field: 'picture', header: '', display: 'table-cell', dataType: 'avatar-group'},
        {field: 'employee', header:  'Empleado', display: 'table-cell', dataType: 'string'},
        {field: 'previous', header:  'Previo', display: 'table-cell', dataType: 'string'},
        {field: 'new', header:  'Nuevo', display: 'table-cell', dataType: 'string'}
    ];

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
/*          scales: {
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
        }  */
    };
 return basicOptions;
}
getLightThemeForPie() {
  return {
    responsive: false,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 0,
    title: {
        display: false,
        text: 'My Title',
        fontSize: 16
    },
    legend: {
        position: 'bottom'
    }
};
}

private getHeaderCollumnsName(name: string) {
    return `${name}`;
  }

}
