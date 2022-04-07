import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ProcessingRoom } from 'src/app/models/mrp/processing-room';
import { ProcessingRoomFilters } from 'src/app/models/mrp/processing-room-filters';
import { RawMaterial } from 'src/app/models/mrp/raw-material';
import { RawMaterialFilters } from 'src/app/models/mrp/raw-material-filters';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ProcessingRoomService } from '../../processing-room/shared/processing-room.service';
import { DerivateRoomService } from '../shared/services/derivate-room.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';

@Component({
  selector: 'app-raw-materials-list',
  templateUrl: './raw-materials-list.component.html',
  styleUrls: ['./raw-materials-list.component.scss']
})
export class RawMaterialsListComponent implements OnInit {
  selectedRoom = {};
  loading = false;
  showFilters = false;
  showDialog = false;
  showRawMaterialDialog = false;
  showMaterialsList = false;
  rawMaterial: RawMaterial;
  displayedColumns: any[];
  filters: RawMaterialFilters;
  rawMaterials = [];
  isCallback = false;
  idRoom = 0;
  processingRoom = new ProcessingRoom();

  permissions: number[] = [];
  permissionsIDs = {...Permissions};

  constructor(  private router: Router, private derivativeService: DerivateRoomService,
    private processingRoomService: ProcessingRoomService, private breadcrumbService: BreadcrumbService,
    public userPermissions: UserPermissions, private dialogService: DialogsService,
    private actRoute: ActivatedRoute) {
      this.idRoom = this.actRoute.snapshot.params['id'];
      this.breadcrumbService.setItems([
        { label: 'MRP' },
        { label: 'Salas', routerLink: ['/mrp/processing-room'] },
        { label: 'Configuración de derivados', routerLink: [`/mrp/derivates-room/${this.idRoom}`] }
    ]);
      this.displayedColumns = [
        { header: 'Id', display: 'none', field: 'id' },
        { header: 'mrp.ingredients.barcode', display: 'table-cell', field: 'barcode' },
        { header: 'Materia prima', display: 'table-cell', field: 'name' },
        { header: 'Rendimiento', display: 'table-cell', field: 'performance'  }
      ];

     }

  ngOnInit(): void {
    this.rawMaterial = {} as RawMaterial;
    this.loadRoom();
    this.loadRawNaterials();
  }

  loadRoom() {
    this.processingRoomService.getProcessingRoom({ id: this.idRoom } as ProcessingRoomFilters)
    .then(result => {
      if (result) {
        this.processingRoom = result[0];
      }
    }).catch((error: HttpErrorResponse) => this.handleError(error));
  }

  loadRawNaterials() {
    this.filters = { roomId: this.idRoom } as RawMaterialFilters;
    this.search(this.filters);
  }

  openNew() {
    this.rawMaterial = { id: -1, roomId: this.idRoom} as RawMaterial;
    this.showRawMaterialDialog = true;
  }

  edit(rawMaterial) {
    this.setRawMaterialProperties(rawMaterial);
    this.showRawMaterialDialog = true;
  }

  editDetail(rawMaterial: RawMaterial) {
    this.setRawMaterialProperties(rawMaterial);
    this.showMaterialsList = true;
  }

  setRawMaterialProperties(rawMaterial: RawMaterial) {
    this.rawMaterial = new RawMaterial();
    this.rawMaterial.id = rawMaterial.id;
    this.rawMaterial.name = rawMaterial.name;
    this.rawMaterial.productId = rawMaterial.productId;
    this.rawMaterial.roomId = rawMaterial.roomId;
    this.rawMaterial.performance = rawMaterial.performance;
    this.rawMaterial.barcode = rawMaterial.barcode;
  }

  cancelSettings(result) {
    if (result) {
      this.search(this.filters);
    }
    this.showMaterialsList = false;
  }

  cancel() {
    this.router.navigate(['/mrp/processing-room']);
  }

  search(filters) {
    this.loading = true;
    this.derivativeService.getRawMaterials(filters).then((data: RawMaterial[]) => {
      this.rawMaterials.length = 0;
      this.rawMaterials = data;

      this.loading = false;
    }, (error: HttpErrorResponse) => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.dialogService.errorMessage('mrp.derivatives.raw_materials', error?.error?.message ?? 'error_service');
  }

  public childCallBack(reload: boolean): void {
    this.showRawMaterialDialog = false;
    if (reload) {
      this.search(this.filters);
    }
  }

  delete(rawMaterial: RawMaterial) {
    this.dialogService.confirmDeleteDialog('delete', () => {
      this.derivativeService.deleteRawMaterial(rawMaterial.id)
      .then(result => this.deleteSucceded(result, rawMaterial.id))
      .catch(error => this.handleError(error));
  }, 'Se eliminará este registro con todos sus derivados asociados, ¿Desea continuar?');
  }

  deleteSucceded(result, rawMaterialId) {
    if (result === true) {
      this.dialogService.successMessage('mrp.derivatives.raw_materials', 'deleted');
      this.rawMaterials = this.rawMaterials.filter(x => x.id !== rawMaterialId);
    } else {
      this.dialogService.errorMessage('mrp.derivatives.raw_materials', 'error_service');
    }
  }

}
