import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FamilyBurden } from '../../../shared/models/laborRelationship/family-burden';
import { KinshipFilter } from '../../../../../models/masters/kinship-filter';
import { Kinship } from '../../../../../models/masters/kinship';
import { KinshipService } from '../../../../masters/kinship/shared/kinship.service';
import { SelectItem } from 'primeng/api';
import { DocumentTypeService } from '../../../../masters/document-types/shared/services/document-type.service';
import { DocumentTypeFilter } from '../../../../../models/masters/document-type-filters';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';

@Component({
  selector: 'app-famili-burden-panel',
  templateUrl: './famili-burden-panel.component.html',
  styleUrls: ['./famili-burden-panel.component.scss'],
  providers: [DatePipe]
})
export class FamiliBurdenPanelComponent implements OnInit {

  @Input() record: FamilyBurden;
  @Input() genderList: any[];
  @Input() showSidebar: boolean;
  @Output() backUnChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() recordSave: EventEmitter<FamilyBurden> = new EventEmitter<FamilyBurden>();

  
  submitted: boolean = false;
  kinshipFilter: KinshipFilter = new KinshipFilter();
  _kinshipList: Kinship[] = [];
  _kinshipDropdown: SelectItem[] = [];
  documentTypeFilter: DocumentTypeFilter = new DocumentTypeFilter();
  _entityTypeDropdown: SelectItem[] = [];
  registrationDate: Date;
  birthDate: Date;
  isEdit: boolean = false;
  active: number;
  _validations:Validations = new Validations();
  genderText: string = "";
  registrationDateText: string = "";
  birthDateText: string = "";
  testDate1: Date = new Date();
  genderDropdown: SelectItem[] = [];
  yearRange: string;

  status: SelectItem[] = [
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 2}
  ];

  
  
  constructor(private _kinshipService: KinshipService,private _entityTypeService: DocumentTypeService, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.onLoadKinships();
    this.onLoadDocumentType();
    this.onLoadGender();
    this.initializedValues();
    this.yearRange = `${new Date().getFullYear() - 120}:${new Date().getFullYear()}`;

    //this.testDate2.
  }

  outForm(){  //se pasa el control al componente padre, indicando que no hubieron cambios (crear o editar)
    this.backUnChanged.emit(false); 
  }

  submit(){
    var error = false;
    var dia = this.testDate1.getTime();
    if(this.record.firstName == "" || this.record.lastName == "" || this.record.idKinship == -1
    || this.record.idDocumentType == -1|| this.record.documentNumber == ""){
      error = true;
    }

    
    if(this.record.gender == ""){
      this.genderText = "El género es requerido"
      error = true;
    }else{
      if(this.record.gender != "M" && this.record.gender != "F" && this.record.gender != "m" && this.record.gender != "f"){
        this.genderText = "El género no es válido (M/F)"
        error = true;
      }
    }

    

    if(this.birthDate == null){
      this.birthDateText = ""
      this.birthDateText = "La fecha de nacimiento es requerida"
      error = true;
    }else{
       if(Date.parse(this.birthDate.toString()) > dia){
         this.birthDateText = ""
         this.birthDateText = "Debe ingresar una fecha menor o igual a la actual"
         error = true;
       }
    }
    
    // if(this.registrationDate == null){
    //   this.registrationDateText = ""
    //   this.registrationDateText = "La fecha de registro es requerida"
    //   error = true;
    // }else{
    //    if(Date.parse(this.registrationDate.toString()) > dia){
    //      this.registrationDateText = ""
    //      this.registrationDateText = "Debe ingresar una fecha menor o igual a la actual"
    //      error = true;
    //    }
    // }

     if(this.registrationDate != null && this.birthDate != null && Date.parse(this.birthDate.toString()) > Date.parse(this.registrationDate.toString())){
         this.birthDateText = ""  
         this.birthDateText = "La fecha de nacimiento debe ser menor a la fecha de registro"
         error = true;
     }

    if(error){
      this.submitted = true;
      document.getElementById("Agregar").removeAttribute("disabled");
    }else{
      this.record.registrationDate = this.datepipe.transform(this.registrationDate,'yyyy-MM-dd');
      this.record.birthDate = this.datepipe.transform(this.birthDate,'yyyy-MM-dd');
      this.record.active = this.active == 1? true: false;
      this.recordSave.emit(this.record);
    }
  }

  onLoadKinships(){
    this._kinshipService.getKinshipList(this.kinshipFilter).subscribe((list) => {
      this._kinshipList = list;
      this._kinshipDropdown = this._kinshipList.sort((a, b) => a.kinshipName.localeCompare(b.idKinship.toString())).map<SelectItem>((item) =>({
        label: item.kinshipName,     
        value: item.idKinship
      }));
    });
  }

  onLoadDocumentType(){
    this.documentTypeFilter.active = 1;
    this.documentTypeFilter.idEntityType = 1;
    this._entityTypeService.getdocumentTypeList(this.documentTypeFilter).subscribe((data) =>{
      var aux = data;
      this._entityTypeDropdown = aux.sort((a, b) => a.identifier .localeCompare(b.id.toString())).map<SelectItem>((item)=>({
         label: item.identifier,     
          value: item.id
       }));
    })
  }

  onLoadGender(){
    this.genderDropdown = this.genderList.sort((a, b) => a.name .localeCompare(b.value.toString())).map<SelectItem>((item)=>({
      label: item.name,     
      value: item.value
    }));
  }

  initializedValues(){
    if(this.record.idFamilyBurden == -1){
      this.birthDate = null;
      this.registrationDate = new Date();
      this.isEdit = false;
      this.active = 1;
    }else{
      this.birthDate= new Date(this.record.birthDate);
      this.birthDate.setMinutes(this.birthDate.getMinutes() + this.birthDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
      this.registrationDate= new Date(this.record.registrationDate);
      this.isEdit = true;
      this.active = this.record.active ? 1 : 2;
    }
  }

  dateSelected(ind: number){
    var dia = this.testDate1.getTime();
    var error = false;
    //debugger;
    if(ind == 1){
      if(Date.parse(this.birthDate.toString()) > dia){
        this.birthDateText = "";
        this.birthDateText = "Debe ingresar una fecha menor o igual a la actual";
        error = true;
      }else{
        if(this.registrationDate != null){
          if(Date.parse(this.birthDate.toString()) > Date.parse(this.registrationDate.toString())){
            this.birthDateText = "La fecha de nacimiento debe ser menor a la fecha de registro";
          }else{
            this.birthDateText = "";
          }
        }else{
          this.birthDateText = "";
        }
      }
    }else{
      // if(Date.parse(this.registrationDate.toString()) > dia){
      //   this.registrationDateText = "";
      //   this.registrationDateText = "Debe ingresar una fecha menor o igual a la actual";
      //   if(this.birthDateText == "La fecha de nacimiento debe ser menor a la fecha de registro"){
      //     this.birthDateText ="";
      //   }
      //   error = true;
      // }else{
        if(this.birthDate != null){
          if(Date.parse(this.birthDate.toString()) > Date.parse(this.registrationDate.toString())){
            this.registrationDateText = "";
            this.birthDateText = "La fecha de nacimiento debe ser menor a la fecha de registro";
          }else{
            this.registrationDateText = "";
          }
        }else{
          this.registrationDateText = "";
        }
      // }
    }
  }

  // ValidateName(event){
  //   debugger;
  //   var textBox = event.target;
  //   var start = textBox.selectionStart;
  //   var end = textBox.selectionEnd;
  //   if(textBox.value.length==1)
  //   textBox.value=textBox.value.toUpperCase().trim();   
  //   else{
  //     var inp = textBox.value.charAt(0).toUpperCase()+textBox.value.substring(1);
  //     if (/^([A-ZÑÁÉÍÓÚÜ][a-zñáéíóúü]*'?[a-za-zñáéíóúü]+)((\s[A-ZÑÁÉÍÓÚÜa-za-zñáéíóúü][a-za-zñáéíóúü]*'?[a-za-zñáéíóúü]+){1,3})?$/.test(inp)) {
  //         return true;
  //     } else {
  //         event.preventDefault();
  //         return false;
  //     }
  //   }
  //   textBox.setSelectionRange(start, end);

  // }
}
