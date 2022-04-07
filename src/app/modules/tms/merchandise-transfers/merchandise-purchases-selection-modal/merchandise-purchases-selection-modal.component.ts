import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';

@Component({
  selector: 'app-merchandise-purchases-selection-modal',
  templateUrl: './merchandise-purchases-selection-modal.component.html',
  styleUrls: ['./merchandise-purchases-selection-modal.component.scss']
})
export class MerchandisePurchasesSelectionModalComponent implements OnInit {

  loading: boolean = false;
  @Input() visible: boolean = false;
  @Input("showDialog")  showDialog: boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  filters: any;
  statusList: SelectItem[] = [];
  selectedPurchase = [];
  purchasesList = [];

  displayedColumns: ColumnD<any>[] =
  [
    { template: (data) => { return data.id; }, header: 'idProductBranchOfficePacking', display: 'none',field:'id' },
    { template: (data) => { return data.purchaseNumber; }, header: 'Número de la compra', display: 'table-cell',field:'purchaseNumber' },
    { template: (data) => { return data.supplier.name; }, header: 'Proveedor', display: 'table-cell',field: 'supplier.name' }, 
    { template: (data) => { return data.createDate; }, header: 'Fecha', display: 'table-cell',field: 'createDate' }, 
    { template: (data) => { return data.status; }, header: 'Estatus', display: 'table-cell',field: 'status' }, 
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onShow(){
  }

  onHide(){
    this. showDialog = false;
    this.showDialogChange.emit(this. showDialog);
  }

  search()
  {
    /* this.filter.idBranchOffice = 1;
    this.loading = true;
    this.productbranchofficeservice.getProductBranchOfficebyfilter(this.filter).subscribe((data: PackingByBranchOffice[]) => {
      this.productList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    }); */
  }

  addProducts()
  { 
    /* this.showDialogAddProduct = false;
    this.showDialogAddProductChange.emit(this.showDialogAddProduct);
    this.productListChange.emit(this.selectedProduct);
    this.addproductslist.emit(); */
  }

  clearFilters(){
    this.filters.barcode="";
    this.filters.name="";
    this.filters.internalRef="";
    this.filters.existence=-1;
  }

}
