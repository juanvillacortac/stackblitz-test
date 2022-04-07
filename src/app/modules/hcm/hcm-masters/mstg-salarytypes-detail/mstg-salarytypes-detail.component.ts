import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { SalaryTypeFilter } from '../../shared/filters/salary-type-filter';
import { SalaryType } from '../../shared/models/masters/salary-type';
import { SalaryTypeService } from '../../shared/services/salary-type.service';

@Component({
  selector: 'app-mstg-salarytypes-detail',
  templateUrl: './mstg-salarytypes-detail.component.html',
  styleUrls: ['./mstg-salarytypes-detail.component.scss']
})
export class MstgSalarytypesDetailComponent implements OnInit {
  noneSpecialCharacters:RegExp =/^[a-zA-Z-0-9-äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/
  @Input("showDialog") showDialog: boolean = true;

  @Input("_data") _data: SalaryType = new SalaryType();
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() onUpdate = new EventEmitter();
  @Input("filters") filters: SalaryTypeFilter; 
  model: SalaryType = new SalaryType();
  _validations: Validations = new Validations();
  submitted = false
  statuslist: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];
  salaryCharacterlist: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];
  requiredlist: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];
  nomString = false;
  saving :boolean;

  _Authservice : AuthService = new AuthService(this._httpClient);
  cboCurrencies: SelectItem[];
  coinOption: number = 0;
  coinFilter: CoinxCompanyFilter = new CoinxCompanyFilter();

  constructor(private service: SalaryTypeService, 
    private messageService: MessageService, 
    private _httpClient: HttpClient,
    public _Currency: CoinsService) { }

  onBlurEvent(event: any) {
    debugger
     if (event.target.value=="" || event.target.value==" ") {
       this.nomString = true;
     }
     else {
       this.nomString = false;
     }   
   }

  ngOnInit(): void {
    debugger
    this.saving = false
    this.submitted = false;

    if (this._data.id <= 0)
      this._data.active = true

    this.loadCurrency();
  }

  hideDialog(): void {
  
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this.nomString = false;
    this._data.id = -1;
    this._data.name =" ";
    this._data.active = true;
    this._data.currency=-1;
    this._data.required= false;
    this._data.salaryCharacter= false;
   
  }

  isNan(value: any): boolean {
    if (value != "") {
      if (isNaN(+value))
        return true;
      else
        return false
    }
    else
      return true;
  }

  save(){
    debugger
    
    this.submitted = true;
    if (this._data.name != "" && this._data.name.trim()) {
     this.messageService.clear();
     this.saving = true 
      this._data.companyId = parseInt(this._Authservice.currentCompany);
      this.service.PostSalaryType(this._data).subscribe((data) => {
        if (data > 0) {
         debugger
         this.showDialog = false;
         this.showDialogChange.emit(this.showDialog);
          this.submitted = false;
          this.saving = false;
          this.onUpdate.emit();
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        } else if (data == -1) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
          this.saving = false;
        }
        else if (data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
        }
        //window.location.reload();
      }, () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      });
      
    }
  
  }

  loadCurrency(){  
    this.coinFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._Currency.getCoinxCompanyList(this.coinFilter).subscribe((valor: Coins[]) => {
      this.cboCurrencies = valor.map<SelectItem>((item) => ({
        value: item.id,
        label: item.name
      }));
      //this.coinDropdown.push({value: -1, label:'Todos'});
      this.cboCurrencies.sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error" });
    });
  }

}
