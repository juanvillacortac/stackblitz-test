import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  constructor() { }

  getEstatusFilterList(withAll: boolean = false) {

    var result = [
      {label: 'Activo', value: 1},
      {label: 'Inactivo', value: 0}
    ];

    if(withAll){
      result.unshift({label: 'Todos', value: -1});
    }

    return result;
  }

  getEstatusList(withAll: boolean = false) {

    var result = [
      {label: 'Activo', value: true},
      {label: 'Inactivo', value: false}
    ];

    return result;
  }
}
