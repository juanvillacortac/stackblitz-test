import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { roundToNearestMinutesWithOptions } from 'date-fns/fp';
import { el } from 'date-fns/locale';
import { MessageService, SelectItem } from 'primeng/api';
import { AccountingAccount } from 'src/app/models/financial/AccountingAccount';
import { AccountingAccountFilter } from 'src/app/models/financial/AccountingAccountFilter';
import { Article } from 'src/app/models/financial/article';
import { ArticleClassification } from 'src/app/models/financial/ArticleClassification';
import { AuxiliariesAccountingAccountFilter } from 'src/app/models/financial/AuxiliariesAccountingAccount';
import { SupplierAccountingAccount } from 'src/app/models/masters/supplier-extend';
import { AccountingAccountService } from 'src/app/modules/financial/AccountingAccounts/shared/services/accounting-account.service';
import { ArticleClassificationService } from 'src/app/modules/financial/article-classification/shared/services/article-classification.service';
import { AccountingPlanBase } from 'src/app/modules/financial/initial-setup/shared/accounting-plan-base.component';
import { BranchOffice } from 'src/app/modules/hcm/shared/models/masters/branch-office';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CostCenterService } from 'src/app/modules/masters/cost-center/shared/services/cost-center.service';
import { accountingAccounts } from '../sale-transactions-details/sale-transactions-details.component';

@Component({
  selector: 'app-sale-transaction-acount-modal',
  templateUrl: './sale-transaction-acount-modal.component.html',
  styleUrls: ['./sale-transaction-acount-modal.component.scss']
})
export class SaleTransactionAcountModalComponent extends AccountingPlanBase implements OnInit {

  @Input() branchs = [] as BranchOffice[];
  @Input("showDialog") showDialog: boolean;
  @Input("_data") _data: accountingAccounts = new accountingAccounts();
  @Input("_dataClasi") _dataClasi: ArticleClassification = new ArticleClassification();
  @Input("_dataArticle") _dataArticle: Article = new Article();
  @Input("_indArticle") _indArticle: boolean;
  @Input() idBusiness = 1
  @Input() accountingAccounts: SupplierAccountingAccount[] = [];

  @Input("viewMode") viewMode: boolean;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<accountingAccounts>();
  @Output() onUpdate = new EventEmitter<accountingAccounts>();
  filter: AuxiliariesAccountingAccountFilter = new AuxiliariesAccountingAccountFilter();
  _validations: Validations = new Validations();
  statuslist: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];
  nomString = false;
  uso: number;
  saving: boolean;
  submitted: boolean;
  displayModal: boolean;
  auxiliarylist: SelectItem[];
  accountUsagelist: SelectItem[];
  NombreCuenta: string;
  AuxiliarID: number = -1;
  branchOfficeId: number = -1;
  filtrarCuenta: boolean;
  loading: any;
  branchOfficeList: SelectItem[];

  accountingaccounts = [] as AccountingAccount[];
  accountingaccountFilter = new AccountingAccountFilter();
  constructor(private service: ArticleClassificationService, private costCenterService: CostCenterService, private _accountingAccountService: AccountingAccountService, private messageService: MessageService, injector: Injector) {
    super(injector);
  }

  costCenters: SelectItem<number>[] = []

  ngOnInit(): void {
    debugger
    this.branchOfficeList = this.branchs.sort((a, b) => a.branchOfficeName.localeCompare(b.branchOfficeName)).map(cc => ({
      label: cc.branchOfficeName,
      value: cc.id
    })) 

    console.log(this.branchOfficeList)
    this.onLoadAuxiliariesAssociatedList(() => {
      if (this._data.auxiliarId > 0) {
        this.AuxiliarID = this._data.auxiliarId;
      }
    });
    this.costCenterService.getCentersCostsList().toPromise().then((list) => {
      this.costCenters = list.sort((a, b) => a.name.localeCompare(b.name)).map(cc => ({
        label: cc.name,
        value: cc.id
      }))
    });

    this.fetchInitialSetup();

    this.onLoadAccountUsageList();

    if (!this.viewMode) {
      this.ClearData();
    }

    if (this._data.accountingAccount != "") {
      this.NombreCuenta = this._data.accountingAccount;
    }
    if (this._data.auxiliarId > 0) {
      this.AuxiliarID = this._data.auxiliarId;

    }
    this.uso = this._data.tipoUsoCuentaId
  }
  foo() {

    this.filter.idPlanCuentaContableDetalle = this._data.idPlanCuentaContableDetalle;
    this.onLoadAuxiliariesAssociatedList();
    this.AuxiliarID = -1

  }

  getChargeCenterName(){
    const data = this.costCenters.find(e => e.value == this._data.chargeCenterId)
    if (data) {
      this._data.chargeCenter = data.label;

    }
  }

  getBranchOfficeName(){

    const data = this.branchOfficeList.find(e => e.value == this._data.branchOfficeId)
    if (data) {
      this._data.branchOffice = data.label;

    }
}

  onShow() {
    const html = document.getElementsByTagName('html')[0]
    html.style.overflowY = 'hidden'
    this.ngOnInit()
  }


  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this.nomString = false;
    this.AuxiliarID = -1;
    this.NombreCuenta = "";
    this.ClearData();
    const html = document.getElementsByTagName('html')[0]
    html.style.overflowY = ''
    //this.viewMode = false
  }

  onChangeAccountUsage(event) {

    const usage = this.accountUsagelist.find(e => e.value === event.value)

    if (usage) {
      this._data.tipoUsoCuenta = usage.label

    }

  }
  onChangeAuxiliary() {


    const aux = this.auxiliarylist.find(e => e.value === this.AuxiliarID)

    if (aux) {
      this._data.auxiliar = aux.label
    }

  }

  onLoadAccountUsageList() {

    this.service.getAccountUsageList()
      .subscribe((data) => {
        data.sort((a, b) => 0 - (a.accountUsageContent > b.accountUsageContent ? -1 : 1));
        this.accountUsagelist = data.filter(a => a.active).map((item) => ({
          label: item.accountUsageContent,
          value: item.id,
        }))
      }, (error) => {
        console.log(error);
      });
  }


  onLoadAuxiliariesAssociatedList(_onLoad?: () => void) {
    debugger
    //comentado por prueba
    //this.filter.idCuentaContable = this._data.idPlanCuentaContableDetalle || -1;
    this.filter.idPlanCuentaContableDetalle = this._data.idPlanCuentaContableDetalle || -1;

    this.filter.active = 1;
    //this.AuxiliarID=-1;

    this.service.getAuxiliariesAssociatedList({ ...this.filter, idEmpresa: -1 })
      .subscribe((data) => {
        data.sort((a, b) => 0 - (a.id > b.id ? -1 : 1));
        this.auxiliarylist = [...data.map((item) => ({
          label: item.auxiliar,
          value: item.id,
        }))]
        console.log(this.auxiliarylist)
      }, (error) => {
        console.log(error);
      });
  }
  ClearData() {

    this._data = new accountingAccounts()

  }

  showModalDialog() {
    debugger
    this.cuentaExiste()

  }


  cuentaExiste() {
    if (this.loading)
      return false;
    this.loading = true;
    this.messageService.clear();
    this._accountingAccountService.getAccountingAccountList({ ...this.accountingaccountFilter, idBusiness: this.idBusiness }).subscribe((data: AccountingAccount[]) => {
      this.loading = false;

      if (data.length) {
        this.displayModal = true;
        this.filtrarCuenta = false;
        if (this._data.idAssociate >= 0) {
          this.viewMode = true
        }
        return;
      }

      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "No existen cuentas registradas en esta empresa" });
      return;



    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las cuentas contables." });

    });

  }
  save() {

    if (!this.NombreCuenta || !this._data.tipoUsoCuentaId  ){
      this.submitted = true;
      return;
    }

    if (this.NombreCuenta != "") {
      this._data.accountingAccountCode = this.NombreCuenta;
    }

    if (this.AuxiliarID == null)
      this.AuxiliarID = -1

    if (this.AuxiliarID > 0) {
      this._data.auxiliarId = this.AuxiliarID;
    }

    if (!this._data.indPermiteAuxiliar) {
      this._data.auxiliar = "N/A"
      this._data.auxiliarId = -1
    } else {
      if (this.AuxiliarID < 0) {
        this._data.auxiliar = "Ninguno"
        this._data.auxiliarId = -1
      }

    }
    
    if (this.accountingAccounts.length > 0 && this.accountingAccounts?.filter(aa => aa.active && aa.accountingAccountId != this._data.idAssociate)?.find(aa => aa.useId == this._data.tipoUsoCuentaId)) {
      this.messageService.clear()
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "El tipo de uso se encuentra registrado" });
      return
    } 

    

    this.submitted = true;
    if (
      this._data.tipoUsoCuentaId > -1
      && this._data.accountingAccountCode != ""

    ) {
      this.submitted = false;
      this.saving = false;
      this.messageService.clear();
      /*
      if (this.viewMode) {

        const data = this._indArticle ? this._dataArticle : this._dataClasi
        const tipoUsoExiste = data.associatedAccount.filter(c => c.tipoUsoCuentaId == this._data.tipoUsoCuentaId)

        if ((tipoUsoExiste.length > 0) && (this.uso != tipoUsoExiste[0].tipoUsoCuentaId)) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El tipo de uso se encuentra registrado" });
          return;
        }


        this.onUpdate.emit(this._data);
      } else {
        const data = this._indArticle ? this._dataArticle : this._dataClasi
        let tipoUsoExiste;
        if (this._indArticle) {
          tipoUsoExiste = data.associatedAccount.filter(c => c.tipoUsoCuentaId == this._data.tipoUsoCuentaId && c.origenArt == "Artículo")
        } else {
          tipoUsoExiste = data.associatedAccount.filter(c => c.tipoUsoCuentaId == this._data.tipoUsoCuentaId)
        }
        if (tipoUsoExiste.length > 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El tipo de uso se encuentra registrado" });
          return;
        }

        
      }*/
      
      // this.messageService.add({ severity: 'success', summary: 'Cuenta', detail: "Guardado exitoso" });

    } 

    console.log(this._data);
      this.onCreate.emit(this._data);
      this.showDialog = false;
      this.showDialogChange.emit(this.showDialog);

  }
}
