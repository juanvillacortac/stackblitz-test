import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activity } from 'src/app/models/tasks/activity';
import { TemplateCategory } from 'src/app/models/tasks/template-category';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from '../../common/services/http-helpers.service';
import { AuthService } from '../../login/shared/auth.service';
import { TemplateActivity } from 'src/app/models/tasks/template-activity';
import { Task } from 'src/app/models/tasks/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private readonly API_TASK_URL = `${environment.API_BASE_URL_TASKS}/task`;
  private readonly API_ACTIVITY_URL = `${environment.API_BASE_URL_TASKS}/activities`;
  private readonly API_TEMPLATES_URL = `${environment.API_BASE_URL_TASKS}/templates`;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private httpHelpersService: HttpHelpersService) {
  }

  getActivities() {
    return this.httpClient.get<Activity[]>(`${this.API_ACTIVITY_URL}`).toPromise();
  }

  getUserActivities(idUser: number) {
    const idCompany = this.authService.currentCompany;
    return this.httpClient.get<Activity[]>(`${this.API_ACTIVITY_URL}/${idCompany}/${idUser}`).toPromise();
  }

  getTemplateCategories(categoryId: number = -1) {
    return this.httpClient.get<TemplateCategory[]>(`${this.API_TEMPLATES_URL}/category/${categoryId}`).toPromise();//
  }

  getActivityTemplates(idCategory: number) {
    const payload = { idCategory: idCategory };
    return this.httpClient.get<TemplateActivity[]>(`${this.API_TEMPLATES_URL}`, this.convertToParams(payload)).toPromise();
  }

  getUserTasks(idUser: any) {
    return this.httpClient.get<Task[]>(`${this.API_TASK_URL}/${idUser}`).toPromise();
  }

  saveActivityByTemplate(idTemplate: number, idDocumentOperation: number, endDate: Date, idUser?: number, requiredFieldsJson?: string) {
    const payload = { idTemplate: idTemplate, endDate: endDate, requiredFieldsJson: requiredFieldsJson, idUser: idUser, idDocumentOperation: idDocumentOperation };
    return this.httpClient.post(`${this.API_ACTIVITY_URL}/saveActivityByTemplate`, payload).toPromise();
  }
  
  startTask(idTask: number) {
    return this.httpClient.put<boolean>(`${this.API_TASK_URL}/start/${idTask}`, {}).toPromise();
  }

  pauseTask(idTask: number) {
    return this.httpClient.put<boolean>(`${this.API_TASK_URL}/pause/${idTask}`, {}).toPromise();
  }

  shareTask(idTask: number, idUser: number) {
    return this.httpClient.put<boolean>(`${this.API_TASK_URL}/share/${idTask}/${idUser}`, {}).toPromise();
  }

  completeTask(idTask: number) {
    return this.httpClient.put<boolean>(`${this.API_TASK_URL}/complete/${idTask}`, {}).toPromise();
  }

  cancelTask(idTask: number, reason: string) {
    const payload = { reason: reason };
    return this.httpClient.get<boolean>(`${this.API_TEMPLATES_URL}/${idTask}`, this.convertToParams(payload)).toPromise();
  }

  private convertToParams(object) { return { params: this.httpHelpersService.getHttpParamsFromPlainObject(object) }; }
}
