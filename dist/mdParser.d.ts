import { Node } from 'unist';
export type parseOptions = {
    doNotParseActivityPubMention?: boolean;
};
export declare function parseMarkdown(markdownText: string, parseOptions?: parseOptions): Node;
