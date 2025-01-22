import { AxiosRequestConfig } from "axios";
import { SDK } from "./index";
import { NIO } from "./nio";
import { COMPASS_BIZ_TYPE, ComPassMembers } from './types';
import { Exception } from './exception';

export class ComPass extends NIO {
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

  public members(wxid: string) {
    return this.sdk.req.getWithWxid<ComPassMembers>(wxid, '/-/api/compass/members');
  }

  public scan(wxid: string, biz_id: string, biz_type: COMPASS_BIZ_TYPE) {
    return this.sdk.req.postWithWxid<string[]>(wxid, '/-/api/assistant/scan', {
      biz_id, biz_type,
    })
  }
}