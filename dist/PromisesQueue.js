"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromisesQueue = void 0;
class PromisesQueue {
    constructor(props = {}) {
        this.concurrent = 1;
        this.queue = [];
        this.promises = new Set();
        this.concurrent = props.concurrent || 1;
    }
    get size() {
        return this.queue.length;
    }
    get isEmpty() {
        return this.size === 0;
    }
    add(method, ...args) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                method,
                args,
                resolve,
                reject
            });
            this.tick();
        });
    }
    clear() {
        this.queue = [];
        this.promises.clear();
    }
    tick() {
        if (this.promises.size < this.concurrent && !this.isEmpty) {
            const item = this.queue.shift();
            const promise = item.method(...item.args)
                .then((...data) => {
                if (!this.promises.has(promise)) {
                    return;
                }
                item.resolve(...data);
            })
                .catch((...error) => {
                if (!this.promises.has(promise)) {
                    return;
                }
                item.reject(...error);
            })
                .finally(() => {
                this.promises.delete(promise);
                this.tick();
            });
            this.promises.add(promise);
            this.tick();
        }
    }
}
exports.PromisesQueue = PromisesQueue;
