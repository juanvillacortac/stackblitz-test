
import { Component } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { CurrentOfficeSelectorService } from '../panel-topbar/current-office-selector/shared/current-office-selector.service';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})

export class LandingPageComponent {
  
  constructor(private breadcrumbService: BreadcrumbService,private _selectorService: CurrentOfficeSelectorService) {
    this._selectorService.setSelectorType(EnumOfficeSelectorType.company);
    this.breadcrumbService.setItems([
      { label: 'Inicio', routerLink: ['/home/dashboard'] }
  ]);
}


}

