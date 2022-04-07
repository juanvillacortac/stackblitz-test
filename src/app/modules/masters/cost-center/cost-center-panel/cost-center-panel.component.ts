import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CostCenter } from '../../../../models/masters/cost-center';
import { CostCenterFilters } from '../shared/filters/cost-center-filters';
import { StaticDataService } from '../../../shared/common-directive/services/static-data.service';
import { MessageService, SelectItem } from 'primeng/api';
import { CostCenterService } from '../shared/services/cost-center.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debug } from 'console';
import { Validations } from '../../../financial/shared/Utils/Validations/Validations';
import {KeyFilterModule} from 'primeng/keyfilter';
@Component({
  selector: 'app-cost-center-panel',
  templateUrl: './cost-center-panel.component.html',
  styleUrls: ['./cost-center-panel.component.scss']
})
export class CostCenterPanelComponent implements OnInit {
  statuslist: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];
  //registerForm: FormGroup;
  _validations: Validations = new Validations();

  constructor(public messageService: MessageService,private router: Router, private formBuilder: FormBuilder,private staticDataService: StaticDataService, private costCenterService: CostCenterService) { 
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }
  noneSpecialCharacters:RegExp =/^[a-zA-Z0-9äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/
  @Input("showDialog") showDialog: boolean = true;
  @Input("_data") _data = new CostCenter();
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter();
  //@Input("filters") filters: CostCenterFilters;
  loading = false;  
  submitted: boolean;
  saving : boolean;
  nomString = false;

  // ngOnInit(): void {
    
  //   this.submitted = false;
  //   this.status = this.staticDataService.getEstatusList(); 
  // }


  onBlurEvent(event: any) {
    debugger
     if (event.target.value=="" || event.target.value==" ") {
       this.nomString = true;
     }
     else {
       this.nomString = false;
     }   
   }
   ngOnInit(): void {
     this.saving = false
     this.submitted = false;
 
     if(this._data.id<=0)
      this._data.active=true
 
   
   }
  // ngOnChanges(changes: SimpleChanges){
  //   debugger
  //   if(changes.model){
  //     var id : number = (changes.model.currentValue as CostCenter).id;
  //     if(id > 0){
  //       this.loading = true;
  //       this.costCenterService.getCentersCostsList({
  //         id: id,
  //         active: -1,
  //         name: ""
  //       }).subscribe((data)=>{
  //         if(data.length > 0){
  //           this.model = data[0];
  //           this.initFormValidations();
  //         }else{
  //           this.showDialogChange.emit(true);
  //         }
  //       },(error)=>{
  //         this.showDialogChange.emit(false);
  //       },()=>{
  //         this.loading = false;
  //       })
  //     }else{
  //       this.model.active = true;
  //       this.initFormValidations();
  //     }
  //   }
  // }

  // initFormValidations(){
  //   this.registerForm = this.formBuilder.group(
  //     {
  //       name: [this.model.name, Validators.required],
  //       active: [this.model.active],
  //       id: [this.model.id]
  //     }
  //   );
  // }


  isNan(value: any): boolean {
    if (value != "") {
      if (isNaN(+value))
        return true;
      else
        return false
    }
    else
      return true;
  }


  
  save(): void {
    debugger
    
    this.submitted = true;
    if (this._data.name != "" && this._data.name.trim()) {
      this.messageService.clear();
      this.saving = true
      this.costCenterService.postPort(this._data).subscribe((data) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
          this.submitted = false;
          this.saving = false;
          this.onSave.emit();
        } else if (data == -1) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
          this.saving = false;
        }
        else if (data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
        }
        //window.location.reload();
      }, () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      });
      
    }
    
    //this.saving = false;
  }


  // save(){
  //   this.submitted = true; 
  //   debugger
  //   if (this.isNan(this.model.name.trim())) {
      
   
  //   if(this.registerForm.valid){
  //     this.loading = true;
  //     debugger
  //     this.costCenterService.postPort(this.model).subscribe((data)=>{
  //       if(data > 0){
  //     this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
  //         this.showDialogChange.emit(false);
  //         this.onSave.emit(data);
  //       }else{
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Error guardando el registro" });
  //       }
  //     },(error)=>{
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
  //         this.loading = false;
  //     },() => {
  //       this.loading = false;
  //       this.clear();
  //     });
  //   }
  //   }
  // }

  // clear(){
  //   this.model = {
  //     active: true,
  //     id: -1,
  //     createdByUser: "",
  //     name: "",
  //     updatedByUser: "",
  //     createdByUserId:-1 ,
  //   updatedByUserId:-1 
  //   };
  //   this.initFormValidations();
  //   this.submitted = false;
  // }

  
  onHide(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this.nomString = false;
    this._data.id = -1;
    this._data.name =" ";
    this._data.active = true
   
  }

  // Form validations

  // get name(){
  //   return this.registerForm.get("name");
  // }
}
