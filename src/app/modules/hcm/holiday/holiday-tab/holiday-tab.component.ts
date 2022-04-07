import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-holiday-tab',
  templateUrl: './holiday-tab.component.html',
  styleUrls: ['./holiday-tab.component.scss']
})
export class HolidayTabComponent implements OnInit {
  permissionsIDs = { ...Permissions };
  //var
  activeIndex: number;
  checked: boolean;

  constructor(private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public userPermissions: UserPermissions,
    private router :Router,
    public breadcrumbService: BreadcrumbService) { 
      this.breadcrumbService.setItems([
        { label: 'HCM' },
        { label: 'Nómina' },
        { label: 'Vacaciones', routerLink: ['/hcm/holiday'] }
      ]);
    }

  ngOnInit(): void {
    this.activeIndex = 0;
  }

}
