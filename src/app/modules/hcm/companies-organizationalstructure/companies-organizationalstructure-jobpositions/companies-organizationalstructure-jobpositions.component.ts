//modules 
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
//models
import { companylevel } from '../../shared/models/masters/company-level';
import { companyjobposition } from '../../shared/models/masters/company-jobposition';
import { companymtjobposition } from '../../shared/models/masters/company-mtjobposition';
import { JobPosition } from '../../shared/models/masters/job-position';
//filters
import { companylevelsfilter } from '../../../hcm/shared/filters/company-levels-filter';
import { companyjobpositionsfilter } from '../../../hcm/shared/filters/company-jobpositions-filter';
import { companymtjobpositionsfilter } from '../../../hcm/shared/filters/company-mtjobpositions-filter';
import { JobPositionDeletedFilter } from '../../shared/filters/job-position-deleted-filter';
//services
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyService } from '../../../hcm/shared/services/company.service';
import { JobPositionService } from '../../shared/services/job-position.service'
//Theme components
import { ConfirmationService, MessageService } from 'primeng/api'; 
import { debug } from 'console';
import { JobPositionViewModel } from '../../shared/view-models/job-position-viewmodel';

@Component({
  selector: 'app-companies-organizationalstructure-jobpositions',
  templateUrl: './companies-organizationalstructure-jobpositions.component.html',
  styleUrls: ['./companies-organizationalstructure-jobpositions.component.scss']
})

export class CompaniesOrganizationalstructureJobPositionsComponent implements OnInit {

  constructor(private messageService: MessageService,
    private companyService: CompanyService,
    private actRoute: ActivatedRoute,
    public _authService: AuthService,
    public userPermissions: UserPermissions,
    private jobPositionService: JobPositionService,
    private confirmationService: ConfirmationService
    ) { }

  companylevelsFilters: companylevelsfilter = new companylevelsfilter();
  companyjobpositionsFilters: companyjobpositionsfilter = new companyjobpositionsfilter();
  companymtjobpositionsFilters: companymtjobpositionsfilter = new companymtjobpositionsfilter();

  @Output() delete: EventEmitter<JobPositionViewModel> = new EventEmitter<JobPositionViewModel>();
  @Output() save: EventEmitter<JobPositionViewModel> = new EventEmitter<JobPositionViewModel>();


  @Input() levels: companylevel[];
  @Input() jobs: JobPositionViewModel[];
  mTJobs: companymtjobposition[];
  ///level: companylevel = new companylevel();
  _jobpass: JobPositionViewModel = new JobPositionViewModel();

  permissionsIDs = { ...Permissions };

  ngOnInit(): void {
    this.search();
  }

  search(){
    
   
  }

  editJob(jobin: JobPositionViewModel) {
    if(jobin.id){
      this.save.emit(jobin);
    }else{
      this._jobpass.id = -1;
      this.save.emit(this._jobpass);
    }
  }

  deleteJob(jobout: JobPositionViewModel){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar este cargo?',
      accept: () => {
        this.delete.emit(jobout);
      },
      reject: () => {
        
      }
    }); 
  }

}
