import { Component, Input, Output,OnInit, EventEmitter } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FamilyBurden } from '../../../shared/models/laborRelationship/family-burden';
import { FamilyBurdenViewModel } from '../../../shared/view-models/family-burden-viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-famili-burden-list',
  templateUrl: './famili-burden-list.component.html',
  styleUrls: ['./famili-burden-list.component.scss'],
  providers: [DatePipe]
})
export class FamiliBurdenListComponent implements OnInit {

  @Input()listFamilyBurden: FamilyBurden[];
  showDialog: boolean = false;
  newFamilyBurden: FamilyBurden;
  @Input()familyBurdenList: FamilyBurdenViewModel[];
  family = new FamilyBurden();

  familyBurdenColumns:ColumnD<FamilyBurdenViewModel>[] = 
  [
    { template: (_list) => { return _list.fullName; }, header: 'Nombre',field:'fullName' ,display: 'table-cell' },
    { template: (_list) => { return _list.kinship; }, header: 'Parentesco',field:'kinship' ,display: 'table-cell' },
    { template: (_list) => { return _list.birthDateString; }, header: 'Fecha nac.',field:'birthDateString' ,display: 'table-cell' },
    { template: (_list) => { return _list.registrationDateString; }, header: 'Fecha reg.',field:'registrationDateString' ,display: 'table-cell' },
    { template: (_list) => { return _list.workFlag; }, header: 'Trabaja',field:'workFlag' ,display: 'table-cell' },
    { template: (_list) => { return _list.studyFlag; }, header: 'Estudia',field:'studyFlag' ,display: 'table-cell' },
    { template: (_list) => { return _list.impairmentFlag; }, header: 'Discapac.',field:'impairmentFlag' ,display: 'table-cell' },
    { template: (_list) => { return _list.declaredFlag; }, header: 'ISRL',field:'declaredFlag' ,display: 'table-cell' },
    { template: (_list) => { return _list.active; }, header: 'Activo',field:'active' ,display: 'table-cell' },

    ];
    permissionsIDs = {...Permissions};

  @Output() returnData2: EventEmitter<FamilyBurden> = new EventEmitter<FamilyBurden>();
  @Output() deletedData2: EventEmitter<FamilyBurden> = new EventEmitter<FamilyBurden>();
  constructor(private confirmationService: ConfirmationService,
              public datepipe:DatePipe,
              public userPermissions: UserPermissions,) { }

  ngOnInit(): void {
  }

  add(){
    this.newFamilyBurden = new FamilyBurden();
    this.returnData2.emit(this.newFamilyBurden);
  }

  edit(record: FamilyBurden){
    this.returnData2.emit(record);
  }
}
