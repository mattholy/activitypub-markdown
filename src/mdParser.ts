import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import { Node } from 'unist'
import { visit, SKIP } from 'unist-util-visit'

interface MentionNode extends Node {
  type: 'mention'
  value: string
}

function mentionPlugin() {
  return (tree: Node) => {
    visit(tree, 'text', (node: any, index: number, parent: any) => {
      const mentionRegex = /@[\w.-]+(?:@(?:[\w-]+\.)+[a-zA-Z]{2,})?/g
      let match
      let lastIndex = 0
      const newNodes = []

      while ((match = mentionRegex.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          newNodes.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index),
          })
        }
        newNodes.push({
          type: 'mention',
          value: match[0],
        })
        lastIndex = match.index + match[0].length
      }

      if (lastIndex < node.value.length) {
        newNodes.push({
          type: 'text',
          value: node.value.slice(lastIndex),
        })
      }

      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes)
        return [SKIP, index + newNodes.length]
      }
    })
  }
}

export function parseMarkdown(markdownText: string): Node {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(mentionPlugin)

  const ast = processor.parse(markdownText)

  const processedAst = processor.runSync(ast)

  return processedAst
}
