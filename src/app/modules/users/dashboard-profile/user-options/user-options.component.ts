import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.scss']
})
export class UserOptionsComponent implements OnInit {
  items: MenuItem[];
  constructor(private router: Router,
              public _authService: AuthService) { }

  ngOnInit(): void {
    this.setupOptionsItems();
  }

  setupOptionsItems() {
    this.items = [
      {
        label: "Opciones de perfil",
        items: [
            {
                label: 'Actualizar datos de contacto',
                icon: 'pi pi-fw pi-user-edit',
                command: () => { this.updateContactData() }
            },
            {
                label: 'Actualizar contraseña',
                icon: 'pi pi-fw pi-cog',
                command: () => { this.updatePassword() }
            }
        ]
      }];
  }

  updateContactData() {
    this.router.navigate(['profile/edit', this._authService.idUser]);
  }

  updatePassword() {
    this.router.navigate(['profile/change-password']);
  }
}
