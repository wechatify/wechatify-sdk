import { AxiosRequestConfig } from "axios";
import { SDK } from "./index";
import { NIO } from "./nio";
import { PromitionMembers } from './types';
import { Exception } from './exception';

export class Promotion extends NIO {
  private session: string;
  constructor(private readonly sdk: SDK) {
    super();
  }

  protected initable(): boolean {
    return !this.session;
  }

  protected usePromise(): Promise<void> {
    return Promise.resolve()
  }

  protected fetch<T = any, D = any>(configs: AxiosRequestConfig<D>): Promise<T> {
    return Promise.resolve(null)
  }

  protected checkErrorCode(e: Exception): boolean {
    return e?.status === 410;
  }

  protected resolveConfigs<D = any>(configs: AxiosRequestConfig<D>): AxiosRequestConfig<D> {
    return configs;
  }

  public members(wxid: string, token: string) {
    return this.sdk.req.getWithWxid<PromitionMembers>(wxid, `/-/api/promotion/${token}/members`);
  }

  public scan(wxid: string, token: string) {
    return this.sdk.req.postWithWxid<string>(wxid, `/-/api/promotion/${token}/scan`);
  }
}