// General
import { Component, Input, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, ElementRef, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { HttpErrorResponse, HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
//Models 
import { LaborRelationship } from '../../shared/models/laborRelationship/labor-relationship';
import { LaborRelationshipFilter } from '../../shared/filters/laborRelationship/labor-relationship-filter';
import { Employee } from '../../shared/models/laborRelationship/employee';
import { Address } from '../../shared/models/laborRelationship/address';
import { PayrollData } from '../../shared/models/laborRelationship/payroll-data';
import { MedicalCondition } from '../../shared/models/laborRelationship/medical-condition';
import { FamilyBurden } from '../../shared/models/laborRelationship/family-burden';
import { MaintenanceClaim } from '../../shared/models/laborRelationship/maintenance-claim';
import { Patology } from '../../shared/models/masters/patology';
import { PatologyType } from '../../shared/models/masters/patology-type';
import { Kinship } from '../../../../models/masters/kinship';
import { Grouping } from '../../shared/models/laborRelationship/grouping';
import { MedicalConditionViewModel } from '../../shared/view-models/medical-condition-viewmodel';
import { FamilyBurdenViewModel } from '../../shared/view-models/family-burden-viewmodel';
import { MaintenanceClaimViewModel } from '../../shared/view-models/maintenance-claim-viewmodel';
import { LaborRelationshipxGroupingViewModel } from '../../shared/view-models/labor-relationship-grouping-viewmodel';
import { GroupingViewModel } from '../../shared/view-models/grouping-viewmodel';
import { MedicalConditionFilter } from '../../shared/filters/laborRelationship/medical-condition-filter';
import { FamilyBurdenFilter } from '../../shared/filters/laborRelationship/family-burden-filter';
import { MaintenanceClaimFilter } from '../../shared/filters/laborRelationship/maintenance-claim-filter';
import { PatologyFilter } from '../../shared/filters/patology-filter';
import { PatologyTypeFilter } from '../../shared/filters/patology-type-filter';
import { KinshipFilter } from '../../../../models/masters/kinship-filter';
import { MedicalConditionDeletedFilter } from '../../shared/filters/laborRelationship/medical-condition-deleted-filter';
import { MaintenanceClaimDeletedFilter } from '../../shared/filters/laborRelationship/maintenance-claim-deleted-filter';
import { LaborRelationshipxGrouping } from '../../shared/models/laborRelationship/labor-relationship-grouping';
import { LaborRelationshipxGroupingList } from '../../shared/models/laborRelationship/labor-relationship-grouping-list';
import { LaborRelationshipxGroupingFilter } from '../../shared/filters/laborRelationship/labor-relationship-grouping-filter';
import { GroupingFilter } from '../../shared/filters/grouping-filter';
import { LaborRelationshipMinimumFilter } from '../../shared/filters/laborRelationship/labor-relationship-minimum-filter';

//services
import { LaborRelationshipService } from '../../../hcm/shared/services/labor-relationship.service';
import { MedicalConditionService } from '../../shared/services/medical-condition.service';
import { FamilyBurdenService } from '../../shared/services/family-burden.service';
import { MaintenanceClaimService } from '../../shared/services/maintenance-claim.service';
import { PatologyService } from '../../shared/services/patology.service';
import { PatologyTypeService } from '../../shared/services/patology-type.service';
import { KinshipService } from '../../../masters/kinship/shared/kinship.service';
import { LaborRelationshipxGroupingService } from '../../shared/services/labor-relationship-grouping.service';
import { GroupingService } from '../../shared/services/grouping.service';
import { CountryViewModel } from 'src/app/modules/users/shared/view-model/country.viewmodel';
import { MastersService } from 'src/app/modules/users/shared/masters.service';


//Theme components
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { DatePipe } from '@angular/common';
import { Bank } from 'src/app/models/masters/bank';
import { ColumnD } from 'src/app/models/common/columnsd';
import { PhoneNumber } from '../../shared/models/laborRelationship/phone-number';
import { AdditionalData } from '../../shared/models/laborRelationship/additional-data';
import { UserService } from '../../shared/services/user.service';
import { IdentifierType } from '../../shared/models/masters/IdentifierType';
import { InstructionDegreeService } from '../../shared/services/instruction-degree.service';
import { ProfessionalAreaService } from '../../shared/services/professional-area.service';
import { JobPositionService } from '../../shared/services/job-position.service';
import { JobPositionFilter } from '../../shared/filters/job-position-filter';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { JobPosition } from '../../shared/models/masters/job-position';
import { ProfessionalArea } from '../../shared/models/masters/professional-area';
import { InstructionDegree } from '../../shared/models/masters/instruction-degree';
import { InstructionDegreeFilter } from '../../shared/filters/instruction-degree-filter';
import { ProfessionalAreaFilter } from '../../shared/filters/professional-area-filter';
import { CityFilters } from 'src/app/models/masters/city-filters';
import { City } from 'src/app/models/masters/city';
import { CityService } from 'src/app/modules/masters/city/shared/services/city.service';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { CountryFilter } from 'src/app/modules/masters/country/shared/filters/country-filter';
import { Country } from 'src/app/models/masters/country';
import { MaritalStateFilter } from '../../shared/filters/marital-state-filter';
import { MaritalState } from '../../shared/models/masters/marital-state';
import { MaritalStateService } from '../../shared/services/marital-state.service';
import { CareCentreService } from '../../shared/services/care-centre.service';
import { CareCentre } from '../../shared/models/masters/care-centre';
import { CareCentreFilter } from '../../shared/filters/care-centre';
import { AntiquitySystemService } from '../../shared/services/antiquity-system.service';
import { AntiquitySystem } from '../../shared/models/masters/antiquity-system';
import { AntiquitySystemFilter } from '../../shared/filters/antiquity-system-filter';
import { StateService } from 'src/app/modules/masters/state/shared/services/state.service';
import { DistrictService } from 'src/app/modules/masters/district/shared/services/district.service';
import { StateFilters } from 'src/app/models/masters/state-filters';
import { HousingTypeService } from '../../shared/services/housing-type.service';
import { ParishService } from '../../shared/services/parish.service';
import { HousingTypeFilter } from '../../shared/filters/laborRelationship/housing-type-filter';
import { HousingType } from '../../shared/models/laborRelationship/housing-type';
import { Company } from '../../shared/models/masters/company';
import { CompanyService } from '../../shared/services/company.service';
import { BranchOfficeService } from '../../shared/services/branch-office.service';
import { CompaniesFilter } from '../../shared/filters/companies-filter';
import { BranchOfficeFilter } from '../../shared/filters/branch-office-filter';
import { BranchOffice } from '../../shared/models/masters/branch-office';
import { Dropdown } from 'primeng/dropdown';
import { CostCenterFilters } from 'src/app/modules/masters/cost-center/shared/filters/cost-center-filters';
import { CostCenter } from 'src/app/models/masters/cost-center';
import { CostCenterService } from 'src/app/modules/masters/cost-center/shared/services/cost-center.service';
import { ContractPeriodService } from '../../shared/services/contract-period.service';
import { ContractPeriodFilter } from '../../shared/filters/contract-period-filter';
import { ContractPeriod } from '../../shared/models/masters/contract-period';
import { WorkDayFilter } from '../../shared/filters/work-day-filter';
import { WorkDay } from '../../shared/models/masters/work-day';
import { WorkDayService } from '../../shared/services/work-day.service';
import { WorkShiftService } from '../../shared/services/work-shift.service';
import { WorkShiftFilter } from '../../shared/filters/work-shift-filter';
import { WorkShift } from '../../shared/models/masters/work-shift';
import { PayrollClassFilter } from '../../shared/filters/laborRelationship/payroll-class-filter';
import { PayrollClass } from '../../shared/models/laborRelationship/payroll-class';
import { PayrollClassService } from '../../shared/services/payroll-class.service';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { SalaryTypeService } from '../../shared/services/salary-type.service';
import { SalaryTypeFilter } from '../../shared/filters/salary-type-filter';
import { SalaryType } from '../../shared/models/masters/salary-type';
import { Motives } from 'src/app/models/masters/motives';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesType } from 'src/app/models/masters/motives-type';
import { AccountforPayrollData } from '../../shared/models/laborRelationship/accountforpayrolldata';
import { SalariesForPayrollData } from '../../shared/models/laborRelationship/salariesforpayrolldata';
import { debug } from 'console';
import { PaymentMethodFilter } from '../../shared/filters/laborRelationship/payment-method-filter';
import { PaymentMethodService } from '../../shared/services/payment-method.service';
import { PaymentMethod } from '../../shared/models/laborRelationship/payment-method';
import { CompanySupervisorFilter } from '../../shared/filters/companies-supervisor-filter';
import { PayrollDataService } from '../../shared/services/payroll-data.service';
import { CompanySupervisor } from '../../shared/models/masters/company-supervisor';
import { IdentifierTypeFilter } from '../../shared/filters/identifier-type-filter';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { Picture } from '../../shared/models/laborRelationship/picture';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { parse } from 'path';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { CurrentOfficeSelectorService } from 'src/app/modules/layout/panel-topbar/current-office-selector/shared/current-office-selector.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';

@Component({
  selector: 'app-companies-payroll-payrolldata',
  templateUrl: './companies-payroll-payrolldata.component.html',
  styleUrls: ['./companies-payroll-payrolldata.component.scss'],
  providers: [DatePipe]
})

export class CompaniesPayrollPayrolldataComponent implements OnInit, OnChanges {

  phonePrefixes: SelectItem<CountryViewModel[]> = {value: null};
  //// Sueldo
  @ViewChild("formTypeSalaryId", {read: Dropdown}) formTypeSalaryId: Dropdown;
  
  // @ViewChild("formTypeSalaryId") formTypeSalaryId: Dropdown;
  @ViewChild("formIdMotive", {read: Dropdown}) formIdMotive: Dropdown;
  ///////
  @ViewChild("formIdCitizenship", {read: Dropdown}) formIdCitizenship: Dropdown;
  ///////
  @Output() dataSave: EventEmitter<boolean> = new EventEmitter<boolean>();
  //ctor
  constructor(private messageService: MessageService,
    private LaborRelationshipService: LaborRelationshipService,
    private http: HttpClient,
    private actRoute: ActivatedRoute,
    // -------------- INFORMACIoN SOCIOECONoMICA -----------------------//
    private _patologyService: PatologyService,
    private _patologyTypeService: PatologyTypeService,
    private _medicalConditionService: MedicalConditionService,
    private _familyBurdenService: FamilyBurdenService,
    private _kinshipService: KinshipService,
    public datepipe: DatePipe,
    private _maintenanceClaimService: MaintenanceClaimService,
    public _groupingService: GroupingService,
    public _laborRelationshipxGroupingService: LaborRelationshipxGroupingService,
    private _userService: UserService,
    private _instructionDegreeService: InstructionDegreeService,
    private _professionalAreaService: ProfessionalAreaService,
    private _companyService: CompanyService,
    private _branchOfficeService: BranchOfficeService,
    private _jobPositionService: JobPositionService,
    private _countryService: CountryService,
    private _cityService: CityService,
    private _maritalStateService: MaritalStateService,
    private _careCentreService: CareCentreService,
    private _antiquitySystemService: AntiquitySystemService,
    private _stateService: StateService,
    private _districtService: DistrictService,
    private _housingTypeService: HousingTypeService,
    private _parishService: ParishService,
    private _costCenterService: CostCenterService,
    private _contractPeriodService: ContractPeriodService,
    private _authService: AuthService,
    private _mastersService: MastersService,
    private _payrollClassService: PayrollClassService,
    private _workDayService: WorkDayService,
    private _workShiftService: WorkShiftService,
    private _salaryTypeService: SalaryTypeService,
    private _motiveService: MotivesService,
    private _paymentMethodService: PaymentMethodService,
    private _payrollDataService: PayrollDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    public _Currency: CoinsService,
    private breadcrumbService: BreadcrumbService,
    private _selectorService: CurrentOfficeSelectorService, //Codigo para seleccionar Compañia/Sucursal
    private confirmationService: ConfirmationService,
    public userPermissions: UserPermissions,
  ) {
    this.yearRange = `${new Date().getFullYear() - 70}:${new Date().getFullYear()}`;
    this.birthYearRange = `${new Date().getFullYear() - 70}:${new Date().getFullYear() - 14}`;
    this.antiquityMaxDate = new Date();
    this._selectorService.setSelectorType(EnumOfficeSelectorType.company) //Selecciona la compañia en dropdown
    this.breadcrumbService.setItems([
      { label: 'HCM' },
      { label: 'Recursos humanos' },
      { label: 'Trabajadores', routerLink: ['/hcm/companiesemployee-list'] }
    ]);
   }
  ngOnChanges(changes: SimpleChanges): void {
    // debugger;
    // this.loadData();
    // if(changes){

    // }
  }

  permissionsIDs = { ...Permissions };
 
  yearRange: string;
  birthYearRange: string;
  antiquityMaxDate: Date;
  mainCurrency: string;
  idCountry: number;
  //inputs vars
  @Input()
  checked: boolean;
  @Input()
  activeIndex: number;
  //vars
  cols: any[];
  gender: any[];
  maritalStates: any[];
  documentType: any[];
  taxdocumentType: any[];
  citizenShips : any[];
  birthCities : any[];
  instructionDegrees : any[];
  professionalAreas : any[];
  careCenters : any[];
  bloodTypes : any[];
  lateralities:  any[];
  // AccountforPayrollDatas:  any[];
  companies:  any[];
  branchOffices:  any[];
  branchOfficeOption: any;
  jobPositions:  any[];
  jobPositionDropdown: any[];
  supervisors:  any[];
  costCenters:  any[];
  phoneNumbers:  any[];
  housingTypes:  any[];
  countries:  any[];
  states:  any[];
  municipalities:  any[];
  cities:  any[];
  parishes:  any[];
  formFixedPositionInd: any;
  formJobPositionInd: any;
  formSupervisorInd: any;
  payrollClasses: any[];
  paymentMethods: any[];
  workDays: any[];
  workShifts: any[];
  fechaIngreso: Date;
  fechaEgreso: Date;
  fechaAntiguedad: Date;
  fechaNacimiento: Date;
  fechaVigencia: Date;
  salaryBasic: SalariesForPayrollData;
  salaryTypes: SelectItem[];
  motives: SelectItem[];

  // TELEFONOS
  mobilePhone: PhoneNumber = new PhoneNumber();
  homePhone: PhoneNumber = new PhoneNumber();
  officePhone: PhoneNumber = new PhoneNumber();
  formMobilePhonePrefix: any;
  formMobilePhoneNumber: any;
  formHomePhonePrefix: any;
  formHomePhoneNumber: any;
  formOfficePhonePrefix: any;
  formOfficePhoneNumber: any;
  showPrefix: string;   //para mostrar el teléfono en la ficha
  showNumber: string;   //para mostrar el teléfono en la ficha
  ///////

  /////// sueldos
  auxTypeSalaryId: number;
  auxAmount: number = 0;
  auxIdmotive: number;
  //////////////////////////////////////////

  /////// cuentas bancarias
  payrollBankAccounts: AccountforPayrollData[] = [];
  clonedAccountforPayrollData: { [s: string]: AccountforPayrollData; } = {};
  
  newAccountforPayrollData: AccountforPayrollData;
  disabledSave: number = 0;

  @Output() backToCompaniesEmployee: EventEmitter<LaborRelationshipMinimumFilter[]> = new EventEmitter<LaborRelationshipMinimumFilter[]>();


  //////////////////////////////////////////

  @Input() _laborRelationshipMinimumFilters:  LaborRelationshipMinimumFilter[];



  fileName = '';
  age: number = 0;
  fixedPosition: string = '';
  genderValue: { name: string , value: string };
  bloodTypesValue: { name: string , value: string };
  lateralitiesValue: { name: string , value: string };
  //models vars
  _laborRelationship: LaborRelationship;
  _laborRelationshipFilter: LaborRelationshipFilter;
  // -------------- INFORMACIoN COMPLEMENTARIA -----------------------//
  antiquitySystems:  any[];
  contractPeriods:  any[];
  fixedPositions:  any[];

  // -------------- INFORMACIoN SOCIOECONoMICA -----------------------//
  idEmployed: number;
  idLaborRelationship: number;
  showSidebar1: boolean = false;
  showSidebar2: boolean = false;
  showSidebar3: boolean = false;
  showSidebar4: boolean = false;
  showSidebar5: boolean = false;
  _medicalConditionList: MedicalConditionViewModel[];
  medicalConditionFilter: MedicalConditionFilter = new MedicalConditionFilter();
  _familyBurdenList: FamilyBurdenViewModel[] = [];
  familyBurdenFilter: FamilyBurdenFilter = new FamilyBurdenFilter();
  medicalConditionModel: MedicalConditionViewModel;
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
  maintenanceClaimList: MaintenanceClaimViewModel[] = [];
  //maintenanceClaimList: MaintenanceClaimViewModel[] = [];
  maintenanceClaimFilter: MaintenanceClaimFilter = new MaintenanceClaimFilter();
  _laborRelationshipxGroupingList: LaborRelationshipxGrouping[] = [];
  _AccountforPayrollDataList: AccountforPayrollData[] = [];
  laborRelationshipxGroupingFilter: LaborRelationshipxGroupingFilter = new LaborRelationshipxGroupingFilter();
  grouping: Grouping;
  groupingFilter: GroupingFilter = new GroupingFilter();
  groupingList: Grouping[] = [];
  groupingListViewModel: GroupingViewModel[] = [];
  newGroupingModel: LaborRelationshipxGrouping;
  maxDate: Date = new Date();   //Para limitar el p-calendar

  submitError: boolean = false;
  housingError: boolean = false;
  apartmentError: boolean = false;
  mobilePhoneError: boolean = false;
  homePhoneError: boolean = false;
  officePhoneError: boolean = false;
  payrollDateError: boolean = false;
  emailError: boolean = false;
  emailCorpError: boolean = false;
  payrollError: boolean = false;
  noEgress: boolean = false;
  noAntig: boolean = false;
  noIngress: boolean = false;
  dataNoSave: boolean = false;
  disabledButton: boolean = false;
  phoneMessage: string = "";
  officcePhoneMessage: string = "";
  addressMessage: string = "";
  payrollMessage: string = "";
  auxId: number = -2;
  _validations:Validations = new Validations();
  
  listLaborRelationshipxGrouping: LaborRelationshipxGroupingList;
  @ViewChild("formCompanies") formCompanies: Dropdown;
  @ViewChild("formBloodType") formBloodType: Dropdown;
  @ViewChild("formLateralities") formLateralities: Dropdown;

  /// carga de imagen
  @ViewChild('fileUpload') fileUpload: FileUpload;

  //// viene de payroll-information
  //vars
  activeItem: MenuItem;
  // activeIndex: number;
  // checked: boolean;

  //Init
  laborRelationshipMinimumFilters: LaborRelationshipMinimumFilter[] = [];
  ////

  /////// calculo de antigüedad
  seniorityCalc: string="";
  //Init
  ngOnInit(): void {

  //// viene de payroll-information
  this.activeIndex = 0;
  this.checked = false;
  if (parseInt(sessionStorage.getItem('idLaborRelationship')) == -1) {
    this.checked = true;
    this.dataNoSave = true;
  }else{
    this.dataNoSave = false;
  }

  var filters = this.activatedRoute.snapshot.queryParamMap.get('laborRelationshipMinimumFilters');
  // 
  if (this.laborRelationshipMinimumFilters.length > 0) {
    this.laborRelationshipMinimumFilters = this.laborRelationshipMinimumFilters;
  } else {
    if (filters!=undefined) {
      const laborRelationshipMinimumFilters = filters;
      if (laborRelationshipMinimumFilters === null) {
        this.laborRelationshipMinimumFilters = [];
      } else {
        this.laborRelationshipMinimumFilters = JSON.parse(laborRelationshipMinimumFilters);
        sessionStorage.setItem('searchParameters', laborRelationshipMinimumFilters)
      }
    }else{
      this.laborRelationshipMinimumFilters = JSON.parse(sessionStorage.getItem('searchParameters'));
    }
  }
  
  var url = this.router.url.substring(0, this.router.url.indexOf('?')) == "" ? this.router.url : this.router.url.substring(0, this.router.url.indexOf('?'));
  this.router.navigateByUrl(url);
  ////////////////////////////

    this.cols = [
      { field: 'Deposito', header: 'Forma pago' },
      { field: 'name', header: 'Institución/Banco' },
      { field: 'category', header: 'Cuenta' },
      { field: 'quantity', header: 'Principal' }
    ];
    // DROPDOWNS FIJOS
    this.gender = [{  name: "Masculino" , value: "M" }, {  name: "Femenino", value: "F" }];
    this.bloodTypes = [{ name: "A+" , value:"A+" }, { name: "A-" ,value:"A-" },{ name: "AB+" , value:"AB+" }, { name: "AB-" ,value:"AB-" },{ name: "B+" , value:"B+" }, { name: "B-" ,value:"B-" }, { name: "O+" ,value:"O+" }, { name: "O-" ,value:"O-" }];
    this.lateralities = [{ name: "Diestro" , value:"Diestro" }, { name: "Siniestro" ,value:"Siniestro" }, { name: "Ambidiestro" ,value:"Ambidiestro" }];
    this.fixedPositions = [{ name: "Personal fijo" , value:"1" }, { name: "Personal rotativo" ,value:"0" }];

    
    //carga de dropdowns
    
    this.loadData();
    this.loadNaturalIdentifiersType();
    this.loadNonNaturalIdentifiersType();
    this.loadInstructionDegrees();
    this.loadProfessionalAreas();
    //this.loadCompanies();
    // this.loadBirthCities();
    this.onLoadGrouping();
    this.onLoadPatologyType();
    this.onLoadPatology();
    this.onLoadKinship();
    this.loadMaritalStates();
    this.loadCareCenters();
    this.loadAntiquitySystems();
    this.loadHousingTypes();
    this.loadCostCenters();
    this.loadContractPeriods();
    this.loadPayrollClasses();
    // this.loadWorkShifts();
    this.loadPaymentMethods();
    this.loadSupervisors();
    this.loadSalaryTypes();
    this.loadMotives(new MotivesFilters());
    //debugger;
    console.log(sessionStorage);
    this.changeDetectorRef.detectChanges();
  }

  getCompanyId(){
    debugger
    // obteniendo id de empresa en la variable localStorage
    var point1 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf(':');
    var point2 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf('}');
    var idC = localStorage.getItem("_CURRENT_OFFICE").substring(point1+1, point2);
    return idC;
  }

  //Load Data Method
  loadData() {
    this.loadCountriesCitizenshipNames();
    this.loadWorkDays();
    this._laborRelationshipFilter = new LaborRelationshipFilter();
    this._laborRelationshipFilter.idEmployee = parseInt(this.actRoute.snapshot.params['id']);
    this.idEmployed = this._laborRelationshipFilter.idEmployee;
    this.idLaborRelationship = parseInt(sessionStorage.getItem('idLaborRelationship'));

   var salary = new SalariesForPayrollData();

    salary = {

      salaryForLaborRelationShipId: -1,
      idLaborRelationship: -1,
      amount: this.auxAmount,
      motiveId: 4,
      typeSalaryId: 1,
      motive: "",
      typeSalary: "",
      validityDate: "",
      createdByUser: "",
      modifiedByUser: "",
      idCurrency:-1,                                                          
      currencySymbol:"",  
      abbreviation:"",  
      currency:"",    
   


    };

    if (this._laborRelationshipFilter.idEmployee != -1) {
        
        this._laborRelationshipFilter.idCompany = parseInt(this.getCompanyId());
        /////////////////////////////////
        this._laborRelationshipFilter.idLaborRelationship = parseInt(sessionStorage.getItem('idLaborRelationship'));
        this._laborRelationship = new LaborRelationship();
        // this._laborRelationship.employee = this._laborRelationship.employee == null?  new Employee() : this._laborRelationship.employee;
        // this._laborRelationship.payrollData = this._laborRelationship.payrollData == null ? new PayrollData() : this._laborRelationship.payrollData; 
        // this._laborRelationship.additionalData = this._laborRelationship.additionalData == null ? new AdditionalData() : this._laborRelationship.additionalData;
        this.LaborRelationshipService.GetLaborRelationship(this._laborRelationshipFilter).subscribe((data: LaborRelationship) => {
          this._laborRelationship = data;
          // debugger;
          this.onLoadlaborRelationshipxGrouping();
          
          this._laborRelationship.employee = this._laborRelationship.employee == null ? new Employee() : this._laborRelationship.employee;
          this._laborRelationship.employee.pictureSource = this._laborRelationship.employee.pictureSource == null?  "" : this._laborRelationship.employee.pictureSource;
          this._laborRelationship.employee.addresses = this._laborRelationship.employee.addresses == null ? new Address() : this._laborRelationship.employee.addresses;
          this._laborRelationship.employee.phoneNumbers = this._laborRelationship.employee.phoneNumbers == null ? new Array(new PhoneNumber()) : this._laborRelationship.employee.phoneNumbers;
          this._laborRelationship.payrollData = this._laborRelationship.payrollData == null ? new PayrollData() : this._laborRelationship.payrollData;
          this._laborRelationship.employee.additionalData = this._laborRelationship.employee.additionalData == null ? new AdditionalData() : this._laborRelationship.employee.additionalData;
          this._laborRelationship.payrollData.accountforPayrollData = this._laborRelationship.payrollData.accountforPayrollData == null ?  Array(new AccountforPayrollData()) : this._laborRelationship.payrollData.accountforPayrollData;
          // this._laborRelationship.employee.additionalData.height = this._laborRelationship.employee.additionalData.height == 0 ? null : this._laborRelationship.employee.additionalData.height
          // this._laborRelationship.employee.additionalData.weight = this._laborRelationship.employee.additionalData.weight == 0 ? null : this._laborRelationship.employee.additionalData.weight
          
          // this.loadDates();
          // this.loadGender();
          // this.loadBloodType();
          // this.loadLaterality();
          // this.loadAddress();
          // this.getPrefixes();
          // this.loadCompanies();
        

          if (this._laborRelationship.payrollData.salariesforPayrollData.length == 0) {
              this._laborRelationship.payrollData.salariesforPayrollData.push(salary);
              this.auxIdmotive = 4;
          } else {
            this._laborRelationship.payrollData.salariesforPayrollData = this._laborRelationship.payrollData.salariesforPayrollData;
            this.auxIdmotive = this._laborRelationship.payrollData.salariesforPayrollData[0].motiveId;
          }
          
          if (this._laborRelationship.employee != null ) {
            this.age = new Date().getFullYear() - new Date(this._laborRelationship.employee.birthDate).getFullYear();   //resto el año de nacimiento al año actual
            if(new Date().getMonth() < new Date(this._laborRelationship.employee.birthDate).getMonth()){  //Si el mes actual es menor al de nacimiento
              this.age--; //le falta mas de 1 mes para cumplir años
            }else{
              var day = new Date().getDate();   
              var birthDate = new Date(this._laborRelationship.employee.birthDate);
              birthDate.setMinutes(birthDate.getMinutes() + birthDate.getTimezoneOffset()); 
              var birthDateDay = birthDate.getDate(); //de igual manera si le faltan dias
              if(new Date().getMonth() == new Date(this._laborRelationship.employee.birthDate).getMonth() && day < birthDateDay){
                this.age--;
              }
            }
          } else {
            this.age = 0;
          }
          //debugger;
          if (this._laborRelationship.payrollData.fixedPositionInd) {
            this.fixedPosition = "Personal fijo"
            this.formFixedPositionInd = { name: "Personal fijo" , value:"1" };
          } else {
            this.fixedPosition = "Personal rotativo";
            this.formFixedPositionInd = { name: "Personal rotativo" ,value:"0" };
          }

          if (this._laborRelationship.payrollData.jobPositionId) {
            this.formJobPositionInd = { name: "Personal fijo" , value:"1" };
          } 
          
          // if (this._laborRelationship.employee.phoneNumbers != null || this._laborRelationship.employee.phoneNumbers != undefined ) {
          //   if (this._laborRelationship.employee.phoneNumbers.length > 0) {
          //     this.phoneNumbers = this._laborRelationship.employee.phoneNumbers;
          //     //this.formMobilePhonePrefix = this._laborRelationship.employee.phoneNumbers[0].
          //   }
          // }
          debugger;
          this.salaryBasic = new SalariesForPayrollData();
          this.salaryBasic = this._laborRelationship.payrollData.salariesforPayrollData.find(x => x.typeSalaryId == 1);
          if(this.salaryBasic){
            this.auxAmount = this.salaryBasic.amount ;
          }else{
            this.auxAmount = 0;
            this._laborRelationship.payrollData.salariesforPayrollData.push(salary);
          }
          if(this._laborRelationship.payrollData.islr){
            this._laborRelationship.payrollData.islr = parseInt(this._laborRelationship.payrollData.islr.toString());
          }
          this._AccountforPayrollDataList = this._laborRelationship.payrollData.accountforPayrollData;

          this.loadDates();
          this.loadGender();
          this.loadBloodType();
          this.loadLaterality();
          this.loadAddress();
          this.getPrefixes();
          this.loadCompanies();

          //debugger;
          if(parseInt(sessionStorage.getItem('idLaborRelationship')) != -1){
            var id1 = this.citizenShips.find(x => x.label == this._laborRelationship.employee.citizenshipName).value;
            this.filterCities(id1, false);

            if (this._laborRelationship.payrollData.workDay != "" && this._laborRelationship.payrollData.workDay != null) {
                var id2 = this.workDays.find(x => x.label == this._laborRelationship.payrollData.workDay).value;
                this.loadEmployeeWorkShifts(id2, this._laborRelationship.idCompany);
            }
          }

          console.log(this._laborRelationship);
        },
        (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar la información del trabajador" });
        });
      } else {
        
        this._laborRelationship = new LaborRelationship();
        this._laborRelationship.employee.employeeFirstName = "";  // inicializar nombre   (Bug 5393)
        this._laborRelationship.employee.employeeLastName = "";   // inicializar apellido (Bug 5393)
        // this._laborRelationship.idCompany = parseInt(sessionStorage.getItem("DropDownIdCompany"));
        this._laborRelationship.idCompany = parseInt(this.getCompanyId());
        this._laborRelationship.payrollData.salariesforPayrollData.push(salary);
        console.log(this._laborRelationship.idCompany);
        this.getPrefixes();
        this.loadCompanies();
      }
      
    //this.loadJobPositions();
    
  }

cargar(evento){
  this._laborRelationship.employee.gender =  evento.value.value;
  //this.genderValue = evento.value.value;
  console.log(this.genderValue);
  this.changesInMemory();
}

cargarTipoSangre(evento){
  this._laborRelationship.employee.additionalData.bloodType =  evento.value.name;
  this.changesInMemory();
}

cargarLateralidad(evento){
  this._laborRelationship.employee.additionalData.laterality =  evento.value.name;
  this.changesInMemory();
}

cargarCiudad(evento){
  this._laborRelationship.employee.addresses.city =  evento.value.name;
  this.changesInMemory();
}

getPrefixes() {
 
  return this._mastersService.getCountries( -1, -1)
  .then(countries => {
      const phonePrefixes: CountryViewModel[] = [];
      
      countries.forEach(country => {
        phonePrefixes.push({
          id: country.id,
          code: country.code,
          codePrefix: country.code + ' +' +  country.prefix,
          prefix: country.prefix
        });
      });
     
      this.phonePrefixes.value = phonePrefixes.sort((a, b) => a.codePrefix.localeCompare(b.codePrefix));
      this.loadPhoneNumbers();
    }).catch(error => {
      this.messageService.add({key: 'register-user', severity: 'error', summary: 'Cargar datos', detail: error.message});
    });
}

mobileChange(e){
  
  
}

//Save Employee Data Method
saveEmployee(_laborRelationship: LaborRelationship, ind: number) {
  debugger;
  if(ind == 1){
    document.getElementById("saving1").setAttribute("disabled","disabled");
  }else{
    document.getElementById("saving2").setAttribute("disabled","disabled");
  }

  if(_laborRelationship.employee.idDocumentType === undefined || _laborRelationship.employee.documentNumber == '' || _laborRelationship.employee.documentNumber === undefined ||
    _laborRelationship.employee.idTaxDocumentType === undefined || _laborRelationship.employee.taxDocumentNumber == '' || _laborRelationship.employee.taxDocumentNumber === undefined ||
    this.fechaNacimiento == null || _laborRelationship.employee.gender == '' || _laborRelationship.employee.gender === undefined || _laborRelationship.employee.idMaritalState === undefined ||
    _laborRelationship.employee.idCitizenship === undefined || _laborRelationship.employee.employeeLastName == '' || _laborRelationship.employee.employeeLastName === undefined ||
    _laborRelationship.employee.employeeFirstName == '' || _laborRelationship.employee.employeeFirstName === undefined || _laborRelationship.employee.idBirthCity === undefined ||
    _laborRelationship.employee.idInstructionDegree === undefined || _laborRelationship.employee.email == '' || _laborRelationship.employee.email === undefined || 
    _laborRelationship.employee.additionalData.idHealthCenter === undefined || _laborRelationship.employee.additionalData.idHealthCenter == -1 ||
    _laborRelationship.employee.insuranceNumber == '' || _laborRelationship.employee.insuranceNumber === undefined ||
    _laborRelationship.employee.addresses.avenueName == '' || _laborRelationship.employee.addresses.avenueName === undefined || _laborRelationship.employee.addresses.streetName == '' || 
    _laborRelationship.employee.addresses.streetName === undefined || _laborRelationship.employee.addresses.idHousingType === undefined || _laborRelationship.employee.addresses.references == '' || 
    _laborRelationship.employee.addresses.references === undefined  || _laborRelationship.employee.addresses.idCountry === undefined || _laborRelationship.employee.addresses.idState === undefined ||
    _laborRelationship.employee.addresses.idMunicipality === undefined || _laborRelationship.employee.addresses.idCity === undefined || _laborRelationship.employee.addresses.idParish === undefined )
  {
    this.submitError = true;
  }else{
    this.submitError = false;
  }

  this.validatePhone(false);
  this.validatePayrollDate(false);
  
  if(this.submitError || this.housingError || this.apartmentError || this.mobilePhoneError || this.homePhoneError || this.officePhoneError || this.payrollError || this.emailError || this.emailCorpError){
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Se deben completar los campos requeridos de manera correcta" });
  } else {
    //this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso", life: 5000 });
    if (this.formFixedPositionInd == undefined) {
        _laborRelationship.payrollData.fixedPositionInd = true;
        this.formFixedPositionInd = { name: "Personal fijo" , value:"1" };
    } else {
      if (this.formFixedPositionInd.value == "1") {
          _laborRelationship.payrollData.fixedPositionInd = true;
        } else {
          _laborRelationship.payrollData.fixedPositionInd = false;
        }
    }
    //debugger;
    _laborRelationship.branchOfficeId = this._laborRelationship.branchOfficeId == null || this._laborRelationship.branchOfficeId == undefined ? 1 : this._laborRelationship.branchOfficeId;
    _laborRelationship.employee.idProfessionalArea = this._laborRelationship.employee.idProfessionalArea == null || this._laborRelationship.employee.idProfessionalArea == undefined ? 1 : this._laborRelationship.employee.idProfessionalArea;
    _laborRelationship.employee.birthDate = this.fechaNacimiento == null || this.fechaNacimiento == undefined ? "1900-01-01" : this.toDate(this.fechaNacimiento);
    _laborRelationship.payrollData.fixedPositionInd = this.formFixedPositionInd.value == "1" ? true : false;
    _laborRelationship.payrollData.employmentDate = this.fechaIngreso == null || this.fechaIngreso == undefined ? "1900-01-01" : this.toDate(this.fechaIngreso);
    _laborRelationship.payrollData.egressDate = this.fechaEgreso == null || this.fechaEgreso == undefined ? "1900-01-01" : this.toDate(this.fechaEgreso);
    _laborRelationship.payrollData.seniorityDate = this.fechaAntiguedad == null || this.fechaAntiguedad == undefined ? "1900-01-01" : this.toDate(this.fechaAntiguedad);
    _laborRelationship.payrollData.jobPositionId = this._laborRelationship.payrollData.jobPositionId == null || this._laborRelationship.payrollData.jobPositionId == undefined ? 1 : this._laborRelationship.payrollData.jobPositionId;
    _laborRelationship.payrollData.idAntiquitySystem = this._laborRelationship.payrollData.idAntiquitySystem == null || this._laborRelationship.payrollData.idAntiquitySystem == undefined ? 1 : this._laborRelationship.payrollData.idAntiquitySystem;
    _laborRelationship.payrollData.islr = this._laborRelationship.payrollData.islr == null || this._laborRelationship.payrollData.islr == undefined ? 0 : this._laborRelationship.payrollData.islr;
    _laborRelationship.payrollData.supervisorOperative = this._laborRelationship.payrollData.supervisorOperative;
        
    if(_laborRelationship.employee.additionalData.shirtSize != undefined && _laborRelationship.employee.additionalData.shirtSize != ""){
      _laborRelationship.employee.additionalData.shirtSize = _laborRelationship.employee.additionalData.shirtSize.toUpperCase();
    }
   
    if(_laborRelationship.payrollData.salariesforPayrollData == null || _laborRelationship.payrollData.salariesforPayrollData == undefined){
      _laborRelationship.payrollData.salariesforPayrollData = Array(new SalariesForPayrollData());
    }

    if(this.auxTypeSalaryId != null || this.auxTypeSalaryId != undefined || this.auxTypeSalaryId != -1){
      if(this.auxIdmotive != null || this.auxIdmotive != undefined || this.auxIdmotive != -1){
        if(this.auxAmount != null || this.auxAmount != undefined || this.auxAmount > 0){
          if(_laborRelationship.payrollData.salariesforPayrollData.length == 0){
             var aux: SalariesForPayrollData = new SalariesForPayrollData();
             aux.idLaborRelationship = _laborRelationship.idLaborRelationship;
             aux.salaryForLaborRelationShipId = -1;
             aux.typeSalary = "";
             aux.amount = this.auxAmount;
             aux.motiveId = this.auxIdmotive;
             aux.typeSalaryId = this.auxTypeSalaryId;
             aux.validityDate = this.fechaVigencia == null || this.fechaVigencia == undefined ? "1900-01-01" : this.toDate(this.fechaVigencia);
             _laborRelationship.payrollData.salariesforPayrollData.push(aux);
          }else{
            _laborRelationship.payrollData.salariesforPayrollData.find(x => x.typeSalaryId == this.auxTypeSalaryId).amount = this.auxAmount;
            _laborRelationship.payrollData.salariesforPayrollData.find(x => x.typeSalaryId == this.auxTypeSalaryId).motiveId = this.auxIdmotive;
            _laborRelationship.payrollData.salariesforPayrollData.find(x => x.typeSalaryId == this.auxTypeSalaryId).typeSalaryId = this.auxTypeSalaryId;
            _laborRelationship.payrollData.salariesforPayrollData.find(x => x.typeSalaryId == this.auxTypeSalaryId).validityDate = this.fechaVigencia == null || this.fechaVigencia == undefined ? "1900-01-01" : this.toDate(this.fechaVigencia);
          }
        }
      }
    }
    //debugger;
    _laborRelationship.employee.phoneNumbers = [];

    if(this.mobilePhone.idPhoneNumber == -1){
      this.mobilePhone.idPhoneNumberType = 3;
    }
    this.mobilePhone.idCountry = this.formMobilePhonePrefix.id;
    _laborRelationship.employee.phoneNumbers.push(this.mobilePhone);

    if(!(this.homePhone.number == "" || this.homePhone.number === undefined))
    {
      this.homePhone.idPhoneNumberType = 2;
      this.homePhone.idCountry = this.formHomePhonePrefix.id;
      _laborRelationship.employee.phoneNumbers.push(this.homePhone);
    }

    if(!(this.officePhone.number == "" || this.officePhone.number === undefined))
    {
      this.officePhone.idPhoneNumberType = 4;
      this.officePhone.idCountry = this.formOfficePhonePrefix.id;
      _laborRelationship.employee.phoneNumbers.push(this.officePhone);
    }

    _laborRelationship.payrollData.accountforPayrollData = this._AccountforPayrollDataList;

    console.log(_laborRelationship); //para verificar el objeto en calidad - NO BORRAR

    this.LaborRelationshipService.InsertLaborRelationship(_laborRelationship).subscribe((data: number) => {
      if (data > 0){
        sessionStorage.setItem('idLaborRelationship', data.toString());
        this._laborRelationship.idLaborRelationship = data;
        this.idLaborRelationship = data;
        this._laborRelationship.idEstatus = 38;
        this._laborRelationship.idCompany = parseInt(this.getCompanyId());
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso", life: 5000 });
        this.dataNoSave = false;
        this.LaborRelationshipService.GetLaborRelationshipEmployeeId(data).subscribe((result: number) => {
          this.idEmployed = result;
          var url = "hcm/companies-payroll-payrolldata/" + result;
          this.router.navigateByUrl(url);
          location.assign(url);
        },
        (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el trabajador insertado" });
         });
      }else if(data == 0) {    //de lo contrario se evalua (validaciones de otros módulos)
       this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al insertar trabajador." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El numero de documento se encuentra registrdo" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
    },
        (error: HttpErrorResponse) => {
         this.messageService.add({ severity: 'error', summary: 'Inserción', detail: "Ha ocurrido un error al insertar trabajador" });
       });
    }   
    if(ind == 1){
      document.getElementById("saving1").removeAttribute("disabled");
    }else{
      document.getElementById("saving2").removeAttribute("disabled");
    } 
}
  
toDate(str: string | Date) {
  if (!str) {
    return undefined
  }
  const d = new Date(str)
  const padLeft = (n: number) => ("00" + n).slice(-2)
  const dformat = [
    d.getFullYear(),
    padLeft(d.getMonth() + 1),
    padLeft(d.getDate()),
  ].join('-');
  return dformat
}

  //Get a File
  UploaderFile(event) {
    const file: File = event.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.fileName = event.target.result;
        debugger;
        /////
        this._laborRelationship.employee.picture = new Picture();
        this._laborRelationship.employee.picture.url = event.target.result;
        this._laborRelationship.employee.picture.pictureBase64 = event.target.result;
        this._laborRelationship.employee.pictureSource = event.target.result;
        this._laborRelationship.employee.picture.name = file.name;
        this.fileUpload.clear();
      }
    }
    //this.changesInMemory();       //asignar a todas las funciones donde los valores cambian
  }

  validateFile(event) {
    const type = event.files[0].type;
    debugger;
    if (type != "") {
      if (!type.includes("jpg") && !type.includes("jpeg") && !type.includes("gif") && !type.includes("png") && !type.includes("webp")) {
        this.messageService.add({severity: 'error', summary: 'Carga de imagen', detail: 'Formato de archivo no permitido'});
      }
    } else {
        this.messageService.add({severity: 'error', summary: 'Carga de imagen', detail: 'Error al cargar la imagen'});
    }
  }

  validateAddresses(){
    //
    if(this._laborRelationship.employee.addresses.idHousingType != undefined){
      if(this._laborRelationship.employee.addresses.idHousingType == 4){
        this.apartmentError = true;
        this.housingError = false;
        this._laborRelationship.employee.addresses.housingNumber = "";
        this.addressMessage = "Se deben completar todos los campos asociados al tipo de vivienda edificio";
      }else{
        this.housingError = true;
        this.apartmentError = false;
        this._laborRelationship.employee.addresses.apartment == '';
        this._laborRelationship.employee.addresses.buildingName == ''; 
        this._laborRelationship.employee.addresses.floor == '';
        this.addressMessage = "Debe completar el campo número de vivienda";
      }
    }
    this.changesInMemory();
  }

  completeHousingName(){
    //
    if(this._laborRelationship.employee.addresses.housingNumber == undefined || this._laborRelationship.employee.addresses.housingNumber == ""){
      this.addressMessage = "Debe completar el campo número de vivienda";
      this.housingError = true;
    }else{
      this.addressMessage = "";
      this.housingError = false;
    }
    this.changesInMemory();
  }

  completebuildingData(){
    var incomplete1: boolean = false;
    var incomplete2: boolean = false;
    var incomplete3: boolean = false;
    if(this._laborRelationship.employee.addresses.buildingName == undefined || this._laborRelationship.employee.addresses.buildingName == ""){
      incomplete1 = true;
    }else{
      incomplete1 = false;
    }

    if(this._laborRelationship.employee.addresses.apartment == undefined || this._laborRelationship.employee.addresses.apartment == ""){
      incomplete2 = true;
    }else{
      incomplete2 = false;
    }

    if(this._laborRelationship.employee.addresses.floor == undefined || this._laborRelationship.employee.addresses.floor == ""){
      incomplete3 = true;
    }else{
      incomplete3 = false;
    }

    if(incomplete1 || incomplete2 || incomplete3){
      this.addressMessage = "Se deben completar todos los campos asociados al tipo de vivienda edificio";
      this.apartmentError = true;
    }else{
      this.addressMessage = "";
      this.apartmentError = false;
    }
    this.changesInMemory();
  }

  validatePhone(val: boolean){
    var incomplete1: number = 0;
    var incomplete2: number = 0;
    var incomplete3: number = 0;

    if((this.formMobilePhonePrefix == null || this.formMobilePhonePrefix === undefined) || (this.mobilePhone.number == "" || this.mobilePhone.number === undefined))
    {
      incomplete1 = 2;
    }

    if((this.formMobilePhonePrefix == null || this.formMobilePhonePrefix === undefined) && (this.mobilePhone.number == "" || this.mobilePhone.number === undefined))
    {
      incomplete1 = 1;
    }

    if((this.formHomePhonePrefix == null || this.formHomePhonePrefix === undefined) || (this.homePhone.number == "" || this.homePhone.number === undefined))
    {
      incomplete2 = 2;
    }

    if((this.formHomePhonePrefix == null || this.formHomePhonePrefix === undefined) && (this.homePhone.number == "" || this.homePhone.number === undefined))
    {
      incomplete2 = 1;
    }
    if((this.formOfficePhonePrefix == null || this.formOfficePhonePrefix === undefined) || (this.officePhone.number == "" || this.officePhone.number === undefined))
    {
      incomplete3 = 2;
    }

    if((this.formOfficePhonePrefix == null || this.formOfficePhonePrefix === undefined) && (this.officePhone.number == "" || this.officePhone.number === undefined))

    {
      incomplete3 = 1;
    }

    if(incomplete1 == 1){
      this.mobilePhoneError = true;
      this.phoneMessage = "Debe ingresar el teléfono móvil";
    }else{
      this.mobilePhoneError = false;
      this.homePhoneError = false;
      if(incomplete1 == 2){
        this.mobilePhoneError = true;
        this.phoneMessage = "Debe ingresar el teléfono móvil correctamente";
      }else{
        this.mobilePhoneError = false;
        this.phoneMessage = "";
      }
    }
   if(incomplete2 == 2){
        this.homePhoneError = true;
        this.officcePhoneMessage = "Debe ingresar el teléfono residencial correctamente";
    }
   if(incomplete3 == 2){
      this.officePhoneError = true;
      if(incomplete2 == 2){
        this.officcePhoneMessage = "Debe ingresar el teléfono residencial y de trabajo correctamente";
      }else{
        this.officcePhoneMessage = "Debe ingresar el teléfono de trabajo correctamente";
      }
    }
    if((incomplete3 != 2 && incomplete2 != 2)){
      this.homePhoneError = false;
      this.officePhoneError = false;
      this.officcePhoneMessage = "";
    }

    if(val){
      this.changesInMemory();
    }
  }

  validatePrefix(value: any, val: boolean){
    // //debugger;
    this.showPrefix = "+"+value.prefix;
    this.validatePhone(val);
    if(val){
      this.changesInMemory();
    }
  }

  validatePayrollDate(val: boolean){
    var cont = 0;

    if (this.fechaIngreso != null && this.fechaIngreso != undefined) {  //si se completó el campo fechaIngreso
      cont++; //incremento
    }
    if (this.fechaAntiguedad != null && this.fechaAntiguedad != undefined) {  //si se completó el campo fechaAntiguedad
      cont++; //incremento
    }

    if(cont == 2){  //si se completaron los campos fechaIngreso y fechaAntiguedad
      if(this.fechaIngreso < this.fechaAntiguedad){ 
        this.noEgress = true;   //la fecha de ingreso es menor a la de antigüedad
      }else{
        this.noEgress = false;  //la fecha de ingreso no es menor a la de antigüedad
      }
    }
    
    if(cont > 0 && this.fechaEgreso != null && this.fechaEgreso != undefined){  //comparo contra la fecha de egreso
      if (this.fechaIngreso != null && this.fechaIngreso != undefined && this.fechaIngreso > this.fechaEgreso) {
        this.noAntig = true;    //la fecha de ingreso es mayor a la de egreso
      }else{
        this.noAntig = false;    //la fecha de ingreso no es mayor a la de egreso
      }

      if(this.fechaAntiguedad != null && this.fechaAntiguedad != undefined && this.fechaAntiguedad > this.fechaEgreso){
        this.noIngress = true;    //la fecha de antigüedad es mayor a la de egreso
      }else{
        this.noIngress = false;   //la fecha de antigüedad no es mayor a la de egreso
      }
    }

    if(this.noIngress || this.noEgress || this.noAntig){    //si hubo algún error
      this.payrollError = true;     //muestra estilo
    }else{
      this.payrollError = false;    //oculta estilo
    }

    if(val){
      this.changesInMemory();
    }

  }

  // validateNumberPhone(value: any){
  //   
  //   this.showNumber = value.toString();
  //   this.validatePhone();
  // }

  validateEmail(inp, number){
    if(inp == null || inp == undefined || inp == ""){
      this.emailError = false;    //no evalúes
    }else{
      if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inp)) { //si cumple el formato
          if(number == 1){
            this.emailError = false;                  //no hagas nada emailCorpError
          }else{
            this.emailCorpError = false; 
          }
      } else {
        if(number == 1){
          this.emailError =  true;                  //manda el error
        }else{
          this.emailCorpError = true; 
        }
      }
    }
    this.changesInMemory();
  }

  calculateFinishDate(e) {
    var a = e.originalEvent.srcElement.innerText;
    var calc = a.substring(a.indexOf("(")+1, a.indexOf(")"));
    
    var duration = calc.substring(0, calc.indexOf(" ") );
    var unit = calc.substring(calc.indexOf(" ")+1).toLowerCase();

    if(this.fechaIngreso == undefined) {
        this.messageService.add({ severity: 'error', summary: 'Cálculo', detail: "Debe elegir una fecha de ingreso para realizar el cálculo de la fecha de egreso" });
    } else {
        this.fechaEgreso = new Date();
        switch ( unit ) {
          case "a�o":
            this.fechaEgreso.setFullYear( this.fechaIngreso.getFullYear() + parseInt(duration) );
          break;
          case "mes":
            this.fechaEgreso.setMonth( this.fechaIngreso.getMonth() + parseInt(duration) );
          break;
        }
    }
    this.changesInMemory();
  }

  // -------------- INFORMACIoN SOCIOECONoMICA -----------------------//
  onLoadPatologyType(){
    this._patologyTypeService.getPatologyType(this.patologyTypeFilter).subscribe((list1: PatologyType[]) => {
      this._patologyTypeList = list1;
      //
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las patologí­as" });
    });
  }
  
  onLoadPatology(){
    this._patologyService.getPatology(this.patologyFilter).subscribe((list2: Patology[]) => {
      this._patologyList = list2;
      this.onLoadMedicalConditionList();
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos de patologí­as" });
    });
  }

  onLoadKinship(){
    this._kinshipService.getKinshipList(this.kinshipFilter).subscribe((list: Kinship[]) => {
      this._kinshipList = list;
      this.onLoadFamilyBurdenList();
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los parentescos" });
    });
  }

  onLoadGrouping(){
    this.groupingFilter.idGroupingType = 2;
    this._groupingService.getGrouping(this.groupingFilter).subscribe((data: Grouping[]) =>{
      this.groupingList = data;
      //
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las agrupaciones" });
    });
  }

  onLoadlaborRelationshipxGrouping(){
    this.laborRelationshipxGroupingFilter.idLaborRelationship = this.idLaborRelationship;
    this._laborRelationshipxGroupingService.getLaborRelationshipxGrouping(this.laborRelationshipxGroupingFilter).subscribe((data: LaborRelationshipxGrouping[]) =>{
     if(data != null){
      data.forEach(element => {
        if(element.assignedValue == undefined){
          element.assignedValue = null;
        }
      });
     }
      this._laborRelationshipxGroupingList = data;
      //
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las agrupaciones por relaciones laborales" });
    });
  }

  onLoadMedicalConditionList(){
    this.medicalConditionFilter.idEmployee = parseInt(this.actRoute.snapshot.params['id']); //parseInt(this.actRoute.snapshot.params['id'])
    
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
          object.patology = this._patologyList.find(x => x.id == element.idPatology).patologyName;
          object.idPatologyType = this._patologyList.find(x => x.id == element.idPatology)?.idPatologyType;
          object.patologyType = this._patologyTypeList.find(x => x.id == object.idPatologyType )?.patologyTypeName;
          object.startDate = element.startDate;
          object.patology = this._patologyList.find(x => x.id == element.idPatology)?.patologyName;
          object.startDateString = this.datepipe.transform(element.startDate, "dd/MM/yyyy");
          this._medicalConditionList.push(object);
          //
        });
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las afecciones médicas" });
    });   
  }

  listFamilyBurden(aux: FamilyBurden[]): FamilyBurdenViewModel[]{
    var arrayFamilyBurden: FamilyBurdenViewModel[] = [];
    
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
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las cargas familiares" });
    });
  }

  onLoadMaintenanceClaimList(){
    this.maintenanceClaimFilter.idLaborRelationship = this.idLaborRelationship;
    this._maintenanceClaimService.getMaintenanceClaim(this.maintenanceClaimFilter).subscribe((list) => {
      var data = list;
      this.maintenanceClaimList = [];
      data.forEach(element =>{
        var object: MaintenanceClaimViewModel = new MaintenanceClaimViewModel();
        object.idLaborRelationship = element.idLaborRelationship;
        object.idLaborRelationshipxFamilyBurden = element.idLaborRelationshipxFamilyBurden;
        object.idMaintenanceClaim = element.idMaintenanceClaim;
        object.idSalaryType = element.idSalaryType;
        object.amount = element.amount;
        object.beneficiary = element.beneficiary;
        object.documentNumberBeneficiary = element.documentNumberBeneficiary;
        object.firstNameBeneficiary = element.firstNameBeneficiary;
        object.lastNameBeneficiary = element.lastNameBeneficiary;
        object.legalRepresentative = element.firstNameBeneficiary+" "+element.lastNameBeneficiary;
        object.paymentsDeductionFlag = element.paymentsDeductionFlag;
        object.porcentage = element.porcentage;
        object.recordNumber = element.recordNumber;
        object.salaryType = this.salaryTypes.find(x => x.value == element.idSalaryType).label;
        object.iDocumentTypeBeneficiary = element.iDocumentTypeBeneficiary;
        object.createdByUserId = element.createdByUserId;
        object.updatedByUserId = element.updatedByUserId;
        this.maintenanceClaimList.push(object);
      });

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
      console.log(this.familyBurdenModel.birthDate);
      this.showSidebar2 = true;
    }
  }

  sendMedicalConditionPanel(modelInput: MedicalConditionViewModel){
    //
    if(modelInput.idMedicalCondition == -1){
      this.medicalConditionModel = new MedicalConditionViewModel();
      this.medicalConditionModel.idEmployee = this.idEmployed;
      this.medicalConditionModel.idLaborRelationship = this.idLaborRelationship;
      this.medicalConditionModel.idMedicalCondition = -1;
      this.medicalConditionModel.idPatology = -1;
      this.medicalConditionModel.idPatologyType = -1;
      this.medicalConditionModel.observation = "";
      this.showSidebar1 = true;
    }else{
      this.medicalConditionModel = new MedicalConditionViewModel();
      this.medicalConditionModel.idEmployee = modelInput.idEmployee;
      this.medicalConditionModel.idLaborRelationship = modelInput.idLaborRelationship;
      this.medicalConditionModel.idMedicalCondition = modelInput.idMedicalCondition;
      this.medicalConditionModel.idPatology = modelInput.idPatology;
      this.medicalConditionModel.idPatologyType = modelInput.idPatologyType;
      this.medicalConditionModel.startDate = modelInput.startDate;
      this.medicalConditionModel.observation = modelInput.observation;
      this.showSidebar1 = true;
    }
  }

  sendMaintenanceClaimPanel(modelInput: MaintenanceClaimViewModel){
    var salary = this._laborRelationship.payrollData.salariesforPayrollData.find(x => x.typeSalaryId == 1);
    if(salary.amount != 0){
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
      //
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "El trabajador no posee sueldo." });
    }
  }

  sendGroupingPanel(){
      this.newGroupingModel = new LaborRelationshipxGroupingViewModel();
      this.newGroupingModel.idGrouping = 2;
      this.newGroupingModel.idLaborRelationship = this.idLaborRelationship;
      this.newGroupingModel.idLaborRelationshipxGrouping = -1;
      this.newGroupingModel.abbreviation = "";
      this.newGroupingModel.groups = "";
      this.newGroupingModel.assignedValue = "";
      this.newGroupingModel.active = true;
      this.newGroupingModel.createdByUserId = -1;
      this.newGroupingModel.updatedByUserId = -1;
      this.showSidebar4 = true;
  }
  
  
  ////////////  CUENTAS BANCARIAS
  sendAccountforPayrollDataPanel(record: AccountforPayrollData){
    //
    this.newAccountforPayrollData = new AccountforPayrollData();
    if(record.accountforPayrollDataId == -1){      //creando nueva cuenta
      this.newAccountforPayrollData.idLaborRelationship = -1;
      this.newAccountforPayrollData.accountNumber = "";
      this.newAccountforPayrollData.accountforPayrollDataId = -1;
      this.newAccountforPayrollData.bank = "";
      this.newAccountforPayrollData.bankId = -1;
      this.newAccountforPayrollData.indActive = false;
      this.newAccountforPayrollData.typeAccount = "";
      this.newAccountforPayrollData.typeAccountId = -1;
    }else{    //editando cuenta
      this.newAccountforPayrollData.idLaborRelationship = record.idLaborRelationship;
      this.newAccountforPayrollData.accountNumber = record.accountNumber;
      this.newAccountforPayrollData.accountforPayrollDataId = record.accountforPayrollDataId;
      this.newAccountforPayrollData.bank = record.bank;
      this.newAccountforPayrollData.bankId = record.bankId;
      this.newAccountforPayrollData.indActive = record.indActive;
      this.newAccountforPayrollData.typeAccount = record.typeAccount;
      this.newAccountforPayrollData.typeAccountId = record.typeAccountId;
    }
    //this.newAccountforPayrollData.idLaborRelationship = parseInt(sessionStorage.getItem('idLaborRelationship'));
    this.showSidebar5 = true;
  }
  
  saveAccountforPayrollData(record){
    //var search: boolean = false;
    //
    var error: boolean = false;
    this.payrollBankAccounts = this._AccountforPayrollDataList;
    var list = [];
    console.log(this.payrollBankAccounts);
    if (this.payrollBankAccounts.length > 0) {
      this.payrollBankAccounts.forEach(element => {
        if(element.bankId == record.bankId && element.typeAccountId == record.typeAccountId && element.accountNumber == record.accountNumber 
          && element.accountforPayrollDataId != record.accountforPayrollDataId)
        {
          error = true;
        }
      });
        
      if(error){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro ya se encuentra en la lista." });
      }else{
        if (this.payrollBankAccounts.find(x => x.accountforPayrollDataId == record.accountforPayrollDataId) == undefined ||
        this.payrollBankAccounts.find(x => x.accountforPayrollDataId == record.accountforPayrollDataId) == null)
        {
          record.accountforPayrollDataId = this.auxId;
          this.payrollBankAccounts.push(record);
          this.auxId--;
        }else{
          var index = this.payrollBankAccounts.findIndex(x => x.accountforPayrollDataId == record.accountforPayrollDataId);
          list = this.payrollBankAccounts.filter(x => x.accountforPayrollDataId != record.accountforPayrollDataId);
          this.payrollBankAccounts = [];
          this.payrollBankAccounts = list;
          this.payrollBankAccounts.splice(index,0,record);
        }
        if(record.indActive == true){
          this.payrollBankAccounts.forEach(element => {
            if(element.accountforPayrollDataId != record.accountforPayrollDataId){
              element.indActive = false;
            }
          })
        }
        this.showSidebar5 = false;
      }
    } else {
      //localStorage.setItem("auxIndex", '-1');
      record.accountforPayrollDataId = this.auxId;
      record.indActive = true;
      this.auxId--;
      this.payrollBankAccounts.push(record);
      this.showSidebar5 = false;
    }
    
    this._AccountforPayrollDataList = this.payrollBankAccounts;
  }

  // onRowEditSave(record: AccountforPayrollData) {
  //   //
  //   var error: boolean = false;
  //   if(record.indActive && record.accountNumber == ""){
  //     error = true;
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "El campo número de cuenta es requerido" });
  //           this._laborRelationship.payrollData.accountforPayrollData[parseInt(localStorage.getItem("auxIndex"))] = record;  
  //           localStorage.setItem("auxIndex", '-1');

  //     } else {
  //         localStorage.setItem("auxIndex", '-1');
  //         this._laborRelationship.payrollData.accountforPayrollData.push(record);
  //     }

  //   this.showSidebar5 = false;

  // }

  // add(){
  //   this.newAccountforPayrollData = new AccountforPayrollData();
  //   this.showSidebar5 = true;
  //   //this.returnData.emit(this.newAccountforPayrollData);
  // }

  // edit(i){
  //   this.newAccountforPayrollData = this._laborRelationship.payrollData.accountforPayrollData[i];
  //   localStorage.setItem("auxIndex",i);
  //   // this.auxIndex = i;
  //   this.showSidebar5 = true;
  //   //this.returnData.emit(this.newAccountforPayrollData);
  // }

  // save(){
  //   //this.saveData.emit(this._AccountforPayrollDataList);
  // }

  ///////////////////////////////////////////////
  
  resetValues(valor: boolean){  //se ejecuta cada vez que se sale de un modal (editar o eliminar) sin realizar cambios 
    this.showSidebar1 = valor;
    this.showSidebar2 = valor;
    this.showSidebar3 = valor;
    this.showSidebar4 = valor;
    this.showSidebar5 = valor;
  }

  saveMedicalCondition(record: any){
    var medicalConditionModel = new MedicalCondition();
    medicalConditionModel.idMedicalCondition = record.idMedicalCondition;
    medicalConditionModel.idLaborRelationship = parseInt(record.idLaborRelationship);
    medicalConditionModel.idEmployee = parseInt(record.idEmployee);
    medicalConditionModel.observation = record.observation;
    medicalConditionModel.idPatology = record.idPatology;
    medicalConditionModel.startDate = record.startDate;
    //
    this._medicalConditionService.insertMedicalCondition(medicalConditionModel).subscribe((data) => { //de lo contrario se insertan
      if (data> 0) {    //si no ocurre algun error
           this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
           this.onLoadMedicalConditionList();
           this.showSidebar1 = false;
      }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
        //window.location.reload(); Recarga la pagina
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });  
  }

  saveFamilyBurden(record: any){
    var error: boolean = false;
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


    this._familyBurdenList.forEach(element => {
      if(element.documentNumber == this.familyBurdenModel.documentNumber && 
        element.idDocumentType == this.familyBurdenModel.idDocumentType &&
        element.idFamilyBurden != this.familyBurdenModel.idFamilyBurden)
      {
        error = true;
      }
    });
    if(error){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Existe una carga familiar con el mismo documento de identidad asociado." });
    }else{

      this._familyBurdenService.insertFamilyBurden(this.familyBurdenModel).subscribe((data) => { //de lo contrario se insertan
        if (data> 0) {    //si no ocurre algíƒÂºn error
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.onLoadFamilyBurdenList();
          this.showSidebar2 = false;
        }else if(data == -1) {    //de lo contrario se evalíƒÂºa (validaciones de otros míƒÂ³dulos)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
        }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
        }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
        }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
        }
          //window.location.reload(); Recarga la píƒÂ¡gina
      }, () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      });  
    }
  }
  saveMaintenanceClaim(record: any){
    //
    var error: boolean = false;
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
      if (data> 0) {    //si no ocurre algun error
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.onLoadMaintenanceClaimList();
        this.showSidebar3 = false;
      }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
        //window.location.reload(); Recarga la pagina
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });  

  }

  saveGrouping(record: LaborRelationshipxGroupingViewModel){
    this.grouping = new Grouping();
    this.grouping.idGrouping = -1;
    this.grouping.createdByUserId = -1;
    this.grouping.updatedByUserId = -1;
    this.grouping.idGroupingType = 2;
    this.grouping.abbreviation = record.abbreviation;
    this.grouping.groups = record.groups;
    this._groupingService.insertGrouping(this.grouping).subscribe((data) => { //de lo contrario se insertan
      if (data> 0) {    //si no ocurre algun error
           record.idGrouping = data;
           this._laborRelationshipxGroupingList.push(record);
           this.saveGroupingLaborRelationship(this._laborRelationshipxGroupingList);
           this.showSidebar4 = false;
      }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros modulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado. (agrupación)" });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado. (agrupación)" });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe (agrupación)" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos (agrupación)" });
      }
        //window.location.reload(); Recarga la pagina
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos (agrupación)" });
    });  
  }

  saveGroupingLaborRelationship(list: LaborRelationshipxGrouping[]){
    //var error: boolean = false;
    list.forEach(element => {
      element.idLaborRelationship = this.idLaborRelationship;
      // if(element.active && element.assignedValue == ""){
      //   error = true;
      // }
    });
    // if(error){
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: "Todas las agrupaciones deben tener un valor para asociarlas a la relación laboral" });
    // }else{
      this.listLaborRelationshipxGrouping = new LaborRelationshipxGroupingList();
      this.listLaborRelationshipxGrouping.list = list;
      this._laborRelationshipxGroupingService.insertLaborRelationshipxGrouping(this.listLaborRelationshipxGrouping).subscribe((data) => { //de lo contrario se insertan
        //
        if (data == 0) {    //si no ocurre algún error
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.onLoadlaborRelationshipxGrouping();
        }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros modulos)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });

            }else if(data == -2) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
            }else if(data == -3) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
          }else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
          }
          //window.location.reload(); Recarga la pagina
        }, () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
        });  
  }

  deletedMedicalCondition(record: any){
    var filter: MedicalConditionDeletedFilter = new MedicalConditionDeletedFilter();
    filter.idMedicalCondition = parseInt(record.idMedicalCondition);
    //
    this._medicalConditionService.deletedMedicalCondition(filter).subscribe((data) => { //de lo contrario se insertan
      if (data> 0) {    //si no ocurre algun error
           this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
           this.onLoadMedicalConditionList();
      }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
      }
        //window.location.reload(); Recarga la pagina
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al borrar los datos" });
    });  
    
  }

  deletedMaintenanceClaim(record: any){
    var filter: MaintenanceClaimDeletedFilter = new MaintenanceClaimDeletedFilter();
    filter.idMaintenanceClaim = parseInt(record.idMaintenanceClaim);
    //
    this._maintenanceClaimService.deletedMaintenanceClaim(filter).subscribe((data) => { //de lo contrario se insertan
      if (data> 0) {    //si no ocurre algun error
           this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
           this.onLoadMaintenanceClaimList();
      }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
      }
        //window.location.reload(); Recarga la pagina
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al borrar los datos" });
    });  
    
  }
  
  // CARGA DE DROPDOWNS
  
  loadNaturalIdentifiersType() {
    var filter: IdentifierTypeFilter = new IdentifierTypeFilter();
    filter.idDocumentType = -1;
    filter.idEntityType = 1;
    this._companyService.getCompany(parseInt(this.getCompanyId())).subscribe( (data: Company) => {
      if (data != null) {
        filter.idCountry = data.idCountry;    //filtra el pais perteneciente a la empresa
        this._userService.getIdentifierTypesByCountry(filter).subscribe( (data: IdentifierType[]) => {
          if (data != null) {
              this.documentType = data.map<SelectItem>((item)=>(
                  {
                    value: item.id,
                    label: item.type.toString().concat(' ( ' + item.identifier + ' )')
                  }
              ));
          }
          this.documentType.sort((a, b) => a.label.localeCompare(b.label));
        },
        (error) => {
          this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipo de documentos', detail: 'Error al cargar los tipos de documento'});
        });
      }
    });  
  }

  loadNonNaturalIdentifiersType() {

    var filter: IdentifierTypeFilter = new IdentifierTypeFilter();
    filter.idDocumentType = -1;
    filter.idEntityType = 2;
    this._companyService.getCompany(parseInt(this.getCompanyId())).subscribe( (data: Company) => {
      if (data != null) {
        filter.idCountry = data.idCountry;
        this._userService.getIdentifierTypesByCountry(filter).subscribe( (data: IdentifierType[]) => {
          if (data != null) {
              this.taxdocumentType = data.map<SelectItem>((item)=>(
                  {
                    value: item.id,
                    label: item.type.toString().concat(' ( ' + item.identifier + ' )')
                  }
              ));
          }
          this.taxdocumentType.sort((a, b) => a.label.localeCompare(b.label));
        },
        (error) => {
          this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipo de documentos', detail: 'Error al cargar los tipos de documento'});
        });
      }
    });
  }
  
  loadCompanies(){
    debugger
    var filter = new CompaniesFilter();
    this._companyService.getCompaniesList(filter).subscribe( (data: Company[]) => {
      if (data != null) {
        this.companies = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.socialName
            }
        ));

          var countryFilter = new CountryFilter();
          countryFilter.idCountry = data.find(x => x.id == parseInt(this.getCompanyId())).idCountry;
          this.idCountry = countryFilter.idCountry;
          this._countryService.getCountriesPromise(countryFilter).then(countries => {
              var mainCurrencyId = countries[0].idCurrency;
              this._Currency.getCoinsList({
                id: mainCurrencyId,
                name: "",
                idtype: -1,
                abbreviation: "",
                active: 1,
              })
                .subscribe((data) => {
                    if (data != null) {
                      this.mainCurrency = data[0].symbology;
                      localStorage.setItem("mainCurrency", data[0].symbology);
                    }
                });
         });
          
        
    }
      this.companies.sort((a, b) => a.label.localeCompare(b.label))
      this.loadBranchOffices();
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de empresas', detail: 'Error al cargar las empresas'});
    });
  }

  loadBranchOffices(){
    var filter = new BranchOfficeFilter();
    filter.idCompany = this._laborRelationship.idCompany;
    this._branchOfficeService.GetBranchOffices(filter).subscribe( (data: BranchOffice[]) => {
      if (data != null) {
        this.branchOffices = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.branchOfficeName
            }
        ));
    }
      this.branchOffices.sort((a, b) => a.label.localeCompare(b.label));
      // if(this._laborRelationship.branchOfficeId){
      //   this.branchOfficeOption = this.branchOffices.find(x => x.value == this._laborRelationship.branchOfficeId);
      // }
      //debugger;
      // this._laborRelationship.branchOfficeId = this.branchOffices.find(x => x.label.toLowerCase() == "sueldo base" ).value;
      ////this.changesInMemory();
      this.loadJobPositions(); 
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de sucursales', detail: 'Error al cargar las sucursales'});
    });
  }

  loadJobPositions() {
    var filter = new JobPositionFilter();
    filter.company = this._laborRelationship.idCompany;
    this._jobPositionService.GetJobPosition(filter).subscribe( (data: JobPosition[]) => {
      if (data != null) {
        this.jobPositionDropdown = data.map<any>((item1)=>(
          {
            value: item1.id,
            label: (item1.name.split(";"))[0],
            permanent: (item1.name.split(";"))[1],
            temp: (item1.name.split(";"))[2],
            disabled: true
          }
        ));
        if(this._laborRelationship.payrollData.jobPositionId){
          this.formJobPositionInd = this.jobPositionDropdown.find(x => x.value == this._laborRelationship.payrollData.jobPositionId);
        }
        this.jobPositionDropdown.sort((a, b) => a.label.localeCompare(b.label))
        if(this.formFixedPositionInd){
          this.changeJobPosition(false);
        }
      }
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de cargos', detail: 'Error al cargar los cargos'});
    });
  }

  loadProfessionalAreas() {
    var filter = new ProfessionalAreaFilter();
    this._professionalAreaService.GetProfessionalAreas(filter).subscribe( (data: ProfessionalArea[]) => {
      if (data != null) {
        this.professionalAreas = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.name
            }
        ));
    }
      this.professionalAreas.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de áreas profesionales', detail: 'Error al cargar las áreas profesionales'});
    });
  }

  loadInstructionDegrees() {
    var filter = new InstructionDegreeFilter();
    this._instructionDegreeService.GetInstructionDegrees(filter).subscribe( (data: InstructionDegree[]) => {
      if (data != null) {
        this.instructionDegrees = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.name
            }
        ));
    }
      this.instructionDegrees.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de grados de instrucción', detail: 'Error al cargar los grados de instrucción'});
    });
  }

  filterCities(e, val: boolean) {
    // this.loadBirthCities(e.value);
    //this.changesInMemory();
    this.loadBirthCities(e);
    if(val){
      this.changesInMemory();
    }
  }

  loadBirthCities(idCountry) {
    var filter = new CityFilters();
    filter.idCountry = idCountry;
    this._cityService.getCityList(filter).subscribe( (data: City[]) => {
      if (data != null) {
        this.birthCities = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.name
            }
        ));
    }
      this.birthCities.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de grados de instrucción', detail: 'Error al cargar los grados de instrucción'});
    });
  }

  loadCountriesCitizenshipNames() {
    var filter = new CountryFilter();
    this._countryService.getCountriesList(filter).subscribe( (data: Country[]) => {
      if (data != null) {
        this.citizenShips = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.citizenshipName
            }
        ));

        this.countries = data.map<SelectItem>((item)=>(
          {
            value: item.id,
            label: item.name
          }
        ));
        
        // if(this._laborRelationship.idLaborRelationship != -1){
        //   var id = this.citizenShips.find(x => x.label == this._laborRelationship.employee.citizenshipName).value;
        //   this.filterCities(id);
        // }
    }
      this.citizenShips.sort((a, b) => a.label.localeCompare(b.label));
      this.countries.sort((a, b) => a.label.localeCompare(b.label));
     
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de Paí­ses/Gentilicios', detail: 'Error al cargar los Paí­ses/Gentilicios'});
    });
  }
  
  loadMaritalStates() {
    var filter = new MaritalStateFilter();
    this._maritalStateService.getMaritalStatesList(filter).subscribe( (data: MaritalState[]) => {
      if (data != null) {
        this.maritalStates = data.map<SelectItem>((item)=>(
            {
              value: item.idMaritalState,
              label: item.maritalStatus
            }
        ));
    }
      this.maritalStates.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de estados civiles', detail: 'Error al cargar los estados civiles'});
    });
  }

  loadCareCenters() {
    var filter = new CareCentreFilter();
    this._careCentreService.getCareCentres(filter).subscribe( (data: CareCentre[]) => {
      if (data != null) {
        this.careCenters = data.map<SelectItem>((item)=>(
            {
              value: item.idCareCentre,
              label: item.careCentreName
            }
        ));
    }
      this.careCenters.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de centros asistenciales', detail: 'Error al cargar los centros asistenciales'});
    });
  }

  loadAntiquitySystems() {
    var filter = new AntiquitySystemFilter();
    this._antiquitySystemService.GetAntiquitySystems(filter).subscribe( (data: AntiquitySystem[]) => {
      if (data != null) {
        this.antiquitySystems = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.antiquitySystemName
            }
        ));
    }
      this.antiquitySystems.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de sistemas de antigüedad', detail: 'Error al cargar los sistemas de antigüedad'});
    });
  }

  loadHousingTypes() {
    var filter = new HousingTypeFilter();
    this._housingTypeService.GetHousingType(filter).subscribe( (data: HousingType[]) => {
      if (data != null) {
        this.housingTypes = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.name
            }
        ));
    }
      this.housingTypes.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipos de vivienda', detail: 'Error al cargar los tipos de vivienda'});
    });
  }

  loadCostCenters() {
    var filter = new CostCenterFilters();
    this._costCenterService.getCentersCostsList(filter).subscribe( (data: CostCenter[]) => {
      if (data != null) {
        this.costCenters = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.name+" ("+item.id+")"
            }
        ));
      }
      this.costCenters.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de centros de costo', detail: 'Error al cargar los centros de costo'});
    });
  }

  loadContractPeriods() {
    var filter = new ContractPeriodFilter();
    this._contractPeriodService.GetContractPeriods(filter).subscribe( (data: ContractPeriod[]) => {
      if (data != null) {
        this.contractPeriods = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.contractPeriodName
            }
        ));
      }
      this.contractPeriods.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de periodos de contrato', detail: 'Error al cargar los periodos de contrato'});
    });
  }

  loadPayrollClasses() {
    var filter = new PayrollClassFilter();
    this._payrollClassService.GetPayrollClasses(filter).subscribe( (data: PayrollClass[]) => {
      if (data != null) {
        this.payrollClasses = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.payrollClassName
            }
        ));
      }
      this.payrollClasses.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de clases de nomina', detail: 'Error al cargar las clases de nomina'});
    });
  }

  loadWorkDays() {
    var filter = new WorkDayFilter();
    filter.active = 1;
    this._workDayService.GetWorkDays(filter).subscribe( (data: WorkDay[]) => {
      if (data != null) {
        this.workDays = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.name
            }
        ));
      }
      this.workDays.sort((a, b) => a.label.localeCompare(b.label));
      if(this._laborRelationship.payrollData.idWorkDay){
        this.loadWorkShifts();
      }
    },
    (error) => {
      this.messageService.add({key:'register-user', severity: 'error', summary: 'Carga de jornadas Laborales', detail: 'Error al cargar las jornadas Laborales'});
    });
  }

  loadPaymentMethods() {
    var filter = new PaymentMethodFilter();
    this._paymentMethodService.getPaymentMethods(filter).subscribe( (data: PaymentMethod[]) => {
      if (data != null) {
        this.paymentMethods = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.paymentMethodName
            }
        ));
      }
      this.paymentMethods.sort((a, b) => a.label.localeCompare(b.label));
      // this._laborRelationship.payrollData.paymentMethodId = this.paymentMethods.find(x => x.value == 1 ).value;

    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de jornadas Laborales', detail: 'Error al cargar las jornadas Laborales'});
    });
  }

  loadWorkShifts() {
    var filter = new WorkShiftFilter();
    filter.active = 1;
    filter.company = this._laborRelationship.idCompany;
    filter.workDay = this._laborRelationship.payrollData.idWorkDay;
    this._workShiftService.GetWorkShifts(filter).subscribe( (data: WorkShift[]) => {
      if (data != null) {
        this.workShifts = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.name
            }
        ));
      }
      this.workShifts.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de turnos', detail: 'Error al cargar los turnos'});
    });
  }

  
  loadSalaryTypes(){
    
    var filter = new SalaryTypeFilter();
    this._salaryTypeService.GetSalaryType(filter).subscribe( (data: SalaryType[]) => {
      debugger
      if (data != null) {
          this.salaryTypes = data.map<SelectItem>((item)=>(
              {
                value: item.id,
                label: item.name
              }
          ));
      }
      this.salaryTypes.sort((a, b) => a.label.localeCompare(b.label));
      this.auxTypeSalaryId = this.salaryTypes.find(x => x.label.toLowerCase() == "sueldo base" ).value;
      this.onLoadMaintenanceClaimList();
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipo de salarios', detail: 'Error al cargar los tipos de salario'});
    }); 
  }

  loadMotives = (filter: MotivesFilters) => {
    filter.idMotivesType = 3;
    this._motiveService.getMotives(filter).then((data: MotivesType[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.motives = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
      debugger;
      this.auxIdmotive = this.motives.find(x => x.label.toLowerCase() == "alta de trabajador" ).value;
      
   }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Carga de tipo de motivos', detail: "Ha ocurrido un error cargando los motivos"});
    });
  }

  ////////guardar cuentas bancarias

  saveCompanyAccountforPayrollData(record: LaborRelationshipxGroupingViewModel){
    // this.grouping = new Grouping();
    // this.grouping.idGrouping = -1;
    // this.grouping.createdByUserId = -1;
    // this.grouping.updatedByUserId = -1;
    // this.grouping.idGroupingType = 2;
    // this.grouping.abbreviation = record.abbreviation;
    // this.grouping.groups = record.groups;
    // this._groupingService.insertGrouping(this.grouping).subscribe((data) => { //de lo contrario se insertan
    //   if (data> 0) {    //si no ocurre algun error
    //        record.idGrouping = data;
    //        this._laborRelationshipxGroupingList.push(record);
    //        this.saveGroupingLaborRelationship(this._laborRelationshipxGroupingList);
    //        this.showSidebar4 = false;
    //   }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
    //         this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado. (agrupación)" });
    //   }else if(data == -2) {
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado. (agrupación)" });
    //   }else if(data == -3) {
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe (agrupación)" });
    //   }else {
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos (agrupación)" });
    //   }
    //     //window.location.reload(); Recarga la pagina
    // }, () => {
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos (agrupación)" });
    // });  
  }

  saveCompanyAccountforPayrollDataLaborRelationship(list: LaborRelationshipxGrouping[]){
    var error: boolean = false;
    // list.forEach(element => {
    //   element.idLaborRelationship = parseInt(sessionStorage.getItem('idLaborRelationship'));
    //   if(element.active && element.assignedValue == ""){
    //     error = true;
    //   }
    // });
    // if(error){
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: "Todas las agrupaciones deben tener un valor para asociarlas a la relación laboral" });
    // }else{
    //   this.listLaborRelationshipxGrouping = new LaborRelationshipxGroupingList();
    //   this.listLaborRelationshipxGrouping.list = list;
    //   this._laborRelationshipxGroupingService.insertLaborRelationshipxGrouping(this.listLaborRelationshipxGrouping).subscribe((data) => { //de lo contrario se insertan
    //       this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
    //       this.onLoadlaborRelationshipxGrouping();
    //     }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
    //           this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
    //     }else if(data == -2) {
    //         this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
    //     }else if(data == -3) {
    //         this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
    //     }else {
    //         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    //     }
    //     //window.location.reload(); Recarga la pagina
    //   }, () => {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    //   });  
    // //
    // }
  }
  /////////////////////////

  // Direcciones
  changeLoadStates(e, val: boolean) {      
    this.states = [];
    this.municipalities = [];
    this.cities = [];
    // this.address.idState=-1;
    // this.address.idMunicipality=-1;
    // this.address.idCity=-1;
    this._stateService.getStates({
      idState: -1,
      idCountry: e.value,
      name : "",
      abbreviation : "",
      active: 1,      
    } as StateFilters).subscribe((data) => {      
      this.states = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }));
    });  
    if(val){
      this.changesInMemory();
    }
  }

  changeLoadMunicipalities(e, val: boolean) {
    this.municipalities = [];
    this.cities = [];
    // this.address.idMunicipality=-1;
    // this.address.idCity=-1;
    this._districtService.getDistrictList({
      IdDistrict: -1,
      idState: e.value,
      status: -1,
      name : "",
      abbreviation : ""
    }).subscribe((data)=>{
      this.municipalities = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }));

    });  


    
    if(val){
      this.changesInMemory();
    }
  }

   changeLoadCities(e, val: boolean){
    this.cities = [];
    // this.address.idCity=-1;
    this._cityService.getCityList({
      idDistrict: e.value,
      active: -1,
      idCity: -1,
      idCountry: -1,
      idState: -1,
      name: ""
    }).subscribe((data)=>{      
      this.cities = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.id
      }));
    });
    this._parishService.GetParish({
      idDistrict: e.value,
      idParish: -1,
      active: -1,
      name : "",
      abbreviation : ""
    }).subscribe((data)=>{
      this.parishes = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
        label: item.name,
        value: item.idParish
      }));
    }); 
    if(val){
      this.changesInMemory();
    }
  }
  
  changeLoadWorkShifts(e){
    this.workShifts = [];
    this._workShiftService.GetWorkShifts({
      id: -1,
      // workDay: e.value,
      workDay: e,
      company: this.formCompanies.value,
      name: "",
      active: -1
    }).subscribe((data)=>{      
        this.workShifts = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
          label: item.name,
          value: item.id
        }));
    });
    this.changesInMemory();
  }
  
  loadEmployeeWorkShifts(e, i){
    this.workShifts = [];
    this._workShiftService.GetWorkShifts({
      id: -1,
      workDay: e,
      company: i,
      name: "",
      active: -1
    }).subscribe((data)=>{      
        this.workShifts = data.sort((a,b) => a.name.localeCompare(b.name)).map((item)=>({
          label: item.name,
          value: item.id
        }));
    });
  }
  
///////////////// CARGA DE SUPERVISORES AGRUPADOS POR EMPRESA

  loadSupervisors(){
    
    var filter = new CompanySupervisorFilter();
    filter.companyId = parseInt(this.getCompanyId());
    this._payrollDataService.GetCompanySupervisors(filter).subscribe( (data: CompanySupervisor[]) => {
      if (data != null) {
          this.supervisors = data.map<SelectItem>((item)=>(
              {
                value: item.companyId,
                label: item.companyName,
                items: item.supervisors.map(child => ({
                    label: child.employeeName,
                    value: child.laborRelationshipId
                }))
              }
          ));
      }
      this.supervisors.sort((a, b) => a.label.localeCompare(b.label));
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de supervisores', detail: 'Error al cargar los supervisores'});
    }); 
  }

  /////////////////---- Carga de data modo edición ----/////////////////

  loadGender(){
    switch (this._laborRelationship.employee.gender) {

      case "M": this.genderValue = { name: "Masculino" , value:"M" };
        break;

      case "F": this.genderValue = { name: "Femenino" , value:"F" };
        break;

      default:
        break;
    }
  }

  loadBloodType(){
    switch (this._laborRelationship.employee.additionalData.bloodType) {

      case "A+": this.bloodTypesValue = { name: "A+" , value:"A+" };
        break;

      case "A-": this.bloodTypesValue = { name: "A-" , value:"A-" };
        break;

      case "B+": this.bloodTypesValue = { name: "B+" , value:"B+" };
        break;

      case "B-": this.bloodTypesValue = { name: "B-" , value:"B-" };
        break;

      case "AB+": this.bloodTypesValue = { name: "AB+" , value:"AB+" };
        break;

      case "AB-": this.bloodTypesValue = { name: "AB-" , value:"AB-" };
        break;

      case "O+": this.bloodTypesValue = { name: "O+" , value:"O+" };
        break;

      case "O-": this.bloodTypesValue = { name: "O-" , value:"O-" };
        break;
                        
      default:
        break;
    }
  }

  loadLaterality(){
    switch (this._laborRelationship.employee.additionalData.laterality) {

      case "Diestro": this.lateralitiesValue = { name: "Diestro" , value:"Diestro" };
        break;

      case "Siniestro": this.lateralitiesValue = { name: "Siniestro" , value:"Siniestro" };
        break;

      case "Ambidiestro": this.lateralitiesValue = { name: "Ambidiestro" , value:"Ambidiestro" };
        break;

      default:
        break;
    }
  }

  loadAddress(){

    this.changeLoadStates({value: this._laborRelationship.employee.addresses.idCountry}, false);
    this.changeLoadMunicipalities({value: this._laborRelationship.employee.addresses.idState}, false);
    this.changeLoadCities({value: this._laborRelationship.employee.addresses.idMunicipality}, false);

  }

  loadPhoneNumbers(){
    // validar que el número sea de tipo móvil
   debugger;
    var cont = 1;
    if(this._laborRelationship.employee.phoneNumbers.length > 0){
      this._laborRelationship.employee.phoneNumbers.forEach(element => {
        switch (element.idPhoneNumberType) {
          case 3:
            this.mobilePhone = element;
            this.formMobilePhonePrefix = this.phonePrefixes.value.find(x => x.id == element.idCountry);
            // this.formMobilePhoneNumber = element.number;  
            this.validatePrefix(this.formMobilePhonePrefix, false);        
            break;
          case 2:
            this.homePhone = element;
            this.formHomePhonePrefix = this.phonePrefixes.value.find(x => x.id == element.idCountry);
            // this.formHomePhoneNumber = element.number;          
            break;
          case 4:
            this.officePhone = element;
            this.formOfficePhonePrefix = this.phonePrefixes.value.find(x => x.id == element.idCountry);
            // this.formOfficePhoneNumber = element.number;          
            break;
          default:
            break;
        }
        cont++;
      });
    }
  }

  loadDates(){
    //debugger;
    if(this._laborRelationship.employee.birthDate == "1900-01-01"){ //si es la fecha por defecto
      this.fechaNacimiento = null;                      //le dejo el campo vací­o
    }else{                                              //sino aplico la sig. función
      this.fechaNacimiento = new Date(this._laborRelationship.employee.birthDate);
      this.fechaNacimiento.setMinutes(this.fechaNacimiento.getMinutes() + this.fechaNacimiento.getTimezoneOffset());  //evita que la fecha disminuya un dia
    }
    
    if(this._laborRelationship.payrollData.employmentDate == "1900-01-01"){
      this.fechaIngreso = null;
    }else{
      this.fechaIngreso= new Date(this._laborRelationship.payrollData.employmentDate);
      this.fechaIngreso.setMinutes(this.fechaIngreso.getMinutes() + this.fechaIngreso.getTimezoneOffset());  //evita que la fecha disminuya un dia
    }

    if(this._laborRelationship.payrollData.seniorityDate == "1900-01-01"){
      this.fechaAntiguedad = null;
    }else{
      /////////////////
      this.fechaAntiguedad= new Date(this._laborRelationship.payrollData.seniorityDate);
      this.fechaAntiguedad.setMinutes(this.fechaAntiguedad.getMinutes() + this.fechaAntiguedad.getTimezoneOffset());  //evita que la fecha disminuya un dia
      this.calculate(this._laborRelationship.payrollData.seniorityDate);
    }
    
    if(this._laborRelationship.payrollData.egressDate == "1900-01-01"){
      this.fechaEgreso = null;
    }else{
      this.fechaEgreso= new Date(this._laborRelationship.payrollData.egressDate);
      this.fechaEgreso.setMinutes(this.fechaEgreso.getMinutes() + this.fechaEgreso.getTimezoneOffset());  //evita que la fecha disminuya un dia
    }
    
    if(this._laborRelationship.payrollData.salariesforPayrollData == undefined ||
       this._laborRelationship.payrollData.salariesforPayrollData == null ||
       this._laborRelationship.payrollData.salariesforPayrollData.length == 0)
    {
      this.fechaVigencia = null;
    }else{
      var salariesObject = this._laborRelationship.payrollData.salariesforPayrollData.find(x => x.typeSalaryId == 1);
      if(salariesObject){
        if(salariesObject.validityDate){
          this.fechaVigencia= new Date(salariesObject.validityDate);
          var dateString = this.datepipe.transform(this.fechaVigencia,'yyyy-MM-dd');
          if(dateString == "1900-01-01" || dateString == undefined || dateString == null || dateString == ""){
            this.fechaVigencia = null;
          }else{
            this.fechaVigencia.setMinutes(this.fechaVigencia.getMinutes() + this.fechaVigencia.getTimezoneOffset());  //evita que la fecha disminuya un dia
          }
        }
      }
    }
  }

  changeJobPosition(val: boolean){
    //debugger;
    this.jobPositionDropdown.forEach(element =>{
      if((this.formFixedPositionInd.value == "1" && element.permanent > 0) ||(this.formFixedPositionInd.value == "0" && element.temp > 0) ){
        element.disabled = false;
      }else{
        element.disabled = true;
      }
      if(val){
        this.changesInMemory();
      }
    });
   
    this.jobPositionDropdown.sort((a, b) => a.label.localeCompare(b.label))
  }

  //// viene de payroll-information
   //Enable Records Edition
   handleChange(e) {
    this.checked = e.checked;
  }

  //Back to the Main List
  regresar() {
    if(this.dataNoSave){            //si hay cambios sin guardar
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: 'Se perderán todos los cambios no guardados ¿Está seguro que desea regresar?',
        accept: () => {
          const queryParams: any = {};
          queryParams.laborRelationshipMinimumFilters = JSON.stringify(this.laborRelationshipMinimumFilters);
          const navigationExtras: NavigationExtras = {
            queryParams
          };
          sessionStorage.removeItem('idLaborRelationship');
          this.router.navigate(['hcm/companiesemployee-list'], navigationExtras)
        },
        reject: () => {
          
        }
      }); 
    }else{
      const queryParams: any = {};
      queryParams.laborRelationshipMinimumFilters = JSON.stringify(this.laborRelationshipMinimumFilters);
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      sessionStorage.removeItem('idLaborRelationship');
      this.router.navigate(['hcm/companiesemployee-list'], navigationExtras)
    }
    debugger;
  }
///////////////////

  calculate(auxFechaAntiguedad) {
    this.seniorityCalc = "";
      try {
        auxFechaAntiguedad = this.toDate(auxFechaAntiguedad);
        auxFechaAntiguedad = auxFechaAntiguedad.split('-');
        var today = new Date();

        var endYear = today.getFullYear();
        var endMonth = today.getMonth() + 1;
        var endDay = today.getDate();

        var startYear = parseInt(auxFechaAntiguedad[0]);
        var startMonth = parseInt(auxFechaAntiguedad[1]);
        var startDay = parseInt(auxFechaAntiguedad[2]);
        
        // We calculate February based on end year as it might be a leep year which might influence the number of days.
        var february = (endYear % 4 == 0 && endYear % 100 != 0) || endYear % 400 == 0 ? 29 : 28;
        var daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      
        var startDateNotPassedInEndYear = (endMonth < startMonth) || endMonth == startMonth && endDay < startDay;
        var years = endYear - startYear - (startDateNotPassedInEndYear ? 1 : 0);
      
        var months = (12 + endMonth - startMonth - (endDay < startDay ? 1 : 0)) % 12;
      
        // (12 + ...) % 12 makes sure index is always between 0 and 11
        var days = startDay <= endDay ? endDay - startDay : daysOfMonth[(12 + endMonth - 1) % 12] - startDay + endDay;
    

        var yearString = years > 1 ? "años": "año";
        var monthsString = months > 1 ? "meses": "mes";
        var daysString = days > 1 ? "dí­as": "dí­a";

        if(years > 0){
          this.seniorityCalc += years +" "+ yearString;
        }

        if(months > 0){
          this.seniorityCalc += " "+months +" "+ monthsString;
        }

        if(days > 0){
          this.seniorityCalc += " "+days +" "+ daysString;
        }
        // if(years > 0 && months > 0 && days > 0){
        //     this.seniorityCalc = years +" "+ yearString +", "+ months +" "+ monthsString + ", " + days +" "+ daysString;
        //  } else {
        //    if(years > 0 && months > 0){
        //      this.seniorityCalc = years +" "+ yearString +", "+ months +" "+ monthsString
        //    } else {
        //       if(years > 0 && days > 0){
        //         this.seniorityCalc = years +" "+ yearString +", "+ days +" "+ daysString
        //       } else {
        //         if(months > 0 && days > 0){
        //           this.seniorityCalc = months +" "+ monthsString + ", " + days +" "+ daysString
        //         } else {
        //             if(days > 0){
        //               this.seniorityCalc = days +" "+ daysString
        //           }
        //         }
        //       }
        //     }
        // }
        if(years == 0 && months == 0 && days == 0) {
          this.seniorityCalc = days +" dí­as"
        }

        // console.log(
        //   "years: "+ years +", months: " + months +", days: " +days    /^([0-9]+(\.[0-9]{0,3})?
        // );

      } catch (e) {
        console.error(e);
      }
    }

    validateRealNumber(event, value){
      //debugger;
      if(value == undefined || value == null){
        var inp = String.fromCharCode(event.keyCode);
      }else{
        var inp = value+(String.fromCharCode(event.keyCode));
      }
      if (/^[1-9]([0-9]*(\,[0-9]{0,3})?)?$/.test(inp)) { //si cumple el formato  
        if(value == undefined || value == null){
          this._laborRelationship.employee.additionalData.height = parseInt(inp+",00");
        }else{
       
        }
        return true;                 //no hagas nada
      } else {
        event.preventDefault();
        return false;                  //manda el error
      }
    }

    changesInMemory(){
      this.dataNoSave = true;
    }
   
}
