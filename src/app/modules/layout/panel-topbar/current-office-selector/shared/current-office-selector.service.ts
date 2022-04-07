import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';

@Injectable({
  providedIn: 'root'
})
export class CurrentOfficeSelectorService {

  private currentType = new Subject<EnumOfficeSelectorType>();
  itemsHandler = this.currentType.asObservable();

  setSelectorType(type: EnumOfficeSelectorType) {
      this.currentType.next(type);
  }
  getSelectorType() {
    return this.currentType;
  }
}
