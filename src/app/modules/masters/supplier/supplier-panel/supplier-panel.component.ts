import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService, SelectItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Address } from 'src/app/models/masters/address';
import { ContactNumber } from 'src/app/models/masters/contact-number';
import { DocumentTypes } from 'src/app/models/masters/document-type';
import { ExchangeRatesSupplier } from 'src/app/models/masters/exchange-rates-suppliers';
import { SupplierAccountingAccount, SupplierBankAccount, SupplierExtend, SupplierFinancialSetup } from 'src/app/models/masters/supplier-extend';
import { UserSupplier } from 'src/app/models/masters/usersuppliers';
import { ContactNumberSupplierComponent } from 'src/app/modules/common/components/contact-number-supplier/contact-number-supplier.component';
import { EditAddressComponent } from 'src/app/modules/common/components/edit-address/edit-address.component';
import { CoinsService } from '../../coin/shared/service/coins.service';
import { CountryService } from '../../country/shared/services/country.service';
import { DocumentTypeService } from '../../document-types/shared/services/document-type.service';
import { ExchangeratesupplierService } from '../../exchange-rates-suppliers/shared/exchangeratesupplier.service';
import { PaymentconditionService } from '../../payment-conditions/shared/paymentcondition.service';
import { TaxpayertypeService } from '../../taxpayer-type/shared/taxpayertype.service';
import { ClientSupplierExtendFilters } from '../shared/filters/clientsupplierextend-filters';
import { SupplierextendFilter } from '../shared/filters/supplierextend-filter';
import { SupplierService } from '../shared/services/supplier.service';
import { Location } from '@angular/common';
import { AddExchangeTaxComponent } from 'src/app/modules/common/components/add-exchange-tax/add-exchange-tax.component';
import { ExchangeRateTypeService } from '../../exchange-rate-type/service/exchange-rate-type.service';
import { DocumentTypeFilter } from 'src/app/models/masters/document-type-filters';
import { Company } from 'src/app/models/masters/company';
import { CompaniesFilter } from '../../companies/shared/filters/companies-filter';
import { CompanyService } from '../../companies/shared/services/company.service';
import { ContactNumberSupplier } from 'src/app/models/masters/contactnumber-supllier';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContactsSuppliersComponent } from './contacts-suppliers/contacts-suppliers.component';
import { UsersSuppliersComponent } from './users-suppliers/users-suppliers.component';
import { CoinFilter } from '../../coin/shared/filters/CoinFilter';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { ExchangerateSuppliersComponent } from './exchangerate-suppliers/exchangerate-suppliers.component';
import { SupplierclasificationService } from '../../supplierclasification/shared/services/supplierclasification.service';
import { BankService } from '../../bank/shared/services/bank.service';
import { BankFilters } from 'src/app/models/masters/bank-filters';

@Component({
  selector: 'supplier-panel',
  templateUrl: './supplier-panel.component.html',
  styleUrls: ['./supplier-panel.component.scss'],
  providers: [DatePipe]
})
export class SupplierPanelComponent implements OnInit {


  _validations: Validations = new Validations();
  public _exchangeCopy: ExchangeRatesSupplier[];
  submitted = false;
  @Input("_dataSupplier") _dataSupplier: SupplierExtend = new SupplierExtend();

  supplier: SupplierExtend = new SupplierExtend();
  client: SupplierExtend = new SupplierExtend();

  @Input("id") id: number = 0;
  @Input("idCompany") idCompany: number = 0;
  @Input("filters") filters: ClientSupplierExtendFilters;
  @ViewChild(AddExchangeTaxComponent) exchangeDialog: AddExchangeTaxComponent;
  @ViewChild(ContactsSuppliersComponent) ContactsComponent: ContactsSuppliersComponent;
  @ViewChild(UsersSuppliersComponent) usersComponent: UsersSuppliersComponent;
  @ViewChild(ExchangerateSuppliersComponent) exhangeRateSupplierComponent: ExchangerateSuppliersComponent;
  ClasificationList: SelectItem[];
  documentTypeList: SelectItem[];
  TaxPayerTypeList: SelectItem[];
  IdentifierTypeList: DocumentTypes[];
  identifierType: DocumentTypes;
  countriesList: SelectItem[];
  currencyList: SelectItem[];
  banks: SelectItem[];
  filtersOfValues: SupplierextendFilter[] = [];
  paramfilters: any;
  //exchangetypeList: SelectItem[];
  paymentConditionList: SelectItem[];
  contactNumberDialogVisible = false;
  exchangeDialogVisible: boolean = false;
  contactNumberSupplierDialogVisible = false;
  userDialogVisible: boolean = false;
  collapse: boolean = false;
  isFormEdit: boolean = false;
  valor: boolean = true;
  loading = false;
  location;
  disabled: boolean = false;
  disabledocument: boolean = true;
  statuslist: SelectItem[] = [
    { label: 'Activo', value: '1' },
    { label: 'Inactivo', value: '0' }
  ];
  _addresses: Address[];
  _contacts: ContactNumber[];
  _exchangeRates: ExchangeRatesSupplier[];
  exchangetypeList: SelectItem[] = [];

  checkAllCompany: boolean = false;
  companieslist: Company[] = [];
  selectedCompanies: any[] = [];
  supplierSelectedCompanies: any[] = [];
  clientSelectedCompanies: any[] = [];
  userexpanded: number = -1;

  Tabcompanieslist: SelectItem[];
  TabselectedCompanies: SelectItem[];


  typeList = [
    { label: 'Proveedor', value: 1 },
    { label: 'Cliente', value: 2 },
    { label: 'Cliente/Proveedor', value: 3 },
  ];
  selectedType = 1

  constructor(public _SupplierService: SupplierService,
    public datepipe: DatePipe,
    private _countriesService: CountryService,
    public _DocumentTypeService: DocumentTypeService,
    public _TaxPayerTypeService: TaxpayertypeService,
    public _PaymentConditions: PaymentconditionService,
    public _Currency: CoinsService,
    public _Bank: BankService,
    private messageService: MessageService,
    private rutaActiva: ActivatedRoute, location: Location,
    private _ExchangeRateTypeService: ExchangeRateTypeService,
    private supplierClasificationService: SupplierclasificationService,
    private _companiesservice: CompanyService, private breadcrumbService: BreadcrumbService, private confirmationService: ConfirmationService, private router: Router) {
    this.location = location
    this.statuslist = [
      { label: 'Activo', value: true },
      { label: 'Inactivo', value: false }
    ];
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Proveedores', routerLink: ['/masters/supplier-list'] }
    ]);
  }

  ngOnInit(): void {
    this.loadForm();
    this.id = this.rutaActiva.snapshot.params.id
    this.rutaActiva.params.subscribe(
      (params: Params) => {
        this.id = this.rutaActiva.snapshot.params.id
      }
    )
    if (this.filtersOfValues.length > 0) {
      this.filtersOfValues = this.filtersOfValues;
    }
    else {
      if (history.state.queryParams != undefined) {
        this.paramfilters = history.state.queryParams.filters;//this.activatedRoute.snapshot.queryParamMap.get('filters');//history.state.queryParams//
        if (this.paramfilters === null)
          this.filtersOfValues = [];
        else
          this.filtersOfValues = JSON.parse(this.paramfilters);

        sessionStorage.setItem('searchParameters', this.paramfilters);

      }
      else
        this.filtersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));

    }

    this.onLoadCompaniesList(new CompaniesFilter()).then(() => {
      if (this.id == 0) {
        this._dataSupplier = new SupplierExtend();
        this._dataSupplier.idcompany = -1;
        this._dataSupplier.idsuppliertype = 1;
        this._dataSupplier.socialReason = "";
        this._dataSupplier.phone = "",
          this._dataSupplier.idsupplierclasification = -1,
          this._dataSupplier.idtaxpayertype = -1,
          this._dataSupplier.indCustomexchangetype = false;
        this._dataSupplier.indclient = false;
        this._dataSupplier.indconsignment = false;
        this._dataSupplier.indsupplier = true;
        this._dataSupplier.supplierclasification = "";
        this._dataSupplier.active = true;
        this._dataSupplier.commercialreason = "",
          this._dataSupplier.documentnumber = "",
          this._dataSupplier.documenttype = "",
          this._dataSupplier.idOperationalDocumentType = -1,
          this._dataSupplier.idcountry = -1,
          this._dataSupplier.idcurrency = -1,
          this._dataSupplier.iddocumentType = -1,
          this._dataSupplier.identifier = "",
          this._dataSupplier.idexchangetype = -1,
          this._dataSupplier.ididentifier = -1
        this._dataSupplier.idpaymentcondition = -1,
          this._dataSupplier.updatedByUserId = -1
        this._dataSupplier.addresses = [],
          this._dataSupplier.contactNumbers = [],
          this._dataSupplier.exchangeRates = [],
          this._dataSupplier.users = []
        var filter: CompaniesFilter = new CompaniesFilter()
        filter.active = 1;
        this.onLoadCompaniesList(filter);
      } else {
        this.search(this.id, true);
        this._DocumentTypeService.getdocumentTypeList().subscribe((data) => {
          this.IdentifierTypeList = data;
          this.documentTypeList = data.sort((a, b) => b.entityType.id - a.entityType.id).map((item) => ({
            label: item.identifier + "-" + item.name,
            value: item.id
          }))
        });
        var filter: CompaniesFilter = new CompaniesFilter()
        filter.active = 1;
      }
    })
  }

  financialSetup: {
    supplier: {
      bankAccounts: { [key: number]: SupplierBankAccount[] }
      accountingAccounts: { [key: number]: SupplierAccountingAccount[] }
    }
    client: {
      bankAccounts: { [key: number]: SupplierBankAccount[] }
      accountingAccounts: { [key: number]: SupplierAccountingAccount[] }
    }
  } = {
      supplier: {
        accountingAccounts: {},
        bankAccounts: {},
      },
      client: {
        accountingAccounts: {},
        bankAccounts: {},
      }
    }

  bankAccounts: { [key: number]: SupplierBankAccount[] } = {};
  accountingAccounts: { [key: number]: SupplierAccountingAccount[] } = {};


  async onLoadSelectedCompaniesList(filter: CompaniesFilter) {
    return this._companiesservice.getCompaniesList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.companieslist = data;

      }, (error) => {
        console.log(error);
      });
  }

  async onLoadCompaniesList(filter: CompaniesFilter) {
    this._companiesservice.getCompaniesList(filter)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.companieslist = data;

      }, (error) => {
        console.log(error);
      });
  }

  loadForm() {
    this._countriesService.getCountriesList({
      idCountry: -1,
      active: 1,
      name: "",
      abbreviation: ""
    })
      .subscribe((data) => {
        this.countriesList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });

    this.supplierClasificationService.getSupplierClasificationList({
      id: -1,
      name: "",
      active: 1
    })
      .subscribe((data) => {
        this.ClasificationList = data.sort((a, b) => a.supplierclasification.localeCompare(b.supplierclasification)).map((item) => ({
          label: item.supplierclasification,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });


    this._TaxPayerTypeService.getTaxPayerTypebyFilter({
      id: -1,
      name: ""
    })
      .subscribe((data) => {
        this.TaxPayerTypeList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });

    this._PaymentConditions.getPaymentconditionbyFilter({
      idPaymentCondition: -1,
      name: "",
      amounterm: -1,
      idDiscountType: -1,
      active: 1,
    })
      .subscribe((data) => {
        this.paymentConditionList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
          label: item.name,
          value: item.idPaymentCondition
        }));
      }, (error) => {
        console.log(error);
      });

    this._Currency.getCoinsList({
      id: -1,
      name: "",
      idtype: -1,
      abbreviation: "",
      active: 1,
    })
      .subscribe((data) => {
        this.currencyList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });

    this._Bank.getBanks({
      ...new BankFilters(),
      id: -1,
      active: -1,
    })
      .subscribe((data) => {
        this.banks = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
          label: item.name,
          value: item.id
        }));
        console.log(this.banks)
      }, (error) => {
        console.log(error);
      });
    this._ExchangeRateTypeService.getExchangeRateTypebyFilter()
      .subscribe((data) => {
        this.exchangetypeList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });

  }

  search(id: number, valid: boolean) {
    this._dataSupplier = new SupplierExtend();
    var filter = new ClientSupplierExtendFilters();
    filter.idClientSupplier = id;
    this._SupplierService.getSupplierWithDetail(filter).subscribe(async (data: SupplierExtend[]) => {
      console.log(data[0])
      this._dataSupplier = data[0];
      this._dataSupplier.ididentifier = this._dataSupplier.iddocumentType;
      this._dataSupplier.contactNumbers = data[0].contactNumbers != undefined && data[0].contactNumbers.length > 0 ? data[0].contactNumbers : [];
      // this.ContactsComponent.RefreshContactList(this._dataSupplier.contactNumbers);

      this._dataSupplier.users = data[0].users != undefined && data[0].users.length > 0 ? data[0].users : [];
      // this.usersComponent.refreshUser(this._dataSupplier.users);

      this._dataSupplier.exchangeRates = data[0].exchangeRates != undefined && data[0].exchangeRates.length > 0 ? data[0].exchangeRates : [];
      // this.exhangeRateSupplierComponent.RefreshExchangeRateList(this._dataSupplier.exchangeRates);

      this.supplierSelectedCompanies = this.loadCompanies(this._dataSupplier.companies.filter(c => c.indSupplier))
      this.clientSelectedCompanies = this.loadCompanies(this._dataSupplier.companies.filter(c => !c.indSupplier))

      this.supplier.users = this._dataSupplier.users.filter(u => u.indSupplier)
      this.supplier.contactNumbers = this._dataSupplier.contactNumbers.filter(u => u.indSupplier)
      this.supplier.exchangeRates = this._dataSupplier.exchangeRates.filter(u => u.indSupplier)

      this.client.users = this._dataSupplier.users.filter(u => !u.indSupplier)
      console.log(this._dataSupplier)
      this.client.contactNumbers = this._dataSupplier.contactNumbers.filter(u => !u.indSupplier)
      this.client.exchangeRates = this._dataSupplier.exchangeRates.filter(u => !u.indSupplier)

      if (data.length) {
        const fmsSetup = await this._SupplierService.getFMSSetup(id).toPromise()

        this.financialSetup.supplier.accountingAccounts = fmsSetup.accountingAccounts.filter(aa => aa.indSupplier).reduce(function (r, a) {
          r[a.companyId] = r[a.companyId] || [];
          r[a.companyId].push(a);
          return r;
        }, Object.create(null))

        this.financialSetup.client.accountingAccounts = fmsSetup.accountingAccounts.filter(aa => !aa.indSupplier).reduce(function (r, a) {
          r[a.companyId] = r[a.companyId] || [];
          r[a.companyId].push(a);
          return r;
        }, Object.create(null))

        this.financialSetup.supplier.bankAccounts = fmsSetup.bankAccounts.filter(ba => ba.indSupplier).reduce(function (r, a) {
          r[a.companyId] = r[a.companyId] || [];
          r[a.companyId].push(a);
          return r;
        }, Object.create(null))

        this.financialSetup.client.bankAccounts = fmsSetup.bankAccounts.filter(ba => !ba.indSupplier).reduce(function (r, a) {
          r[a.companyId] = r[a.companyId] || [];
          r[a.companyId].push(a);
          return r;
        }, Object.create(null))

        this.selectedType = this._dataSupplier.personType
        // if (this._dataSupplier.indsupplier && this._dataSupplier.indclient) {
        //   this.selectedType = 3
        //   return
        // }
        // if (this._dataSupplier.indclient) {
        //   this.selectedType = 2
        //   return
        // }
        // if (this._dataSupplier.indsupplier) {
        //   this.selectedType = 1
        //   return
        // }
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando el proveedor" });
    });
  }

  loadCompanies = (companies: Company[]) => companies.map(s => this.companieslist.find(c => c.id == s.id))

  async onLoadCompaniesListSelected(companies: Company[], companiesselected: any[]) {
    var filter: CompaniesFilter = new CompaniesFilter();
    filter.active = -1;
    this._companiesservice.getCompaniesList(filter)
      .subscribe((data) => {
        this.companieslist = data;
        companies.forEach(company => {
          //if( this.selectedCompanies.findIndex(x=>x.id ==company.id )==-1)
          this.selectedCompanies.push(this.companieslist.length > 0 ? this.companieslist.find(x => x.id == company.id) : new Company);
        });


        companiesselected = this.selectedCompanies;
      }, (error) => {
        console.log(error);
      });
  }


  onSubmitContactNumber(data) {
    if (data.identifier == -1)
      data.contactNumber.id = -1;
    this._dataSupplier.phone = "(+" + data.contactNumber.areaCode + ")" + " " + data.contactNumber.number;
  }

  onHideContacNumber(visible: boolean) {
    this.contactNumberDialogVisible = visible;
  }

  anySelected: boolean
  supplierError: boolean
  clientError: boolean

  submit() {
    this.loading = true;
    this.submitted = true;
    this.anySelected = Boolean([...this.clientSelectedCompanies, ...this.supplierSelectedCompanies].length)
    this.clientError = !Boolean(this.clientSelectedCompanies.length)
    this.supplierError = !Boolean(this.supplierSelectedCompanies.length)
    this.valor = this.isEmail(this._dataSupplier.email);

    const clientBankAccounts = Object.entries<SupplierBankAccount[]>(this.financialSetup.client.bankAccounts)
      .map(([companyId, bankAccounts]) => bankAccounts.map(ba => ({
        ...ba,
        companyId: +companyId,
        clientSupplierId: this._dataSupplier.idclientsupplier,
        indSupplier: false,
      })))
      .map(x => x[0])

    const supplierBankAccounts = Object.entries<SupplierBankAccount[]>(this.financialSetup.supplier.bankAccounts)
      .map(([companyId, bankAccounts]) => bankAccounts.map(ba => ({
        ...ba,
        companyId: +companyId,
        clientSupplierId: this._dataSupplier.idclientsupplier,
        indSupplier: true,
      })))
      .map(x => x[0])

    const clientAccountingAccounts = Object.entries<SupplierAccountingAccount[]>(this.financialSetup.client.accountingAccounts)
      .map(([companyId, accountingAccounts]) => accountingAccounts.map(aa => ({
        ...aa,
        companyId: +companyId,
        clientSupplierId: this._dataSupplier.idclientsupplier,
        indSupplier: false,
      })))
      .map(x => x[0])

    const supplierAccountingAccounts = Object.entries<SupplierAccountingAccount[]>(this.financialSetup.supplier.accountingAccounts)
      .map(([companyId, accountingAccounts]) => accountingAccounts.map(aa => ({
        ...aa,
        companyId: +companyId,
        clientSupplierId: this._dataSupplier.idclientsupplier,
        indSupplier: true,
      })))
      .map(x => x[0])

    const financialSetup: SupplierFinancialSetup = {
      accountingAccounts: [...clientAccountingAccounts || [], ...supplierAccountingAccounts || []],
      bankAccounts: [...clientBankAccounts || [], ...supplierBankAccounts || []],
    }

    // if (this.selectedType == 1) {
    //   this._dataSupplier.indclient = false
    //   this._dataSupplier.indsupplier = true
    // }

    // if (this.selectedType == 2) {
    //   this._dataSupplier.indclient = true
    //   this._dataSupplier.indsupplier = false
    // }

    // if (this.selectedType == 3) {
    //   this._dataSupplier.indclient = true
    //   this._dataSupplier.indsupplier = true
    // }

    this._dataSupplier = {
      ...this._dataSupplier,
      companies: [
        ...this.supplierSelectedCompanies.map(c => ({
          ...c,
          indSupplier: true,
        })),
        ...this.clientSelectedCompanies.map(c => ({
          ...c,
          indSupplier: false
        })),
      ],
      users: [
        ...this.supplier.users.map(u => ({
          ...u,
          indSupplier: true,
        })),
        ...this.client.users.map(u => ({
          ...u,
          indSupplier: false,
        })),
      ],
      contactNumbers: [
        ...this.supplier.contactNumbers.map(u => ({
          ...u,
          indSupplier: true,
        })),
        ...this.client.contactNumbers.map(u => ({
          ...u,
          indSupplier: false,
        })),
      ],
      exchangeRates: [
        ...this.supplier.exchangeRates.map(u => ({
          ...u,
          idSupplierCompany: u.idcompany,
          indSupplier: true,
        })),
        ...this.client.exchangeRates.map(u => ({
          ...u,
          idSupplierCompany: u.idcompany,
          indSupplier: false,
        })),
      ],
      financialSetup
    }
    console.log(this._dataSupplier)
    if (this._dataSupplier.socialReason != undefined && this._dataSupplier.commercialreason != undefined && this._dataSupplier.documentnumber != undefined && this._dataSupplier.ididentifier > 0 && this._dataSupplier.idexchangetype > 0
      && this._dataSupplier.idsupplierclasification > 0 && this._dataSupplier.idcountry > 0 && this._dataSupplier.idtaxpayertype > 0 && this._dataSupplier.idcurrency > 0 && this._dataSupplier.idpaymentcondition > 0 && this._dataSupplier.companies.length > 0) {
      if (this._dataSupplier.socialReason != "" && this._dataSupplier.documentnumber != "" && this._dataSupplier.commercialreason != "" && this.valor) {
        var a = this._dataSupplier.contactNumbers.filter(x => x.idType == 1)

        if (this.valor) {
          var b = this._dataSupplier.addresses.filter(x => x.idAddressType == 1)
          if (this._dataSupplier.addresses.length > 0 && b.length > 0) {
            this._dataSupplier.idcompaniesupplier = this._dataSupplier.idcompaniesupplier == 0 ? -1 : this._dataSupplier.idcompaniesupplier;
            this._dataSupplier.idclientsupplier = this._dataSupplier.idcompaniesupplier == 0 ? -1 : this._dataSupplier.idclientsupplier;
            this._dataSupplier.iddocumentType = this._dataSupplier.ididentifier;

            this.save();
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe ingresar una dirección fiscal al proveedor" });
          }
        }
      }
    }
    this.loading = false;
  }

  save() {
    this._SupplierService.InsertUpdateSupplier(this._dataSupplier).subscribe((data: number) => {
      if (data > 0) {
        this.filtersOfValues = this.filtersOfValues;
        let link: any[] = ['/supplier-panel', data.toString()];
        this._dataSupplier.idclientsupplier = data;
        if (this._dataSupplier.idclientsupplier > 0)
          this.search(this._dataSupplier.idclientsupplier, false);
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        // Comentado para evitar redirección a un ID erróneo
        // this.location.go(link[0] + "/" + link[1]);
        // this.router.navigateByUrl('/masters/supplier-list')
        this.submitted = false;
        this.loading = false;
        //this.ngOnInit(); 
        window.location.reload()
      } else if (data == -1)
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "El proveedor ya se encuentra registrado." });
      else if (data == -2)
        this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "El registro no se encuentra." });
      else if (data == -3)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
      this.loading = false;

    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
    });
  }

  onDeleteUser() {

  }


  isEmail(search: string): boolean {
    var serchfind: boolean;
    if (search != "") {
      let regexp: any
      regexp = new RegExp('^[_aA-zZ0-9._%+-]+@[_aA-zZ0-9.-]+\\.[Aa-zZ]{2,4}$');
      serchfind = regexp.test(search);
    }
    else
      serchfind = true;

    return serchfind
  }


  onLoadDocumentType(idcountry: number) {
    this._dataSupplier.iddocumentType = -1;
    this._dataSupplier.ididentifier = -1;
    this._dataSupplier.documentnumber = "";
    //this.disabled = true;
    this.disabledocument = false;
    let filters = new DocumentTypeFilter();
    filters.idCountry = idcountry;
    this._DocumentTypeService.getdocumentTypeList(filters).subscribe((data) => {
      this.IdentifierTypeList = data;
      this.documentTypeList = data.sort((a, b) => b.entityType.id - a.entityType.id).map((item) => ({
        label: item.identifier + "-" + item.name,
        value: item.id
      }))

    });
  }

  onValidateDocumentInput(event) {
    if (this.IdentifierTypeList) {
      this.identifierType = this.IdentifierTypeList.find(x => x.id === this._dataSupplier.ididentifier);
      if (this.identifierType.indAlphanumeric == true) {
        var inp = String.fromCharCode(event.keyCode);
        if (/^[a-zA-Z0-9]*$/.test(inp)) {
          return true;
        } else {
          event.preventDefault();
          return false;
        }

      } else {
        var inp = String.fromCharCode(event.keyCode);
        if (/^[0-9]*$/.test(inp)) {
          return true;
        } else {
          event.preventDefault();
          return false;
        }
      }

    } else {
      //this.disabled =true;
      this.onClearIndetifier();
    }

  }

  onClearIndetifier() {
    if (this.IdentifierTypeList) {
      this.disabled = false;
      this._dataSupplier.documentnumber = "";
    } else {
      this._dataSupplier.documentnumber = "";
      this.disabled = true;
    }

  }

  onClearInputDocument() {
    this._dataSupplier.documentnumber = "";
  }





  checkAllCompanies() {
    if (this.checkAllCompany) {
      this.selectedCompanies = this.selectedCompanies.filter(x => x.active == false);
      var companyselected: Company[] = [];
      this.companieslist.forEach(company => {
        if (company.active) {
          this.selectedCompanies.push(company);
        }
      });
      //this.selectedCompanies = companyselected;
    } else {
      this.selectedCompanies = this.selectedCompanies.filter(x => x.active == false);
    }
  }

  checkedcompany(e: any) {
    if (e.checked) {
      if (this.selectedCompanies.length == this.companieslist.filter(x => x.active).length)
        this.checkAllCompany = true;
    }
    else
      this.checkAllCompany = false;
  }

  showmodal(e: any) {
    this.isFormEdit = true;
    this.contactNumberDialogVisible = true;
  }


  handleChange(e) {
    var index = e.index;
    this.collapse = true;
    // this.collapse = index == 0 ? false: true;
    this.ContactsComponent.UpdateList(this.selectedCompanies);
    this.usersComponent.UpdateList(this.selectedCompanies);
  }

  BackToList() {
    const queryParams: any = {};
    queryParams.filters = JSON.stringify(this.filtersOfValues);
    const navigationExtras: NavigationExtras = {
      queryParams,
      skipLocationChange: true
    };
    const navigate = () => this.router.navigateByUrl('/masters/supplier-list')
    if (this.isFormEdit == true) {
      this.confirmationService.confirm({
        message: '¿Está seguro que desea regresar al listado?, si tiene cambios sin guardar los mismos se perderan',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: navigate,
        reject: (type) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              return false;
            case ConfirmEventType.CANCEL:
              return false;
          }
        }
      });
    } else {
      navigate()
    }
  }

  clearphone(e) {
    this._dataSupplier.phone = "";
  }
}

