import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import { visit, SKIP } from 'unist-util-visit';
function mentionPlugin() {
    return (tree) => {
        visit(tree, 'text', (node, index, parent) => {
            if (parent.type === 'link') {
                return;
            }
            const mentionRegex = /@[\w.-]+(?:@(?:[\w-]+\.)+[a-zA-Z]{2,})?/g;
            let match;
            let lastIndex = 0;
            const newNodes = [];
            while ((match = mentionRegex.exec(node.value)) !== null) {
                const isEmail = node.value.slice(Math.max(0, match.index - 7), match.index).toLowerCase() === 'mailto:';
                if (match.index > lastIndex) {
                    newNodes.push({
                        type: 'text',
                        value: node.value.slice(lastIndex, match.index),
                    });
                }
                if (!isEmail) {
                    newNodes.push({
                        type: 'mention',
                        value: match[0],
                    });
                }
                else {
                    newNodes.push({
                        type: 'text',
                        value: match[0],
                    });
                }
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < node.value.length) {
                newNodes.push({
                    type: 'text',
                    value: node.value.slice(lastIndex),
                });
            }
            if (newNodes.length > 0) {
                parent.children.splice(index, 1, ...newNodes);
                return [SKIP, index + newNodes.length];
            }
        });
    };
}
export function parseMarkdown(markdownText) {
    const processor = unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkGfm)
        .use(mentionPlugin);
    const ast = processor.parse(markdownText);
    const processedAst = processor.runSync(ast);
    return processedAst;
}
