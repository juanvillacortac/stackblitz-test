import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SupplierClasificationFilter } from '../shared/filters/supplier-clasification-filter';
import { SupplierclasificationService } from '../shared/services/supplierclasification.service';

@Component({
  selector: 'app-supplier-clasification-panel',
  templateUrl: './supplier-clasification-panel.component.html',
  styleUrls: ['./supplier-clasification-panel.component.scss']
})
export class SupplierClasificationPanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("supplierclasification") supplierclasification : SupplierClasification;
  @Input("filters") filters : SupplierClasificationFilter;
    submitted: boolean;
    refreshPOT : SupplierClasificationFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  _initStatus: boolean = true;
  _validations: Validations = new Validations();
  
  constructor(private confirmationService:ConfirmationService,
    private supplierClasificationService: SupplierclasificationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    if(this.supplierclasification.id <= 0){
      this.supplierclasification.active = true;
    }else{
      this._initStatus = this.supplierclasification.active;
    }
  }

  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this.supplierclasification = new SupplierClasification();
    this.supplierclasification.active = true;
  }
  saveProductorigintype(): void{
    this.submitted = true;
    if(this.supplierclasification.supplierclasification.trim()){
      if(!this.supplierclasification.active && this._initStatus){
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: 'Si inactiva un tipo de origen de producto las configuraciones asociadas\ a este se dejarán de visualizar, ¿desea proceder con la acción?',
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
    this.supplierclasification.id = this.supplierclasification.id == 0 ? -1 : this.supplierclasification.id;
    this.supplierclasification.supplierclasification = this.supplierclasification.supplierclasification.trim();
    //this.supplierclasification.supplierclasification = this.supplierclasification.supplierclasification.charAt(0).toLocaleUpperCase() + this.supplierclasification.supplierclasification.substr(1).toLowerCase();
    this.supplierClasificationService.postSupplierClasification(this.supplierclasification).subscribe((data: number) => {
      if(data > 0) {
        this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
        this.showDialog = false;
        this.showDialogChange.emit(this.showDialog);
        this.supplierclasification = new SupplierClasification();
        this.supplierclasification.active = true;
        this.supplierClasificationService.getSupplierClasificationList(this.filters).subscribe((data: SupplierClasification[]) => {
          this.supplierClasificationService.supplierClafisicationList = data.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
        });
        this.submitted = false;
      }else if(data == -1){
        this.messageService.add({severity:'error', summary:'Error', detail: "El nombre ya se encuentra registrado."});
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la clasificación del proveedor"});
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la clasificación del proveedor"});
    });
  }
}
