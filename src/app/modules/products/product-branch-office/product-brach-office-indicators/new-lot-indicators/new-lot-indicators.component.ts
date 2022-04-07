import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { Packing } from 'src/app/models/products/packing';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { CompaniesBranchOffice } from 'src/app/models/security/CompaniesBranchOffice';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { PackingFilter } from '../../../shared/filters/packing-filter';
import { PackingService } from '../../../shared/services/packingservice/packing.service';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { PermissionByUserByModule } from 'src/app/models/security/PermissionByUserByModule';
import { PackingByBranchOfficeFilter } from '../../../shared/filters/packingbybranchoffice-filter';

@Component({
  selector: 'app-new-lot-indicators',
  templateUrl: './new-lot-indicators.component.html',
  styleUrls: ['./new-lot-indicators.component.scss']
})
export class NewLotIndicatorsComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input("idBranchOffice") idBranchOffice : number = 0;
  @Input("availableCompaniesBranchOfficeApp") availableCompaniesBranchOfficeApp: PermissionByUserByModule[] = [];
  @Input("packingBranchOfficeListDB") packingBranchOfficeListDB: PackingByBranchOffice[];
  @Output() showDialogChange = new EventEmitter<boolean>();
  selectedBranchOffices: PermissionByUserByModule[] = [];
  coinsList: SelectItem[];
  packingList: SelectItem[];
  packingBranchOffice: PackingByBranchOffice = new PackingByBranchOffice();
  submitted: boolean = false;
  packingFilter: PackingFilter = new PackingFilter();  
  baseCoin: number = -1;
  conversionCoin: number = -1;
  exchangeRate: number = 0;
  indhardcurrency: boolean = false;
  statusList: SelectItem[];
  permissionsIDs = {...Permissions};
  branchOffices: PermissionByUserByModule[] = [];
  branchOfficeList: PermissionByUserByModule[] = [];
  checkAllBranchOffice:boolean = false;
  saving: boolean = false;
  @Output("refreshLotPackingBranchOffice") refreshLotPackingBranchOffice = new EventEmitter();
  
  constructor(private messageService: MessageService,
    private productBrachOfficeService: ProductbranchofficeService,
    private packingService : PackingService,
    private commonService: CommonService,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {
    
  }

  ngOnShow(){
    this.branchOfficeList = [];
    this.branchOffices = [];
    var branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_INDICATORS_BRANCH_PRODUCT_PERMISSION_ID);
    branchs.forEach(item => {
      if (this.branchOffices.filter(x => x.idBranchOffice == item.idBranchOffice).length == 0) {
        this.branchOffices.push(item);
      }
    });
    this.packingFilter.productId = this.idproduct;
    //if (this.packingBranchOffice.idProduct <= 0) {
      this.packingBranchOffice = new PackingByBranchOffice();
    //}
    this.searchPackingProduct();
    this.searchStatusProduct();
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

  changePacking(){
    this.searchPricesCosts(this.packingBranchOffice.idPacking,this.idproduct);
  }

  searchPricesCosts(idPacking: number, idProduct: number){
    var filter = new PackingByBranchOfficeFilter();
    filter.idBranchOffice = -1;
    filter.idPacking = idPacking;
    filter.idProduct = idProduct;
    this.productBrachOfficeService.getPackingBranchOfficebyfilter(filter).subscribe((data: PackingByBranchOffice[]) => {
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

  searchPackingProduct(){
    this.packingService.getPackingbyfilter(this.packingFilter).subscribe((data: Packing[]) => {
      data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
      var packings:Packing[] = [];
      var branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_VALIDATION_FACTOR_PERMISSION_ID);
      data.forEach(element => {
        var a = this.packingBranchOfficeListDB.filter(x => x.idPacking == element.id);
        if (a.length < branchs.length) {
          packings.push(element)
        }
      });
      this.packingList = packings.map((item)=>({
        label: item.packagingPresentation.name + " X " + item.units,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de empaques"});
    });
  }

  searchStatusProduct(){
    var filter = new StatusFilter();
    filter.IdStatusType = 1;
    this.commonService.getStatus(filter).subscribe((data: Status[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.statusList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de empaques"});
    });
  }

  saveIndicators(){
    this.saving = true;
    this.submitted = true;
    var exist: boolean = false;
    this.packingBranchOfficeListDB.forEach(pointorder => {
      if (this.selectedBranchOffices.filter(x => x.idBranchOffice == pointorder.idBranchOffice).length > 0 &&
      this.packingBranchOffice.idPacking == pointorder.idPacking) {
        exist = true;
      }
    });
    if (!exist) {
      if (this.selectedBranchOffices.length > 0) {
        if (this.packingBranchOffice.idPacking > 0) {
          var packingBranchOfficelist: PackingByBranchOffice[] = [];
          this.selectedBranchOffices.forEach(branchoffice => {
            var po = new PackingByBranchOffice();
            po.idProductBranchOfficePacking = -1;
            po.idProduct = parseInt(this.idproduct.toString());
            po.idPacking = this.packingBranchOffice.idPacking;
            po.idStatus = this.packingBranchOffice.idStatus = 1;
            po.idBranchOffice = parseInt(branchoffice.idBranchOffice.toString());
            po.idReason = 0;
            po.baseCost = this.packingBranchOffice.baseCost;
            po.baseNetCost = this.packingBranchOffice.baseNetCost;
            po.basePVP = this.packingBranchOffice.basePVP;
            po.netSellingCostBase = this.packingBranchOffice.netSellingCostBase;
            po.conversionCost = this.packingBranchOffice.conversionCost;
            po.conversionNetCost = this.packingBranchOffice.conversionNetCost;
            po.conversionPVP = this.packingBranchOffice.conversionPVP;
            po.netSellingCostConversion = this.packingBranchOffice.netSellingCostConversion;
            po.netFactor = this.packingBranchOffice.netFactor;
            po.sellingFactor = this.packingBranchOffice.sellingFactor;
            po.netSalesFactor = this.packingBranchOffice.netSalesFactor;
            po.indActiveBuy = this.packingBranchOffice.indActiveBuy;
            po.indActiveSale = this.packingBranchOffice.indActiveSale;
            po.indConsignment = this.packingBranchOffice.indConsignment;
            po.indOnline = this.packingBranchOffice.indOnline;
            po.indIVA = this.packingBranchOffice.indIVA;
            po.indShelf = this.packingBranchOffice.indShelf;
            po.indTower = this.packingBranchOffice.indTower;
            po.idSuplier = 0;
            packingBranchOfficelist.push(po);
          });
          this.productBrachOfficeService.postPackingBranchOffice(packingBranchOfficelist).subscribe((data)=>{
            if (data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.showDialog = false;
              this.submitted = false;
              this.saving = false;
              this.refreshLotPackingBranchOffice.emit();
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
      this.messageService.add({severity:'error', summary:'Error', detail: "Existen sucursales registradas con el empaque seleccionado"});
    }
    
  }

  refreshPackingBranchOffice(){

  }
}
