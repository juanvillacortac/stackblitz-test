import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { chartType } from 'src/app/models/common/chart-type';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { widgetType } from 'src/app/models/common/widget-type';
import { AnalyticHCMFilter, AnalyticsHCM, IndicatorAnalyticsFilter, IndicatorsHCMxModulesFilter } from 'src/app/models/hcm/analytics-hcm';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { HCMDashboardService } from '../../shared/services/analytics-hcm.service.';

@Component({
  selector: 'app-salary-dashboard-tab',
  templateUrl: './salary-dashboard-tab.component.html',
  styleUrls: ['./salary-dashboard-tab.component.scss']
})
export class SalaryDashboardTabComponent implements OnInit {

  titleout1: any;
  titleout2: any;
  titleout3: any;
  optionsTime: any[];
  value1: number = 1;
  dataSubsidiary: any;
  dataViewModelSubsidiary: DataviewModel = new DataviewModel();
  dashboardDataEmployee: any;
  dashboardDataHiring: any;
  dashboardDataJobPosition: any;
  employeeProfileOB:DataviewListModel[]=[];
  AnalyticHCMFilter = new AnalyticHCMFilter();
  Indicators: IndicatorAnalyticsFilter[];
  behaviorGenderCount: AnalyticsHCM[]=[];
  topOfficeBranchMove: AnalyticsHCM[]=[];
  IndicatorsHCMxModulesFilter = new IndicatorsHCMxModulesFilter();
  labelResponse: string = "";

  constructor(
    public _hcmDashboardService: HCMDashboardService,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {

    this.optionsTime = [
      {title: 'Este año', value: 1},
      {title: 'Año anterior', value: 2},
      {title: 'Histórico', value: 3}
  ];

  this.IndicatorsHCMxModules().then(()=>this.fetchDashboardData()).then(()=>
  this.createDashboard()
  )
  this.titleout1= '';
  this.titleout2= '';
  this.titleout3= '';

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
      { 'x': 0,  'y': 0, 'cols': 4, 'rows':3.2, 'title': 'Sueldo promedio año en curso', 'plusVisible': 'true', 'widgetType': widgetType.chart,
      'chartType': chartType.bar,
      'data': this.loadData10() ,
      'options': this.applyLightTheme() },
  ];

//Contratacion
this.dashboardDataHiring = [
    { 'x': 0,  'y': 0, 'cols': 4, 'rows':3.2, 'title': 'Cursos realizados', /*'nroModal':10,*/ 'widgetType': widgetType.chart,
    'chartType': chartType.bar,
    'data': this.loadDataCursoCert(),
    'options': this.applyStackedTheme() },
];

        //Empleados
        this.dashboardDataEmployee = [
          { 'x': 0,  'y': 0, 'cols': 4, 'rows': 3.2, 'title': 'Skills', 'widgetType': widgetType.chart,
          'chartType': chartType.doughnut, 'data': this.loadDataCurso() , 'options': this.getLightThemeForPie()},
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
    labels: ['Q1-2021', 'Q2-2021', 'Q3-2021', 'Q4-2021'],
    datasets: [
        {
            label: 'Promedios de sueldo',
            data: [40, 60, 80, 90],
            backgroundColor: [
              '#3bf7e4',
              '#3bf7e4',
              '#3bf7e4',
              '#3bf7e4'
          ],
          hoverBackgroundColor: [
              '#ECFEAA',
              '#ECFEAA',
              '#ECFEAA',
              '#ECFEAA'
          ],
          order: 2
        },
         {
          label: 'Objetivo',
          data: [40, 60, 80, 90],
          type: 'line',
          // this dataset is drawn on top
          fill: false,
          borderColor: 'rgb(54, 162, 235)',
          order: 1
      },
    ]
};
return data;
}

loadDataCurso() {
  const data = {
    labels: ['Base de datos', 'Programación', 'Inglés', 'Angular'],
    datasets: [
        {
            label: 'Conteo cursos realizados',
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

loadDataCursoCert() {
  const stackedData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
    datasets: [{
        type: 'bar',
        label: 'Gestión',
        backgroundColor: '#ECFEAA',
        data: [
            0,
            2,
            3,
            0,
            2,
            3,
            1
        ]
    }, {
        type: 'bar',
        label: '.NET Core 5',
        backgroundColor: '#3bf7e4',
        data: [
            3,
            0,
            1,
            3,
            0,
            1,
            3
        ]
    }, {
        type: 'bar',
        label: 'Angular 10',
        backgroundColor: '#ADECFF',
        data: [
            2,
            1,
            0,
            2,
            1,
            0,
            0
        ]
    }]
  };
return stackedData;
}



applyLightTheme() {
const basicOptions = {
  responsive: false,
  maintainAspectRatio: false,
  responsiveAnimationDuration: 0,
  legend: {
      labels: {
          fontColor: '#495057'
      },
  },
};
return basicOptions;
}

applyStackedTheme() {
  const stackedOptions = {
    tooltips: {
        mode: 'index',
        intersect: false
    },
    responsive: false,
    maintainAspectRatio: false,
    scales: {
        xAxes: [{
            stacked: true,
        }],
        yAxes: [{
            stacked: true
        }]
    }
};
  return stackedOptions;
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
  position: 'right'
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
                  secundaryDescriptionSide: 'Anterior: ' + a.valuesData.valueData2,
                  imagePath: a.labelUrl? 'https://gruposigo1.s3.amazonaws.com/'+a.labelUrl:'https://ui-avatars.com/api/?name=a.valuesData.valueData5&background=3bf7e4&color=17a2b8&rounded=true&bold=true&size=200'}
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
