import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Motives } from 'src/app/models/masters/motives';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { Reason } from 'src/app/models/srm/common/reason';
import { Productsxsupplier } from 'src/app/models/srm/productsxsupplier';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { DialogsService } from '../../services/dialogs.service';

@Component({
  selector: 'app-reason-dialog',
  templateUrl: './reason-dialog.component.html',
  styleUrls: ['./reason-dialog.component.scss']
})
export class ReasonDialogComponent implements OnInit {

  @Input() header: string = '';
  @Input() showDialog: boolean = false;
  @Input() motiveTypeId: number = -1;
  @Output() saveReason = new EventEmitter<Reason>();
  @Output() hideDialogEvent = new EventEmitter();

  submitted: boolean = false;

  reason: Reason = new Reason();
  supplierByProd: Productsxsupplier = new Productsxsupplier();

  reasonList: Motives[] = [];

  constructor(
    private readonly motivesService: MotivesService, 
    private readonly dialogService: DialogsService) { }

  ngOnInit(): void {
    this.getMotives();
  }

  hideDialog(){
    this.submitted = false;
    this.showDialog = false;
    this.reason=new Reason();
    this.hideDialogEvent.emit();
  }

  save() {
    this.submitted = true;
    if(this.reason.motiveId) {
      this.saveReason.emit(this.reason);
      this.hideDialog();
    }
  }

  private getMotives = () => {
        var filter = new MotivesFilters();
        filter.active = 1;
        filter.idMotivesType = this.motiveTypeId;

        this.motivesService.getMotives(filter).then((data: Motives[]) => this.getMotivesSuccess(data))
        .catch(error => this.handleError(error));
  }

  private getMotivesSuccess(data: Motives[]) {
    this.reasonList = data;
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

}
