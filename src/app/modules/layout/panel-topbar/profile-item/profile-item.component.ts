import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { LayoutComponent } from '../../layout/layout.component';
import { LayoutService } from '../../shared/layout.service';

@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.scss']
})
export class ProfileItemComponent implements OnInit {

  @Input() userName: string;
  @Input() userImage: string;
  @Input() appVersion: string;
  
  constructor(   
    public app: LayoutComponent, 
    private router: Router, 
    private _authService: AuthService,
    private _layoutService: LayoutService) { }

  ngOnInit(): void {
  }

  onOpenProfile() {
    this.router.navigate(['/profile/me']);
  }    

  onLogOut() {
    this._layoutService.removeStateAccessFromStorage();
    this._authService.removeUserStateFromStorage();
    window.location.replace('');
  }
}
