import { h, VNode } from 'vue'
import { Node } from 'unist'
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
    align: Array<'left' | 'center' | 'right' | null>
    children: TableRowNode[]
}

interface TableRowNode extends Node {
    type: 'tableRow'
    children: TableCellNode[]
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

interface RenderOptions {
    customComponents?: customComponents
    customRenderers?: customRenderers
}

interface customComponents {
}

interface customRenderers {
    root?: (node: RootNode) => VNode
    text?: (node: TextNode) => VNode
    paragraph?: (node: ParagraphNode) => VNode
    heading?: (node: HeadingNode) => VNode
    emphasis?: (node: EmphasisNode) => VNode
    strong?: (node: StrongNode) => VNode
    inlineCode?: (node: InlineCodeNode) => VNode
    code?: (node: CodeNode) => VNode
    blockquote?: (node: BlockquoteNode) => VNode
    list?: (node: ListNode) => VNode
    listItem?: (node: ListItemNode) => VNode
    thematicBreak?: (node: ThematicBreakNode) => VNode
    break?: (node: BreakNode) => VNode
    link?: (node: LinkNode) => VNode
    image?: (node: ImageNode) => VNode
    table?: (node: TableNode) => VNode
    tableRow?: (node: TableRowNode) => VNode
    tableCell?: (node: TableCellNode) => VNode
    delete?: (node: DeleteNode) => VNode
    html?: (node: HTMLNode) => VNode
    mention?: (node: MentionNode) => VNode
    inlineMath?: (node: InlineMathNode) => VNode
    math?: (node: MathNode) => VNode
}

export type { RenderedNode, RenderOptions, customComponents }

export function renderAst2Vue(ast: Node, options?: RenderOptions): VNode[] {
    console.log('renderAst2Vue-op', options)
    function renderNode(node: RenderedNode, customRenderers?: customRenderers, customComponents?: customComponents): VNode | VNode[] {
        if (customRenderers) {
            switch (node.type) {
                case 'root':
                    if (customRenderers?.root) {
                        return customRenderers.root(node)
                    }
                    return h(
                        'div',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
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
                    if (customRenderers?.text) {
                        return customRenderers?.text(node)
                    }
                    return h(
                        'span',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.value) }
                    )
                case 'paragraph':
                    if (customRenderers?.paragraph) {
                        return customRenderers.paragraph(node)
                    }
                    return h(
                        'p',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'heading':
                    if (customRenderers?.heading) {
                        return customRenderers.heading(node)
                    }
                    return h(
                        `h${node.depth}`,
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'emphasis':
                    if (customRenderers?.emphasis) {
                        return customRenderers.emphasis(node)
                    }
                    return h(
                        'em',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'strong':
                    if (customRenderers?.strong) {
                        return customRenderers.strong(node)
                    }
                    return h(
                        'strong',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'inlineCode':
                    if (customRenderers?.inlineCode) {
                        return customRenderers.inlineCode(node)
                    }
                    return h(
                        'code',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => node.value }
                    )

                case 'code':
                    if (customRenderers?.code) {
                        return customRenderers.code(node)
                    }
                    return h(
                        'pre',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => h('code', { 'data-node-style': 'default' }, node.value) }
                    )

                case 'blockquote':
                    if (customRenderers?.blockquote) {
                        return customRenderers.blockquote(node)
                    }
                    return h(
                        'blockquote',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'list':
                    if (customRenderers?.list) {
                        return customRenderers.list(node)
                    }
                    return h(
                        node.ordered ? 'ol' : 'ul',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'listItem':
                    if (customRenderers?.listItem) {
                        return customRenderers.listItem(node)
                    }
                    return h(
                        'li',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'thematicBreak':
                    if (customRenderers?.thematicBreak) {
                        return customRenderers.thematicBreak(node)
                    }
                    return h('hr', { 'data-node-type': node.type, 'data-node-style': 'default' })

                case 'break':
                    if (customRenderers?.break) {
                        return customRenderers.break(node)
                    }
                    return h('br', { 'data-node-type': node.type, 'data-node-style': 'default' })

                case 'link':
                    console.log('处理LinkNode', customRenderers?.link)
                    if (customRenderers?.link) {
                        console.log('处理LinkNode', '使用外部组件')
                        return customRenderers.link(node)
                    }
                    return h(
                        'a',
                        { href: node.url, title: node.title, 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'image':
                    if (customRenderers?.image) {
                        return customRenderers.image(node)
                    }
                    return h('img', {
                        src: node.url,
                        alt: node.alt,
                        title: node.title,
                        'data-node-type': node.type,
                        'data-node-style': 'default'
                    })

                case 'table':
                    if (customRenderers?.table) {
                        return customRenderers.table(node)
                    }
                    return h(
                        'table',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'tableRow':
                    if (customRenderers?.tableRow) {
                        return customRenderers.tableRow(node)
                    }
                    return h(
                        'tr',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'tableCell':
                    if (customRenderers?.tableCell) {
                        return customRenderers.tableCell(node)
                    }
                    return h(
                        'td',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'delete':
                    if (customRenderers?.delete) {
                        return customRenderers.delete(node)
                    }
                    return h(
                        'del',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'html':
                    if (customRenderers?.html) {
                        return customRenderers.html(node)
                    }
                    return h('div', {
                        innerHTML: node.value,
                        'data-node-type': node.type,
                        'data-node-style': 'default'
                    })

                case 'mention':
                    if (customRenderers?.mention) {
                        return customRenderers.mention(node)
                    }
                    return h(
                        'span',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => node.value }
                    )
            }
        } else {
            return h('div', { 'data-node-type': 'error', 'data-node-style': 'default' }, 'No custom renderers provided')
        }
    }

    const renderedNodes = renderNode(ast as RenderedNode, options?.customRenderers)
    return Array.isArray(renderedNodes) ? renderedNodes : [renderedNodes]
}