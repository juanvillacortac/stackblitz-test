import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-footer-form-buttons',
  templateUrl: './footer-form-buttons.component.html',
  styleUrls: ['./footer-form-buttons.component.scss']
})
export class FooterFormButtonsComponent implements OnInit {

  @Output() acceptPressed: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancelPressed: EventEmitter<void> = new EventEmitter<void>();

  @Input() showSave: Boolean = true;
  @Input() disableSave: Boolean = false;
  @Input() saveToolTip?: string = null;

  get saveBtnToolTip() { return this.saveToolTip ?? 'save'; }

  constructor() { }

  ngOnInit(): void { }

  onSavePressed() {
    this.acceptPressed.next();
  }

  onCancelPressed() {
    this.cancelPressed.next();
  }
}
