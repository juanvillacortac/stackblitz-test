import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss']
})
export class CheckListComponent implements OnInit {

  @Input() options: [CheckOption];
  @Input() itemsDisabled: boolean = false
  @Output() public onSelect: EventEmitter<CheckOption[]> = new EventEmitter();

  selectedAll: boolean = false
  get selectAll() {
    this.selectedAll = this.options.every(x => x.selected)
    return this.selectedAll
  }
  selectAllLabel = 'Todos';
  get optionsCount() {
    return this.options.length;
  }

  constructor() { }

  ngOnInit(): void {
  }

  onSelectAll = ($event) => {
    this.options.forEach(opt => {
      opt.selected = $event.checked;
    });
    this.onOptionsChange()
  }

  onOptionsChange() {
    this.onSelect.emit(this.options);
  }
}

export class CheckOption {
  id: number;
  name: string;
  selected: boolean;
}
