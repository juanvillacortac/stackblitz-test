import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { EmployeeResumeComponent } from 'src/app/modules/hcm/dashboard-modals/employeeProfile/employee-resume/employee-resume.component';
import * as CountStatus from '../../../shared/service/count-status-const';

@Component({
  selector: 'app-inventory-counts-calendar-resume',
  templateUrl: './inventory-counts-calendar-resume.component.html',
  styleUrls: ['./inventory-counts-calendar-resume.component.scss'],
  providers: [DialogService]
})
export class InventoryCountsCalendarResumeComponent implements OnInit {

  constructor(private route: Router, public dialogService: DialogService) { }
  item: DataviewListModel = new DataviewListModel();
  inventoryCount = new InventoryCount();
  

  ngOnInit(): void {
  }

  ref: DynamicDialogRef;

  isCountFinalized() {
    return this.inventoryCount.idstatus === CountStatus.FINALIZED_ADJUSTEMENT_STATUS_ID || this.inventoryCount.idstatus === CountStatus.FINALIZED_STATUS_ID;
  }

  onShowCountDetail(pId: number)
  {
    this.route.navigate(['/ims/detail-inventory-count', pId]);
  }

  viewDetailUser(id:number){
    debugger   
    this.item.id = id; 
    this.ref = this.dialogService.open(EmployeeResumeComponent, {
      data: {
        id: this.item//buscar id de proveedor
    },
    header: 'Perfil',
    width: '30%',
    contentStyle: {"max-height": "1000px", "overflow-y": "unset", "padding": "0px"},
    baseZIndex: 10000
    });

    this.ref.onClose.subscribe(() =>{
   });

  }

}
