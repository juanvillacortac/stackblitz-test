import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SelectedNode, Template } from 'src/app/models/financial/initial-setup';
import { AccountingPlanBase } from '../shared/accounting-plan-base.component';

@Component({
  selector: 'app-items-details',
  templateUrl: './items-details.component.html',
  styleUrls: ['./items-details.component.scss']
})
export class ItemsDetailsComponent extends AccountingPlanBase implements OnInit {
  @Input() showItems = false;

  @Input() nodes: TreeNode[];
  @Input() separator: string;
  @Output() nodesChange = new EventEmitter<TreeNode[]>();
  @Input() selectedTree: TreeNode[]
  @Output() selectedTreeChange = new EventEmitter<TreeNode[]>();
  @Input() selectedNodes: { [key: number]: SelectedNode<Template> } = {}
  @Output() selectedNodesChange = new EventEmitter<TreeNode[]>();
  cols: ColumnD<Template>[];

  constructor() {
    super()
  }

  getSiblingsAndParents = (id: number, key: string) => {
    const current = this.selectedNodes[id]
    const parent = this.selectedNodes[current.node.idParent]
    let siblingsChecked: boolean = false;
    let siblings: SelectedNode<Template>[] = []
    if (parent) {
      siblings = Object.values(this.selectedNodes)
        .filter(n => n.node.idParent == parent.node.id && n.node.id != id)
      siblingsChecked = siblings.some(d => d[key])
    }

    const getParents = (parents: Template[], id: number) => {
      const data = Object.values(this.selectedNodes).map(n => n.node)
      const current = this.selectedNodes[id]
      const parent = this.selectedNodes[current.node.idParent]
      let copy: Template[] = parents
      copy = [...parents, ...data.filter(d => d.id == current.node.idParent)]
      if (parent) {
        copy = getParents(copy, parent.node.id)
      }
      return copy
    }

    return {
      siblings,
      siblingsChecked,
      parents: getParents([], id),
    }
  }

  selectAndDoSomething(props: {
    idx: number,
    field: string,
    primaryField?: string,
    currentTree?: TreeNode<Template>,
    callback?: (id: number, status: boolean) => void,
  }) {
    const { idx, field, currentTree, callback } = props
    if (callback) {
      callback(idx, this.selectedNodes[idx][field])
    }

    const selectChildrens = (childrens: TreeNode<Template>[]) => {
      childrens.forEach(c => {
        const status = this.selectedNodes[idx][field]
        const primaryStatus = props.primaryField ? this.selectedNodes[c.data.id][props.primaryField] : true 
        if (primaryStatus) {
          this.selectedNodes[c.data.id][field] = status
        }
        if (callback) {
          callback(c.data.id, status)
        }
        if (c.children.length) {
          selectChildrens(c.children)
        }
      })
    }
    if (currentTree?.children.length) {
      selectChildrens(currentTree.children)
    }
    const { parents, siblingsChecked } = this.getSiblingsAndParents(idx, field)

    let shouldChange = true

    parents.filter((p) => p.id != idx).forEach(p => {
      if (!shouldChange) {
        return
      }
      const status = siblingsChecked ? siblingsChecked : this.selectedNodes[idx][field]
      this.selectedNodes[p.id][field] = status
      if (callback) {
        callback(p.id, status)
      }

      const { siblings: parentSiblings } = this.getSiblingsAndParents(p.id, field)
      if (parentSiblings.length) {
        shouldChange = false
      }
      parentSiblings.forEach(s => {
        this.selectAndDoSomething({ ...props, idx: s.node.id, currentTree: null })
      })
    })

    this.selectedTree = this.sort(Object.values(this.selectedNodes).filter(n => n.selected))
    this.selectedTreeChange.emit(this.selectedTree)
  }

  selectAux(idx: number, current: Template, currentTree?: TreeNode<Template>) {
    this.selectAndDoSomething({
      idx,
      currentTree,
      field: 'applyAux',
      primaryField: 'selected',
    })
  }

  selectNode(idx: number, current: Template, currentTree?: TreeNode<Template>) {
    this.selectAndDoSomething({
      idx,
      currentTree,
      field: 'selected',
      callback: (id, status) => {
        if (!status) {
          this.selectedNodes[id].applyAux = status
        }
      },
    })
  }

  ngOnInit(): void {
    this.nodes = this.sort(Object.values(this.selectedNodes))

    this.cols = [
      { template: (data) => { return data.itemName; }, field: 'itemName', header: 'Partida', display: 'table-cell' },
      { template: (data) => { return data.level; }, field: 'level', header: 'Nivel', display: 'table-cell' },
      { template: () => { return null; }, field: 'haveAuxiliary', header: 'Aplica auxiliar', display: 'table-cell' }
    ];
  }

  cancel() {
    Object.keys(this.selectedNodes).forEach((k => {
      this.selectedNodes[k] = {
        ...this.selectedNodes[k],
        selected: false,
        applyAux: false,
      }
    }))
    this.nodes = this.sort(Object.values(this.selectedNodes))
    this.selectedTree = this.sort(Object.values(this.selectedNodes).filter(n => n.selected))
    this.selectedTreeChange.emit(this.selectedTree)
  }

  selectAll() {
    this.selectAllPromise().then((nodes) => {
      this.selectedNodes = nodes
    })
    this.selectedTree = this.sort(Object.values(this.selectedNodes).filter(n => n.selected))
    this.selectedTreeChange.emit(this.selectedTree)
  }

  async selectAllPromise() {
    let nodesCopy = { ...this.selectedNodes }
    Object.keys(nodesCopy).forEach(n => {
      nodesCopy[n].selected = true
    })
    return nodesCopy
  }

  toggleExpanded(status: boolean) {
    this.toggleExpandedPromise(status).then((nodes) => {
      this.nodes = nodes
    })
  }

  async toggleExpandedPromise(status: boolean): Promise<TreeNode<any>[]> {
    let nodesCopy = [...this.nodes]
    this.nodes.forEach(node => {
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
