import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-modal-masive-configuration',
  templateUrl: './modal-masive-configuration.component.html',
  styleUrls: ['./modal-masive-configuration.component.scss']
})
export class ModalMasiveConfigurationComponent implements OnInit {
  @Input() visible : boolean = false;
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Output("_AsignMasiveConfiguration") _AsignMasiveConfiguration = new EventEmitter<{ salesFactor : number}>();
  submitted:boolean=false;
  identifierToEdit: number = -1;
  SalesFactor:number=0;
  constructor(private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }


  
  onShowMasiveConfiguration(){
    this.submitted=false;
    this.emitVisible();  
    this.ngOnInit();
    //this.load();   
  }

  onHideMasiveConfiguration()
  {
    this.submitted=false;
    this.emitVisible();
   // this.purchaseFilters=new FilterPurchaseOrderModal();
    //this._Service._PurchaseOrderList=[];
    this.identifierToEdit = -1;
  }

  emitVisible(){
    this.onToggle.emit(this.visible);
  }

  clear(event){
    if (event.target.value == "0,0000" || event.target.value == "0,00") {
      event.target.value = "";
    }
  }


  
  SaveMasive(event)
  {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea asignarle esta configuración a todos los productos?',
     accept: () => {
      
       this._AsignMasiveConfiguration.emit({
       salesFactor:this.SalesFactor
      })
      this.visible=false;
       },
      });
  }
}
