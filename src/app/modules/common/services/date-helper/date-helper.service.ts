import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateHelperService {

  constructor() { }

  gmtToUTC(date: Date): Date {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
  }

  utcToGMT(date: Date): Date {
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );
  }
}
