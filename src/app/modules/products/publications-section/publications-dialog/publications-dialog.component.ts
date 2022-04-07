import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DescriptionType } from 'src/app/models/masters-mpc/description-type'
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { PublicationService } from  '../../shared/services/publicationservice/publication.service';
import { Validations } from '../../../masters-mpc/shared/Utils/Validations/Validations';
import { Publication } from 'src/app/models/products/publication';
import { InsertTypeFilter } from 'src/app/modules/masters-mpc/shared/filters/insert-type-filter';
import { InsertTypeService } from 'src/app/modules/masters-mpc/shared/services/InsertTypeService/insert-type.service';
import { PublicationFilter } from '../../shared/filters/publication-filter';
//import { element } from 'protractor';

@Component({
  selector: 'publications-dialog',
  templateUrl: './publications-dialog.component.html',
  styleUrls: ['./publications-dialog.component.scss']
})
export class PublicationsDialogComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_publication") _publication: Publication;
  @Input("filters") filters: PublicationFilter;
  @Input("_publicationId") _publicationId: PublicationFilter;
  @Input("idproduct") idproduct: number= 0;
  @Input("activeReg") activeReg: boolean= false;
  status: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  submitted: boolean;
  refreshclassification: Publication;
_validations: Validations = new Validations();

inserttypelist: SelectItem[];

  @Output() showDialogChange = new EventEmitter<boolean>();

  constructor(private _publicationservice: PublicationService, private messageService: MessageService,
    private _inserttypeservice: InsertTypeService, private confirmationService: ConfirmationService) { }
  //private readonly USER_STATE = '_USER_STATE';
  ngOnInit(): void {
    if(this._publication.id == 0 || this._publication.id == -1)
         this._publication.active = true;
    
    this.onLoadPublication();
    this.onLoadInserttype();
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._publication = new Publication();
    this._publication.active = true;
    this._publicationId = new PublicationFilter();
  }

  savePublication(): void {
    this.submitted = true;
  
    if (this._publication.name.trim() && this._publication.page >=1 && this._publication.insertId>=1) {
      this._publication.id == 0 ? -1 : this._publication.id;
      this._publication.name = this._publication.name.trim();
      // this._publication.name = this._publication.name.charAt(0).toLocaleUpperCase() + this._publication.name.substr(1).toLowerCase();
        if(this._publication.active || !this.activeReg){
            this.submit();
        }else if(this.activeReg && this._publication.active==false){
          this.confirmationService.confirm({
           header: 'Confirmación',
           icon: 'pi pi-exclamation-triangle',
            message: 'Si inactiva la publicación las configuraciones asociadas\ a esta se dejarán de visualizar, ¿desea proceder con la acción?',
            accept: () => {
               this.submit();
              },
              });
           }
         
    }
}
submit(){

  this._publicationservice.postPublications(this._publication, parseInt(this.idproduct.toString())).subscribe((data: number) => {
    if (data > 0) {
      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
      this.showDialog = false;
      this.showDialogChange.emit(this.showDialog);
      this._publication = new Publication();
      this._publication.name = "";
      this._publication.active = true;
      this._publicationservice.getPublications(this.filters).subscribe((data: Publication[]) => {
        this._publicationservice._publicationList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

      });
      this.submitted = false;    
    }else if (data == -1){
      this.messageService.add({severity:'error', summary:'Alerta', detail: "La publicación ya existe para este producto."});
    
    }else if (data == -2){
      this.messageService.add({severity:'error', summary:'Alerta', detail: "El tipo de encarte ya existe para este producto."});
   
    }else{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la publicación."});
    }
  }, (error: HttpErrorResponse)=>{
    
    this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la publicación."});
});
}
onLoadPublication() {
  // debugger;
    if (this._publicationId.id != -1) {
        //this.filters.id=this.idproduct;
        
        this._publicationservice.getPublications(this._publicationId).subscribe((data: Publication[] ) => {
          this._publication =  data[0];
          if(!this.inserttypelist.find(element=> element.value == this._publication.insertId)){
                 this._publication.insertId=0;
          }
        this._publication.active = this._publication.active == true ? true : false;
      })
    }
  }

  onLoadInserttype(){
    var filter: InsertTypeFilter = new InsertTypeFilter()
    filter.active = 1;
    this._inserttypeservice.getInsertTypebyfilter(filter)
    .subscribe((data)=>{
      data=data.sort((a, b) => a.name.localeCompare(b.name));
      this.inserttypelist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
      console.log(this.inserttypelist);
    },(error)=>{
      console.log(error);
    });
  }
   
}
