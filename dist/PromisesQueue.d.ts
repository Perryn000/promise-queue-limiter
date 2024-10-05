import { IPromiseQueueProps } from './promise-queue-props.interface';
export declare class PromisesQueue {
    private concurrent;
    private queue;
    private promises;
    constructor(props?: IPromiseQueueProps);
    get size(): number;
    get isEmpty(): boolean;
    add<R>(method: (...args: any[]) => Promise<R>, ...args: any): Promise<R>;
    clear(): void;
    private tick;
}
//# sourceMappingURL=PromisesQueue.d.ts.map