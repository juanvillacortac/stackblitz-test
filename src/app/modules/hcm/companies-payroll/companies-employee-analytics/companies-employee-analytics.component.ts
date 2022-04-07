import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { chartType } from 'src/app/models/common/chart-type';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { Typeindicator } from 'src/app/models/common/type-indicator';
import { widgetType } from 'src/app/models/common/widget-type';
import { AnalyticHCMFilter, AnalyticsHCM, IndicatorAnalyticsFilter, IndicatorsHCMxModulesFilter } from 'src/app/models/hcm/analytics-hcm';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { HCMDashboardService } from '../../shared/services/analytics-hcm.service.';

@Component({
  selector: 'app-companies-employee-analytics',
  templateUrl: './companies-employee-analytics.component.html',
  styleUrls: ['./companies-employee-analytics.component.scss']
})
export class CompaniesEmployeeAnalyticsComponent implements OnInit {

  indicatorsnumberHiring: Typeindicator[];
  dashboardDataEmployee: any;
  dashboardDataHiring: any;
  dashboardDataJobPosition: any;
  dashboardDataEmployeeLevel:any;
  titleout1: any;
  titleout2: any;
  titleout3: any;
  dataSubsidiary: any;
  dataViewModelSubsidiary: DataviewModel = new DataviewModel();
  behaviorGenderCount: AnalyticsHCM[]=[];
  topOfficeBranchMove: AnalyticsHCM[]=[];
  employeeProfileOB:DataviewListModel[]=[];
  AnalyticHCMFilter = new AnalyticHCMFilter();
  Indicators: IndicatorAnalyticsFilter[];
  IndicatorsHCMxModulesFilter = new IndicatorsHCMxModulesFilter();
  labelResponse: string = "";

  constructor(
    public _hcmDashboardService: HCMDashboardService,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
 debugger
    //this.loadData6();

    this.IndicatorsHCMxModules().then(()=>this.fetchDashboardData()).then(()=>
    this.createDashboard()
    )
    //this.loadDataTopSubsidiary();
    this.titleout1= '';
    this.titleout2= '';
    this.titleout3= '';
    //this.dashboardDataJobPosition = this.dataSubsidiary;

    this.indicatorsnumberHiring = [
      { id: 1,indicator: 'Altas',value:'100'},
      { id: 2,indicator: 'Bajas',value:'10'},
      { id: 1,indicator: 'Borrador',value:'3'},
      { id: 2,indicator: 'Suspensión',value:'1'},      
  ];

  }

  fetchDashboardData() {

    this.AnalyticHCMFilter.indicators =this.Indicators
    return this._hcmDashboardService.getIndicatorsHCM(this.AnalyticHCMFilter).toPromise()
      .then(indGraph => {
        this.behaviorGenderCount = indGraph.filter(x=>x.idIndicator==11 && x.idFilterType==1)
        this.topOfficeBranchMove = indGraph.filter(x=>x.idIndicator==95 && x.idFilterType==2)
        this.labelResponse = indGraph[0].result[0].etiqueta
        
      })
  }

  IndicatorsHCMxModules() {

    return this._hcmDashboardService.getIndicatorsHCMxModules(this.IndicatorsHCMxModulesFilter).toPromise()
      .then(Indicator => {
        this.Indicators = Indicator
      
      })


  }

  createDashboard() {

            //Cambio de cargo
            this.dashboardDataJobPosition = [
              {
                  'x': 0,
                  'y': 0, 
                  'cols': 12,
                  'rows': 7.5, 
                  'title': 'Tus últimos trabajadores ingresados', 
                  'widgetType': widgetType.dataviewList,
                  'data': this.loadDataTopSubsidiary(),
                  'options': this.applyLightTheme()
              },
          ];
    
        //Contratacion
        this.dashboardDataHiring = [
            {  'x': 0,  'y': 0, 'cols': 4, 'rows': 2.5, 'title': 'Conteo por estatus', 'widgetType': widgetType.listnumberindicator,
            'currentValue': 25,'targetValue': 10, 'legend': 'Ordenes' ,'data': this.indicatorsnumberHiring , 'icon': 'pi-arrow-right'},
        ];

                //Empleados
                this.dashboardDataEmployee = [
/*                   { 'x': 0,  'y': 0, 'cols': 4, 'rows': 2.5, 'title': 'Conteo por género', 'widgetType': widgetType.chart,
                  'chartType': chartType.doughnut, 'data': this.loadData6() , 'options': this.getLightThemeForPie() }, */
                  { 'x': 0,  'y': 0, 'cols': 4, 'rows':2.5, 'title': 'Ingresos por sucursal', 'plusVisible': 'true', 'widgetType': widgetType.chart,
                  'chartType': chartType.bar,
                  'data': this.loadData10() ,
                  'options': this.applyLightTheme() },
              ];
  
      }

      loadData6() {
        const data = {
            //Etiqueta
            //labels: ['Femenino', 'Masculino'],
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

  loadData10() {
    const data = {
        labels: ['PCA', 'CPA', 'Corporativo', 'Sambil', 'Bodegón LAV', 'Sigo +', 'Otras'],
      datasets: [
          {
              label: 'Conteo de empleados por sucursales',
              data: [65, 59, 80, 81, 56, 55, 40],
              backgroundColor: [
                '#ECFEAA',
                '#EFBDC8',
                '#ADECFF',
                '#3bf7e4',
                '#F3CED6',
                '#F7DEE4',
                '#EBFAFF'
            ],
            hoverBackgroundColor: [
                '#ECFEAA',
                '#EFBDC8',
                '#ADECFF',
                '#3bf7e4',
                '#F3CED6',
                '#F7DEE4',
                '#FBEFF1'
            ]
          },
      ]
  };
  return data;
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

loadDataTopSubsidiary() {
  this.searchSubsidiary();
 this.dataSubsidiary = this.dataViewModelSubsidiary;
 return this.dataSubsidiary; 
}

searchSubsidiary(){
  
  this.topOfficeBranchMove[0].result

  .forEach((a,idx) => {

      this.employeeProfileOB.push(
          
              {   id: a.identificator,
                  image: true,
                  mainDescription:'',
                  mainDescriptionSide: a.valuesData.valueData2,
                  name: a.etiqueta,
                  secundaryDescription:'',
                  secundaryDescriptionSide: '',//'Anterior: ' + a.valuesData.valueData2,
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
    

}
