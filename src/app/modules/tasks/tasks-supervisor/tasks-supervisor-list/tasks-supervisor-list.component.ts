import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Activity } from 'src/app/models/tasks/activity';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { TasksService } from '../../shared/tasks.service';

@Component({
  selector: 'app-tasks-supervisor-list',
  templateUrl: './tasks-supervisor-list.component.html',
  styleUrls: ['./tasks-supervisor-list.component.scss']
})
export class TasksSupervisorListComponent implements OnInit {

  showDialog = false;
  activities: Activity[] = [];
  cols: any[];
  loadingTasks: boolean = false;

  constructor(
    private readonly dialogService: DialogsService,
    private readonly tasksService: TasksService,
    private readonly authService: AuthService,
    private readonly breadcrumbService: BreadcrumbService) {
      this.breadcrumbService.setItems([
        { label: 'Tareas' },
        { label: 'Supervisar', routerLink: ['/tasks/supervisor'] }
      ]);
    }

  ngOnInit(): void {
    this.setupColumns();
    this.getActivities();
  }

  addActivity() {
    if(!this.loadingTasks) {
      this.showDialog = true;
    }
  }

  onActivityAdded(event) {
    this.showDialog = false;
    if (event) { this.getActivities(); }
  }

  private getActivities() {
    this.loadingTasks = true;
    this.activities.length = 0;
    const idUser = this.authService.idUser;
    this.tasksService.getUserActivities(idUser)
      .then(activities => this.getActivitiesSuccess(activities))
      .catch(error => this.handleError(error));
  }

  private getActivitiesSuccess(activities) {
    this.activities = activities;
    this.loadingTasks = false;
  }

  private setupColumns() {
    this.cols = [
      { field: 'id', display: 'table-cell', header: 'ID' },
      { field: 'name', display: 'table-cell', header: 'name' },
      { field: 'documentNumber', display: 'table-cell', header: 'tasks.document_number' },
      { field: 'user', display: 'table-cell', header: 'tasks.responsable' },
      { field: 'progress', display: 'table-cell', header: 'progress' },
      { field: 'area', display: 'table-cell', header: 'area' }
    ];
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingTasks = false;
    this.dialogService.errorMessage('tasks.tasks', error?.error?.message ?? 'error_service');
  }
}
