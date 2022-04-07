import { HttpParams } from '@angular/common/http';

export {}; // this file needs to be a module
Object.prototype.toParams = function (addNulls: boolean = true): Object {
    let params = new HttpParams();
    for (const key of Object.keys(this)) {
      if (this[key] === null && !addNulls) {
        continue;
      }
      if (this[key] instanceof Array) {
        this[key].forEach((item) => {
          params = params.append(`${key}`, item ?? '');
        });
      } else {
        params = params.append(key.toString(), this[key] ?? '');
      }
    }
    return params;
};
