import { AxiosRequestConfig } from "axios";
import { Exception } from "./exception";
import { EventEmitter } from 'node:events';

export abstract class NIO extends EventEmitter {
  private traceId = 0;
  private loading = false;
  protected readonly stacks = new Map<number, {
    configs: AxiosRequestConfig,
    controller: AbortController,
    resolve: Function,
    reject: Function,
  }>();

  protected abstract initable(): boolean;
  protected abstract usePromise(): Promise<void>;
  protected abstract fetch<T = any, D = any>(configs: AxiosRequestConfig<D>): Promise<T>;
  protected abstract checkErrorCode(e: Exception): boolean;
  protected abstract resolveConfigs<D = any>(configs: AxiosRequestConfig<D>): AxiosRequestConfig<D>;

  private getTraceId() {
    if (this.traceId >= Number.MAX_SAFE_INTEGER) {
      this.traceId = 1;
    } else {
      this.traceId++;
    }
    return this.traceId;
  }

  protected add<T = any, D = any>(configs: AxiosRequestConfig<D> = {}) {
    const id = this.getTraceId();
    const controller = new AbortController();
    return new Promise<T>((resolve, reject) => {
      this.stacks.set(id, {
        controller, configs, resolve, reject,
      })
      this.start(id);
    })
  }

  private loadPromise() {
    this.loading = true;
    this.usePromise()
      .then(() => {
        this.loading = false;
        for (const id of this.stacks.keys()) {
          this.start(id);
        }
      })
      .catch(e => {
        for (const { reject } of this.stacks.values()) {
          reject(e);
        }
        this.stacks.clear();
        this.loading = false;
      })
  }

  private start(id: number) {
    if (this.loading) return;
    if (this.initable()) {
      this.loadPromise();
    } else if (this.stacks.has(id)) {
      const { configs, controller, resolve, reject } = this.stacks.get(id);
      const _configs = this.resolveConfigs(configs);
      _configs.signal = controller.signal;
      this.fetch(_configs).then(res => {
        this.stacks.delete(id);
        resolve(res);
      }).catch(e => {
        if (e instanceof Exception) {
          if (this.checkErrorCode(e)) {
            for (const { controller } of this.stacks.values()) {
              controller.abort();
            }
            this.loadPromise();
          } else {
            this.stacks.delete(id);
            reject(e);
          }
        } else if (e?.code !== 'ERR_CANCELED') {
          this.stacks.delete(id);
          reject(e);
        }
      })
    }
  }
}