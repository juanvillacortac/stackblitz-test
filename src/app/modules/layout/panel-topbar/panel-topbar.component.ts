import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyOffice } from 'src/app/models/security/company-office';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../login/shared/auth.service';
import { LayoutComponent } from '../layout/layout.component';
import { LayoutService } from '../shared/layout.service';

@Component({
  selector: 'app-panel-topbar',
  templateUrl: './panel-topbar.component.html',
  styleUrls: ['./panel-topbar.component.scss']
})
export class PanelTopbarComponent {
    
    @Input() fullName: '';
    @Input() offices: CompanyOffice[];
    @Output() officeSelected: EventEmitter<any> = new EventEmitter<any>();

    get defaultURL() {
      return `https://ui-avatars.com/api/?name=${this.fullName}&background=17a2b8&color=fff&rounded=true&bold=true&size=200`
    }

    get userImage() {
      const userImage = this._authService.userImage;
      if (userImage && userImage !== '') return userImage
      else return this.defaultURL
    }

    activeItem: number;
    currentApplicationVersion: string;

    constructor(
        public app: LayoutComponent,
        private router: Router,
        private _authService: AuthService,
        private _layoutService: LayoutService
    ) {
        this.currentApplicationVersion = environment.appVersion;
    }

    mobileMegaMenuItemClick(index) {
        this.app.megaMenuMobileClick = true;
        this.activeItem = this.activeItem === index ? null : index;
    }

    onOpenProfile() {
        this.router.navigate(['/profile/me']);
    }

    onLogOut() {
        this._layoutService.removeStateAccessFromStorage();
        this._authService.removeUserStateFromStorage();
        window.location.replace('');
    }

    onOfficeSelected(companyOffice) {
         this.officeSelected.next(companyOffice);
    }
}