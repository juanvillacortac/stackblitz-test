import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CompanyGovernmentalAgency} from '../../../shared/models/masters/company-governmental-agency';
import {MessageService, SelectItem} from 'primeng/api';
import {GovernmentalRecordFilter} from '../../../shared/filters/governmental-record-filter';
import {GovernmentalRecord} from '../../../shared/models/masters/governmental-record';
import {GovernmentalRecordService} from '../../../shared/services/governmental-record.service';
import {GovernmentalRecordTypeFilter} from '../../../shared/filters/governmental-record-type-filter';
import {GovernmentalRecordType} from '../../../shared/models/masters/governmental-record-type';
import {GovernmentalRecordTypeService} from '../../../shared/services/governmental-record-type.service';
import {CompanyGovernmentalAgencyFilter} from '../../../shared/filters/company-governmental-agency-filter';
import {GovernmentalAgencyService} from '../../../shared/services/governmental-agency.service';
import {Company} from '../../../shared/models/masters/company';
import {UserService} from 'src/app/modules/security/users/shared/user.service';
import {BranchOfficeService} from '../../../shared/services/branch-office.service';
import {HttpErrorResponse} from '@angular/common/http';
import {BranchOfficeFilter} from '../../../shared/filters/branch-office-filter';
import {GovernmentalAgencyFilter} from '../../../shared/filters/governmental-agency-filter';
import {BranchOffice} from '../../../shared/models/masters/branch-office';
import {GovernmentalAgency} from '../../../shared/models/masters/governmental-agency';
import {CompanyGovernmentalAgencyService} from '../../../shared/services/company-governmental-agency.service';
import {Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';

@Component({
    selector: 'app-company-govAgency-filter',
    templateUrl: './company-govAgency-filter.component.html',
    styleUrls: ['./company-govAgency-filter.component.scss']
})
export class CompanyGovernmentalAgencyFilterComponent implements OnInit {

    @Input() expanded: boolean = false;
    @Input() filters: CompanyGovernmentalAgencyFilter;

    @Input("loading") loading: boolean = false;

    governmentalAgencies: SelectItem[] = [];
    governmentalAgenciesShortNames: SelectItem[] = [];
    governmentalRecords: SelectItem[] = [];
    governmentalRecordTypes: SelectItem[] = [];
    identifierTypeOptions: SelectItem[] = [];
    statuslist: SelectItem[] = [
        {label: 'Todos', value: '-1'},
        {label: 'Vigente', value: '28'},
        {label: 'Vencido', value: '29'}
    ];
    branchOffices = [];

    _validations: Validations = new Validations();

    @Input() idCompany;
    @Input() idCountry: number;
    // @Input("_company") _company : Company = new Company();
    // @Input("_IdCompany") _IdCompany : number;

    @Output("_companyGovernmentalAgencies") _companyGovernmentalAgencies = new EventEmitter<CompanyGovernmentalAgency[]>();

    @Output("onSearch") onSearch = new EventEmitter<CompanyGovernmentalAgencyFilter>();

    //////////////////

    constructor(
        private _companyGovernmentalAgencyService: CompanyGovernmentalAgencyService,
        private _governmentalAgencyService: GovernmentalAgencyService,
        private _governmentalRecord: GovernmentalRecordService,
        private _governmentalRecordType: GovernmentalRecordTypeService,
        private _governmentalAgency: GovernmentalAgencyService,
        private _branchOffice: BranchOfficeService,
        private _userService: UserService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.filters.estatus = -1;
        this.loadGovernmentalAgencies(this.idCountry);
        this.loadGovernmentalAgenciesShortNames(this.idCountry);
        this.loadNotNaturalIdentifierTypes();
        // debugger;
        this.idCountry = this.idCountry;
    }

    search() {
        this.onSearch.emit(this.filters);
    }

    /////////////////////////////////////

    async loadGovernmentalAgencies(pId) {
        var filter = new GovernmentalAgencyFilter();
        filter.country = pId;
        return this._governmentalAgencyService.GetGovernmentalAgencies(filter).subscribe(res => {
                res.map((data: GovernmentalAgency) => {
                    this.governmentalAgencies.push({
                        value: data.id,
                        label: data.name
                    });
                });
                this.governmentalAgencies.sort((a, b) => a.label.localeCompare(b.label));
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ha ocurrido un error cargando los Entes gubernamentales'
                });
            });
    }

    async loadGovernmentalAgenciesShortNames(pId) {
        var filter = new GovernmentalAgencyFilter();
        filter.country = pId;
        return this._governmentalAgencyService.GetGovernmentalAgencies(filter).subscribe(res => {
                res.map((data: GovernmentalAgency) => {
                    this.governmentalAgenciesShortNames.push({
                        value: data.id,
                        label: data.shortName
                    });
                });
                this.governmentalAgencies.sort((a, b) => a.label.localeCompare(b.label));
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ha ocurrido un error cargando los Entes gubernamentales'
                });
            });
    }

    // async loadNaturalIdentifierTypes() {
    //   return this._userService.getIdentifierTypes(-1, 1).subscribe( res => {
    //     res.map((data) => {
    //       this.identifierTypeOptions.push({
    //         value: data.id,
    //         label: data.type.toString().concat(' ( ' + data.identifier + ' )')
    //       });
    //     });
    //     this.identifierTypeOptions.sort((a, b) => a.label.localeCompare(b.label))
    //   },
    //   (error) => {
    //     this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipo de documentos', detail: 'Error al cargar los tipos de documento'});
    //   });
    // }

    async loadNotNaturalIdentifierTypes() {
        return this._userService.getIdentifierTypes(-1, 2)
            .then(res => {
                res.map((data) => {
                    this.identifierTypeOptions.push({
                        value: data.id,
                        label: data.type.toString().concat(' ( ' + data.identifier + ' )')
                    });
                });
                this.identifierTypeOptions.sort((a, b) => a.label.localeCompare(b.label))
            }).catch(error => {
                this.messageService.add({
                    key: 'register-user',
                    severity: 'error',
                    summary: 'Carga de tipo de documentos',
                    detail: 'Error al cargar los tipos de documento'
                });
            });
    }

    getCompanyGovernmentalAgency(pId) {
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
        }, (error: HttpErrorResponse) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: "Ha ocurrido un error cargando los Entes gubernamentales por Empresa"
            });
        });
    }

    getGovernmentalAgencies(pId) {
        var filter = new GovernmentalAgencyFilter();
        filter.country = pId;
        this._governmentalAgencyService.GetGovernmentalAgencies(filter).subscribe((data: GovernmentalAgency[]) => {
            if (data != null) {
                console.log("getGovernmentalAgency by Country");
                console.log(data);
                this.governmentalAgencies = data.map<SelectItem>((item) => (
                    {
                        label: item.name,
                        value: item.id
                    }
                ));
            }
        }, (error: HttpErrorResponse) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: "Ha ocurrido un error cargando los Entes gubernamentales"
            });
        });
    }

    getGovernmentalRecordsByAgency(e) {
        var filter = new GovernmentalRecordFilter();
        filter.governmentalAgency = e.value;
        this._governmentalRecord.GetGovernmentalRecords(filter).subscribe((data: GovernmentalRecord[]) => {
                if (data != null) {
                    console.log("getGovernmentalRecords");
                    console.log(data);
                    this.governmentalRecords = data.map<SelectItem>((item) => (
                        {
                            label: item.name,
                            value: item.id
                        }
                    ));
                }
            },
            (error) => {
                this.messageService.add({
                    key: 'register-user',
                    severity: 'error',
                    summary: 'Carga de tipo de documentos',
                    detail: 'Error al cargar los tipos de documento'
                });
            });
    }

    getGovernmentalRecordTypes(e) {
        var filter = new GovernmentalRecordTypeFilter();
        filter.id = e.value;
        return this._governmentalRecordType.GetGovernmentalRecordTypes(filter).subscribe(res => {
                res.map((data) => {
                    this.governmentalRecordTypes.push({
                        value: data.id,
                        label: data.name.toString()
                    });
                });
                this.governmentalRecordTypes.sort((a, b) => a.label.localeCompare(b.label))
            },
            (error) => {
                this.messageService.add({
                    key: 'register-user',
                    severity: 'error',
                    summary: 'Carga de tipo de documentos',
                    detail: 'Error al cargar los tipos de documento'
                });
            });
    }

    getBranchOffices(pCompanyId, pIndActivo, pCountryId) {
        var filter = new BranchOfficeFilter();
        filter.idCompany = pCompanyId;
        filter.active = pIndActivo;
        this._branchOffice.GetBranchOffices(filter).subscribe((data: BranchOffice[]) => {
            if (data != null) {
                console.log("GetBranchOffices");
                console.log(data);
                this.branchOffices = data;
            }
            console.log(pCountryId);
            debugger;
            this.getGovernmentalAgencies(pCountryId);
        });
    }

    clearFilters() {
        this.filters.governmentalAgency = -1;
        this.filters.governmentalRecord = -1;
        this.governmentalRecords = [];
        this.filters.governmentalRecordType = -1;
        this.governmentalRecordTypes = [];
        this.filters.company = -1;
        this.filters.documentNumber = "";
        this.filters.documentType = -1;
        this.filters.branchOffice = -1;
        this.filters.estatus = -1;
    }


}
