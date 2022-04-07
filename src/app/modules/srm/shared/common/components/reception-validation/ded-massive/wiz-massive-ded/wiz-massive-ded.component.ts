import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DeductibleRep } from 'src/app/models/srm/reception/deductible-rep';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { ValidationProduct } from 'src/app/models/srm/validation-product';
import { MenuwizardTaxValidation } from 'src/app/modules/srm/shared/Utils/menuwizardtaxvalidation';
import { SelectionConfirmedComponent } from './selection-confirmed/selection-confirmed.component';

@Component({
  selector: 'app-wiz-massive-ded',
  templateUrl: './wiz-massive-ded.component.html',
  styleUrls: ['./wiz-massive-ded.component.scss']
})
export class WizMassiveDedComponent implements OnInit {

  items: MenuItem[];
  activeIndex: number = 0;
  indmenu: number = 0;
  menuwizardTax: typeof MenuwizardTaxValidation = MenuwizardTaxValidation;
  @Input("showDialogWizard") showDialogWizard: boolean = false;
  @Output() showDialogWizardChange = new EventEmitter<boolean>();
  @Input() Purchase: PurchaseValidation = new PurchaseValidation();
  @Input("Products") Products: ValidationProduct[] = [];
  @Input("selectedProducts") selectedProducts: ValidationProduct[] = [];
  @Input("DeductiblesSelected") DeductiblesSelected: DeductibleRep[] = [];
  @Input("DeductiblesTemp") DeductiblesTemp: DeductibleRep[] = [];

  @ViewChild(SelectionConfirmedComponent) SelectionConfirmedComponent: SelectionConfirmedComponent;
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
      label: 'Deducibles',

    },
    {
      label: 'Deducibles a productos',
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
      if (this.selectedProducts.length > 0 || this.DeductiblesSelected.length > 0) {
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: '¿Está seguro que desea cancelar el registro? perderá los cambios realizados.',
          accept: () => {
            this.hidewizard();
          },
        });
      } else {
        this.hidewizard();
      }
    } else {
      if (this.DeductiblesSelected.length > 0) {
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: '¿Está seguro que desea cancelar el registro? perderá los cambios realizados.',
          accept: () => {
            this.hidewizard();
          },
        });
      } else {
        this.hidewizard();
      }
    }
  }

  nextPage(){
    debugger
    if (this.indmenu == this.menuwizardTax.products) {
      if (this.selectedProducts.length > 0) {
        // if(this.selectedProducts.filter(x=>x.retailPriceBase==0).length==0)
        //     this.indmenu = this.menuwizardTax.deductible;
        //  else
        //  this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Los productos a aplicar descuento deben tener PVP mayor a 0." });
          this.indmenu = this.menuwizardTax.taxables;
      }else{
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Debe seleccionar al menos un producto." });
      }
    } else if (this.indmenu == this.menuwizardTax.taxables) {
      if (this.DeductiblesSelected.length > 0) {
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
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Debe seleccionar al menos un deducible." });
    }
  }


  hidewizard() {
    this.selectedProducts = [];
    this.DeductiblesSelected = [];
   
    this.showDialogWizard = false;
    this.showDialogWizardChange.emit(this.showDialogWizard);
    //this.changeDetector.detectChanges();

  }
  Save(){
    debugger
        this.SelectionConfirmedComponent.Save();
      }
}
