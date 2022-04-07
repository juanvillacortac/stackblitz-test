import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { PurchaseOrdertaxableDetail } from 'src/app/models/srm/purchase-order-taxable-detail';
import { Taxable } from 'src/app/models/srm/taxable';
import { TaxableDeductibleFilter } from 'src/app/models/srm/taxable-deductible-filter';
import { Taxabledeductible } from 'src/app/models/srm/taxabledeductible';
import { PurchaseorderService } from 'src/app/modules/srm/shared/services/purchaseorder/purchaseorder.service';

@Component({
  selector: 'app-taxable-deductible-edit',
  templateUrl: './taxable-deductible-edit.component.html',
  styleUrls: ['./taxable-deductible-edit.component.scss']
})
export class TaxableDeductibleEditComponent implements OnInit {
  @Input("_product") _product: PurchaseOrderProduct;
  @Input("_imponible") _imponible: PurchaseOrdertaxableDetail = new PurchaseOrdertaxableDetail();
  @Input("showDialog") showDialog: boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("_sendNewCost") _sendNewCost = new EventEmitter<PurchaseOrderProduct>();
  @Output("_sendList") _sendList = new EventEmitter<{ TaxableListSave: Taxabledeductible }>();
  TaxableListSave: Taxabledeductible = new Taxabledeductible();
  submitted: boolean;
  loading:boolean=false;
  visibleAmount: boolean = false;
  visibleRate: boolean = false;
  titleHeader: string="";
  TaxabledeductibleList: Taxabledeductible = new Taxabledeductible()
  constructor(public purchaseService: PurchaseorderService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onShow() {
    if (this._imponible.rate > 0) {
      this.visibleRate = true;
    } else {
      this.visibleAmount = true;
    }
    if(this._imponible.indDeductible)
       this.titleHeader="Editar deducible"
    else
       this.titleHeader="Editar imponible"
  }
  save() {
    // this.submitted = true
    // if (this._imponible.amount != 0 || this._imponible.rate != 0) {
      this.submitted = true;
      var a = new Taxable();
      a.idPurchaseOrder = this._imponible.idPurchaseOrder
      a.idPurchaseOrderDetail = this._imponible.idPurchaseOrderDetail;
      a.idRate = this._imponible.idRate;
      a.indDeductible = this._imponible.indDeductible;
      a.indTaxable = this._imponible.indTaxable;
      a.rate = this._imponible.rate;
      a.amount = this._imponible.amount;
      a.taxableDeductibleBaseId = this._imponible.taxableDeductibleBaseId;
      a.indPurchaseTaxable = this._imponible.indPurchaseTaxable;
      a.indPurchaseTaxableDetail = this._imponible.indPurchaseTaxableDetail;
      a.idPurchaseOrderTaxableDeductible = this._imponible.id;
      a.idApply = this._imponible.idApply
      a.active = true;
     
      
      if (this._imponible.rate > 0 || this._imponible.amount > 0) {
        this.TaxabledeductibleList.taxables = [];
        this.TaxabledeductibleList.taxables.push(a);
        this.loading = true;
        this.saveTaxable(a)
      }
      // if (this._imponible.indTaxable) {
      //   this.submitted = true;
      //   if (this._imponible.rate > 0 || this._imponible.amount > 0) {
      //     this.TaxabledeductibleList.taxables = [];
      //     this.TaxabledeductibleList.taxables.push(a);
      //     this.saveTaxable(a)
      //   }
      // } else {
      //   if (this._imponible.rate > 0 || this._imponible.amount > 0) {
      //     this.TaxabledeductibleList.deductibles = [];
      //     this.TaxabledeductibleList.deductibles.push(a);
      //     this.saveTaxable(a)
      //   }
      // }
   // }
    }
    saveTaxable(tax) {
      var filter: TaxableDeductibleFilter = new TaxableDeductibleFilter();
      filter.purchaseOrderDetail = tax.idPurchaseOrderDetail;
      this.purchaseService.SaveTaxables(this.TaxabledeductibleList).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.purchaseService.GetTaxablesDeductibles(filter).subscribe((data: Taxabledeductible) => {
            if (data.taxables.length > 0 || data.deductibles.length > 0) {
              // emitir evento 
              this.TaxableListSave.taxables = data.taxables;
              this.TaxableListSave.deductibles = data.deductibles;
              this._sendListTaxable(this.TaxableListSave);
              this.hideDialog();
            }
            // }else{
            //   if (data.deductibles.length > 0) {
            //     // emitir evento 
            //     this.TaxableListSave.deductibles=data.deductibles;
            //     this._sendListTaxable(this.TaxableListSave);
            //     this.hideDialog();
            //   }
            // }
            //this._purchaseorderService._PurchaseOrderList = data;
           this.loading = false;
          }, (error: HttpErrorResponse) => {
             this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
          });
          this.submitted = false;
          //emitir event al component padre.
          //this.onhide.emit();
        } else if (data == -1) {
          this.TaxabledeductibleList.taxables = [];
          console.log(data);
          this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "El imponible ya existe para este producto" });
        } else {
          console.log(data);
          this.TaxabledeductibleList.taxables = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los imponibles." });
        }
      }, (error: HttpErrorResponse) => {

        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los imponibles." });
      });
    }

    saveDed() { }



    hideDialog() {
      this.visibleAmount = false;
      this.visibleRate = false;
      this.showDialog = false;
      this.showDialogChange.emit(this.showDialog);
    }

    clearinput(event) {
      event.target.value = "";
      if (event.target.value == "0,0000" || event.target.value == "0,00" || event.target.value == "0") {
        event.target.value = "";
      }
    }

    _sendListTaxable(data) {
      //  this._sendList.emit(data);
      this._sendList.emit({
        TaxableListSave: data
      });
    }

    reset(event) {
      if (event.target.value == "" || event.target.value == " ") {
        event.target.value = "0,0000";
        if (this._imponible.rate == null) {
            this._imponible.rate = 0;
        } else {
          this._imponible.amount = 0;
        }
      }
    }
  }
