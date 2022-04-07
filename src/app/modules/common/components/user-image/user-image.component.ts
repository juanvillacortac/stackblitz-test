import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/users/Profile';
import { UsersService } from 'src/app/modules/users/shared/users.service';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent implements OnInit {

  @Input() userId = -1;
  @Input() userName = '';
  @Input() img = '';
  @Input() width = 32;
  @Input() fontSize = 12;
  profileDetailModalShow = false;
  constructor(private readonly usersService: UsersService) { }

  ngOnInit(): void {
    this.searchUserImage();
  }
  searchUserImage() {
    this.getUserProfileByUserId();

    
  }

  getUserProfileByUserId() {
    if(this.userId >= 0) {
      this.usersService.getEntityProfile(this.userId)
      .then(result => this.getUserProfileByUserIdSuccesfuly(result))
      .catch(error => console.log(error.message));
    }
  }

  getUserProfileByUserIdSuccesfuly(profile: Profile) {
    this.userName = profile?.person?.name +" "+ profile?.person?.lastName;
    
    if (this.img.length === 0) {
      this.setDefaultImage();
    } else {this.img = profile?.person.image;}

  }

  setDefaultImage() {
    this.img = 'assets/layout/images/topbar/user-default.png';
  }
  showDetails() {
    this.profileDetailModalShow = false;
  }
  public childCallBack(result: number): void {
    this.profileDetailModalShow = false;
  }

}
