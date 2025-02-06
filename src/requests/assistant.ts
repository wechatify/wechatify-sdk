import axios, { AxiosRequestConfig } from "axios";
import { NIO } from "../nio";
import { Exception } from '../exception';
import { Assistant } from "../assistant";
import { WechatRequestForGetConfigs, WechatRequestForPostConfigs } from "../types";

interface AssistantResponse<T> {
  errCode: number,
  errMsg: string,
  data: T,
}

export class AssistantRequest extends NIO {
  private session: string;
  private readonly reloadErrorCodes = [300334, 300330];
  constructor(
    private readonly wxid: string,
    public readonly finder: string,
    private readonly assistant: Assistant,
  ) {
    super();
  }

  public setSession(value: string) {
    this.session = value;
    return this;
  }

  protected initable(): boolean {
    return !this.session;
  }

  protected async usePromise() {
    const res = await this.assistant.scan(this.wxid, Date.now().toString(), this.finder);
    this.session = res;
    this.emit('session', res);
  }

  protected async fetch<T = any, D = any>(configs: AxiosRequestConfig<D>): Promise<T> {
    const res = await axios<AssistantResponse<T>>(configs);
    const data = res.data;
    if (data.errCode !== 0) {
      throw new Exception(data.errCode, data.errMsg);
    }
    return data.data;
  }

  protected checkErrorCode(e: Exception): boolean {
    return this.reloadErrorCodes.includes(e?.status as number);
  }

  protected resolveConfigs<D = any>(configs: AxiosRequestConfig<D>): AxiosRequestConfig<D> {
    return {
      ...configs,
      baseURL: 'https://channels.weixin.qq.com/',
      headers: {
        Cookie: 'sessionid=' + encodeURIComponent(this.session),
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