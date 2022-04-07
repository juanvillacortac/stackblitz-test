import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Supplier } from 'src/app/models/masters/supplier';
import { Suppliermodal } from 'src/app/modules/srm/shared/view-models/common/suppliermodal';

@Component({
  selector: 'app-reception-supplier',
  templateUrl: './reception-supplier.component.html',
  styleUrls: ['./reception-supplier.component.scss']
})
export class ReceptionSupplierComponent implements OnInit {

  @Input() supplier: Supplier = new Supplier();
  @Input() submitted: boolean;
  @Input() disabled: boolean = false;
  @Output() save = new EventEmitter();
  supplierDialogVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  suppliermodalChange(supplier: Suppliermodal) {
    this.supplier.id = supplier.id;
    this.supplier.document = supplier.document;
    this.supplier.direction = supplier.direction;
    this.supplier.socialReason = supplier.socialReason;
  }
  
  toggleSupplier(visible: boolean) {
    this.supplierDialogVisible = visible;
  }

  onSave() {
    this.save.emit();
  }

  showSupplierModal() {
    this.supplierDialogVisible = true;
  }

  supplierIsvalid() {
    return this.submitted ? this.supplier?.document?.length > 0 : true;
  }

}
