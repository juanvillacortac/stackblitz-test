import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/api';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { BranchofficeFilter } from 'src/app/modules/masters/branchoffice/shared/filters/branchoffice-filter';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { RequestTypeFilter } from '../../shared/filters/requesttype-filter';
import { UseTypeFilter } from '../../shared/filters/usetype-filter';
import { CommontmsService } from '../../shared/service/common.service';
import { MerchandiseTransfersFilter } from '../shared/filters/merchandise-transfers-filters';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Component({
  selector: 'app-merchandise-transfers-filter',
  templateUrl: './merchandise-transfers-filter.component.html',
  styleUrls: ['./merchandise-transfers-filter.component.scss']
})
export class MerchandiseTransfersFilterComponent implements OnInit {

  @Input() expanded: boolean = false;
  @Input("filters") filters: MerchandiseTransfersFilter;
  @Input("loading") loading: boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<MerchandiseTransfersFilter>();
  items: MenuItem[]= [
    {label: 'Transferencia en blanco', command: () => {
      this.openNew();
    }},
    /* {label: 'Transferencia por compra', command: () => {
      this.openNewMerchandisePurchase();
    }},*/
    {label: 'Transferencia por solicitud', command: () => {
      this.openNewMerchandiseRequest();
    }} 
  ];
  transferTypeList: SelectItem[] = [];
  useTypeList: SelectItem[] = [];
  branchOfficeList: SelectItem[] = [];
  statusList: SelectItem[] = [];
  showDialogMerchandisePurchase: boolean = false;
  showDialogMerchandiseRequest: boolean = false;
  permissionsIDs = {...Permissions};

  constructor(private commonTMSservice: CommontmsService,
    private commonService: CommonService,
    private branchOfficeService: BranchofficeService,
    private router: Router,
    public userPermissions: UserPermissions,
    private _Authservice: AuthService) { }

  ngOnInit(): void {
    this.onLoadTransferTypeList();
    this.onLoadUseTypeList();
    this.onLoadStatusList();
    this.onLoadBranchOfficeList();
  }

  search() {

    this.onSearch.emit(this.filters);
  }

  openNew() {
    this.router.navigate(['/tms/merchandise-transfers', 0,0]);
  }

  openNewMerchandisePurchase(){
    this.showDialogMerchandisePurchase = true;
  }

  openNewMerchandiseRequest(){
    this.showDialogMerchandiseRequest = true;
  }

  clearFilters() {
    this.filters.transferNumber = "";
    this.filters.destinationBranchId = -1;
    this.filters.originBranchId = -1;
    this.filters.endDate = null;
    this.filters.startDate = null;
    this.filters.statusId = -1;
    this.filters.useTypeId = -1;
    this.filters.transferTypeId = -1;
  }

  onLoadTransferTypeList() {
    var filter: RequestTypeFilter = new RequestTypeFilter();
    filter.active = 1;
    this.commonTMSservice.getTransferTypesList(filter)
      .subscribe((data) => {
        this.transferTypeList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadUseTypeList() {
    var filter: UseTypeFilter = new UseTypeFilter();
    filter.active = 1;
    this.commonTMSservice.getUseTypesList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.useTypeList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadBranchOfficeList() {
    var filter: BranchofficeFilter = new BranchofficeFilter();
    filter.active = 1;
    filter.idCompany = this._Authservice.currentCompany;
    this.branchOfficeService.getBranchOfficeList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.branchOfficeName.localeCompare(b.branchOfficeName));
        this.branchOfficeList = data.map((item) => ({
          label: item.branchOfficeName,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  onLoadStatusList() {
    var filter: StatusFilter = new StatusFilter();
    filter.IdStatusType = 16;
    this.commonService.getStatus(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.statusList = data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }
}
