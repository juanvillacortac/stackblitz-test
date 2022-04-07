import { Component, OnInit } from '@angular/core';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { Typeindicator } from 'src/app/models/common/type-indicator';

@Component({
  selector: 'app-product-catalog-top',
  templateUrl: './product-catalog-top.component.html',
  styleUrls: ['./product-catalog-top.component.scss']
})
export class ProductCatalogTopComponent implements OnInit {
  listorders: any[];
  dashboardData:any;
  horizontalOptions:any;
  paginator:any;
  indicatorsnumberPLM:Typeindicator[]=[];
  titleout1:string;
  dataViewModelPLM: DataviewModel = new DataviewModel();
  constructor() { }
  
  loadData2() {
    this.dashboardData = {
      labels: ['Randy caraballo', 'Madelyn Leos', 'Amaranta hernandez', 'Pedro perez', 'Pedro paez', 'Omar marcano'],
      datasets: [
          {
              label: 'Cantidad de items actualizado y creador por operador',
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
  loaddata(){
    this.paginator=false;

    this.dataViewModelPLM = {   
      imagePathEmpaque: 'assets/layout/images/empaque.png',
      imagePathAvatar:'assets/layout/images/topbar/avatar-cayla.png',
      linkTitleIn:true,
      codModal:0,
      codModalImg:0,
      dataviewlist:[
        { id: 1,image: false,mainDescription:'',mainDescriptionSide:'Creado',name:'Harina pan de 1Kg',secundaryDescription:'',secundaryDescriptionSide:'01-10-2021 20:00:00',imagePath:'assets/layout/images/topbar/avatar-cayla.png'},
        { id: 2,image: false,mainDescription:'',mainDescriptionSide:'Creado',name:'Harina de trigo  1kg',secundaryDescription:'',secundaryDescriptionSide:'01-10-2021 20:00:00',imagePath:'assets/layout/images/topbar/avatar-cayla.png'},
        { id: 3,image: false,mainDescription:'',mainDescriptionSide:'Modificado',name:'Azucar montablan 1Kg',secundaryDescription:'',secundaryDescriptionSide:'01-10-2021 20:00:00',imagePath:'assets/layout/images/topbar/avatar-gaspar.png'},
        { id: 4,image: false,mainDescription:'',mainDescriptionSide:'Modificado',name:'Caraotas panteras 1Kg',secundaryDescription:'',secundaryDescriptionSide:'01-10-2021 20:00:00',imagePath:'assets/layout/images/topbar/avatar-cayla.png'},
        { id: 5,image: false,mainDescription:'',mainDescriptionSide:'Modificado',name:'Arvejas del monte 1Kg',secundaryDescription:'',secundaryDescriptionSide:'01-10-2021 20:00:00',imagePath:'assets/layout/images/topbar/avatar-cayla.png'},
      
    ]
    }
  this.indicatorsnumberPLM = [
    { id: 1,indicator: 'Consignación',value:'150'},
    { id: 2,indicator: 'Activos sin inventario',value:'30'},
    { id: 3,indicator: 'Con inventario',value:'500'},
    { id: 4,indicator: 'Datos por completar',value:'50'}
   
   
];
    this.titleout1='Tus 5 últimos productos actualizados';

  
   
       
 
}
  ngOnInit(): void {
    this.loaddata();
    this.loadData2();
    this.horizontalOptions = {
      indexAxis: 'x',
      type: 'bar',    
      title:'', 
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

}
