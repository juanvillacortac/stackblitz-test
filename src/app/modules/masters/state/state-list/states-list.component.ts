import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { State } from 'src/app/models/masters/state';
import { StateFilters } from 'src/app/models/masters/state-filters';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { StateService } from '../shared/services/state.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';

@Component({
  selector: 'app-states-list',
  templateUrl: './states-list.component.html',
  styleUrls: ['./states-list.component.scss']
})
export class StateListComponent implements OnInit {

  loading = false;
  showFilters = false;
  showDialog = false;
  state = new State();
  states = [] as State[];
  permissions: number[] = [];
  permissionsIDs = {...Permissions};
  filters: StateFilters = new StateFilters();
  isCallback = false;
  displayedColumns: any[];

  constructor(public stateService: StateService, private breadcrumbService: BreadcrumbService,
    private messageService: MessageService, public userPermissions: UserPermissions) {
      this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Estados', routerLink: ['/states-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
    this.displayedColumns = [
      { header: 'Id', display: 'none', field: 'id' },
      { header: 'Estado', display: 'table-cell', field: 'name' },
      { header: 'País', display: 'table-cell', field: 'country'  },
      { header: 'Estatus', display: 'table-cell', field: 'active' }
    ];
  }

  search() {
    this.loading = true;
    this.stateService.getStates(this.filters).subscribe((data: State[]) => {
      this.states = data;

      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los datos' });
    });
  }

  openNew() {
    this.state = { id: -1 } as State;
    this.showDialog = true;
  }

  editState(state) {
    this.state = {
      id: state.id,
      idCountry: state.idCountry,
      name: state.name,
      abbreviation: state.abbreviation,
      active: state.active,
      latitude: state.latitude,
      longitude: state.longitude,
      country: state.country
    } as State;
    this.showDialog = true;
  }

  public childCallBack(reload: boolean): void {
    this.showDialog = false;
    if (reload) {
      this.search();
    }
  }

}
