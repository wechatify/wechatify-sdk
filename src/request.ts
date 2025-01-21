import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { WechatPlatformSDKProps, WechatRequestAuth, WechatRequestForGetConfigs, WechatRequestForPostConfigs, WechatRequestZip } from "./types";
import { Exception } from "./exception";

export class Request {
  private readonly app_id: string;
  private readonly app_secret: string;
  private readonly instance: AxiosInstance;
  private readonly stacks = new Map<number, {
    configs: AxiosRequestConfig,
    controller: AbortController,
    resolve: Function,
    reject: Function,
  }>();

  private traceId = 0;
  private loading = false;
  private access_token: string;
  private refresh_token: string;

  constructor(options: WechatPlatformSDKProps) {
    this.app_id = options.app_id;
    this.app_secret = options.app_secret;
    this.instance = axios.create({
      baseURL: options.host,
    })
  }

  public async fetch<T = any, D = any>(configs: AxiosRequestConfig<D>) {
    const res = await this.instance<WechatRequestZip<T>, AxiosResponse<WechatRequestZip<T>, D>, D>(configs);
    const result = res.data;
    if (result.status !== 200) {
      throw new Exception(result.status, result.message);
    }
    return result.data;
  }

  private async getCode() {
    const state = Date.now().toString();
    const code = await this.fetch<string>({
      method: 'get',
      url: '/-/auth/code',
      params: {
        appid: this.app_id,
        state,
      }
    })
    return {
      code, state,
    }
  }

  private async accessToken(code: string, state: string) {
    const res = await this.fetch<WechatRequestAuth>({
      method: 'get',
      url: '/-/auth/token',
      params: {
        code, state,
        secret: this.app_secret,
      }
    })
    this.access_token = res.access_token;
    this.refresh_token = res.refresh_token;
  }

  private async refreshToken() {
    const res = await this.fetch<WechatRequestAuth>({
      method: 'get',
      url: '/-/auth/refresh',
      params: {
        token: this.refresh_token,
      }
    })
    this.access_token = res.access_token;
    this.refresh_token = res.refresh_token;
  }

  private async auto() {
    const { code, state } = await this.getCode();
    await this.accessToken(code, state);
  }

  public getTraceId() {
    if (this.traceId >= Number.MAX_SAFE_INTEGER) {
      this.traceId = 1;
    } else {
      this.traceId++;
    }
    return this.traceId;
  }

  private loadAccessToken() {
    this.loading = true;
    const promise = this.refresh_token ? this.refreshToken() : this.auto();
    promise.then(() => {
      this.loading = false;
      for (const id of this.stacks.keys()) {
        this.start(id);
      }
    }).catch(e => {
      for (const { reject } of this.stacks.values()) {
        reject(e);
      }
      this.stacks.clear();
      this.loading = false;
    })
  }

  private start(id: number) {
    if (this.loading) return;
    if (!this.access_token) {
      this.loadAccessToken();
    } else if (this.stacks.has(id)) {
      const { configs, controller, resolve, reject } = this.stacks.get(id);
      if (!configs.headers) configs.headers = {};
      configs.headers.access_token = this.access_token;
      configs.signal = controller.signal;
      this.fetch(configs).then(res => {
        this.stacks.delete(id);
        resolve(res);
      }).catch(e => {
        if (e instanceof Exception) {
          if (e.status === 410) {
            for (const { controller } of this.stacks.values()) {
              controller.abort();
            }
            this.loadAccessToken();
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

  public use<T = any, D = any>(configs: AxiosRequestConfig<D> = {}): Promise<T> {
    const id = this.getTraceId();
    const controller = new AbortController();
    return new Promise<T>((resolve, reject) => {
      this.stacks.set(id, {
        controller, configs, resolve, reject,
      })
      this.start(id);
    })
  }

  public get<T = any, D = any>(url: string, configs: WechatRequestForGetConfigs<D> = {}) {
    return this.use<T, D>({
      ...configs,
      method: 'get', url,
    })
  }

  public post<T = any, D = any>(url: string, data?: D, configs: WechatRequestForPostConfigs<D> = {}) {
    return this.use<T, D>({
      ...configs,
      method: 'post',
      url, data,
    })
  }

  public put<T = any, D = any>(url: string, data?: D, configs: WechatRequestForPostConfigs<D> = {}) {
    return this.use<T, D>({
      ...configs,
      method: 'put',
      url, data,
    })
  }

  public delete<T = any, D = any>(url: string, configs: WechatRequestForGetConfigs<D> = {}) {
    return this.use<T, D>({
      ...configs,
      method: 'delete', url,
    })
  }

  public getWithWxid<T = any, D = any>(wxid: string, url: string, configs: WechatRequestForGetConfigs<D> = {}) {
    if (!configs.headers) configs.headers = {};
    configs.headers.wxid = wxid;
    return this.get<T, D>(url, configs);
  }

  public postWithWxid<T = any, D = any>(wxid: string, url: string, data?: D, configs: WechatRequestForPostConfigs<D> = {}) {
    if (!configs.headers) configs.headers = {};
    configs.headers.wxid = wxid;
    return this.post<T, D>(url, data, configs);
  }

  public putWithWxid<T = any, D = any>(wxid: string, url: string, data?: D, configs: WechatRequestForPostConfigs<D> = {}) {
    if (!configs.headers) configs.headers = {};
    configs.headers.wxid = wxid;
    return this.put<T, D>(url, data, configs);
  }

  public deleteWithWxid<T = any, D = any>(wxid: string, url: string, configs: WechatRequestForGetConfigs<D> = {}) {
    if (!configs.headers) configs.headers = {};
    configs.headers.wxid = wxid;
    return this.delete<T, D>(url, configs);
  }
}