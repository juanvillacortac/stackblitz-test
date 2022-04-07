import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Reception, ReceptionProperties, ReceptionStatus } from 'src/app/models/srm/reception';
import { ReceptionGeneralDataComponent } from '../reception-general-data/reception-general-data/reception-general-data.component';
import { ReceptionComponent } from '../reception/reception.component';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';

@Component({
  selector: 'app-reception-tabmenu',
  templateUrl: './reception-tabmenu.component.html',
  styleUrls: ['./reception-tabmenu.component.scss']
})
export class ReceptionTabmenuComponent implements OnInit {

  @Input() reception: Reception = new Reception();
  @Input() submitted: boolean;
  @Input() receptionProperties: ReceptionProperties;
  @ViewChild(ReceptionComponent) receptionComponent:ReceptionComponent;
  statusreception: typeof ReceptionStatus  = ReceptionStatus;
  @Output('haveChange') haveChange = new EventEmitter<boolean>();
  @ViewChild(ReceptionGeneralDataComponent) generaL :ReceptionGeneralDataComponent

  validationIsSelected: boolean = false;
  permissions: number[] = [];
  permissionsIDs = {...Permissions};

  constructor(public userPermissions: UserPermissions) { }

  ngOnInit(): void {
    this.reception=this.reception;
  }
  

  handleChange(e) {
    this.clearSelectedProperties();

    if(e.index==0) {
      this.reception=this.reception;
    }

    if(e.index==1) {
      this.receptionComponent.onshow();
    }
    else {
      if (e.index == 2) {
        this.validationIsSelected = true;
      }
    }

  }

  private clearSelectedProperties() {
    this.validationIsSelected = false;
  }
  haveproduct(data){
    this.haveChange.emit(data);
  }
  updatedate(reception){
    this.generaL.updatesetValueDates(reception)
  }
}
