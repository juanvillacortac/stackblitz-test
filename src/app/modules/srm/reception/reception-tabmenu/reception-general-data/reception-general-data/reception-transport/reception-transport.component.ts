import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { FormDelivery } from 'src/app/models/srm/common/form-delivery';
import { Transport } from 'src/app/models/srm/common/transport';
import { TransportType } from 'src/app/models/srm/common/transport-type';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { FormDeliveryFilter } from 'src/app/modules/srm/shared/filters/common/form-delivery-filter';
import { TransportTypeFilter } from 'src/app/modules/srm/shared/filters/common/transport-type-filter';
import { CommonsrmService } from 'src/app/modules/srm/shared/services/common/commonsrm.service';

@Component({
  selector: 'app-reception-transport',
  templateUrl: './reception-transport.component.html',
  styleUrls: ['./reception-transport.component.scss']
})
export class ReceptionTransportComponent implements OnInit {

  @Input('transport') transport: Transport=new Transport();

  deliveryMethods:any[] = [];
  transportTypes: any[] = [];

  constructor(private readonly commonSRMService: CommonsrmService, 
    private readonly dialogService: DialogsService) { }

  ngOnInit(): void {
    this.loadDeliveryMethods();
    this.loadTransportTypes();
    this.transport=this.transport;
  }

  save() {
    
  }

  private loadDeliveryMethods() {
    var filter: FormDeliveryFilter = new FormDeliveryFilter();
    filter.id = -1;
    filter.active = 1;
    this.commonSRMService.getFormDelivery({...filter}).subscribe((data)=>{
      this.deliveryMethods= data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });  
    //.then(data => this.deliveryMethods = data)
    //.catch(error =>this.handleError(error));
  }

  private loadTransportTypes() {
    const filters = new TransportTypeFilter();
    filters.id = -1;
    this.commonSRMService.getTransportTypes({...filters})
    .subscribe((data)=>{
      this.transportTypes= data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });  
    //.then(data => this.transportTypes = data)
    //.catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

}
