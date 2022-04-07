import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-salary-tab',
  templateUrl: './salary-tab.component.html',
  styleUrls: ['./salary-tab.component.scss']
})
export class SalaryTabComponent implements OnInit {

  //var
  activeIndex: number;
  changeNoSave: boolean = false;
  permissionsIDs = { ...Permissions };
  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService,
              public userPermissions: UserPermissions,
              private router :Router,
              public breadcrumbService: BreadcrumbService) 
              {
                this.breadcrumbService.setItems([
                  { label: 'HCM' },
                  { label: 'Nómina' },
                  { label: 'Sueldos', routerLink: ['/hcm/salary'] }
                ]);
               }

  ngOnInit(): void {
    this.activeIndex = 5;
  }

  tabChange(index: number){
    if(this.changeNoSave){
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: 'Al salir de la sección actual, todos los cambios pendientes por guardar serán eliminados. ¿Desea continuar?',
        accept: () => {      
          this.activeIndex = index;
          this.changeNoSave = false;
        },
        reject: () => {
          
        }
      });
    }else{
      this.activeIndex = index;
    }
  }

  changeSave(value: boolean){
    this.changeNoSave = value;
  }

}
