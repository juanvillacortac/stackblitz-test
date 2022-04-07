import { HttpErrorResponse } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { BreadcrumbService } from "src/app/design/breadcrumb.service";
import { chartType } from "src/app/models/common/chart-type";
import { DataviewListModel } from "src/app/models/common/dataview-list-model";
import { DataviewModel } from "src/app/models/common/dataview-model";
import { widgetType } from "src/app/models/common/widget-type";
import { AnalyticFinancial, AnalyticFinancialFilter, IndicatorAnalyticsFilter, IndicatorsFMSxModulesFilter } from "src/app/models/financial/AnalyticFinancial";
import { Branchoffice } from "src/app/models/masters/branchoffice";
import { LoadingService } from "../../common/components/loading/shared/loading.service";
import { AuthService } from "../../login/shared/auth.service";
import { BranchofficeFilter } from "../../masters/branchoffice/shared/filters/branchoffice-filter";
import { BranchofficeService } from "../../masters/branchoffice/shared/services/branchoffice.service";
import { FinancialDashboardService } from "./shared/services/financial-dashboard.service";

@Component({
  selector: "app-financial-dashboard",
  templateUrl: "./financial-dashboard.component.html",
  styleUrls: ["./financial-dashboard.component.scss"],
})

export class FinancialDashboardComponent implements OnInit {
  basicOptions: any;
  @Input() dashboardData: any;
  @Input() displayModal: boolean;
  AnalyticFinancialFilter = new AnalyticFinancialFilter();
  IndicatorsFMSxModulesFilter = new IndicatorsFMSxModulesFilter();

  balanceSheet: any
  balanceSheetDetail: any
  balanceSheetPartida: any
  currentPreviousProfitability:AnalyticFinancial[] = [];
  ProfitabilityTemp=[];
  profitabilityByPeriods: any
 

  dataViewModelTopSuppliers: DataviewModel = new DataviewModel();
  dataViewModelTopClients: DataviewModel = new DataviewModel();
  suppliersProfile: DataviewListModel[] = [];
  behaviorSales: AnalyticFinancial[] = [];
  behaviorBuy: AnalyticFinancial[] = [];
  variationClients: AnalyticFinancial[] = [];
  variationSuppliers: AnalyticFinancial[] = [];
  behaviorPurchasing: any
  topClientsData: any
  topSuppliers: any
  behaviorRevenue: any
  behaviorPaymentsSuppliers: any
  dashboardData1: any;
  dashboardData2: any;
  dashboardData3: any;
  dashboardData4: any;

  titleout5: string = "";
  titleout6: string = "";
  titleout7: string = "";
  titleout8: string = "";

  
  displayedColumns: any[] = [];
  colors = {
    red: "#F38BA0",
    lightRed: "#f5a7b7",
    green: "#70AF85",
    yellow: "#FFEB99",
    blue: "#98D6EA",
    lightBlue: "#b0dfef",
    grey: "#6D8299",
    purple: "#BEAEE2",
    orange: "#F39189",
    brown: "#DEBA9D"
  };

 
 

  dataproducts: any;
  dataViewModel: any;
  etiketa: string = "";
  data2: any
  displayedColumnsBalanceSheet: { field: string; header: string; display: string; dataType: string; }[];
  displayedColumnsTopSuppliers: { field: string; header: string; display: string; dataType: string; }[];
  displayedColumnsTopClients: { field: string; header: string; display: string; dataType: string; }[];
  dashboardData5: any
  dashboardData6: any

  dashboardData8: any
  titleout10: string;
  titleout9: string;
  dashboardData7: any;
  Indicators: IndicatorAnalyticsFilter[];
  DataIndicators: AnalyticFinancial[];
  byPeriods: any[] = []
  titleout11: string;
  branchOfficeList: { label: string; value: number; }[];
  optionsTime: { title: string; value: number; }[];
  selection: any;
  value1: number = 1;
  getRandom(max, min = 0) {
    if (min == 0) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    return Math.random() * (max - min) + min;
  }

  constructor(
    public _financialDashboardService: FinancialDashboardService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    public breadcrumbService: BreadcrumbService, 
    private branchofficeService: BranchofficeService,private _Authservice: AuthService,
  )  {

    this.breadcrumbService.setItems([
      { label: 'FMS' },
      { label: 'Dashboard', routerLink: ['/financial/dashboard'] }
    ]);
   }


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
  ngOnInit(): void {

    debugger
    this.loadBrancoffices();
    this.selection=this._Authservice.currentOffice;
    this.optionsTime = [

      {title: 'Este mes', value: 1},
  
      {title: 'Últimos 3 meses', value: 2},
  
      {title: 'Últimos 6 meses', value: 3}
  
  ];
    this.loadingService.startLoading()
     
       this.IndicatorsFMSxModules().then(() => this.fetchTaxData()).then(() =>
         this.createDashboard()
   
       ).finally(() => {
        this.loadingService.stopLoading()
      })

    // this.LoadIndicators()
    // this.createDashboard()
    // this.fetchTaxData().finally(() => {
    //   this.loadingService.stopLoading()
    //   this.createDashboard();

    // })

    this.titleout5 = "Rentabilidad del periodo anterior";
    this.titleout6 = "Rentabilidad del periodo actual";
    this.titleout7 = "Compras";
    this.titleout8 = "Ventas";
    this.titleout9 = "Clientes";
    this.titleout10 = "Proveedores";
    this.titleout11 = "Rentabilidad y balance general";

    //this.fetchTaxData()
    // this.loadingService.startLoading();
    // this.fetchTaxData().finally(() => {
    //   this.loadingService.stopLoading()
    //   this.createDashboard();

    // })

     //this.createDashboard();

  }
  formatAmount(amount: any) {
    return  parseFloat(amount).toLocaleString('es-Ve', { minimumFractionDigits: 4 })
  }

  fetchTaxData() {
    debugger
    this.AnalyticFinancialFilter.indicators = this.Indicators
    return this._financialDashboardService.getIndicatorsFMS(this.AnalyticFinancialFilter).toPromise()
      .then(data => {
        this.DataIndicators = data
        

      })

  }

  IndicatorsFMSxModules() {

    return this._financialDashboardService.getIndicatorsFMSxModules(this.IndicatorsFMSxModulesFilter).toPromise()
      .then(Indicator => {
        this.Indicators = Indicator

      })
        .catch((err) => {
          this.createDashboard()
        })

  }
 

  createDashboard() {

    this.Profitability();
  

    this.dashboardData1 = [
      {
        'x': 0, 'y': 0, 'cols': 4, 'rows': 2.3, 'title': 'Rentabilidad por periodos', 'widgetType': widgetType.chart,
        'chartType': chartType.bar, 'data': this.effectivenessByPeriods(), 'options': this.applyLightTheme()
      },

      {
        'x': 0, 'y': 0, 'cols': 4, 'rows': 2.3, 'title': 'Detalle por cuenta contable (%)', 'widgetType': widgetType.chart,
        'chartType': chartType.doughnut, 'data': this.loadDataBalanceSheetDetail(), 'options': this.applyLightThemedoughnut(), 'value': '', 'caption': ''
      },
      {
        'x': 0, 'y': 0, 'cols': 4, 'rows': 2.3, 'title': 'Detalle por partida contable (%)', 'widgetType': widgetType.chart,
        'chartType': chartType.doughnut, 'data': this.loadDataBalanceSheetPartida(), 'options': this.applyLightThemedoughnut(), 'value': '', 'caption': ''
      }

    ];
    this.dashboardData3 = [

      {
        'x': 0, 'y': 0, 'cols': 12, 'rows': 4.4, 'title': 'Rentabilidad periodo actual'+'('+ this.currentPreviousProfitability?.length?this.ProfitabilityTemp[0].etiqueta: '09/2021' +')'+'(09/2021)', 'nroModal': 0, 'widgetType': widgetType.targetInd,
        //'x': 0, 'y': 0, 'cols': 12, 'rows': 4.4, 'title': 'Rentabilidad periodo anterior'+'('+this.currentPreviousProfitability?.length?this.ProfitabilityTemp[0].etiqueta+')':'(09/2021)', 'nroModal': 0, 'widgetType': widgetType.percentInd,
        'currentValue':this.currentPreviousProfitability?.length?this.ProfitabilityTemp[0].valorActual+'%':'26.500', 'target': this.currentPreviousProfitability?.length?this.ProfitabilityTemp[0].meta+'%':'100.00', 'valueVsTarget': this.currentPreviousProfitability?.length?this.ProfitabilityTemp[0].porcentaje:'8.00','objectiveDescription':'Rentabilidad: >=' , 'sublegend': 'Sigo, S.A', 'image':this.currentPreviousProfitability?.length? 'assets/layout/images/dashboard/rateup.svg':'assets/layout/images/dashboard/ratedown.svg'
      }

      // 'currentValue': '98,07%',
      // 'target': '99,99%',
      // 'objectiveDescription':'Presicion: >=',
      // 'color':'mayor',
      // 'valueVsTarget': '1,92',
      // {
      //   'x': 0, 'y': 4, 'cols': 12, 'rows': 6.98, 'title': 'Rentabilidad por periodos', 'widgetType': widgetType.chart,
      //   'chartType': chartType.bar, 'data': this.effectivenessByPeriods(), 'options': this.applyLightTheme()
      // }

    ];

    this.dashboardData4 = [
      {
        'x': 0, 'y': 0, 'cols': 12, 'rows': 4.4, 'title': 'Rentabilidad periodo anterior'+'('+ this.currentPreviousProfitability?.length?this.ProfitabilityTemp[1].etiqueta: '09/2021' +')'+'(09/2021)', 'nroModal': 0, 'widgetType': widgetType.targetInd,
        'currentValue':this.currentPreviousProfitability?.length?this.ProfitabilityTemp[1].valorActual+'%':'36.500', 'target': this.currentPreviousProfitability?.length?this.ProfitabilityTemp[1].meta+'%':'100.00', 'valueVsTarget': this.currentPreviousProfitability?.length?this.ProfitabilityTemp[1].porcentaje:'3.00', 'objectiveDescription':'Rentabilidad: >=','sublegend': 'Sigo, S.A', 'image':'assets/layout/images/dashboard/ratedown.svg'
      }
      // {
      //   'x': 0, 'y': 0, 'cols': 12, 'rows': 8, 'title': 'Detalle por Cuenta contable', 'widgetType': widgetType.chart,
      //   'chartType': chartType.doughnut, 'data': this.loadDataBalanceSheetDetail(), 'options': this.applyLightThemedoughnut(), 'value': '', 'caption': ''
      // },
      // {
      //   'x': 0, 'y': 0, 'cols': 12, 'rows': 8, 'title': 'Detalle por Partida contable', 'widgetType': widgetType.chart,
      //   'chartType': chartType.doughnut, 'data': this.loadDataBalanceSheetPartida(), 'options': this.applyLightThemedoughnut(), 'value': '', 'caption': ''
      // }

    ];

    this.dashboardData5 = [

      {
        'x': 0, 'y': 0, 'cols': 12, 'rows': 6, 'title': 'Consolidado de ventas', 'widgetType': widgetType.tableInd,
        'currentValue': this.SaleBuyCumulatedPercent(89), 'target': 100.00, 'valueVsTarget': 3.00, 'sublegend': 'Grupo de empresas', 'name': 'Ventas','tableData':this.SalesCumulated()
      },
      {
        'x': 0, 'y': 0, 'cols': 12, 'rows': 8, 'title': 'Comportamiento de ventas', 'widgetType': widgetType.chart,
        'chartType': chartType.line, 'data': this.salesVariation(), 'options': this.applyLightTheme()
      }

    ];

    this.dashboardData6 = [
      {
        'x': 0, 'y': 0, 'cols': 12, 'rows': 6, 'title': 'Consolidado de compras', 'nroModal': 0, 'widgetType': widgetType.tableInd,
        'currentValue': this.SaleBuyCumulatedPercent(87), 'target': 100.00, 'valueVsTarget': 3.00, 'sublegend': 'Grupo de empresas','name': 'Compras','tableData':this.BuyCumulated()
      }, {
        'x': 0, 'y': 0, 'cols': 12, 'rows': 8, 'title': 'Comportamiento de compras', 'widgetType': widgetType.chart,
        'chartType': chartType.line, 'data': this.buyVariation(), 'options': this.applyLightTheme()
      }

    ];

    this.dashboardData7 = [
      {
        'x': 0, 'y': 0, 'cols': 12, 'rows': 8, 'title': 'Top 10 de clientes', 'widgetType': widgetType.dataviewList,
        'displayedColumns': this.ColumnsTopSuppliers(), 'data': this.searchTopClients()
      },
      {
        'x': 0, 'y': 0, 'cols': 12, 'rows': 8, 'title': 'Comportamiento de cobros a clientes', 'widgetType': widgetType.chart,
        'chartType': chartType.line, 'data': this.entryVariationClients(), 'options': this.applyLightTheme()
      }

    ];

    this.dashboardData8 = [
      {
        'x': 0, 'y': 0, 'cols': 12, 'rows': 8, 'title': 'Top 10 de proveedores', 'widgetType': widgetType.dataviewList,
        'displayedColumns': this.ColumnsTopSuppliers(), 'data': this.searchTopSuppliers()
      },
      {
        'x': 0, 'y': 0, 'cols': 12, 'rows': 8, 'title': 'Comportamiento de pagos a proveedores', 'widgetType': widgetType.chart,
        'chartType': chartType.line, 'data': this.payVariationSuppliers(), 'options': this.applyLightTheme()
      }
    ];
  }
  
SaleBuyCumulatedPercent(Indicator:number){
  let buy=this.DataIndicators?.filter(f=>f.idIndicator==Indicator)
  debugger
  return buy ? buy[0].result[0].valor :39 
}

  BuyCumulated(){

  let buy=this.DataIndicators?.filter(f=>f.idIndicator==90)
  let data
 buy ? data = [
    {
      description:buy[0].result[0].etiqueta,
      quantity: buy[0].result[0].valores.valor1,
      amount: buy[0].result[0].valores.valor2,
    },
    {
      description:buy[0].result[2].etiqueta,
      quantity: buy[0].result[2].valores.valor1,
      amount: buy[0].result[2].valores.valor2,
    },
    {
      description:buy[0].result[1].etiqueta,
      quantity: buy[0].result[1].valores.valor1,
      amount: buy[0].result[1].valores.valor2,
    }
  ]
 :data = [
      {
        description: "Compras brutas",
        quantity: 28,
        amount: 512.53,
      },
      {
        description: "Devoluciones",
        quantity: 3,
        amount: 10.00,
      },
      {
        description: "Compras netas",
        quantity: 3,
        amount: 10.00,
      },
      
    ];

    return data
  }

  SalesCumulated(){

    let sales=this.DataIndicators?.filter(f=>f.idIndicator==88)
    let data
   sales ? data = [
      {
        description:sales[0].result[0].etiqueta,
        quantity: sales[0].result[0].valores.valor1,
        amount: sales[0].result[0].valores.valor2,
      },
      {
        description:sales[0].result[2].etiqueta,
        quantity: sales[0].result[2].valores.valor1,
        amount: sales[0].result[2].valores.valor2,
      },
      {
        description:sales[0].result[1].etiqueta,
        quantity: sales[0].result[1].valores.valor1,
        amount: sales[0].result[1].valores.valor2,
      },
      
    ]
   :data = [
        {
          description: "Ventas brutas",
          quantity: 28,
          amount: 512.53,
        },
        {
          description: "Devoluciones",
          quantity: 3,
          amount: 10.00,
        },
        {
          description: "Ventas netas",
          quantity: 3,
          amount: 10.00,
        },
      ];
  
      return data
    }  
  
  

  searchTopClients() {
    this.topClientsData = this.DataIndicators?.filter(f => f.idIndicator == 104)


    let dataTopClients = [];

    if (this.topClientsData?.length)
     this.topClientsData[0].result
       .forEach((a) => {
 
        dataTopClients.push({
            id: a.valor,
            indPerson:2,
            image: true,
            mainDescription:'',
            mainDescriptionSide:'$'+this.formatAmount(a.valores.valor1),
            name:a.etiqueta,
            secundaryDescription:'',
            secundaryDescriptionSide:a.valores.valor2+'%',           
            //imagePath: a.urlImagen? 'https://gruposigo1.s3.amazonaws.com/'+a.urlImagen:'https://ui-avatars.com/api/?name='+a.etiqueta+'&background=17a2b8&color=fff&rounded=true&bold=true&size=200'
            imagePath:a.campoURL? a.campoURL:'https://ui-avatars.com/api/?name='+a.etiqueta+'&background=17a2b8&color=fff&rounded=true&bold=true&size=200'
         })
 
       })
      this.dataViewModelTopClients = {   
        imagePathEmpaque: 'assets/layout/images/empaque.png',
        imagePathAvatar:'assets/layout/images/avatar-unisex.jpg',
        linkTitleIn:true,
        codModal:3,
        codModalImg:2,
        indPerson:2,
        dataviewlist:this.topClientsData?dataTopClients:
        
        [
          { id: 1,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(375455.21526),name:'ALIMENTOS POLAR CA',secundaryDescription:'',secundaryDescriptionSide:'J-435345346',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 2,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(974558.21526),name:'ELECTRONICA MARGARITA',secundaryDescription:'',secundaryDescriptionSide:'J-435345346',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 3,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(375455.21526),name:'N & H PROYECTOS CA ',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 4,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(175455.21526),name:'DISTRIBUIDORA DORA CA, SA',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 5,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(875455.21526),name:'DROGUERIA CARACAS, CA',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 6,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(975455.21526),name:'ALIMENTOS MARY',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 7,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(475455.21526),name:'MI HUERTO MARGARITA',secundaryDescription:'',secundaryDescriptionSide:'69.66%',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 8,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(275455.21526),name:'DULCES DONA MARY',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 9,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(875455.21526),name:'ULTRAMEDICA MARGARITA,CA',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 10,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(275455.21526),name:'CERVECERIA POLAR',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'}
      
      ]
      }
    return this.dataViewModelTopClients
  }


  Profitability(){
    debugger
    this.currentPreviousProfitability =this.DataIndicators?.filter(f => f.idIndicator == 38)
   
    if (this.currentPreviousProfitability?.length)
    this.currentPreviousProfitability[0].result
      .forEach((a) => {
        this.ProfitabilityTemp.push({
        colorHex: a.colorHex,
        etiqueta: a.etiqueta,
        comparacion: a.comparacion,
        valorActual: a.valorActual,
        meta:a.meta,
        porcentaje: a.porcentaje,
        })
      })

  }
  searchTopSuppliers() {
    this.topSuppliers = this.DataIndicators?.filter(f => f.idIndicator == 117)
  
debugger
    
    let dataTopSuppliers = [];

   if (this.topSuppliers?.length)
    this.topSuppliers[0].result
      .forEach((a) => {

        dataTopSuppliers.push({
           id: a.valor,
           indPerson:1,
           image: true,
           mainDescription:'',
           mainDescriptionSide:'$'+this.formatAmount(a.valores.valor1),
           name:a.etiqueta,
           secundaryDescription:'',
           secundaryDescriptionSide:a.valores.valor2+'%',
           //imagePath: a.urlImagen? 'https://gruposigo1.s3.amazonaws.com/'+a.urlImagen:'https://ui-avatars.com/api/?name=a.valuesData.valueData5&background=3bf7e4&color=17a2b8&rounded=true&bold=true&size=200'
           imagePath:a.campoURL? a.campoURL:'https://ui-avatars.com/api/?name='+a.etiqueta+'&background=17a2b8&color=fff&rounded=true&bold=true&size=200'

          // imagePath:'assets/layout/images/topbar/avatar-gaspar.png'
        })

      })
      this.dataViewModelTopSuppliers = {   
        imagePathEmpaque: 'assets/layout/images/empaque.png',
        imagePathAvatar:'assets/layout/images/avatar-unisex.jpg',
        linkTitleIn:true,
        codModal:3,
        codModalImg:2,
        indPerson:1,
        dataviewlist:this.topSuppliers? dataTopSuppliers:
        [
          { id: 1,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(375455.21526),name:'ALIMENTOS POLAR CA',secundaryDescription:'',secundaryDescriptionSide:'J-435345346',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 2,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(97455.21526),name:'ELECTRONICA MARGARITA',secundaryDescription:'',secundaryDescriptionSide:'J-435345346',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 3,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(375455.21526),name:'N & H PROYECTOS CA ',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 4,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(175455.21526),name:'DISTRIBUIDORA DORA CA, SA',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 5,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(875455.21526),name:'DROGUERIA CARACAS, CA',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 6,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(975455.21526),name:'ALIMENTOS MARY',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 7,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(475455.21526),name:'MI HUERTO MARGARITA',secundaryDescription:'',secundaryDescriptionSide:'69.66%',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 8,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(275455.21526),name:'DULCES DONA MARY',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 9,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(875455.21526),name:'ULTRAMEDICA MARGARITA,CA',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'},
          { id: 10,image: true,mainDescription:'',mainDescriptionSide:'$'+this.formatAmount(275455.21526),name:'CERVECERIA POLAR',secundaryDescription:'',secundaryDescriptionSide:'J-435345555',imagePath:'https://ui-avatars.com/api/?name=a.etiqueta&background=17a2b8&color=fff&rounded=true&bold=true&size=200'}
      
      ]
      }
    return this.dataViewModelTopSuppliers
  }

  loadDataBalanceSheetPartida() {
    debugger
    this.balanceSheetPartida = this.DataIndicators?.filter(f => f.idIndicator == 23)
    let data
    this.balanceSheetPartida ? data = {

      labels: this.balanceSheetPartida[0].result.map(f => f.etiqueta),
      datasets: [
        {
          label: 'Conteo de empleados por grupo de empresas',
          data: this.balanceSheetPartida[0].result.map(x=>x.valuesLabels.map(y=> y.value).reduce((a, b) => +((a + b).toFixed(2)), 0)),
          backgroundColor: this.balanceSheetPartida[0].result.map(f => f.colorHex),
          hoverBackgroundColor: this.balanceSheetPartida[0].result.map(f => f.colorHex)
        },

      ]

    } :
      data = {

        labels: ['ACTIVO',
          'PASIVO',
          'PATRIMONIO',
          'INGRESOS',
          'GASTOS Y COSTOS'
        ],

        datasets: [
          {

            label: 'Conteo de empleados por grupo de empresas',

            data: [65, 59, 80, 81, 100],

            backgroundColor: [

              this.colors.blue,

              this.colors.red,

              this.colors.orange,

              this.colors.green,
              this.colors.yellow,
              this.colors.brown,
              this.colors.lightRed

            ],

            hoverBackgroundColor: [

              this.colors.green,

              this.colors.red,

              this.colors.orange,

              this.colors.blue,
              this.colors.yellow,

              this.colors.lightRed,
              this.colors.brown,

            ]

          },

        ]

      };
    return data;

  }


  loadDataBalanceSheetDetail() {
    this.balanceSheetDetail = this.DataIndicators?.filter(f => f.idIndicator == 22)
    let data
    this.balanceSheetDetail ? data = {

      labels:this.balanceSheetDetail[0].result[0].detalle.map(f => f.etiqueta),
      datasets: [
        {

          label: 'Conteo de empleados por grupo de empresas',

          data: this.balanceSheetDetail[0].result[0].detalle.map(f => f.value),
          backgroundColor: this.balanceSheetDetail[0].result[0].detalle.map(f => f.colorHex),
          hoverBackgroundColor: this.balanceSheetDetail[0].result[0].detalle.map(f => f.colorHex)

        },

      ]

    } :
      data = {
        labels: ['UTILIDADES DE EJERCICIO',
          'SUELDOS POR PAGAR',
          'PROVEEDORES NACIONALES',
          'CUENTAS POR COBRAR EMPLEADOS',
          'CAJA CHICA',
          'CUENTAS POR COBRAR CLIENTES',
          'BANCOS NACIONALES'
        ],
        datasets: [
          {
            label: 'Conteo de empleados por grupo de empresas',
            data: [65, 59, 80, 81, 100, 78, 89],
            backgroundColor: [
              this.colors.blue,
              this.colors.red,
              this.colors.orange,
              this.colors.green,
              this.colors.yellow,
              this.colors.brown,
              this.colors.lightRed
            ],
            hoverBackgroundColor: [
              this.colors.green,
              this.colors.red,
              this.colors.orange,
              this.colors.blue,
              this.colors.yellow,
              this.colors.lightRed,
              this.colors.brown,
            ]

          },

        ]

      };
    return data;

  }
  loadColumns() {
    return this.displayedColumns = [
      // {field: 'Nombre', header: 'Nombre', display: 'table-cell', dataType: 'string'},
      // {field: 'Monto', header: 'Monto', display: 'table-cell', dataType: 'number'},
      // {field: 'porcentaje', header:  '%', display: 'table-cell', dataType: 'string'},

      { field: 'id', header: 'id', display: 'none', dataType: 'number' },
      { field: 'picture', header: '', display: 'table-cell', dataType: 'avatar-group' },
      { field: 'employee', header: 'Empleado', display: 'table-cell', dataType: 'string' },
      { field: 'company', header: 'Empresa', display: 'table-cell', dataType: 'string' },
      { field: 'previous', header: 'Previo', display: 'table-cell', dataType: 'string' },
      { field: 'new', header: 'Nuevo', display: 'table-cell', dataType: 'string' }

    ];

  }

  ColumnsBalanceSheet() {
    return this.displayedColumnsBalanceSheet = [

      { field: 'TipoCuenta', header: 'Tipo cuenta', display: 'none', dataType: 'string' },
      { field: 'Partida', header: 'Partida', display: 'table-cell', dataType: 'string' },
      { field: 'CuentaContable', header: 'Cuenta contable', display: 'table-cell', dataType: 'string' },
      { field: 'Monto', header: 'Monto', display: 'table-cell', dataType: 'number' },
      { field: 'MonedaConversion', header: 'Moneda de conversión', display: 'table-cell', dataType: 'number' },

    ];

  }

  ColumnsTopSuppliers() {
    return this.displayedColumnsTopSuppliers = [

      { field: 'Nombre', header: 'Nombre', display: 'table-cell', dataType: 'string' },
      { field: 'Monto', header: 'Monto', display: 'table-cell', dataType: 'string' },
      { field: 'Porcentaje', header: '%', display: 'table-cell', dataType: 'string' },

    ];

  }

  ColumnsTopClients() {
    return this.displayedColumnsTopClients = [

      { field: 'Nombre', header: 'Nombre', display: 'table-cell', dataType: 'string' },
      { field: 'Monto', header: 'Monto', display: 'table-cell', dataType: 'string' },
      { field: 'Porcentaje', header: '%', display: 'table-cell', dataType: 'string' },

    ];

  }

  loadTopBalanceSheet() {
    debugger
    this.balanceSheet = this.DataIndicators?.filter(f => f.idIndicator == 128)
    let DataBalanceSheet = [];
    this.balanceSheet ?
      this.balanceSheet[0].result
        .forEach((a) => {

          DataBalanceSheet.push({
            //TipoCuenta: 'Activo',
            Partida: a.valores.valor3,
            CuentaContable: a.valores.valor4,
            Monto: a.valores.valor1,
            // MonedaBase: '14700000000.00',
            MonedaConversion: a.valores.valor2
          })

        }) :
      DataBalanceSheet = [
        {
          TipoCuenta: 'Activo',
          Partida: 'Bancos Nacionales',
          CuentaContable: 'Banesco',
          Monto: '14700000000.00',
          MonedaBase: '14700000000.00',
          MonedaConversion: '14700000000.00'
        },
        {
          TipoCuenta: 'Pasivo',
          Partida: 'Caja Chica',
          CuentaContable: 'Efectivo',
          Monto: '14700000000.00',
          MonedaBase: '1700000000.00',
          MonedaConversion: '148700000000.00'
        },
        {
          TipoCuenta: 'Patrimonio',
          Partida: 'Sueldos por pagar',
          CuentaContable: 'CxC Clientes',
          Monto: '14700000000.00',
          MonedaBase: '14900000000.00',
          MonedaConversion: '146700000000.00'
        },
        {
          TipoCuenta: 'Activo',
          Partida: 'Bancos Nacionales',
          CuentaContable: 'Sigo',
          Monto: '15700000000.00',
          MonedaBase: '147200000000.00',
          MonedaConversion: '17006000000.00'
        },
        {
          TipoCuenta: 'Pasivo',
          Partida: 'Caja Chica',
          CuentaContable: 'Sigo',
          Monto: '15700000000.00',
          MonedaBase: '12700000000.00',
          MonedaConversion: '13700000000.00'
        },
        {
          TipoCuenta: 'Patrimonio',
          Partida: 'Sueldos por pagar',
          CuentaContable: 'Sigo',
          Monto: '17700000000.00',
          MonedaBase: '13700000000.00',
          MonedaConversion: '11700000000.00'
        }

      ];
    return DataBalanceSheet;
  }
  loadTopSuppliers() {
    const data = [
      {
        Nombre: 'Ricardo',
        Monto: '13700000000.00',
        Porcentaje: '50',

      },
      {
        Nombre: 'Ricardo antonio',
        Monto: '188700000000.00',
        Porcentaje: '10',

      },
      {
        Nombre: 'made de la trinidad',
        Monto: '15700000000.00',
        Porcentaje: '20',

      },
      {
        Nombre: 'Victor alfonzo',
        Monto: '13700000000.00',
        Porcentaje: '0.1',

      },
      {
        Nombre: 'randy caraballo',
        Monto: '13700000000.00',
        Porcentaje: '90',

      },
      {
        Nombre: 'joniz',
        Monto: '12700000000.00',
        Porcentaje: '0000000.1',

      }

    ];
    return data;
  }
  loadTopClients() {

    const data = [
      {
        Nombre: 'Ricardo',
        Monto: '13700000000.00',
        Porcentaje: '50',

      },
      {
        Nombre: 'Ricardo antonio',
        Monto: '188700000000.00',
        Porcentaje: '10',

      },
      {
        Nombre: 'made de la trinidad',
        Monto: '15700000000.00',
        porcentaje: '20',

      },
      {
        Nombre: 'Victor alfonzo',
        Monto: '13700000000.00',
        Porcentaje: '0.1',

      },
      {
        Nombre: 'randy caraballo',
        Monto: '13700000000.00',
        Porcentaje: '90',

      },
      {
        Nombre: 'joniz',
        Monto: '12700000000.00',
        Porcentaje: '0000000.1',

      }

    ];
    return data;
  }

  loadData() {
    const data = {
      labels: ['Viveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'],
      datasets: [
        {

          label: 'Unidades recibidas',
          backgroundColor: '#dfe7fd',
          data: [this.getRandom(600),
          this.getRandom(600),
          this.getRandom(600),
          this.getRandom(600),
          this.getRandom(600),
          this.getRandom(600),
          this.getRandom(600)]

        },
        {

          label: 'Unidades vendidas',
          backgroundColor: '#fde2e4',
          data: [this.getRandom(400),
          this.getRandom(400),
          this.getRandom(400),
          this.getRandom(400),
          this.getRandom(400),
          this.getRandom(400),
          this.getRandom(400)]
        }
      ]
    };
    return data;
  }

  effectivenessByPeriods() {
    this.profitabilityByPeriods = this.DataIndicators?.filter(f => f.idIndicator == 37)
    let data;
    this.profitabilityByPeriods ?
      data = {
        labels: this.profitabilityByPeriods[0].result[0].detalle.map(vl => vl.etiqueta),
        datasets: [
          {
            label: this.profitabilityByPeriods[0].result[0].etiqueta,
            data: this.profitabilityByPeriods[0].result[0].detalle.map(vl => vl.value),
            backgroundColor:this.profitabilityByPeriods[0].result[0].colorHex,
          }]
      } :
      data = {

        labels: ["04/2021", "05/2021", "06/2021", "07/2021", "08/2021", "09/2021"],

        datasets: [
          {
            label: "Rentabilidad",
            backgroundColor: this.colors.blue,

            data: [25, 15, 10, -15, 20, 12, 5],

          }]
      }

    return data;
  };

  salesVariation() {
    this.behaviorSales = this.DataIndicators?.filter(f => f.idIndicator == 75)
    let data
    this.behaviorSales ? data = {

      //Etiqueta
      labels: this.behaviorSales[0].result[0].labels.map(bs => bs.labelName),
      datasets: [
        {
          label: this.behaviorSales[0].result[0].etiqueta,
          data: this.behaviorSales[0].result[0].valuesLabels.map(vl => vl.value),
          backgroundColor: this.behaviorSales[0].result[0].colorHex,
          fill: false,
          borderColor: this.behaviorSales[0].result[0].colorHex,
        },
        {
          label: this.behaviorSales[0].result[1].etiqueta,
          data: this.behaviorSales[0].result[1].valuesLabels.map(vl => vl.value),
          backgroundColor: this.behaviorSales[0].result[1].colorHex,

          fill: false,
          borderColor: this.behaviorSales[0].result[1].colorHex,
          //tension: 0.4,
        },
      ]
    } :
      data = {

        labels: ["04/2021", "05/2021", "06/2021", "07/2021", "08/2021", "09/2021"],
        datasets: [
          {

            label: "Ventas netas",
            data: [
              this.getRandom(600),
              this.getRandom(600),
              this.getRandom(600),
              this.getRandom(600),
              this.getRandom(600),
              this.getRandom(600),
              this.getRandom(600),
            ],

            backgroundColor: this.colors.blue,
            fill: false,
            borderColor: this.colors.blue
          },
          {
            label: "Compras con devoluciones",
            data: [
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
            ],
            backgroundColor: this.colors.red,

            fill: false,
            borderColor: this.colors.red,

          },
        ]
      }

    return data;
  };

  buyVariation() {

    this.behaviorBuy = this.DataIndicators?.filter(f => f.idIndicator == 76)
    let data
    this.behaviorBuy ? data = {

      //Etiqueta
      labels: this.behaviorBuy[0].result[0].labels.map(bs => bs.labelName),
      datasets: [
        {
          label: this.behaviorBuy[0].result[0].etiqueta,
          data: this.behaviorBuy[0].result[0].valuesLabels.map(vl => vl.value),
          backgroundColor: this.behaviorBuy[0].result[0].colorHex,
          fill: false,
          borderColor: this.behaviorBuy[0].result[0].colorHex,
        },
        {
          label: this.behaviorBuy[0].result[1].etiqueta,
          data: this.behaviorBuy[0].result[1].valuesLabels.map(vl => vl.value),
          backgroundColor: this.behaviorBuy[0].result[1].colorHex,

          fill: false,
          borderColor: this.behaviorBuy[0].result[1].colorHex,

        },
      ]
    } :
      data = {
        labels: ["04/2021", "05/2021", "06/2021", "07/2021", "08/2021", "09/2021"],
        datasets: [
          {
            label: "Compras netas",
            data: [
              this.getRandom(600),
              this.getRandom(600),
              this.getRandom(600),
              this.getRandom(600),
              this.getRandom(600),
              this.getRandom(600),
              this.getRandom(600),
            ],
            fill: false,
            borderColor: this.colors.blue,
            tension: 0.4,
          },
          {
            label: "Compras con devoluciones",
            data: [
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
            ],
            fill: false,
            borderColor: this.colors.red,
            tension: 0.4,
          },
        ]
      };
    return data;
  };

  entryVariation() {

    const data = {
      labels: [
        "01/04/2021",
        "04/04/2021",
        "07/04/2021",
        "10/04/2021",
        "13/04/2021",
        "16/04/2021",
        "19/04/2021",

      ],
      datasets: [
        {
          label: "Total",
          data: [
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),

          ],
          fill: false,
          borderColor: this.colors.grey,
          tension: 0.4,
        },
        {
          label: "Bancos",
          data: [
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),

          ],
          fill: false,
          borderColor: this.colors.blue,
          tension: 0.4,
        },
        {
          label: "Efectivo",
          data: [
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),

          ],
          fill: false,
          borderColor: this.colors.green,
          tension: 0.4,
        },
        {
          label: "Paypal",
          data: [
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),

          ],
          fill: false,
          borderColor: this.colors.brown,
          tension: 0.4,
        },
        {
          label: "Zelle",
          data: [
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),

          ],
          fill: false,
          borderColor: this.colors.purple,
          tension: 0.4,
        },
      ]
    }
    return data;
  };

  paysVariation() {
    const data = {
      labels: [
        "01/04/2021",
        "04/04/2021",
        "07/04/2021",
        "10/04/2021",
        "13/04/2021",
        "16/04/2021",
        "19/04/2021",
        "21/04/2021",
        "24/04/2021",
        "27/04/2021",
        "30/04/2021",
      ],
      datasets: [
        {
          label: "Total",
          data: [
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
            this.getRandom(600, 500),
          ],
          fill: false,
          borderColor: this.colors.grey,
          tension: 0.4,
        },
        {
          label: "Pagos a proveedores",
          data: [
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
          ],
          fill: false,
          borderColor: this.colors.blue,
          tension: 0.4,
        },
        {
          label: "Anticipos",
          data: [
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
          ],
          fill: false,
          borderColor: this.colors.brown,
          tension: 0.4,
        },
        {
          label: "Pagos a consignación",
          data: [
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
            this.getRandom(400),
          ],
          fill: false,
          borderColor: this.colors.red,
          tension: 0.4,
        },
      ]
    }
    return data;
  };

  payVariationSuppliers() {
    this.variationSuppliers = this.DataIndicators?.filter(f => f.idIndicator == 125)
    let data
    let dataSuppliers = [];

   if (this.variationSuppliers?.length)
    this.variationSuppliers[0].result
      .forEach((a) => {
        dataSuppliers.push({
          label: a.etiqueta,
          data: a.valuesLabels.map(vl => vl.value),
          backgroundColor: a.colorHex,
          fill: false,
          borderColor: a.colorHex,
        })
      })

    this.variationSuppliers ?
      data = {
        labels: this.variationSuppliers[0].result[0].labels.map(f => f.labelName),
        datasets: dataSuppliers

      } :

      data = {
        labels: [
          "01/04/2021",
          "04/04/2021",
          "07/04/2021",
          "10/04/2021",
          "13/04/2021",
          "16/04/2021",
          "19/04/2021",
          "21/04/2021",
          "24/04/2021",
          "27/04/2021",
          "30/04/2021",
        ],
        datasets: [
          {
            label: "Total",
            data: [
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
            ],
            fill: false,
            borderColor: this.colors.grey,
            tension: 0.4,
          },
          {
            label: "Pagos a proveedores",
            data: [
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
            ],
            fill: false,
            borderColor: this.colors.blue,
            tension: 0.4,
          },
          {
            label: "Anticipos",
            data: [
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
            ],
            fill: false,
            borderColor: this.colors.brown,
            tension: 0.4,
          },
          {
            label: "Pagos a consignación",
            data: [
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
            ],
            fill: false,
            borderColor: this.colors.red,
            tension: 0.4,
          },
        ]
      }

    return data;
  };

  entryVariationClients() {
    this.variationClients = this.DataIndicators?.filter(f => f.idIndicator == 124)
    let data
    let dataClients = [];
    if (this.variationClients?.length)
    this.variationClients[0]?.result
      .forEach((a) => {

        dataClients.push({
          label: a.etiqueta,
          data: a.valuesLabels.map(vl => vl.value),
          backgroundColor: a.colorHex,
          fill: false,
          borderColor: a.colorHex,
        })

      })

    this.variationClients ?
      data = {
        labels: this.variationClients[0].result[0].labels.map(f => f.labelName),
        datasets: dataClients

      } :

      data = {
        labels: [
          "01/04/2021",
          "04/04/2021",
          "07/04/2021",
          "10/04/2021",
          "13/04/2021",
          "16/04/2021",
          "19/04/2021",
          "21/04/2021",
          "24/04/2021",
          "27/04/2021",
          "30/04/2021",
        ],
        datasets: [
          {
            label: "Total",
            data: [
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
              this.getRandom(600, 500),
            ],
            fill: false,
            borderColor: this.colors.grey,
            tension: 0.4,
          },
          {
            label: "Cobros a clientes",
            data: [
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
            ],
            fill: false,
            borderColor: this.colors.blue,
            tension: 0.4,
          },
          {
            label: "Anticipos",
            data: [
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
            ],
            fill: false,
            borderColor: this.colors.brown,
            tension: 0.4,
          },
          {
            label: "Cobros a consignación",
            data: [
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
              this.getRandom(400),
            ],
            fill: false,
            borderColor: this.colors.red,
            tension: 0.4,
          },
        ]
      }

    return data;
  };


  loadData2() {
    const data = {
      labels: ['Viveres', 'Enlatados', 'Frutas', 'Farmacia', 'Licores', 'Cuidado personal', 'Oficina'],
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
      //  scales: {
      //     xAxes: [{
      //         ticks: {
      //             fontColor: '#17a2b8'
      //         }
      //     }],
      //     yAxes: [{
      //         ticks: {
      //             fontColor: '#17a2b8'
      //         }
      //     }]
      // } 
    };
    return basicOptions;
  }

}
