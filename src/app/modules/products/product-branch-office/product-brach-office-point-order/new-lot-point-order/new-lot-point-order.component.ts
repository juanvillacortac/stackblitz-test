import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Season } from 'src/app/models/masters-mpc/season';
import { Validationrange } from 'src/app/models/masters-mpc/validationrange';
import { Packing } from 'src/app/models/products/packing';
import { PointOrder } from 'src/app/models/products/pointorder';
import { CompaniesBranchOffice } from 'src/app/models/security/CompaniesBranchOffice';
import { PermissionByUserByModule } from 'src/app/models/security/PermissionByUserByModule';
import { SeasonFilter } from 'src/app/modules/masters-mpc/shared/filters/season-filter';
import { ValidationrangeFilter } from 'src/app/modules/masters-mpc/shared/filters/validationrange-filter';
import { SeasonService } from 'src/app/modules/masters-mpc/shared/services/SeasonService/season.service';
import { ValidationrangeService } from 'src/app/modules/masters-mpc/shared/services/ValidationRange/validationrange.service';
import { PackingFilter } from '../../../shared/filters/packing-filter';
import { PackingService } from '../../../shared/services/packingservice/packing.service';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { PointOrderFilter } from '../../../shared/filters/pointorderfilter';

@Component({
  selector: 'app-new-lot-point-order',
  templateUrl: './new-lot-point-order.component.html',
  styleUrls: ['./new-lot-point-order.component.scss']
})
export class NewLotPointOrderComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input("idBranchOffice") idBranchOffice : number = 0;
  @Input("pointOrderListDB") pointOrderListDB: PointOrder[];
  @Input("availableCompaniesBranchOfficeApp") availableCompaniesBranchOfficeApp: PermissionByUserByModule[] = [];
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("refreshLotPointOrder") refreshLotPointOrder = new EventEmitter();
  selectedBranchOffices: PermissionByUserByModule[] = [];
  packingFilter: PackingFilter = new PackingFilter();  
  packingList: SelectItem[];
  seasonList: SelectItem[];
  branchOffices: PermissionByUserByModule[] = [];
  branchOfficeList: PermissionByUserByModule[] = [];
  validationRangeList: SelectItem[];
  listValidationRange: Validationrange[] = [];
  pointOrder: PointOrder = new PointOrder();
  submitted: boolean = false;
  permissionsIDs = {...Permissions};
  checkAllBranchOffice:boolean = false;
  saving: boolean = false;
  
  constructor(private validationRange: ValidationrangeService,
    private messageService: MessageService,
    private productBrachOfficeService: ProductbranchofficeService,
    private packingService : PackingService,
    private seasonService: SeasonService,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {
    
  }

  ngOnShow(){
    this.branchOfficeList = [];
    this.branchOffices = [];
    var branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_POINT_ORDER_PERMISSION_ID);
    branchs.forEach(item => {
      if (this.branchOffices.filter(x => x.idBranchOffice == item.idBranchOffice).length == 0) {
        this.branchOffices.push(item);
      }
    });
    this.packingFilter.productId = this.idproduct;
    this.selectedBranchOffices = [];
    this.pointOrder = new PointOrder();
    this.searchValidationsRange();
    this.searchPackingProduct();
    this.searchSeason();
  }
  
  hideDialog(){
    this.checkAllBranchOffice = false;
    this.selectedBranchOffices = [];
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  checkAllBranchOffices(){
    if (this.checkAllBranchOffice) {
      this.selectedBranchOffices = [];
      var branchselected: PermissionByUserByModule[] = [];
      this.branchOfficeList.forEach(branchoffice => {
        branchselected.push(branchoffice);
      });
      this.selectedBranchOffices = branchselected;
    }else{
      this.selectedBranchOffices = [];
    }
    
  }

  clear(event){
    if (event.target.value == "0,00") {
      event.target.value = "";
    }
  }

  changePacking(){
    this.searchPointOrder(this.pointOrder.idPacking,this.idproduct);
  }

  searchPointOrder(idPacking: number, idProduct: number){
    var filter = new PointOrderFilter();
    filter.idBranchOffice = -1;
    filter.idProduct = parseInt(idProduct.toString());
    this.productBrachOfficeService.getPointOrderbyfilter(filter).subscribe((data: PointOrder[]) => {
      this.branchOfficeList = [];
      this.branchOffices.forEach(bo => {
        if (data.filter(x => x.idBranchOffice == bo.idBranchOffice && x.idPacking == idPacking).length == 0) {
          this.branchOfficeList.push(bo);
        }
      });
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los factores de validacion"});
    });
  }

  searchSeason(){
    var filters = new SeasonFilter();
    filters.active = 1;
    this.seasonService.getSeasonbyfilter(filters).subscribe((data: Season[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.seasonList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los rangos de validación"});
    });
  }
  
  searchValidationsRange(){
    var filters = new ValidationrangeFilter();
    filters.typeValidationRangeId = 1;
    filters.active = 1;
    this.validationRange.geValidationRangebyfilter(filters).subscribe((data: Validationrange[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.listValidationRange = data;
      this.validationRangeList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los rangos de validación"});
    });
  }

  searchPackingProduct(){
    this.packingService.getPackingbyfilter(this.packingFilter).subscribe((data: Packing[]) => {
      data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
      var packings:Packing[] = [];
      var branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_VALIDATION_FACTOR_PERMISSION_ID);
      data.forEach(element => {
        var a = this.pointOrderListDB.filter(x => x.idPacking == element.id);
        if (a.length < branchs.length) {
          packings.push(element)
        }
      });
      this.packingList = packings.map((item)=>({
        label: item.packagingPresentation.name + " X " + item.units,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los rangos de validación"});
    });
  }

  savePointOrder(){
    this.saving = true;
    this.submitted = true;
    var exist: boolean = false;
    this.pointOrderListDB.forEach(pointorder => {
      if (this.selectedBranchOffices.filter(x => x.idBranchOffice == pointorder.idBranchOffice).length > 0 &&
      this.pointOrder.idPacking == pointorder.idPacking && this.pointOrder.idSeason == pointorder.season.id) {
        exist = true;
      }
    });
    if (!exist) {
      if (this.selectedBranchOffices.length > 0) {
        if (this.pointOrder.idPacking > 0 && this.pointOrder.minFactor > 0 && this.pointOrder.midFactor >= this.pointOrder.minFactor && this.pointOrder.maxFactor >= this.pointOrder.midFactor) {
          var pointorderlist: PointOrder[] = [];
          this.selectedBranchOffices.forEach(branchoffice => {
            var po = new PointOrder();
            po.idProduct = parseInt(this.idproduct.toString());
            po.idPacking = this.pointOrder.idPacking;
            po.idSeason = this.pointOrder.idSeason;
            po.idBranchOffice = parseInt(branchoffice.idBranchOffice.toString());
            po.minFactor = this.pointOrder.minFactor;
            po.midFactor = this.pointOrder.midFactor;
            po.maxFactor = this.pointOrder.maxFactor;
            po.active = true;
            pointorderlist.push(po);
          });
          this.productBrachOfficeService.postPointOrder(pointorderlist).subscribe((data)=>{
            if (data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.showDialog = false;
              this.submitted = false;
              this.saving = false;
              this.refreshLotPointOrder.emit();
              this.showDialogChange.emit(this.showDialog);
            }else{
              this.saving = false;
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el punto de pedido"});
            }
          },(error)=>{
            this.saving = false;
          });
        }else{
          this.saving = false;
        }
      }else{
        this.saving = false;
        this.messageService.add({severity:'error', summary:'Error', detail: "Seleccione por lo menos una sucursal"});
      }
    }else{
      this.saving = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Existen sucursales registradas con el empaque y temporada seleccionado"});
    }
    
  }

  changeValidationRange(){
    var validarionrange = this.listValidationRange.find(x => x.id == this.pointOrder.idValidationRange);
    this.pointOrder.minFactor = validarionrange.minimum;
    this.pointOrder.midFactor = validarionrange.middle;
    this.pointOrder.maxFactor = validarionrange.maximum;
  }

}
