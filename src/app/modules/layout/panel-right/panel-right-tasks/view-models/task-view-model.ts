import { Task } from "src/app/models/tasks/task";

export class TaskViewModel implements Task {
  id: number;
  name: string;
  activityName: string;
  idDocument: number;
  idStatus: number;
  startDate: Date;
  documentNumber: string;
  showDetail: boolean;
  elapsedTime: string;

  constructor(tasks: Task, elapsedTime: string) {
    this.id = tasks.id;
    this.name = tasks.name;
    this.activityName = tasks.activityName;
    this.idDocument = tasks.idDocument;
    this.idStatus = tasks.idStatus;
    this.startDate = tasks.startDate;
    this.documentNumber = tasks.documentNumber;
    this.showDetail = false;
    this.elapsedTime = elapsedTime;
  }

}
