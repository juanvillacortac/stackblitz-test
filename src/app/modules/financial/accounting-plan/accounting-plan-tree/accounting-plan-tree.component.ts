import { Component, OnInit, Input, Injector } from '@angular/core';
import { SelectedNode, Template } from 'src/app/models/financial/initial-setup';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { ColumnD } from 'src/app/models/common/columnsd';
import { TreeNode } from 'primeng/api'
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
type Account = Template & {
  applyAuxiliary?: boolean
}

@Component({
  selector: 'app-accounting-plan-tree',
  templateUrl: './accounting-plan-tree.component.html',
  styleUrls: ['./accounting-plan-tree.component.scss']
})
export class AccountingPlanTreeComponent extends AccountingPlanBase implements OnInit {
  @Input() tree: TreeNode<Account>[];
  @Input() separator: string
  @Input() nodes: { [key: number]: SelectedNode<Template> } = {};
  cols: ColumnD<Account>[];
  constructor(public breadcrumbService: BreadcrumbService, injector: Injector) {
    super()
    this.breadcrumbService.setItems([
      { label: 'Financiero' },
      { label: 'Configuración' },
      { label: 'Plan de cuentas', routerLink: ['/financial/configuration/accounting-plan'] }
    ]);
  }

  ngOnInit(): void {
    this.cols = [
      { template: (data) => { return data.itemName; }, field: 'itemName', header: 'Partida', display: 'table-cell' },
      { template: (data) => { return data.level+' ('+this.formatCode(data.codeAccountingAccount, this.separator)+')'; }, field: 'level', header: 'Nivel', display: 'table-cell' },
      { template: (data) => { return this.getCodeLength(data.codeAccountingAccount) }, field: 'Longitud', header: 'Longitud', display: 'table-cell' },
      { template: (data) => { return null; }, field: 'applyAuxiliary', header: 'Permitir auxiliares', display: 'table-cell' },
      { template: (data) => { return data.codeItem; }, field: 'codeItem', header: 'Partida', display: 'table-cell' },
      { template: (data) => { return this.formatCode(data.codeAccountingAccount, this.separator); }, field: 'codeAccountingAccount', header: 'Código de cuenta', display: 'table-cell' },
    ];
  }

  toggleExpanded(status: boolean) {
    this.toggleExpandedPromise(status).then((nodes) => {
      this.tree = nodes
    })
  }

  async toggleExpandedPromise(status: boolean): Promise<TreeNode<any>[]> {
    let nodesCopy = [...this.tree]
    this.tree.forEach(node => {
      this.expandRecursive(node, status);
    });
    return nodesCopy
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
}
