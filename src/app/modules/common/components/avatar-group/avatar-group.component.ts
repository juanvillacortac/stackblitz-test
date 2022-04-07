import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss']
})
export class AvatarGroupComponent implements OnInit {

  @Input() avatarList: any[];
  @Input() maxDisplayed = 5;
  @Input() size = 'large';
  @Input() shape = 'circle';
  displayedList: any[];
  unDisplayedList: any[];
  unDisplayedTotal = 0;
  profileDetailModalShow = false;
  name = '';
  image = '';
  id = '';

  constructor() { }
  @ViewChild('op') overlayPanel: OverlayPanel;
  ngOnInit(): void {
    this.configurateGroup();
  }
  configurateGroup() {
    if (this.avatarList?.length > 0) {
      this.displayedList = this.avatarList.slice(0, this.maxDisplayed);
      this.unDisplayedTotal = this.calculateUnDisplayedAvatars();
      this.unDisplayedList = this.avatarList.slice(this.maxDisplayed, this.avatarList.length);
    }

  }
  calculateUnDisplayedAvatars() {
    return  this.avatarList.length - this.maxDisplayed ?? 0;
  }
  showDetails(user) {
    this.id = user.id;
    this.image = user.image;
    this.name = user.name;
    this.profileDetailModalShow = true;
  }
  public childCallBack(result: number): void {
    this.profileDetailModalShow = false;
  }

  showMoreAvatar(event, item) {
    this.overlayPanel.toggle(event, event.target);
  }
}
