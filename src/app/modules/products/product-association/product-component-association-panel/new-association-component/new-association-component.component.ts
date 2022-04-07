import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { Typeofparts } from 'src/app/models/masters-mpc/typeofparts';
import { TypeofpartsFilter } from 'src/app/modules/masters-mpc/shared/filters/typeofparts-filter';
import { TypeofpartsService } from 'src/app/modules/masters-mpc/shared/services/TypeofPartsService/typeofparts.service';
import { ProductAssociationComponentViewModel } from '../../../shared/view-models/productassociationcomponent.viewmodel';

@Component({
  selector: 'app-new-association-component',
  templateUrl: './new-association-component.component.html',
  styleUrls: ['./new-association-component.component.scss']
})
export class NewAssociationComponentComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input("productComponent") productComponent : ProductAssociationComponentViewModel;

  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() productComponentChange = new EventEmitter<ProductAssociationComponentViewModel>();
  @Output("addproductcomponent") addproductcomponent = new EventEmitter();

  PartsTypeList: SelectItem[];
  submitted: boolean;
  saving: boolean = false;
  
  constructor(private typeofpartsservice: TypeofpartsService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.searchPartTypes();
  }

  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  searchPartTypes(){
    var filters = new TypeofpartsFilter();
    filters.active = 1;
    this.typeofpartsservice.getTypeofpartsbyfilter(filters).subscribe((data: Typeofparts[]) => {
      data = data.filter(x => x.id != 0);
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.PartsTypeList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipo de partes"});
    });
  }

  AddProductComponent(){
    this.saving = true;
    this.submitted = true;
    if (this.productComponent.partsType.id > 0 && this.productComponent.amount > 0) {
      this.productComponent.partsType.name = this.PartsTypeList.find(x => x.value == this.productComponent.partsType.id).label;
      this.showDialog = false;
      this.saving = false;
      this.showDialogChange.emit(this.showDialog);
      this.productComponentChange.emit(this.productComponent)
      this.addproductcomponent.emit();
    }else{
      this.saving = false;
    }
  }
}
