import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { Packing } from 'src/app/models/products/packing';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { PackingFilter } from '../../../shared/filters/packing-filter';
import { PackingService } from '../../../shared/services/packingservice/packing.service';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';

@Component({
  selector: 'app-new-indicators',
  templateUrl: './new-indicators.component.html',
  styleUrls: ['./new-indicators.component.scss']
})
export class NewIndicatorsComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input("idBranchOffice") idBranchOffice : number = 0;
  @Input("packingBranchOfficeListDB") packingBranchOfficeListDB: PackingByBranchOffice[];
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("refreshPackingBranchOffice") refreshPackingBranchOffice = new EventEmitter();
  showDialogReason: boolean = false;
  packingList: SelectItem[];
  statusList: SelectItem[];
  @Input("packingBranchOffice") packingBranchOffice: PackingByBranchOffice;
  packingBranchOfficeTemp: PackingByBranchOffice = new PackingByBranchOffice();
  submitted: boolean = false;
  packingFilter: PackingFilter = new PackingFilter();  
  baseCoin: number = -1;
  conversionCoin: number = -1;
  exchangeRate: number = 0;
  indhardcurrency: boolean = false;
  idStatusProduct: number = -1;
  idModule: number = 0;
  saving: boolean = false;
  
  constructor(private messageService: MessageService,
    private productBrachOfficeService: ProductbranchofficeService,
    private packingService : PackingService,
    private commonService: CommonService) { }

  ngOnInit(): void {
  }

  ngOnShow(){
    
    this.packingBranchOfficeTemp.idPacking = this.packingBranchOffice.idPacking;
    this.packingFilter.productId = this.idproduct;
    if (this.packingBranchOffice.idProduct > 0) {
      this.idStatusProduct = this.packingBranchOffice.idStatus;
    }
    this.searchPackingProduct();
    this.searchStatusProduct();
  }
  
  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  searchPackingProduct(){
    this.packingService.getPackingbyfilter(this.packingFilter).subscribe((data: Packing[]) => {
      data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
      this.packingList = data.map((item)=>({
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
    
      if (this.packingBranchOffice.idProduct > 0 && this.packingBranchOffice.idPacking == this.packingBranchOfficeTemp.idPacking && this.packingBranchOffice.idBranchOffice == this.idBranchOffice) {
        this.packingBranchOfficeListDB = this.packingBranchOfficeListDB.filter(x => x.idPacking != this.packingBranchOffice.idPacking && this.packingBranchOffice.idBranchOffice != this.idBranchOffice);
      }
      if (this.packingBranchOfficeListDB.filter(x => x.idPacking == this.packingBranchOffice.idPacking && x.idBranchOffice == this.idBranchOffice).length == 0) {
        if (this.packingBranchOffice.idPacking > 0) {
          if (this.idStatusProduct == 1 && this.packingBranchOffice.idStatus == 2) {
            this.idModule = 35;
            this.showDialogReason = true;
            this.saving = false;
          }else{
            var packingBranchOfficelist: PackingByBranchOffice[] = [];
    
            this.packingBranchOffice.idProduct = parseInt(this.idproduct.toString());
            this.packingBranchOffice.idPacking = this.packingBranchOffice.idPacking;
            this.packingBranchOffice.idBranchOffice = parseInt(this.idBranchOffice.toString());
            this.packingBranchOffice.idReason = 0;
            this.packingBranchOffice.idSuplier = this.packingBranchOffice.idSuplier == -1 ? 0 : this.packingBranchOffice.idSuplier;
            this.packingBranchOffice.idStatus = this.packingBranchOffice.idStatus == -1 ? 1 : this.packingBranchOffice.idStatus;
            packingBranchOfficelist.push(this.packingBranchOffice);
            
            this.productBrachOfficeService.postPackingBranchOffice(packingBranchOfficelist).subscribe((data)=>{
              if (data > 0) {
                this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
                this.showDialog = false;
                this.submitted = false;
                this.saving = false;
                this.refreshPackingBranchOffice.emit();
                this.showDialogChange.emit(this.showDialog);
              }else{
                this.saving = false;
                this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar los indicadores"});
              }
            },(error)=>{
              this.saving = false;
            });
          }
        }else{
          this.saving = false;
        }
      }else{
        this.saving = false;
        this.submitted = false;
        this.messageService.add({severity:'error', summary:'Error', detail: "Este empaque ya tiene un indicador registrado"});
      }
  }

  refreshPackingBranchOffices(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.refreshPackingBranchOffice.emit();
  }
}
