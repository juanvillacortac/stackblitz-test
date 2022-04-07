import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MaintenanceClaim} from '../../../shared/models/laborRelationship/maintenance-claim';
import { SalariesForPayrollData } from '../../../shared/models/laborRelationship/salariesforpayrolldata';
import { MaintenanceClaimViewModel } from '../../../shared/view-models/maintenance-claim-viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { MessageService, ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-maintenance-claim-list',
  templateUrl: './maintenance-claim-list.component.html',
  styleUrls: ['./maintenance-claim-list.component.scss']
})
export class MaintenanceClaimListComponent implements OnInit {
  showSidebar3: boolean = false;
  @Input() maintenanceClaimList: MaintenanceClaimViewModel[];
  @Input() salary: SalariesForPayrollData;
  newMaintenanceClaim: MaintenanceClaimViewModel;
  cloneMaintenanceClaim: {[s: string]: MaintenanceClaimViewModel;} = {};
  showEditing: boolean[] = [];

  //para funciones de la tabla
  rowGroupMetadata: any;
  public expandedRows = {};
  public isExpanded:boolean = false;
  public temDataLength:number = 0;

  permissionsIDs = {...Permissions};

  @Output() deletedData3: EventEmitter<MaintenanceClaimViewModel> = new EventEmitter<MaintenanceClaimViewModel>();
  @Output() returnData3: EventEmitter<MaintenanceClaimViewModel> = new EventEmitter<MaintenanceClaimViewModel>();
  @Output() updateData3: EventEmitter<MaintenanceClaimViewModel> = new EventEmitter<MaintenanceClaimViewModel>();


  constructor(private confirmationService: ConfirmationService, public userPermissions: UserPermissions, private messageService: MessageService) { }

  ngOnInit(): void {
    this.updateRowGroupMetaData();
  }

  onSort() {
      this.updateRowGroupMetaData();
  }

    updateRowGroupMetaData() {
      this.rowGroupMetadata = {};
      if (this.maintenanceClaimList) {
        for (let i = 0; i < this.maintenanceClaimList.length; i++) {
          let rowData = this.maintenanceClaimList[i];
          let idLaborRelationshipxFamilyBurden = rowData.idLaborRelationshipxFamilyBurden;
          if( this.showEditing[i] == null){
            this.showEditing[i] = false;
          }
          if (i == 0) {
            this.rowGroupMetadata[idLaborRelationshipxFamilyBurden] = { index: 0, size: 1 };
          }
          else {
            let previousRowData = this.maintenanceClaimList[i - 1];
            let previousRowGroup = previousRowData.idLaborRelationshipxFamilyBurden;
            if (idLaborRelationshipxFamilyBurden === previousRowGroup)
              this.rowGroupMetadata[idLaborRelationshipxFamilyBurden].size++;
            else
              this.rowGroupMetadata[idLaborRelationshipxFamilyBurden] = { index: i, size: 1 };
          }
        }
      }
    }

     deleted(record: MaintenanceClaimViewModel): void{
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Está seguro que desea eliminar esta pensión alimentaria?',
        accept: () => {
          this.deletedData3.emit(record);
        },
        reject: () => {
          
        }
      }); 
    }


     add(){
      this.newMaintenanceClaim = new MaintenanceClaimViewModel();
      this.newMaintenanceClaim.idMaintenanceClaim = -1;
      this.returnData3.emit(this.newMaintenanceClaim);
      //debugger;
     }

  onRowEditInit(record: MaintenanceClaimViewModel, index: number) {
    this.cloneMaintenanceClaim[record.idMaintenanceClaim] = {...record};
    this.showEditing[index] = true;
  }

  onRowEditSave(record: MaintenanceClaimViewModel, index: number) {
      if (record.porcentage <= 0) {
        this.messageService.add({severity:'error', summary: 'Error', detail:'El campo porcentaje es requerido'});
      }  
      else {
        if (record.amount <= 0) {
          this.messageService.add({severity:'error', summary: 'Error', detail:'El campo importe es requerido'});
      }  
      else {
        this.showEditing[index] = false;
        this.updateData3.emit(record);
      }
          
      }
      
  }

  onRowEditCancel(record: MaintenanceClaimViewModel, index: number) {
    debugger;
    this.maintenanceClaimList[index] = this.cloneMaintenanceClaim[record.idMaintenanceClaim];
    record.amount = this.maintenanceClaimList[index].amount;
    record.porcentage = this.maintenanceClaimList[index].porcentage;
    delete this.cloneMaintenanceClaim[record.idMaintenanceClaim];
    this.showEditing[index] = false;
  }

  updateData(record: MaintenanceClaimViewModel, indicator: boolean){
    debugger;
   if(indicator){
      record.amount = record.porcentage * this.salary.amount / 100;
    }else{
      record.porcentage = record.amount * 100 / this.salary.amount;
    }
  }

}
