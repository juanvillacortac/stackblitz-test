import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Material } from 'src/app/models/mrp/material';
import { RawMaterial } from 'src/app/models/mrp/raw-material';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { DerivateRoomService } from '../shared/services/derivate-room.service';

@Component({
  selector: 'app-materials-list',
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.scss']
})
export class MaterialsListComponent implements OnInit {

  constructor(private derivateRoomService: DerivateRoomService, private dialogService: DialogsService,
    public userPermissions: UserPermissions, private readonly loadingService: LoadingService) { }

    showFilters = false;
    showDialog = false;
    displayedColumns: any[];
    materials = [];
    isCallback = false;
    material: Material;
    performance: number;
    isEdit: boolean;

    @Input() rawMaterial: RawMaterial;
    @Output() cancel = new EventEmitter<boolean>();

  ngOnInit(): void {

    this.displayedColumns = [
      { header: 'Id', display: 'none', field: 'id' },
      { header: 'mrp.ingredients.barcode', display: 'table-cell', field: 'barcode' },
      { header: 'mrp.derivatives.derivative', display: 'table-cell', field: 'name' },
      { header: 'Porcentaje', display: 'table-cell', field: 'percentage'  }
    ];

    this.getMaterials();

    this.isEdit = !(this.rawMaterial.id === -1);
  }

  getMaterials() {
    this.derivateRoomService.getMaterials(this.rawMaterial.id)
    .then((data: Material[]) => {
      this.materials = data;
    }, (error: HttpErrorResponse) => {
      this.dialogService.errorMessage('mrp.derivatives.derivatives', 'Ha ocurrido un error al cargar los datos');
    });
  }

  cancelSettings() {
    this.cancel.emit(false);
  }

  save() {
      this.loadingService.startLoading('wait_saving');
      this.derivateRoomService.saveMaterials(this.materials, this.rawMaterial.id)
      .then(result => this.saveSucceded())
      .catch((error: HttpErrorResponse) => this.handleError(error));
  }

  saveSucceded() {
    this.loadingService.stopLoading();
    this.dialogService.successMessage('mrp.derivatives.derivatives', 'saved');
    this.cancel.emit(true);
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('mrp.derivatives.raw_materials', error?.message ?? 'error_service');
  }

  delete(material: Material) {
      this.dialogService.confirmDeleteDialog('delete', () => {
        this.materials = this.materials.filter((x: Material) => x.productId !== material.productId);
    });
  }

  onHideDerivateDialog(result) {
    this.showDialog = result;
  }

  openNew() {
    this.showDialog = true;
  }

  itemsSelected(material: Material) {
    if (material) {
      this.showDialog = false;
      material.rawMaterialId = this.rawMaterial.id;
      this.updateMaterial(material);
    }
  }

  updateMaterial(material) {
      this.materials.push(material);
      this.materials = [...this.materials];
  }

  getTotalPerformance() {
    return this.materials ? this.materials.reduce((t, {percentage}) => t + percentage, 0) : 0;
  }

  private isValidForm() {
    return this.isDerivativesAdded();
   }

   private isDerivativesAdded() {
     const result = this.materials && this.materials.length > 0;

     if (!result) {
       this.dialogService.errorMessage('mrp.derivatives.derivatives', 'validations.mrp.derivatives.derivatives_not_added');
     }

     return result;
   }


}
