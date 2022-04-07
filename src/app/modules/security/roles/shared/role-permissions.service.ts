import { Injectable, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/modules/layout/shared/layout.service';

@Injectable({
    providedIn: 'root'
  })
export class RolePermissions implements OnInit {
    permissions: number[] = [];
    constructor( private _layoutSerice: LayoutService ) {
    Object.values({...this._layoutSerice.permissions}).map((item: number) => {
        this.permissions.push(item);
    });
      }

    ngOnInit() {}

 allowCreateRole = () => {
    return !!this.permissions.find(x => x === 4);
}

 allowAssignRole = () => {
    return !!this.permissions.find(x => x === 5);
}

 allowManageTasks = () => {
    return !!this.permissions.find(x => x === 6);
}

allowManageMasters = () => {
    return !!this.permissions.find(x => x === 7);
}

}
