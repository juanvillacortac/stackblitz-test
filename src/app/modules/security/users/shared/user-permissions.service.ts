import { Injectable, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/modules/layout/shared/layout.service';
import * as Permissions from './user-const-permissions';

@Injectable({
    providedIn: 'root'
  })
  export class UserPermissions implements OnInit {
      permissions: number[] = [];
      constructor( private _layoutSerice: LayoutService ) {
          Object.values({...this._layoutSerice.permissions}).map((item: number) => {
              this.permissions.push(item);
    });
  }

    ngOnInit() {}
    
    allowed = (permissionId: number) => this.permissions.includes(permissionId);

}
