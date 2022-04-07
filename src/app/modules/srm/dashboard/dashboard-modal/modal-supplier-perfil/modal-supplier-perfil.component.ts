import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { chartType } from 'src/app/models/common/chart-type';
import { widgetType } from 'src/app/models/common/widget-type';

@Component({
  selector: 'app-modal-supplier-perfil',
  templateUrl: './modal-supplier-perfil.component.html',
  styleUrls: ['./modal-supplier-perfil.component.scss']
})
export class ModalSupplierPerfilComponent implements OnInit {
 
  constructor( private messageService: MessageService,public ref: DynamicDialogRef, public config: DynamicDialogConfig) { 
    
   
    
  }
  _dataSupplier:DataviewListModel;
  currentValue:number;
  dashboardDataEmployeeLevel:any;
  horizontalOptions:any;
  basicOptions:any;
  ngOnInit(): void {
    this._dataSupplier=new DataviewListModel();
    this._dataSupplier=this.config.data.id;
    this.currentValue=10000;
    console.log(this._dataSupplier);
    this.loadData();
   
this.horizontalOptions = {
  indexAxis: 'x',
  type: 'bar',    
  title:'sfsdfsdfg', 
  options: {
    indexAxis: 'x',
    gridLines: {
      display: false
  },
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      }
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'right',
      },
      title: {
        display: false,
        text: 'Monto'
      }
    },
 
  scales: {
      x: {
          ticks: {
              color: '#495057'
          },
          grid: {
             
              color: '#ebedef'
          }
      },
      y: {
          ticks: {
              color: '#495057'
          },
          grid: {
              color: '#ebedef'
          }
      }
  }
}
};
}
applyLightTheme() {
  const basicOptions = {
      responsive: false,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 0,
      indexAxis: 'y',
      legend: {
          labels: {
              fontColor: '#A0C4FF'
          }
      // },
      // scales: {
      //     xAxes: [{
      //       gridLines: {
      //         display: false
      //     },
      //         ticks: {
      //             fontColor: '#A0C4FF'
      //         }
      //     }],
      //     yAxes: [{
      //       gridLines: {
      //         display: false
      //     },
      //         ticks: {
      //             fontColor: '#A0C4FF'
      //         }
      //     }]
       }
  };
return basicOptions;
}



  loadData() {
    this.dashboardDataEmployeeLevel = {
      labels: ['Calidad de pedido', 'Entregas a tiempo', 'Ordenes recibidas completas'],
      datasets: [
          {
              label: 'Cantidad de ordenes de compra',
              data: [65, 59, 80],
              backgroundColor: '#b0c2f2',             
            hoverBackgroundColor: [
                '#A0C4FF'               
                
            ]
          },
      ]
  };
 
}

applyLightTheme2() {
  this.basicOptions = {
      responsive: false,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 0,
      legend: {
          labels: {
              fontColor: '#495057'
          }
      },
       scales: {
          xAxes: [{
              ticks: {
                  fontColor: '#17a2b8'
              }
          }],
          yAxes: [{
              ticks: {
                  fontColor: '#17a2b8'
              }          }]
      } 
  };

}



}
