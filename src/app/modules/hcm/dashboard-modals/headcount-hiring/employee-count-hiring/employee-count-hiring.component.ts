import { Component, OnInit } from '@angular/core';
import { AnalyticHCMFilter, AnalyticsHCM, IndicatorAnalyticsFilter, IndicatorsHCMxModulesFilter } from 'src/app/models/hcm/analytics-hcm';
import { HCMDashboardService } from '../../../shared/services/analytics-hcm.service.';

@Component({
  selector: 'app-employee-count-hiring',
  templateUrl: './employee-count-hiring.component.html',
  styleUrls: ['./employee-count-hiring.component.scss']
})
export class EmployeeCountHiringComponent implements OnInit {

  dashboardDataEmployeeHiring: any;
  titleout1:any;
  IndicatorsHCMxModulesFilter = new IndicatorsHCMxModulesFilter();
  Indicators: IndicatorAnalyticsFilter[];
  AnalyticHCMFilter = new AnalyticHCMFilter();
  totalCountEmployeeHiring: AnalyticsHCM[]=[];
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
        this.totalCountEmployeeHiring = indGraph.filter(x=>x.idIndicator==85 && x.idFilterType==1)

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
          this.loadDataHiring()
  }

/*   loadData() {
    debugger
    this.dashboardDataEmployeeHiring = {
         labels: this.totalCountEmployeeHiring[0].result[0].details.map(x => x.labelDet),
         datasets: [
            {
                label: 'Conteo por nivel de jerarquía',
                data: 
                [this.totalCountEmployeeHiring[0].result[0].details[0].valueDet,
                this.totalCountEmployeeHiring[0].result[0].details[1].valueDet,
                this.totalCountEmployeeHiring[0].result[0].details[2].valueDet,
                this.totalCountEmployeeHiring[0].result[0].details[3].valueDet,
                this.totalCountEmployeeHiring[0].result[0].details[4].valueDet],
                backgroundColor:
                [this.totalCountEmployeeHiring[0].result[0].details[0].colorHexDet, 
                this.totalCountEmployeeHiring[0].result[0].details[1].colorHexDet,
                this.totalCountEmployeeHiring[0].result[0].details[2].colorHexDet,
                this.totalCountEmployeeHiring[0].result[0].details[3].colorHexDet,
                this.totalCountEmployeeHiring[0].result[0].details[4].colorHexDet],
                hoverBackgroundColor:
                [this.totalCountEmployeeHiring[0].result[0].details[0].colorHexDet, 
                this.totalCountEmployeeHiring[0].result[0].details[1].colorHexDet,
                this.totalCountEmployeeHiring[0].result[0].details[2].colorHexDet,
                this.totalCountEmployeeHiring[0].result[0].details[3].colorHexDet,
                this.totalCountEmployeeHiring[0].result[0].details[4].colorHexDet]
            },
        ]
  };
} */

loadDataHiring() {
 let count = this.totalCountEmployeeHiring[0].result.filter(x => x.etiqueta)
  this.dashboardDataEmployeeHiring = {
    labels: ['Plazas Fijas', 'Plazas Temporales'],
    datasets: [
        {
            label: 'Estimadas',
            backgroundColor: '#ADECFF',
            data: [65, 59]
        },
        {
            label: 'Ocupadas',
            backgroundColor: '#3bf7e4',
            data: [28, 48]
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
