// renderMarkdownAST2NaiveUI.ts

import { h, VNode } from 'vue'
import { Node } from 'unist'
import { NText, NP, NH1, NH2, NH3, NH4, NH5, NH6 } from 'naive-ui'
import 'katex/dist/katex.min.css'
import katex from 'katex'

interface RootNode extends Node {
  type: 'root'
  children: RenderedNode[]
}

interface ParagraphNode extends Node {
  type: 'paragraph'
  children: RenderedNode[]
}

interface TextNode extends Node {
  type: 'text'
  value: string
}

interface HeadingNode extends Node {
  type: 'heading'
  depth: number
  children: RenderedNode[]
}

interface EmphasisNode extends Node {
  type: 'emphasis'
  children: RenderedNode[]
}

interface StrongNode extends Node {
  type: 'strong'
  children: RenderedNode[]
}

interface InlineCodeNode extends Node {
  type: 'inlineCode'
  value: string
}

interface CodeNode extends Node {
  type: 'code'
  value: string
  lang?: string
}

interface BlockquoteNode extends Node {
  type: 'blockquote'
  children: RenderedNode[]
}

interface ListNode extends Node {
  type: 'list'
  ordered: boolean
  start?: number
  spread?: boolean
  children: RenderedNode[]
}

interface ListItemNode extends Node {
  type: 'listItem'
  spread?: boolean
  checked?: boolean | null
  children: RenderedNode[]
}

interface ThematicBreakNode extends Node {
  type: 'thematicBreak'
}

interface BreakNode extends Node {
  type: 'break'
}

interface LinkNode extends Node {
  type: 'link'
  url: string
  title?: string
  children: RenderedNode[]
}

interface ImageNode extends Node {
  type: 'image'
  url: string
  title?: string
  alt?: string
}

interface TableNode extends Node {
  type: 'table'
  align: Array<'left' | 'right' | 'center' | null>
  children: RenderedNode[]
}

interface TableRowNode extends Node {
  type: 'tableRow'
  children: RenderedNode[]
}

interface TableCellNode extends Node {
  type: 'tableCell'
  children: RenderedNode[]
}

interface DeleteNode extends Node {
  type: 'delete'
  children: RenderedNode[]
}

interface HTMLNode extends Node {
  type: 'html'
  value: string
}

interface MentionNode extends Node {
  type: 'mention'
  value: string
}

interface InlineMathNode extends Node {
  type: 'inlineMath'
  value: string
}

interface MathNode extends Node {
  type: 'math'
  value: string
}

// 定义联合类型，包含所有节点类型
type RenderedNode =
  | RootNode
  | ParagraphNode
  | TextNode
  | HeadingNode
  | EmphasisNode
  | StrongNode
  | InlineCodeNode
  | CodeNode
  | BlockquoteNode
  | ListNode
  | ListItemNode
  | ThematicBreakNode
  | BreakNode
  | LinkNode
  | ImageNode
  | TableNode
  | TableRowNode
  | TableCellNode
  | DeleteNode
  | HTMLNode
  | MentionNode
  | InlineMathNode
  | MathNode


export function renderAstToNaiveUI(ast: Node): VNode[] {
  function renderNode(node: RenderedNode): VNode | VNode[] {
    switch (node.type) {
      case 'root':
        return h(
          'div',
          { 'data-node-type': node.type },
          { default: () => (node.children || []).flatMap(renderNode) }
        )
      case 'inlineMath':
        try {
          const html = katex.renderToString(node.value, {
            throwOnError: false,
          })
          return h('span', {
            innerHTML: html,
            'data-node-type': node.type,
          })
        } catch (e) {
          return h('span', { 'data-node-type': node.type }, node.value)
        }

      case 'math':
        try {
          const html = katex.renderToString(node.value, {
            throwOnError: false,
            displayMode: true,
          })
          return h('div', {
            innerHTML: html,
            'data-node-type': node.type,
          })
        } catch (e) {
          return h('div', { 'data-node-type': node.type }, node.value)
        }

      case 'text':
        return h(NText, { 'data-node-type': node.type }, { default: () => node.value })

      case 'mention':
        return h(NText, { 'data-node-type': node.type }, { default: () => node.value })

      case 'paragraph':
        return h(NP, { 'data-node-type': node.type }, { default: () => (node.children || []).flatMap(renderNode) })

      case 'heading':
        const depth = node.depth || 1
        const HeadingComponent = getHeadingComponent(depth)
        return h(
          HeadingComponent,
          { 'data-node-type': node.type },
          { default: () => (node.children || []).flatMap(renderNode) }
        )

      default:
        return h(
          'div',
          { 'data-node-type': node.type },
          { default: () => 'Unknown node type: ' + node.type }
        )
    }
  }

  const renderedNodes = renderNode(ast as RenderedNode)
  return Array.isArray(renderedNodes) ? renderedNodes : [renderedNodes]
}

function getHeadingComponent(depth: number) {
  switch (depth) {
    case 1:
      return NH1
    case 2:
      return NH2
    case 3:
      return NH3
    case 4:
      return NH4
    case 5:
      return NH5
    case 6:
      return NH6
    default:
      return NH1
  }
}
