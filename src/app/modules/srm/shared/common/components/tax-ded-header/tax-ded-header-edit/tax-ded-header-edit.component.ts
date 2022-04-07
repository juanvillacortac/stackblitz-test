import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Deductible } from 'src/app/models/srm/deductible';
import { Taxable } from 'src/app/models/srm/taxable';
import { TaxableDeductibleFilter } from 'src/app/models/srm/taxable-deductible-filter';
import { Taxabledeductible } from 'src/app/models/srm/taxabledeductible';
import { PurchaseorderService } from '../../../../services/purchaseorder/purchaseorder.service';

@Component({
  selector: 'app-tax-ded-header-edit',
  templateUrl: './tax-ded-header-edit.component.html',
  styleUrls: ['./tax-ded-header-edit.component.scss']
})
export class TaxDedHeaderEditComponent implements OnInit {
  @Input("_deducible") _product: Deductible;
  @Input("_imponible") _imponible: Taxable = new Taxable();
  @Input("showDialogEdit") showDialogEdit: boolean = false;
  @Output() showDialogEditChange = new EventEmitter<boolean>();
  //@Output("_sendNewCost") _sendNewCost = new EventEmitter<PurchaseOrderProduct>();
  @Output("_sendList") _sendList = new EventEmitter<{TaxableListHeaderSave: Taxabledeductible}>();
  TaxableListHeaderSave: Taxabledeductible = new Taxabledeductible();
  submitted: boolean;
  visibleAmount: boolean = false;
  visibleRate: boolean = false;
  TaxabledeductibleList: Taxabledeductible = new Taxabledeductible()
  titleHeader: string ="";
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
   this._imponible.active=true;
    this.submitted = true;
    if (this._imponible.rate > 0 || this._imponible.amount > 0) {
         this.TaxabledeductibleList.taxables = [];
         this.TaxabledeductibleList.taxables.push(this._imponible);
         this.saveTaxable(this._imponible);
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
  }

  saveTaxable(tax) {
    var filter: TaxableDeductibleFilter = new TaxableDeductibleFilter();
    filter.purchaseOrderId = tax.idPurchaseOrder;
    this.purchaseService.SaveTaxables(this.TaxabledeductibleList).subscribe((data: number) => {
      if (data > 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.purchaseService.GetTaxablesDeductibles(filter).subscribe((data: Taxabledeductible) => {

          if (data.taxables.length > 0 || data.deductibles.length > 0) {
            //update listados
            if(tax.indDeductible)
               this.purchaseService._taxdedpurcharseHeader.deductibles=data.deductibles;
            else
               this.purchaseService._taxdedpurcharseHeader.taxables=data.taxables;    
            // emitir evento 
            this.TaxableListHeaderSave.taxables=data.taxables;
            this.TaxableListHeaderSave.deductibles=data.deductibles;
            this._sendList.emit({
              TaxableListHeaderSave:this.TaxableListHeaderSave
            });
            this.hideDialog();
          }
          // else{
          //   if (data.deductibles.length > 0) {
          //     // emitir evento 
          //     this.TaxableListHeaderSave.deductibles=data.deductibles;
          //     this._sendListTaxable(this.TaxableListHeaderSave);
          //     this.hideDialog();
          //   }
          // }
          //this._purchaseorderService._PurchaseOrderList = data;
          //  this.loading = false;
        }, (error: HttpErrorResponse) => {
          // this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
        });
        this.submitted = false;
        //emitir event al component padre.
        //this.onhide.emit();
      } else if (data == -1) {
        this.TaxabledeductibleList.taxables = [];
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "El imponible ya existe para este producto" });
      } else {
        this.TaxabledeductibleList.taxables = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los imponibles." });
      }
    }, (error: HttpErrorResponse) => {

      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los imponibles." });
    });
  }

  saveDed() { }



  hideDialog() {
    this.visibleAmount=false;
    this.visibleRate=false;
    this.showDialogEdit = false;
    this.showDialogEditChange.emit(this.showDialogEdit);
  }

  clearinput(event) {
    event.target.value = "";
    if (event.target.value == "0,0000" || event.target.value == "0,00" || event.target.value == "0") {
      event.target.value = "";
    }
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
  // _sendListTaxable(data) {
  // //  this._sendList.emit(data);
  //   this._sendList.emit({
  //     TaxableListHeaderSave: data
  //   });
  // }
}
