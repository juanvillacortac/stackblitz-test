import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { EmployeeMovementSubsidiaryComponent } from 'src/app/modules/hcm/dashboard-modals/employee-movement-subsidiary/employee-movement-subsidiary.component';
import { EmployeeSituationSubsidiaryComponent } from 'src/app/modules/hcm/dashboard-modals/employee-situation-subsidiary/employee-situation-subsidiary.component';
import { HeadcountTurnoverComponent } from 'src/app/modules/hcm/dashboard-modals/employeeCounts/headcount-turnover/headcount-turnover/headcount-turnover.component';
import { HeadcountComponent } from 'src/app/modules/hcm/dashboard-modals/employeeCounts/headcount/headcount.component';
import { EmployeeCountHiringComponent } from 'src/app/modules/hcm/dashboard-modals/headcount-hiring/employee-count-hiring/employee-count-hiring.component';
import { ModalProductsLifeComponent } from 'src/app/modules/products/dashboard/dashboard-modal/modal-products-life/modal-products-life.component';
import { ReceptionDetailComponent } from 'src/app/modules/som/dashboard-modal/sales/reception/reception-detail/reception-detail.component';
import { SalesComponent } from 'src/app/modules/som/dashboard-modal/sales/sales.component';
import { TicketPromedioComponent } from 'src/app/modules/som/dashboard-modal/sales/ticket-promedio/ticket-promedio.component';
import { ModalCategoryComponent } from 'src/app/modules/srm/dashboard/dashboard-modal/modal-category/modal-category.component';
import { ModalSalesComponent } from 'src/app/modules/srm/vieweroc-supplier/dashboard/modal-sales/modal-sales.component';
import { DashboardPositionsService } from '../../services/dashboard-positions.service';
import { AuthService } from "../../../login/shared/auth.service";
import { BaseModel } from "../../../../models/common/BaseModel";
import { ObjectivesByDepartmentComponent } from 'src/app/modules/som/dashboard-modal/objectives-by-department/objectives-by-department.component';

@Component({
  selector: 'app-dashboard-layaout',
  templateUrl: './dashboard-layaout.component.html',
  styleUrls: ['./dashboard-layaout.component.scss'],
  providers: [DialogService]
})
export class DashboardLayaoutComponent implements OnInit {

  constructor(private router: Router,
              private posServ: DashboardPositionsService,
              public dialogService: DialogService,
              public messageService: MessageService,
              private readonly _authService: AuthService) { }

  options: GridsterConfig;
  dashboard: Array<GridsterItem> = [];
  titleout1:string;
  loaded = true;
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  @Input() dashboardData: any;
  @Output() dashboardDataChange = new EventEmitter<any>(true);
  @Input() maxRows = 100;
  @Input() minHeight =  40 ;
  @Input() titleout: any;
  @Input() nroModal: any;
  @Input() sucursal: any;
  @Input() frecuencia: any;


  get kpiPermissions(): BaseModel[] {
    return this._authService.kpiPermissions;
  }

  static itemInit(item, itemComponent) {
    item.init = true;
 }
  itemChange(item, itemComponent) {
    this.posServ.savePositions(this.dashboard);
  }

  itemResize(item, itemComponent) {
  }


  ref: DynamicDialogRef;
  show(_nroModal: number)
  {
    switch (_nroModal) {
      case 1:
        this.ref = this.dialogService.open(ModalCategoryComponent, {
          header: 'Ordenes de compra',
          data: {
            id: 1// buscar ordenes para el operador de compra
        },
          width: '70%',
          contentStyle: {"max-height": "500px", "overflow": "auto"},
          baseZIndex: 10000
      });
        break;
      case 2:
        this.ref = this.dialogService.open(HeadcountComponent, {
          header: 'Conteo de trabajadores por niveles de jerarquia vs cargos',
          width: '70%',
          contentStyle: {"height": "400px", "overflow": "auto"},
          baseZIndex: 10000
        });
        break;
        case 3:
          this.ref = this.dialogService.open(HeadcountTurnoverComponent, {
            header: 'Listado de altas y bajas en el ultimo mes',
            width: '70%',
            contentStyle: {"height": "800px", "overflow": "auto"},
            baseZIndex: 10000
          })
       break;
        case 5:
          this.ref = this.dialogService.open(ModalProductsLifeComponent, {
            header: 'Ciclo de vida del producto',
            width: '40%',
            contentStyle: {"max-height": "800px", "overflow": "auto"},
            baseZIndex: 10000
          });
          break;
          case 6:
            this.router.navigate(['/srm/viewer-document']);//navega al home de ordenes de compra , aqui hay que verificar permisos
            break;
            case 7://desde dashboard proveedores. ordenes en revision
              this.ref = this.dialogService.open(ModalCategoryComponent, {
                header: 'Ordenes del proveedor',
                data: {
                  id: 2// buscar ordenes para el proveedor
              },
                width: '80%',
                contentStyle: {"max-height": "600px", "overflow": "auto"},
                baseZIndex: 10000
            });
            break;
            case 8://desde dashboard srm va al visor de recepciones
            this.router.navigate(['/srm/reception-viewer']);//navega al home de recepciones , aqui hay que verificar permisos
           break;
            case 9://desde dashboard proveedores. ordenes en revision
              this.ref = this.dialogService.open(ModalSalesComponent, {
                header: 'Ventas',
                data: {
                  id: 2// buscar ordenes para el proveedor
              },
                width: '80%',
                contentStyle: {"max-height": "600px", "overflow": "auto"},
                baseZIndex: 10000
            });
            break;
            case 10://desde dashboard proveedores. ordenes en revision
            this.ref = this.dialogService.open(EmployeeCountHiringComponent, {
              header: 'Comparativa plazas estimadas vs ocupadas',
              data: {
                id: 2// buscar ordenes para el proveedor
            },
              width: '50%',
              contentStyle: {"max-height": "800px", "overflow": "auto"},
              baseZIndex: 10000
          });
          break;
          case 11://desde dashboard proveedores. ordenes en revision
          this.ref = this.dialogService.open(EmployeeMovementSubsidiaryComponent, {
            header: 'Movimientos de trabajadores por sucursal',
            data: {
              id: 2// buscar ordenes para el proveedor

          },
            width: '50%',
            contentStyle: {"max-height": "800px", "overflow": "auto"},
            baseZIndex: 10000
        });
        break;
          case 12:
          this.ref = this.dialogService.open(SalesComponent, {
            header: 'Total de ventas por sucursal',
            data: {
              id: 1
          },
            width: '50%',
            contentStyle: {"max-height": "800px", "overflow": "auto"},
            baseZIndex: 10000
        });
        break;
        case 13:
          this.ref = this.dialogService.open(TicketPromedioComponent, {
            header:'Ticket promedio por sucursal',
        //     data: {
        //       id: 1
        // },
        width: '50%',
        contentStyle: {"max-height": "800px", "overflow": "auto"},
        baseZIndex: 10000
    });
    break;
    case 14:
      this.ref = this.dialogService.open(EmployeeSituationSubsidiaryComponent, {
        header: 'Situación trabajadores por sucursal',
        width: '70%',
        contentStyle: {"max-height": "400px", "overflow": "auto"},
        baseZIndex: 10000
    });
      break;
      case 15:
        this.ref = this.dialogService.open(ReceptionDetailComponent, {
          header: 'Recepciones',
          width: '40%',
          contentStyle: {"max-height": "400px", "overflow": "auto"},
          baseZIndex: 10000
      });
        break;
        case 16:
          debugger
          this.ref = this.dialogService.open(ObjectivesByDepartmentComponent, {
            header: 'Objetivos por departamento ('+(this.frecuencia==15?'Hoy':this.frecuencia==2?'Este mes':this.frecuencia==5?'Últimos 3 meses':'Últimos 6 meses')+')',
           data: {
              branch: this.sucursal,
              frecuen:this.frecuencia

         },
            width: '50%',
            contentStyle: {"max-height": "680px", "overflow": "auto"},
            baseZIndex: 10000
        });
          break;

            default:
        break;
    }
  }
  ngOnInit() {

    this.options = {
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 12,
      maxCols: 12,
      minRows: 1,
      maxRows: this.maxRows,
      maxItemCols: 12,
      minItemCols: 1,
      maxItemRows: this.maxRows,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 105,
      fixedRowHeight: 50,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: false,
      },
      resizable: {
        enabled: false,
      },
      swap: false,
      pushItems: false,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: {north: true, east: true, south: true, west: true},
      pushResizeItems: false,
      displayGrid: DisplayGrid.None,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false,
      itemChangeCallback: (item, itemComponent) => this.itemChange(item, itemComponent),
      itemResizeCallback: (item, itemComponent) => this.itemResize(item, itemComponent),
      itemInitCallback: DashboardLayaoutComponent.itemInit
    };

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.onResize(evt);
    });


    this.validateKpiPermissions();
    this.titleout1=this.titleout;
  }

  onResize(event) {
      this.options.setGridSize = false;
      this.changedOptions();
  }

  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  navigateToRoute(route) {
    this.router.navigate([route]);
  }

  private validateKpiPermissions() {
    this.dashboardData.forEach(data => {
      this.dashboard.push(data);
    })
    this.dashboardDataChange.emit(this.dashboard);
  }
}
