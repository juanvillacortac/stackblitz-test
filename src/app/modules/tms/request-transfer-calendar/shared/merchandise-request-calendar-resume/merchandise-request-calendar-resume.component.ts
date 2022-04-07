import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataviewListModel } from 'src/app/models/common/dataview-list-model';
import { MerchandiseRequest } from 'src/app/models/tms/merchandiserequest';
import { EmployeeResumeComponent } from 'src/app/modules/hcm/dashboard-modals/employeeProfile/employee-resume/employee-resume.component';

@Component({
  selector: 'app-merchandise-request-calendar-resume',
  templateUrl: './merchandise-request-calendar-resume.component.html',
  styleUrls: ['./merchandise-request-calendar-resume.component.scss'],
  providers: [DialogService]
})
export class MerchandiseRequestCalendarResumeComponent implements OnInit {

  constructor(public dialogService: DialogService) { }
  item: DataviewListModel = new DataviewListModel();
  merchandiseRequest: MerchandiseRequest = new MerchandiseRequest();
  

  ngOnInit(): void {
  }

  ref: DynamicDialogRef;

  isCountFinalized() {
    //return this.inventoryCount.idstatus === CountStatus.FINALIZED_ADJUSTEMENT_STATUS_ID || this.inventoryCount.idstatus === CountStatus.FINALIZED_STATUS_ID;
  }

  onShowCountDetail(pId: number)
  {
    //this.route.navigate(['/ims/detail-inventory-count', pId]);
  }

  prueba(id:number){
    debugger   
    this.item.id = id; 
    this.ref = this.dialogService.open(EmployeeResumeComponent, {
      data: {
        id: this.item
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
