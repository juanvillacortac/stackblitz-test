import { HttpErrorResponse } from '@angular/common/http';
import { Component,  OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { chartType } from 'src/app/models/common/chart-type';
import { Typeindicator } from 'src/app/models/common/type-indicator';
import { widgetType } from 'src/app/models/common/widget-type';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { DialogService } from 'primeng/dynamicdialog';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

import { IndicatorModuleFilter } from 'src/app/models/tms/dashboard/indicator-module-filter';
import { AnalyticSRM, AnalyticSRMFilter, IndicatorAnalyticsFilter, IndicatorXModuleSRM, IndicatorXModuleSRMFilter } from 'src/app/models/srm/dashboard-srm';
import { DashboardanalyticsService } from 'src/app/modules/srm/shared/services/dashboardanalytics/dashboardanalytics.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { EnumIndicatorSRM } from 'src/app/modules/srm/shared/Utils/enum-indicator-dashboard';
import { DashboardanalyticsMPCService } from 'src/app/modules/products/shared/services/dashboardanalytics-mpc/dashboardanalytics-mpc.service';
import { AnalyticsFilter } from 'src/app/models/ims/dashboard/analytics-filter';
import { AnalyticsIndicatorFilter } from 'src/app/models/tms/dashboard/analytics-indicator-filter';
import { EnumIndicatorMPC } from 'src/app/modules/products/shared/Utils/enum-indicator-dashboard-mpc';
import { RoleService } from 'src/app/modules/security/roles/shared/role.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { DashboardService } from 'src/app/modules/ims/dashboard/shared/service/dashboard.service';
import { RoleByUser } from 'src/app/models/security/RoleByUser';
import { AnalyticsResults } from 'src/app/models/tms/dashboard/analytics-results';
import { Analytics } from 'src/app/models/ims/dashboard/analytics';
import { AnalyticsTMS } from 'src/app/models/tms/dashboard/analytics';
@Component({
  selector: 'app-dashboard-general',
  templateUrl: './dashboard-general.component.html',
  styleUrls: ['./dashboard-general.component.scss'],
  providers: [DialogService]
})

export class DashboardGeneralComponent implements OnInit {
  
  constructor(private readonly dialogService: DialogsService,private RolUserService:RoleService, public loadingService: LoadingService,public  MPCDashboardService: DashboardanalyticsMPCService,public  _SRMDashboardService: DashboardanalyticsService,private branchofficeService: BranchofficeService,private messageService: MessageService,private _Authservice: AuthService,public  _dashboardService: DashboardService) { }
  private _DashboardData: any;
  AnalyticMPCFilter: AnalyticsFilter = new AnalyticsFilter();
  itemindicatorMPC: AnalyticsIndicatorFilter;
  image: string;
  displayedColumns: any[] = [];
  typeindicatorSRM: typeof EnumIndicatorSRM = EnumIndicatorSRM;
  typeIndicatorMPC: typeof EnumIndicatorMPC=EnumIndicatorMPC;
  currentValue:number = 0;
  _dataInventoryActiveProducts:any;
  legend = '';
  sublegend = '';
 target:number = 0;//objetivo
 valueVsTarget:number = 0;
 _dashboardDataModule: AnalyticsTMS[];
 _indicatorModuleFilter=new IndicatorModuleFilter();
 _indicatormoduleSRMFilter=new IndicatorXModuleSRMFilter();
 AnalyticSRMFilter=new AnalyticSRMFilter();
  _DashboardDataModuleSRM: IndicatorXModuleSRM[];
  url: string = '#';
  mayor: number = 0;
  _dataBD: boolean = true;
  menor: number = 0;
  symbol: string= '%';
  minHeight: number;
  titleout0: any;
  titleout1: any;
  titleout2: any;
  branchOfficeList: SelectItem[];
  optionsTime: any[];
  titleout3: any;
  titleout4: any;
  dashboardDataSRM: any;
  dashboardDataPLM: any;
  dashboardDataIMS: any;
  dashboardDataFMS: any;
  value2: any;
  selection: number;
  dashboardData:any;
  horizontalOptions:any;
  dashboardDataSales:any;
  dashboardDataBDSRM:any;
  dashboardDataBDIMS:any;
  dashboardDataBDMPC:any;  
  indicatorsnumberODC:Typeindicator[]=[];
  _dataCategoryUnitSalesVsPurchased:any;//grafico de barra doble de unidades vendidas x unidades compradas SRM
  _dataprofitabilityMPC:any;//gracfico de rentabilidad MPC
  _dataCategoryUnitReceivedVsSalesMPC:any;//grafico de barra doble de unidades recibidas x unidades vendidas MPC
  _dataSalesXBranchOfficeIMS:any;//ventas por sucursal de IMS
  _dataSalesXCompanyIMS:any;//ventas por compañia de IMS
  _dataLossRateXBranchOfficeIMS:any;
  _dataProductInventoyMotiveXBranchOfficeIMS:any;
  data: any;
  _typerol: any;

searchTypeRole()
{
  //this.RolUserService.getUserRoles(this._Authservice.currentCompany,this._Authservice.currentOffice).finally((data: RoleByUser[]) => {
    this.RolUserService.getUserRoles(this._Authservice.currentCompany,this._Authservice.idUser)
    .then((data)=>{
      this._typerol = data[0].idType;     
    },(error)=>{
      console.log(error);
    });

 
}

  loadData2() {
    this.dashboardData = {
      labels: ['Randy caraballo', 'Madelyn Leos', 'Amaranta hernández', 'Pedro pérez', 'Pedro páez', 'Omar marcano'],
      datasets: [
        {
          label: 'Cantidad de órdenes de compra-autorizadas',
          data: [65, 59, 80, 50, 41, 10],
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

  loadPercendSRM() {
    this.image = 'assets/layout/images/dashboard/ratedown.svg';
    this.currentValue = 40;
    this.legend = 'prueba';
    this.sublegend = 'Ýndice de despachos a tiempo';
    this.target = 50;//objetivo
    this.valueVsTarget = 10;
    this.url = '#';
    this.mayor = 0;
    this.menor = 1;
    this.symbol = '%';
  }

  //Obtener sucursales 
  loadBrancoffices() {
    var filter = new BranchofficeFilter();
    filter.idCompany = 1;
    this.branchofficeService.getBranchOfficeList(filter).subscribe((data: Branchoffice[]) => {
      data = data.sort((a, b) => a.branchOfficeName.localeCompare(b.branchOfficeName));
      this.branchOfficeList = data.map((item) => ({
        label: item.branchOfficeName,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las sucursales" });
    });
  }

//indicadores de IMS- Ventas _dashboardService

GetdataIndicatorsIMS()
{
  this.AnalyticMPCFilter.idCompany=this._Authservice.currentCompany;
  this.AnalyticMPCFilter.idBranchOffice=this.selection.valueOf();
  //this.itemindicatorMPC.idFilterType=
  this.AnalyticMPCFilter.indicators=this.getIndicatorToShowIMS();
  return this._dashboardService.getAnalyticsIndicators(this.AnalyticMPCFilter).toPromise().then(data => {
    this.dashboardDataBDIMS = data;
    
    
  }, (error: HttpErrorResponse) => {
  this.dialogService.errorMessage('Error dashboard', error?.error?.message ?? 'error_service'); 
  this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el indicador de  general." });
  this.loadingService.stopLoading(); 
}
  );
}
getIndicatorToShowIMS() {


  const widgetFilter:  AnalyticsIndicatorFilter[] = [];
 // widgetFilter.push( { idIndicator: 45,  idFilterType: 1, parameters: '' });//ventas x empresa
  widgetFilter.push( { idIndicator: 48,  idFilterType: -1, parameters: '' });//ventas x sucursal
  widgetFilter.push( { idIndicator: 50,  idFilterType: -1, parameters: '' });//indice de perdidas x empresa
  widgetFilter.push( { idIndicator: 52,  idFilterType: -1, parameters: '' });//Ventas x categoriax sucursal
  widgetFilter.push( { idIndicator: 79,  idFilterType: -1, parameters: '' });//indice de perdidas por sucursal
  widgetFilter.push( { idIndicator: 99,  idFilterType: -1, parameters: '' });//porcentaje de perdidas por motivos
  return widgetFilter;
}

//Indicadores de srm- Unidades compradas vs vendidas-caldad de pedidos

GetIndicatorsModulesSRM() {
 //1- preparAR EL FILTRO DE BUSQueda de los indicadores principales.
  this._indicatormoduleSRMFilter.IdModule=82;//modulo SRM
  this._indicatormoduleSRMFilter.IdGroupCompany=1;
  this._indicatormoduleSRMFilter.IdUser=-1;
  this._indicatormoduleSRMFilter.IndIndicatorMain=-1;//buscara los principales
  this._indicatormoduleSRMFilter.IdBranchOffice=-1;//sucursal
  this._indicatormoduleSRMFilter.IdCompany=this._Authservice.currentCompany;
  //2- consultar los indicadores principales de accuerdo al modulo
  return this._SRMDashboardService.getIndicatorsModuleSRM(this._indicatormoduleSRMFilter).toPromise().then(data => {
  this._DashboardDataModuleSRM = data;   
  var item:IndicatorAnalyticsFilter; 
       if (this._DashboardDataModuleSRM!=[]){          
    /*  this.AnalyticSRMFilter.indicators = this._DashboardDataModuleSRM.map((item) => ({
        idIndicator: item.idIndicator,
        idFilterType: item.idFilterType,
        parameters:null
        }));*/
        
      }  
    //llena los dashboard
   
 }/* , (error: HttpErrorResponse) => {
  //this.dialogService.errorMessage('mrp.processing_room.rooms', error?.error?.message ?? 'error_service');
  // this.loading = false;
  this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el indicador de balance general." });
  
 */
);
}
GetdataIndicatorSRM(){

  this.AnalyticSRMFilter.idSucursal=this._indicatormoduleSRMFilter.IdBranchOffice;
  return this._SRMDashboardService.getIndicatorsSRM(this.AnalyticSRMFilter).toPromise().then(data => {
    this.dashboardDataBDSRM = data;      
    
  }
  
  /* , (error: HttpErrorResponse) => {
    //this.dialogService.errorMessage('mrp.processing_room.rooms', error?.error?.message ?? 'error_service');
    // this.loading = false;
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el indicador de balance general." });
    
   */
  );  
}
//indicadores de MPC
GetIndicatorsMPC()
{
  this.AnalyticMPCFilter.idCompany=this._Authservice.currentCompany;
  this.AnalyticMPCFilter.idBranchOffice=this.selection.valueOf();
  //this.itemindicatorMPC.idFilterType=
  this.AnalyticMPCFilter.indicators=this.getIndicatorToShowMPC();
  return this.MPCDashboardService.getIndicatorsMPC(this.AnalyticMPCFilter).toPromise().then(data => {
    this.dashboardDataBDMPC = data;      
    
  }
  );
}
getIndicatorToShowMPC() {

  const widgetFilter:  AnalyticsIndicatorFilter[] = [];
  // widgetFilter.push( { idIndicator: 45,  idFilterType: 1, parameters: '' });//ventas x empresa
  /*  widgetFilter.push( { idIndicator: EnumIndicatorMPC.CategoryProfitableCompany,  idFilterType: -1, parameters: '' });//ventas x empresa
   widgetFilter.push( { idIndicator: EnumIndicatorMPC.CategoryProfitableOfficeBranch,  idFilterType: -1, parameters: '' });//indice de perdidas x empresa
   widgetFilter.push( { idIndicator: EnumIndicatorMPC.UnitSalesReceivedXCompany,  idFilterType: -1, parameters: '' });//Ventas x categoriax sucursal */
   widgetFilter.push( { idIndicator: EnumIndicatorMPC.ActiveInventoryProductsXOfficeBranch,  idFilterType: -1, parameters: '' });//indice de perdidas por sucursal x motivo
   widgetFilter.push( { idIndicator: EnumIndicatorMPC.UnitSalesReceivedXOfficeBranch,  idFilterType: -1, parameters: '' });//indice de perdidas por sucursal x motivo
  return widgetFilter;
}
//barras simples
loadDataChartSimple(codIndicator:number,dataAux:any) {// METODO PARA LLENAR GRAFICO DE BARRAS SIMPLES , UN SOLA BARRA

  let data: any;
 
  let labelscategory:string[]=[];
  let valuescategory:number[]=[];
  let backgroundColorvalues:string="";
  let result:AnalyticsResults[];
  let item :Analytics=new Analytics();
  let etiqueta:string;
 
  let item2:string ;
  if (this._dataBD)//con data de BD
  {
    item=dataAux.find(element => element.idIndicator ==codIndicator);//this.typeindicatorSRM.CategorysSalesSRM);
    debugger
   
    labelscategory=item.results[0].detailsResults.map(x=>x.etiqueta);
    valuescategory=item.results[0].detailsResults.map(x=>x.value);
    etiqueta=item.results[0].etiqueta;
  }else{//data local
    labelscategory=['Viveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'];
    valuescategory=[200, 100, 100, 200, 60, 74, 800];
    backgroundColorvalues='#A0C4FF';  
    etiqueta='Motivos de ajustes'; 
  }   
  data = {
    labels: labelscategory, 
          datasets: [
        {             
            label: etiqueta,
            backgroundColor: '#A0C4FF',
            data:valuescategory
        }
        
    ]
};
    
  return data;
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
    
    if (this._dataBD)//con data de BD
    {
      item=dataAux.find(element => element.idIndicator ==codIndicator);//this.typeindicatorSRM.CategorysSalesSRM);
      
     if(item.result!=null){
 //labelscategory=item.result[0].valuesLabels.map(x=>x.labels);
 labelscategory=item.result.map(x=>x.etiqueta);//categorias padre
      
 label1=item.result[0].labels[0].labelName;//compradas
 if(label1!="Sin datos" && label1!=null && label1!=undefined){
   label2=item.result[0].labels[1].labelName;//vendidas
   //  item3=item.result.map(x=>x.valuesLabels);

     item.result.forEach(element => {
       valuescategoryPurchase.push(element.valuesLabels[0].value);//compradas
       valuescategorySales.push(element.valuesLabels[1].value);//vendidas
     });
 }

     }
     
    
     // valuescategoryPurchase=item3.map(x=>x.map(y=>y.value));
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


  ngOnInit(): void {
    this.searchTypeRole();
    this.value2 = 1;    
    this.minHeight = 40;
    //this.loadPercendSRM();
    this.loadBrancoffices();
    this.selection=this._Authservice.currentOffice;//this.selection.valueOf();
    this.titleout0='Ventas';
    this.titleout1='SRM';
    this.titleout2='PLM';
    this.titleout3='IMS';
    this.titleout4='FMS';
 //buscar los indicadores pricipales 
 if(this._dataBD){
  this.loadingService.startLoading();
 // this.GetIndicatorsModulesSRM().finally(() => {//modulos de indicadores de SRM
    // this.GetdataIndicatorSRM().finally(() => {//Busqueda de indicadores de SRM
      this.GetIndicatorsMPC().finally(() => {//indicadores de MPC
        this.GetdataIndicatorsIMS().finally(() => {//indicadores de IMS
          //this.GetLoadIndicatorSRM();
          try{
            this.GetLoadIndicatorMPC();
            this.GetLoadIndicatorIMS();
            this.createDashboard(); 
            this.loadingService.stopLoading();
          }catch(error){
            this.loadingService.stopLoading();
              console.log('Error cargando dashboard', error.name);
           
          }
         
        });
     });
   // });
  //});
 }else{
  
  this._dataCategoryUnitSalesVsPurchased=this.loadDataBarDoble2('Unidades compradas','Unidades vendiddas');
  this._dataprofitabilityMPC=this.GetProfitableXCategory();//mpc rentabilidad, grafico de dona simple
  this._dataCategoryUnitReceivedVsSalesMPC=this.loadDataBarDoble('Unidades recibidas','Unidades vendidas');
   this.createDashboard(); 
 }

    this.optionsTime = [
      {title: 'Hoy', value: 0},
      {title: 'Este mes', value: 1},
      {title: 'Últimos 3 meses', value: 3},
      {title: 'Últimos 6 meses', value: 4}
  ];
  this.value2=1;
    this.horizontalOptions = {
      indexAxis: 'x',
      type: 'bar',
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
    this.loadData2();
    this.indicatorsnumberODC = [
      { id: 1,indicator: 'Planificadas',value:'10'},
      { id: 2,indicator: 'Rechazadas por proveedor',value:'1'},
      { id: 3,indicator: 'Recibidas',value:'26'},
      { id: 4,indicator: 'Por vencer',value:'5'},
      { id: 5,indicator: 'Autorizadas',value:'3'},
      { id: 6,indicator: 'En borrador',value:'39'},
  ];
  
  }

GetLoadIndicatorIMS(){
//LLenar indicadores de srm
if(this.dashboardDataBDIMS!=null){
  this._dataSalesXCompanyIMS = this.dashboardDataBDIMS.filter(x=>x.idIndicator==45 && x.idFilterType==-1);
  this._dataSalesXBranchOfficeIMS = this.dashboardDataBDIMS.filter(x=>x.idIndicator==48 && x.idFilterType==-1);
//this._dataLossRateXBranchOfficeIMS=this.dashboardDataBDIMS.filter(x=>x.idIndicator==79 && x.idFilterType==-1);//
this._dataProductInventoyMotiveXBranchOfficeIMS=this.loadDataChartSimple(99,this.dashboardDataBDIMS);//ajustes por perdida por sucursal

}
  }
GetLoadIndicatorSRM(){

  //LLenar indicadores de srm
  if(this.dashboardDataBDSRM!=null){
    this._dataCategoryUnitSalesVsPurchased=this.loadDataBarDobleBD(this.typeindicatorSRM.UnitSalesVsUnitspurchased,this.dashboardDataBDSRM);//srm
   
  }
       
}
GetLoadIndicatorMPC(){
  if(this.dashboardDataBDMPC!=null){
    this._dataInventoryActiveProducts=this.dashboardDataBDMPC.find(element => element.idIndicator ==this.typeIndicatorMPC.ActiveInventoryProductsXOfficeBranch);
// this._dataprofitabilityMPC=this.GetProfitableXCategoryDonaSimpleBarBD(this.typeIndicatorMPC.CategoryProfitableCompany,this.dashboardDataBDMPC);//mpc rentabilidad, grafico de dona simple
this._dataCategoryUnitReceivedVsSalesMPC=this.loadDataBarDobleBD(this.typeIndicatorMPC.UnitSalesReceivedXOfficeBranch,this.dashboardDataBDMPC);//mpc unidades vendidas vs recibidas


  }
 
}
  //Dos barras
  loadDataBarDoble2(label1: string, label2: string) {
    let data: any;

    let labelscategory:string[]=[];

    let valuescategorySales:number[]=[];
    let valuescategoryPurchase:number[]=[];

    labelscategory = ['Víveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'];
    valuescategoryPurchase = [200, 300, 50, 400, 240, 367, 100];
    valuescategorySales = [195, 123, 45, 300, 178, 123, 10];
    data = {
      labels: labelscategory, //categorias padre
      datasets: [
        {
          label: label1,
          backgroundColor: '#A0C4FF',
          data: valuescategorySales
        },
        {
          label: label2,
          backgroundColor: '#FDFFB6',
          data: valuescategoryPurchase
        }
      ]
    };
    return data;
  }

  //Dos barras
  loadDataBarDoble(label1: string, label2: string) {
    let data: any;
    let labelscategory: string[] = [];
    let valuescategorySales: number[] = [];
    let valuescategoryPurchase: number[] = [];

    labelscategory = ['Víveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'];
    valuescategoryPurchase = [200, 89, 100, 176, 230, 115, 80];
    valuescategorySales = [195, 78, 50.485, 132, 187, 70, 20];
    data = {
      labels: labelscategory, //categorias padre
      datasets: [
        {
          label: label1,
          backgroundColor: '#A0C4FF',
          data: valuescategorySales
        },
        {
          label: label2,
          backgroundColor: '#FDFFB6',
          data: valuescategoryPurchase
        }
      ]
    };
    return data;
  }
  
GetProfitableXCategory(){

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
GetProfitableXCategoryDonaSimpleBarBD(codIndicator:number,dataAux:any) {

  let data: any;
   
  let labelscategory:string[]=[];
  let valuescategory:number[]=[];
  let item :AnalyticSRM=new AnalyticSRM();
  item=dataAux.find(element => element.idIndicator ==codIndicator);//this.typeindicatorSRM.CategorysSalesSRM);
   if (item.result!=null)
   {
    labelscategory=item.result[0].details.map(x=>x.etiqueta);
    valuescategory=item.result[0].details.map(x=>x.value);
  
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
   }
   
    
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


  //#region Inventory Valuation
  loadInventoryValuationMetrics() {
    const data = {
      labels: [
        'Semana 1',
        'Semana 2',
        'Semana 3',
        'Semana 4',
        'Semana 5',
        'Semana 6',
        'Semana 7',
        'Semana 8'
      ],
      datasets: [{
        label: 'Entradas',
        backgroundColor: '#b0c2f2',
        fill: false,
        borderColor: '#b0c2f2',
        tension: .4,
        data: [
          10350,
          11500,
          8800,
          7300,
          9560,
          7485,
          5045,
          8000,
          6000,
          2000
        ]
      },
        {
          label: 'Salidas',
          backgroundColor: '#d8f8e1',
          fill: false,
          borderColor: '#d8f8e1',
          tension: .4,
          data: [
            12350,
            8500,
            10000,
            9000,
            7350,
            8350,
            6550,
            9550,
            6000,
            2000
          ]
        }
      ]
    };
    return data;
  }

  lineTheme() {
    const theme = {
      responsive: false,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 0,
      // plugins: {
      //   legend: {
      //     labels: {
      //       color: '#495057'
      //     }
      //   }
      // },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            display: true
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            display: true
          }
        }]
      }
    };
    return theme;
  }

  //#endregion

//#endregion


private loadTableSales() {
  return [
      { id: 1, category: 'Víveres', sales: 5,objective:7,percent:80 },
      { id: 2, category: 'Pasteleria', sales: 1.2,objective:1,percent:100 },
      { id: 3, category: 'Electrodomesticos',sales: 5,objective:8,percent:65 },
      { id: 4, category: 'Legumbres',sales: 8.5,objective:7,percent:100 },
      { id: 5, category: 'Accesorios', sales: 1.22,objective:3,percent:15 },
      { id: 6, category: 'Textil', sales: 5,objective:1,percent:50},
      { id: 7, category: 'Bebe', sales: 3,objective:5.50,percent:35 }
  ];
}
private getHeaderCollumnsName(name: string) {
  return `home.dashboard-general.table.${name}`;
}
private loadColumnsForSales() {
  return  this.displayedColumns = [
        {field: 'id', header: 'id', display: 'none', dataType: 'number'},
        {field: 'category', header:  'Categoria', display: 'table-cell', dataType: 'string'},
        {field: 'sales', header:  'Ventas', display: 'table-cell', dataType: 'number'},       
        
        {field: 'percent', header:  'Avance (%)', display: 'table-cell', dataType: 'numberPercent',numberIncreaseClass: true},
        {field: 'objective', header:  'Objetivo', display: 'table-cell', dataType: 'number'},
        
    ];
}
  createDashboard() {
var _currentvalue=0;
var target=0;
var valueVsTarget=0;
var _currentvalueLoss=0;
var targetLoss=0;
var valueVsTargetLoss=0;
if (this._dataInventoryActiveProducts.result!=null)
{
  this.currentValue=this._dataInventoryActiveProducts.result[0].currentValue;
  this.valueVsTarget=this._dataInventoryActiveProducts.result[0].porcentaje;
  this.legend=this._dataInventoryActiveProducts.result[0].indicator;
  this.target=this._dataInventoryActiveProducts.result[0].goal;

}

if (this._typerol==1)
{
  
   //productos
   this.dashboardDataPLM = [
    // //Indicadores con objetivos
    {
      'symbol': '%',
      'cols': 12,
      'rows': 6,
      'title': 'Porcentaje de productos activos sin inventario',
      'widgetType': widgetType.percentIndCond,
      'currentValue': this.currentValue,
      'target': this.target,
      'mayor': 0,
      'menor': 1,
      'valueVsTarget': this.valueVsTarget,
      'legend': this.legend,
      'sublegend': 'Productos en sucursal activos sin inventario',
      'icon': 'pi-arrow-right',
      'nroModal': 0,
      'image': 'assets/layout/images/dashboard/ratedown.svg'
    },
 /*    { 'cols': 12, 'rows': 6,'mayor':0,'menor':1, 'title': 'Productos ajustados por hurto', 'widgetType': widgetType.percentIndCond,
    'currentValue': 5, 'target': 20, 'valueVsTarget': 15,'sublegend': 'Ýtems ajustados por hurto, mes en curso' , 'icon': 'pi-arrow-right','nroModal':0 , 'image': 'assets/layout/images/dashboard/rateup.svg'},
  */  //  { 'cols': 12, 'rows': 6, 'title': 'Productos creados nunca recibidos', 'widgetType': widgetType.targetInd,
   //  'currentValue': 45,'sublegend': 'ítems creados, nunca recibidos' , 'image':'assets/layout/images/dashboard/producto (1).png', 'icon': 'pi-arrow-right','nroModal':0 },
    {
      'cols': 12,
      'rows': 10,
      'title': 'Unidades vendidas vs recibidas',
      'widgetType': widgetType.chart,
      'chartType': chartType.bar,
      'data': this._dataCategoryUnitReceivedVsSalesMPC,
      'options': this.applyLightTheme()
    }
/*  {
     'cols': 12,
    'rows': 6,
    'title': 'Top 5 productos mas vendidos',
    'widgetType': widgetType.dataviewList,
    'data': this.dataViewModelPLM,
    'options': this.applyLightTheme()
    }, */

];

//ventas por sucursal

if (this._dataSalesXBranchOfficeIMS[0].results.length>0){

  _currentvalue=this._dataSalesXBranchOfficeIMS[0].results.map(x => x.currentValue);
  target=this._dataSalesXBranchOfficeIMS[0].results.map(x => x.goal);
  valueVsTarget=this._dataSalesXBranchOfficeIMS[0].results.map(x => x.percent);
}

/* if (this._dataLossRateXBranchOfficeIMS[0].results.length>0){
  _currentvalueLoss=this._dataLossRateXBranchOfficeIMS[0].results.map(x => x.currentValue);
  targetLoss=this._dataLossRateXBranchOfficeIMS[0].results.map(x => x.goal);
  valueVsTargetLoss=this._dataLossRateXBranchOfficeIMS[0].results.map(x => x.percent);
} */
this.dashboardDataSales=[
{
'x': 0,
'y': 0,
'cols': 4,
'rows': 2,
'title': 'Ventas',
'symbol': 'K$',
'mayor': 1,
'menor': 0,
'widgetType': widgetType.percentIndCond,
'currentValue': _currentvalue,//this._dataSalesXBranchOfficeIMS[0].results.map(x => x.currentValue), 
'target': target,//this._dataSalesXBranchOfficeIMS[0].results.map(x => x.goal), 
'valueVsTarget':valueVsTarget, //this._dataSalesXBranchOfficeIMS[0].results.map(x => x.percent), 
'sublegend': 'Monto en ventas en sucursal',
'image': 'assets/layout/images/dashboard/rateup.svg'
},

// {
//   'cols': 4,
//   'rows':2,
//   'symbol': 'K$',
//   'mayor': 1,
//   'menor': 0,
//   'title': 'Valorizado de inventario',
//   'widgetType': widgetType.percentIndCond,
//   'currentValue': 495,
//   'target': 500,
//   'valueVsTarget': 99.13,
//   'sublegend': 'Monto en inventario disponible',
//   'image': 'assets/layout/images/dashboard/rateup.svg'
// },

//  {'cols': 4, 'rows': 2, 'title': 'Ventas por departamentos',
//         'widgetType': widgetType.tablesales, 'displayedColumns': this.loadColumnsForSales(),
//        'data': this.loadTableSales()  } 
/*   {
'cols': 4,
'rows': 2,
'title': 'Top 10 productos más vendidos',
'widgetType': widgetType.dataviewList,
'data': this.dataViewModelPLM
} */
];

//srm
this.dashboardDataSRM=[
//proveedores
{
  'cols': 12, 
  'rows': 6, 
  'title': 'Nivel de cumplimiento de entrega del proveedor', 
  'widgetType': widgetType.percentIndCond,
  'currentValue': 40,
  'symbol':'%',
  'sublegend': 'Ýndice de despachos a tiempo',
  'target':50,
  'mayor':0,
  'menor':1,
  'valueVsTarget': 10,
  'image': 'assets/layout/images/dashboard/rateup.svg'
},
//Compras
{ 
  'cols': 12,
  'rows': 6, 
  'title': 'Volumen de compras vs ventas', 
  'widgetType': widgetType.percentIndCond,
  'currentValue': 19.55,
  'symbol':'%',
  'sublegend': 'Ýndice volumen de compras', 
  'mayor':0,
  'menor':1,
  'target':21, 
  'valueVsTarget':2, 
  'icon': 'pi-arrow-right',
  'nroModal':0, 
  'image': 'assets/layout/images/dashboard/rateequal.svg' 
},
{ 
  'cols': 12, 
  'rows': 10, 
  'title': 'Rentabilidad por categorías (%)', 
  'widgetType': widgetType.chart,
  'chartType': chartType.doughnut, 
  'data': this._dataprofitabilityMPC, 
  'options': this.applyLightThemedoughnut() 
},
{ 
  'cols': 12, 
  'rows':10, 
  'title': 'Unidades compradas vs unidades vendidas',
  'nroModal':0, 
  'widgetType': widgetType.chart,
  'chartType': chartType.bar, 
  'data': this._dataCategoryUnitSalesVsPurchased, 
  'options': this.applyLightTheme() 
}
];
//ims
this.dashboardDataIMS=[
/*  {
'cols': 4,
'rows': 2,
'symbol': '%',
'mayor':0,
'menor':1,       
'title': 'Precisión de inventario',
'widgetType': widgetType.percentIndCond,
'currentValue': '98,07',
'target': '99,99',
'valueVsTarget': '1,92',
'sublegend': 'Porcentaje de precisión',
'image': 'assets/layout/images/dashboard/rateup.svg'
}, */
{ 'x':0,  'y':4, 'cols': 12, 'rows':6, 'title': 'Porcentaje de ajustes por motivos','nroModal':0, 'widgetType': widgetType.chart,
'chartType': chartType.bar, 'data': this._dataProductInventoyMotiveXBranchOfficeIMS , 'options': this.applyLightTheme() }
/* {
'x': 0,
'y': 4,
'cols': 4,
'rows':2,
'symbol': '%',
'mayor':0,
'menor':1,
'title': 'Pérdidas',
'widgetType': widgetType.percentIndCond,
'currentValue': _currentvalueLoss,
'target': targetLoss,
'valueVsTarget': valueVsTargetLoss,
'sublegend': 'Ajustes por motivos de pérdida',
'image': 'assets/layout/images/dashboard/rateup.svg'
} */
/* {
'cols': 12,
'rows': 10,
'title': 'Movimientos de inventario por semana',
'widgetType': widgetType.chart,
'chartType': chartType.line,
'data': this.loadInventoryValuationMetrics(),
'options': this.lineTheme()
} */
];

}else{

   //productos
   this.dashboardDataPLM = [
    // //Indicadores con objetivos
    { 'x': 0,  'y': 0,'symbol':'%', 'cols': 12, 'rows': 6, 'title': 'Porcentaje de productos activos sin inventario', 'widgetType': widgetType.percentIndCond,
    'currentValue': this.currentValue, 'target':this.target, 'mayor':0,'menor':1,'valueVsTarget': this.valueVsTarget, 'legend': 'Sin inventario' ,'sublegend': 'Productos en sucursal activos sin ningun empaque con inventario', 'icon': 'pi-arrow-right','nroModal':0 , 'image':'assets/layout/images/dashboard/ratedown.svg'},
 /*    { 'x': 0,  'y':6, 'cols': 12, 'rows': 6,'mayor':0,'menor':1, 'title': 'Productos ajustados por hurto', 'widgetType': widgetType.percentIndCond,
    'currentValue': 5, 'target': 20, 'valueVsTarget': 15,'sublegend': 'Ítems ajustados por hurto, mes en curso' , 'icon': 'pi-arrow-right','nroModal':0 , 'image': 'assets/layout/images/dashboard/rateup.svg'},
  */  //  { 'x': 0,  'y':12, 'cols': 12, 'rows': 6, 'title': 'Productos creados nunca recibidos', 'widgetType': widgetType.targetInd,
   //  'currentValue': 45,'sublegend': 'ítems creados, nunca recibidos' , 'image':'assets/layout/images/dashboard/producto (1).png', 'icon': 'pi-arrow-right','nroModal':0 },      
  
   
//           { 'cols':12, 'rows': 10, 'title': 'Unidades vendidas vs recibidas', 'widgetType': widgetType.chart,
// 'chartType': chartType.bar, 'data': this._dataCategoryUnitReceivedVsSalesMPC , 'options': this.applyLightTheme() }
/*  {
'cols': 12,
'rows': 6,
'title': 'Top 5 productos mas vendidos',
'widgetType': widgetType.dataviewList,
'data': this.dataViewModelPLM,
'options': this.applyLightTheme()
}, */

];
//ims
this.dashboardDataIMS=[
  /*  {
  'cols': 4,
  'rows': 2,
  'symbol': '%',
  'mayor':0,
  'menor':1,       
  'title': 'Precisión de inventario',
  'widgetType': widgetType.percentIndCond,
  'currentValue': '98,07',
  'target': '99,99',
  'valueVsTarget': '1,92',
  'sublegend': 'Porcentaje de precisión',
  'image': 'assets/layout/images/dashboard/rateup.svg'
  }, */
  { 'x':0,  'y':4, 'cols': 12, 'rows':6, 'title': 'Cantidad de ajustes por motivos','nroModal':0, 'widgetType': widgetType.chart,
'chartType': chartType.bar, 'data': this._dataProductInventoyMotiveXBranchOfficeIMS , 'options': this.applyLightTheme() }
  /* {
  'x': 0,
  'y': 4,
  'cols': 4,
  'rows':2,
  'symbol': '%',
  'mayor':0,
  'menor':1,
  'title': 'Pérdidas',
  'widgetType': widgetType.percentIndCond,
  'currentValue': 10,
  'target': 15,
  'valueVsTarget': 5,
  'sublegend': 'Ajustes por motivos de pérdida',
  'image': 'assets/layout/images/dashboard/rateup.svg'
  } */
  /* {
  'cols': 12,
  'rows': 10,
  'title': 'Movimientos de inventario por semana',
  'widgetType': widgetType.chart,
  'chartType': chartType.line,
  'data': this.loadInventoryValuationMetrics(),
  'options': this.lineTheme()
  } */
  ];

}

 

  }
}
