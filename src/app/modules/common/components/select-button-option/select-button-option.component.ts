import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-button-option',
  templateUrl: './select-button-option.component.html',
  styleUrls: ['./select-button-option.component.scss']
})
export class SelectButtonOptionComponent implements OnInit {
  @Input() options = [];
  @Input() optionSelected = 1;
  @Output() setSelection = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
    this.loadOptions();
  }
  loadOptions() {
    this.options = this.options?.length > 0 ? this.options : this.loadDefaultOptions();
  }
  loadDefaultOptions(): any[] {
    return [
      {name: 'Este mes', value: 1},
      {name: 'Último 3 meses', value: 3},
      {name: 'Último 6 meses', value: 4}
  ];
  }

  onOptionSelected(selection) {
    this.setSelection.emit(selection.option.value);
  }

}
