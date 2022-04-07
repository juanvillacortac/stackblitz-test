import { HttpErrorResponse } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Productsxsupplier } from 'src/app/models/srm/productsxsupplier';
import { ProductcomFilter } from 'src/app/modules/products/shared/filters/productcom-filter';
import { ProductService } from 'src/app/modules/products/shared/services/productservice/product.service';
import { ListproductscomViewmodel } from 'src/app/modules/products/shared/view-models/listproductscom.viewmodel';
//import { ProductcomFilter } from '../../../shared/filters/product-filter';

import { SuppliercatalogFilter } from '../../../shared/filters/suppliercatalog-filter';
import { SuppliercatalogService } from '../../../shared/services/suppliercatalog/suppliercatalog.service';
import { Menuwizard } from '../../../shared/Utils/menuwizard';
import { SupplierCatalog } from '../../../shared/view-models/supplier-catalog.viewmodel';


@Component({
  selector: 'app-wizardproductcomp',
  templateUrl: './wizardproductcomp.component.html',
  styleUrls: ['./wizardproductcomp.component.scss']
})
export class WizardproductcompComponent implements OnInit {
  items: MenuItem[];
  activeIndex: number = 0;
  indmenu: number = 0;
  menuwizard: typeof Menuwizard = Menuwizard;
  supplierxproduct: Productsxsupplier[] = [];
  provisional: Productsxsupplier[] = [];
  @Input("filtersprod") filtersprod: ProductcomFilter = new ProductcomFilter();
  @Input("suppliers") suppliers: string = "";
  @Input("filters") filters: SuppliercatalogFilter = new SuppliercatalogFilter();
  @Input("selectedSuppliersList") selectedSuppliersList: any[] = [];
  //@Input("selectedSuppliersList") selectedSuppliersList: SupplierempViewmodel[] = [];
  //@Input("selectedProducts") selectedProducts:any[] = [];
  @Input("selectedProducts") selectedProducts: ListproductscomViewmodel[] = [];
  @Input("selectedProdxSuppliersTemp") selectedProdxSuppliersTemp: Productsxsupplier[] = [];
  @Input("ProdxSuppliersEditTemp") ProdxSuppliersEditTemp: Productsxsupplier[] = [];
  @Output("ProdxSuppliersEditTempChange") ProdxSuppliersEditTempChange = new EventEmitter<Productsxsupplier[]>();

  product: boolean = false;
  @Input("showDialogWizard") showDialogWizard: boolean = false;
  @Output() showDialogWizardChange = new EventEmitter<boolean>();
  constructor(private _suppliercatalogservice: SuppliercatalogService,
    private changeDetector: ChangeDetectorRef,
    private cdref: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public _productservice: ProductService) { }

  ngOnInit(): void {
    this.indmenu = 0;
    this.items = [{
      label: 'Proveedores',
      command: (event: any) => {
        this.activeIndex = 0;
        this.messageService.add({ severity: 'info', summary: 'First Step', detail: event.item.label });
      }
    },
    {
      label: 'Productos',

    },
    {
      label: 'Productos por proveedores',
    }
    ];
  }

  Cancel() {
    if (this.indmenu == this.menuwizard.suppliers) {
      if (this.selectedSuppliersList.length > 0) {
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
    } else if (this.indmenu == this.menuwizard.products) {
      if (this.selectedProducts.length > 0 || this.selectedSuppliersList.length > 0) {
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
      if (this.selectedProdxSuppliersTemp.length > 0 || this.selectedProducts.length > 0) {
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
    this.selectedSuppliersList = [];
    this.selectedProducts = [];
    this.suppliers = "";
    this.selectedProdxSuppliersTemp = [];
    this.ProdxSuppliersEditTemp = [];
    this.indmenu = -1;
    this.filtersprod.companyId = -1;
    this.filtersprod.idProduct = -1;
    this.filtersprod.barcode = "";
    this.filtersprod.name = "";
    this.filtersprod.categoryId = "";
    this.filtersprod.internalRef = "";
    this.filtersprod.classificationId = -1;
    this.filtersprod.indHeavy = -2;
    this.filtersprod.idTypePacking = -2;
    this.filtersprod.userId = -1;
    this.filtersprod.brandId = "";
     this._productservice._Productscom=[];
    this.showDialogWizard = false;
    this.showDialogWizardChange.emit(this.showDialogWizard);
    //this.changeDetector.detectChanges();

  }
  nextPage() {
    if (this.indmenu == this.menuwizard.suppliers) {
      if (this.selectedSuppliersList.length > 0) //this.suppliers!= "" 
        this.indmenu = this.menuwizard.products;
      else
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Debe seleccionar al menos un proveedor." });

    } else if (this.indmenu == this.menuwizard.products) {
      if (this.selectedProducts.length > 0) {
        if (this.ProdxSuppliersEditTemp.length > 0) {
          this.provisional = [];
          this.selectedProducts.forEach(products => {

            var temp = this.ProdxSuppliersEditTemp.find(x => x.packing.bar == products.bar) ? true : false;
            if (temp) {
              this.supplierxproduct = this.ProdxSuppliersEditTemp.filter(x => x.packing.bar == products.bar);
              //  this.provisional.push(this.supplierxproduct);
              if (this.supplierxproduct.length > 0) {
                this.supplierxproduct.forEach(prod => {
                  this.provisional.push(prod);
                })
              }
            }


            //this.ProdxSuppliersEditTemp =this.ProdxSuppliersEditTemp.filter(x => x.packing.bar == products.bar)
          })
          if (this.provisional.length > 0) {
            this.ProdxSuppliersEditTempChange.emit(this.provisional);
          }
        }

        this.indmenu = this.menuwizard.productsxsupppliers;
      } else
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Debe seleccionar al menos un producto." });
    }
  }

  back() {
    if (this.indmenu == this.menuwizard.products) {
      this.indmenu = this.menuwizard.suppliers;
    } else if (this.indmenu == this.menuwizard.productsxsupppliers) {
      this.indmenu = this.menuwizard.products;
    }
  }

  Save() {
    if (this.selectedProdxSuppliersTemp.length > 0) {

      this.selectedProdxSuppliersTemp.forEach(prod => {
        prod.available = prod.available == null ? 0 : prod.available;
        prod.conversionCost = prod.conversionCost == null ? 0 : prod.conversionCost;
        prod.baseCost = prod.baseCost == null ? 0 : prod.baseCost;
      });
      this._suppliercatalogservice.postSupplierProduct(this.selectedProdxSuppliersTemp).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.showDialogWizard = false;
          this.showDialogWizardChange.emit(this.showDialogWizard);

          this._suppliercatalogservice.getSupplierCatalogfilter(this.filters).subscribe((data: SupplierCatalog[]) => {
            this._suppliercatalogservice._SupplierCatalogList = data.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime());

          });
        } else if (data == -1) {
          console.log(data);
          this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "El  proveedor  ya  esta asignado al producto." });


        } else if (data == -2) {
          console.log(data);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La referencia del proveedor ya se encuentra asociada a otro empaque." });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el proveedor asociado al producto." });
        }
      }, (error: HttpErrorResponse) => {

        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el proveedor asociado al producto." });
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Debe seleccionar al menos un registro." });

    }
  }
}