import { AxiosRequestConfig } from "axios";
import { SDK } from "./index";
import { NIO } from "./nio";
import { AssistantResponseMember } from './types';
import { Exception } from './exception';

export class Assistant extends NIO {
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
    return this.sdk.req.getWithWxid<AssistantResponseMember[]>(wxid, `/-/api/assistant/${token}/members`);
  }

  public scan(wxid: string, token: string, username: string) {
    return this.sdk.req.postWithWxid<string>(wxid, `/-/api/assistant/${token}/scan`, {
      username,
    })
  }
}