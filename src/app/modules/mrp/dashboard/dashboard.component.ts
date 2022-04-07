import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { DashboardFilter } from 'src/app/models/analytics/dashboard-filter';
import { WidgetFilter } from 'src/app/models/analytics/widget-filter';
import { chartType } from 'src/app/models/common/chart-type';
import { widgetType } from 'src/app/models/common/widget-type';
import { DashboardLayaoutComponent } from 'src/app/modules/common/components/dashboard-layaout/dashboard-layaout.component';
import { MrpDashboardWidgetType } from 'src/app/models/mrp/mrp-dashboard-widget-type.enum';
import { LoadingService } from '../../common/components/loading/shared/loading.service';
import { DialogsService } from '../../common/services/dialogs.service';
import { AuthService } from '../../login/shared/auth.service';
import { DashboardAnalyticsService } from './shared/dashboard-analytics.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  optionSelection: number;
  displayedColumns: any[] = [];
  leftDashboardData: any;
  centerDashboardData: any;
  rightDashboardData: any[] = [];
  titleLeft: any;
  titleCenter: any;
  titleRight: any;
  loading = true;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private readonly loadingService: LoadingService,
    private dialogService: DialogsService,
    private _dashboardAnalyticsService: DashboardAnalyticsService,
    private _authService: AuthService) {
    this.breadcrumbService.setItems([
        { label: 'MRP' },
        { label: 'Dashboard', routerLink: ['/mrp/dashboard'] }
    ]);
  }

    ngOnInit(): void {
        this.buildDahsboard();
    }
    buildDahsboard() {
        this.loadingService.startLoading('wait_loading');
        this._dashboardAnalyticsService.buildDashboard(this.buildDashboardFilters())
                .then(result => this._dashboardAnalyticsService.widgets = result)
                .then(() => this.configurateDashboard())
                .then(() => this.completeBuild())
                .catch(error => this.handleError(error));
    }

    buildDashboardFilters() {
        const filters = new DashboardFilter();
                filters.branchOfficeId = this._authService.currentOffice;
                filters.companyId = this._authService.currentCompany;
                filters.widgetFilter = this.getWidgetsToShow();
        return filters;
    }
    getWidgetsToShow() {
        const widgetFilter:  WidgetFilter[] = [];
        for (const widgetTypeId in MrpDashboardWidgetType) {
            if (!isNaN(Number(widgetTypeId))) {
                const filterType = (Number(widgetTypeId) ===  MrpDashboardWidgetType.COST_CHANGED_MRP_MPC_BY_COMPANY ||
                                    Number(widgetTypeId) === MrpDashboardWidgetType.COST_CHANGED_MRP_MPC_BY_BRANCHOFFICE) ? 1 : 2;
                widgetFilter.push( { id: Number(widgetTypeId),  filterTypeId: filterType, parameters: '' });
            }
        }
        return widgetFilter;
    }

    configurateDashboard() {
        this.leftDashboardLoad();
        this.centerDashboardLoad();
        this.rightDashboardLoad();
    }
    leftDashboardLoad() {
        this.titleLeft = 'Rendimiento de salas';
        this.leftDashboardData = [
            { 'x': 0,  'y': 0, 'cols': 12, 'rows': 10, 'title': 'Rendimiento de sala derivados', 'widgetType': widgetType.chart,
            'chartType': chartType.bar, 'data': this.loadDerivateRoomPerformance(), 'options': this.loadDerivateRoomPerformanceOption()},
            { 'x': 8,  'y': 0, 'cols': 12, 'rows': 10, 'title': 'Salidas / Entradas derivados KG', 'widgetType': widgetType.genericTable,
            'displayedColumns': this.loadColumns(), 'data': this.loadDerivateMovements()  },
            { 'x': 16,  'y': 0, 'cols': 12, 'rows': 12, 'title': 'Efectividad sala', 'widgetType': widgetType.genericTable,
            'displayedColumns': this.loadColumnsForRoomEfficiency(), 'data': this.loadRoomEfficiency()  },
        ];
    }
    centerDashboardLoad() {
        this.titleCenter = 'Órdenes de trabajo';
        this.centerDashboardData = [
            {  'x': 0,  'y': 0, 'cols': 12, 'rows': 10, 'title': 'OT Procesadas por sala', 'widgetType': widgetType.chart,
                'chartType': chartType.horizontalBar, 'data': this.loadProductionOrderProcessedByRoom(),
                'options': this.loadHorizontalBarOption()},
            { 'x': 16,  'y': 0, 'cols': 12, 'rows': 10, 'title': 'Alerta fallo de ingredientes', 'widgetType': widgetType.sliderList,
                'data': this.loadIngredientInventoryInfo(), 'maxRow': 5 },
            {  'x': 16,  'y': 0, 'cols': 12, 'rows': 12, 'title': 'OT por estatus', 'widgetType': widgetType.chart,
                'chartType': chartType.pie, 'data': this.loadProductionOrdersByStatus(), 'options': this.loadBasicOptions()},
        ];
    }
    rightDashboardLoad() {
        this.titleRight = 'Rendimiento de equipo';
        this.rightDashboardData.push(this.loadProductionPlanFulfillmentData());
        this.rightDashboardData.push(
            { 'x': 8,  'y': 0, 'cols': 12, 'rows': 8, 'title': 'Equipo por sala',
             'widgetType': widgetType.genericTable, 'displayedColumns': this.loadColumnsForProcessingRoom(),
             'data': this.loadProcessingRoom()  }
        );
        this.rightDashboardData.push(this.loadCostChanged());
    }
    loadCostChanged() {
        const widgetData = this.getWidgetDataByType(MrpDashboardWidgetType.COST_CHANGED_MRP_MPC_BY_BRANCHOFFICE);
        return { 'x': 16,  'y': 0, 'cols': 12, 'rows': 12,
                'title': 'Cambio de costo', 'widgetType': widgetType.stat,
                'total': this.extractSingleValueFromStringFilter(widgetData, 'producto') ?? 0,
                'subTotalRight': this.extractSingleValueFromStringFilter(widgetData, 'disminucion') ?? 0,
                'subTotalLeft': this.extractSingleValueFromStringFilter(widgetData, 'aumento') ?? 0,
                'totalTittle': 'Productos', 'subtotalRightTittle': 'Baja', 'subTotalLeftTittle': 'Alza',
                'showLeftCostIncreaseArrow': true, 'showRightCostIncreaseArrow': true };
    }
    loadProductionPlanFulfillmentData() {
        const widgetData = this.getWidgetDataByType(MrpDashboardWidgetType.PRODUCTION_PLAN_FULFILLMENT_BY_BRANCHOFFICE);
        return { 'x': 0,  'y': 0, 'cols': 12, 'rows': 12,
                'title': 'Cumplimiento general del plan de producción (%)',
                'widgetType': widgetType.circleNumber,
                'maxValue': 100,
                'targetValue': widgetData.map( item => item.goal),
                'currentValue': Number(widgetData.map( item => item.currentValue)) ?? 0,
                'legend': 'Objetivo: ' + widgetData.map( item => item.goal) ?? 0 + '%',
                'route': '/mrp/production-plans-schedule'};
    }

    loadRoomEfficiency() {
        const widgetData = this.getWidgetDataByType(MrpDashboardWidgetType.ROOM_EFFICIENCY_BY_BRANCHOFFICE);
        const data = [];
        if (widgetData) {
             widgetData.map((parent, index) => {
                parent.values.map((item) => {
                    const option = {
                        id: index + 1,
                        room: parent.title ?? '',
                        efficiency: item.value ?? 0,
                        lastPeriod: (index - 1)
                    };
                    data.push(option);
                });
            });
       }
        return data;
    }
    loadProductionOrderProcessedByRoom() {
        const widgetData = this.getWidgetDataByType(MrpDashboardWidgetType.PRODUCTION_ORDER_PROCESSED_BY_ROOM_BRANCHOFFICE);
        return this.buildChartObject(widgetData, 'Órdenes procesadas') ?? {};
    }

    loadProductionOrdersByStatus() {
        const widgetData = this.getWidgetDataByType(MrpDashboardWidgetType.PRODCUTION_ORDER_BY_STATUS_BRANCHOFFICE);
        return this.buildChartObject(widgetData, '') ?? {};
    }

    loadDerivateRoomPerformance() {
        const widgetData = this.getWidgetDataByType(MrpDashboardWidgetType.DERIVATE_ROOM_PERFORMANCE_BY_COMPANY);
        let data = {};
            if (widgetData) {
                data = {
                    labels: widgetData.map(items => items.title),
                    datasets: [
                        {
                                label: 'Estimado',
                                data:  (widgetData?.map(result => result.multiValues.value1)).map(items => Number(items)),
                                backgroundColor: '#F0F8FF',
                                hoverBackgroundColor: '#F0F8FF',
                        },
                        {
                                label: 'Real',
                                data: (widgetData?.map(result => result.multiValues.value2)).map(items => Number(items)),
                                backgroundColor: '#FAEBD7',
                                hoverBackgroundColor: '#FAEBD7',
                        }
                    ]
                };
        }
        return data;
    }

    setOptionSelection(selectionValue: number): void {
        this.optionSelection = selectionValue;
    }

    private buildChartObject(data, tooltip) {
        return {
            labels: data.map(items => items.title) ?? [],
            datasets: [
                {
                    label: tooltip,
                    data: this.extractChartValueData(data) ?? [],
                    backgroundColor: data.map(items => String(items.colorHex)) ?? [],
                    hoverBackgroundColor: data.map(items => String(items.colorHex)) ?? [],
                }
            ]
        };
    }

    private loadDerivateRoomPerformanceOption() {
        return {
            responsive: false,
            maintainAspectRatio: false,
            responsiveAnimationDuration: 0,
            scales: {
                xAxes: [{ gridLines: { display: false} }],
                yAxes: [{
                    gridLines: { display: false },
                    ticks: { display: false, min: 0 }
                }]
            }
        };
    }
    private loadHorizontalBarOption() {
        return {
            responsive: false,
            maintainAspectRatio: false,
            responsiveAnimationDuration: 0,
            legend: { display: false },
            scales: {
                xAxes: [{
                        gridLines: {display: false },
                        ticks: {display: false, min: 0 }
                }],
                yAxes: [ { gridLines: { display: false}} ]
            }
        };
    }
    private loadBasicOptions() {
        return {
            responsive: false,
            maintainAspectRatio: false,
            responsiveAnimationDuration: 0,
            legend: { labels: { fontColor: '#495057'}},
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { display: false } }
            }
        };
    }

    private getHeaderCollumnsName(name: string) {
        return `mrp.dashboard.table.${name}`;
    }
    private getWidgetDataByType(widgteID) {
        return this._dashboardAnalyticsService.widgets.find( widget => widget.id === widgteID )?.data ?? [];
    }

    private completeBuild() {
        this.loading = false;
        this.loadingService.stopLoading();
    }

    private handleError(error: HttpErrorResponse) {
        this.loadingService.stopLoading();
        this.loading = false;
        this.dialogService.errorMessage('mrp.dashboard.analytics', error?.error?.message ?? 'error_service');
    }
    private extractSingleValueFromStringFilter(data, filter) {
        return (data?.map(result => result?.values?.find(options => options?.label?.toLowerCase()?.includes(filter))?.value ?? 0))
                     .find(items => Number(items) >= 0) ?? 0;
    }
      private extractChartValueData(data) {
        return (data?.map(result => result.values.map(options => options.value)))
                    .map(items => Number(items)) ?? [];
    }

    // Mock
    private loadProcessingRoom() {
        return [
            { id: 1, room: 'Carne', teams: this.loadImage().slice(0, 5) },
            { id: 2, room: 'Pasteleria', teams: this.loadImage().slice(0, 2) },
            { id: 3, room: 'Cocina', teams: this.loadImage().slice(0, 8) },
            { id: 4, room: 'Gourmet', teams: this.loadImage().slice(0) }
        ];
    }
    private loadDerivateMovements() {
        return [
            { id: 1, room: 'Panaderia', derivatesIn: 55.645, derivatesOut: 865.11 },
            { id: 2, room: 'Pollo', derivatesIn: 525.645, derivatesOut: 85.11 },
            { id: 3, room: 'Pescado', derivatesIn: 5252.645, derivatesOut: 855.11 },
            { id: 4, room: 'Sierra', derivatesIn: 5.645, derivatesOut: 895.11 }
        ];
    }
    private loadIngredientInventoryInfo() {
        return [
            { id: 1, title: 'Salsa Pizza', currentValue: 20, maxValue: 40 },
            { id: 2, title: 'Masa Hojaldre', currentValue: 44, maxValue: 50 },
            { id: 3, title: 'Harina Trigo', currentValue: 20, maxValue: 100 },
            { id: 4, title: 'Bandeja Termicas', currentValue: 14, maxValue: 100 },
            { id: 5, title: 'Masa pizza', currentValue: 20, maxValue: 50 },
            { id: 6, title: 'Harina Pan', currentValue: 60, maxValue: 100 },
            { id: 7, title: 'Masa torta', currentValue: 40, maxValue: 100 }
        ];
    }
    private loadColumns() {
      return  this.displayedColumns = [
            {field: 'id', header: 'id', display: 'none', dataType: 'number'},
            {field: 'room', header:  this.getHeaderCollumnsName('room'), display: 'table-cell', dataType: 'string'},
            {field: 'derivatesIn', header:  this.getHeaderCollumnsName('derivatesIn'), display: 'table-cell', dataType: 'number'},
            {field: 'derivatesOut', header:  this.getHeaderCollumnsName('derivatesOut'), display: 'table-cell', dataType: 'number'}
        ];

    }

    private loadColumnsForRoomEfficiency() {
        return  this.displayedColumns = [
            {field: 'id', header: 'id', display: 'none', dataType: 'number'},
            {field: 'room', header:  this.getHeaderCollumnsName('room'), display: 'table-cell', dataType: 'string'},
            {field: 'efficiency', header:  this.getHeaderCollumnsName('efficiency'), display: 'table-cell', dataType: 'numberPercent'},
            {field: 'lastPeriod', header:  this.getHeaderCollumnsName('goal'), display: 'table-cell', dataType: 'numberPercent',
             numberIncreaseClass: true}
        ];
    }

    private loadColumnsForProcessingRoom() {
        return  this.displayedColumns = [
              {field: 'id', header: 'id', display: 'none', dataType: 'number'},
              {field: 'room', header:  this.getHeaderCollumnsName('room'), display: 'table-cell', dataType: 'string'},
              {field: 'teams', header:  this.getHeaderCollumnsName('teams'), display: 'table-cell', dataType: 'avatar-group'}
          ];
    }
    private loadImage() {
     return [
        {id: 6, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Amaranta-hernandez.png202110141530252611', name: 'Amaranta Hernandez'},
        {id: 4, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/WhatsApp_Image_2021-10-21_at_4.53.22_PM.jpeg202110221420109824', name: 'Ana DLeon'},
        {id: 11, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/WhatsApp_Image_2021-10-14_at_15.56.09.jpeg202110142027525353', name: 'Juan Salazar'},
        {id: 8, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Randy-Caraballo.png202110141532080179', name: 'Randy Caraballo'},
        {id: 7, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Madelyn-Leos.png202110141529477524', name: 'Madelyn Leos'},
        {id: 3, image: "https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Orlando-D'-Leo¦ün.png202110132050517560", name: 'Orlando DLeon'},
        {id: 2, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Joniz-Gonzalez.png202110141531414763', name: 'Joniz Gonzalez'},
        {id: 9, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Anyela_ramos.jpg202110141532343931', name: 'Anyela Ramos'},
        {id: 10, image: 'https://gruposigo1.s3.amazonaws.com/empresa0/hcm/trabajadores/imagen/Nilda-Vasquez.png202110141533146871', name: 'Nilda Vasquez'},
        ];
    }
}
