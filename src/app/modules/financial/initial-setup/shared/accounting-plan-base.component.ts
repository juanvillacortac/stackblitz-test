import { SelectedNode, Template } from "src/app/models/financial/initial-setup"
import { TreeNode } from 'primeng/api'
import { Injector, Directive } from '@angular/core'
import { InitialSetupService } from "./initial-setup.service"
import { Separator } from "src/app/models/financial/separator"
import { Observable } from "rxjs/internal/Observable"

export type FormatCodeOptions = {
  innerSeparator?: string
}

@Directive()
export abstract class AccountingPlanBase {
  protected _setupService: InitialSetupService
  currentSeparator: Separator = {
    id: 1,
    separatorContent: '',
    active: true,
  }

  protected formatCodeOptions: FormatCodeOptions = {
    innerSeparator: '##',
  }

  constructor(injector?: Injector) {
    if (injector) {
      this._setupService = injector.get(InitialSetupService)
      this.fetchInitialSetup()
    }
  }

  fetchInitialSetup(onFinish?: () => void) {
    return this._setupService.getCurrentSeparator(1).then(s => {
      this.currentSeparator = s
      if (onFinish) {
        onFinish()
      }
    })
  }

  formatCode = (
    str: string | string[], separator: string = this.currentSeparator.separatorContent || '',
    options = this.formatCodeOptions
  ) => Array.isArray(str)
      ? str.join(separator)
      : str
        .split(options.innerSeparator)
        .join(separator)

  rawCode = (str: string, options = this.formatCodeOptions) => this.formatCode(str, '', options)

  splitCode = (str: string, s = this.formatCodeOptions.innerSeparator) => str.split(s)

  getCodeLength = (str: string | string[], options = this.formatCodeOptions) => Array.isArray(str)
    ? str.join('').length
    : this.rawCode(str, options).length

  sort(nodes: SelectedNode[]) {
    const appendChildrens = (t: Template): TreeNode<Template>[] => {
      let treeNodes: TreeNode<Template>[] = []

      const map = (t: TreeNode<Template>): TreeNode<Template> => {
        const node = t

        const data = nodes.map(n => n.node)
        const childrens = data
          .filter((d) => t.data.id == d.idParent)
          .map<TreeNode>((c) => ({
            label: c.itemName,
            data: c,
            children: [],
          }))

        if (childrens.length) {
          node.children = childrens
          node.children = node.children.map(map)
          treeNodes = [...node.children]
        }

        return node
      }

      map({
        label: t.itemName,
        data: t,
      })

      return treeNodes
    }
    return nodes.map(n => n.node).filter((d) => d.idParent == 0).map<TreeNode>((t) => ({
      label: t.itemName,
      data: t,
      children: appendChildrens(t),
      leaf: !appendChildrens(t).length
    }))

  }
}

