import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-panel-menu',
  templateUrl: './panel-menu.component.html',
  styleUrls: ['./panel-menu.component.scss']
})
export class PanelMenuComponent implements OnInit {
  @Input() menu: MenuItem[];
  model: any[];

  constructor(public app: LayoutComponent) {}

  ngOnInit(): void {
    this.model = [];
  }
  onMenuClick() {
    this.app.menuClick = true;
}
}
