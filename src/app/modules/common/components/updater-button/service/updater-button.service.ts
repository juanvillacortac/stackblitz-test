import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdaterButtonService {

  updaterIsActive: Subject<any> = new Subject();

  constructor() { }

  setUpdaterIsActive(isActive: boolean) {
    this.updaterIsActive.next(isActive);
  }
}
