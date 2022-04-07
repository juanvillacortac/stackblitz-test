import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { Typeindicator } from 'src/app/models/common/type-indicator';
import { widgetType } from 'src/app/models/common/widget-type';

@Component({
  selector: 'app-purchase-order-top',
  templateUrl: './purchase-order-top.component.html',
  styleUrls: ['./purchase-order-top.component.scss'],
 
})
export class PurchaseOrderTopComponent implements OnInit {
  listorders: any[];
  dashboardData:any;
  horizontalOptions:any;
  dashboardDataEmployeeLevel:any;
  paginator:any;
  titleGeneral:any;
  indicatorsnumberODC:Typeindicator[]=[];
  titleout1:string;
  dataViewModelBuyer: DataviewModel = new DataviewModel();
  constructor( private messageService: MessageService) { }
  loaddata(){
    this.paginator=false;
this.titleGeneral="Tus últimas 5 órdenes";
    this.indicatorsnumberODC = [
      { id: 1,indicator: 'Planificadas',value:'10'},
      { id: 2,indicator: 'Rechazadas por proveedor',value:'1'},
      { id: 3,indicator: 'Recibidas',value:'26'},
      { id: 4,indicator: 'Por vencer',value:'5'}
    
  ];
    this.titleout1='Top 5 de últimas órdenes';
    this.dataViewModelBuyer = {   
      imagePathEmpaque: 'assets/layout/images/empaque.png',
      imagePathAvatar:'assets/layout/images/topbar/avatar-cayla.png',
      linkTitleIn:true,
      codModal:0,
      codModalImg:0,
      dataviewlist:[
        { id: 1,image: false,mainDescription:'',mainDescriptionSide:'Autorizada',name:'ODC-001-0000222',secundaryDescription:'',secundaryDescriptionSide:'Fecha creada: 01-10-2021',imagePath:'assets/layout/images/topbar/avatar-cayla.png'},
        { id: 2,image: false,mainDescription:'',mainDescriptionSide:'En Borrador',name:'ODC-001-0000225',secundaryDescription:'',secundaryDescriptionSide:'Fecha creada: 12-09-2021',imagePath:'assets/layout/images/topbar/avatar-cayla.png'},
        { id: 3,image: false,mainDescription:'',mainDescriptionSide:'En Revisión',name:'ODC-001-0000224',secundaryDescription:'',secundaryDescriptionSide:'Fecha creada: 11-09-2021',imagePath:'assets/layout/images/topbar/avatar-gaspar.png'},
        { id: 4,image: false,mainDescription:'',mainDescriptionSide:'Elaborada',name:'ODC-001-0000223',secundaryDescription:'',secundaryDescriptionSide:'Fecha creada: 09-08-2021',imagePath:'assets/layout/images/topbar/avatar-cayla.png'},
        { id: 5,image: false,mainDescription:'',mainDescriptionSide:'Planificada',name:'ODC-001-0000220',secundaryDescription:'',secundaryDescriptionSide:'Fecha creada: 01-08-2021',imagePath:'assets/layout/images/topbar/avatar-cayla.png'},
      
    ]
    }
       
 
}
  ngOnInit(): void {

    this.loaddata();
    this.loadData2();
    this.listorders = [
      {
          NumeroOrder: "ODC-001-0001-00001",
          estatus: "Geraldine Bisset",
          fechaactualiza: "01/02/2021 12:00:01",
          fechacreacion: "01/02/2021 12:00:01",
          
      },
      {
        NumeroOrder: "ODC-001-0001-00006",
        estatus: "Geraldine Bisset",
        fechaactualiza: "01/02/2021 12:00:01",
        fechacreacion: "01/02/2021 12:00:01",
        
    },
    {
      NumeroOrder: "ODC-001-0001-00005",
      estatus: "Geraldine Bisset",
      fechaactualiza: "01/02/2021 12:00:01",
      fechacreacion: "01/02/2021 12:00:01",
      
  },
  {
    NumeroOrder: "ODC-001-0001-00004",
    estatus: "Geraldine Bisset",
    fechaactualiza: "01/02/2021 12:00:01",
    fechacreacion: "01/02/2021 12:00:01",
    
},
{
  NumeroOrder: "ODC-001-0001-00007",
  estatus: "Geraldine Bisset",
  fechaactualiza: "01/02/2021 12:00:01",
  fechacreacion: "01/02/2021 12:00:01",
  
}
  ];
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
  
  
  
    loadData2() {
      this.dashboardData = {
        labels: ['Randy caraballo', 'Madelyn Leos', 'Amaranta hernandez', 'Pedro perez', 'Pedro paez', 'Omar marcano'],
        datasets: [
            {
                label: 'Cantidad de ordenes de compra-autorizadas',
                data: [65, 59, 80,50,41,10],
                backgroundColor: [
                  "#BBF2F0",
                  "#CCF5F4",
                  "#DDF8F8",
                  "#EEFCFC",
                  "#97EDED",
                  "#86EAEA"
              ],            
              hoverBackgroundColor: [
                  '#22BFBF'               
                  
              ]
            },
        ]
    };
   
  }
}
