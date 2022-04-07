import { Component, OnInit } from '@angular/core';
import { AnalyticHCMFilter, AnalyticsHCM, IndicatorAnalyticsFilter, IndicatorsHCMxModulesFilter } from 'src/app/models/hcm/analytics-hcm';
import { HCMDashboardService } from '../../shared/services/analytics-hcm.service.';

@Component({
  selector: 'app-employee-movement-subsidiary',
  templateUrl: './employee-movement-subsidiary.component.html',
  styleUrls: ['./employee-movement-subsidiary.component.scss']
})
export class EmployeeMovementSubsidiaryComponent implements OnInit {

  dashboardDataEmployeeMovementSubs: any;
  titleout1:any;
  IndicatorsHCMxModulesFilter = new IndicatorsHCMxModulesFilter();
  Indicators: IndicatorAnalyticsFilter[];
  AnalyticHCMFilter = new AnalyticHCMFilter();
  totalCountEmployeeMovementSubsidiary: AnalyticsHCM[]=[];
  labelResponse: string = "";
  basicOptions:any;

  constructor(
    public _hcmDashboardService: HCMDashboardService,
  ) { }

  ngOnInit(): void {
    this.IndicatorsHCMxModules().then(()=>this.fetchDashboardData()).then(()=>
    this.createDashboard()
    )
  }

  fetchDashboardData() {
    debugger
    this.AnalyticHCMFilter.indicators =this.Indicators
    return this._hcmDashboardService.getIndicatorsHCM(this.AnalyticHCMFilter).toPromise()
      .then(indGraph => {
        this.totalCountEmployeeMovementSubsidiary = indGraph.filter(x=>x.idIndicator==85 && x.idFilterType==1)

        this.labelResponse = indGraph[0].result[0].etiqueta
        
      })
  }

  
  IndicatorsHCMxModules() {
    return this._hcmDashboardService.getIndicatorsHCMxModules({... new IndicatorsHCMxModulesFilter(),idPrincipal:0}).toPromise()
      .then(Indicator => {
        this.Indicators = Indicator
      
      })


  }

  createDashboard()
  {
          this.loadDataEmployeeSubsidiary()
  }

  loadDataEmployeeSubsidiary() {
    let count = this.totalCountEmployeeMovementSubsidiary[0].result.filter(x => x.etiqueta)
     this.dashboardDataEmployeeMovementSubs = {
       labels: ['Parque Porlamar', 'Parque Costazul', 'Sambil'],
       datasets: [
           {
               label: 'Entradas',
               backgroundColor: '#ADECFF',
               data: [65, 59, 45]
           },
           {
               label: 'Salidas',
               backgroundColor: '#3bf7e4',
               data: [28, 48, 55]
           }
       ]
   };
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

}
