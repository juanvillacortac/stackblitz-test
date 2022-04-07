import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs/internal/observable/throwError';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';

import { Address } from 'src/app/models/users/Address';
import { Person } from 'src/app/models/users/Person';
import { Phone } from 'src/app/models/users/Phones';
import { Profile } from 'src/app/models/users/Profile';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UsersService } from '../../shared/users.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  userId: '';
  profile: Profile;
  person: Person;
  addresses: Address[] = [];
  phones: Phone[] = [];
  constructor(public _authService: AuthService,
    public _usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private messageService: MessageService) {
    this.userId = this._authService.idUser;
    this.breadcrumbService.setItems([
      { label: 'Perfil'  },
      { label: 'Dashboard', routerLink: ['/profile/me', this.userId]}
  ]);
  }

  ngOnInit(): void {
    this._usersService.getEntityProfile(Number(this.userId))
      .then(profile => this.profile = profile)
      .then(person => this.person = person.person)
      .then(addresses => this.addresses = addresses.address)
      .then(this.manageUserPhones())
      .then(_ => console.log(this.phones))
      .catch(error => this.manageError(error));
    }

  private manageError(error) {
    this.messageService.add({severity: 'error', summary: 'Cargar perfil', detail: error.message});
    throwError(error);
  }

  private manageUserPhones() {
    return _ => {
      if (this.person.phones.length > 4) {
        this.phones = this.person.phones.slice(0, 4);
      } else {
        this.phones = this.person.phones;
      }
    };
  }

  onEditProfile = () => {
      this.router.navigate(['/profile/edit', this.userId]);
    }
  }

