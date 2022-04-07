import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckOption } from 'src/app/models/common/check-option';
import { CompanyOffice } from 'src/app/models/security/company-office';

@Component({
  selector: 'app-checkbox-table-selector',
  templateUrl: './checkbox-table-selector.component.html',
  styleUrls: ['./checkbox-table-selector.component.scss']
})
export class CheckboxTableSelectorComponent implements OnInit {

  @Input() title: string;
  @Input() options: [CheckOption];
  @Output() public setSelection: EventEmitter<CheckOption[]> = new EventEmitter();
  userOffices: CompanyOffice[] = [];
  selectedAll = false;

  constructor() { }

  ngOnInit(): void {

  }
  onSelectAll = ($event) => {
    this.options.forEach(opt => {
      opt.selected = $event.checked;
    });
    this.onOptionsChange();
  }
  onOptionsChange() {
    this.setSelection.emit(this.options);
  }
  get itemsSelected() {
    return this.options.filter(p => p.selected).length ?? 0;
  }

  get selectAll() {
    this.selectedAll = this.options.every(x => x.selected);
    return this.selectedAll;
  }
  get optionsCount() {
    return this.options.length;
  }
}
