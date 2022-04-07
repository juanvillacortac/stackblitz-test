import { Component, OnInit } from '@angular/core';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { chartType } from 'src/app/models/common/chart-type';
import { widgetType } from 'src/app/models/common/widget-type';
import { Category } from 'src/app/models/masters-mpc/category';
import { CategoryFilter } from 'src/app/modules/masters-mpc/shared/filters/category-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { Typeindicator } from 'src/app/models/common/type-indicator';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { HttpErrorResponse } from '@angular/common/http';
import { AnalyticSRM, AnalyticSRMFilter, IndicatorAnalyticsFilter,IndicatorXModuleSRMFilter,IndicatorXModuleSRM, ResultAnalytics, ResultAnalyticsDetails, ValuesLabelAnalytics } from 'src/app/models/srm/dashboard-srm';
import { DashboardanalyticsService } from '../../shared/services/dashboardanalytics/dashboardanalytics.service';
import { MessageService } from 'primeng/api';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { EnumIndicatorSRM } from '../../shared/Utils/enum-indicator-dashboard';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { IndicatorGoals } from 'src/app/models/common/indicator-goals';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';

@Component({
  selector: 'app-dashboard-general-srm',
  templateUrl: './dashboard-general-srm.component.html',
  styleUrls: ['./dashboard-general-srm.component.scss']
})
export class DashboardGeneralSrmComponent implements OnInit {
  _dataBD:boolean=false;
  optionsTime: any[];
  typeindicatorSRM: typeof EnumIndicatorSRM = EnumIndicatorSRM;
  private dialogService: DialogsService;
  AnalyticSRMFilter=new AnalyticSRMFilter();
  _indicatormoduleSRMFilter=new IndicatorXModuleSRMFilter();
  _indicatorxmoduleSRM=new IndicatorXModuleSRM();
  indicatorsnumberODC:Typeindicator[];
  indicatorsnumberVDR:Typeindicator[]=[];
  indicatorsnumberDEV:Typeindicator[];
  dashboardDataOperacion: any;
  value2:any;
  titleout1: any;
  titleout2: any;
  titleout3: any;
  dashboardDataCompras: any;
  _dataCategorySales:any;
  _dataCategoryUnitSalesVsPurchased:any;
  dashboardDataObjetivos: any;
  _valueGoals:IndicatorGoals;
  periodicities: BaseModel[];
  value4: number = 60;
  categories: Category[];//solo categorias padre
 horizontalOptions: {
    indexAxis: string; type: string; options: {
      indexAxis: string;
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: { bar: { borderWidth: number; }; }; responsive: boolean; plugins: { legend: { position: string; }; title: { display: boolean; text: string; }; }; scales: { x: { ticks: { color: string; }; grid: { color: string; }; }; y: { ticks: { color: string; }; grid: { color: string; }; }; };
    };
  };
  
  
  paginator: boolean = false;  
  datasuppliers: DataviewModel = new DataviewModel();
  dataListProducts: DataviewModel = new DataviewModel();
  databuyers:DataviewModel = new DataviewModel();
  dataViewModelBuyer: DataviewModel = new DataviewModel();
  dataViewListModelBuyer: any;
  dataViewListModel: any;
  _DashboardData:AnalyticSRM[];
  _DashboardDataModule: IndicatorXModuleSRM[];
   constructor(public loadingService: LoadingService,public _categoryservice: CategoryService, public  _SRMDashboardService: DashboardanalyticsService,
    private messageService: MessageService,public breadcrumbService: BreadcrumbService) { 
      this.breadcrumbService.setItems([
        { label: 'OSM' },
        { label: 'SCM',routerLink: ['/srm/dashboard-general-srm']  }
       
      ]);
     

     }

  ngOnInit(): void {
    this.loadingService.stopLoading();
    
    this.optionsTime = [
      {title: 'Este mes', value: 1},
      {title: 'Últimos 3 meses', value: 3},
      {title: 'Últimos 6 meses', value: 4}
  ];
  this.value2=1;
    this._dataBD=true;
    debugger
    this.loadDataTopbuyers() ;//data local de indicadores, todavia no trae de bd
    this.searchProducts();
   //buscar los indicadores pricipales 
     if( this._dataBD){
      debugger
      this.GetIndicatorsModulesSRM().finally(() => {
        this.GetdataIndicatorSRM().finally(() => {
         this.datasuppliers=this.searchTop(this.typeindicatorSRM.TopSupplier);//top de proveedor
         this.databuyers=this.searchTop(this.typeindicatorSRM.TopOperators);//top de operadores
          this._dataCategoryUnitSalesVsPurchased=this.loadDataBarDoble(this.typeindicatorSRM.UnitSalesVsUnitspurchased);//top de proveedor
        this._valueGoals=this.goalsObjectives(this.typeindicatorSRM.orderQuality);
        this.loaddataindicators(this.typeindicatorSRM.statusReception);
        //  this.loadDataTopSuppliers();
          this.createDashboard(); 
          this.loadingService.stopLoading();
        });
       
      });

     }else{
      this._dataCategorySales=this.loadDataChartSimple(this.typeindicatorSRM.CategorysSalesSRM);//grafico de categorias mas vendidas 
      this.loaddataindicators(0);//data local de indicadores
       this.loadDataTopSuppliers();//data local indicadores   
       this.loadDataTopbuyers() ;
       this.createDashboard(); 
     }


  }//fin init
  searchProducts(){

    this.dataListProducts = {   
      imagePathEmpaque: 'assets/layout/images/empaque.png',
      imagePathAvatar:'assets/layout/images/avatar-unisex.jpg',
      linkTitleIn:false,
      codModal:1,
      codModalImg:3,
      dataviewlist:[

        { id: 1,image: true,mainDescription:'ALIMENTOS POLAR CA',mainDescriptionSide:'1',name:'Harina de maíz precocido pan',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876'},      
        { id: 6,image: true,mainDescription:'ALIMENTOS POLAR CA',mainDescriptionSide:'2',name:'Aceite de oliva chacon con ajo en spary 200ml',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/aceitechaconcinajojpg_03112021_10:37:53202111031438232368'},
        { id: 19,image: true,mainDescription:'ALFONZO RIVAS CA',mainDescriptionSide:'3',name:'Cereal con dulce de leche flips 120g',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipsduldeleche3_03112021_10:20:48202111031421191126'},
        { id: 20,image: true,mainDescription:'ALFONZO RIVAS CA',mainDescriptionSide:'4',name:'Cereal de chocoavellana flips 220g',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipschocoave_03112021_10:22:47202111031423181886'},
        { id: 15,image: true,mainDescription:'DISTRIBUIDORA FULGOR CA',mainDescriptionSide:'5',name:'Batería fulgor 24mr - 1100 amp.',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/bateriafulgor_03112021_11:09:37202111031510073194'},
        { id: 21,image: true,mainDescription:'ALFONZO RIVAS CA',mainDescriptionSide:'6',name:'Cereal de chocolate flips 220g',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/flipschocolate_03112021_10:20:14202111031420451515'},
        { id: 6,image: true,mainDescription:'ALIMENTOS POLAR CA',mainDescriptionSide:'7',name:'Arroz risotto flora 1kg',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/rissotoflorajpg_03112021_11:05:55202111031506251672'},
        { id: 7,image: true,mainDescription:'ALIMENTOS POLAR CA',mainDescriptionSide:'8',name:'Harina d/trigo rey del norte 45kg',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harinareynortejpg_03112021_10:59:54202111031500244142'},
        { id: 8,image: true,mainDescription:'PEPSICO ALIMENTOS CA',mainDescriptionSide:'9',name:'Aceite de oliva  monini  extra virgen 500ml',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/aceitemonini_03112021_10:56:40202111031457108921'},
        { id: 9,image: true,mainDescription:'ALIMENTOS LA LUCHA CA',mainDescriptionSide:'10',name:'Mezcla la lucha para panqueca 500g',secundaryDescription:'Rentabilidad',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/panquecaslalauchajpg_03112021_11:02:22202111031502531188'},
      
        // { id: 1,image: true,mainDescription:'ALIMENTOS POLAR CA',mainDescriptionSide:'1',name:'Harina pan 1kg',secundaryDescription:'Último proveedor',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876'},      
        // { id: 2,image: true,mainDescription:'ALIMENTOS POLAR CA',mainDescriptionSide:'2',name:'Lechuga romana',secundaryDescription:'Último proveedor',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/te-lechuga-propiedades_20082021_16:48:36202108201648366218'},
        // { id: 3,image: true,mainDescription:'ALIMENTOS PANTERA CA',mainDescriptionSide:'3',name:'Aguacate injerto',secundaryDescription:'Último proveedor',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/aguacate_10092021_12:41:27202109101241275947'},
        // { id: 4,image: true,mainDescription:'ALIMENTOS POLAR CA',mainDescriptionSide:'4',name:'Café molido madrid',secundaryDescription:'Último proveedor',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/IMG-20191029-WA0129_27092021_11:11:03202109271111038934'},
        // { id: 4,image: true,mainDescription:'VEGETALES JOSE CA',mainDescriptionSide:'5',name:'Brócoli',secundaryDescription:'Último proveedor',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/brocoli_10092021_12:41:05202109101241060716'},
        // { id: 5,image: true,mainDescription:'VEGETALES JOSE CA',mainDescriptionSide:'6',name:'Cebolla blanca',secundaryDescription:'Último proveedor',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/pngwing_10092021_12:36:45202109101236460273'},
        // { id: 6,image: true,mainDescription:'VEGETALES JOSE CA',mainDescriptionSide:'7',name:'Papa amarilla lavada',secundaryDescription:'Último proveedor',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/batata_10092021_12:40:43202109101240436252'},
        // { id: 7,image: true,mainDescription:'VEGETALES JOSE CA',mainDescriptionSide:'8',name:'Harina de trigo 1kgr',secundaryDescription:'Último proveedor',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'assets/layout/images/dashboard/Harina2.jpg'},
        // { id: 8,image: true,mainDescription:'VEGETALES JOSE CA',mainDescriptionSide:'9',name:'Arroz mary 1kg',secundaryDescription:'Último proveedor',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'assets/layout/images/dashboard/harina_pan.jpg'},
        // { id: 9,image: true,mainDescription:'VEGETALES JOSE CA',mainDescriptionSide:'10',name:'Caraotas negras pantera',secundaryDescription:'Último proveedor',secundaryDescriptionSide:'Disponible en sucursal:100',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/CaraotasNegras900gr_1080x_27092021_11:19:44202109271119443037'},
        
    ]
    }
  }
  
   GetIndicatorsModulesSRM() {

    this.filterIndicatorModule();//1- preparAR EL FILTRO DE BUSQueda de los indicadores principales.
    //2- consultar los indicadores principales de accuerdo al modulo
    return this._SRMDashboardService.getIndicatorsModuleSRM(this._indicatormoduleSRMFilter).toPromise().then(data => {
    this._DashboardDataModule = data;   
    var item:IndicatorAnalyticsFilter; 
         if (this._DashboardDataModule!=[]){          
        this.AnalyticSRMFilter.indicators = this._DashboardDataModule.map((item) => ({
          idIndicator: item.idIndicator,
          idFilterType: item.idFilterType,
          parameters:null
          }));
          
        }  
      ;//llena los dashboard
     
   }/* , (error: HttpErrorResponse) => {
    //this.dialogService.errorMessage('mrp.processing_room.rooms', error?.error?.message ?? 'error_service');
    // this.loading = false;
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el indicador de balance general." });
    
   */
  );
}
//objetivos y metas por ahora solo el valor , falta objetivo estipulado y 

goalsObjectives(codIndicator:number)
{
  let valuegoals:IndicatorGoals=new  IndicatorGoals();
  let item :AnalyticSRM=new AnalyticSRM();
  item=this._DashboardData.find(element => element.idIndicator ==codIndicator);//this.typeindicatorSRM.CategorysSalesSRM);
  valuegoals.currentValue=item.result[0].details[0].value;
  valuegoals.target=80;
  valuegoals.valueVsTarget=15;
  return valuegoals;
 
}
//top proveedores y top de operadores desde base de datos
searchTop(codIndicator:number)
{
 
  let lista: DataviewListModel[]=[];
    let item :AnalyticSRM=new AnalyticSRM();
    let dataaux:DataviewModel=new DataviewModel; 
  item=this._DashboardData.find(element => element.idIndicator ==codIndicator);//this.typeindicatorSRM.CategorysSalesSRM);
  debugger  
  var i=0;
  let item2:DataviewListModel;
 if (codIndicator==96)//operadores
 {
  dataaux.codModal=0;
  dataaux.codModalImg=0;
  dataaux.linkTitleIn=false;

 }else
 {
  dataaux.codModal=1;
  dataaux.codModalImg=2;
  dataaux.linkTitleIn=true;

 }

item.result.forEach(element => {
item2=new DataviewListModel();  
item2.id=element.value;
i=i+1;
item2.image=true;
if(element.campoUrl=='')
    {
      
      item2.imagePath='https://ui-avatars.com/api/?name='+element.etiqueta+'&background=17a2b8&color=fff&rounded=true&bold=true&size=200';
    }else
    {
      item2.imagePath=element.campoUrl;//adicionarle url de aws

    }
    if (codIndicator==96)//operadores
    {
      item2.name=element.etiqueta;
      item2.mainDescription=element.values.value2.toString();
      item2.secundaryDescription='ODC autorizadas';
      item2.secundaryDescriptionSide='Total: '+element.values.value1;//rif
      item2.mainDescriptionSide=i.toString();
    }else
    {
     
    item2.name=element.etiqueta;
    item2.mainDescription=element.values.value1.toString()+' %';
    item2.secundaryDescription='Fiabilidad del proveedor';
    item2.secundaryDescriptionSide=element.values.value2;//rif
    item2.mainDescriptionSide=i.toString();
   
    }
    
   lista.push(item2);    

});

dataaux.dataviewlist=lista;
/* else
{//top de proveedores
  if (codIndicator==this.typeindicatorSRM.TopSupplier)
  this.loadDataTopSuppliers();//carga los proveedores en le dashboard
   //top de operadores*(comercializacion) 
   if(codIndicator==this.typeindicatorSRM.TopOperators){
    this.loadDataTopbuyers() ;
  }
 

} */
 return dataaux;

}
  GetdataIndicatorSRM(){

    this.AnalyticSRMFilter.idSucursal=this._indicatormoduleSRMFilter.IdBranchOffice;
    return this._SRMDashboardService.getIndicatorsSRM(this.AnalyticSRMFilter).toPromise().then(data => {
      this._DashboardData = data;      
      this._dataCategorySales=this.loadDataChartSimple(this.typeindicatorSRM.CategorysSalesSRM);//grafico de categorias mas vendidas 
    }
    
    /* , (error: HttpErrorResponse) => {
      //this.dialogService.errorMessage('mrp.processing_room.rooms', error?.error?.message ?? 'error_service');
      // this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el indicador de balance general." });
      
     */
    );  
 }
 
loaddataindicators(idIndicator:number){
var item;
let itemIndicator: Typeindicator;
let miarray: Typeindicator[];

debugger
if(this._dataBD){
  if (idIndicator==EnumIndicatorSRM.statusReception)// recepcion de mercancia
  {

  
      item=this._DashboardData.find(element => element.idIndicator ==idIndicator);//this.typeindicatorSRM.CategorysSalesSRM);
     // labelscategory=item.result[0].details.map(x=>x.etiqueta);
      //valuescategory=item.result[0].details.map(x=>x.value);\
      item.result[0].details.forEach(element => {
        itemIndicator=new Typeindicator();
        itemIndicator.id=1;
        itemIndicator.indicator=element.etiqueta;
        itemIndicator.value=element.value;
        this.indicatorsnumberVDR.push(itemIndicator);
      });
  


}

}else{


  this.indicatorsnumberVDR = [
    { id: 1,indicator: 'Planificadas',value:'5'},
    { id: 2,indicator: 'Finalizadas',value:'33'},
    { id: 3,indicator: 'En recepcion',value:'4'},
    { id: 4,indicator: 'Validadas',value:'1'},
    { id: 4,indicator: 'Rechazadas',value:'1'},
   { id: 6,indicator: 'Procesadas',value:'30'}
   
  ];

}


  this.indicatorsnumberODC = [
    { id: 1,indicator: 'Planificadas',value:'10'},
    { id: 2,indicator: 'Rechazadas por proveedor',value:'1'},
    { id: 3,indicator: 'Recibidas',value:'26'},
    { id: 4,indicator: 'Por vencer',value:'5'},
    { id: 5,indicator: 'Autorizadas',value:'3'},
    { id: 6,indicator: 'En borrador',value:'39'},
   
];
this.indicatorsnumberDEV = [
{ id: 1,indicator: 'Planificadas',value:'10'},
{ id: 2,indicator: 'Finalizadas',value:'20'},
{ id: 3,indicator: 'Registradas',value:'20'},
{ id: 4,indicator: 'Por entregar',value:'5'},
{ id: 5,indicator: 'Entregada',value:'20'}


];
this.titleout1='Compras';
this.titleout2='Operación';
this.titleout3='Proveedores';
  //cargar combos de categorias padre y periocidad para hacer consulta
//  this.onLoadCategorys();  
 
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
}


//data de proveedores
  loadDataTopSuppliers() {
    if (!this._dataBD)
      this.datasuppliers = this.searchSuppliers();
    
  }
//data de compradores
  loadDataTopbuyers() {
    //if(this._dataBD)
    this.searchBuyers();
    this.databuyers = this.dataViewModelBuyer;
  }
searchBuyers(){
    this.dataViewModelBuyer = {   
      imagePathEmpaque: 'assets/layout/images/empaque.png',
      imagePathAvatar:'assets/layout/images/topbar/avatar-cayla.png',
      linkTitleIn:false,
      codModal:0,
      codModalImg:0,
      dataviewlist:[
        { id: 5,image: true,mainDescription:'',mainDescriptionSide:'1',name:'Madelyn Leos',secundaryDescription:'ODC Autorizadas: 20',secundaryDescriptionSide:'Total: 22',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Madelyn-Leos.png202110141529477524'},
        { id: 2,image: true,mainDescription:'',mainDescriptionSide:'2',name:'Nilda Vásquez',secundaryDescription:'ODC Autorizadas: 15',secundaryDescriptionSide:'Total: 25',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Nilda-Vasquez.png202110141533146871'},
        { id: 6,image: true,mainDescription:'',mainDescriptionSide:'3',name:'Amaranta Hernández',secundaryDescription:'ODC Autorizadas: 12',secundaryDescriptionSide:'Total: 20',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Amaranta-hernandez.png202110141530252611'},
        { id: 4,image: true,mainDescription:'',mainDescriptionSide:'4',name:'Greysa andrades',secundaryDescription:'ODC Autorizadas: 12',secundaryDescriptionSide:'Total: 22',imagePath:'assets/layout/images/topbar/avatar-cayla.png'},
        { id: 3,image: true,mainDescription:'',mainDescriptionSide:'5',name:'Randy Caraballo',secundaryDescription:'ODC Autorizadas: 10',secundaryDescriptionSide:'Total: 19',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Randy-Caraballo.png202110141532080179'},
        { id: 6,image: true,mainDescription:'',mainDescriptionSide:'6',name:'Mary gómez',secundaryDescription:'ODC Autorizadas: 9',secundaryDescriptionSide:'Total: 15',imagePath:'assets/layout/images/topbar/avatar-cayla.png'},
        { id: 7,image: true,mainDescription:'',mainDescriptionSide:'7',name:'Victor rodríguez',secundaryDescription:'ODC Autorizadas: 8',secundaryDescriptionSide:'Total: 14',imagePath:'assets/layout/images/topbar/avatar-gaspar.png'},
        { id: 2,image: true,mainDescription:'',mainDescriptionSide:'8',name:'Joníz gonzalez',secundaryDescription:'ODC Autorizadas: 8',secundaryDescriptionSide:'Total: 15',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Joniz-Gonzalez.png202110141531414763'},
        { id: 9,image: true,mainDescription:'',mainDescriptionSide:'9',name:'Mónica Villarroel',secundaryDescription:'ODC Autorizadas: 7',secundaryDescriptionSide:'Total: 20',imagePath:'assets/layout/images/topbar/avatar-gabie.png'},
        { id: 10,image: true,mainDescription:'',mainDescriptionSide:'10',name:'José nuñez',secundaryDescription:'ODC Autorizadas: 5',secundaryDescriptionSide:'Total: 10',imagePath:'assets/layout/images/topbar/avatar-gaspar.png'}
    
    ]
    }
       
  }

//proveedores
searchSuppliers(){
let dataaux:DataviewModel=new DataviewModel;
dataaux = {   
    imagePathEmpaque: 'assets/layout/images/empaque.png',
    imagePathAvatar:'assets/layout/images/avatar-unisex.jpg',
    linkTitleIn:true,
    codModal:1,
    codModalImg:2,
    dataviewlist:[
      { id: 1,image: true,mainDescription:'69.66%',mainDescriptionSide:'1',name:'ALIMENTOS POLAR CA',secundaryDescription:'Fiabilidad del proveedor',secundaryDescriptionSide:'J-435345346',imagePath:''},
      { id: 2,image: true,mainDescription:'60.45%',mainDescriptionSide:'2',name:'ELECTRONICA MARGARITA',secundaryDescription:'Fiabilidad del proveedor',secundaryDescriptionSide:'J-435345346',imagePath:''},
      { id: 3,image: true,mainDescription:'55.33%',mainDescriptionSide:'3',name:'N & H PROYECTOS CA ',secundaryDescription:'Fiabilidad del proveedor',secundaryDescriptionSide:'J-435345555',imagePath:''},
      { id: 4,image: true,mainDescription:'45.33%',mainDescriptionSide:'4',name:'DISTRIBUIDORA DORA CA, SA',secundaryDescription:'Fiabilidad del proveedor',secundaryDescriptionSide:'J-435345555',imagePath:''},
      { id: 5,image: true,mainDescription:'35.33%',mainDescriptionSide:'5',name:'DROGUERIA CARACAS, CA',secundaryDescription:'Fiabilidad del proveedor',secundaryDescriptionSide:'J-435345555',imagePath:''},
      { id: 6,image: true,mainDescription:'30.33%',mainDescriptionSide:'6',name:'ALIMENTOS MARY',secundaryDescription:'Fiabilidad del proveedor',secundaryDescriptionSide:'J-435345555',imagePath:''},
      { id: 7,image: true,mainDescription:'29.33%',mainDescriptionSide:'7',name:'MI HUERTO MARGARITA',secundaryDescription:'Fiabilidad del proveedor',secundaryDescriptionSide:'J-435345555',imagePath:''},
      { id: 8,image: true,mainDescription:'29.31%',mainDescriptionSide:'8',name:'DULCES DONA MARY',secundaryDescription:'Fiabilidad del proveedor',secundaryDescriptionSide:'J-435345555',imagePath:''},
      { id: 9,image: true,mainDescription:'26.33%',mainDescriptionSide:'9',name:'ULTRAMEDICA MARGARITA,CA',secundaryDescription:'Fiabilidad del proveedor',secundaryDescriptionSide:'J-435345555',imagePath:''},
      { id: 10,image: true,mainDescription:'25.33%',mainDescriptionSide:'10',name:'CERVECERIA POLAR',secundaryDescription:'Fiabilidad del proveedor',secundaryDescriptionSide:'J-435345555',imagePath:''}
  
  ]
  }
     return dataaux;
}

filterIndicatorModule(){

this._indicatormoduleSRMFilter.IdModule=82;//modulo
this._indicatormoduleSRMFilter.IdGroupCompany=1;
this._indicatormoduleSRMFilter.IdUser=-1;
this._indicatormoduleSRMFilter.IndIndicatorMain=1;//buscara los principales
this._indicatormoduleSRMFilter.IdBranchOffice=-1;//sucursal
this._indicatormoduleSRMFilter.IdCompany=-1;

}


PrepararFiltrosSRM(){
  //llenar filtros, filtro de dashboard detallado para cada indicador principal ya buscado
var item:IndicatorAnalyticsFilter;
if (this._DashboardDataModule!=null){
  this._DashboardDataModule.forEach(element => {
    element.idFilterType; 
    item=new IndicatorAnalyticsFilter();
    item.idIndicator=element.idIndicator;
    item.idFilterType=element.idFilterType;    
    this.AnalyticSRMFilter.indicators.push(item);    
       
   });  
   
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

  loadDataCategory2() {// grafico de categorias mas compradas 83

    
      let labelscategory=['Viveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'];
      let valuescategory=[200, 100, 100, 200, 60, 74, 800];
      let backgroundColorvalues= '#A0C4FF';   
   
    const data = {
      labels:labelscategory,
      datasets: [
          {             
              label: 'Cantidad de items',
              backgroundColor: backgroundColorvalues,
              data: valuescategory
          }
          
      ]
  };
      
    return data;
  }
  loadDataChartSimple(codIndicator:number) {// METODO PARA LLENAR GRAFICO DE BARRAS SIMPLES , UN SOLA BARRA

    let data: any;
   
    let labelscategory:string[]=[];
    let valuescategory:number[]=[];
    let backgroundColorvalues:string="";
    let result:ResultAnalytics[];
    let item :AnalyticSRM=new AnalyticSRM();
   
    let item2:string ;
    if (this._dataBD)//con data de BD
    {
      item=this._DashboardData.find(element => element.idIndicator ==codIndicator);//this.typeindicatorSRM.CategorysSalesSRM);
      debugger
     
      labelscategory=item.result[0].details.map(x=>x.etiqueta);
      valuescategory=item.result[0].details.map(x=>x.value);
    }else{//data local
      labelscategory=['Viveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'];
      valuescategory=[200, 100, 100, 200, 60, 74, 800];
      backgroundColorvalues='#A0C4FF';   
    }   
    data = {
      labels: labelscategory, 
            datasets: [
          {             
              label: 'Cantidad de items',
              backgroundColor: '#A0C4FF',
              data:valuescategory
          }
          
      ]
  };
      
    return data;
  }
//Dos barras
  loadDataBarDoble(codIndicator:number) {

    let data: any;
   
    let labelscategory:string[]=[];
    let label1,label2:string;
    let valuescategorySales:number[]=[];
    let valuescategoryPurchase:number[]=[];
    let backgroundColorvalues:string="";    
    let item :AnalyticSRM=new AnalyticSRM();
    
    if (this._dataBD)//con data de BD
    {
      item=this._DashboardData.find(element => element.idIndicator ==codIndicator);//this.typeindicatorSRM.CategorysSalesSRM);
      debugger
     
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
    
     // valuescategoryPurchase=item3.map(x=>x.map(y=>y.value));
    }else{//data local
      labelscategory=['Viveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'];
      valuescategoryPurchase=[200, 100, 100, 200, 60, 74, 800];
      valuescategorySales=[195, 78, 950.485, 200, 59, 70, 20];
     
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
  
  loadDataComprasVentas() {

    var arrayCategory:any[];
    arrayCategory=['Viveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'];
    const data = {
      labels:arrayCategory,
      datasets: [
          {
             
              label: 'Unidades vendidas',
              backgroundColor: '#A0C4FF',
              data: [200, 100, 1000.25, 200, 60, 74, 800]
          },
          {
             
              label: 'Unidades compradas',
              backgroundColor: '#FDFFB6',
              data: [195, 78, 950.485, 200, 59, 70, 20]
          }
      ]
  };
  return data;
}

Sales() {
  const data = {
      labels: ['ENE', 'FEB', 'MAR', 'ABR','MAY', 'JUN', 'JUL', 'AGO','SEP','OCT','NOV','DIC'],
    datasets: [
        {
          label: 'Índice de volumen de compra (%)',
          data: [17, 16, 15, 12,20, 21, 19, 18,17, 22, 25, 22],
          fill: false,
          borderColor: '#b0c2f2',
          tension: .5
        }]
    };
return data;
  }
loadDataDona() {
  const data = {
      labels: ['Autorizadas', 'Planificadas', 'Rechazadas', 'Recibidas'],
    datasets: [
        {
          label: 'Monto ($)',
          backgroundColor: '#b0c2f2',
          data: [250, 235, 230, 50],            
            hoverBackgroundColor: [
              '#A0C4FF'            
             
            ]
        }]
    };
return data;
}
  loadDataPie() {
    const data = {
        labels: ['Pedidos', 'Compras finalizadas', 'Recepciones en ejecucion', 'Devoluciones finalizadas'],
      datasets: [
          {
            data: [250, 235, 230, 5],
              backgroundColor: [
                  '#A0C4FF',
                  '#FDFFB6',
                  '#ffb4a2',
                  '#9bf6ff'
                  

              ],
              hoverBackgroundColor: [
                '#A0C4FF',
                '#FDFFB6',
                '#ffb4a2',
                '#9bf6ff'
               
              ]
          }]
      };
  return data;
  }
 
  applyLightThemedoughnut() {
    const basicOptions = {
        responsive: false,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 0,
        
        legend: {
            position: 'right',
            labels: {
                fontColor: '#495057'
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
        
        legend: {
            labels: {
                fontColor: '#495057'
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
createDashboard() {
  this.dashboardDataOperacion = [
    //Operacion
    { 'x': 0,  'y': 0, 'cols': 12, 'rows': 6, 'title': 'Porcentaje de recepciones en tiempo promedio', 'widgetType': widgetType.percentIndCond,
    'currentValue': 60, 'symbol':'%','target': 80,'mayor':1,'menor':0, 'valueVsTarget': 20, 'sublegend': 'Operadores' , 'image': 'assets/layout/images/dashboard/rateup.svg'},
    { 'x': 0,  'y':6, 'cols': 12, 'rows': 6, 'title': 'Órdenes recibidas perfectas','mayor':1,'menor':0, 'widgetType': widgetType.percentIndCond,
    'currentValue': 49,'symbol':'%','sublegend': 'Órdenes recibidas sin devoluciones ni fallas', 'target': 75, 'valueVsTarget': 26,'legend': 'Ordenes' , 'icon': 'pi-arrow-right','nroModal':0 ,'image': 'assets/layout/images/dashboard/rateup.svg'},
   
    {
      'x': 0,
      'y': 12, 
      'cols': 12,
      'rows': 12, 
      'title': 'Productos en punto de quiebre', 
      'widgetType': widgetType.dataviewListProduct,
      'data': this.dataListProducts,
      'codModal':1
      
  },
    {  'x': 0,  'y':21, 'cols': 12, 'rows': 9, 'title': 'Recepción de mercancía',  'widgetType': widgetType.listnumberindicator,
    'currentValue': 30,'targetValue': 10, 'legend': 'Ordenes' ,'data': this.indicatorsnumberVDR ,'nroModal':8, 'icon': 'pi-arrow-right'},
    { 'x': 0,  'y':30 , 'cols': 12, 'rows': 6, 'title': 'Operación','nroModal':0, 'widgetType': widgetType.chart,
    'chartType': chartType.pie ,'data': this.loadDataPie() , 'options': this.applyLightThemedoughnut() },

    {
      'x': 0,
      'y': 36, 
      'cols': 12,
      'rows': 12, 
      'title': 'Top 10 - Órdenes por operadores, último mes', 
      'widgetType': widgetType.dataviewList,
      'data': this.databuyers,
      'options': this.applyLightTheme()
  },
 
       
    ];
  //compras
  this.dashboardDataCompras = [
      //Compras
       //Indicadores con objetivos
     /*   { 'x': 0,  'y': 0, 'cols': 12, 'rows': 6, 'title': 'Volumen de compras vs ventas', 'nroModal': 0, 'widgetType': widgetType.targetInd,
       'currentValue': '21%', 'sublegend': 'Indice volumen de compras- mes en curso', 'caption': '', 'image': 'assets/layout/images/dashboard/compras2mini.png' },
      */ 
      { 'x': 0,  'y': 0, 'cols': 12, 'rows': 6, 'title': 'Volumen de compras vs ventas', 'widgetType': widgetType.percentIndCond,
       'currentValue': 19.55,'symbol':'%','sublegend': 'Índice volumen de compras- mes en curso', 'mayor':0,'menor':1,'target':21, 'valueVsTarget':2, 'icon': 'pi-arrow-right','nroModal':0, 'image': 'assets/layout/images/dashboard/rateequal.svg' },
   
     /*   { 'x': 0,  'y': 0, 'cols': 12, 'rows': 6, 'title': 'Volumen de compras en el mes', 'widgetType': widgetType.targetInd,
       'currentValue':28, 'target': 0, 'valueVsTarget': 0, 'legend': '3.000 $' , 'icon': 'pi-arrow-right','nroModal':0,'image':'assets/layout/images/dashboard/volumensales.svg' },
      */ 
      { 'x': 0,  'y': 6, 'cols': 12, 'rows': 6, 'title': 'Calidad de pedidos generados', 'widgetType': widgetType.percentIndCond,
      'sublegend': 'Índice de ordenes generadas sin fallas',  'currentValue': this._valueGoals.currentValue.toString()+'','symbol':'%', 'mayor':1,'menor':0,'target':this._valueGoals.target.toString(), 'valueVsTarget':this._valueGoals.valueVsTarget.toString()+'', 'legend': 'Últimos 3 meses' , 'icon': 'pi-arrow-right','nroModal':0, 'image': 'assets/layout/images/dashboard/rateequal.svg' },
         { 'x':0,  'y': 12, 'cols': 12, 'rows': 8, 'title': 'Volumen de compras por mes', 'widgetType': widgetType.chart,
         'chartType': chartType.line, 'data': this.Sales() , 'options': this.applyLightTheme(),'nroModal':0 }  ,
       { 'x': 0,  'y': 20, 'cols': 12, 'rows':8, 'title': 'Categorías más compradas-Último mes','nroModal':0, 'widgetType': widgetType.chart,
       'chartType': chartType.bar,'caption':'', 'data': this._dataCategorySales , 'options': this.applyLightTheme() },
       { 'x':0,  'y':28, 'cols': 12, 'rows':8, 'title': 'Unidades compradas vs unidades vendidas','nroModal':0, 'widgetType': widgetType.chart,
       'chartType': chartType.bar, 'data': this._dataCategoryUnitSalesVsPurchased , 'options': this.applyLightTheme() },
       {  'x': 0,  'y':36, 'cols': 12, 'rows': 9, 'title': 'Órdenes de compras',  'widgetType': widgetType.listnumberindicator,
    'currentValue': 30,'targetValue': 10, 'legend': 'Órdenes' ,'data': this.indicatorsnumberODC ,'nroModal':1, 'icon': 'pi-arrow-right'}
                    
        
     ];
 
  this.dashboardDataObjetivos=[
    //proveedores
    { 'x': 0,  'y':0, 'cols': 12, 'rows': 6, 'title': 'Nivel de cumplimiento de entrega', 'widgetType': widgetType.percentIndCond,
    'currentValue': 40,'symbol':'%','sublegend': 'Índice de despachos a tiempo', 'target':50,'mayor':0,'menor':1, 'valueVsTarget': 10,  'image': 'assets/layout/images/dashboard/rateup.svg'} ,  
    { 'x': 0,  'y':6, 'cols': 12, 'rows': 6, 'title': 'Devoluciones por proveedor', 'widgetType': widgetType.percentIndCond,
    'currentValue': 10,'mayor':0,'menor':1, 'target': 15,'symbol':'%','sublegend': 'Índice de devoluciones', 'valueVsTarget': 5,'image': 'assets/layout/images/dashboard/rateup.svg' },
         //Indicadores con objetivos
         {
          'x': 0,
          'y': 12, 
          'cols': 12,
          'rows': 12, 
          'title': 'Top 10 - Fiabilidad del proveedor', 
          'widgetType': widgetType.dataviewList,
          'data': this.datasuppliers,
          'options': this.applyLightTheme()
      },
         
      {  'x': 0,  'y': 24, 'cols': 12, 'rows': 9, 'title': 'Devoluciones',  'widgetType': widgetType.listnumberindicator,
      'currentValue': 25,'targetValue': 10,'nroModal':1, 'legend': 'Órdenes' ,'data': this.indicatorsnumberDEV , 'icon': 'pi-arrow-right'},
       
    ];

}
}
