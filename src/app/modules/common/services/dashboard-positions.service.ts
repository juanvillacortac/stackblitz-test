import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardPositionsService {

  constructor() { } getPositions(): Observable<any> {
    return new Observable(observer => {

      setTimeout(() => {
        if (localStorage.getItem('positions')) {
          observer.next(JSON.parse(localStorage.getItem('positions')))

        } else { // default data

          observer.next([
            { cols: 6, rows: 8, y: 0, x: 6 },
            { cols: 6, rows: 8, y: 0, x: 0 },
            { cols: 6, rows: 8, y: 8, x: 0 },
            { cols: 6, rows: 8, y: 8, x: 6 },
            { cols: 4, rows: 16, y: 0, x: 12 }
          ]);

        }
      }, 1000);
    });
  }

  savePositions(positions) {
    localStorage.setItem('positions', JSON.stringify(positions))
  }
}
