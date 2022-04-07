import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { LedgerAccountCategoryService } from 'src/app/modules/financial/LedgerAccountCategory/shared/services/ledger-account-category.service'
import { LedgerAccountCategory } from 'src/app/models/financial/LedgerAccountCategory';
import { LedgerAccountCategoryFilter } from 'src/app/models/financial/LedgerAccountCategoryFilter';


@Component({
  selector: 'app-ledger-account-category-panel',
  templateUrl: './ledger-account-category-panel.component.html',
  styleUrls: ['./ledger-account-category-panel.component.scss'],
})
export class LedgerAccountCategoryPanelComponent implements OnInit {
  noneSpecialCharacters:RegExp =/^[a-zA-Z0-9äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/
  @Input("showDialog") showDialog: boolean = true;
  @Input("_data") _data: LedgerAccountCategory =  new LedgerAccountCategory();
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() onUpdate = new EventEmitter();
  @Input("filters") filters: LedgerAccountCategoryFilter;
  _validations: Validations = new Validations();
  submitted = false;
  nomString = false
  statuslist: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];

  saving: boolean;

  constructor(
    private service: LedgerAccountCategoryService,
    private messageService: MessageService,
  ) { }

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
  
    this.saving = false;
    this.submitted = false;

    if(this._data.accountingAccountCategoryId<=0)
     this._data.active=true

  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this.nomString = false;
    //tomar en cuenta no realizar este tipo de instancia this._data = new LedgerAccountCategory();
    // porque genera error en consola,se debe asignar valor individual.
    this._data.accountingAccountCategoryId = -1
    this._data.accountingAccountCategory="";
    this._data.active = true
   
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
  save(): void {
    
    this.submitted = true;
    if (this._data.accountingAccountCategory != "" && this._data.accountingAccountCategory.trim() ) {
      
      this.messageService.clear();
      this.saving = true;
      this.service.postLedgerAccountCategory(this._data).subscribe((data) => {
      
        if (data > 0) {
          debugger
          
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
          this.submitted = false;
          this.saving = false;
          this.nomString = false;
          this.onUpdate.emit();
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
   
    //this.saving = false;
  }

}
