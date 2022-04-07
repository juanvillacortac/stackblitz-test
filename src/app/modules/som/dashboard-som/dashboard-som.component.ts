import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { chartType } from 'src/app/models/common/chart-type';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { widgetType } from 'src/app/models/common/widget-type';
import { Analytics } from 'src/app/models/ims/dashboard/analytics';
import { AnalyticsFilter } from 'src/app/models/ims/dashboard/analytics-filter';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { AnalyticPointOfSale, AnalyticPointOfSaleFilter, IndicatorAnalyticsFilter, IndicatorsVTAxModulesFilter } from 'src/app/models/som/AnalyticPointOfSale';
import { AnalyticSRM, AnalyticSRMFilter } from 'src/app/models/srm/dashboard-srm';
import { AnalyticsTMS } from 'src/app/models/tms/dashboard/analytics';
import { LoadingService } from '../../common/components/loading/shared/loading.service';
import { DashboardService } from '../../ims/dashboard/shared/service/dashboard.service';
//import { DashboardService } from '../../tms/dashboard/service/dashboard.service';
import { ReportService } from '../../ims/shared/services/report.service';
import { CurrentOfficeSelectorService } from '../../layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import { LayoutService } from '../../layout/shared/layout.service';
import { AuthService } from '../../login/shared/auth.service';
import { BranchofficeFilter } from '../../masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from '../../masters/branchoffice/shared/services/branchoffice.service';
import { DashboardanalyticsService } from '../../srm/shared/services/dashboardanalytics/dashboardanalytics.service';
import { TmsDashboardService } from '../../tms/dashboard/service/tms-dashboard.service';
import { SomDashboardService } from '../shared/services/som-dashboard.service';

@Component({
  selector: 'app-dashboard-som',
  templateUrl: './dashboard-som.component.html',
  styleUrls: ['./dashboard-som.component.scss']
})

export class DashboardSomComponent implements OnInit {
  dashboardDataSales: any;
  dashboardDataSales2: any;
  optionsTime: any[];
  Cajas: any[];
  value1: number = 15;
  branchOfficeList: { label: string; value: number; }[];
  selection: any;
  dataViewModelTopCajeros: any;
  frencuencia: number;
  dataSales: any;
  id: any;
  userId: number;
  TotalSales: any;
  TotalAverage:any;

  constructor(public breadcrumbService: BreadcrumbService, private _Authservice: AuthService,
    public _somDashboardService: SomDashboardService,
    public _imsDashboardService: DashboardService,
    public _tmsDashboardService: TmsDashboardService,
    public _srmDashboardService: DashboardanalyticsService,
    private _layoutSerice: LayoutService,
    public _reportService: ReportService,
    private _selectorService: CurrentOfficeSelectorService, //Codigo para seleccionar Compañia/Sucursal
    private loadingService: LoadingService,
    private branchofficeService: BranchofficeService,
  ) {
    this.userId = Number(this._Authservice.idUser);
    this._selectorService.setSelectorType(EnumOfficeSelectorType.company) //Selecciona la compañia en dropdown
    this.breadcrumbService.setItems([
      { label: 'SOM' },
      { label: 'Dashboard', routerLink: ['/som/dashboard-som'] }
    ]);


  }
  AnalyticSRMFilter = new AnalyticSRMFilter();
  AnalyticPointOfSaleFilter = new AnalyticPointOfSaleFilter();
  AnalyticsFilter = new AnalyticsFilter();
  AnalyticsFilterTMS = new AnalyticsFilter();

  IndicatorsVTAxModulesFilter = new IndicatorsVTAxModulesFilter();
  topCashierData: any
  dashboardData1: any;
  dashboardData2: any;
  dashboardData3: any;
  dashboardData4: any;
  titleout1: string = "";
  titleout5: string = "";
  dataViewModel: any;
  dashboardData5: any

  Indicators: IndicatorAnalyticsFilter[];
  DataIndicators: AnalyticPointOfSale[];
  DataIndicatorsIMS: Analytics[];
  DataIndicatorsSRM: AnalyticSRM[];
  DataIndicatorsTMS: AnalyticsTMS[];
  UpdateDate: any;

  // private loadUserOffices2() {
  //   this._layoutSerice.getCompanyBrachOfficesByUser(this.userId)
  //     .then(offices => { this.saveDefaultOffice(offices); return offices; })
  //     .then(offices => this.branchOfficesList = offices)
  //     .then(() => this.loadBranchOffices(this.branchOfficesList[0].offices))
  //     .catch(error => this.handleError(error));
  // }


  loadBrancoffices() {

    var filter = new BranchofficeFilter();
    filter.idCompany = this._Authservice.currentCompany;
    this.branchofficeService.getBranchOfficeList(filter).subscribe((data: Branchoffice[]) => {
      data = data.sort((a, b) => a.branchOfficeName.localeCompare(b.branchOfficeName));
      this.branchOfficeList = data.map((item) => ({
        label: item.branchOfficeName,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las sucursales" });
    });
  }
  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  ngOnInit(): void {
    this.loadBrancoffices();
    this.selection = this._Authservice.currentOffice;
    this.loadFrequency();
  }

  async loadFrequency() {
    clearInterval(this.id);
    this.id = setInterval(() => {
      this.loadFrequency();
    }, 60000 * 5);

    const fecha = new Date();
    let mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
    this.frencuencia = this.value1;
    this.UpdateDate = "Su última actualización fue el " + fecha.getDate() + " de " + mesActual + " del " + fecha.getFullYear() + ", a las " + fecha.toLocaleTimeString('en-US');

    this.dashboardData1 = [];
    this.dashboardData2 = [];
    this.dashboardData3 = [];
    this.dashboardData4 = [];
    this.dashboardData5 = [];

    this.dashboardDataSales = [];
    this.dashboardDataSales2 = [];
    this.TotalSales=[];
    this.TotalAverage=[];
    // this.Indicators=[];
    // this.DataIndicators=[];
    // this.DataIndicatorsIMS=[];
    // this.DataIndicatorsSRM=[];
    // this.DataIndicatorsTMS=[];

    this.frencuencia = this.value1;
    this.optionsTime = [
      { title: 'Hoy', value: 15 },

      { title: 'Este mes', value: 2 },

      { title: 'Últimos 3 meses', value: 5 },

      { title: 'Últimos 6 meses', value: 7 }

    ];

    this.loadingService.startLoading()
    // this.IndicatorspVTAxModules().then(() => this.fetchTaxData()).then(() => this.fetchTaxDataIms()).then(() => this.fetchTaxDataSrm()).then(() =>
    //   this.createDashboard()
    // ).finally(() => {
    //   this.loadingService.stopLoading()
    // })
    await this.IndicatorspVTAxModules()
    await this.fetchTaxData()
    await this.fetchTaxDataIms()
    await this.fetchTaxDataSrm()
    await this.fetchTaxDataTms()
    this.TotalSales = this.TotalVentas(167)
    this.TotalAverage =this.TotalVentas(168)
    this.createDashboard()
  
    this.loadingService.stopLoading()
    this.titleout1 = "Facturación";

  }

  searchTopCajeros(ind: number) {
    debugger
    this.topCashierData = this.DataIndicators?.filter(f => f.idIndicator == ind)
    let dataTopCajeros = [];
    if (this.topCashierData?.length)
      this.topCashierData[0].result
        .forEach((a, idx) => {
          dataTopCajeros.push({
            id: a.valor,
            indPerson: 2,
            image: a.etiqueta == "" ? false : true,
            mainDescription: a.etiqueta == "" ? "No se encontraron resultados." : "",
            mainDescriptionSide: a.etiqueta == "" ? " " :this.formatAmount(a.valores.valor1),
            name: a.etiqueta,
            secundaryDescription: '',
            secundaryDescriptionSide: '',
            icon: a.etiqueta == ""?'':ind ==142?'': idx==0?'assets/layout/images/dashboard/estrella-vector.svg':'',
            imagePath: a.campoURL ? 'https://gruposigo1.s3.amazonaws.com/' + a.campoURL : 'https://ui-avatars.com/api/?name=' + a.etiqueta + '&background=17a2b8&color=fff&rounded=true&bold=true&size=200'
            //imagePath: a.campoURL ? a.campoURL : 'https://ui-avatars.com/api/?name=' + a.etiqueta + '&background=17a2b8&color=fff&rounded=true&bold=true&size=200'
          })

        })

    this.dataViewModelTopCajeros = {
      imagePathEmpaque: 'assets/layout/images/empaque.png',
      imagePathAvatar: 'assets/layout/images/topbar/avatar-cayla.png',
      linkTitleIn: true,
      codModal: 2,
      codModalImg: 1,
      dataviewlist: this.topCashierData ? dataTopCajeros : [
        { id: 7, image: true, mainDescription: '', mainDescriptionSide: '1', name: 'Madelyn Leos', secundaryDescription: '', secundaryDescriptionSide: ind == 13 ? '$ ' + (0.57) : 'Total: 125', imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Madelyn-Leos.png202110141529477524' },
        { id: 10, image: true, mainDescription: '', mainDescriptionSide: '2', name: 'Nilda Vásquez', secundaryDescription: '', secundaryDescriptionSide: ind == 13 ? '$ ' + (0.52) : 'Total: 122', imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Nilda-Vasquez.png202110141533146871' },
        { id: 6, image: true, mainDescription: '', mainDescriptionSide: '3', name: 'Amaranta Hernández', secundaryDescription: '', secundaryDescriptionSide: ind == 13 ? '$ ' + (0.46) : 'Total: 90', imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Amaranta-hernandez.png202110141530252611' },
        { id: 9, image: true, mainDescription: '', mainDescriptionSide: '4', name: 'Anyela Ramos', secundaryDescription: '', secundaryDescriptionSide: ind == 13 ? '$ ' + (0.44) : 'Total: 82', imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Anyela_ramos.jpg202110141532343931' },
        { id: 8, image: true, mainDescription: '', mainDescriptionSide: '5', name: 'Randy Caraballo', secundaryDescription: '', secundaryDescriptionSide: ind == 13 ? '$ ' + (0.21) : 'Total: 79', imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Randy-Caraballo.png202110141532080179' },
        { id: 3143, image: true, mainDescription: '', mainDescriptionSide: '6', name: 'Jose Gonzalez', secundaryDescription: '', secundaryDescriptionSide: ind == 13 ? '$ ' + (0.18) : 'Total: 68', imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/original.png202109061249028239' },
        { id: 52, image: true, mainDescription: '', mainDescriptionSide: '7', name: 'Victor rodríguez', secundaryDescription: '', secundaryDescriptionSide: ind == 13 ? '$ ' + (0.14) : 'Total: 64', imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/avatar-igor.jpg202110051233125930' },
        { id: 1, image: true, mainDescription: '', mainDescriptionSide: '8', name: 'Joníz gonzalez', secundaryDescription: '', secundaryDescriptionSide: ind == 13 ? '$ ' + (0.12) : 'Total: 52', imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Joniz-Gonzalez.png202110141531414763' },
        { id: 11, image: true, mainDescription: '', mainDescriptionSide: '9', name: 'Juan Salazar', secundaryDescription: '', secundaryDescriptionSide: ind == 13 ? '$ ' + (0.8) : 'Total: 40', imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/WhatsApp_Image_2021-10-14_at_15.56.09.jpeg202110142027525353' },
        { id: 50, image: true, mainDescription: '', mainDescriptionSide: '10', name: 'Marcelo Gonzalez', secundaryDescription: '', secundaryDescriptionSide: ind == 13 ? '$ ' + (0.4) : 'Total: 39', imagePath: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/logo-sigo.jpg202111241021174543' }

      ]
    }
    return this.dataViewModelTopCajeros
  }

  formatAmount(amount: any) {
    return parseFloat(amount).toLocaleString('es-Ve', { minimumFractionDigits: 0 })
  }
  formatAmount1(amount: any) {
    return parseFloat(amount).toLocaleString('es-Ve', { minimumFractionDigits: 2 })
  }

  fetchTaxData() {
    this.AnalyticPointOfSaleFilter.indicators = this.Indicators;
    this.AnalyticPointOfSaleFilter.idBranchOffice = +this.selection;

    this.AnalyticPointOfSaleFilter.indicators.forEach(item => {
      item.idFilterType =  item.idIndicator == 142 && this.frencuencia == 15 ? 16 : this.frencuencia
    });

    return this._somDashboardService.getIndicatorsVTA(this.AnalyticPointOfSaleFilter).toPromise()
      .then(data => {
        this.DataIndicators = data

      })
  }

  fetchTaxDataIms() {
    this.AnalyticsFilter.idBranchOffice = +this.selection;
    this.AnalyticsFilter.indicators = [{ idFilterType: this.frencuencia, idIndicator: 56, parameters: null }];
    return this._imsDashboardService.getAnalyticsIndicators(this.AnalyticsFilter).toPromise()
      .then(data => {
        this.DataIndicatorsIMS = data

      })
  }


  fetchTaxDataTms() {
    debugger
    this.AnalyticsFilterTMS.idBranchOffice = this.selection;
    this.AnalyticsFilterTMS.indicators = [{ idFilterType: this.frencuencia, idIndicator: 78, parameters: null }];
    return this._tmsDashboardService.getAnalyticsIndicators(this.AnalyticsFilterTMS).toPromise()
      .then(data => {
        this.DataIndicatorsTMS = data

      })
  }
  fetchTaxDataSrm() {
    debugger
    this.AnalyticSRMFilter.idSucursal = this.selection;
    this.AnalyticSRMFilter.indicators = [{ idFilterType: this.frencuencia, idIndicator: 103, parameters: { idSupplier: 1 } }]
    return this._srmDashboardService.getIndicatorsSRM(this.AnalyticSRMFilter).toPromise()
      .then(data => {
        this.DataIndicatorsSRM = data

      })
  }

  IndicatorspVTAxModules() {

    return this._somDashboardService.getIndicatorsVTAxModules(this.IndicatorsVTAxModulesFilter).toPromise()
      .then(Indicator => {
        this.Indicators = Indicator

      })
      .catch((err) => {

        this.createDashboard()
      })
  }

  // this.lossMetricsData = [{
  //   'id': 150,
  //   'cols': 12,
  //   'rows': 6,
  //   'title': 'Perdidas',
  //   'widgetType': widgetType.percentInd,
  //   'objectiveDescription': 'Perdidas: ' + this.LossesTemp[0].comparacion,
  //   'color': this.LossesTemp[0].direccion,
  //   'currentValue': this.LossesTemp[0].valorActual,
  //   'target': this.LossesTemp[0].meta,
  //   'valueVsTarget': this.LossesTemp[0].porcentaje,
  //   'sublegend': 'Porcentaje de perdida en Pca supermarket',
  //   'image': this.LossesTemp[0].direccion=='mayor'? 'assets/layout/images/dashboard/rateup.svg' :'assets/layout/images/dashboard/ratedown.svg'
  //   //'image': 'assets/layout/images/dashboard/rateup.svg'
  // },

  createDashboard() {
    this.dashboardDataSales = [
      {
        'id': 167,'cols': 4, 'rows': 2.3, 'title': 'Total de ventas', 'nroModal': 16, 'widgetType': widgetType.percentInd,
        'sublegend':'Ventas',
        'caption': 'Ventas por sucursal',

        'objectiveDescription': 'Objetivo de ventas:',
        'color': this.TotalSales[0].direccion,
        'currentValue': this.formatAmount1(this.TotalSales[0].valorActual),
        'target': this.formatAmount1(this.TotalSales[0].meta),
        'valueVsTarget': this.TotalSales[0].porcentaje,
        'symbol': '$',
        'image': this.TotalSales[0].direccion=='mayor'? 'assets/layout/images/dashboard/rateup.svg' :'assets/layout/images/dashboard/ratedown.svg'
        //'image': 'assets/layout/images/dashboard/rateup.svg'
      },
      {
        'id': 56,
        'cols': 4,
        'rows': 2.3,
        'title': 'Total de ventas por departamentos($)',
        'plusVisible': 'true',
        'widgetType': widgetType.chart,
        'chartType': chartType.bar,
        'data': this.loadData10(),
        'options': this.applyLightTheme(),
      
      },
      {
        'id': 168, 'cols': 4, 'rows': 2.3, 'title': 'Ticket Promedio', 'nroModal': 0, 'widgetType': widgetType.percentInd,
        'sublegend': 'Ticket',
        'caption': 'Ventas por sucursal',
        'objectiveDescription': 'Objetivo de ticket:',
        'color': this.TotalAverage[0].direccion,
        'currentValue': this.formatAmount1(this.TotalAverage[0].valorActual),
        'target': this.formatAmount1(this.TotalAverage[0].meta),
        'valueVsTarget': this.TotalAverage[0].porcentaje,
        'symbol': '$',
        'image': this.TotalAverage[0].direccion=='mayor'? 'assets/layout/images/dashboard/rateup.svg' :'assets/layout/images/dashboard/ratedown.svg'
      }

    ];

    this.dashboardDataSales2 = [

      {
        'id': 145,
        'cols': 4,
        'rows': 4,
        'title': 'Top 10 - Facturas emitidas por cajero (por hora)',
        'widgetType': widgetType.dataviewList,
        'data': this.searchTopCajeros(145),
        'options': this.applyLightTheme()
      },
      {
        'id': 142,
        'cols': 4,
        'rows': 4,
        'title': 'Top 10 - Cantidad de turnos con diferencias por cajeros(Dia anterior)',
        'widgetType': widgetType.dataviewList,
        'data': this.searchTopCajeros(142),
        'options': this.applyLightTheme()
      },
      {
        'id': 144,
        'cols': 4,
        'rows': 4,
        'title': 'Top 10 - Cajeros con mas productos vendidos',
        'widgetType': widgetType.dataviewList,
        'data': this.searchTopCajeros(144),
        'options': this.applyLightTheme()
      }
    ];
    if (this.frencuencia != 15) {
      this.dashboardData3 = [
        {
          'id':103, 'cols': 4, 'rows': 2.6, 'title': 'Recepciónes de compra', 'widgetType': widgetType.listnumberindicator,
          'currentValue': 25, 'targetValue': 10, 'legend': 'Ordenes', 'data': this.GeneralIndicators(103), 'nroModal': 0, 'icon': 'pi-arrow-right'//15
        },
        {
         'id':78,'cols': 4, 'rows': 2.6, 'title': 'Tranferencias', 'widgetType': widgetType.listnumberindicator,
          'currentValue': 25, 'targetValue': 10, 'legend': 'Ordenes', 'data': this.GeneralIndicators(78), 'nroModal': 0, 'icon': 'pi-arrow-right'
        },
      ];
    } else {
      this.dashboardData3 = [
        {
         'id':161 ,'cols': 4, 'rows': 2.6, 'title': 'Cajas', 'widgetType': widgetType.listnumberindicator,
          'currentValue': 25, 'targetValue': 10, 'legend': 'Ordenes', 'data': this.GeneralIndicators(161), 'nroModal': 0, 'icon': 'pi-arrow-right'
        },
        {
          'id':103, 'cols': 4, 'rows': 2.6, 'title': 'Recepción', 'widgetType': widgetType.listnumberindicator,
          'currentValue': 25, 'targetValue': 10, 'legend': 'Ordenes', 'data': this.GeneralIndicators(103), 'nroModal': 0, 'icon': 'pi-arrow-right'//15
        },
        {
         'id':78, 'cols': 4, 'rows': 2.6, 'title': 'Tranferencias', 'widgetType': widgetType.listnumberindicator,
         'currentValue': 25, 'targetValue': 10, 'legend': 'Ordenes', 'data': this.GeneralIndicators(78), 'nroModal': 0, 'icon': 'pi-arrow-right'
        },
      ];
    }

    this.dashboardData4 = [
      {
        'id': 166,
        'cols': 4,
        'rows': 2.4,
        'title': 'Conteos cíclicos de inventario',
        'widgetType': widgetType.listnumberindicator,
        'currentValue': 25,
        'targetValue': 10,
        'legend': 'Ordenes',
        'data': this.GeneralIndicators(166),
        'nroModal': 0,
        'icon': 'pi-arrow-right'
      },
      // {
      //   'cols': 4, 'rows': 2.4, 'title': 'Plantilla', 'widgetType': widgetType.listnumberindicator,
      //   'currentValue': 25, 'targetValue': 10, 'legend': 'Ordenes', 'data': this.indicatorsnumberHCM, 'nroModal': 0, 'icon': 'pi-arrow-right'
      // },
      {
        'id': 163,
        'cols': 4,
        'rows': 2.4,
        'title': 'Solicitudes Automaticas',
        'widgetType': widgetType.listnumberindicator,
        'currentValue': 25,
        'targetValue': 10,
        'legend': 'Ordenes',
        'data': this.GeneralIndicators(163),
        'nroModal': 0,
        'icon': 'pi-arrow-right'
      },
    ];

    this.dashboardData5 = [
      {
        'id': 152,
        'cols': 4,
        'rows': 2.8,
        'title': 'Abonos',
        'widgetType': widgetType.listnumberindicator,
        'currentValue': 25,
        'targetValue': 10,
        'legend': 'Ordenes',
        'data': this.GeneralIndicators(152),
        'nroModal': 0,
        'icon': 'pi-arrow-right'
      },
      {
        'id': 162,
        'cols': 4,
        'rows': 2.8,
        'title': 'Clientes',
        'widgetType': widgetType.listnumberindicator,
        'currentValue': 25,
        'targetValue': 10,
        'legend': 'Ordenes',
        'data': this.GeneralIndicators(162),
        'nroModal': 0,
        'icon': 'pi-arrow-right'
      },
      {
        'id': 154,
        'cols': 4,
        'rows': 2.8,
        'title': 'Formas de pago',
        'widgetType': widgetType.listnumberindicator,
        'currentValue': 25,
        'targetValue': 10,
        'legend': 'Ordenes',
        'data': this.GeneralIndicators(154),
        'nroModal': 0,
        'icon': 'pi-arrow-right'
      },

    ];

  }

  GeneralIndicators(Indicator: number) {
    debugger
    let monto;
    let client = Indicator == 162 ? true : false
    let conteos = Indicator == 166 ? true : false
    let Sautom = Indicator == 163 ? true : false
    let cajas = Indicator == 161 ? true : false

    let indicatorsnumber = [];

    if (Indicator == 103) {
      monto = this.DataIndicatorsSRM?.filter(f => f.idIndicator == Indicator)
      monto[0].result[0].details
        .forEach((a, idx) => {
          indicatorsnumber.push({
            id: idx,
            indicator: a.etiqueta,
            value: client ? this.formatAmount(a.value) : a.value
          })
        })
    } else {

      if (Indicator == 78) {
        monto = this.DataIndicatorsTMS?.filter(f => f.idIndicator == Indicator)
        monto[0].results[0].detailsResults
          .forEach((a, idx) => {
            indicatorsnumber.push({
              id: idx,
              indicator: a.etiqueta,
              value: client ? this.formatAmount(a.value) : a.value
            })
          })
      } else {
        monto = this.DataIndicators?.filter(f => f.idIndicator == Indicator)
        monto[0].result[0].detalle
          .forEach((a, idx) => {
            indicatorsnumber.push({
              id: idx,
              indicator: a.etiqueta,
              value: client || conteos || Sautom || cajas ? this.formatAmount(a.value) : a.etiqueta=='Número de Abonos'? this.formatAmount( a.value): '$'+this.formatAmount( a.value)
            })
          })
     }

    }
    return indicatorsnumber;
  }

  loadData10() {
debugger
    this.dataSales = this.DataIndicatorsIMS?.filter(f => f.idIndicator==56)
    let data;
    let dataDepartament = [];

    if (this.dataSales?.length)
    this.dataSales[0].results
        .forEach((a) => {
         
            dataDepartament.push({
              label: 'Departamentos($)',
              data: a.detailsResults.filter((_, idx) => idx < 10).map(vl => vl.value),
              backgroundColor: a.detailsResults.filter((_, idx) => idx < 10).map(vl => vl.colorHex),
  
            })
           

        })
    this.dataSales ?
      data = {
        labels: this.dataSales[0].results[0].detailsResults.filter((_, idx) => idx < 10).map(f => f.etiqueta),
        datasets: dataDepartament

      } :
      data = {
        labels: ['Panaderia', 'Charcuteria', 'Viveres', 'Frulever', 'Hogar', 'Electronica', 'Farmacia', 'Otros'],
        datasets: [
          {
            label: 'Departamentos($)',
            data: [2000, 4340, 7670, 2660, 3660, 5000, 4340, 1330],
            backgroundColor: [
              '#ECFEAA',
              '#EFBDC8',
              '#ADECFF',
              '#6dfbe7',
              '#3bf7e4',
              '#F3CED6',
              '#F7DEE4',
              '#EBFAFF'
            ],
            hoverBackgroundColor: [
              '#ECFEAA',
              '#EFBDC8',
              '#ADECFF',
              '#6dfbe7',
              '#3bf7e4',
              '#F3CED6',
              '#F7DEE4',
              '#FBEFF1'
            ]
          },
        ]
      };
    return data;
  }

  TotalVentas(ind: number) {
    // try   
    // {  
    debugger

    const evaluate = (a: any, b: any, op: '==' | '<=' | '>=' | '<' | '>' | '!=') => {
      switch (op) {
        case '==':
          return a == b
        case '<=':
          return a <= b
        case '>=':
          return a >= b
        case '<':
          return a < b
        case '>':
          return a > b
        case '!=':
          return a != b
      }
    }
    let data = this.DataIndicators?.filter(f => f.idIndicator == ind)
    let temp = [];
    if (data?.length)
      data[0].result
        .forEach((a) => {
          temp.push({
            colorHex: a.colorHex,
            etiqueta: a.etiqueta,
            comparacion:a.comparator,
            valorActual: a.currentValue,
            meta: a.goal,
            porcentaje: a.percent,
            direccion: evaluate(a.currentValue, a.goal, a.comparator as any)?'mayor':'menor'
          })
        })
        return temp;
  
    // catch (Error)   
    // {  
    //   alert(Error.message);  
    // } 
   
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


