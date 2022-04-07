import { Component, OnInit, ViewChild, ElementRef, Input, Output, ViewEncapsulation, Optional, OnDestroy } from '@angular/core';
import { TreeNode } from 'primeng/api/treenode';
import { EventEmitter } from '@angular/core';
import { ControlContainer, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-dropdown-tree',
  templateUrl: './dropdown-tree.component.html',
  styleUrls: ['./dropdown-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownTreeComponent implements OnInit, OnDestroy {
  @Input() formControlName?: string;
  formGroup?: FormGroup;
  targetElement: ElementRef;
  @Input() isDisabled;
  @Input() treeData;
  @Input() selection: TreeNode;
  @Input() multiSelection: any[];
  @Input() isMultiSelect = false;
  @Output() selectionChange = new EventEmitter();
  @Output() getResult: EventEmitter<any[]> = new EventEmitter<any[]>();
  visible = false;
  isReactiveForm = false;
  private _data;
  constructor(@Optional() public ctrlContainer?: FormGroupDirective, @Optional() public formBuilder?: FormBuilder) {

  }
  ngOnDestroy(): void {
    this.multiSelectionEvent();
  }

  get data() {
    this._data = this.isMultiSelect ? this.multiSelection : this.selection;
     return this._data;
  }
  set data(value) {
    this._data = value;
  }

  ngOnInit(): void {
    if (this.formControlName) {
      this.isReactiveForm = true;
      this.formGroup = this.ctrlContainer.form;
      const control = new FormControl('');
      this.formGroup.addControl(this.formControlName, control);
    }
  }

  click(event, element, target?) {
    if (!this.visible) {
      if (!this.isDisabled ) {
        element.show(event);
        this.visible = !this.visible;
      }
    } else {
      element.hide(event);
      this.visible = !this.visible;
    }
  }

  nodeSelect(event, element) {
     if (this.isMultiSelect) {
       this.multiSelectionEvent();
     } else {
      this.singleSelectionEvent(event, element);
     }
   }
  multiSelectionEvent() {
    this.getResult.emit(this._data);
  }

  singleSelectionEvent(event: any, element: any) {
    if (event.node.key === String(-1)) {
      this.selection = null;
        return;
    }
      element.hide();

    if (this.isReactiveForm) {
      this.formGroup.controls[this.formControlName].setValue(event.node);
    }
      this.visible = false;
      this.selection = event.node;
      this.selectionChange.emit(event.node);
  }
}


