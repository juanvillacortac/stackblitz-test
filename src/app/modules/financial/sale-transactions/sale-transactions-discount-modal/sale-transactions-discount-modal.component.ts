import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { SalesTransactionDiscount } from 'src/app/models/financial/sale-transactions';
import { DiscountRate } from 'src/app/models/masters/discountRate';
import { DiscountRateService } from 'src/app/modules/masters/discountrate/shared/discountrate.service';
import { transactionSalesDiscountDataTable } from '../sale-transactions-discount-tree/sale-transactions-discount-tree.component';
@Component({
  selector: 'app-sale-transactions-discount-modal',
  templateUrl: './sale-transactions-discount-modal.component.html',
  styleUrls: ['./sale-transactions-discount-modal.component.scss']
})
export class SaleTransactionsDiscountModalComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  submitted: boolean = false;
  @Input('displayModal') displayModal: boolean;
  @Input() isUpdating = false;
  
  @Input() discount = new transactionSalesDiscountDataTable();
  @Output() displayModalChange = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<transactionSalesDiscountDataTable>();
  @Output() onUpdate = new EventEmitter<transactionSalesDiscountDataTable>();
  requiredd = '*';
  typeDiscountList: SelectItem[] = [];

  constructor(private _discountType: DiscountRateService,
    private messageService: MessageService) {
   }

  ngOnInit(): void {
    this.GetTypeDiscount();
  }

  hideDialog() {
    this.displayModal = false; 
    this.submitted = false;
    this.discount = new transactionSalesDiscountDataTable();

    this.displayModalChange.emit(this.displayModal);
  }

  GetTypeDiscount() {
    var filter = new DiscountRate()
    filter.id = -1;
    //  filter.active=1;
    this._discountType.getDiscountRateList(filter).subscribe((data: DiscountRate[]) => {
      console.log(data);
      this.typeDiscountList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de descuentos." });
    });
  }

  AcceptButtonPresed() {

    this.submitted = true;
    
    if (this.discount.description.trim() == "" || !this.discount.discountTypeId   ){
      return;
    }
    
    
    if (this.isUpdating == false){

      this.onCreate.emit(this.discount);
    }
    else{
      this.onUpdate.emit(this.discount);
    } 
    this.discount = new transactionSalesDiscountDataTable();
    this.hideDialog();
  }
}
