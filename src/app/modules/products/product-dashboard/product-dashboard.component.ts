import { Component, OnInit } from '@angular/core';
import { chartType } from 'src/app/models/common/chart-type';
import { widgetType } from 'src/app/models/common/widget-type';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss']
})
export class ProductDashboardComponent implements OnInit {

  constructor() { }

  titleout3: any;
  optionsTime1: any[];
  minHeight:number;
  dashboardData: any;
  dashboardData2:any[];
  dashboardData3:any[];
  lineStylesData:any;
  multiAxisData:any;
  linesdata2:any;
  minHeight2:any;
  basicOptions: any;
  horizontalOptions:any;
  basicData:any;
  titleout1: any;
  value2:any;
  ngOnInit(): void {
    this.multiAxisData = {
      labels: ['Iniciación', 'Crecimiento', 'Madurez', 'Declive'],
      datasets: [{
          label: 'Fases',
          data: [0, 0, 0, 0],
          backgroundColor:'#FF8585'
      },
      {
       
        data: [0, 0, 0, 0],
        backgroundColor: '#C2D9FF' 
           
       
    }, {
     
      data: [0, 0, 0, 0],
      backgroundColor: '#C2D9FF' 
         
     
  },
  {
    label: 'Posición actual',
    data: [0, 40, 0, 0],
    backgroundColor: '#FF8585' 
   
}
      
      , {
          label: 'Ciclo de vida',
          type:'line',
          fill: true,
          tension: .4,        
          borderColor: '#42A5F5',    
          data: [0,5,130,5 ],
          backgroundColor: 'RGBA(70,154,215,0.38)'// rgba(255,167,38,0.2)'
      }]
  };
    this.basicData = {
      labels: ['Generales', 'Complementarios', 'Sucursal', 'Multimedia', 'Impuestos', 'Logísticos'],
      datasets: [
          {
              label: 'Datos generales',
              backgroundColor: '#88F8FC',
              data: [65, 59, 80, 81, 56, 55]
          }
        
      ]
     
    };
    this.horizontalOptions = {
      indexAxis: 'y',
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      },
      scales: {
      
        xAxes: [{
          title:{
            display: true,
            text:'sdasfsdf'
           },
          gridLines: {
            display: false
        },
            ticks: {
                fontColor: '#495057'
            }
        }],
        yAxes: [{
          gridLines: {
            display: false
        },
            ticks: {
                fontColor: '#495057'
            }
        }]
    }
    };
    this.applyDarkTheme();
    this.minHeight=35;
    this.minHeight2=60;
    this.titleout1="";
    this.optionsTime1 = [
      {title: 'Este mes', value: 1},
      {title: 'Últimos 3 meses', value: 3},
      {title: 'Últimos 6 meses', value: 4}
  ];
  this.value2=1;
 


  this.dashboardData = [
        { 'x': 0,  'y': 0, 'cols':6, 'rows': 9, 'title': 'Ciclo de vida del producto', 'widgetType': widgetType.chart,
        'chartType': chartType.bar, 'data': this.linesdata2 , 'options': this. applyDarkTheme() },
        { 'x':6,  'y': 0, 'cols':6, 'rows': 9, 'title': 'Datos completados', 'widgetType': widgetType.chart,
        'chartType': chartType.horizontalBar, 'data': this.basicData , 'options': this.applyDarkTheme() }
       
        
];
this.dashboardData3 = [
  
  { 'x':0,  'y': 0, 'cols':12, 'rows': 8, 'title': 'Datos completados', 'widgetType': widgetType.chart,
  'chartType': chartType.horizontalBar, 'data': this.basicData , 'options': this.applyDarkTheme() }
 
  
];
this.dashboardData2 = [
  
  { 'x': 0,  'y':0, 'cols': 3, 'rows': 2, 'title': 'Promedio de ventas', 'widgetType': widgetType.targetInd,
  'currentValue': '200K$','sublegend': 'Por días de inventario' ,  'image': 'assets/layout/images/dashboard/camion.png', 'icon': 'pi-arrow-right','nroModal':0 },      
  { 'x': 3,  'y':0, 'cols': 3, 'rows': 2, 'title': 'Rotación', 'widgetType': widgetType.targetInd,  
  'currentValue': 'AAC','sublegend': '' , 'image':'assets/layout/images/dashboard/gestion-de-producto.png', 'icon': 'pi-arrow-right','nroModal':0 }  ,  
  { 'x': 6,  'y':0, 'cols': 3, 'rows': 2,'mayor':0,'menor':1, 'title': 'Devoluciones', 'widgetType': widgetType.percentIndCond,
  'currentValue': 10, 'target': 15, 'valueVsTarget': 15,'sublegend': 'Cantidad' , 'icon': 'pi-arrow-right','nroModal':0 , 'image': 'assets/layout/images/dashboard/rateup.svg'},

  { 'x': 9,  'y':0, 'cols': 3, 'rows':2, 'title': 'Disponible', 'widgetType': widgetType.targetInd,
  'currentValue': '500','sublegend': 'Unidades' , 'image': 'assets/layout/images/dashboard/inventario.png', 'icon': 'pi-arrow-right','nroModal':0 }  
 
  
];
}

loadDataProduct() {
  const data = {
    labels: ['Víveres', 'Enlatados', 'Electrónica', 'Farmacia', 'Licores', 'Cuidado personal', 'Granos'],
    datasets: [
        {
           
            label: 'Ítems en bajo stock',
            backgroundColor: '#dfe7fd',
            data: [300, 20, 5, 10, 160, 174, 28]
        },
        {
           
            label: 'Ítems en sobre stock',
            backgroundColor: '#fde2e4',
            data: [0, 2, 5, 10, 1, 5, 20]
        },
        {
           
          label: 'Ítems cerca del sobrestock',
          backgroundColor: '#A0C4FF',
          data: [0, 2, 5, 10, 1, 5, 20]
      }
    ]
};
return data;
}


  applyDarkTheme() 
  {
    this.basicOptions = {
      responsive: true,
  maintainAspectRatio: true,
  responsiveAnimationDuration: 0,
  legend: {
display:false,
      labels: {

          fontColor: '#495057'

      },

  },
  scales: {
    xAxes: [{
      title:{
        display: true,
        text:'sdasfsdf'
       },
      gridLines: {
        display: false
    },
        ticks: {
            fontColor: '#495057'
        }
    }],
    x: {
      display: false,
     
      title: {
        display: true,
        text: 'Tiempo',
        color: '#911',
        font: {
          family: 'Comic Sans MS',
          size: 20,
          weight: 'bold',
          lineHeight: 1.2,
        },
        padding: {top: 20, left: 0, right: 0, bottom: 0}
      }
    },
    yAxes: [{
      gridLines: {
        display: false
    },
        ticks: {
            fontColor: '#495057'
        }
    }],
      y: {
        display: true,
        title: {
        
          text: 'Ventas ($)'
        },
          ticks: {
              color: '#ebedef'
          },
          grid: {
              color: 'rgba(255,255,255,0.2)'
          }
      }
  }
      /* responsive: false,
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
         */
    };
  }
}

