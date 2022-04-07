import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { MotivesService } from '../../shared/services/motives.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { HttpErrorResponse } from '@angular/common/http';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { Motives } from 'src/app/models/masters/motives';
import { ColumnD } from 'src/app/models/common/columnsd';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';

@Component({
  selector: 'app-motive-list',
  templateUrl: './motive-list.component.html',
  styleUrls: ['./motive-list.component.scss']
})
export class MotiveListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  
  submitted: boolean;
  showDialog: boolean = false;
  isCallback:boolean = false;
  motivesId : MotivesFilters = new MotivesFilters();
  motivesFilters: MotivesFilters = new MotivesFilters();
  motives: Motives = new Motives();
  motivesList: Motives[] = [];
  motivesNotFilteredList: Motives[] = [];

  displayedColumns: ColumnD<Motives>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; }, field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.motiveType.name; },field: 'motiveType.name', header: 'Tipo de motivo', display: 'table-cell'},
   {template: (data) => { return data.motiveType.module; },field: 'motiveType.module', header: 'Módulo', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'},
   {field: 'edit', header: '', display: 'table-cell'}
  ];

  
  permissionsIDs = {...Permissions};

  constructor(
    private _motivesService: MotivesService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public userPermissions: UserPermissions,
    private breadcrumbService: BreadcrumbService) { 
      this.breadcrumbService.setItems([
        { label: 'Configuración' },
        { label: 'Maestros generales' },
        { label: 'Motivos', routerLink: ['/motives-list'] }
    ]); 
  }

  ngOnInit(): void { 
    this.search();

  }

  search(){
    this.loading = true;
    this._motivesService.getMotives(this.motivesFilters).then(result => {
      this.motivesList= result;
      if(this.motivesNotFilteredList.length === 0 || this.isCallback)
      {
        this.motivesNotFilteredList = result;
        this.isCallback = false;
      }
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando tipos de motivos"});
    });
  }
  openNew() {
    this.motives = null;
    this.showDialog = true;
  }
  onEdit(id: number) {

    this.motives = this.motivesList.find(p=> p.id === id)
    this.showDialog = true;

  }
  
  public childCallBack(reload: boolean): void {
    this.showDialog = false;
    if (reload) {
      this.isCallback = true;
      this.search();
    }
}



}
