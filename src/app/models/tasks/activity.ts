import { Task } from './task';

export class Activity {
    id: number;
    name: string;
    documentNumber: string;
    user: string;
    progress: number;
    area: string;
    taskList: Task[];
}
