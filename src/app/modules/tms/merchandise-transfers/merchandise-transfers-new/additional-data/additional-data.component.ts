import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MerchandiseBranchTransfers } from 'src/app/models/tms/merchandisebranchtransfers';
import { MerchandiseBranchTransfersTransport } from 'src/app/models/tms/merchandisebranchtransferstransport';
import { MerchandiseTransfers } from 'src/app/models/tms/merchandisetransfers';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { MerchandiseTransfersService } from '../../shared/service/merchandise-transfers.service';

@Component({
  selector: 'app-additional-data',
  templateUrl: './additional-data.component.html',
  styleUrls: ['./additional-data.component.scss']
})
export class AdditionalDataComponent implements OnInit {

  loading: boolean = false;
  submitted: boolean = false;
  @Input() visible: boolean = false;
  @Input("showDialog") showDialog: boolean = false;
  @Input("edit") edit: boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("merchandiseBranchTransfer") merchandiseBranchTransfer: MerchandiseBranchTransfers = new MerchandiseBranchTransfers();
  @Input("merchandiseTransfer") merchandiseTransfer: MerchandiseTransfers = new MerchandiseTransfers();
  @Input("additionalData") additionalData: MerchandiseBranchTransfersTransport = new MerchandiseBranchTransfersTransport();
  @Output("refreshBranchTransferList") refreshBranchTransferList = new EventEmitter();
  showDialogVehicle: boolean = false;
  vehiclesString: string = "";
  merchandiseBranchTransferNew: MerchandiseBranchTransfers = new MerchandiseBranchTransfers();
  departureDate: Date;
  entryDate: Date;


  constructor(private merchandiseTranferService: MerchandiseTransfersService,
    private messageService: MessageService,
    private loadingService: LoadingService) {

  }

  ngOnInit(): void {
  }

  onShow() {
    this.vehiclesString = "";
    this.merchandiseBranchTransferNew.additionalData = [];
  }

  saveAdditionalData() {
    this.loadingService.startLoading('wait_loading');
    var validate: Boolean = true;
    this.submitted = true;
    if ((this.edit && (this.merchandiseBranchTransfer.controlNumber != null && this.merchandiseBranchTransfer.controlNumber != "")) || (!this.edit
      && this.departureDate != null && this.entryDate != null && (this.edit || (!this.edit && this.vehiclesString != "")))) {
      this.merchandiseBranchTransfer.controlNumber = this.merchandiseBranchTransfer.controlNumber == null || this.merchandiseBranchTransfer.controlNumber == undefined ? "" : this.merchandiseBranchTransfer.controlNumber;
      this.merchandiseBranchTransfer.transportGuideNumber = this.merchandiseBranchTransfer.transportGuideNumber == null || this.merchandiseBranchTransfer.transportGuideNumber == undefined ? "" : this.merchandiseBranchTransfer.transportGuideNumber;
      this.merchandiseBranchTransfer.observations = this.merchandiseBranchTransfer.observations == null || this.merchandiseBranchTransfer.observations == undefined ? "" : this.merchandiseBranchTransfer.observations;
      var branchTransfer = {...this.merchandiseBranchTransfer};
      if (!this.edit && this.departureDate.getTime() > this.entryDate.getTime()) {
        validate = false;
      }
      if (validate) {
        if (!this.edit) {
          var transportnew = this.merchandiseBranchTransferNew.additionalData.find(x => x.idBranchTransferTransport == -1);
          transportnew.departureDate = this.departureDate;
          transportnew.entryDate = this.entryDate;
          branchTransfer.additionalData = branchTransfer.additionalData == null || branchTransfer.additionalData == undefined ? [] : branchTransfer.additionalData;
          this.merchandiseBranchTransferNew.additionalData.forEach(additionalData => {
            branchTransfer.additionalData.push(additionalData);
          });
        }

        this.merchandiseTranferService.UpdateAdditionalData(branchTransfer).subscribe((data) => {
          if (data.errorId == 0) {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
  
            this.submitted = false;
            this.showDialog = false;
            this.showDialogChange.emit(this.showDialog);
            this.refreshBranchTransferList.emit();
            this.loadingService.stopLoading();
            //this.MerchandiseTransferProductComponent.clearProduct();
          }
          else {
            if (data.errorId > 1000){
              this.loadingService.stopLoading();
              this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
            }else if (data.errorId == 1000){
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos adicionales." });
              this.loadingService.stopLoading();
            }  
          }
        }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos adicionales." });
          this.loadingService.stopLoading();
        });
      }else{
        this.loadingService.stopLoading();
      }
    }else{
      this.loadingService.stopLoading();
    }
  }

  onHide() {
    this.submitted = false;
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  showSearchVehicle() {
    this.showDialogVehicle = true;
  }

  addvehicleslist() {
    this.vehiclesString = "";
    this.vehiclesString = this.merchandiseBranchTransferNew.additionalData.find(x => x.idBranchTransferTransport == -1).vehicle.vehicleCode;
  }
}
