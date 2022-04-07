import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { classification } from 'src/app/models/masters-mpc/classification'
import { MessageService, SelectItem } from 'primeng/api';
import { ClassificationFilter } from '../../shared/filters/classification-filter';
import { ClassificationService } from '../../shared/services/ClassificationService/classification.service';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'classification-dialog',
  templateUrl: './classification-dialog.component.html',
  styleUrls: ['./classification-dialog.component.scss']
})
export class ClassificationDialogComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_classification") _classification: classification;
  @Input("filters") filters: ClassificationFilter;
  @Input("_classificationId") _classificationId: ClassificationFilter;
  status: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  submitted: boolean;
  refreshclassification: ClassificationFilter;
  _initStatus: boolean = true;
  _validations: Validations = new Validations();

  @Output() showDialogChange = new EventEmitter<boolean>();

  constructor(private _classificationservice: ClassificationService, private messageService: MessageService) { }
  //private readonly USER_STATE = '_USER_STATE';
  ngOnInit(): void {
    this._classification.active = true;
    this.onLoadclassification();
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._classification = new classification();
    this._classification.active = true;
    this._classificationId = new ClassificationFilter();
  }

  saveClassification(): void {
    debugger
    this.submitted = true;
    if (this._classification.name.trim() && this._classification.name.trim().toLocaleUpperCase() !== this._classification.abbreviation.trim()  ) {
      this._classification.id == 0 ? -1 : this._classification.id;
      this._classification.name = this._classification.name.trim();
      this._classification.name = this._classification.name.toLocaleUpperCase();
     //  this._classification.name = this._classification.name.charAt(0).toLocaleUpperCase() + this._classification.name.substr(1).toLowerCase();
          this._classificationservice.postclassification(this._classification).subscribe((data: number) => {
            if (data > 0) {
              this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
              this.showDialog = false;
              this.showDialogChange.emit(this.showDialog);
              this._classification = new classification();
              this._classification.name = "";
              this._classification.active = true;
              this._classificationservice.getClassificationbyfilter(this.filters).subscribe((data: classification[]) => {
                this._classificationservice._classificationList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

              });
              this.submitted = false;
            }else if (data == -1){
              this.messageService.add({severity:'error', summary:'Alerta', detail: "El nombre ya se encuentra registrado."});
            }else if(data == -2){
              this.messageService.add({severity:'error', summary:'Alerta', detail: "La abreviatura ya se encuentra registrada."});
            }else if(data == -3){
              this.messageService.add({severity:'error', summary:'Alerta', detail: "No se puede inactivar esta clasificación, debido a que tiene productos asociados"});
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la clasificación."});
            }
          }, (error: HttpErrorResponse)=>{
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la clasificación."});
        });
    }
}
  onLoadclassification() {
    if (this._classificationId.id != -1) {
      this._classificationservice.getClassificationbyfilter(this._classificationId).subscribe((data: classification[]) => {
        this._classification = data[0];
        this._classification.active = this._classification.active == true ? true : false;
        this._initStatus = this._classification.active;
      })
    }
  }

}
