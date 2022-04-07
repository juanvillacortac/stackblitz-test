import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DeductibleRep } from 'src/app/models/srm/reception/deductible-rep';
import { Productdetailvalidation } from 'src/app/models/srm/reception/productdetailvalidation';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { TaxableRep } from 'src/app/models/srm/reception/taxable-rep';
import { TaxdedRep } from 'src/app/models/srm/reception/taxded-rep';
import { Taxabledeductible } from 'src/app/models/srm/taxabledeductible';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { ValidationProductService } from 'src/app/modules/srm/shared/services/validation-product/validation-product.service';
import { TaxableDeductiblePurchase } from 'src/app/modules/srm/shared/view-models/taxabledeductiblepurchase';

@Component({
  selector: 'app-tax-edit',
  templateUrl: './tax-edit.component.html',
  styleUrls: ['./tax-edit.component.scss']
})
export class TaxEditComponent implements OnInit {

  @Input("_product") _product: Productdetailvalidation;
  @Input("_imponible") _imponible: TaxableRep = new TaxableRep();
  @Input("showDialog") showDialog: boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input() PurchaseVal: PurchaseValidation; //Cabecera de la compra
  //@Output("_sendNewCost") _sendNewCost = new EventEmitter<PurchaseOrderProduct>();
  @Output("_sendList") _sendList = new EventEmitter<{ _product: Productdetailvalidation }>();
  @Output("issavechange") issavechange = new EventEmitter<{isave:boolean, taxded:TaxableRep}>();
  TaxableListSave: Taxabledeductible = new Taxabledeductible();
  submitted: boolean;
  loading:boolean=false;
  visibleAmount: boolean = false;
  visibleRate: boolean = false;
  titleHeader: string="";
  TaxabledeductibleList: TaxdedRep = new TaxdedRep();

  constructor( public _serviceValidation: ValidationProductService, private readonly dialogService: DialogsService,
    private messageService: MessageService,    private confirmationService: ConfirmationService,) { }

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
    debugger
    // this.submitted = true
    // if (this._imponible.amount != 0 || this._imponible.rate != 0) {
      this.submitted = true;
      

      if (this._imponible.rate > 0 || this._imponible.amount > 0) {
           this.loading = true;
           if(this._product !=undefined){
           if(!this._imponible.indDeductible){
            // this.TaxabledeductibleList.taxables = [];
            // this.TaxabledeductibleList.taxables.push(a);
            this._product.taxables= this._product.taxables.filter(x=>x.idProducTax!=this._imponible.idProducTax);
            this._product.taxables.push(this._imponible);

           }else{
              //Deducible
              var a = new DeductibleRep();
              a.idPurchase = this._imponible.idPurchase
              a.idPurchaseDetail = this._imponible.idPurchaseDetail;
              //a.idRate = this._imponible.idRate;
              a.indDeductible = this._imponible.indDeductible;
              a.indTaxable = this._imponible.indTaxable;
              a.rate = this._imponible.rate;
              a.amount = this._imponible.amount;
              a.taxableDeductibleBaseId = this._imponible.taxableDeductibleBaseId;
              a.indPurchaseTaxable = this._imponible.indPurchaseTaxable;
              a.indPurchaseTaxableDetail = this._imponible.indPurchaseTaxableDetail;
             // a.idPurchaseTaxableDeductible = this._imponible.taxableDeductibleBaseId; Identificar para que se usa este. 
              a.idApply = this._imponible.idApply
              a.applyCost= this._imponible.applyCost;
              a.taxableType= this._imponible.taxableType;
              a.active = true;
              a.idTemp= this._imponible.idTemp;
              a.indOdc= this._imponible.indOdc;
              a.idDiscountRate= this._imponible.idDiscountRate;
              a.discountRate= this._imponible.discountRate;
              a.taxableDeductibleBase= this._imponible.taxableDeductibleBase;
              this.TaxabledeductibleList.deductibles=[];
              this.TaxabledeductibleList.deductibles.push(a)
              this._product.deductibles= this._product.deductibles.filter(x=>x.idTemp!=this._imponible.idTemp);
              this._product.deductibles.push(a);

           }
               
             //this.saveTaxable(a)
             this._sendListTaxable(this._product);
            }
            else{
              let msg=''
              if(this._imponible.indDeductible)
                    msg='¿Está seguro que desea actualizar el deducibles, una vez aplicados se alterarán el subtotal de la compra? .'
              else
                  msg='¿Está seguro que desea actualizar el imponible, una vez aplicados se alterarán el subtotal de la compra? .'
            
              // this.confirmationService.confirm({
              //   header: 'Confirmación',
              //   icon: 'pi pi-exclamation-triangle',
              //   message: msg,
              //     accept: () => {
                      //  let model=new TaxableDeductiblePurchase()
                      //  let lisstaux=[]
                      //  lisstaux.push(this._imponible)
                      //  model.idPurchase=this.PurchaseVal.idPurchase
                      //  if(this._imponible.indDeductible)
                      //      model.deductibles=lisstaux
                      // else 
                      //     model.taxables=lisstaux
                      //  this.saveTaxable(model);
                  this.dialogService.confirmDialog('confirmBack', msg, () => {
                      this.issavechange.emit({isave:true,taxded:this._imponible})    
                });
              
            }
             this.hideDialog();
         
      }

      this.loading = false;
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

   
    saveTaxable(model) {
      this._serviceValidation.addTaxDedPurchase(model).subscribe((data: number) => {
        if (data > 0)
         {
            this.messageService.add({  severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
             
        }
        else { this.messageService.add({  severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }) }
      }, (error: HttpErrorResponse) =>
        this.messageService.add({  severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
        ));
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
        _product: data
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
