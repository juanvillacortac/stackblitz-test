import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Motives } from 'src/app/models/masters/motives';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesTypeFilters } from 'src/app/models/masters/motives-type-filters';
import { Productsxsupplier } from 'src/app/models/srm/productsxsupplier';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { BarFilter } from '../../../shared/filters/bar-filter';
import { SuppliercatalogFilter } from '../../../shared/filters/suppliercatalog-filter';
import { SuppliercatalogService } from '../../../shared/services/suppliercatalog/suppliercatalog.service';
import { SupplierCatalog } from '../../../shared/view-models/supplier-catalog.viewmodel';

@Component({
  selector: 'app-supplierreason-dialog',
  templateUrl: './supplierreason-dialog.component.html',
  styleUrls: ['./supplierreason-dialog.component.scss']
})
export class SupplierreasonDialogComponent implements OnInit {

  typeReasonList: SelectItem[];
  reasonList:SelectItem[];
  @Input("showDialog") showDialog : boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("_idproductxsupplier") _idproductxsupplier: SupplierCatalog;
  @Input("filters") filters: SuppliercatalogFilter;
  @Output("refreshchange") refreshchange = new EventEmitter<number>();
  
  _supplierxprod: Productsxsupplier = new Productsxsupplier();
  _supplierxprodList: Productsxsupplier[]= [];
  submitted : boolean= false;
  constructor( private _motivesService: MotivesService,
    public _suppliercatalogservice: SuppliercatalogService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getMotivesTypePromise(84);
    if(this._idproductxsupplier.idProductSupplier!=-1){
         this.Search();
    }
  }

  ngOnShow(){
  
  }

  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted=false;
  }
  Search(){
    var filter : BarFilter = new BarFilter(); 
    filter.bar= "";
    filter.id=this._idproductxsupplier.idProductSupplier;
    filter.idComp=1;
    
    this._suppliercatalogservice.getSupplierProductfilter(filter).subscribe((data: Productsxsupplier) => {
      if(data!=null){
        this._supplierxprod = data;
         if(this._supplierxprod.idReasons==0)
              this._supplierxprod.idReasons=-1;
      
      }else{
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "La barra de empaque no esta asociada." });
      }
    }, (error: HttpErrorResponse)=>{
     
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

  getMotivesTypePromise = (idModule: number) => {
   
        var filter = new MotivesFilters();
        filter.idModule = idModule;
        filter.active=1;
        this._motivesService.getMotives(filter).then((data: Motives[]) => {
          data = data.sort((a, b) => a.name.localeCompare(b.name));
          this.reasonList = data.map((item)=>({
            label: item.name,
            value: item.id
          }));
        }, (error: HttpErrorResponse)=>{
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los motivos"});
        });
      //  }

  }
  SaveReasons(){
  
    this._supplierxprodList=[];
      this.submitted=true;
     if(this._supplierxprod.idReasons>0){
         this._supplierxprod.active= false;//this._idproductxsupplier.active;
         this._supplierxprod.description = this._supplierxprod.description == null || this._supplierxprod.description == "" ? "" : this._supplierxprod.description;
         this._supplierxprodList.push(this._supplierxprod);
        this._suppliercatalogservice.postSupplierProduct(this._supplierxprodList).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
           this._supplierxprod = new Productsxsupplier();
          this._suppliercatalogservice.getSupplierCatalogfilter(this.filters).subscribe((data: SupplierCatalog[]) => {
           this._suppliercatalogservice._SupplierCatalogList = data.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime());
           this.submitted=false;
        });   
        }else if (data == -1){
          console.log(data);
          this.messageService.add({severity:'error', summary:'Alerta', detail: "Ha ocurrido un error"});
        
        }else if (data==-2){
          this.messageService.add({severity:'error', summary:'Error', detail: "La referencia del proveedor ya se encuentra asociada a otro empaque."});
        }else{
          console.log(data);
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al cambiar el estatus del proveedor asociado al producto."});
        }
      }, (error: HttpErrorResponse)=>{
        
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error."});
    });
     }
    
     }
  
}
