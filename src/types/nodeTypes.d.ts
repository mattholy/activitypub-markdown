import { Node } from 'unist'

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