import { IPromiseQueueProps } from './promise-queue-props.interface'

export class PromisesQueue {
  private concurrent: number = 1
  private queue: any = []
  private promises: Set<Promise<any>> = new Set()

  constructor(props: IPromiseQueueProps = {}) {
    this.concurrent = props.concurrent || 1
  }

  get size(): number {
    return this.queue.length
  }

  get isEmpty(): boolean {
    return this.size === 0
  }

  add<R>(method: (...args: any[]) => Promise<R>, ...args: any): Promise<R> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        method,
        args,
        resolve,
        reject
      })

      this.tick()
    })
  }

  clear(): void {
    this.queue = []
    this.promises.clear()
  }

  private tick() {
    if (this.promises.size < this.concurrent && !this.isEmpty) {
      const item = this.queue.shift()

      const promise = item.method(...item.args)
        .then((...data: any[]) => {
          if (!this.promises.has(promise)) {
            return
          }
          item.resolve(...data)
        })
        .catch((...error: any[]) => {
          if (!this.promises.has(promise)) {
            return
          }
          item.reject(...error)
        })
        .finally(() => {
          this.promises.delete(promise)

          this.tick()
        })

      this.promises.add(promise)

      this.tick()
    }
  }
}
