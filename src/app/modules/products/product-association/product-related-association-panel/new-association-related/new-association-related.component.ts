import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Productassociation } from 'src/app/models/masters-mpc/productassociation';
import { ProductassociationFilter } from 'src/app/modules/masters-mpc/shared/filters/productassociation-filter';
import { ProductassociationService } from 'src/app/modules/masters-mpc/shared/services/ProductAssociationService/productassociation.service';
import { ProductAssociationRelatedViewModel } from '../../../shared/view-models/productassociationrelated.viewmodel';

@Component({
  selector: 'app-new-association-related',
  templateUrl: './new-association-related.component.html',
  styleUrls: ['./new-association-related.component.scss']
})
export class NewAssociationRelatedComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input("productAssociation") productAssociation: ProductAssociationRelatedViewModel;

  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() productAssociationChange = new EventEmitter<ProductAssociationRelatedViewModel>();
  @Output() addproductassociation = new EventEmitter();

  submitted: boolean = false;
  productAssociationList: SelectItem[];
  saving: boolean = false;
  
  constructor(private productAssociationService: ProductassociationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.searchProductAssociation();
  }

  searchProductAssociation(){
    var filters = new ProductassociationFilter();
    filters.active = 1;
    this.productAssociationService.getProductassociationbyfilter(filters).subscribe((data: Productassociation[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      data = data.filter(x => x.id != 1 && x.id != 2);
      this.productAssociationList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las asociaciones de los productos"});
    });
  }

  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  AddProductAssociation(){
    this.saving = true;
    this.submitted = true;
    if (this.productAssociation.relation.id > 0) {
      this.productAssociation.relation.name = this.productAssociationList.find(x => x.value == this.productAssociation.relation.id).label;
      this.saving = false;
      this.showDialog = false;
      this.showDialogChange.emit(this.showDialog);
      this.productAssociationChange.emit(this.productAssociation)
      this.addproductassociation.emit();
    }else{
      this.saving = false;
    }
  }
}
