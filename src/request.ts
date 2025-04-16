import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { NIO } from "./nio";
import { WechatPlatformSDKProps, WechatRequestAuth, WechatRequestForGetConfigs, WechatRequestForPostConfigs, WechatRequestZip } from "./types";
import { Exception } from "./exception";

export class Request extends NIO {
  private readonly app_id: string;
  private readonly app_secret: string;
  private readonly instance: AxiosInstance;

  private access_token: string;
  private refresh_token: string;

  constructor(options: WechatPlatformSDKProps) {
    super();
    this.app_id = options.app_id;
    this.app_secret = options.app_secret;
    this.instance = axios.create({
      baseURL: options.host,
    })
  }

  protected initable(): boolean {
    return !this.access_token;
  }

  protected usePromise(): Promise<void> {
    return this.refresh_token
      ? this.refreshToken().catch(e => this.auto())
      : this.auto();
  }

  protected checkErrorCode(e: Exception): boolean {
    return e?.status === 410;
  }

  protected resolveConfigs<D = any>(configs: AxiosRequestConfig<D>): AxiosRequestConfig<D> {
    if (!configs.headers) configs.headers = {};
    configs.headers.access_token = this.access_token;
    return configs;
  }

  protected async fetch<T = any, D = any>(configs: AxiosRequestConfig<D>) {
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

  public get<T = any, D = any>(url: string, configs: WechatRequestForGetConfigs<D> = {}) {
    return this.add<T, D>({
      ...configs,
      method: 'get', url,
    })
  }

  public post<T = any, D = any>(url: string, data?: D, configs: WechatRequestForPostConfigs<D> = {}) {
    return this.add<T, D>({
      ...configs,
      method: 'post',
      url, data,
    })
  }

  public put<T = any, D = any>(url: string, data?: D, configs: WechatRequestForPostConfigs<D> = {}) {
    return this.add<T, D>({
      ...configs,
      method: 'put',
      url, data,
    })
  }

  public delete<T = any, D = any>(url: string, configs: WechatRequestForGetConfigs<D> = {}) {
    return this.add<T, D>({
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