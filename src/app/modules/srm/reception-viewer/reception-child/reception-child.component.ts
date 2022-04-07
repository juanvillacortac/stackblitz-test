import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Area } from 'src/app/models/masters/area';
import { ChildReception, ReceptionStatus, ReceptionUpdateStatus } from 'src/app/models/srm/reception';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { AreaFilter } from 'src/app/modules/masters/area/shared/filters/area-filter';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { Result } from '../../shared/filters/common/result';
import { MerchandiseReceptionService } from '../../shared/services/merchandise-reception/merchandise-reception.service';
import { ReceptionChildProductsComponent } from './reception-child-products/reception-child-products.component';


@Component({
  selector: 'app-reception-child',
  templateUrl: './reception-child.component.html',
  styleUrls: ['./reception-child.component.scss']
})
export class ReceptionChildComponent implements OnInit {

  receptionIsLoaded: boolean = false;
  receptionAreaSelected: number;
  areaList: Area[] = [];
  idreception:number=-1;
  childReception: ChildReception = new ChildReception();
  statusreception: typeof ReceptionStatus  = ReceptionStatus;
  @ViewChild(ReceptionChildProductsComponent,{static: false}) receptionChildProductsComponent:ReceptionChildProductsComponent;


  constructor(private readonly areaService: AreaService,
    private readonly merchandiseReceptionService: MerchandiseReceptionService,
    public userPermissions: UserPermissions,
    private breadcrumbService: BreadcrumbService,
    private actRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private readonly dialogService: DialogsService, private readonly authService: AuthService) { }

  ngOnInit(): void {
    this.loadAreasList();
    this.setBreadCrumb();
    this.getReceptionValues(); 
  }

  get validateArea() {
    return this.receptionAreaSelected > -1 ?? false;
  }

  private getReceptionValues() {
    const receptionId = Number(this.actRoute.snapshot.params['id']);
 
    if (receptionId > 0) {
      this.loadReception(receptionId);
   
    } 
  }

  private setBreadCrumb() {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'SRM' },
      { label: 'Recepción', routerLink: ['/srm/reception'] }
    ]);
  }
  private loadReception(id: number) {
    this.merchandiseReceptionService.getReceptionsimple(id).subscribe((data: ChildReception) => {
      if (data !=null) {
        this.childReception = data;
        this.receptionIsLoaded = true;   
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El producto no se encuentra registrado." });
        //this._product = new DetailReception();
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando el producto" });
    });
  }



  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

  private loadAreasList() {
    const filter: AreaFilter = new AreaFilter();
          filter.idAreaType = 3; // Areas for Reception
          filter.idBranchOffice = this.authService.currentOffice;
    this.areaService
        .getareaListPromise(filter)
        .then(data => {this.areaList = data.sort((a, b) => a.name.localeCompare(b.name)); })
        .catch(error => this.handlerError(error));
  }

  private handlerError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }
  changestatus(status: number, data){
    var statusBack =  this.childReception.statusId;
    this.childReception.statusId = status;
    const order = this.getStatusProperties();
    if (data != undefined) {
      order.motiveId = this.childReception.idReason;
      order.observation = this.childReception.description;
    }
    this.merchandiseReceptionService.updateStatus(order).subscribe((data: Result) => {
      if (data !=null) {
        if (data.idResponseCode ==0)
        {
        this.idreception = data.entityId;
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Actualización exitosa" });
        const link: any[] = ['/srm/reception', data.toString()];
        this.ngOnInit();
      }
      else{
        this.childReception.statusId = statusBack;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
      }
      }
      else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al actualizar los datos." });
        this.childReception.statusId = statusBack;
      }
    }, (error: HttpErrorResponse) => {
      this.childReception.statusId = statusBack;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al actualizar los datos." });
    });

  }

  start() {
    this.confirmationService.confirm({
      key:'confirmBack',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea iniciar el documento?.',
      accept: () => {
        this.changestatus(ReceptionStatus.started,undefined);
      },
    });
    
  } 
   private getStatusProperties() {
    const obj = new ReceptionUpdateStatus();
    obj.receptionId = this.childReception.id;
    obj.statusId = this.childReception.statusId;
    obj.motiveId = -1;
    obj.observation = '';
    return obj;
  }

  save(){
    var statusBack =  this.childReception.statusId;
    this.merchandiseReceptionService.UpdateChildReception(this.childReception).subscribe((data: number) => {
      if (data > 0) {
        this.idreception = data;
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Actualización exitosa" });
        const link: any[] = ['/srm/reception', data.toString()];
        this.ngOnInit();
      }
    }, (error: HttpErrorResponse) => {
      this.childReception.statusId = statusBack;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al actualizar los datos." });
    });

  }
  finish(){
    this.confirmationService.confirm({
      key:'confirmBack',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea finalizar el documento?.',
      accept: () => {
        this.changestatus(ReceptionStatus.finalized,undefined);
      },
    });
  }
  void(Data) { 
    this.changestatus(ReceptionStatus.canceled,Data);
 }

  haveproduct(data){
     if(data==true)
        this.getReceptionValues();
  }
}
