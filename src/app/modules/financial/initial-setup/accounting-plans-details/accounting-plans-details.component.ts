import { Component, OnInit ,Input} from '@angular/core';
import {TreeNode} from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { InitialSetupService } from 'src/app/modules/financial/initial-setup/shared/initial-setup.service';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Template, SelectedNode} from 'src/app/models/financial/initial-setup';
import { AccountingPlanBase } from '../shared/accounting-plan-base.component';

@Component({
  selector: 'app-accounting-plans-details',
  templateUrl: './accounting-plans-details.component.html',
  styleUrls: ['./accounting-plans-details.component.scss']
})
export class AccountingPlansDetailsComponent extends AccountingPlanBase implements OnInit {

  @Input() showPlan = false;
  @Input() separator: string;
  @Input() _nodeListTemp: TreeNode[];
  @Input() selectedNodes: { [key: number]: SelectedNode<Template> } = {};
  cols: ColumnD<Template>[];

  constructor(private _initialSetupService: InitialSetupService,public messageService:MessageService,public breadcrumbService: BreadcrumbService) {
    super()
 
  }
  

  ngOnInit(): void {

    this.cols = [
      { template: (data) => { return data.itemName; }, field: 'itemName', header: 'Partida', display: 'table-cell' },
      //{ template: (data) => { return null; }, field: 'level', header: 'Nivel', display: 'table-cell' },
      { template: (data) => { return null; }, field: 'Longitud', header: 'Longitud', display: 'table-cell' },
      { template: (data) => { return null; }, field: 'applyAux', header: 'Permitir auxiliares', display: 'table-cell' },
      { template: (data) => { return data.codeItem; }, field: 'codeItem', header: 'Partida', display: 'table-cell' },
      { template: (data) => { return null; }, field: 'codeAccountingAccount', header: 'Código de cuenta', display: 'table-cell' },
      
    ];
  }


  toggleExpanded(status: boolean) {
    this.toggleExpandedPromise(status).then((nodes) => {
      this._nodeListTemp = nodes
    })
  }

  async toggleExpandedPromise(status: boolean): Promise<TreeNode<any>[]> {
    let nodesCopy = [...this._nodeListTemp]
    this._nodeListTemp.forEach(node => {
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



