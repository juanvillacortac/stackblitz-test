import { HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { PermissionByUserByModule } from "src/app/models/security/PermissionByUserByModule";
import * as Permissions from '../../../../security/users/shared/user-const-permissions';
import { Route } from "src/app/models/tms/route";
import { LoadingService } from "src/app/modules/common/components/loading/shared/loading.service";
import { Validations } from "src/app/modules/masters-mpc/shared/Utils/Validations/Validations";
import { BranchofficeService } from "src/app/modules/masters/branchoffice/shared/services/branchoffice.service";
import { CoinsService } from "src/app/modules/masters/coin/shared/service/coins.service";
import { PermissionByUserByModuleFilter } from "src/app/modules/security/shared/view-models/PermissionByUserByModuleFilter";
import { RouteFilter } from "../../shared/filter/route-filter";
import { RouteService } from "../../shared/service/route.service";
import { AuthService } from "src/app/modules/login/shared/auth.service";
import { SecurityService } from "src/app/modules/security/shared/services/security.service";

@Component({
  selector: 'app-master-route-panel',
  templateUrl: './master-route-panel.component.html',
  styleUrls: ['./master-route-panel.component.scss']
})
export class MasterRoutePanelComponent implements OnInit {

  _submitted:boolean = false;  
  _validations:Validations = new Validations();  
  @Input("route") _route:Route;
  @Input("showPanel") _showPanel:boolean = true;
  @Input("filter") _filter:RouteFilter;
  @Input("status") _status:boolean;
  @Output() showPanelChange = new EventEmitter<boolean>();

  branchOfficeOriginList: SelectItem[];
  branchOfficeDestinationList: SelectItem[];
  _permissionBranchOfficeList: PermissionByUserByModule[] = [];
  _permissionsIDs = {...Permissions};
  currencyList: SelectItem[];
  statuslist: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];

  indViaticList: SelectItem[] = [
    {label: 'Si', value: true},
    {label: 'No', value: false},
  ];

  constructor(private _Authservice: AuthService, public _securityService:SecurityService, private _routeService: RouteService, private _branchOfficeService: BranchofficeService, private _currecyService: CoinsService, private _messageService: MessageService, private _confirmationService: ConfirmationService, private _loadingService: LoadingService){    
  }

  ngOnInit(): void {    
    
    this.onLoadBranchOffices();
    
    this._currecyService.getCoinsList()
    .subscribe((data)=>{
      this.currencyList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    }); 
 
    if(this._route.id<=0)
      this._route.active=true;
  }

  onLoadBranchOffices(){        
    this.branchOfficeOriginList = [];
    this.branchOfficeDestinationList = [];
    var filter = new PermissionByUserByModuleFilter();    
    const { id } = this._Authservice.storeUser;
    filter.idUser = id;
    filter.idBranchOffice = -1;
    filter.idModule = 157;//Modulo de Maestro de Rutas
    this._securityService.getPermissionByUserByModule(filter).then(softwareList => {
      this._permissionBranchOfficeList  = softwareList;
    });       
    this._permissionBranchOfficeList.forEach(PermissionBranchOffice => {
      if(PermissionBranchOffice.idAccessModule == this._permissionsIDs.UPDATE_ROUTE_PERMISSION_ID)
      {
        this.branchOfficeOriginList.push({
          label : PermissionBranchOffice.branchOffice,
          value: PermissionBranchOffice.idBranchOffice
        });
        this.branchOfficeDestinationList.push({
          label : PermissionBranchOffice.branchOffice,
          value: PermissionBranchOffice.idBranchOffice
        });
      }
    });
  }

  hidePanel(): void {
    this._showPanel = false;
    this.showPanelChange.emit(this._showPanel);
    this._submitted = false;
    this._route = new Route();    
  }

  routeEdit(pRoute: Route){   
    this.ngOnInit();
    this._status = pRoute.active;     
    this._route = new Route();
    this._route.id = pRoute.id;
    this._route.codeRoute = pRoute.codeRoute;
    this._route.idBranchOfficeOrigin = pRoute.idBranchOfficeOrigin;
    this._route.idBranchOfficeDestination = pRoute.idBranchOfficeDestination;
    this._route.idCurrency = pRoute.idCurrency;
    this._route.indViatics = pRoute.indViatics;
    this._route.approximateDistance = pRoute.approximateDistance;
    this._route.approximateTime = pRoute.approximateTime;
    this._route.viaticAmount = pRoute.viaticAmount;
    this._route.active = pRoute.active;
    this._route.observations = pRoute.observations;    
    this._route.createdByUserId = pRoute.createdByUserId;
    this._route.updatedByUserId = pRoute.updatedByUserId;     
    this._showPanel = true;
    
  }

  save(){    
    this._loadingService.startLoading();
    this._routeService.InsertUpdateRoutes(this._route).subscribe((data) => { 
     if (data.idResponseCode == 0)
      {
         this._messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
         this._showPanel = false;
         this.showPanelChange.emit(this._showPanel);
         this._route= new Route();
         this._route.active = true;               
         this._routeService.getRoutesList(this._filter).subscribe((data:Route[]) => {
         this._routeService._routeList = data;
         this._submitted = false;
        });
      }
     else
      {
        if(data.idResponseCode > 1000)
         this._messageService.add({ severity: 'error', summary: 'Error', detail: data.responseCode });
        else if(data.idResponseCode==1000)
           this._messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
      }
      }, (error: HttpErrorResponse) => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });        
        this._loadingService.stopLoading();
      });      
      this._loadingService.stopLoading();
 }
 
  submit()
  {        
    this._submitted = true;     
    if(this._route.idBranchOfficeOrigin > 0 && this._route.idBranchOfficeDestination > 0 
      && this._route.indViatics !== null && this._route.indViatics !== undefined
      && this._route.approximateDistance.toString() !== "" && this._route.approximateDistance > 0
      && this._route.approximateTime.toString() !== "" && this._route.approximateTime > 0
      && this._route.idBranchOfficeOrigin != this._route.idBranchOfficeDestination)
    {      
      if(this._route.indViatics == false)
      {
        this._route.idCurrency = 0;
        this._route.viaticAmount = 0;
      }       
      this._route.id == 0 ? -1 : this._route.id;
      this._route.observations == null ? "" : this._route.observations;
      if(this._route.active || this._route.active == this._status){
          this.save();
      }else{
        this._confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: 'Si inactiva el registro, las configuraciones asociadas\ a este se dejarán de visualizar, ¿desea proceder con la acción?',
          accept: () => {
            this.save();
          },
        });
        this._submitted = false;
      }
    }             
  }                        
}
