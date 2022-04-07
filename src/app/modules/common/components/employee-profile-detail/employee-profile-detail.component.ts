import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LaborRelationshipFilter } from 'src/app/modules/hcm/shared/filters/laborRelationship/labor-relationship-filter';
import { LaborRelationship } from 'src/app/modules/hcm/shared/models/laborRelationship/labor-relationship';
import { LaborRelationshipService } from 'src/app/modules/hcm/shared/services/labor-relationship.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { MastersService } from 'src/app/modules/users/shared/masters.service';
import { DialogsService } from '../../services/dialogs.service';
import { LoadingService } from '../loading/shared/loading.service';

@Component({
  selector: 'app-employee-profile-detail',
  templateUrl: './employee-profile-detail.component.html',
  styleUrls: ['./employee-profile-detail.component.scss']
})
export class EmployeeProfileDetailComponent implements OnInit {

  @Input() visible = false;
  @Input() id: number;
  @Input() name: string;
  @Input() image: string;
  @Input() viewMoreButton = false;
  @Output() hideDialogForm = new EventEmitter<number>();

  laborRelationship: LaborRelationship;
  prefixPhone: string;
  constructor(
    private router: Router,
    private readonly loadingService: LoadingService,
    private dialogService: DialogsService,
    private _laborRelationshipService: LaborRelationshipService,
    private _mastersService: MastersService,
    private _authService: AuthService) { }

  ngOnInit(): void {
  }
  onShow() {
    this.searchLaborRelation();
  }
  onEmitHideForm(idResult: number): void {
    this.visible = false;

    this.hideDialogForm.emit(idResult);
  }

  searchLaborRelation() {
    this.loadingService.startLoading('wait_loading');
    this._laborRelationshipService.getLaborRelationshipPromise(this.buildFilters())
            .then(result => this.laborRelationship = result)
            .then(() => this.getCountryPrefix( this.laborRelationship.employee.phoneNumbers[0].idCountry ?? 0))
            .then(() => this.loadingService.stopLoading())
            .catch(error => this.handleError(error));
  }
  getCountryPrefix(idCountry) {
    this._mastersService.getCountries(-1, idCountry)
    .then(result => this.prefixPhone = result[0]?.prefix ?? '00')
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  onEdit(idEmployee) {
    this.router.navigate( ['hcm/companies-payroll-payrolldata', idEmployee]);
  }

  validateValue(value) {
    return value?.length > 0 ? value : '' ?? '';
  }
  validatePrefixValue(value) {
    return value?.length > 0 ? '+' + value : '' ?? '';
  }

  private buildFilters() {
    const filters = new LaborRelationshipFilter();
          filters.idCompany = this._authService.currentCompany;
          filters.idLaborRelationship =  this.id;
    return filters;
  }
  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('hcm.user_profile', error?.error?.message ?? 'error_service');
  }
}
