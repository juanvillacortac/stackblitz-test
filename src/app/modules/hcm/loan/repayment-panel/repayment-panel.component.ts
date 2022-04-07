import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { RedemptionPayment } from '../../shared/models/loans/redemption-payment';
import { RedemptionPaymentViewModel } from '../../shared/view-models/loans/redemption-payment-viewmodel';

@Component({
  selector: 'app-repayment-panel',
  templateUrl: './repayment-panel.component.html',
  styleUrls: ['./repayment-panel.component.scss'],
  providers: [DatePipe]
})
export class RepaymentPanelComponent implements OnInit {

  @Input() visible: boolean;
  @Input() payments: RedemptionPayment[];
  @Input() totalAmount: number;
  @Input() bankAccountDropdown: SelectItem[];

  @Output() backUnChange: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() saveRedemption: EventEmitter<RedemptionPayment[]> = new EventEmitter<RedemptionPayment[]>()


  paymentTypeSelect: SelectItem = {label:"", value: -1};
  bankAccountSelect: SelectItem = {label:"", value: -1};
  submitted: boolean = false;
  transferenceType: boolean = false;
  transferenceSuccess: boolean = false;
  mainData: boolean = false;

  amount: number = 0;
  reference: string = "";
  newRedemption: RedemptionPaymentViewModel = new RedemptionPaymentViewModel();
  paymentDate: Date;
  today: Date = new Date();
  newPaymentList: RedemptionPayment[];


  constructor(public datepipe: DatePipe,) { }

  paymentTypeDropdown = [{label: "Cheque", value: 3},{label: "Efectivo", value: 2},{label: "Transferencias", value: 1}];

  ngOnInit(): void {
    this.newPaymentList = this.payments.slice();
  }

  // onLoadPaymentType(){

  // }

  outForm(){
    this.backUnChange.emit(false);
  }

  add(){
    debugger;
    
    
    if(this.transferenceType){
      if(this.paymentTypeSelect.value == -1 || this.newRedemption.paymentAmount <= 0 || this.newRedemption.paymentAmount == null || 
        this.paymentDate == null || this.bankAccountSelect.value == -1 || this.newRedemption.reference == '' || this.newRedemption.reference == null)
      {
        this.mainData = false
      }else{
        this.mainData = true
      }
    }else{
      if(this.paymentTypeSelect.value == -1 || this.newRedemption.paymentAmount <= 0 || this.newRedemption.paymentAmount == null || this.paymentDate == null )
      {
        this.mainData = false
      }else{
        this.mainData = true
      }
    }

    if(this.mainData){
      this.submitted = false;
      this.newRedemption.idPaymentType = this.paymentTypeSelect.value;
      this.newRedemption.paymentType = this.paymentTypeSelect.label;
      this.newRedemption.idCompanyBankAccount = this.bankAccountSelect.value;
      this.newRedemption.companyBankAccount = this.bankAccountSelect.label;
      this.newRedemption.paymentDate = this.datepipe.transform(this.paymentDate, "yyyy-MM-dd");
      this.newPaymentList.push(this.newRedemption);
      this.newRedemption = new RedemptionPaymentViewModel();
      this.bankAccountSelect = {label:"", value: -1};
      this.paymentTypeSelect = {label:"", value: -1};
      this.paymentDate = null;
      this.transferenceType = false;
    }else{
      this.submitted = true;
    }

    //this.newRedemption.paymentDate = 
  }

  submit(){
    //var newListPayment = [];
    // this.newPaymentList.forEach(element =>{
    //   var object = new RedemptionPayment();
    //   object.idCompanyBankAccount = element.idCompanyBankAccount;
    //   object.idPaymentType = element.idPaymentType;
    //   object.idRedemptionPayment = element.idRedemptionPayment
    //   object.idRepayment = element.idRepayment
    //   object.paymentAmount = element.paymentAmount
    //   object.paymentDate = element.paymentDate
    //   object.paymentType = element.paymentType;
    //   object.reference = element.reference;
    //   this.newPaymentList.push(object);
    // });
    this.saveRedemption.emit(this.newPaymentList);
  }


  paymentTypeChange(){
    if(this.paymentTypeSelect.value != 2){
      this.transferenceType = true;
    }else{
      this.transferenceType = false;
    }
  }




}
