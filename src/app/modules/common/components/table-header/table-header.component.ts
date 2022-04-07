import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnInit {

  @Input() idAddPermission: number;
  @Input() idFilterPermission: number;

  @Output() addPressed: EventEmitter<void> = new EventEmitter<void>();
  @Output() filterPressed: EventEmitter<void> = new EventEmitter<void>();
  @Output() editFilterField: EventEmitter<any> = new EventEmitter<any>();

  constructor(public userPermissions: UserPermissions) { }

  ngOnInit(): void {
  }

  openAdd() {
    this.addPressed.emit();
  }

  openFilter() {
    this.filterPressed.emit();
  }

  editFilter(value: any) {
    this.editFilterField.emit(value);
  }
}
