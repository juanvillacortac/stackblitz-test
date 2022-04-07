import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Validationrange } from 'src/app/models/masters-mpc/validationrange';
import { Packing } from 'src/app/models/products/packing';
import { CompaniesBranchOffice } from 'src/app/models/security/CompaniesBranchOffice';
import { ValidationrangeFilter } from 'src/app/modules/masters-mpc/shared/filters/validationrange-filter';
import { ValidationrangeService } from 'src/app/modules/masters-mpc/shared/services/ValidationRange/validationrange.service';
import { PackingFilter } from '../../../shared/filters/packing-filter';
import { PackingService } from '../../../shared/services/packingservice/packing.service';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';
import { ValidationFactor } from '../../../../../models/products/validationfactor';
import { PermissionByUserByModule } from 'src/app/models/security/PermissionByUserByModule';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ValidationFactorFilter } from '../../../shared/filters/validationfactorfilter';

@Component({
  selector: 'app-new-lot-validation-factor',
  templateUrl: './new-lot-validation-factor.component.html',
  styleUrls: ['./new-lot-validation-factor.component.scss']
})
export class NewLotValidationFactorComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input("idBranchOffice") idBranchOffice : number = 0;
  @Input("validationFactorListDB") validationFactorListDB: ValidationFactor[];
  @Input("availableCompaniesBranchOfficeApp") availableCompaniesBranchOfficeApp: PermissionByUserByModule[] = [];
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("refreshLotValidationFactor") refreshLotValidationFactor = new EventEmitter();
  branchOffices: PermissionByUserByModule[] = [];
  branchOfficeList: PermissionByUserByModule[] = [];
  selectedBranchOffices: PermissionByUserByModule[] = [];
  packingFilter: PackingFilter = new PackingFilter();  
  packingList: SelectItem[];
  permissionsIDs = {...Permissions};
  validationRangeList: SelectItem[];
  listValidationRange: Validationrange[] = [];
  validationFactor: ValidationFactor = new ValidationFactor();
  submitted: boolean = false;
  checkAllBranchOffice:boolean = false;
  saving: boolean = false;
  
  constructor(private validationRange: ValidationrangeService,
    private messageService: MessageService,
    private productBrachOfficeService: ProductbranchofficeService,
    private packingService : PackingService,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {
    
  }

  ngOnShow(){
    this.branchOfficeList = [];
    this.branchOffices = [];
    var branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_VALIDATION_FACTOR_PERMISSION_ID);
    branchs.forEach(item => {
      if (this.branchOffices.filter(x => x.idBranchOffice == item.idBranchOffice).length == 0) {
        this.branchOffices.push(item);
      }
    });
    this.packingFilter.productId = this.idproduct;
    this.selectedBranchOffices = [];
    this.validationFactor = new ValidationFactor();
    this.searchValidationsRange();
    this.searchPackingProduct();
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
  
  hideDialog(){
    this.checkAllBranchOffice = false;
    this.selectedBranchOffices = [];
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  clear(event){
    if (event.target.value == "0,00") {
      event.target.value = "";
    }
  }

  changeValidationFactor(){
    this.searchValidationFactor(this.validationFactor.idPacking,this.idproduct);
  }

  searchValidationFactor(idPacking: number, idProduct: number){
    var filter = new ValidationFactorFilter();
    filter.idBranchOffice = -1;
    filter.idProduct = parseInt(idProduct.toString());
    filter.idPacking = parseInt(idPacking.toString());
    this.productBrachOfficeService.getValidationFactorbyfilter(filter).subscribe((data: ValidationFactor[]) => {
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

  searchValidationsRange(){
    var filters = new ValidationrangeFilter();
    filters.typeValidationRangeId = 2;
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
    //debugger;
    this.packingFilter.productId = parseInt(this.packingFilter.productId.toString());
    this.packingService.getPackingbyfilter(this.packingFilter).subscribe((data: Packing[]) => {
      data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
      var packings:Packing[] = [];
      var branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_VALIDATION_FACTOR_PERMISSION_ID);
      data.forEach(element => {
        var a = this.validationFactorListDB.filter(x => x.idPacking == element.id);
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

  saveValidationFactor(){
    this.saving = true;
    this.submitted = true;
    var exist: boolean = false;
    this.validationFactorListDB.forEach(validationfactor => {
      if (this.selectedBranchOffices.filter(x => x.idBranchOffice == validationfactor.idBranchOffice).length > 0 &&
      this.validationFactor.idPacking == validationfactor.idPacking) {
        exist = true;
      }
    });
    if (!exist) {
      if (this.selectedBranchOffices.length > 0) {
        if (this.validationFactor.idPacking > 0 && this.validationFactor.minFactor > 0 && this.validationFactor.midFactor >= this.validationFactor.minFactor && this.validationFactor.maxFactor >= this.validationFactor.midFactor) {
          var validationfactorlist: ValidationFactor[] = [];
          this.selectedBranchOffices.forEach(branchoffice => {
            var vf = new ValidationFactor();
            vf.idProduct = parseInt(this.idproduct.toString());
            vf.idPacking = this.validationFactor.idPacking;
            vf.idBranchOffice = parseInt(branchoffice.idBranchOffice.toString());
            vf.minFactor = this.validationFactor.minFactor;
            vf.midFactor = this.validationFactor.midFactor;
            vf.maxFactor = this.validationFactor.maxFactor;
            vf.active = true;
            validationfactorlist.push(vf);
          });
          this.productBrachOfficeService.postValidationFactor(validationfactorlist).subscribe((data)=>{
            if (data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.showDialog = false;
              this.submitted = false;
              this.saving = false;
              this.refreshLotValidationFactor.emit();
              this.showDialogChange.emit(this.showDialog);
            }else{
              this.saving = false;
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el factor de validación"});
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
      this.messageService.add({severity:'error', summary:'Error', detail: "Existen sucursales registradas con el empaque seleccionado"});
    }
    
  }

  changeValidationRange(){
    var validarionrange = this.listValidationRange.find(x => x.id == this.validationFactor.idValidationRange);
    this.validationFactor.minFactor = validarionrange.minimum;
    this.validationFactor.midFactor = validarionrange.middle;
    this.validationFactor.maxFactor = validarionrange.maximum;
  }
}
