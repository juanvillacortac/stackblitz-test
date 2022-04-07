import { Component, OnInit } from '@angular/core';
import { SelectItem, TreeNode, MessageService } from 'primeng/api'
import { SelectedNode, Template } from 'src/app/models/financial/initial-setup';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { InitialSetupService } from '../../initial-setup/shared/initial-setup.service';

type Account = Template & {
  applyAuxiliary?: boolean
}

type Separator = {
  id: number
  separatorContent: string
}

@Component({
  selector: 'app-accounting-plan-details',
  templateUrl: './accounting-plan-details.component.html',
  styleUrls: ['./accounting-plan-details.component.scss']
})
export class AccountingPlanDetailsComponent extends AccountingPlanBase implements OnInit {
  noneSpecialCharacters:RegExp =/^[a-zA-Z-0-9-äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/
  separatorlist: SelectItem[];
  planNodes: { [key: number]: SelectedNode<Template> } = {};
  tree: TreeNode<Account>[]
  separator: Separator
  id: number
  planName: string
  length: number = 0

  constructor(
    private service: InitialSetupService,
    private msgService: MessageService,
  ) {
    super()
  }

  ngOnInit(): void {
    this.service.getSeparatorList()
      .subscribe((data) => {
        this.separatorlist = data.map((item) => ({
          label: item.separatorContent || 'Sin separador',
          value: item,
        }))

        this.service.getPlanBase(1).subscribe((data: any) => {
          this.planName = data.name
          this.separator = this.separatorlist.find(s => s.value.id == data.idSeparator).value
          this.id = data.id
          const lengths = data.accounts.map((d: Account) => this.getCodeLength(d.codeAccountingAccount))
          this.length = Math.max.apply(null, lengths)
          data.accounts.forEach((d: Account) => {
            this.planNodes[d.id] = {
              selected: true,
              applyAux: d.applyAuxiliary,
              node: d,
            }
          })
          console.log(data)
          this.tree = this.sort(Object.values(this.planNodes))
          console.log(this.tree)
        }, console.log)
      }, (error) => {
        console.log(error)
      })
  }

  update() {
    this.msgService.clear();
    if (!!!this.planName.trim()) {
      this.msgService.add({ severity: 'error', summary: 'Error', detail: "No puede dejar el nombre del plan vacío" });
      return
    }
    const payload = {
      id: this.id,
      name: this.planName,
      idSeparator: this.separator.id,
    }
    console.log(payload)
    this.service.updatePlan(payload).subscribe(success => {
      if (!success) {
        this.msgService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      } else {
        this.msgService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
      }
    })
  }
}
