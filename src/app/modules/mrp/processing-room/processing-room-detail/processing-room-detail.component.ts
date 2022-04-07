import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { BaseFilter } from 'src/app/models/common/BaseFilter';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { ProcessingRoom } from 'src/app/models/mrp/processing-room';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CommomMasterService } from '../../shared/commom-master.service';
import { ProcessingRoomService } from '../shared/processing-room.service';

@Component({
  selector: 'app-processing-room-detail',
  templateUrl: './processing-room-detail.component.html',
  styleUrls: ['./processing-room-detail.component.scss']
})
export class ProcessingRoomDetailComponent implements OnInit {
  loading = false;
  isDisabled = false;
  submitted = false;
  processingRoomForm: FormGroup;
  isEdit = false;
  formTitle: string;
  processingRoomAdded: boolean;
  productType: SelectItem<BaseModel[]> = {value: null};
  animalType: SelectItem<BaseModel[]> = {value: null};
  @Output() public hideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() processingRoom: ProcessingRoom;
  @Input() processingRoomList: ProcessingRoom[];
  _validations: Validations = new Validations();
  constructor(
    private _processingRoomService: ProcessingRoomService,
    private _commomMasterService: CommomMasterService,
    private formBuilder: FormBuilder,
    private dialogService: DialogsService,
    private readonly loadingService: LoadingService) {
      this.processingRoomForm = this.setNewProcessingRoomForm();
  }
  ngOnInit(): void {
    this.loadingService.startLoading('wait_loading');
    this.getProductTypePromise().then(() =>  {
      this.getAnimalTypePromise().then(() => {
          if (this.processingRoom) {
            this.isEdit = true;
            this.isDisabled = this.processingRoom.isDerived;
            this.onEditForm();
          } else {
            this.isEdit = false;
          }
          this.loadingService.stopLoading();
        });
    });
  }
  onEditForm() {
              this.processingRoomForm.patchValue({
                id: this.processingRoom.id,
                name: this.processingRoom.name,
                description: this.processingRoom.description,
                idProductType: this.productType?.value?.find(p => Number(p.id) === Number(this.processingRoom.productType.id)),
                laborCost: this.processingRoom.laborCost,
                factoryCost: this.processingRoom.factoryCost,
                isDerived: this.processingRoom.isDerived,
                idAnimalType: this.processingRoom.isDerived ?
                               this.animalType?.value?.find(p => Number(p.id) === Number(this.processingRoom.idAnimalType)) : null,
              });
  }


  getProductTypePromise = () => {
    return  this._commomMasterService.getProductsTypes({ id: -1, name: '' } as BaseFilter)
    .then(results => {
      this.productType.value = results.sort((a, b) => a.name.localeCompare(b.name));
    }).catch(error => this.handleError(error));
  }

  getAnimalTypePromise = () => {
    return  this._commomMasterService.getAnimalsTypes({ id: -1, name: '' } as BaseFilter)
    .then(results => {
      this.animalType.value = results.sort((a, b) => a.name.localeCompare(b.name));
    }).catch(error => this.handleError(error));
  }

  handleChange(e) {
    this.isDisabled = e.checked;
    if (!this.isDisabled) {
      this.processingRoomForm.controls.idAnimalType.setValue(null);
    }
  }
setAnimalType() {
  let idAnimalType: any;
  const isDerived = this.processingRoomForm.controls.isDerived.value;
  if (this.isEdit) {
    idAnimalType = isDerived ? this.processingRoomForm.controls.idAnimalType.value?.id : this.processingRoom.idAnimalType;
  } else {
    idAnimalType = isDerived ? this.processingRoomForm.controls.idAnimalType.value?.id : null;
  }
  return idAnimalType;
}

  toProcessingRoomModel() {
      const model = new ProcessingRoom();
          model.id = this.processingRoomForm.controls.id.value;
          model.name = this.processingRoomForm.controls.name.value;
          model.description = this.processingRoomForm.controls.description.value;
          model.productType = this.processingRoomForm.controls.idProductType.value;
          model.factoryCost = this.processingRoomForm.controls.factoryCost.value ?? 0;
          model.laborCost = this.processingRoomForm.controls.laborCost.value ?? 0;
          model.isDerived = this.processingRoomForm.controls.isDerived.value;
          model.idAnimalType =  this.setAnimalType();
          model.idBranchOffice = -1;
          model.active = true;
      return model;
  }
  onSave() {
    this.loading = true;
    this.submitted = true;
    if (this.processingRoomForm.invalid) {
      return;
    }
    this.loadingService.startLoading('wait_saving');
    const newProcessingRoom = this.toProcessingRoomModel();
      this._processingRoomService.addProcessingRoom(newProcessingRoom)
      .then(() => this.successAddingRecipe())
      .then(() => this.onEmitHideForm(true))
      .catch(error => this.handleError(error));
}
  private setNewProcessingRoomForm() {
      return this.formBuilder.group({
        id: -1,
        name: ['', Validators.required],
        description: [''],
        idProductType: [null, Validators.required],
        laborCost: [0],
        factoryCost: [0],
        isDerived: [false, Validators.required],
        idAnimalType : [null]
      });
    }
  private successAddingRecipe() {
    this.loading = false;
    this.loadingService.stopLoading();
    this.dialogService.successMessage('mrp.processing_room.rooms', 'saved');
  }

  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('mrp.processing_room.rooms', error?.error?.message ?? 'error_service');
  }
  public onEmitHideForm(reload: boolean): void {
      this.hideDialogForm.emit(reload);
  }

  get validateAnimalType() {
    return  (this.processingRoomForm.controls.idAnimalType.value === null && this.isDisabled &&
              (this.processingRoomForm.controls.idAnimalType.dirty ||
               this.processingRoomForm.controls.idAnimalType.touched || this.submitted));
    }
}
