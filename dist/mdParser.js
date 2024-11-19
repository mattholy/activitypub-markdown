import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
function activityPubPlugin(options) {
    const { doNotParseActivityPubMention } = options || {};
    const mentionRegex = /@[\w.-]+(?:@(?:[\w-]+\.)+[a-zA-Z]{2,})?/g;
    return (tree) => {
        if (!doNotParseActivityPubMention) {
            visit(tree, 'text', (node, index, parent) => {
                if (!parent || !node.value || typeof node.value !== 'string')
                    return;
                let newChildren = [];
                let remainingText = node.value;
                let match;
                while ((match = mentionRegex.exec(remainingText)) !== null) {
                    const mention = match[0];
                    const start = match.index;
                    const end = mentionRegex.lastIndex;
                    // Push text before the mention
                    if (start > 0) {
                        newChildren.push({
                            type: 'text',
                            value: remainingText.slice(0, start),
                        });
                    }
                    // Create a mention node
                    newChildren.push({
                        type: 'mention',
                        value: mention,
                        data: {
                            hName: 'span',
                            hProperties: { className: ['mention'] },
                        },
                    });
                    // Update remaining text
                    remainingText = remainingText.slice(end);
                    mentionRegex.lastIndex = 0; // Reset regex state
                }
                // Push any remaining text as a text node
                if (remainingText) {
                    newChildren.push({
                        type: 'text',
                        value: remainingText,
                    });
                }
                // Replace original node with new nodes if matches were found
                if (newChildren.length > 0) {
                    parent.children.splice(index, 1, ...newChildren);
                }
            });
        }
    };
}
export function parseMarkdown(markdownText, parseOptions) {
    const processor = unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(activityPubPlugin, parseOptions?.activityPubPlugin)
        .use(remarkGfm);
    const ast = processor.parse(markdownText);
    const processedAst = processor.runSync(ast);
    return processedAst;
}
