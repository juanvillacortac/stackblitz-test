import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { chartType } from 'src/app/models/common/chart-type';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { Typeindicator } from 'src/app/models/common/type-indicator';
import { widgetType } from 'src/app/models/common/widget-type';
import { AnalyticsFilter } from 'src/app/models/ims/dashboard/analytics-filter';
import { AnalyticsIndicatorFilter } from 'src/app/models/ims/dashboard/analytics-indicator-filter';
import { Category } from 'src/app/models/masters-mpc/category';
import { AnalyticSRM } from 'src/app/models/srm/dashboard-srm';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { DashboardanalyticsMPCService } from '../../shared/services/dashboardanalytics-mpc/dashboardanalytics-mpc.service';
import { EnumIndicatorMPC } from '../../shared/Utils/enum-indicator-dashboard-mpc';



@Component({
  selector: 'app-dashboard-mpc',
  templateUrl: './dashboard-mpc.component.html',
  styleUrls: ['./dashboard-mpc.component.scss']
})
export class DashboardMpcComponent implements OnInit {
  
  basicData: any;
  _dataCategoryUnitReceivedVsSalesMPC:any;
  _dataInventoryActiveProducts:any;
  basicData2:any;
  AnalyticMPCFilter: AnalyticsFilter=new AnalyticsFilter();
  itemindicatorMPC:AnalyticsIndicatorFilter;
  dashboardDataProductos: any;
  dashboardDataOperacion: any;
  dashboardDataObjetivos: any;
  periodicities: BaseModel[];
  dashboardDataBDMPC:any;
  value4: number = 60;
  categories: Category[];//solo categorias padre
  ListTypeindicatorsBranch:Typeindicator[];
  ListTypeindicatorsCompany:Typeindicator[];
  typeIndicatorMPC:typeof EnumIndicatorMPC=EnumIndicatorMPC;
  cantidad: number;
   nroitems:number;
   titleout1: any;
  titleout2: any;
  titleout3: any;
  optionsTime1: any[];
  value2:any;
  paginator: boolean = false;  
  dataViewModel: DataviewModel = new DataviewModel();
  dataViewListModel: any;
  dataproducts: any;
  legend = '';
 sublegend = '';
 target:number = 0;//objetivo
 valueVsTarget:number = 0;
 currentValue:number = 0;
  horizontalOptions: {
    indexAxis: string; type: string; options: {
      indexAxis: string;
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: { bar: { borderWidth: number; }; }; responsive: boolean; plugins: { legend: { position: string; }; title: { display: boolean; text: string; }; }; scales: { x: { ticks: { color: string; }; grid: { color: string; }; }; y: { ticks: { color: string; }; grid: { color: string; }; }; };
    };
  };
  constructor(private messageService: MessageService,private readonly dialogService: DialogsService,public _categoryservice: CategoryService,private _Authservice: AuthService,public breadcrumbService: BreadcrumbService,public loadingService: LoadingService,public  MPCDashboardService: DashboardanalyticsMPCService) {

    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM',routerLink: ['/mpc/dashboard-mpc']  }
     
    ]);

   }

  ngOnInit(): void {
    this.ListTypeindicatorsBranch = [
      { id: 1,indicator: 'Consignación',value:'50'},
      { id: 2,indicator: 'Activos sin inventario',value:'50'},
      { id: 3,indicator: 'Con inventario',value:'50'},
      { id: 4,indicator: 'Datos por completar',value:'50'},
      { id: 5,indicator: 'Desincorporados',value:'50'},
      { id: 6,indicator: 'En ecommerce',value:'50'},
     
  ];
  this.optionsTime1 = [
    {title: 'Hoy', value: 0},
    {title: 'Este mes', value: 1},
    {title: 'Últimos 3 meses', value: 3},
    {title: 'Últimos 6 meses', value: 4}
];
this.value2=0;
  this.titleout1='Rentabilidad';
this.titleout2='Operación';
this.titleout3='Productos';
  this.ListTypeindicatorsCompany = [
    { id: 1,indicator: 'Creados',value:'122'},
    { id: 2,indicator: 'Sin barra',value:'150'},
    { id: 3,indicator: 'Datos completados',value:'1050'},
    { id: 4,indicator: 'Sin categoría definida',value:'100'},
    { id: 5,indicator: 'Pesados',value:'2000'},
    { id: 6,indicator: 'No pesados',value:'1390'}
   
   
];

this.horizontalOptions = {
  indexAxis: 'y',
  type: 'bar',     
  options: {
    indexAxis: 'y',
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
        position: 'right',
      },
      title: {
        display: true,
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

this.basicData2=this.loadData();
    //cargar combos de categorias padre y periocidad para hacer consulta
    this.onLoadCategorys();
    this.periodicities = [
        {name: 'Anual', id: 1},
        {name: 'Mensual', id: 2},
        {name: 'Semanal', id: 3},
        {name: 'Actual', id: 4}
       
    ];
    this.createDashboard();
    


  this.basicData = {
    labels: ['Viveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'],
        datasets: [
            
            {
               
                label: 'Monto $',
                backgroundColor: '#fad2e1',
                data: [10, 5,20, 10, 30.88,12.99, 8.56]
            }
        ]
};

this.GetIndicatorsMPC().finally(() => {//indicadores de MPC
  this.loadingService.startLoading();
  this.GetLoadIndicatorMPC();
    this.createDashboard(); 
    this.loadingService.stopLoading();
});


  }
  //Dos barras
  loadDataBarDobleBD(codIndicator:number, dataAux:any) {

    let data: any;
   
    let labelscategory:string[]=[];
    let label1,label2:string;
    let valuescategorySales:number[]=[];
    let valuescategoryPurchase:number[]=[];
    let backgroundColorvalues:string="";    
    let item :AnalyticSRM=new AnalyticSRM();
    
   
      item=dataAux.find(element => element.idIndicator ==codIndicator);//this.typeindicatorSRM.CategorysSalesSRM);
      debugger
     if(item.result!=null){
 //labelscategory=item.result[0].valuesLabels.map(x=>x.labels);
 labelscategory=item.result.map(x=>x.etiqueta);//categorias padre
      
 label1=item.result[0].labels[0].labelName;//compradas
 if(label1!="Sin datos"){
   label2=item.result[0].labels[1].labelName;//vendidas
   //  item3=item.result.map(x=>x.valuesLabels);

     item.result.forEach(element => {
       valuescategoryPurchase.push(element.valuesLabels[0].value);//compradas
       valuescategorySales.push(element.valuesLabels[1].value);//vendidas
     });
 }

     }
     
     data = {
      labels: labelscategory, //categorias padre
            datasets: [
          {             
              label: label1,
              backgroundColor: '#A0C4FF',
              data:valuescategorySales
          },         
            {             
                label: label2,
                backgroundColor: '#FDFFB6',
                data:valuescategoryPurchase
            }
          
      ]
  };
    return data;
}
//indicadores de MPC
GetLoadIndicatorMPC()
{
if (this.dashboardDataBDMPC!=null)
{
  debugger
 // this._dataprofitabilityMPC=this.GetProfitableXCategoryDonaSimpleBarBD(this.typeIndicatorMPC.CategoryProfitableCompany,this.dashboardDataBDMPC);//mpc rentabilidad, grafico de dona simple
 this._dataCategoryUnitReceivedVsSalesMPC=this.loadDataBarDobleBD(this.typeIndicatorMPC.UnitSalesReceivedXOfficeBranch,this.dashboardDataBDMPC);//mpc unidades vendidas vs recibidas
 this._dataInventoryActiveProducts=this.dashboardDataBDMPC.find(element => element.idIndicator ==this.typeIndicatorMPC.ActiveInventoryProductsXOfficeBranch);
}
 
 }
GetIndicatorsMPC()
{
  debugger
  this.AnalyticMPCFilter.idCompany=this._Authservice.currentCompany;
  this.AnalyticMPCFilter.idBranchOffice=this._Authservice.currentOffice;
  //this.itemindicatorMPC.idFilterType=
  this.AnalyticMPCFilter.indicators=this.getIndicatorToShowMPC();
  return this.MPCDashboardService.getIndicatorsMPC(this.AnalyticMPCFilter).toPromise().then(data => {
    this.dashboardDataBDMPC = data;      
    
  }, (error: HttpErrorResponse) => {
    this.loadingService.stopLoading(); 
    this.dialogService.errorMessage('Error dashboard', error?.error?.message ?? 'error_service'); 
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el dashboard de productos." });
   
  });
}
getIndicatorToShowMPC() {

  const widgetFilter:  AnalyticsIndicatorFilter[] = [];
  // widgetFilter.push( { idIndicator: 45,  idFilterType: 1, parameters: '' });//ventas x empresa
  /*  widgetFilter.push( { idIndicator: EnumIndicatorMPC.CategoryProfitableCompany,  idFilterType: -1, parameters: '' });//ventas x empresa
   widgetFilter.push( { idIndicator: EnumIndicatorMPC.CategoryProfitableOfficeBranch,  idFilterType: -1, parameters: '' });//indice de perdidas x empresa
   widgetFilter.push( { idIndicator: EnumIndicatorMPC.UnitSalesReceivedXCompany,  idFilterType: -1, parameters: '' });//Ventas x categoriax sucursal */
   widgetFilter.push( { idIndicator: EnumIndicatorMPC.UnitSalesReceivedXOfficeBranch,  idFilterType: -1, parameters: '' });//indice de perdidas por sucursal x motivo
   widgetFilter.push( { idIndicator: EnumIndicatorMPC.ActiveInventoryProductsXOfficeBranch,  idFilterType: -1, parameters: '' });//indice de perdidas por sucursal x motivo
 
   return widgetFilter;
}
  searchProductsTop() {
    this.searchProducts();
    this.dataproducts = this.dataViewModel;
    return this.dataproducts;
  }

  searchProducts(){

    this.dataViewModel = {   
      imagePathEmpaque: 'assets/layout/images/empaque.png',
      imagePathAvatar:'assets/layout/images/avatar-unisex.jpg',
      linkTitleIn:true,
      codModal:4,
      codModalImg:0,
      dataviewlist:[
        { id: 1,image: true,mainDescription:'86.99.33%',mainDescriptionSide:'1',name:'Harina de maíz precocido pan',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876'},      
        { id: 6,image: true,mainDescription:'60.45%',mainDescriptionSide:'2',name:'Aceite de oliva chacon con ajo en spary 200ml',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/aceitechaconcinajojpg_03112021_10:37:53202111031438232368'},
        { id: 19,image: true,mainDescription:'58.66%',mainDescriptionSide:'3',name:'Cereal con dulce de leche flips 120g',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipsduldeleche3_03112021_10:20:48202111031421191126'},
        { id: 20,image: true,mainDescription:'55.33%',mainDescriptionSide:'4',name:'Cereal de chocoavellana flips 220g',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipschocoave_03112021_10:22:47202111031423181886'},
        { id: 15,image: true,mainDescription:'45.33%',mainDescriptionSide:'5',name:'Batería fulgor 24mr - 1100 amp.',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/bateriafulgor_03112021_11:09:37202111031510073194'},
        { id: 21,image: true,mainDescription:'35.33%',mainDescriptionSide:'6',name:'Cereal de chocolate flips 220g',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipschocolate_03112021_10:20:14202111031420451515'},
        { id: 6,image: true,mainDescription:'30.33%',mainDescriptionSide:'7',name:'Arroz risotto flora 1kg',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/rissotoflorajpg_03112021_11:05:55202111031506251672'},
        { id: 7,image: true,mainDescription:'29.33%',mainDescriptionSide:'8',name:'Harina d/trigo rey del norte 45kg',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harinareynortejpg_03112021_10:59:54202111031500244142'},
        { id: 8,image: true,mainDescription:'29.31%',mainDescriptionSide:'9',name:'Aceite de oliva  monini  extra virgen 500ml',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: B',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/aceitemonini_03112021_10:56:40202111031457108921'},
        { id: 9,image: true,mainDescription:'25.33%',mainDescriptionSide:'10',name:'Mezcla la lucha para panqueca 500g',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: C',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/panquecaslalauchajpg_03112021_11:02:22202111031502531188'},
   

   /*    dataviewlist:[
        { id: 1,image: true,mainDescription:'86.99.33%',mainDescriptionSide:'1',name:'Harina pan 1kg',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876'},      
        { id: 2,image: true,mainDescription:'60.45%',mainDescriptionSide:'2',name:'Lechuga romana',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/te-lechuga-propiedades_20082021_16:48:36202108201648366218'},
        { id: 3,image: true,mainDescription:'58.66%',mainDescriptionSide:'3',name:'Aguacate injerto',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/aguacate_10092021_12:41:27202109101241275947'},
        { id: 4,image: true,mainDescription:'55.33%',mainDescriptionSide:'4',name:'Café molido madrid',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/IMG-20191029-WA0129_27092021_11:11:03202109271111038934'},
        { id: 4,image: true,mainDescription:'45.33%',mainDescriptionSide:'5',name:'Brócoli',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotacion: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/brocoli_10092021_12:41:05202109101241060716'},
        { id: 5,image: true,mainDescription:'35.33%',mainDescriptionSide:'6',name:'Cebolla blanca',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotacion: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/pngwing_10092021_12:36:45202109101236460273'},
        { id: 6,image: true,mainDescription:'30.33%',mainDescriptionSide:'7',name:'Papa amarilla lavada',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/batata_10092021_12:40:43202109101240436252'},
        { id: 7,image: true,mainDescription:'29.33%',mainDescriptionSide:'8',name:'Harina de trigo 1kgr',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: A',imagePath:'assets/layout/images/dashboard/Harina2.jpg'},
        { id: 8,image: true,mainDescription:'29.31%',mainDescriptionSide:'9',name:'Arroz mary 1kg',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotación: B',imagePath:'assets/layout/images/dashboard/harina_pan.jpg'},
        { id: 9,image: true,mainDescription:'25.33%',mainDescriptionSide:'10',name:'Caraotas negras pantera',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Índice de rotacion: C',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/CaraotasNegras900gr_1080x_27092021_11:19:44202109271119443037'},
 */        
    ]
    }
  }
  
  
  onLoadCategorys(){
    var filter: CategoryFilter = new CategoryFilter();
    filter.active = 1;
    filter.idParentCategory=0;
    this._categoryservice.getCategorys(filter)
    .subscribe((data: Category[])=>{
      this._categoryservice._categoryList = data;
     this.categories=this._categoryservice._categoryList;
    },(error)=>{
      console.log(error);
    });
  }

  createDashboard() {
    
    this.dashboardDataProductos = [
     
        //primera linea graficos rreentabilidad

      /*   { 'x': 0,  'y':0, 'cols': 12, 'rows': 6, 'title': 'Porcentaje de productos con rentabilidad', 'widgetType': widgetType.percentIndCond,
        'currentValue': 20.76,'symbol':'%', 'target': 60,'mayor':1,'menor':0, 'valueVsTarget': 10.00,'sublegend': 'Índice de rentabilidad de los productos' ,'image':'assets/layout/images/dashboard/rateup.svg', 'icon': 'pi-arrow-right','nroModal':0 },
        { 'x':0,  'y': 6, 'cols': 12, 'rows': 6, 'title': 'Rentabilidad por categorías (%)', 'widgetType': widgetType.chart,
            'chartType': chartType.doughnut, 'data': this.loadData2() , 'options': this.applyLightThemedoughnut() },  
   */          
            { 'x': 0,  'y': 0, 'cols':12, 'rows': 9, 'title': 'Unidades vendidas vs recibidas', 'widgetType': widgetType.chart,
            'chartType': chartType.bar, 'data': this._dataCategoryUnitReceivedVsSalesMPC , 'options': this.applyLightTheme() }
            /* {
              'x': 0,
              'y': 27, 
              'cols': 12,
              'rows': 12, 
              'title': 'Top 10 de productos con más rentabilidad', 
              'widgetType': widgetType.dataviewList,
              'data': this.searchProductsTop(),
              'options': this.applyLightTheme()
          } *///,
           
            /* {  'x':0,  'y':12, 'cols': 4, 'rows': 3, 'title': 'Top 10',  'widgetType': widgetType.listTeam,
            'currentValue': 88745, 'legend': 'egresos' , 'icon': 'pi-arrow-right'}, */
           
          
            
    ];
    this.dashboardDataOperacion=[  //valores    
    /*   { 'x': 0,  'y':0, 'cols': 12, 'rows': 6, 'title': 'Productos creados nunca recibidos', 'widgetType': widgetType.targetInd,
      'currentValue': 45,'sublegend': 'ítems creados, nunca recibidos' , 'image':'assets/layout/images/dashboard/producto (1).png', 'icon': 'pi-arrow-right','nroModal':0 },      
 */    //+ this._Authservice.currentCompany + this._Authservice.currentOffice
     
    /*   {  'x': 0,  'y': 14, 'cols': 12, 'rows': 9, 'title': 'Total por empresa - '+this._Authservice.currentNameCompany,  'widgetType': widgetType.listnumberindicator,
      'currentValue': 20,'targetValue': 10, 'legend': 'Órdenes' ,'data': this.ListTypeindicatorsCompany ,'nroModal':0, 'icon': 'pi-arrow-right'},
     */ 
     {  'x': 0,  'y': 0, 'cols': 12, 'rows':9, 'title': 'Total por sucursal - '+this._Authservice.currentNameOffice,  'widgetType': widgetType.listnumberindicator,
      'currentValue': 20,'targetValue': 10, 'legend': 'Órdenes' ,'data': this.ListTypeindicatorsBranch ,'nroModal':0, 'icon': 'pi-arrow-right'},
    
      ];

if (this.dashboardDataObjetivos!=null)
{
  debugger
    this.currentValue=this._dataInventoryActiveProducts.result[0].currentValue;
    this.valueVsTarget=this._dataInventoryActiveProducts.result[0].porcentaje;
    this.legend=this._dataInventoryActiveProducts.result[0].indicator;
    this.target=this._dataInventoryActiveProducts.result[0].goal;

}
      this.dashboardDataObjetivos=[

           // //Indicadores con objetivos
              { 'x': 0,  'y': 0,'symbol':'%', 'cols': 12, 'rows': 6, 'title': 'Porcentaje de productos activos sin inventario', 'widgetType': widgetType.percentIndCond,
           'currentValue': this.currentValue, 'target':this.target, 'mayor':0,'menor':1,'valueVsTarget': this.valueVsTarget, 'legend': this.legend ,'sublegend': 'Productos en sucursal activos sin inventario', 'icon': 'pi-arrow-right','nroModal':0 , 'image':'assets/layout/images/dashboard/ratedown.svg'},
         /*   { 'x': 0,  'y':6, 'cols': 12, 'rows': 6,'mayor':0,'menor':1, 'title': 'Productos ajustados por hurto', 'widgetType': widgetType.percentIndCond,
           'currentValue': 5, 'target': 20, 'valueVsTarget': 15,'sublegend': 'Ítems ajustados por hurto, mes en curso' , 'icon': 'pi-arrow-right','nroModal':0 , 'image': 'assets/layout/images/dashboard/rateup.svg'},
           { 'x': 0,  'y': 12, 'cols': 12, 'rows':9, 'title': 'Ciclo de vida general', 'widgetType': widgetType.chart,
           'chartType': chartType.pie ,'data': this.loadDataPie() ,'nroModal':5, 'options': this.optionsPie() },   
           { 'x':0,  'y': 21, 'cols':12, 'rows': 9, 'title': 'Stock general', 'widgetType': widgetType.chart,
           'chartType': chartType.bar, 'data': this.loadDataStockProductos() , 'options': this.applyLightTheme() 
          } */
        ];
  }

  loadData() {
      const data = {
        labels: ['Víveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'],
        datasets: [
            {
               
                label: 'Unidades recibidas',
                backgroundColor: '#dfe7fd',
                data: [200, 100, 200.256, 300, 360, 100, 50]
            },
            {
               
                label: 'Unidades vendidas',
                backgroundColor: '#fde2e4',
                data: [195, 78, 150.485, 280, 300, 80, 20]
            }
        ]
    };
    return data;
  }
  loadDataStockProductos() {
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
  loadData2() {
    const data = {
        labels: ['Víveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'],
      datasets: [
          {
            data: [20, 10, 20.10, 10, 10, 20, 10],
              backgroundColor: [
                  '#dfe7fd',
                  '#fde2e4',
                  '#A0C4FF',
                  '#FDFFB6',
                  '#A0C4FF',
                  '#8ecae6',
                  '#72efdd'

              ],
              hoverBackgroundColor: [
                '#dfe7fd',
                  '#fde2e4',
                  '#A0C4FF',
                  '#FDFFB6',
                  '#A0C4FF',
                  '#8ecae6',
                  '#72efdd'

              ]
          }]
      };
  return data;
  }

  loadDataPie() {
    const data = {
        labels: ['Declive', 'Crecimiento', 'Madurez', 'Iniciación'],
      datasets: [
          {
            data: [150, 500, 3000, 1200],
              backgroundColor: [
                  '#eae2b7',
                  '#fff0f3',
                  '#ced4da',
                  '#b7e4c7'
                  

              ],
              hoverBackgroundColor: [
                '#eae2b7',
                '#fff0f3',
                '#ced4da',
                '#b7e4c7'
               
              ]
          }]
      };
  return data;
  }
  optionsPie(){
    const options = {
      responsive: false,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 0,
      tooltipEvents: [],
      tooltips: {
        intersect: false
      },
      showTooltips: true,
      title: {
        display: true,
        text: '',
        fontSize: 12
      },
      legend: {
        position: 'right',
        labels: {
          fontColor: '#495057',
          fontSize: 14
      }
      }
    }
    return options;
  }
    
  applyLightThemedoughnut() {
    const basicOptions = {
        responsive: false,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 0,
        
        legend: {
            position: 'right',
            labels: {
                fontColor: '#495057',
                fontSize: 14
            },
            title: {
                display: true,
                text: 'Prueba'
              }
        }
    };
 return basicOptions;
}
applyLightTheme() {
    const basicOptions = {
        responsive: false,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 0,
        indexAxis: 'y',
        legend: {
            labels: {
                fontColor: '#495057',
                fontSize: 14
            }
        },
        scales: {
            xAxes: [{
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

}
