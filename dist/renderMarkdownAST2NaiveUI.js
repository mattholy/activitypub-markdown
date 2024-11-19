// renderMarkdownAST2NaiveUI.ts
import { h } from 'vue';
import { NText, NP, NH1, NH2, NH3, NH4, NH5, NH6 } from 'naive-ui';
import 'katex/dist/katex.min.css';
import katex from 'katex';
export function renderAstToNaiveUI(ast) {
    function renderNode(node) {
        switch (node.type) {
            case 'root':
                return h('div', { 'data-node-type': node.type }, { default: () => (node.children || []).flatMap(renderNode) });
            case 'inlineMath':
                try {
                    const html = katex.renderToString(node.value, {
                        throwOnError: false,
                    });
                    return h('span', {
                        innerHTML: html,
                        'data-node-type': node.type,
                    });
                }
                catch (e) {
                    return h('span', { 'data-node-type': node.type }, node.value);
                }
            case 'math':
                try {
                    const html = katex.renderToString(node.value, {
                        throwOnError: false,
                        displayMode: true,
                    });
                    return h('div', {
                        innerHTML: html,
                        'data-node-type': node.type,
                    });
                }
                catch (e) {
                    return h('div', { 'data-node-type': node.type }, node.value);
                }
            case 'text':
                return h(NText, { 'data-node-type': node.type }, { default: () => node.value });
            case 'mention':
                return h(NText, { 'data-node-type': node.type }, { default: () => node.value });
            case 'paragraph':
                return h(NP, { 'data-node-type': node.type }, { default: () => (node.children || []).flatMap(renderNode) });
            case 'heading':
                const depth = node.depth || 1;
                const HeadingComponent = getHeadingComponent(depth);
                return h(HeadingComponent, { 'data-node-type': node.type }, { default: () => (node.children || []).flatMap(renderNode) });
            default:
                return h('div', { 'data-node-type': node.type }, { default: () => 'Unknown node type: ' + node.type });
        }
    }
    const renderedNodes = renderNode(ast);
    return Array.isArray(renderedNodes) ? renderedNodes : [renderedNodes];
}
function getHeadingComponent(depth) {
    switch (depth) {
        case 1:
            return NH1;
        case 2:
            return NH2;
        case 3:
            return NH3;
        case 4:
            return NH4;
        case 5:
            return NH5;
        case 6:
            return NH6;
        default:
            return NH1;
    }
}
