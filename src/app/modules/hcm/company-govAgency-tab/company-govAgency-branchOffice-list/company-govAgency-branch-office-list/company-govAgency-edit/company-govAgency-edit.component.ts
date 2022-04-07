import { HttpErrorResponse } from '@angular/common/http';
import { NullTemplateVisitor } from '@angular/compiler';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { BranchOfficeFilter } from 'src/app/modules/hcm/shared/filters/branch-office-filter';
import { GovernmentalAgencyFilter } from 'src/app/modules/hcm/shared/filters/governmental-agency-filter';
import { GovernmentalRecordFilter } from 'src/app/modules/hcm/shared/filters/governmental-record-filter';
import { GovernmentalRecordTypeFilter } from 'src/app/modules/hcm/shared/filters/governmental-record-type-filter';
import { BranchOffice } from 'src/app/modules/hcm/shared/models/masters/branch-office';
import { GovernmentalAgency } from 'src/app/modules/hcm/shared/models/masters/governmental-agency';
import { GovernmentalRecord } from 'src/app/modules/hcm/shared/models/masters/governmental-record';
import { GovernmentalRecordType } from 'src/app/modules/hcm/shared/models/masters/governmental-record-type';
import { IdentifierType } from 'src/app/modules/hcm/shared/models/masters/IdentifierType';
import { BranchOfficeService } from 'src/app/modules/hcm/shared/services/branch-office.service';
import { GovernmentalAgencyService } from 'src/app/modules/hcm/shared/services/governmental-agency.service';
import { GovernmentalRecordTypeService } from 'src/app/modules/hcm/shared/services/governmental-record-type.service';
import { GovernmentalRecordService } from 'src/app/modules/hcm/shared/services/governmental-record.service';
import { UserService } from 'src/app/modules/hcm/shared/services/user.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CompanyGovernmentalAgencyFilter } from '../../../../shared/filters/company-governmental-agency-filter';
import { CompanyGovernmentalAgency } from '../../../../shared/models/masters/company-governmental-agency';
import { CompanyGovernmentalAgencyService } from '../../../../shared/services/company-governmental-agency.service';

@Component({
  selector: 'app-company-govAgency-edit',
  templateUrl: './company-govAgency-edit.component.html',
  styleUrls: ['./company-govAgency-edit.component.scss']
})
export class CompanyGovernmentalAgencyEditDialogComponent implements OnInit {
  
  @Input("filters") filters: CompanyGovernmentalAgencyFilter;
  @Input("inputCompanyGovernmentalAgency") inputCompanyGovernmentalAgency: CompanyGovernmentalAgency;
  @Input("_companyGovernmentalAgencyId") _companyGovernmentalAgencyId: number = -1;
  @Input("showDialog") showDialog: boolean = true;
  @Input() idCountry: number;
  @Input() idCompany: number;
  
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("_companyGovernmentalAgencies") _companyGovernmentalAgencies = new EventEmitter<CompanyGovernmentalAgency[]>();
  
  _validations : Validations = new Validations();
  
  visible = false;
  submitted: boolean;
  disabled : boolean = true;
  editRegisteredItem : boolean = false;
  inMemoryCount: number = -1;

  governmentalAgencies: SelectItem[] = [];
  governmentalAgenciesShortNames: SelectItem[] = [];
  governmentalRecords: SelectItem[] = [];
  governmentalRecordTypes: SelectItem[] = [];
  identifierTypeOptionsEdit: SelectItem[] = [];
  nonNaturalIdentifierTypeOptionsEdit: SelectItem[] = [];
  branchOffices : SelectItem[] = [];

  public _companyGovernmentalAgency: CompanyGovernmentalAgency;
  public _companyGovernmentalAgencyFilter: CompanyGovernmentalAgencyFilter = new CompanyGovernmentalAgencyFilter();
  EditOpenFlag = false;
  editedItem: CompanyGovernmentalAgency = new CompanyGovernmentalAgency();
  item: CompanyGovernmentalAgency = new CompanyGovernmentalAgency();
  editRowIndex: number;
  BOselectedOption: number;
  inMemoryEdit: boolean = false;

  @Input() companyGovernmentalAgencies: CompanyGovernmentalAgency[] = [];
  @Input() registros : CompanyGovernmentalAgency[];
  @Output() _companyGovernmentalAgenciesListItem = new EventEmitter<CompanyGovernmentalAgency>();
  @Output() _parentSave = new EventEmitter<CompanyGovernmentalAgency>();

  // @ViewChild("formBranchOffice") formBranchOffice: SelectItem;
  @ViewChild("formId") formId: ElementRef;
  @ViewChild("formBranchOffice") formBranchOffice: Dropdown;
  @ViewChild("formRecordNumber") formRecordNumber: ElementRef;
  @ViewChild("formGovernmentalAgency") formGovernmentalAgency: Dropdown;
  @ViewChild("formDocumentType") formDocumentType: Dropdown;
  @ViewChild("formDocumentNumber") formDocumentNumber: ElementRef;
  @ViewChild("formGovernmentalRecord") formGovernmentalRecord: Dropdown;
  @ViewChild("formEmployerContribution") formEmployerContribution;
  @ViewChild("formEmployeeContribution") formEmployeeContribution;
  @ViewChild("formFirstNameLR") formFirstNameLR: ElementRef;
  @ViewChild("formLastNameLR") formLastNameLR: ElementRef;
  // @ViewChild("formDocumentTypeLRId") formDocumentTypeLRId: Dropdown;
  // @ViewChild("formDocumentNumberLR") formDocumentNumberLR: ElementRef;
  @ViewChild("formPhone") formPhone: ElementRef;
  @ViewChild("formGovernmentalRecordType") formGovernmentalRecordType: Dropdown;


  constructor(
    private actRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    public _companyGovernmentalAgencyService: CompanyGovernmentalAgencyService,
    private _userService: UserService,
    public messageService: MessageService,
    private _governmentalAgencyService: GovernmentalAgencyService,
    private _governmentalRecord: GovernmentalRecordService,
    private _governmentalRecordType: GovernmentalRecordTypeService,
    private _governmentalAgency: GovernmentalAgencyService,
    private _branchOffice: BranchOfficeService
  ) { }

  ngOnInit(): void {
   
  }

  clearForm(){
    this.formBranchOffice.value = -1; 
    this.formBranchOffice.selectedOption = null; 
    this.formBranchOffice.updateSelectedOption(null); 
    this.formBranchOffice.cd.detectChanges(); 
    this.formRecordNumber.nativeElement.value = "";
    this.formEmployerContribution.input.nativeElement.value = "";
    this.formEmployeeContribution.input.nativeElement.value = "";
    this.formFirstNameLR.nativeElement.value = "";
    this.formLastNameLR.nativeElement.value = "";
    this.formDocumentNumber.nativeElement.value = "";
    this.formPhone.nativeElement.value = "";
    this.formGovernmentalRecordType.value = -1;
    this.formGovernmentalRecordType.selectedOption = null;
    this.formGovernmentalRecordType.updateSelectedOption(null);
    this.formGovernmentalRecordType.cd.detectChanges();
    this.formGovernmentalAgency.value = -1;
    this.formGovernmentalAgency.selectedOption = null;
    this.formGovernmentalAgency.updateSelectedOption(null);
    this.formGovernmentalAgency.cd.detectChanges();
    this.formDocumentType.value = -1;
    this.formDocumentType.selectedOption = null;
    this.formDocumentType.updateSelectedOption(null);
    this.formDocumentType.cd.detectChanges();
    this.formGovernmentalRecord.value = -1;
    this.formGovernmentalRecord.selectedOption = null;
    this.formGovernmentalRecord.updateSelectedOption(null);
    this.formGovernmentalRecord.cd.detectChanges();
  }

  add(itemToAdd: CompanyGovernmentalAgency){
    this.submitted = true;
    this.item = itemToAdd;    

     

      if (this.registros.find(x => x.branchOffice == this.item.branchOffice 
        && x.governmentalAgency == this.item.governmentalAgency
        && x.governmentalRecord == this.item.governmentalRecord
        && x.governmentalRecordType == this.item.governmentalRecordType
        && x.recordNumber == this.item.recordNumber 
      )) {
        this.messageService.add({severity:'error', summary:'Alerta', detail: "El registro que intenta agregar ya existe."});
      } else {
        console.log(this.item);
        
        if( this.formBranchOffice.value != -1 ||
            this.formRecordNumber.nativeElement.value != "" ||
            this.formEmployerContribution.input.nativeElement.value != "" ||
            this.formEmployeeContribution.input.nativeElement.value != "" ||
            this.formFirstNameLR.nativeElement.value != "" ||
            this.formLastNameLR.nativeElement.value != "" ||
            this.formDocumentNumber.nativeElement.value != "" ||
            this.formPhone.nativeElement.value != "" ||
            this.formGovernmentalRecordType.value != -1 ||
            this.formGovernmentalAgency.value != -1 ||
            this.formGovernmentalRecord.value != -1 ||
            this.formDocumentType.value != -1
        ){

          if (this.companyGovernmentalAgencies.find(x => x == this.item)) {
              this.messageService.add({severity:'error', summary:'Alerta', detail: "El registro que intenta agregar ya existe en la lista de preguardado."});
          } else {

            if (parseFloat(this.formEmployerContribution.input.nativeElement.value) + parseFloat(this.formEmployeeContribution.input.nativeElement.value) > 100 ) {
              this.messageService.add({severity:'error', summary:'Alerta', detail: "El total del porcentaje de aporte no puede superar el 100%."});
            } else {
              if (this.companyGovernmentalAgencies.find(x => x.branchOffice == this.item.branchOffice 
                && x.governmentalAgency == this.item.governmentalAgency
                && x.governmentalRecord == this.item.governmentalRecord
                && x.governmentalRecordType == this.item.governmentalRecordType 
                && x.recordNumber == this.item.recordNumber
                && x.id != this.item.id
              )) {
                this.messageService.add({severity:'error', summary:'Alerta', detail: "El registro que intenta agregar ya existe en la lista de preguardado."});
              } else {
  
                  this.inMemoryCount = this.inMemoryCount + this.inMemoryCount++;
  
                  this.editedItem = new CompanyGovernmentalAgency();
                  ///luego cambiar a -1 al guardar los registros.
                  this.editedItem.id = this.inMemoryCount;
                  /////////////
                  this.editedItem.recordNumber = this.item.recordNumber;
                  this.editedItem.employerContribution = this.item.employerContribution;
                  this.editedItem.employeeContribution = this.item.employeeContribution;
                  this.editedItem.firstNameLR = this.item.firstNameLR;
                  this.editedItem.lastNameLR = this.item.lastNameLR;
                  // this.editedItem.documentNumberLR = this.item.documentNumberLR;
                  this.editedItem.phone = this.item.phone;
                  this.editedItem.governmentalAgencyName = this.item.governmentalAgencyName;
      
                  this.editedItem.branchOffice = this.item.branchOffice;
                  this.editedItem.governmentalAgency = this.item.governmentalAgency;
                  this.editedItem.documentType = this.item.documentType;
                  this.editedItem.documentNumber = this.item.documentNumber;
                  this.editedItem.governmentalRecord = this.item.governmentalRecord;
                  this.editedItem.governmentalRecordType = this.item.governmentalRecordType;
                  // this.editedItem.documentTypeLRId = this.item.documentTypeLRId;
      
                  this.editedItem.branchOfficeName = this.branchOffices.find(x => x.value == this.item.branchOffice).label,
                  this.editedItem.governmentalAgencyName = this.governmentalAgencies.find(x => x.value == this.item.governmentalAgency).label;
                  var identifier = this.identifierTypeOptionsEdit.find(x => x.value == this.item.documentType).label;
                  var identifierLetter = identifier.substr(identifier.indexOf("("), identifier.indexOf(")")).trim();
                  identifierLetter = identifierLetter.substr(identifierLetter.indexOf(" "), identifierLetter.lastIndexOf(" ")).trim();
                  this.editedItem.documentTypeIdentifier = identifierLetter;
                  this.editedItem.company = parseInt(this.actRoute.snapshot.params['id']);
                  this.editedItem.recordDate = new Date("1900 01 01");
      
                  this._companyGovernmentalAgenciesListItem.emit(this.editedItem);
                  console.log(this.editedItem);
                  // debugger;
                  if(this.EditOpenFlag){
                    this.companyGovernmentalAgencies.splice(this.editRowIndex, 1);
                    this.EditOpenFlag = false;
                  }
                  
                  this._companyGovernmentalAgency = new CompanyGovernmentalAgency();
                  this._companyGovernmentalAgency.id = -1;
                  this._companyGovernmentalAgency.estatus = true;
                  this.submitted = false;
                  this.visible = false;
                }
            }
              
          }
        }
        
    }
    
  }

  edit(Id: number){
    this._companyGovernmentalAgencyId = Id;
    this.iniciarCampos();
  }

  inMemoryEditAndSave(itemToEdit: CompanyGovernmentalAgency, form: CompanyGovernmentalAgency){
    //recorriendo el objeto para compararlo:
    //model: objeto cargado esn la vista.
    //form: objeto del "formulario", tiene valores diferentes a los default si se cambia algo en el mismo.
    for (const property in form) {
      if(form[property] != "" && form[property] != -1){
        console.log(`${property}: ${form[property]}`);
        itemToEdit[property] = form[property];
      }
    }
    this._parentSave.emit(itemToEdit);
  }

  EditRegisteredOpen(model: CompanyGovernmentalAgency){
    this._companyGovernmentalAgencyId = model.id;
    // debugger;
    this.iniciarCampos(model);
  }

  iniciarCampos(model: CompanyGovernmentalAgency = new CompanyGovernmentalAgency()){
    this.idCompany = parseInt(this.actRoute.snapshot.params['id']);
    
    if(!this.EditOpenFlag){
        // debugger;
        this.governmentalAgencies = [];
        this.governmentalAgenciesShortNames = [];
        this.governmentalRecords = [];
        this.governmentalRecordTypes = [];
        this.identifierTypeOptionsEdit = [];
        this.nonNaturalIdentifierTypeOptionsEdit = [];
        this.branchOffices = [];
        // debugger;
        this.loadGovernmentalAgencies(this.idCountry);
        this.loadGovernmentalAgenciesShortNames(this.idCountry);
        this.loadNaturalIdentifierTypesEdit();
        // this.loadNonNaturalIdentifierTypesEdit();
        // this.getGovernmentalAgencies(this.idCountry);
        this.getBranchOffices(this.idCompany, 1, this.idCountry);
        // debugger;

        // this.formBranchOffice.value = -1; 
        // this.formBranchOffice.selectedOption = null; 
        // this.formBranchOffice.updateSelectedOption(null); 
        // this.formBranchOffice.cd.detectChanges(); 
        // this.formRecordNumber.nativeElement.value = "";
        // this.formEmployerContribution.input.nativeElement.value = "";
        // this.formEmployeeContribution.input.nativeElement.value = "";
        // this.formFirstNameLR.nativeElement.value = "";
        // this.formLastNameLR.nativeElement.value = "";
        // this.formDocumentNumber.nativeElement.value = "";
        // this.formPhone.nativeElement.value = "";
        // this.formGovernmentalRecordType.value = -1;
        // this.formGovernmentalRecordType.selectedOption = null;
        // this.formGovernmentalRecordType.updateSelectedOption(null);
        // this.formGovernmentalRecordType.cd.detectChanges();
        // this.formGovernmentalAgency.value = -1;
        // this.formGovernmentalAgency.selectedOption = null;
        // this.formGovernmentalAgency.updateSelectedOption(null);
        // this.formGovernmentalAgency.cd.detectChanges();
        // this.formDocumentType.value = -1;
        // this.formDocumentType.selectedOption = null;
        // this.formDocumentType.updateSelectedOption(null);
        // this.formDocumentType.cd.detectChanges();
        // this.formGovernmentalRecord.value = -1;
        // this.formGovernmentalRecord.selectedOption = null;
        // this.formGovernmentalRecord.updateSelectedOption(null);
        // this.formGovernmentalRecord.cd.detectChanges();

        this.clearForm();
        this.editRegisteredItem = false;
        this.visible = true;

    } else {
      if (this._companyGovernmentalAgencyId === -1) {

        // si la bandera de edicion esta en false
        //   es un registro nuevo 
        // sino 
        //  es edicion 
        //     si el id es -1
        //       copiar model en el formulario
        //     si no 
        //       si el id != -1
        //     entonces
        //       es edicion de registro de bbdd

        console.log(model);
        //copiar model en form
          // debugger;
          this.clearForm();
          // debugger;
          
          this.getBranchOffices(this.idCompany, 1, this.idCountry);
          this.loadGovernmentalAgencies(this.idCountry);
          this.getGovernmentalRecordsByAgency(model.governmentalAgency);
          this.formGovernmentalRecord.cd.detectChanges();
          this.loadNaturalIdentifierTypesEdit();
          
          this.formId.nativeElement.value = model.id.toString();
          
          this.formBranchOffice.value = model.branchOffice; 
          this.formBranchOffice.selectedOption = model.branchOffice; 
          // this.formBranchOffice.updateSelectedOption(model.branchOffice); 
          this.formBranchOffice.cd.detectChanges();
          
          this.formRecordNumber.nativeElement.value = model.recordNumber;
          // this.formDocumentNumber.nativeElement.value = model.documentNumber;
          this.formEmployerContribution.input.nativeElement.value = model.employerContribution;
          this.formEmployeeContribution.input.nativeElement.value = model.employeeContribution;
          
          this.formFirstNameLR.nativeElement.value = model.firstNameLR;
          this.formLastNameLR.nativeElement.value = model.lastNameLR;
          this.formDocumentNumber.nativeElement.value = model.documentNumber;
          this.formPhone.nativeElement.value = model.phone;
          
          this.getGovernmentalRecordTypes(model.governmentalRecord);
          this.formGovernmentalRecordType.cd.detectChanges();

          this.formGovernmentalAgency.value = model.governmentalAgency;
          this.formGovernmentalAgency.selectedOption = model.governmentalAgency;
          this.formGovernmentalAgency.cd.detectChanges();
          // this.formGovernmentalAgency.updateSelectedOption(model.governmentalAgency);
          // this.formGovernmentalAgency.cd.detectChanges();

          this.formDocumentType.value = model.documentType;
          this.formDocumentType.selectedOption = model.documentType;
          this.formDocumentType.cd.detectChanges();
          // this.formDocumentType.updateSelectedOption(model.documentType);
          // this.formDocumentType.cd.detectChanges();

          this.formGovernmentalRecord.value = model.governmentalRecord;
          this.formGovernmentalRecord.selectedOption = model.governmentalRecord;
          this.formGovernmentalRecord.cd.detectChanges();

          this.formGovernmentalRecordType.value = model.governmentalRecordType;
          this.formGovernmentalRecordType.selectedOption = model.governmentalRecordType;
          this.formGovernmentalRecordType.cd.detectChanges();
          
          // this.formDocumentTypeLRId.updateSelectedOption(model.documentTypeLRId);
          // this.formDocumentTypeLRId.cd.detectChanges();
          
          
          this.inputCompanyGovernmentalAgency = {
                id: this.formId.nativeElement.value,
                governmentalAgency: this.formGovernmentalAgency.value,
                governmentalRecord: this.formGovernmentalRecord.value,
                governmentalRecordType: this.formGovernmentalRecordType.value,
                company: this.idCompany,
                branchOffice: this.formBranchOffice.value,
                documentType: this.formDocumentType.value,
                documentNumber: this.formDocumentNumber.nativeElement.value,
                firstNameLR: this.formFirstNameLR.nativeElement.value,
                lastNameLR: this.formLastNameLR.nativeElement.value,
                phone: this.formPhone.nativeElement.value,
                recordNumber: this.formRecordNumber.nativeElement.value,
                recordDate: new Date("1900 01 01"),
                employerContribution: parseFloat(this.formEmployerContribution.input.nativeElement.value),
                employeeContribution: parseFloat(this.formEmployeeContribution.input.nativeElement.value),
                estatus: model.estatus,
                
                // documentTypeLRId: this.formDocumentTypeLRId.value,
                governmentalAgencyName: "",
                governmentalAgencyShortName: "",
                governmentalRecordName: "",
                governmentalRecordTypeName: "",
                branchOfficeName: "",
                documentTypeIdentifier: "",
                estatusName: "",
                documentTypeLR: "",
                documentNumberLR: "",
                documentTypeIdentifierLR: ""
          };

              this.editRegisteredItem = false;
              this.visible = true;
          
      } else {
          // es edicion de registro de bbdd

          if(this._companyGovernmentalAgencyId != -1) {
            // this._companyGovernmentalAgencyFilter.id = this._companyGovernmentalAgencyId;
            console.log(model);
            // debugger;
            this.clearForm();
            
            this.getBranchOffices(this.idCompany, 1, this.idCountry);
            this.loadGovernmentalAgencies(this.idCountry);
            this.getGovernmentalRecordsByAgency(model.governmentalAgency);
            this.formGovernmentalRecord.cd.detectChanges();
            this.loadNaturalIdentifierTypesEdit();
            this.getGovernmentalRecordTypes(model.governmentalRecord);
            this.formGovernmentalRecordType.cd.detectChanges();

            this.formBranchOffice.value = model.branchOffice; 
            this.formBranchOffice.selectedOption = model.branchOffice; 
            // this.formBranchOffice.updateSelectedOption(model.branchOffice); 
            this.formBranchOffice.cd.detectChanges();
            
            this.formRecordNumber.nativeElement.value = model.recordNumber;
            // this.formDocumentNumber.nativeElement.value = model.documentNumber;
            this.formEmployerContribution.input.nativeElement.value = model.employerContribution;
            
            this.formEmployeeContribution.input.nativeElement.value = model.employeeContribution;
            
            this.formFirstNameLR.nativeElement.value = model.firstNameLR;
            this.formLastNameLR.nativeElement.value = model.lastNameLR;
            this.formDocumentNumber.nativeElement.value = model.documentNumber;
            this.formPhone.nativeElement.value = model.phone;
            
            // this.getGovernmentalRecordTypes(model.governmentalRecord);
            // this.formGovernmentalRecordType.cd.detectChanges();

            this.formGovernmentalAgency.value = model.governmentalAgency;
            this.formGovernmentalAgency.selectedOption = model.governmentalAgency;
            // this.formGovernmentalAgency.updateSelectedOption(model.governmentalAgency);
            this.formGovernmentalAgency.cd.detectChanges();

            this.formGovernmentalRecord.value = model.governmentalRecord;
            this.formGovernmentalRecord.selectedOption = model.governmentalRecord;
            this.formGovernmentalRecord.cd.detectChanges();
            
            this.formDocumentType.value = model.documentType;
            this.formDocumentType.selectedOption = model.documentType;
            this.formDocumentType.cd.detectChanges();
            
            this.formGovernmentalRecordType.value =  -1;
            this.formGovernmentalRecordType.value = model.governmentalRecordType;
            this.formGovernmentalRecordType.selectedOption = model.governmentalRecordType;
            this.formGovernmentalRecordType.cd.detectChanges();

            this.editedItem = {
                id: model.id,
                governmentalAgency: this.formGovernmentalAgency.value,
                governmentalRecord: this.formGovernmentalRecord.value,
                governmentalRecordType: this.formGovernmentalRecordType.value,
                company: this.idCompany,
                branchOffice: this.formBranchOffice.value,
                documentType: this.formDocumentType.value,
                documentNumber: this.formDocumentNumber.nativeElement.value,
                firstNameLR: this.formFirstNameLR.nativeElement.value,
                lastNameLR: this.formLastNameLR.nativeElement.value,
                phone: this.formPhone.nativeElement.value,
                recordNumber: this.formRecordNumber.nativeElement.value,
                recordDate: new Date("1900 01 01"),
                employerContribution: parseFloat(this.formEmployerContribution.input.nativeElement.value),
                employeeContribution: parseFloat(this.formEmployeeContribution.input.nativeElement.value),
                estatus: model.estatus,
                
                // documentTypeLRId: this.formDocumentTypeLRId.value,
                governmentalAgencyName: "",
                governmentalAgencyShortName: "",
                governmentalRecordName: "",
                governmentalRecordTypeName: "",
                branchOfficeName: "",
                documentTypeIdentifier: "",
                estatusName: "",
                documentTypeLR: "",
                documentNumberLR: "",
                documentTypeIdentifierLR: ""
            };
        
            this.editRegisteredItem = true;
            this.visible = true;
            
          // this.getBranchOffices(this.idCompany, 1, this.idCountry);
            // this.loadGovernmentalAgencies(this.idCountry);
            // this.getGovernmentalRecordsByAgency(model.governmentalAgency);
            // this.formGovernmentalRecord.cd.detectChanges();
            // this.loadNaturalIdentifierTypesEdit();
            
            // this.formBranchOffice.value = model.branchOffice; 
            // this.formBranchOffice.cd.detectChanges();
            
            // this.getGovernmentalRecordTypes(model.governmentalRecord);
            // this.formGovernmentalRecordType.cd.detectChanges();

            // this.formRecordNumber.nativeElement.value = model.recordNumber;
            // this.formEmployerContribution.input.nativeElement.value = model.employerContribution;
            // this.formEmployeeContribution.input.nativeElement.value = model.employeeContribution;
            // this.formFirstNameLR.nativeElement.value = model.firstNameLR;
            // this.formLastNameLR.nativeElement.value = model.lastNameLR;
            // this.formDocumentNumber.nativeElement.value = model.documentNumber;
            // this.formPhone.nativeElement.value = model.phone;

            // this.formGovernmentalAgency.value = model.governmentalAgency;
            // this.formGovernmentalAgency.selectedOption = model.governmentalAgency;
            // this.formGovernmentalAgency.cd.detectChanges();

            // this.formDocumentType.value = model.documentType;
            // this.formDocumentType.selectedOption = model.documentType;
            // this.formDocumentType.cd.detectChanges();
            // // this.formDocumentType.updateSelectedOption(model.documentType);
            // // this.formDocumentType.cd.detectChanges();

            // this.formGovernmentalRecord.value = model.governmentalRecord;
            // this.formGovernmentalRecord.selectedOption = model.governmentalRecord;
            // this.formGovernmentalRecord.cd.detectChanges();
            
            // this.formGovernmentalRecordType.value = model.governmentalRecordType;
            // this.formGovernmentalRecordType.selectedOption = model.governmentalRecordType;
            // this.formGovernmentalRecordType.cd.detectChanges();
           
            // // this.formDocumentTypeLRId.value = model.documentTypeLRId;
            // // this.formDocumentTypeLRId.selectedOption = model.documentTypeLRId;
            // // this.formDocumentTypeLRId.cd.detectChanges();
            // // this.formDocumentTypeLRId.updateSelectedOption(model.documentTypeLRId);
            // // this.formDocumentTypeLRId.cd.detectChanges();

          }
      }

    }


    

    
  }

  inMemoryEditOpen(inMemoryModel: CompanyGovernmentalAgency, index: number){
    // this.inputCompanyGovernmentalAgency = inMemoryModel;
    this.visible = true;
    this.editRowIndex = index;
    this.EditOpenFlag = true;
    this.iniciarCampos(inMemoryModel);
    this.visible = true;
    this.inMemoryEdit = true;
  }

  hideDialog(): void {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea cerrar el panel de registro? perderá los cambios realizados.',
      accept: () => {
        this.visible = false;
        this.submitted = false;
        this.EditOpenFlag = false;
        this.showDialog = false;
        this.showDialogChange.emit(this.showDialog);
      }
    });             
  }

  ///////////////////////////////

   loadGovernmentalAgencies(pId) {
    var filter = new GovernmentalAgencyFilter();
    filter.country = pId;
    this._governmentalAgencyService.GetGovernmentalAgencies(filter).subscribe( (data: GovernmentalAgency[]) => {
      if (data != null) {
        this.governmentalAgencies = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.name
            }
        ));
    }
      this.governmentalAgencies.sort((a, b) => a.label.localeCompare(b.label));
    },
    (error) => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error cargando los Entes gubernamentales'});
    });
  }

   loadGovernmentalAgenciesShortNames(pId) {
    var filter = new GovernmentalAgencyFilter();
    filter.country = pId;
    
    this._governmentalAgencyService.GetGovernmentalAgencies(filter).subscribe( (data: GovernmentalAgency[]) => {
      if (data != null) {
          this.governmentalAgenciesShortNames = data.map<SelectItem>((item)=>(
              {
                value: item.id,
                label: item.name
              }
          ));
      }
      this.governmentalAgenciesShortNames.sort((a, b) => a.label.localeCompare(b.label));
    },
    (error) => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error cargando los Entes gubernamentales'});
    });
  }
  
   loadNaturalIdentifierTypesEdit() {
    // debugger;
    this._userService.getIdentifierTypes(-1, 1).subscribe( (data: IdentifierType[]) => {
      if (data != null) {
          this.identifierTypeOptionsEdit = data.map<SelectItem>((item)=>(
              {
                value: item.id,
                label: item.type.toString().concat(' ( ' + item.identifier + ' )')
              }
          ));
      }

      // this._userService.getIdentifierTypes(-1, 1).subscribe( res => {
      //   res.map((data) => {
      //     this.identifierTypeOptionsEdit.push({
      //       value: data.id,
      //       label: data.type.toString().concat(' ( ' + data.identifier + ' )')
      //     });
      //   });

      this.identifierTypeOptionsEdit.sort((a, b) => a.label.localeCompare(b.label));
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipo de documentos', detail: 'Error al cargar los tipos de documento'});
    });
  }
  
  //  loadNonNaturalIdentifierTypesEdit() {
  //   this._userService.getIdentifierTypes(-1, 2).subscribe( (data: IdentifierType[]) => {
  //     if (data != null) {
  //       this.nonNaturalIdentifierTypeOptionsEdit = data.map<SelectItem>((item)=>(
  //           {
  //             value: item.id,
  //             label: item.type.toString().concat(' ( ' + item.identifier + ' )')
  //           }
  //       ));
  //   }
  //     // res.map((data) => {
  //     //   this.nonNaturalIdentifierTypeOptionsEdit.push({
  //     //     value: data.id,
  //     //     label: data.type.toString().concat(' ( ' + data.identifier + ' )')
  //     //   });
  //     // });
  //     this.nonNaturalIdentifierTypeOptionsEdit.sort((a, b) => a.label.localeCompare(b.label))
  //   },
  //   (error) => {
  //     this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipo de documentos', detail: 'Error al cargar los tipos de documento'});
  //   });
  // }

   getCompanyGovernmentalAgency(pId){
    var filter = new CompanyGovernmentalAgencyFilter();
    filter.company = pId;
    this._companyGovernmentalAgencyService.getCompanyGovernmentalAgency(filter).subscribe((data: CompanyGovernmentalAgency[]) => {
      if (data != null) {
        // this.companyClass = data[0].name;
        // this.companyclassemit.emit(this.companyClass);
        console.log("getCompanyGovernmentalAgency");
        console.log(data);
        this._companyGovernmentalAgencies.emit(data);
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los Entes gubernamentales por Empresa"});
    });
  }
  
   getGovernmentalAgencies(pId){
    var filter = new GovernmentalAgencyFilter();
    filter.country = pId;
    this._governmentalAgencyService.GetGovernmentalAgencies(filter).subscribe((data:GovernmentalAgency[]) => {
      if (data != null) {
        // console.log("getGovernmentalAgency by Country");
        // console.log(data);
        this.governmentalAgencies = data.map<SelectItem>((item)=>(
          {
            label: item.name,
            value: item.id
          }
        ));
      }
      this.governmentalAgencies.sort((a, b) => a.label.localeCompare(b.label));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los entes gubernamentales"});
    });
  }
  
   getGovernmentalRecordsByAgency(e){
    var filter = new GovernmentalRecordFilter();
    // filter.governmentalAgency = e.value;
    filter.governmentalAgency = e;
    this._governmentalRecord.GetGovernmentalRecords(filter).subscribe((data: GovernmentalRecord[]) => {
      if (data != null) {
        // console.log("getGovernmentalRecords");
        // console.log(data);
        this.governmentalRecords = data.map<SelectItem>((item)=>(
          {
            label: item.name,
            value: item.id
          }
        ));
      }
      this.governmentalRecords.sort((a, b) => a.label.localeCompare(b.label));
      this.governmentalRecordTypes = [];
      // solo aplica si hay un solo registro
      // if(this.governmentalRecords.length == 1){
      //   this.formGovernmentalRecord.value = this.governmentalRecords[0].value;
      //   this.formGovernmentalRecord.selectedOption = this.governmentalRecords[0].value;
      //   this.formGovernmentalRecord.cd.detectChanges();
      //   this.getGovernmentalRecordTypes(this.governmentalRecords[0].value);
      // }
        this.governmentalRecords.sort((a, b) => a.label.localeCompare(b.label));
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de registros', detail: 'Error al cargar los registros gubernamentales'});
    });
  }

   getGovernmentalRecordTypes(e){
    var filter = new GovernmentalRecordTypeFilter();
    // filter.id = e.value;
    filter.id = e;

    this._governmentalRecordType.GetGovernmentalRecordTypes(filter).subscribe( (data: GovernmentalRecordType[]) => {
      if (data != null) {
        this.governmentalRecordTypes = data.map<SelectItem>((item)=>(
          {
            label: item.name,
            value: item.id,
          }
        ));
      }
      /// solo aplica si solo hay un tipo de registro para el registro gubernamental consultado
      // if(this.governmentalRecordTypes.length == 1){
      //   this.formGovernmentalRecordType.value = this.governmentalRecordTypes[0].value;
      //   this.formGovernmentalRecordType.selectedOption = this.governmentalRecordTypes[0].value;
      //   this.formGovernmentalRecordType.cd.detectChanges();
      this.governmentalRecordTypes.sort((a, b) => a.label.localeCompare(b.label));
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipo de registros', detail: 'Error al cargar los tipos de registro gubernamentales'});
    });
  }

   getBranchOffices(pCompanyId, pIndActivo, pCountryId){
    var filter = new BranchOfficeFilter();
    filter.idCompany = pCompanyId;
    filter.active = pIndActivo;
    this._branchOffice.GetBranchOffices(filter).subscribe((data:Branchoffice[]) => {
      if (data != null) {
        // console.log("getbranchOffices");
        // console.log(data);
        this.branchOffices = data.map<SelectItem>((item)=>(
          {
            label: item.branchOfficeName.trim(),
            value: item.id
          }
        ));
      }
       /// solo aplica si solo hay un registro
      //  if(this.branchOffices.length == 1){
      //     this.formBranchOffice.value = this.branchOffices[0].value;
      //     this.formBranchOffice.cd.detectChanges();
      //   }
        this.branchOffices.sort((a, b) => a.label.localeCompare(b.label));

    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de sucursales por empresa', detail: 'Error al cargar las sucursales por empresa'});
    });

  }

}
