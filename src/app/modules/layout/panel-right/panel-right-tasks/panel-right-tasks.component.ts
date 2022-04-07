import { trigger, transition, style, animate } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Activity } from 'src/app/models/tasks/activity';
import { TaskStatus } from 'src/app/models/tasks/task-status';
import { DialogsService } from '../../../common/services/dialogs.service';
import { AuthService } from '../../../login/shared/auth.service';
import { TasksService } from '../../../tasks/shared/tasks.service';
import { TaskViewModel } from './view-models/task-view-model';
import type {Moment} from "moment";

@Component({
  selector: 'app-panel-right-tasks',
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: "0px", opacity: 0 }),
            animate('0.5s ease-in',
              style({ height: "45px", opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: "45px", opacity: 1 }),
            animate('0.5s ease-out',
              style({ height: "0px", opacity: 0 }))
          ]
        )
      ]
    )
  ],
  templateUrl: './panel-right-tasks.component.html',
  styleUrls: ['./panel-right-tasks.component.scss']
})
export class PanelRightTasksComponent implements OnInit {

  private taskCancellation: number;

  tasks: TaskViewModel[] = [];
  displayDialog = false;
  cancellationReason = '';

  constructor(
    private readonly authService: AuthService,
    private readonly dialogService: DialogsService,
    private readonly tasksService: TasksService) { }

  ngOnInit(): void {
    this.getUserTasks();
  }
  startedTasksOf(activity: Activity) {
    return activity.taskList[activity.taskList.length - 1].name;
  }

  startTask(taskId: number) {
    const promise = this.tasksService.startTask(taskId);
    this.manageTaskUpdate(promise, 'tasks.tasks_started');
  }

  pauseTask(taskId: number) {
    const promise = this.tasksService.pauseTask(taskId);
    this.manageTaskUpdate(promise, 'tasks.tasks_paused');
  }

  cancelTask(taskId: number) {
    this.displayDialog = true;
    this.taskCancellation = taskId;
  }

  completeTask(taskId: number) {
    const promise = this.tasksService.completeTask(taskId);
    this.manageTaskUpdate(promise, 'tasks.tasks_completed');
  }

  elapsedTimeSince(startDate) {
    const elapsedTime = PanelRightTasksComponent.calculateElapsedTime(startDate);
    return PanelRightTasksComponent.formatDuration(elapsedTime);
  }

  lastTaskOf(activity: Activity) {
    return activity.taskList[activity.taskList.length - 1];
  }

  doCancelTask() {
    if (this.cancellationReason.length < 16) { return; }
    const promise = this.tasksService.cancelTask(this.taskCancellation, this.cancellationReason);
    this.manageTaskUpdate(promise, 'tasks.tasks_cancelled');
  }

  isStarted(taskStatus: number) {
    return taskStatus == TaskStatus.Started;
  }

  isPaused(taskStatus: number) {
    return taskStatus === TaskStatus.Paused;
  }

  private getUserTasks() {
    const idUser = this.authService.idUser;
    this.tasksService.getUserTasks(idUser)
      .then(tasks => this.tasks = tasks.map(task => new TaskViewModel(task, this.elapsedTimeSince(task.startDate))))
      .catch(error => this.handleError(error));
  }

  private manageTaskUpdate(promise: Promise<boolean>, message: string) {
    promise
      .then(_ => this.getUserTasks())
      .then(() => this.onTaskUpdated(message))
      .catch(error => this.handleError(error));
  }

  private static calculateElapsedTime(startDate: Date) {
    // TODO: review the moment(date()) construction to supress warning
    const actualDate = moment(Date());
    const duration = moment.duration(actualDate.diff(startDate));
    return duration.abs();
  }

  private static formatDuration(value?: moment.Duration) {
    if (!value) { return 'Invalid'; }
    return this.formatDate(moment.utc(value.asMilliseconds()));
  }

  private onTaskUpdated(message: string) {
    this.dialogService.successMessage('tasks.tasks', message);
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('tasks.tasks', error?.error?.message ?? 'error_service');
  }

  private static formatDate(moment: Moment) {
    return moment.format('HH{0}:mm{1}:ss{2}')
      .replace('{0}', 'H')
      .replace('{1}', 'M')
      .replace('{2}', 'S');
  }
}
