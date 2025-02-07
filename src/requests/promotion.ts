import axios, { AxiosRequestConfig } from "axios";
import { NIO } from "../nio";
import { Exception } from '../exception';
import { WechatRequestForGetConfigs, WechatRequestForPostConfigs } from "../types";
import { Promotion } from "../promotion";

interface PromotionResponse<T> {
  data?: T,
  error?: {
    code: number,
  }
}

export class PromotionRequest extends NIO {
  private session: string;
  private readonly reloadErrorCodes: (number | ((v: number) => boolean))[] = [-330];
  constructor(
    private readonly wxid: string,
    private readonly promotion: Promotion,
  ) {
    super();
  }

  public addCode(value: number | ((v: number) => boolean)) {
    const index = this.reloadErrorCodes.indexOf(value);
    if (index === -1) {
      const i = this.reloadErrorCodes.push(value);
      return () => this.reloadErrorCodes.splice(i, 1);
    }
    return () => this.reloadErrorCodes.splice(index, 1);
  }

  public setSession(value: string) {
    this.session = value;
    return this;
  }

  protected initable(): boolean {
    return !this.session;
  }

  protected async usePromise() {
    const res = await this.promotion.scan(this.wxid, Date.now().toString());
    this.session = res;
    this.emit('session', res);
  }

  protected async fetch<T = any, D = any>(configs: AxiosRequestConfig<D>): Promise<T> {
    const res = await axios<PromotionResponse<T>>(configs);
    const data = res.data;
    if (data.error?.code) {
      throw new Exception(data.error.code);
    }
    return data.data;
  }

  protected checkErrorCode(e: Exception): boolean {
    const code = (e?.status || 0) as number;
    if (!code) return false;
    return this.reloadErrorCodes.some((value) => {
      if (typeof value === 'function') {
        return value(code);
      }
      return value === code;
    })
  }

  protected resolveConfigs<D = any>(configs: AxiosRequestConfig<D>): AxiosRequestConfig<D> {
    return {
      ...configs,
      baseURL: 'https://channels.weixin.qq.com/',
      headers: {
        Cookie: 'promotewebsessionid=' + encodeURIComponent(this.session),
      }
    }
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
}