import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { TotalResumeViewmodel } from '../../../shared/view-models/total-resume-viewmodel';

@Component({
  selector: 'app-purchase-order-total-resume',
  templateUrl: './purchase-order-total-resume.component.html',
  styleUrls: ['./purchase-order-total-resume.component.scss']
})
export class PurchaseOrderTotalResumeComponent implements OnInit {
  Exchangerate:string="";
  sales: any[];

  //botones con opcions a los imponibles y deducibles a la cabecera
  items: MenuItem[]= [
    {label: 'Imponible', icon: 'pi pi-tag', command: () => {  
      this.showmodal(true, false)    
    }},
    {label: 'Deducible', icon: 'pi pi-folder', command: () => {
      this.showmodal(false, true)
    }}
  ];

 //modale de imponible deducible
 @Input("_product") _product: PurchaseOrderProduct;
 @Input("_purchaseheader") _purchaseheader: Groupingpurchaseorders;
 @Input('showtaxable') showtaxable:boolean;
 indDeductible: boolean=false;
  showModalTaxDed:boolean=false;

  _totalResumeList:any[];
  TotalBase: number=0;
  TotalConvertion: number=0;
  subtotal:number=0;
  constructor() { }

  
  displayedColumns:ColumnD<TotalResumeViewmodel>[] = 
  [
    { template: (data) => { return data.id; }, header: 'id',field:'id' ,display: 'none' },
    { template: (data) => { return data.description; }, header: 'Descripcion',field:'description' ,display: 'table-cell' },
    { template: (data) => { return data.value; }, header: 'Valor',field:'value' ,display: 'table-cell' },
    { template: (data) => { return data.totalbase; }, header: 'total base',field:'totalbase' ,display: 'table-cell' },
    { template: (data) => { return data.totalconvertion; }, header: 'total conversion',field:'totalconvertion' ,display: 'table-cell' }
  ];

  ngOnInit(): void {

  }

  calculateTotalBase() {
    let total = 0;
    for(let sale of this.sales) {
        total += sale.lastYearProfit;
    }

    this.TotalBase = total;
}

calculateTotalConvertion() {
  let total = 0;
  for(let sale of this.sales) {
      total += sale.lastYearProfit;
  }

  this.TotalConvertion = total;
}
showmodal(indTaxable:boolean, indDeductible:boolean){
  this._product= this._product;
  this.indDeductible= indDeductible;
  this.showModalTaxDed= true;
}

}
