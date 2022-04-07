import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { ColumnD } from 'src/app/models/common/columnsd';
import { AccountingAccount } from 'src/app/models/financial/AccountingAccount';
import { AccountingAccountFilter } from 'src/app/models/financial/AccountingAccountFilter';
import { SelectAccountingAccountActiveModalFilter } from 'src/app/models/financial/SelectAccountingAccountActiveModalFilter';
import { SelectAccountingAccountModal } from 'src/app/models/financial/SelectAccountingAccountModal';
import { SelectAccountingAccountModalFilter } from 'src/app/models/financial/SelectAccountingAccountModalFilter';
import { ItemsDetailsComponent } from '../../initial-setup/items-details/items-details.component';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { AccountingAccountService } from '../shared/services/accounting-account.service';

type TreeSelecAccountingAccountModal = SelectAccountingAccountModal & {
  children?: SelectAccountingAccountModal[]
}
@Component({
  selector: 'app-select-accounting-account-modal',
  templateUrl: './select-accounting-account-modal.component.html',
  styleUrls: ['./select-accounting-account-modal.component.scss']
})
export class SelectAccountingAccountModalComponent extends AccountingPlanBase implements OnInit {

  @ViewChild('partida') partida: ElementRef;
  @Input("displayModal") displayModal: boolean;
  @Input("filtrarCuenta") filtrarCuenta: boolean;
  @Input() idBusiness = 1
  @Input("indClasificacionArticulo") indClasificacionArticulo: boolean;
  @Output() filtrarCuentaChange = new EventEmitter<boolean>();
  @Output() displayModalChange = new EventEmitter<boolean>();
  selectaccountingaccounts = [] as SelectAccountingAccountModal[];
  partidas = [] as SelectAccountingAccountModal[];
  nivel: number = 0;
  maxNivelCuenta:number = 0;
  currentNivelMax: number = 0;
  UltimoNivel: number = 0;
  selectedItem: number[] = [];
  selectaccountingaccountlist: SelectItem[][] = [[]];
  filter: SelectAccountingAccountModalFilter = new SelectAccountingAccountModalFilter();
  filterActive: SelectAccountingAccountActiveModalFilter = new SelectAccountingAccountActiveModalFilter();
  accountingaccountFilter = new AccountingAccountFilter();
  accountingaccounts=[] as AccountingAccount[];
  log = console.log
  CuentaContable: string = "";
  @Input() planCuentaContableDetalleId: number;
  @Output() planCuentaContableDetalleIdChange = new EventEmitter<number>();
  @Input() Ncuenta: string;
  @Output() NcuentaChange = new EventEmitter<string>();


  @Input() idCuentaContable: number=0;
  @Output() idCuentaContableChange = new EventEmitter<number>();
  @Output() accountingAccountCodeChange = new EventEmitter<string>();
  
  @Input() NombreCuenta: string;
  @Output() NombreCuentaChange = new EventEmitter<string>();
  @Input() indAuxiliar: boolean;
  @Output() indAuxiliarChange = new EventEmitter<boolean>();
  //@Input() ListAccounts: AccountingAccount[] = [];
  @Input() viewMode = false
  SelectAncestro: boolean = false;

  _data: SelectAccountingAccountModal = new SelectAccountingAccountModal();
  loading: any;
  constructor(private service: AccountingAccountService, private messageService: MessageService, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {

    this.viewMode= this.indClasificacionArticulo?false:this.viewMode
    this.fetchInitialSetup();

    if (this.indClasificacionArticulo!=undefined) {
      this.onLoadSelectAccountingAccountList(()=>{
        if (this.displayModal) {
         //this.partida.nativeElement.focus();
        }
      })
    }
 
   
  }

  displayedColumns: ColumnD<SelectAccountingAccountModal>[] =
    [

      { template: (data) => { return data.nivel; }, field: 'nivel', header: 'Nivel', display: 'table-cell' },
      { template: (data) => { return data.partida; }, field: 'partida', header: 'Partida', display: 'table-cell' },

    ];

  onLoadSelectAccountingAccountList(OnloadPartidas?: ()=>void) {
    let serviceFn: () => Observable<SelectAccountingAccountModal[]>
    if (this.indClasificacionArticulo) {
      serviceFn = () => this.service.getSelectAccountActivesList({ ...this.filterActive, idEmpresa: this.idBusiness })
    } else {
      serviceFn = () => this.service.getSelectAccountingAccountList({ ...this.filter, idEmpresa: this.idBusiness })
    }
    serviceFn().subscribe((data: SelectAccountingAccountModal[]) => {
      if (this.viewMode ) {
        let cuentas = this.Ncuenta.split("##");
        let comparar = cuentas[0];
        for (let index = 0; index < cuentas.length; index++) {

          this.selectaccountingaccountlist[index] = data.filter(h => h.codigoCuentaContable == comparar).map((item) => ({
            label: item.partida + '(' + this.formatCode(item.codigoCuentaContable) + ')',
            value: item.idPlantillaCuentaContable,
          }))
          comparar = comparar +"##"+ cuentas[index + 1];

        }
        this.CuentaContable = this.Ncuenta;

      } else {

        this.nivel = Math.max.apply(Math, data.map(function (item) { return item.nivel; }))
        this.partidas = data;

        
        if (this.Ncuenta?.length > 0) {
          let cuentas = this.Ncuenta.split("##");
          let comparar = cuentas[0];
          this.MetodoDeCargaInicial(this.partidas, 0, 0);
          for (let index = 0; index < cuentas.length; index++) {
            let filtered = data.find(h => h.codigoCuentaContable == comparar)

            if (filtered) {

              this.MetodoDeCarga(filtered.idPlantillaCuentaContable);
              // this.selectaccountingaccountlist[index] = data.filter(h => h.idPadre == filtered.idPlantillaCuentaContable).map((item) => ({
              //   label: item.partida + '(' + this.formatCode(item.codigoCuentaContable) + ')',
              //   value: item.idPlantillaCuentaContable,
              // }))

              this.selectedItem[index] = filtered?.idPlantillaCuentaContable

            }

            comparar = comparar +"##"+ cuentas[index + 1];
          }

        } else {
          this.MetodoDeCargaInicial(this.partidas, 0, 0);
        }

      }
      if (OnloadPartidas) {
        OnloadPartidas();
      }
    }, () => {

      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las partidas." });
    });

  }

  getAccountIdx(idx: number, arr: SelectItem<any>[][]) {
    return arr[idx].findIndex(i => i.value)
  }

  getComboPos(id: number) {
    for (let [idx, val] of this.selectaccountingaccountlist.entries()) {
      if (val.some(v => v.value == id)) {
        return idx
      }
    }
    return -1
  }

  MetodoDeCargaInicial(data: SelectAccountingAccountModal[], ini: number, idPadre: number) {
    let ancestros = idPadre;
    for (let index = ini; index < this.nivel; index++) {
      this.selectaccountingaccountlist[index] = data.filter(h => h.idPadre == ancestros).map((item) => ({
        label: item.partida + '(' + this.formatCode(item.codigoCuentaContable) + ')',
        value: item.idPlantillaCuentaContable,
      }))
      ancestros = -1;
    }

  }

  MetodoDeCarga(idP: number) {
    const filteredData = this.partidas.filter(h => h.idPadre == idP)
    const CContable = this.partidas.filter(h => h.idPlantillaCuentaContable == idP)
    this.CuentaContable = CContable[0].codigoCuentaContable;
   

    if (CContable[0].idPadre == 0) {
      
      this.UltimoNivel = 0;
      this.MetodoDeCargaInicial(this.partidas, 1, idP);
      this.SelectAncestro = true;
    } else {
      this.SelectAncestro = false;

      if (this.nivel > CContable[0].nivel) {
        this.selectaccountingaccountlist[CContable[0].nivel] = filteredData.length ? filteredData.map((item) => ({
          label: item.partida + '(' + this.formatCode(item.codigoCuentaContable) + ')',
          value: item.idPlantillaCuentaContable,
        })) : this.selectaccountingaccountlist[CContable[0].nivel]=[];this.selectedItem[CContable[0].nivel] = -1;
      }

      this.currentNivelMax = Math.max.apply(Math, this.partidas.filter(h => h.idPlantillaCuentaContable == idP).map(function (item) { return item.nivel; }))
      this.UltimoNivel = CContable[0].nivel;

      for (let index = CContable[0].nivel + 1; index < this.selectaccountingaccountlist.length; index++) {
        
        this.selectaccountingaccountlist[index] = [];
      }
      //this.Ncuenta = this.CuentaContable
      this.planCuentaContableDetalleId = CContable[0].idPlanCuentaContableDetalle;
     
      this.indAuxiliar = CContable[0].indPermiteAuxiliar;
      //this.NombreCuenta=CContable[0].
    }
  }

  onChange(event) {

    this.MetodoDeCarga(event.value);
    let pos = this.getComboPos(event.value)
   
    this.selectedItem[pos] = event.value;
   
    this.maxNivelCuenta = this.getLevels(event.value);
    if (this.SelectAncestro) {

      this.selectedItem[0] = event.value;
      for (let index = 1; index < this.selectedItem.length; index++) {
        this.selectedItem[index] = -1;
      }


    }

  }

  getLevels(id: number) {
    const t = this.partidas.find(h => h.idPadre == id)
    let nivel = 0

    const map = (t: TreeSelecAccountingAccountModal ): TreeSelecAccountingAccountModal => {
      const node = t

      const childrens = this.partidas
        .filter((d) => t.idPlantillaCuentaContable == d.idPadre)
        .map<TreeSelecAccountingAccountModal>((c) => ({
          ...c,
          children: [],
        }))

      if (childrens.length) {
        node.children = childrens
        node.children.forEach(c => {
          nivel = Math.max(c.nivel, nivel)
        })
        node.children = node.children.map(map)
      
      } else {
        nivel = Math.max(node.nivel, nivel)
      }

      return node
    }

    if (t) {
      map(t)
    }

    return nivel
  }




  CuentasContables(OnloadCuentas?: ()=>void){
    if (this.loading)
      return;
    this.loading = true;
    this.service.getAccountingAccountList(this.accountingaccountFilter).subscribe((data: AccountingAccount[]) => {      
      this.accountingaccounts = data;
 
      this.loading = false;
      if (OnloadCuentas) {
        OnloadCuentas();
      }
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las cuentas contables." });
        
    });
  
  
  }
  SaveSelectAccountingAccount() {
if (this.filtrarCuenta) {
  
  if (this.CuentaContable == "") {
    this.messageService.clear();
    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar al menos una partida partida" });
    return
  }
  this.displayModal = false;
  this.NcuentaChange.emit(this.CuentaContable)
}else{
  if (this.UltimoNivel == 0) {
    this.messageService.clear();
    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar todos los niveles de la partida" });
    return
  }
  if (this.UltimoNivel < this.maxNivelCuenta) {
   
      this.messageService.clear();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar todos los niveles de la partida" });
      return
   // }
  }
  this.CuentasContables(()=>{
    let CuentaExiste = this.accountingaccounts.filter(h => h.accountingAccountCode == this.CuentaContable)
    if (CuentaExiste.length > 0) {
      if (this.indClasificacionArticulo) {
        this.NombreCuentaChange.emit(CuentaExiste[0].accountingAccountName);
        this.idCuentaContableChange.emit(CuentaExiste[0].accountingAccountId);
        this.accountingAccountCodeChange.emit(CuentaExiste[0].accountingAccountCode);
        //llamar al sp de auxiliares pasandole el id de la cuentacontable
        //cargar combo de auxiliares
      }else{
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "La cuenta seleccionada se encuentra registrada." });
        return;
      }
      
     
    }
    
  this.displayModal = false;
  this.NcuentaChange.emit(this.CuentaContable)
  this.planCuentaContableDetalleIdChange.emit(this.planCuentaContableDetalleId);
  this.indAuxiliarChange.emit(this.indAuxiliar);
  })

}

  }




  hideDialog() {
    this.displayModal = false;
    this.filtrarCuenta =false;
    this.displayModalChange.emit(this.displayModal);
    this.filtrarCuentaChange.emit(this.filtrarCuenta);
    //this.NcuentaChange.emit(this.CuentaContable);
    this.selectaccountingaccountlist = [[]];
    this.CuentaContable = "";
     this.idCuentaContable=-1
    this.UltimoNivel = 0;
    this.nivel = 0;
    this.maxNivelCuenta=0;
    this.selectedItem = [];

  }
}
