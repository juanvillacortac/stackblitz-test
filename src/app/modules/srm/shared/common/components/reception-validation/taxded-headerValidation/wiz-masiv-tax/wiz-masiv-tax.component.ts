import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Productdetailvalidation } from 'src/app/models/srm/reception/productdetailvalidation';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { TaxableRep } from 'src/app/models/srm/reception/taxable-rep';
import { ValidationProduct } from 'src/app/models/srm/validation-product';
import { MenuwizardTaxValidation } from 'src/app/modules/srm/shared/Utils/menuwizardtaxvalidation';
import { AddTaxComponent } from './add-tax/add-tax.component';
import { ConfirmedSelectionComponent } from './confirmed-selection/confirmed-selection.component';

@Component({
  selector: 'app-wiz-masiv-tax',
  templateUrl: './wiz-masiv-tax.component.html',
  styleUrls: ['./wiz-masiv-tax.component.scss']
})
export class WizMasivTaxComponent implements OnInit {

  items: MenuItem[];
  activeIndex: number = 0;
  indmenu: number = 0;
  menuwizardTax: typeof MenuwizardTaxValidation = MenuwizardTaxValidation;
  //supplierxproduct: Productsxsupplier[] = [];

  @Input("showDialogWizard") showDialogWizard: boolean = false;
  @Output() showDialogWizardChange = new EventEmitter<boolean>();
  @Input() Purchase: PurchaseValidation = new PurchaseValidation();
  @Input("Products") Products: ValidationProduct[] = [];
  @Input("ProductsApp") ProductsApp: ValidationProduct[]; 
  @Input("TaxablesApp") TaxablesApp: TaxableRep[]; 
  @Input("selectedProducts") selectedProducts: ValidationProduct[] = [];
  @Input("TaxablesSelected") TaxablesSelected: TaxableRep[] = [];
  @Input("TaxablesTemp") TaxablesTemp: TaxableRep[] = [];
  @Output("_sendTaxablesProdsMasivo") _sendTaxablesProdsMasivo = new EventEmitter<{ProductDetail: Productdetailvalidation []}>();
  
  @ViewChild(ConfirmedSelectionComponent) ConfirmedSelectionComponent: ConfirmedSelectionComponent;
  constructor(private messageService: MessageService,
    private confirmationService: ConfirmationService) { }
  ngOnInit(): void {
    this.indmenu = 0;
    this.items = [{
      label: 'Productos',
      command: (event: any) => {
        this.activeIndex = 0;
        this.messageService.add({ severity: 'info', summary: 'First Step', detail: event.item.label });
      }
    },
    {
      label: 'Imponibles',

    },
    {
      label: 'Imponibles a productos',
    }
    ];
  }

 
  back() {
    if (this.indmenu == this.menuwizardTax.taxables) {
      this.indmenu = this.menuwizardTax.products;
    } else if (this.indmenu == this.menuwizardTax.productsxtaxables) {
      this.indmenu = this.menuwizardTax.taxables;
    }
  }

  Cancel() {
    if (this.indmenu == this.menuwizardTax.products) {
      if (this.selectedProducts.length > 0) {
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: '¿Está seguro que desea cancelar el registro? perderán los cambios realizados.',
          accept: () => {
            this.hidewizard();
          },
        });
      } else {
        this.hidewizard();
      }
    } else if (this.indmenu == this.menuwizardTax.taxables) {
      if (this.selectedProducts.length > 0 || this.TaxablesSelected.length > 0) {
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: '¿Está seguro que desea cancelar el registro? perderán los cambios realizados.',
          accept: () => {
            this.hidewizard();
          },
        });
      } else {
        this.hidewizard();
      }
    } else {
      if (this.TaxablesSelected.length > 0) {
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: '¿Está seguro que desea cancelar el registro? perderán los cambios realizados.',
          accept: () => {
            this.hidewizard();
          },
        });
      } else {
        this.hidewizard();
      }
    }
  }
  hidewizard() {
    this.selectedProducts = [];
    this.TaxablesSelected = [];
   
    this.showDialogWizard = false;
    this.showDialogWizardChange.emit(this.showDialogWizard);
    //this.changeDetector.detectChanges();

  }
  nextPage(){
    debugger
    if (this.indmenu == this.menuwizardTax.products) {
      if (this.selectedProducts.length > 0) {
        this.indmenu = this.menuwizardTax.taxables;
      }else{
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Debe seleccionar al menos un producto." });
      }
    } else if (this.indmenu == this.menuwizardTax.taxables) {
      if (this.TaxablesSelected.length > 0) {
        this.indmenu = this.menuwizardTax.productsxtaxables;
        // if (this.ProdxSuppliersEditTemp.length > 0) {
        //   this.provisional = [];
        //   this.selectedProducts.forEach(products => {

        //     var temp = this.ProdxSuppliersEditTemp.find(x => x.packing.bar == products.bar) ? true : false;
        //     if (temp) {
        //       this.supplierxproduct = this.ProdxSuppliersEditTemp.filter(x => x.packing.bar == products.bar);
        //       //  this.provisional.push(this.supplierxproduct);
        //       if (this.supplierxproduct.length > 0) {
        //         this.supplierxproduct.forEach(prod => {
        //           this.provisional.push(prod);
        //         })
        //       }
        //     }
        //   })
         
        // }

       // this.indmenu = this.menuwizard.productsxsupppliers;
      } else
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Debe seleccionar al menos un Imponible." });
    }
  }

  Save(){
debugger
    this.ConfirmedSelectionComponent.Save();
  }
  sendProdMasivo(data){
   
    debugger;
    this._sendTaxablesProdsMasivo.emit({ProductDetail:data.TaxDetailProd});
    this.hidewizard();
  console.log(data);
  }

}

