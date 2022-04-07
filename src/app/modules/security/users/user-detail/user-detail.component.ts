import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/security/User';
import { UserFilter } from 'src/app/models/security/UserFilter';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  @Input() user: User;

  userFilter: UserFilter = {
    idCompany: 0,
    idRole: 0,
    idSubsidiary: 0,
    idUser: 0,
    mainEmail: '',
    status: -1
  };

  constructor(private userService: UserService, 
              private actRoute: ActivatedRoute, 
              private dialogService: DialogsService, 
              private _authService: AuthService) { }

  ngOnInit(): void {
    const id = this.actRoute.snapshot.params['id']

    if(id > 0) {
      this.getUser(id);
    }

  }

  isInternalUser(){
    return  this.user?.userType === 1;
  }

  getUser(userId){
    const userFilter = {
      idCompany: 0,
      idRole: 0,
      idSubsidiary: 0,
      idUser: Number(userId),
      mainEmail: '',
      status: -1
    };
    this.userService.getAllUsersPromise({...userFilter})
    .then(data => this.user = data[0])
    .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('security', error?.error?.message ?? 'error_service');
  }

}
