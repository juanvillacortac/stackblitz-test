import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Area } from 'src/app/models/masters/area';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { AreaFilter } from 'src/app/modules/masters/area/shared/filters/area-filter';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { DialogsService } from '../../services/dialogs.service';
import { LoadingService } from '../loading/shared/loading.service';

@Component({
  selector: 'app-area-modal',
  templateUrl: './area-modal.component.html',
  styleUrls: ['./area-modal.component.scss']
})
export class AreaModalComponent implements OnInit {
  @Input() multiples = true;
  @Input() model = false;
  @Input() showDialog = false;
  @Output() result = new EventEmitter<Area[]>();
  @Output() toggle = new EventEmitter<boolean>();
  @Input() selectedAreas = [];
  filters: AreaFilter = new AreaFilter;
  displayedColumns: any[] = [];
  areaList: Area[] = [];
  constructor(
    private _areaService: AreaService,
    private readonly _loadingService: LoadingService,
    private _translateService: TranslateService,
    private _authService: AuthService,
    private _dialogService: DialogsService) { }

  ngOnInit(): void {
    this.loadColumns();
  }

  loadColumns() {

    this.displayedColumns = [
      {field: 'id', header: 'id', display: 'none',
      showColumn: false, dataType: 'number', isAllowed: true},

      {field: 'name', header:  this.getHeaderCollumnsName('name'), display: 'table-cell',
      showColumn: true, dataType: 'string', isAllowed: true},

      {field: 'abbreviation', header:  this.getHeaderCollumnsName('abbreviation'), display: 'table-cell',
      showColumn: true, dataType: 'string', isAllowed: true},

      {field: 'areaType', header:  this.getHeaderCollumnsName('areaType'), display: 'table-cell',
      showColumn: true, dataType: 'string', isAllowed: true},

      { field: 'active', header: this.getHeaderCollumnsName('Estatus'), display: 'table-cell' },
    ];
  }
  submit() {
    this.result.emit(this.selectedAreas);
  }
  onShow() {
     this.search();
     this.emitVisible();
   }
   onHide() {
     this.emitVisible();
     this.clearFilters();
     this.areaList = [];
   }

   emitVisible() {
     this.toggle.emit(this.showDialog);
   }

  search() {
    this.completeFilters();
    this.loadAreasList();
  }
  completeFilters() {
    this.filters.idBranchOffice = this._authService.currentOffice;
  }
  clearFilters() {
    this.filters.active = 1;
    this.filters.name = '';
    this.filters.idAreaType = -1;
    this.filters.abbreviation = '';
    this.filters.idBranchOffice = this._authService.currentOffice;
    this.filters.idFatherArea = -1;
  }
  private loadAreasList() {
    this._loadingService.startLoading();
    this._areaService
        .getareaListPromise()
        .then(data => {this.areaList = data.sort((a, b) => a.name.localeCompare(b.name)); })
        .then(() => this._loadingService.stopLoading())
        .catch(error => this.handleError(error));
  }

  private getHeaderCollumnsName(name: string) {
    return `masters.areas.${name}`;
  }
  private handleError(error: HttpErrorResponse) {
    this._loadingService.stopLoading();
    this._dialogService.errorMessage('masters.areas.area', error?.error?.message ?? 'error_service');
  }
}
