import { Node } from 'unist';
declare function activityPubPlugin(options?: activityPubPlugin): (tree: Node) => void;
interface activityPubPlugin {
    doNotParseActivityPubMention?: boolean;
}
export type parseOptions = {
    activityPubPlugin?: activityPubPlugin;
};
export declare function parseMarkdown(markdownText: string, parseOptions?: parseOptions): Node;
export {};
