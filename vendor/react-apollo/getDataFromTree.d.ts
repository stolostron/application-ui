import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Query from './Query';
export declare class RenderPromises {
    private queryPromises;
    private queryGraveyard;
    addQueryPromise<TData, TVariables>(queryInstance: Query<TData, TVariables>, finish: () => React.ReactNode): React.ReactNode;
    hasPromises(): boolean;
    consumeAndAwaitPromises(): Promise<any[]>;
}
export default function getDataFromTree(tree: React.ReactNode, context?: {
    [key: string]: any;
}): Promise<string>;
export declare type GetMarkupFromTreeOptions = {
    tree: React.ReactNode;
    context?: {
        [key: string]: any;
    };
    renderFunction?: typeof renderToStaticMarkup;
};
export declare function getMarkupFromTree({ tree, context, renderFunction, }: GetMarkupFromTreeOptions): Promise<string>;
