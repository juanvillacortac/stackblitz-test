import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DocumentTypes } from 'src/app/models/masters/document-type';
import { DocumentTypeFilter } from 'src/app/models/masters/document-type-filters';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { DocumentTypeService } from '../shared/services/document-type.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-document-type-list',
  templateUrl: './document-type-list.component.html',
  styleUrls: ['./document-type-list.component.scss']
})
export class DocumentTypeListComponent implements OnInit {
  showFilters : boolean = false;
  loading : boolean = false;
  
  submitted: boolean;
  showDialog: boolean = false;
  isCallback:boolean = false;
  documentTypeId : DocumentTypeFilter = new DocumentTypeFilter();
  documentTypeFilters: DocumentTypeFilter = new DocumentTypeFilter();
  documentType: DocumentTypes = new DocumentTypes();
  documentTypeList: DocumentTypes[] = [];
  documentTypeNotFilteredList: DocumentTypes[] = [];

  displayedColumns: ColumnD<DocumentTypes>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.entityType.name; }, field: 'entityType.name', header: 'Tipo de entidad', display: 'table-cell'},
   {template: (data) => { return data.name; }, field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.country.name; }, field: 'country.name', header: 'País', display: 'table-cell'},
   {template: (data) => { return data.identifier; }, field: 'identifier', header: 'Identificador', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'},
   {field: 'edit', header: '', display: 'table-cell'}
  ];

  
  permissionsIDs = {...Permissions};
  

  constructor(
      private _documentTypeService: DocumentTypeService,
      private formBuilder: FormBuilder,
      private messageService: MessageService,
      private confirmationService: ConfirmationService,
      public userPermissions: UserPermissions,
      private breadcrumbService: BreadcrumbService) { 
        this.breadcrumbService.setItems([
          { label: 'Configuración' },
          { label: 'Maestros generales' },
          { label: 'Tipos de documentos', routerLink: ['/document-type-list'] }
      ]); 
    }
  
    ngOnInit(): void { 
      this.search();
  
    }
  
    search(){
      this.loading = true;
      this._documentTypeService.getDocumentTypeListPromise(this.documentTypeFilters).then(result => {
        this.documentTypeList = result;
        if(this.documentTypeNotFilteredList.length === 0 || this.isCallback)
        {
          this.documentTypeNotFilteredList = result;
          this.isCallback = false;
        }
        this.loading = false;
      }, (error: HttpErrorResponse)=>{
        this.loading = false;
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando tipos de documentos"});
      });
    }
    openNew() {
      this.documentType = null;
      this.showDialog = true;
    }
    onEdit(id: number) {
  
      this.documentType = this.documentTypeList.find(p=> p.id === id)
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
  