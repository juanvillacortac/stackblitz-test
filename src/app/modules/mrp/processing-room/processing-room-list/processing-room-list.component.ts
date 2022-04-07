import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ProcessingRoom } from 'src/app/models/mrp/processing-room';
import { ProcessingRoomFilters } from 'src/app/models/mrp/processing-room-filters';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ProcessingRoomService } from '../shared/processing-room.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
@Component({
  selector: 'app-processing-room-list',
  templateUrl: './processing-room-list.component.html',
  styleUrls: ['./processing-room-list.component.scss']
})
export class ProcessingRoomListComponent implements OnInit {
  showFilters = false;
  loading = false;

  submitted: boolean;
  showDialog = false;
  isCallback = false;
  processingRoomFilters: ProcessingRoomFilters = new ProcessingRoomFilters();
  processingRoom: ProcessingRoom = new ProcessingRoom();
  processingRoomList: ProcessingRoom[] = [];
  processingRoomNotFilteredList: ProcessingRoom[] = [];

  displayedColumns: ColumnD<ProcessingRoom>[] =
  [
   {template: (data) => data.id, header: 'Id', field: 'Id', display: 'none'},
   {template: (data) => data.name, field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => data.description, field: 'description', header: 'Descripción', display: 'table-cell'},
   {template: (data) => data.isDerived, field: 'isDerived', header: 'Derivado', display: 'table-cell'},
   {field: 'edit', header: '', display: 'table-cell'}
  ];
  permissionsIDs = {...Permissions};

  constructor(
      private router: Router,
      private dialogService: DialogsService,
      public _processingRoomService: ProcessingRoomService,
      public userPermissions: UserPermissions,
      private breadcrumbService: BreadcrumbService,
      private readonly loadingService: LoadingService) {
        this.breadcrumbService.setItems([
          { label: 'MRP' },
          { label: 'Salas', routerLink: ['/mrp/processing-room'] }
      ]);
    }

    ngOnInit(): void {
      this.search();
    }

    search() {
      this.loadingService.startLoading('wait_loading');
      this.loading = true;
      this._processingRoomService.getProcessingRoom(this.processingRoomFilters)
      .then(result => this.successCall(result))
      .catch(error => this.handleError(error));
    }
    openNew() {
      this.processingRoom = null;
      this.showDialog = true;
    }
    onEdit(id: number) {

      this.processingRoom = this.processingRoomList.find(p => p.id === id);
      this.showDialog = true;

    }
    onShowDetail(id: number, isDerived: boolean) {
      console.log(isDerived);
      if (isDerived) {

        if (this.userPermissions.allowed(this.permissionsIDs.CHECK_RAWMATERIALS_PERMISSION_ID)) {
          this.router.navigate(['/mrp/derivates-room', id]);
        }
      } else {
        if (this.userPermissions.allowed(this.permissionsIDs.CHECK_PROCESSINGROOMRECIPE_PERMISSION_ID)) {
          this.router.navigate(['/mrp/room-recipes', id]);
        }

      }
    }

    allowedShowDetail() {
      return this.userPermissions.allowed(this.permissionsIDs.CHECK_PROCESSINGROOMRECIPE_PERMISSION_ID)
      || this.userPermissions.allowed(this.permissionsIDs.CHECK_RAWMATERIALS_PERMISSION_ID);
    }

    public childCallBack(reload: boolean): void {
      this.showDialog = false;
      if (reload) {
        this.isCallback = true;
        this.search();
      }
    }

    private handleError(error: HttpErrorResponse) {
      this.loading = false;
      this.loadingService.stopLoading();
      this.dialogService.errorMessage('mrp.processing_room.rooms', error?.error?.message ?? 'error_service');
    }
    private successCall(result: ProcessingRoom[]) {
      this.processingRoomList = result.sort((a, b) => b.id - a.id);
      if (this.processingRoomNotFilteredList.length === 0 || this.isCallback) {
        this.processingRoomNotFilteredList = result;
        this.isCallback = false;
      }
      this.loading = false;
      this.loadingService.stopLoading();
    }
}
