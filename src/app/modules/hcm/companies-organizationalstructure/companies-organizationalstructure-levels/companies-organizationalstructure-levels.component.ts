//modules
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
//models
import { companylevel } from '../../shared/models/masters/company-level';
import { HierarchicalLevel } from '../../shared/models/masters/hierarchical-level';

//filters
import { companylevelsfilter } from '../../../hcm/shared/filters/company-levels-filter';
//services
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyService } from '../../../hcm/shared/services/company.service';
//Theme components
import { MessageService, ConfirmationService } from 'primeng/api'; 

@Component({
  selector: 'app-companies-organizationalstructure-levels',
  templateUrl: './companies-organizationalstructure-levels.component.html',
  styleUrls: ['./companies-organizationalstructure-levels.component.scss']
})

export class CompaniesOrganizationalstructureLevelsComponent implements OnInit {

  constructor(private messageService: MessageService,
    private companyService: CompanyService,
    private actRoute: ActivatedRoute,
    public _authService: AuthService,
    public userPermissions: UserPermissions,
    private confirmationService: ConfirmationService) { }

  companylevelsFilters: companylevelsfilter = new companylevelsfilter();

  @Input()levels: companylevel[];
  @Output() delete: EventEmitter<HierarchicalLevel> = new EventEmitter<HierarchicalLevel>();
  @Output() save: EventEmitter<companylevel> = new EventEmitter<companylevel>();

  
  _levelpass: companylevel = new companylevel();

  permissionsIDs = { ...Permissions };

  ngOnInit(): void {
   
  }

  editlevel(record: companylevel){
    if(record){
      this.save.emit(record);
    }else{
      this.save.emit(this._levelpass);
    }
  }

  deletelevel(record: HierarchicalLevel){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar este nivel?',
      accept: () => {
        this.delete.emit(record);
      },
      reject: () => {
        
      }
    }); 
  }
}
