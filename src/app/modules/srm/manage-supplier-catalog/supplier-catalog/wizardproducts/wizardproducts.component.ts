import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output , ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Productsprovider } from 'src/app/models/srm/productsprovider';
import { Productsxsupplier } from 'src/app/models/srm/productsxsupplier';
import { DefeatImage } from 'src/app/modules/common/image/defeatimage';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { ProductcomFilter } from 'src/app/modules/products/shared/filters/productcom-filter';
import { ProductService } from 'src/app/modules/products/shared/services/productservice/product.service';
import { ListproductscomViewmodel } from 'src/app/modules/products/shared/view-models/listproductscom.viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { SuppliercatalogService } from '../../../shared/services/suppliercatalog/suppliercatalog.service';
import { ListproductsViewmodel } from '../../../shared/view-models/listproducts-viewmodel';
import { SupplierempViewmodel } from '../../../shared/view-models/suppliersemp-viewmodel';

@Component({
  selector: 'app-wizardproducts',
  templateUrl: './wizardproducts.component.html',
  styleUrls: ['./wizardproducts.component.scss']
})
export class WizardproductsComponent implements OnInit {
  loading: boolean = false;
  submitted: boolean;
  // productFilter: ProductcomFilter = new ProductcomFilter();
  _productsproviders: ListproductscomViewmodel[] = [];
  selectedSuppliers: any[] = [];
  @Input("visible") visible: boolean = false;
  @Input("suppliers") suppliers: string = "";
  @Input("selectedSuppliersList") selectedSuppliersList: any[] = [];
  // @Input("selectedSuppliersList") selectedSuppliersList: SupplierempViewmodel[] = [];
  @Input("filtersprod") filtersprod: ProductcomFilter = new ProductcomFilter();
  @Input("selectedProducts") selectedProducts: any[] = [];
  @Input("selectedProdxSuppliersTemp") selectedProdxSuppliersTemp: Productsxsupplier[] = [];

  @Output("selectedProductsChange") selectedProductsChange = new EventEmitter<any[]>();

  @ViewChild('dt', { static: false }) dt: any
  id: string = "";
  permissionsIDs = { ...Permissions };
  defectImage: DefeatImage=new DefeatImage()
  selectedProductsCom: ListproductscomViewmodel[] = [];
  displayedColumns: ColumnD<ListproductscomViewmodel>[] =
    [
      { template: (data) => { return data.idSupplier; }, header: 'Id', field: 'idSupplier', display: 'none' },
      { template: (data) => { return data.name; }, field: 'name', header: 'Nombre', display: 'table-cell' },
      { template: (data) => { return data.typackaging; }, field: 'typackaging', header: 'Tipo de empaque', display: 'table-cell' },
      { template: (data) => { return data.presentationPackage; }, field: 'presentationPackage', header: 'Empaque', display: 'table-cell' },
      { template: (data) => { return data.bar; }, field: 'bar', header: 'Barra', display: 'table-cell' },
      { template: (data) => { return data.heavy == true ? "Pesado" : "No pesado"; }, field: 'heavy', header: 'Ind. pesado', display: 'table-cell' },
      { template: (data) => { return data.classification; }, field: 'classification', header: 'Clasificación', display: 'table-cell' },
      { template: (data) => { return data.numberUnist; }, field: 'unitsPackage', header: 'Unidades por empaque', display: 'table-cell' },
      //  {template: (data) => { return data.presentationPackage; },field: 'presentationPackage', header: 'Presentación de empaque', display: 'table-cell'},

      //  {template: (data) => { return data.dateCreate == undefined ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy"); },field: 'dateCreate', header: 'Fecha creación', display: 'table-cell'},
      //  {template: (data) => { return data.dateUpdate == undefined ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy"); },field: 'dateUpdate', header: 'Fecha actualización', display: 'table-cell'}
    ];

  constructor(public _suppliercatalogservice: SuppliercatalogService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private activatedRoute: ActivatedRoute,
    private _router: Router,
    public _productservice: ProductService,
    private _authservice: AuthService) { }

  ngOnInit(): void {
    if (this.selectedProducts.length <= 0) {
      // this.filtersprod.indHeavy= 0;
      // this.filtersprod.idTypePacking= 1;
      //this.searchprod();
    } else {
      this.selectedProductsCom = this.selectedProducts;
    }
    if (this.dt != undefined) {
      this.dt.reset();
    }
  }


  searchprod() {
    this.loading = true;
    this.filtersprod.companyId = this._authservice.currentCompany;
    this._productservice.getProductsCompany(this.filtersprod).subscribe((data: ListproductscomViewmodel[]) => {
      this._productservice._Productscom = data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });

  }

  cancelar() {
    this._router.navigate(['wizardsupplier/suppliers']);

  }

  nextPage() {
    if (this.selectedProducts != null) {
      console.log(this.selectedProducts);
    }
    this._router.navigate(['wizardsupplier/productsupplier', 1]);
  }

  CheckProducts() {
    //enviar a bd una lista de proveedores para obtener los productos de la empresa a la que pertenecen esos proveedores
    this.selectedProducts = this.selectedProductsCom;
    this.selectedProductsChange.emit(this.selectedProducts);

  }
  onRemoveSelection() {
    this.selectedProducts = [];
    this.selectedProductsCom = [];
    this.selectedProductsChange.emit(this.selectedProducts);
  }
}
