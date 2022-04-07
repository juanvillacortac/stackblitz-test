import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';



import { MedicalCondition } from '../../shared/models/laborRelationship/medical-condition';
import { FamilyBurden } from '../../shared/models/laborRelationship/family-burden';
import { MaintenanceClaim } from '../../shared/models/laborRelationship/maintenance-claim';
import { Patology } from '../../shared/models/masters/patology';
import { PatologyType } from '../../shared/models/masters/patology-type';
import { Kinship } from '../../../../models/masters/kinship';
import { MedicalConditionViewModel } from '../../shared/view-models/medical-condition-viewmodel';
import { FamilyBurdenViewModel } from '../../shared/view-models/family-burden-viewmodel';
import { MaintenanceClaimViewModel } from '../../shared/view-models/maintenance-claim-viewmodel';
import { MedicalConditionFilter } from '../../shared/filters/laborRelationship/medical-condition-filter';
import { FamilyBurdenFilter } from '../../shared/filters/laborRelationship/family-burden-filter';
import { MaintenanceClaimFilter } from '../../shared/filters/laborRelationship/maintenance-claim-filter';
import { PatologyFilter } from '../../shared/filters/patology-filter';
import { PatologyTypeFilter } from '../../shared/filters/patology-type-filter';
import { KinshipFilter } from '../../../../models/masters/kinship-filter';
import { MedicalConditionDeletedFilter } from '../../shared/filters/laborRelationship/medical-condition-deleted-filter';
import { MaintenanceClaimDeletedFilter } from '../../shared/filters/laborRelationship/maintenance-claim-deleted-filter';

import { MedicalConditionService } from '../../shared/services/medical-condition.service';
import { FamilyBurdenService } from '../../shared/services/family-burden.service';
import { MaintenanceClaimService } from '../../shared/services/maintenance-claim.service';
import { PatologyService } from '../../shared/services/patology.service';
import { PatologyTypeService } from '../../shared/services/patology-type.service';
import { KinshipService } from '../../../masters/kinship/shared/kinship.service';


// import {  } from '../../shared/models/masters/medical-condition';

@Component({
  selector: 'app-socioeconomic-information-tab',
  templateUrl: './socioeconomic-information-tab.component.html',
  styleUrls: ['./socioeconomic-information-tab.component.scss'],
  providers: [DatePipe]
})
export class SocioeconomicInformationTabComponent implements OnInit {

  idEmployed: number;
  idLaborRelationship: number;
  showSidebar1: boolean = false;
  showSidebar2: boolean = false;
  showSidebar3: boolean = false;
  _medicalConditionList: MedicalConditionViewModel[];
  medicalConditionFilter: MedicalConditionFilter = new MedicalConditionFilter();
  _familyBurdenList: FamilyBurdenViewModel[] = [];
  familyBurdenFilter: FamilyBurdenFilter = new FamilyBurdenFilter();
  medicalConditionModel: MedicalCondition;
  maintenanceClaimModel: MaintenanceClaim;
  familyBurdenModel: FamilyBurden;
  familyBurdenUpdate: FamilyBurden[] = [];
  day: Date = new Date();
  _patologyList: Patology[] = [];
  patologyFilter: PatologyFilter = new PatologyFilter();
  _patologyTypeList: PatologyType[] = [];
  patologyTypeFilter: PatologyTypeFilter = new PatologyTypeFilter();
  kinshipFilter: KinshipFilter = new KinshipFilter();
  _kinshipList: Kinship[] = [];
  maintenanceClaimList: MaintenanceClaim[] = [];
  maintenanceClaimFilter: MaintenanceClaimFilter = new MaintenanceClaimFilter();
    
  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private _patologyService: PatologyService,
              private _patologyTypeService: PatologyTypeService,
              private _medicalConditionService: MedicalConditionService,
              private _familyBurdenService: FamilyBurdenService,
              private _kinshipService: KinshipService,
              public datepipe:DatePipe,
              private _maintenanceClaimService: MaintenanceClaimService
              ) {

    this.idEmployed = this.activatedRoute.snapshot.params['emp'];
    this.idLaborRelationship = this.activatedRoute.snapshot.params['rel'];
   }

  ngOnInit(): void {
    this.onLoadKinship();
    this.onLoadMaintenanceClaimList();
    do{
      this.upLoadPatology();
    }while(this._patologyList == [] && this._patologyTypeList == []);
    this.onLoadMedicalConditionList();
    do{
      this.upLoadKinship();
    }while(this._kinshipList == []);
    this.onLoadFamilyBurdenList();
  }

  upLoadPatology(){
    this.onLoadPatologyType();
    this.onLoadPatology();
  }

  upLoadKinship(){
    this.onLoadKinship();
  }

  onLoadPatologyType(){
    this._patologyTypeService.getPatologyType(this.patologyTypeFilter).subscribe((list1) => {
      this._patologyTypeList = list1;
      //debugger;
    });
  }
  onLoadPatology(){
    this._patologyService.getPatology(this.patologyFilter).subscribe((list2) => {
      this._patologyList = list2;
    });
  }

  listMedicalCondition(aux: MedicalCondition[]): MedicalConditionViewModel[]{
    var arrayMedicalCondition: MedicalConditionViewModel[] = [];
   
    return arrayMedicalCondition;
  }

  onLoadMedicalConditionList(){
    this.medicalConditionFilter.idEmployee = this.idEmployed;
    this._medicalConditionService.getMedicalCondition(this.medicalConditionFilter).subscribe((list) => {
      var aux = list;
      this._medicalConditionList = [];
      if(aux != null){
        aux.forEach(element => {
          var object = new MedicalConditionViewModel();
          object.idEmployee = element.idEmployee;
          object.idLaborRelationship = this.idLaborRelationship;
          object.idMedicalCondition = element.idMedicalCondition;
          object.idPatology = element.idPatology;
          console.log(this._patologyList);
          object.patology = this._patologyList.find(x => x.id == object.idPatology).patologyName;
          object.idPatologyType = this._patologyList.find(x => x.id == element.idPatology).idPatologyType;
          object.patologyType = this._patologyTypeList.find(x => x.id == object.idPatologyType ).patologyTypeName;
          object.startDate = element.startDate;
          object.patology = this._patologyList.find(x => x.id == element.idPatology).patologyName;
          object.startDateString = this.datepipe.transform(element.startDate, "dd/MM/yyyy");
          this._medicalConditionList.push(object);
        });
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las afecciones medicas" });
    });   
  }


  onLoadKinship(){
    this._kinshipService.getKinshipList(this.kinshipFilter).subscribe((list) => {
      this._kinshipList = list;
    });
  }

  listFamilyBurden(aux: FamilyBurden[]): FamilyBurdenViewModel[]{
    var arrayFamilyBurden: FamilyBurdenViewModel[] = [];
    this.onLoadKinship();
    aux.forEach(element =>{
      var object = new FamilyBurdenViewModel();
      object.idFamilyBurden = element.idFamilyBurden;
      object.idLaborRelationship = element.idLaborRelationship;
      object.idEmployee = element.idEmployee;
      object.idLaborRelationshipxFamilyBurden = element.idLaborRelationshipxFamilyBurden;
      object.idDocumentType = element.idDocumentType;
      object.firstName = element.firstName;
      object.lastName = element.lastName;
      object.fullName = element.firstName+" "+element.lastName;
      object.birthDate = element.birthDate;
      object.idKinship = element.idKinship;
      object.documentNumber = element.documentNumber;
      object.kinship = this._kinshipList.find(x => x.idKinship == element.idKinship).kinshipName;
      object.registrationDate = element.registrationDate;
      object.gender = element.gender;
      object.workFlag = element.workFlag;
      object.studyFlag = element.studyFlag;
      object.impairmentFlag = element.impairmentFlag;
      object.declaredFlag = element.declaredFlag;
      object.active = element.active;
      object.birthDateString = this.datepipe.transform(element.birthDate,'dd/MM/yyyy');
      object.registrationDateString = this.datepipe.transform(element.registrationDate,'dd/MM/yyyy');
      arrayFamilyBurden.push(object);
    });
    return arrayFamilyBurden;
  }

  onLoadFamilyBurdenList(){
    this.familyBurdenFilter.idEmployee = parseInt(this.idEmployed.toString());
    this.familyBurdenFilter.idLaborRelationship = parseInt(this.idLaborRelationship.toString());
    this._familyBurdenService.getFamilyBurden(this.familyBurdenFilter).subscribe((list) => {
      this._familyBurdenList = this.listFamilyBurden(list);
      //debugger;
      
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las cargas familiares" });
    });
  }

  onLoadMaintenanceClaimList(){
    this.maintenanceClaimFilter.idLaborRelationship = this.idLaborRelationship;
    this._maintenanceClaimService.getMaintenanceClaim(this.maintenanceClaimFilter).subscribe((list) => {
      this.maintenanceClaimList = list;
      //debugger;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las pensiones alimentarias" });
    });
  }
  sendFamilyBurdenPanel(modelInput: FamilyBurden){
    if(modelInput.idFamilyBurden == -1){
      this.familyBurdenModel = new FamilyBurdenViewModel();
      this.familyBurdenModel.idKinship = -1;
      this.familyBurdenModel.idFamilyBurden = -1;
      this.familyBurdenModel.idLaborRelationship = parseInt(this.idLaborRelationship.toString());
      this.familyBurdenModel.idEmployee = parseInt(this.idEmployed.toString());
      this.familyBurdenModel.idLaborRelationshipxFamilyBurden = -1;
      this.familyBurdenModel.idDocumentType = -1;
      this.familyBurdenModel.documentNumber = "";
      this.familyBurdenModel.firstName = "";
      this.familyBurdenModel.lastName = "";
      this.familyBurdenModel.gender = "";
      this.familyBurdenModel.active = true;
      this.familyBurdenModel.declaredFlag = false;
      this.familyBurdenModel.workFlag = false;
      this.familyBurdenModel.studyFlag = false;
      this.familyBurdenModel.impairmentFlag = false;
      this.familyBurdenModel.observation = "";
      this.familyBurdenModel.birthDate = null;
      this.familyBurdenModel.registrationDate = null;
      this.showSidebar2 = true;
    }else{
      this.familyBurdenModel = new FamilyBurdenViewModel();
      this.familyBurdenModel.idKinship = modelInput.idKinship;
      this.familyBurdenModel.idFamilyBurden = modelInput.idFamilyBurden;
      this.familyBurdenModel.idLaborRelationship = modelInput.idLaborRelationship;
      this.familyBurdenModel.idLaborRelationshipxFamilyBurden = modelInput.idLaborRelationshipxFamilyBurden;
      this.familyBurdenModel.idEmployee = modelInput.idEmployee;
      this.familyBurdenModel.idDocumentType = modelInput.idDocumentType;
      this.familyBurdenModel.documentNumber = modelInput.documentNumber;
      this.familyBurdenModel.firstName = modelInput.firstName;
      this.familyBurdenModel.lastName = modelInput.lastName;
      this.familyBurdenModel.gender = modelInput.gender;
      this.familyBurdenModel.active = modelInput.active;
      this.familyBurdenModel.birthDate = modelInput.birthDate;
      this.familyBurdenModel.registrationDate = modelInput.registrationDate;
      this.familyBurdenModel.declaredFlag = modelInput.declaredFlag;
      this.familyBurdenModel.workFlag = modelInput.workFlag;
      this.familyBurdenModel.studyFlag = modelInput.studyFlag;
      this.familyBurdenModel.impairmentFlag = modelInput.impairmentFlag;
      this.familyBurdenModel.observation = modelInput.observation;
      this.showSidebar2 = true;
    }
  }

  sendMedicalConditionPanel(modelInput: MedicalCondition){
    if(modelInput.idMedicalCondition == -1){
      this.medicalConditionModel = new MedicalConditionViewModel();
      this.medicalConditionModel.idEmployee = this.idEmployed;
      this.medicalConditionModel.idLaborRelationship = this.idLaborRelationship;
      this.medicalConditionModel.idMedicalCondition = -1;
      this.medicalConditionModel.idPatology = -1;
      this.medicalConditionModel.observation = "";
      this.showSidebar1 = true;
    }else{
      this.medicalConditionModel = new MedicalConditionViewModel();
      this.medicalConditionModel.idEmployee = modelInput.idEmployee;
      this.medicalConditionModel.idMedicalCondition = modelInput.idMedicalCondition;
      this.medicalConditionModel.idPatology = modelInput.idPatology;
      this.medicalConditionModel.startDate = modelInput.startDate;
      this.medicalConditionModel.observation = modelInput.observation;
      this.showSidebar1 = true;
    }
  }

  sendMaintenanceClaimPanel(modelInput: MaintenanceClaimViewModel){
    if(modelInput.idMaintenanceClaim == -1){
      this.maintenanceClaimModel = new MaintenanceClaimViewModel();
      this.maintenanceClaimModel.idMaintenanceClaim = -1;
      this.maintenanceClaimModel.idLaborRelationship = parseInt(this.idLaborRelationship.toString());
      this.maintenanceClaimModel.idLaborRelationshipxFamilyBurden = -1;
      this.maintenanceClaimModel.firstNameBeneficiary = "";
      this.maintenanceClaimModel.lastNameBeneficiary = "";
      this.maintenanceClaimModel.documentNumberBeneficiary = "";
      this.maintenanceClaimModel.iDocumentTypeBeneficiary = -1;
      this.maintenanceClaimModel.recordNumber = "";
      this.maintenanceClaimModel.paymentsDeductionFlag = false;
      this.maintenanceClaimModel.amount = 0;
      this.maintenanceClaimModel.porcentage = 0;
      this.maintenanceClaimModel.idSalaryType = -1;
      this.maintenanceClaimModel.createdByUserId = -1;
      this.maintenanceClaimModel.updatedByUserId = -1;
      this.showSidebar3 = true;
      //debugger;
    }else{
      this.maintenanceClaimModel = new MaintenanceClaimViewModel();
      this.maintenanceClaimModel.idMaintenanceClaim = modelInput.idMaintenanceClaim;
      this.maintenanceClaimModel.idLaborRelationship = modelInput.idLaborRelationship;
      this.maintenanceClaimModel.idLaborRelationshipxFamilyBurden = modelInput.idLaborRelationshipxFamilyBurden;
      this.maintenanceClaimModel.firstNameBeneficiary = modelInput.firstNameBeneficiary;
      this.maintenanceClaimModel.lastNameBeneficiary = modelInput.lastNameBeneficiary;
      this.maintenanceClaimModel.documentNumberBeneficiary = modelInput.documentNumberBeneficiary;
      this.maintenanceClaimModel.iDocumentTypeBeneficiary = modelInput.iDocumentTypeBeneficiary;
      this.maintenanceClaimModel.recordNumber = modelInput.recordNumber;
      this.maintenanceClaimModel.paymentsDeductionFlag = modelInput.paymentsDeductionFlag;
      this.maintenanceClaimModel.amount = modelInput.amount;
      this.maintenanceClaimModel.porcentage = modelInput.porcentage;
      this.maintenanceClaimModel.idSalaryType = modelInput.idSalaryType;
      this.maintenanceClaimModel.createdByUserId = modelInput.createdByUserId;
      this.maintenanceClaimModel.updatedByUserId = modelInput.updatedByUserId;
      this.showSidebar3 = true;
      //debugger;
    }
  }

  resetValues(valor: boolean){  //se ejecuta cada vez que se sale de un modal (editar o eliminar) sin realizar cambios 
    this.showSidebar1 = valor;
    this.showSidebar2 = valor;
    this.showSidebar3 = valor;
  }

  saveMedicalCondition(record: any){
    this.medicalConditionModel = new MedicalCondition();
    this.medicalConditionModel.idMedicalCondition = record.idMedicalCondition;
    this.medicalConditionModel.idLaborRelationship = parseInt(record.idLaborRelationship);
    this.medicalConditionModel.idEmployee = parseInt(record.idEmployee);
    this.medicalConditionModel.observation = record.observation;
    this.medicalConditionModel.idPatology = record.idPatology;
    this.medicalConditionModel.startDate = record.startDate;
    //debugger;
    this._medicalConditionService.insertMedicalCondition(this.medicalConditionModel).subscribe((data) => { //de lo contrario se insertan
      if (data> 0) {    //si no ocurre algún error
           this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
           this.onLoadMedicalConditionList();
           this.showSidebar1 = false;
      }else if(data == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
        //window.location.reload(); Recarga la página
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });  
  }
  saveFamilyBurden(record: any){
    this.familyBurdenModel = new FamilyBurdenViewModel();
      this.familyBurdenModel.idKinship = parseInt(record.idKinship.toString());
      this.familyBurdenModel.idEmployee =parseInt(record.idEmployee.toString());
      this.familyBurdenModel.idFamilyBurden =parseInt(record.idFamilyBurden.toString());
      this.familyBurdenModel.idLaborRelationship = parseInt(record.idLaborRelationship.toString());
      this.familyBurdenModel.idLaborRelationshipxFamilyBurden = parseInt(record.idLaborRelationshipxFamilyBurden.toString());
      this.familyBurdenModel.idDocumentType = parseInt(record.idDocumentType.toString());
      this.familyBurdenModel.documentNumber = record.documentNumber;
      this.familyBurdenModel.firstName = record.firstName;
      this.familyBurdenModel.lastName = record.lastName;
      this.familyBurdenModel.gender = record.gender;
      this.familyBurdenModel.active = record.active;
      this.familyBurdenModel.birthDate = record.birthDate;
      this.familyBurdenModel.registrationDate = record.registrationDate;
      this.familyBurdenModel.declaredFlag = record.declaredFlag;
      this.familyBurdenModel.workFlag = record.workFlag;
      this.familyBurdenModel.studyFlag = record.studyFlag;
      this.familyBurdenModel.impairmentFlag = record.impairmentFlag;
      this.familyBurdenModel.observation = record.observation;

      //debugger;
    this._familyBurdenService.insertFamilyBurden(this.familyBurdenModel).subscribe((data) => { //de lo contrario se insertan
      if (data> 0) {    //si no ocurre algún error
           this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
           this.onLoadFamilyBurdenList();
           this.showSidebar2 = false;
      }else if(data == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
        //window.location.reload(); Recarga la página
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });  
  }
  saveMaintenanceClaim(record: any){
    //debugger;
    this.maintenanceClaimModel = new MaintenanceClaim();
    this.maintenanceClaimModel.idMaintenanceClaim = record.idMaintenanceClaim;
    this.maintenanceClaimModel.idLaborRelationshipxFamilyBurden = record.idLaborRelationshipxFamilyBurden;
    this.maintenanceClaimModel.firstNameBeneficiary = record.firstNameBeneficiary;
    this.maintenanceClaimModel.lastNameBeneficiary = record.lastNameBeneficiary;
    this.maintenanceClaimModel.iDocumentTypeBeneficiary = record.iDocumentTypeBeneficiary;
    this.maintenanceClaimModel.documentNumberBeneficiary = record.documentNumberBeneficiary;
    this.maintenanceClaimModel.idSalaryType = 1;
    this.maintenanceClaimModel.porcentage = record.porcentage;
    this.maintenanceClaimModel.amount = record.amount;
    this.maintenanceClaimModel.recordNumber = record.recordNumber;
    this.maintenanceClaimModel.paymentsDeductionFlag = false;
    this.maintenanceClaimModel.idLaborRelationshipxFamilyBurden = record.idLaborRelationshipxFamilyBurden;
    this.maintenanceClaimModel.idLaborRelationship = parseInt(this.idLaborRelationship.toString());
    this.maintenanceClaimModel.createdByUserId = record.createdByUserId;
    this.maintenanceClaimModel.updatedByUserId = record.updatedByUserId;


    this._maintenanceClaimService.insertMaintenanceClaim(this.maintenanceClaimModel).subscribe((data) => { //de lo contrario se insertan
      if (data> 0) {    //si no ocurre algún error
           this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
           this.onLoadMaintenanceClaimList();
           this.showSidebar3 = false;
      }else if(data == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
        //window.location.reload(); Recarga la página
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });  
  }

  deletedMedicalCondition(record: any){
    var filter: MedicalConditionDeletedFilter = new MedicalConditionDeletedFilter();
    filter.idMedicalCondition = parseInt(record.idMedicalCondition);
    //debugger;
    this._medicalConditionService.deletedMedicalCondition(filter).subscribe((data) => { //de lo contrario se insertan
      if (data> 0) {    //si no ocurre algún error
           this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
           this.onLoadMedicalConditionList();
      }else if(data == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
      }
        //window.location.reload(); Recarga la página
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al borrar los datos" });
    });  
    
  }

  deletedMaintenanceClaim(record: any){
    var filter: MaintenanceClaimDeletedFilter = new MaintenanceClaimDeletedFilter();
    filter.idMaintenanceClaim = parseInt(record.idMaintenanceClaim);
    //debugger;
    this._maintenanceClaimService.deletedMaintenanceClaim(filter).subscribe((data) => { //de lo contrario se insertan
      if (data> 0) {    //si no ocurre algún error
           this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
           this.onLoadMaintenanceClaimList();
      }else if(data == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
      }
        //window.location.reload(); Recarga la página
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al borrar los datos" });
    });  
    
  }

}

