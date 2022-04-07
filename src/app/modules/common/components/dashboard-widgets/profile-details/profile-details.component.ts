import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LaborRelationshipFilter } from 'src/app/modules/hcm/shared/filters/laborRelationship/labor-relationship-filter';
import { LaborRelationship } from 'src/app/modules/hcm/shared/models/laborRelationship/labor-relationship';
import { LaborRelationshipService } from 'src/app/modules/hcm/shared/services/labor-relationship.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { MastersService } from 'src/app/modules/users/shared/masters.service';
import { DialogsService } from '../../../services/dialogs.service';
import { LoadingService } from '../../loading/shared/loading.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  @Input() id: number;
  @Input() name: string;
  @Input() image: string;
  @Input() viewMoreButton = false;

  laborRelationship: LaborRelationship;
  prefixPhone: string;
  constructor(
    private readonly loadingService: LoadingService,
    private dialogService: DialogsService,
    private _laborRelationshipService: LaborRelationshipService,
    private _mastersService: MastersService,
    private _authService: AuthService) { }


  ngOnInit(): void {
    this.image = this.userImage;
    this.searchLaborRelation();
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

  get defaultURL() {
    return `https://ui-avatars.com/api/?name=${this.name}&background=17a2b8&color=fff&rounded=true&bold=true&size=200`
  }

  get userImage() {
    const userImage = this.image;
    if (userImage && userImage !== '') {return userImage; } else {return this.defaultURL; }
  }
}
