import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserFilterViewModel } from 'src/app/modules/security/shared/view-models/userFiltervIewmodel';
import { UserService } from 'src/app/modules/security/users/shared/user.service';
import { DialogsService } from '../../services/dialogs.service';

@Component({
  selector: 'app-auto-complete-user-search',
  templateUrl: './auto-complete-user-search.component.html',
  styleUrls: ['./auto-complete-user-search.component.scss']
})
export class AutoCompleteUserSearchComponent implements OnInit {
  selectedUser: any[];
  filteredUsers: any[];
  userFilters: UserFilterViewModel = new UserFilterViewModel;
  @Input() singleSelection = false;
  @Input() placeholderUsers: string = "";
  @Output() setSelection  = new EventEmitter<any[]>();
  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _dialogService: DialogsService) { }

  ngOnInit(): void {
  }

  searchUsers(event) {
    if (event.query.lenght === 0) { return; }
    this.completeFilters(event.query);
    this._userService.getAllUsersPromise(this.userFilters)
    .then(result => this.filteredUsers = result)
    .catch(error => this.handleError(error));
  }
  completeFilters(userName) {
    this.userFilters.idCompany = this._authService.currentCompany;
    this.userFilters.idSubsidiary = this._authService.currentOffice;
    this.userFilters.name = userName ?? '';
  }

  onChangeSelection() {
    this.setSelection.emit(this.selectedUser);
  }
  onSelection(selection) {
   if (this.singleSelection) {
        if (this.selectedUser.length > 0) {
          this.selectedUser = [];
          this.selectedUser.push(selection);
        }
   }
   this.onChangeSelection();
  }
  private handleError(error: HttpErrorResponse) {
    this.filteredUsers = [];
   if (error.status !== 404) {
    this._dialogService.errorMessage('master.user_searcher', error?.error?.message ?? 'error_service');
   }
  }
}
