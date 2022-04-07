import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { SelectedNode, Template } from 'src/app/models/financial/initial-setup';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { InitialSetupService } from 'src/app/modules/financial/initial-setup/shared/initial-setup.service';
import {TreeNode} from 'primeng/api';
import {MenuItem} from 'primeng/api';
import { AccountingPlanBase } from '../shared/accounting-plan-base.component';
import{Router} from "@angular/router";
import { ItemsDetailsComponent } from '../items-details/items-details.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-initial-setup-list',
  templateUrl: './initial-setup-list.component.html',
  styleUrls: ['./initial-setup-list.component.scss']
})
export class InitialSetupListComponent extends AccountingPlanBase implements OnInit {
  didMount = false
  showItems = false;
  showPlan = false;
  saving = false
  elementos: MenuItem[];
  activeIndex = 0;
  @ViewChild('child') itemsComponent: ItemsDetailsComponent
  noneSpecialCharacters:RegExp =/^[a-zA-Z-0-9-äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/
  itemsNodes: TreeNode[];
  aplicaAuxiliar: boolean = true;
  _nodeListTemp: TreeNode[];
  separatorlist: SelectItem[];
  separator: {
    id: number
    separatorContent: string
  }
  submitted = false
  nomString = false;
  planName: string
  templates: Template[]
  selectedNodes: { [key: number]: SelectedNode<Template> } = {}

  constructor(private _initialSetupService: InitialSetupService, public messageService: MessageService, public breadcrumbService: BreadcrumbService,private router:Router,private confirmationService: ConfirmationService) {
    super()
    this.breadcrumbService.setItems([
      { label: 'Financiero' },
      { label: 'Configuración' },
      { label: 'Plan de cuentas', routerLink: ['/financial/configuration/configuration'] }
    ]);
  }

  getLength(data: any) {
    
    const values = Object.values(data).filter((v: SelectedNode<Template>) => v.selected).map((v: SelectedNode<Template>) => v.node)
    const lengths = values.map((d) => this.getCodeLength(d.codeAccountingAccount))
    return Math.max(0, Math.max.apply(null, lengths))
  }

  ngOnInit() {
    this.planName ="";
    this.onLoadSeparatorList();
    debugger
    this.elementos = [{
      label: 'Partidas',
      command: (event: any) => {
        this.activeIndex = 0;
      }
    },
    {
      label: 'Plan de cuentas',
      command: (event: any) => {
        this.activeIndex = 1;
      }
    },
    ];

    this._initialSetupService.getTemplates().then(data => {
      data.forEach(d => {
        this.selectedNodes[d.id] = {
          selected: false,
          applyAux: false,
          node: d,
        }

      })

      this.templates = data
      this.showItems = true
      this.didMount = true
    });
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
  onBlurEvent(event: any) {
    debugger
     if (event.target.value=="" || event.target.value==" ") {
       this.nomString = true;
     }
     else {
       this.nomString = false;
     }   
   }
  onLoadSeparatorList() {
    this._initialSetupService.getSeparatorList()
      .subscribe((data) => {
        this.separatorlist = [...data.map((item) => ({
          label: item.separatorContent || 'Sin separador',
          value: item,
        }))]
      }, (error) => {
        console.log(error);
      });
  }

  cancel() {
    if (this.itemsComponent) {
      this.itemsComponent.cancel()
    }
    this.planName = "";
    this.separator = null;
    
  }



 
  next() {
   this.submitted=true;
  debugger

  this.separator
    if(this.planName != "" || this.planName.trim() && this.separator.id>0 ){
      if (!this.itemsNodes?.length ) {
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: "Debe seleccionar al menos una partida.",
          closable: false,
          life: 3000,
        });
        return
      }
      this.showItems = false;
      this.showPlan = true;
      this.activeIndex = 1;
    }
    
   
  }

  send() {
    this.messageService.clear();
    
    const items = Object.values(this.selectedNodes)
      .filter(n => n.selected)
      .map(n => ({
        id: n.node.id,
        level: n.node.level,
        formatedCode: this.formatCode(
          n.node.codeAccountingAccount,
          this.separator?.separatorContent || ''
        ),
        codeAccountingAccount: n.node.codeAccountingAccount,
        applyAuxiliary: n.applyAux,
      }))
    const payload = {
      name: this.planName,
      idBusiness: 1,
      accounts: items,
      idSeparator: this.separator?.id || 1,
    }
    this.confirmationService.confirm({
      message: '¿Está seguro de guardar los cambios?',
      accept: () => {
        this.saving = true
        this._initialSetupService.postPlan(payload)
        .subscribe((success) => {
          if (!success) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
          } else{
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            this.router.navigate(["/financial/configuration/accounting-plan"]).then(() => {
              window.location.reload()
            })
          }
          
        }, () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
          this.saving = false
        });
      }
  });
  
  }

  back() {
    this.showItems = true;
    this.showPlan = false;
    this.activeIndex = 0;
  }
}
