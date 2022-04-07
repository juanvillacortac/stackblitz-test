import { SelectedNode, Template } from "src/app/models/financial/initial-setup"
import { TreeNode } from 'primeng/api'

export class AccountingPlanBase {
  formatCode = (str: string, s: string = '') => {
    if (str.length <= 1) {
      return str
    }
    if (str.length > 7) {
      const prefix = str.substring(1, 7)
      const suffix = str.substring(7, str.length)
      return [str[0], ...prefix.match(/.{1,2}/g), suffix].join(s)
    }
    const suffix = str.substring(1, str.length)
    return [str[0], ...suffix.match(/.{1,2}/g)].join(s)
  }

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
