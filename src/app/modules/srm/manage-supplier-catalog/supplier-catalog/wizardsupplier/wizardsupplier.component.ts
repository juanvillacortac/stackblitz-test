import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Supplier } from 'src/app/models/masters/supplier';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { ListproductscomViewmodel } from 'src/app/modules/products/shared/view-models/listproductscom.viewmodel';
import { SupplierFilter } from '../../../shared/filters/supplier-filter';
import { SuppliercatalogService } from '../../../shared/services/suppliercatalog/suppliercatalog.service';
import { SupplierempViewmodel } from '../../../shared/view-models/suppliersemp-viewmodel';

@Component({
  selector: 'app-wizardsupplier',
  templateUrl: './wizardsupplier.component.html',
  styleUrls: ['./wizardsupplier.component.scss']
})
export class WizardsupplierComponent implements OnInit {

  @Input("showDialogwizard") showDialogwizard : boolean = false;
  @Input("suppliers") suppliers: string="";
 @Input("selectedSuppliersList") selectedSuppliersList: any[] = [];
  @Input("selectedProducts") selectedProducts:ListproductscomViewmodel[] = [];
  
  @Output("suppliersChange") suppliersChange = new EventEmitter<string>();
  @Output() showDialogWizardChange = new EventEmitter<boolean>();
  @Output("selectedSuppliersListChange") selectedSuppliersListChange = new EventEmitter<any[]>();


  showFilters : boolean = true;
  load : boolean = false;
  submitted: boolean;
  supplierFilters: SupplierFilter = new SupplierFilter();
  selectedSuppliers : any[] = []; 
  supplierstring: string="";

  displayedColumns:ColumnD<SupplierempViewmodel>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Código',field:'id',display:'none' },
    { template: (data) => { return data.document; }, header: 'Documento',field:'document' ,display: 'table-cell' },
    { template: (data) => { return data.documentType;}, header: 'Tipo', field:'documentType' ,display: 'table-cell' },
    { template: (data) => { return data.socialReason; }, header: 'Razón social',field:'socialReason' ,display: 'table-cell' },
    { template: (data) => { return data.country; }, header: 'País',field:'country' ,display: 'table-cell' },
      { template: (data) => { return data.classification; }, header: 'Clasificación',field:'classification' ,display: 'table-cell' }

  ];
  constructor(public _SupplierService:SuppliercatalogService,private messageService: MessageService,
   private _router: Router,
   private cdref: ChangeDetectorRef,
   private _authservice: AuthService){
  }
  ngOnInit(): void {
    if(this.suppliers==""){
        this.searchproviders();
       
    }else{
      this.selectedSuppliers= this.selectedSuppliersList;
    }
  }

  searchproviders(){
  this.load = true;
  this.supplierFilters.idCom=this._authservice.currentCompany;
  this._SupplierService.getSupplierListclass(this.supplierFilters).subscribe((data: SupplierempViewmodel[]) => {
    this._SupplierService._SupplierClassiList = data;
    this.load = false;
  }, (error: HttpErrorResponse)=>{
    this.load = false;
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los proveedores" });
  });
}
 
submitSuppliers()
  {
      let cont = 0;
      for (let i = 0; i < this.selectedSuppliers.length; i++) {
            cont += 1;
        
            this.supplierstring= this.supplierstring == "" ? this.selectedSuppliers[i].id : this.supplierstring + "," + this.selectedSuppliers[i].id;
         
        }
        //enviar a bd una lista de proveedores para obtener los productos de la empresa a la que pertenecen esos proveedores
        //
        this.suppliers= this.supplierstring;
        this.suppliersChange.emit(this.suppliers);
        this.selectedSuppliersListChange.emit(this.selectedSuppliers);
        
      }
}


