import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Productassociation } from 'src/app/models/masters-mpc/productassociation'
import { ProductassociationService } from '../../shared/services/ProductAssociationService/productassociation.service';
import { ProductassociationFilter } from '../../shared/filters/productassociation-filter';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Validations } from '../../shared/Utils/Validations/Validations';
import { OrderCodes } from '../../shared/Utils/order-codes';

@Component({
  selector: 'app-product-association-panel',
  templateUrl: './product-association-panel.component.html',
  styleUrls: ['./product-association-panel.component.scss']
})
export class ProductAssociationPanelComponent implements OnInit {
  @Input("showDialog") showDialog : boolean = false;
  @Input("_productassociation") _productassociation : Productassociation;
  @Input("filters") filters : ProductassociationFilter;
    submitted: boolean;
    refreshPOT : ProductassociationFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  _initStatus: boolean = true;
  _validations: Validations = new Validations();
  
  constructor(private _productassociationService: ProductassociationService, 
    private messageService: MessageService,
    private confirmationService:ConfirmationService) { }

  ngOnInit(): void {
    if(this._productassociation.id == -1){
      this._productassociation.active = true;
    }else{
      this._initStatus = this._productassociation.active;
    }
  }
  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._productassociation = new Productassociation();
    this._productassociation.active = true;
  }
  saveProductassociation(): void{
    this.submitted = true;
    if(this._productassociation.name.trim()){
      if(!this._productassociation.active && this._initStatus){
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: 'Si inactiva una asociación de producto las configuraciones asociadas\ a esta se dejarán de visualizar, ¿desea proceder con la acción?',
          accept: () => {
            this.save();
          },
        });
      }else{
        this.save();
      }
    }
  }

  save(){
    this._productassociation.id = this._productassociation.id == 0 ? -1 : this._productassociation.id;
    this._productassociation.name = this._productassociation.name.trim();
    this._productassociation.name = this._productassociation.name.toLocaleUpperCase();
   // this._productassociation.name = this._productassociation.name.charAt(0).toLocaleUpperCase() + this._productassociation.name.substr(1).toLowerCase();
    this._productassociationService.postProductassociation(this._productassociation).subscribe((data: number) => {
      if(data > 0) {
        this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
        this.showDialog = false;
        this.showDialogChange.emit(this.showDialog);
        this._productassociation = new Productassociation();
        this._productassociation.active = true;
        this._productassociationService.getProductassociationbyfilter(this.filters, OrderCodes.CreatedDate).subscribe((data: Productassociation[]) => {
          this._productassociationService._ProductassociationList = data;
        });
        this.submitted = false;
      }else if(data == -1){
        this.messageService.add({severity:'error', summary:'Error', detail: "El nombre ya se encuentra registrado"});
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la asociación"});
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la asociación"});
    });
  }

}
