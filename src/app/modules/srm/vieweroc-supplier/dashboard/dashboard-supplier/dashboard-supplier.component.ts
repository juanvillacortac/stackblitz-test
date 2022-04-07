import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { chartType } from 'src/app/models/common/chart-type';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { Typeindicator } from 'src/app/models/common/type-indicator';
import { widgetType } from 'src/app/models/common/widget-type';
import { AnalyticSRM, AnalyticSRMFilter, IndicatorAnalyticsFilter,IndicatorXModuleSRMFilter,IndicatorXModuleSRM, ResultAnalytics, ResultAnalyticsDetails, ValuesLabelAnalytics } from 'src/app/models/srm/dashboard-srm';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { FilterPurchaseOrder } from '../../../shared/filters/filter-purchase-order';
import { DashboardanalyticsService } from '../../../shared/services/dashboardanalytics/dashboardanalytics.service';
import { EnumIndicatorSRM } from '../../../shared/Utils/enum-indicator-dashboard';
import { Suppliermodal } from '../../../shared/view-models/common/suppliermodal';

@Component({
  selector: 'app-dashboard-supplier',
  templateUrl: './dashboard-supplier.component.html',
  styleUrls: ['./dashboard-supplier.component.scss']
})
export class DashboardSupplierComponent implements OnInit {
  @Input("supplierstring") supplierstring: string = "";
  optionsTime: any[];
  _dataBD:boolean=false;
  paginator: boolean = false;  
  dataViewModel: DataviewModel = new DataviewModel();
  dataViewListModel: any;
  dataproducts: any;
  dataCategorySales: any;
  dataTrademarksSales:any;
  dashboardData: any;
  dashboardData3:any;
  dashboardData2:any;
  SupplierDialogVisible = false;
  basicData: any;
  titleout1: any;
  titleout2: any;
  titleout3: any;
  basicData2:any;  
  value2:any;
  Listsuppliers:any[];
  _indicatormoduleSRMFilter=new IndicatorXModuleSRMFilter();
  _indicatorxmoduleSRM=new IndicatorXModuleSRM();
  _DashboardData:AnalyticSRM[];
  _DashboardDataModule: IndicatorXModuleSRM[];
  typeindicatorSRM: typeof EnumIndicatorSRM = EnumIndicatorSRM;
  private dialogService: DialogsService;
  AnalyticSRMFilter=new AnalyticSRMFilter();
  dashboardDataFiabilidad:any;
  ListTypeindicatorsBranch:Typeindicator[];
  ListTypeindicatorsCompany:Typeindicator[];
  ListTypeindicatorsDev:Typeindicator[];
  selectedsupplier: string;
  
  constructor(private _selectorService: CurrentOfficeSelectorService,public loadingService: LoadingService, private messageService: MessageService,public breadcrumbService: BreadcrumbService,public  _SRMDashboardService: DashboardanalyticsService) {
    this._selectorService.setSelectorType(EnumOfficeSelectorType.company);
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'SCM',routerLink: ['/srm/dashboard-general-srm']  },
      { label: 'Proveedores', routerLink: ['/srm/dashboard-supplier'] }
    ]);
   

   }
clearfilter(){

  this.supplierstring = "";
}



OnSupplierslist(supplier:Suppliermodal){
//this.supplierstring=supplier;
console.log(supplier);

}
  ngOnInit(): void {
    this.value2=1;
    this.optionsTime = [
      {title: 'Este mes', value: 1},
      {title: 'Últimos 3 meses', value: 3},
      {title: 'Últimos 6 meses', value: 4}
  ];
    this.Listsuppliers = [
      {name: 'ALIMENTOS POLAR', code: '2'},
      {name: 'PESPICOLA VENEZUELA CA', code: '4'},
      {name: 'INNVERSIONES EL TELAR', code: '6'},
      {name: 'PROCTER&GAMBEL CA', code: '8'},
      {name: 'PROVEEDOR PRUEBA', code: '10'}
    ];
    this.selectedsupplier="2";//codigo del proveedor pendiente aqui
    this.titleout1='Ventas';
    this.titleout2='Pedidos';
    this.titleout3='Catálogo';
    this.loadDataFiabilidad();
    this.titleout1='Proveedor';
    //devoluciones
    this.ListTypeindicatorsDev = [
      { id: 1,indicator: 'Registradas',value:'35'},
      { id: 2,indicator: 'Por entregar',value:'3'},
      { id: 3,indicator: 'Entregadas',value:'12'},
      { id: 4,indicator: 'Anuladas',value:'2'},
      { id: 5,indicator: 'Pendientes',value:'1'}
     
     
  ];
    this.ListTypeindicatorsBranch = [
      { id: 1,indicator: 'Con inventario',value:'10'},
      { id: 2,indicator: 'Con referencia',value:'300'},
      { id: 3,indicator: 'Ítems comprados',value:'200'},
      { id: 4,indicator: 'Ítems en catálogo',value:'1050'},
      { id: 5,indicator: 'Ítems sin compra',value:'130'},
      { id: 6,indicator: 'Ítems fuera de catálogo',value:'189'},
     
  ];

  this.ListTypeindicatorsCompany = [
    { id: 1,indicator: 'En revisión',value:'3'},
    { id: 2,indicator: 'Revisadas',value:'10'},
    { id: 3,indicator: 'Pendiente por revisión',value:'2'},
    { id: 4,indicator: 'Recibidas',value:'55'},
    { id: 5,indicator: 'Recibida con fallas',value:'12'},
    { id: 6,indicator: 'Autorizadas',value:'23'}
   
   
];
this.loadingService.stopLoading();
this._dataBD=true;
 //buscar los indicadores pricipales 
 if( this._dataBD){
   debugger
  this.GetIndicatorsModulesSRM().finally(() => {
    this.GetdataIndicatorSRM().finally(() => {
     // this.searchTop(this.typeindicatorSRM.TopSupplier);//top de proveedor
this.dataCategorySales=this.loadDataPie(this.typeindicatorSRM.UnitSalesCatgorysCompanySupplier);
this.dataTrademarksSales=this.loadDataPie(this.typeindicatorSRM.brandsSalesSupplier);
     // this._dataCategoryUnitSalesVsPurchased=this.loadDataBarDoble(this.typeindicatorSRM.UnitSalesVsUnitspurchased);//top de proveedor
    //this._valueGoals=this.goalsObjectives(this.typeindicatorSRM.orderQuality);
    //this.loaddataindicators(this.typeindicatorSRM.statusReception);
     // this.loadDataTopSuppliers();
     // this.searchTop(this.typeindicatorSRM.TopOperators);//TOP DE OPERADORES todavia no esta en BD
      this.loadingService.stopLoading();
       this.createDashboard(); 
     
    });
   
  });

 }else{

  this.dataCategorySales=this.loadDataPie(this.typeindicatorSRM.UnitSalesCatgorysCompanySupplier);

  this.basicData2=this.loadData();
  this.createDashboard();
 }

  }

  //top proveedores y top de operadores
searchTop(codIndicator:number){
 
   
  let item :AnalyticSRM=new AnalyticSRM();
  
if (this._dataBD)
{

item=this._DashboardData.find(element => element.idIndicator ==codIndicator);//this.typeindicatorSRM.CategorysSalesSRM);
debugger  
var i=0;
let item2:DataviewListModel;
let lista: DataviewListModel[]=[];
this.dataViewModel.codModal=1;
this.dataViewModel.codModalImg=2;
this.dataViewModel.linkTitleIn=true;
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
 
  item2.name=element.etiqueta;
  item2.mainDescription=element.values.value1.toString()+' %';
  item2.secundaryDescription='Fiabilidad del proveedor';
  item2.secundaryDescriptionSide=element.values.value2;//rif
  item2.mainDescriptionSide=i.toString();
 lista.push(item2);    

});
debugger
this.dataViewModel.dataviewlist=lista;
}else
{//top de proveedores
// if (codIndicator==this.typeindicatorSRM.TopSupplier)
//this.loadDataTopSuppliers();//carga los proveedores en le dashboard
 //top de operadores*(comercializacion) 
// if(codIndicator==this.typeindicatorSRM.TopOperators){
  //this.loadDataTopbuyers() ;
}


}





  filterIndicatorModule(){

    this._indicatormoduleSRMFilter.IdModule=83;//modulo ded proveedores
    this._indicatormoduleSRMFilter.IdGroupCompany=1;
    this._indicatormoduleSRMFilter.IdUser=-1;
    this._indicatormoduleSRMFilter.IndIndicatorMain=1;//buscara los principales
    this._indicatormoduleSRMFilter.IdBranchOffice=-1;//sucursal
    this._indicatormoduleSRMFilter.IdCompany=-1;
    
    }

    GetdataIndicatorSRM(){

      this.AnalyticSRMFilter.idSucursal=this._indicatormoduleSRMFilter.IdBranchOffice;
      
      debugger
      return this._SRMDashboardService.getIndicatorsPRV(this.AnalyticSRMFilter).toPromise().then(data => {
        this._DashboardData = data;      
        //this._dataCategorySales=this.loadDataChartSimple(this.typeindicatorSRM.CategorysSalesSRM);//grafico de categorias mas vendidas 
      }
      
      /* , (error: HttpErrorResponse) => {
        //this.dialogService.errorMessage('mrp.processing_room.rooms', error?.error?.message ?? 'error_service');
        // this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el indicador de balance general." });
        
       */
      );  
   }

  GetIndicatorsModulesSRM() {

    this.filterIndicatorModule();//1- preparAR EL FILTRO DE BUSQueda de los indicadores principales.
    //2- consultar los indicadores principales de accuerdo al modulo
    return this._SRMDashboardService.getIndicatorsModuleSRM(this._indicatormoduleSRMFilter).toPromise().then(data => {
   debugger
      this._DashboardDataModule = data;   
    var item:IndicatorAnalyticsFilter; 
         if (this._DashboardDataModule!=[]){          
        this.AnalyticSRMFilter.indicators = this._DashboardDataModule.map((item) => ({
          idIndicator: item.idIndicator,
          idFilterType: item.idFilterType,
          parameters:{idSupplier:parseInt(this.selectedsupplier)}
          }));
          
        }  
      ;//llena los dashboard
     
   }
  );
   }

  searchProductsTop() {
    this.searchProducts();
    this.dataproducts = this.dataViewModel;
    return this.dataproducts;
  }
  loadDataFiabilidad() {
    this.dashboardDataFiabilidad = {
      labels: ['Calidad de pedido', 'Entregas a tiempo', 'Órdenes recibidas completas'],
      datasets: [
          {
              label: 'Cantidad de órdenes',
              data: [65, 59, 80],
              backgroundColor: '#b0c2f2',             
            hoverBackgroundColor: [
                '#A0C4FF'               
                
            ]
          },
      ]
  };
 
}
onToggleSupplier(visible: boolean) {
  debugger
  this.SupplierDialogVisible = visible;
}
  searchProducts(){

    this.dataViewModel = {   
      imagePathEmpaque: 'assets/layout/images/empaque.png',
      imagePathAvatar:'assets/layout/images/avatar-unisex.jpg',
      linkTitleIn:false,
      codModal:0,
      codModalImg:0,
      dataviewlist:[
        { id: 1,image: true,mainDescription:'1500.33$',mainDescriptionSide:'1',name:'Harina pan 1kg',secundaryDescription:'Monto vendido',secundaryDescriptionSide:'',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/harina_pan_27092021_10:16:50202109271016505876'},      
        { id: 2,image: true,mainDescription:'1199.99$',mainDescriptionSide:'2',name:'Lechuga romana',secundaryDescription:'Monto vendido',secundaryDescriptionSide:'',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/te-lechuga-propiedades_20082021_16:48:36202108201648366218'},
        { id: 3,image: true,mainDescription:'1144$',mainDescriptionSide:'3',name:'Aguacate injerto',secundaryDescription:'Monto vendido',secundaryDescriptionSide:'',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/aguacate_10092021_12:41:27202109101241275947'},
        { id: 4,image: true,mainDescription:'1200$',mainDescriptionSide:'4',name:'Café molido madrid',secundaryDescription:'Monto vendido',secundaryDescriptionSide:'',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/IMG-20191029-WA0129_27092021_11:11:03202109271111038934'},
        { id: 4,image: true,mainDescription:'1000$',mainDescriptionSide:'5',name:'Brócoli',secundaryDescription:'Monto vendido',secundaryDescriptionSide:'',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/brocoli_10092021_12:41:05202109101241060716'},
        { id: 5,image: true,mainDescription:'995$',mainDescriptionSide:'6',name:'Cebolla blanca',secundaryDescription:'Monto vendido',secundaryDescriptionSide:'',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/pngwing_10092021_12:36:45202109101236460273'},
        { id: 6,image: true,mainDescription:'885$',mainDescriptionSide:'7',name:'Papa amarilla lavada',secundaryDescription:'Monto vendido',secundaryDescriptionSide:'',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/batata_10092021_12:40:43202109101240436252'},
        { id: 7,image: true,mainDescription:'775$',mainDescriptionSide:'8',name:'Harina de trigo 1kgr',secundaryDescription:'Monto vendido',secundaryDescriptionSide:'',imagePath:'assets/layout/images/dashboard/Harina2.jpg'},
        { id: 8,image: true,mainDescription:'665$',mainDescriptionSide:'9',name:'Arroz mary 1kg',secundaryDescription:'Monto vendido',secundaryDescriptionSide:'',imagePath:'assets/layout/images/dashboard/harina_pan.jpg'},
        { id: 9,image: true,mainDescription:'45$',mainDescriptionSide:'10',name:'Caraotas negras pantera',secundaryDescription:'Monto vendido',secundaryDescriptionSide:'',imagePath:'https://gruposigo1.s3.amazonaws.com/empresa0/mpc/productos/imagen/CaraotasNegras900gr_1080x_27092021_11:19:44202109271119443037'},
        
    ]
    }
  }
  
  loadData() {
    const data = {
      labels: ['Víveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'],
      datasets: [
          {
             
              label: 'Existencia',
              backgroundColor: '#dfe7fd',
              data: [200, 100, 1000.256, 200, 60, 74, 800]
          },
          {
             
              label: 'Unidades vendidas',
              backgroundColor: '#fde2e4',
              data: [195, 78, 950.485, 200, 59, 70, 20]
          }
      ]
  };
  return data;
}

applyLightTheme() {
  const basicOptions = {
      responsive: false,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 0,
      indexAxis: 'y',
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

loadDataPie(codIndicator:number) {
  //let data: any;
   
  let labelscategory:string[]=[];
  let label1,label2:string;
  let valuescategorySales:number[]=[];
 
  let backgroundColorvalues:string="";    
  let item :AnalyticSRM=new AnalyticSRM();

  if (this._dataBD)//con data de BD
  {
    item=this._DashboardData.find(element => element.idIndicator ==codIndicator);//this.typeindicatorSRM.CategorysSalesSRM);
    debugger
    if(item.result!=null)
    {

      labelscategory=item.result[0].details.map(x=>x.etiqueta);
      valuescategorySales=item.result[0].details.map(x=>x.value);
       
    }
  
   
  }else{//data local
    labelscategory=['Víveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'];
   
    valuescategorySales=[195, 78, 950.485, 200, 59, 70, 20];
   
  }   

  const data = {
    labels: labelscategory,
    datasets: [
        {
          data: valuescategorySales,
            backgroundColor: [
                '#A0C4FF',
                '#FDFFB6',
                '#ffb4a2',
                '#9bf6ff',
                '#8ecae6',
                '#72efdd',
                '#dfe7fd'
                
            ],
            hoverBackgroundColor: [
              '#A0C4FF',
              '#FDFFB6',
              '#ffb4a2',
              '#9bf6ff',
              '#8ecae6',
              '#72efdd',
              '#dfe7fd'
            ]
        }]
    };
return data;
}
  createDashboard() {
    
    this.dashboardData = [
    //primera linea graficos ventas de los productos de un proveedor en particular en la empresa
    { 'x': 0,  'y':0, 'cols': 12, 'rows': 6, 'title': 'Monto general en productos', 'widgetType': widgetType.targetInd,
    'currentValue': '2.5K $', 'sublegend': 'Monto total de ventas - último mes', 'image': 'assets/layout/images/dashboard/camion.png' },
    { 'x':0,  'y': 6, 'cols':12, 'rows': 10, 'title': 'Marcas más vendidas (%)', 'widgetType': widgetType.chart,
   'chartType': chartType.doughnut, 'data': this.dataTrademarksSales ,'nroModal':0, 'options': this.applyLightThemedoughnut() },                 
  //segunda linea
  { 'x': 0,  'y':14 , 'cols': 12, 'rows': 8, 'title': 'Categorías más vendidas','nroModal':9, 'widgetType': widgetType.chart,
  'chartType': chartType.pie ,'data': this.dataCategorySales , 'options': this.applyLightThemedoughnut() },
          
    ];
    this.dashboardData2 = [
        //primera linea graficos 
        { 'x': 0,  'y':0, 'cols': 12, 'rows': 6, 'title': 'Órdenes recibidas completas', 'widgetType': widgetType.targetInd,
        'currentValue': 35, 'sublegend': 'Recibidas sin faltantes', 'image': 'assets/layout/images/dashboard/inventario.png' },
     
      //primera linea graficos 
      { 'x': 0,  'y':6, 'cols': 12, 'rows': 6, 'title': 'Cumplimiento de entrega', 'widgetType': widgetType.targetInd,
      'currentValue': 14,'sublegend': 'Recibidas en fecha planificada', 'image': 'assets/layout/images/dashboard/entrega-logistica (2).png' },
      
      { 'x': 0,  'y': 6, 'cols': 12, 'rows':8, 'title': '% Fiabilidad','nroModal':0, 'widgetType': widgetType.chart,
      'chartType': chartType.bar, 'data': this.dashboardDataFiabilidad , 'options': this.applyLightTheme() },
  
        {  'x': 4,  'y':18, 'cols': 12, 'rows':12, 'title': 'Órdenes de compra',  'widgetType': widgetType.listnumberindicator,
        'currentValue': 20,'targetValue': 10, 'legend': 'Ordenes' ,'data': this.ListTypeindicatorsCompany ,'nroModal':6, 'icon': 'pi-arrow-right'},
       //3era linea
        {  'x':0,  'y':22, 'cols': 12, 'rows':10, 'title': 'Devoluciones',  'widgetType': widgetType.listnumberindicator,
        'currentValue': 20,'targetValue': 10, 'data': this.ListTypeindicatorsDev ,'nroModal':0, 'icon': 'pi-arrow-right'},
        
  ];
  this.dashboardData3 = [
    
      //primera linea graficos 
      { 'x': 0,  'y':0, 'cols': 12, 'rows': 6, 'title': 'Órdenes revisadas', 'widgetType': widgetType.targetInd,
      'currentValue': 14,'sublegend': 'Cantidad de órdenes revisadas','nroModal':7,'image': 'assets/layout/images/dashboard/ordenrevisada.png' },
        { 'x': 0,  'y': 6, 'cols': 12, 'rows': 10, 'title': 'Unidades vendidas vs existencias','nroModal':0, 'widgetType': widgetType.chart,
        'chartType': chartType.bar, 'data': this.loadData() , 'options': this.applyLightTheme() },
       {  'x': 0,  'y':12, 'cols': 12, 'rows':8, 'title': 'Productos',  'widgetType': widgetType.listnumberindicator,
      'legend': 'Ordenes' ,'data': this.ListTypeindicatorsBranch ,'nroModal':0, 'icon': 'pi-arrow-right'},
      {
        'x': 0,
        'y':18, 
        'cols': 12,
        'rows': 12, 
        'title': 'Top 10 de productos en catálogo más vendidos - último mes', 
        'widgetType': widgetType.dataviewList,
        'data': this.searchProductsTop(),
        'nroModal':0
    }
];

      
  }

}
