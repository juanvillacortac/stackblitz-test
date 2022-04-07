import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { PaymentFilterList } from '../models';

@Component({
  selector: 'app-payments-filters',
  templateUrl: './payments-filters.component.html',
  styleUrls: ['./payments-filters.component.scss']
})
export class PaymentsFiltersComponent implements OnInit {

  loading:boolean = false;
  supplierModal:boolean = false;
  filter: PaymentFilterList = new PaymentFilterList();
  bankAccounts: SelectItem[] = [];
  
  @Input() suppliers: SupplierExtend[] = [];
  @Input() supplierClassifications: SupplierClasification[];

  dateFilterOptions: SelectItem[] = [
    {
      value:1,
      label:"Fecha de creación"      
    },
    {
      value:2,
      label:"Fecha de la transacción"      
    },
    {
      value:3,
      label:"Fecha contabilizacion"      
    },
    
  ];

  originBanks: SelectItem[] =   [
    {
      value:1,
      label:"Banesco"      
    },
    {
      value:2,
      label:"Banco nacional de credito"      
    },
    {
      value:3,
      label:"Banco de venezuela"      
    },
    {
      value:4,
      label:"Banco Mercantil"      
    }
  ];

  bankAccountsList: any[] =   [
    {
      bank:1,
      accountId:1,
      label:"0133256314589652"      
    },
    {
      bank:1,
      accountId:2,
      label:"0123256314589123"      
    },
    {
      bank:2,
      accountId:3,
      label:"0122256314589565"      
    },
    {
      bank:3,
      accountId:4,
      label:"0133256444589335"      
    },
    {
      bank:4,
      accountId:5,      
      label:"0144256444589325"      
    }
  ];

  paymentTypes: SelectItem[] =   [
    {
      value:1,
      label:"Aplicacion directa"      
    },
    {
      value:2,
      label:"Anticipo"      
    }
  ];

  paymentStatusses: SelectItem[] =   [
    {
      value:1,
      label:"Borrador"      
    },
    {
      value:2,
      label:"Cancelado"      
    },
    {
      value:3,
      label:"Contabilizado"      
    },
    {
      value:5,
      label:"Anulado"      
    }
  ];

  


  constructor(
     
  ) { }

  ngOnInit(): void {
    
  } 

  getSupplier($event){
    this.filter.providerId = $event.idclientsupplier;
    this.filter.provider = $event.socialReason;

  }

  search(){
    console.log(this.filter);
  }

  clean(){
    this.filter =  new PaymentFilterList();
  } 

  updateAccounts(){
    const output = this.bankAccountsList.map((p,i) =>{
      if (p.bank === this.filter.bankId ){
          return {
            label: p.label,
            value: p.accountId,
            
          }
      }
    })
    
    this.bankAccounts = output.filter(p=>(!!p))
  }

  

}
