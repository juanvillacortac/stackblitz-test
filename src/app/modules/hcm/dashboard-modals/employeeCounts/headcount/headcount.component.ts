import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { chartType } from 'src/app/models/common/chart-type';
import { widgetType } from 'src/app/models/common/widget-type';
import { HCMDashboardService } from '../../../shared/services/analytics-hcm.service.';
import { AnalyticHCMFilter, AnalyticsHCM, IndicatorAnalyticsFilter, IndicatorsHCMxModulesFilter } from 'src/app/models/hcm/analytics-hcm';

@Component({
  selector: 'app-headcount',
  templateUrl: './headcount.component.html',
  styleUrls: ['./headcount.component.scss']
})
export class HeadcountComponent implements OnInit {

  dashboardDataEmployeeLevel: any;
  dashboardDataEmployeeJP: any;
  titleout1:any;
  IndicatorsHCMxModulesFilter = new IndicatorsHCMxModulesFilter();
  Indicators: IndicatorAnalyticsFilter[];
  AnalyticHCMFilter = new AnalyticHCMFilter();
  totalCountEmployeeLevel: AnalyticsHCM[]=[];
  totalCountEmployeeJP: AnalyticsHCM[]=[];
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
    this.AnalyticHCMFilter.indicators =this.Indicators
    return this._hcmDashboardService.getIndicatorsHCM(this.AnalyticHCMFilter).toPromise()
      .then(indGraph => {
        this.totalCountEmployeeLevel = indGraph.filter(x=>x.idIndicator==4 && x.idFilterType==1)
        this.totalCountEmployeeJP = indGraph.filter(x=>x.idIndicator==5 && x.idFilterType==1)

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
          this.loadData()
          this.loadDataJP() 
  }

  loadData() {
    this.dashboardDataEmployeeLevel = {
         labels: this.totalCountEmployeeLevel[0].result[0].details.map(x => x.labelDet),
         datasets: [
            {
                label: 'Conteo por nivel de jerarquía',
                data: this.totalCountEmployeeLevel[0].result[0].details.map(x => x.valueDet),
                backgroundColor: this.totalCountEmployeeLevel[0].result[0].details.map(x => x.colorHexDet),
                hoverBackgroundColor: this.totalCountEmployeeLevel[0].result[0].details.map(x => x.colorHexDet),
            },
        ]
  };
}

  loadDataJP() {
    this.dashboardDataEmployeeJP = {

      labels: this.totalCountEmployeeJP[0].result[0].details.map(x => x.labelDet),
      datasets: [
        {
          data: this.totalCountEmployeeJP[0].result[0].details.map(x => x.valueDet),
          backgroundColor: this.totalCountEmployeeJP[0].result[0].details.map(x => x.colorHexDet),
          hoverBackgroundColor: this.totalCountEmployeeJP[0].result[0].details.map(x => x.colorHexDet),
        },
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
