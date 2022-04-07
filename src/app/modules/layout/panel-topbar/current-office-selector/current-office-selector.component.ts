import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { CompanyOffice } from 'src/app/models/security/company-office';
import { AuthService } from '../../../login/shared/auth.service';
import { CurrentOfficeSelectorService } from './shared/current-office-selector.service';

@Component({
  selector: 'app-current-office-selector',
  templateUrl: './current-office-selector.component.html',
  styleUrls: ['./current-office-selector.component.scss']
})
export class CurrentOfficeSelectorComponent implements OnDestroy, OnInit {

  @Input() staticWidth = true;
  @Input() set offices(_value: CompanyOffice[]) {
    this._offices = _value;
    this.selectCurrentOffice();
  }
  @Output() officeSelected: EventEmitter<any> = new EventEmitter<any>();
  get getGroupedOffices() { return this._offices.map(office => this.groupedItemByOffice(office)); }
  get grouped() { return this.selectorType !== EnumOfficeSelectorType.company; }
  _offices: CompanyOffice[] = [];
  selection: number;
  selectorType = EnumOfficeSelectorType.office;
  title = 'Sucursal actual';
  subscription: Subscription;
  constructor(
    private _authService: AuthService,
    private _officeSelectorService: CurrentOfficeSelectorService
    ) {
        this.subscription = _officeSelectorService.itemsHandler.subscribe(response => {
        this.selectorType = response ?? EnumOfficeSelectorType.office;
        this.title = this.selectorType === EnumOfficeSelectorType.company ? 'Compañía actual' : 'Sucursal actual';
    });
    }

  ngOnInit(): void {

  }
  ngOnDestroy() {
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
  }

  onOfficeSelected(item) {
    const companyOffice = this.mapSelection(item);
    this.officeSelected.next(companyOffice);
  }

  mapSelection(item) {
    switch (this.selectorType) {
      case EnumOfficeSelectorType.company:
      case EnumOfficeSelectorType.officeAndCompany: return { idOffice: -1, idCompany: item.value};
      case EnumOfficeSelectorType.office:  return { idOffice: item.value, idCompany: this.companyByOffice(item.value) };
    }
  }

  private groupedItemByOffice(item: CompanyOffice) {
      return {
          label: item.name,
          value: item.id,
          items: item.offices.map(child => ({
              label: child.name,
              value: child.id
          }))
      };
  }

  private companyByOffice(idOffice) {
      return this._offices.find(c => c.offices.findIndex(o => o.id === idOffice) !== -1).id;
  }

  private selectCurrentOffice() {
      this.selection = this.grouped ? this._authService.currentOffice : this._authService.currentCompany;
  }

}
