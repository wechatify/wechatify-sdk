import { Request } from './request';
import { EventEmitter } from 'node:events';
import { Assistant } from './assistant';
import { Promotion } from './promotion';
import { ComPass } from './compass';
import {
  IProxy,
  QRCODE_STATUS,
  WechatLoginWithQrcodeCustomRequest,
  WechatLoginWithQrcodeCustomResponse,
  WechatPersonalInfoCustomResponse,
  WechatPersonalSafeOriginResponse,
  WechatPlatformSDKProps,
  WechatReceiveMessage,
} from './types';

export * from './exception';
export * from './types';

export class SDK extends EventEmitter {
  public readonly req: Request;
  public readonly assistant = new Assistant(this);
  public readonly promotion = new Promotion(this);
  public readonly compass = new ComPass(this);
  constructor(options: WechatPlatformSDKProps) {
    super();
    this.setMaxListeners(+Infinity);
    this.req = new Request(options);
  }

  /**
   * 接受消息通知
   * @param data 
   * @example
   * ```ts
   * http.post('/xxxxx', ctx => {
   *  const body = ctx.request.body;
   *  // 将输入压入对象进行事件分发
   *  sdk.receive(body);
   *  ctx.status = 200;
   *  ctx.body = Date.now();
   * })
   * ```
   */
  public receive(data: WechatReceiveMessage) {
    for (let i = 0; i < data.payload.length; i++) {
      const payload = data.payload[i];
      this.emit(payload.type, payload.timestamp, ...payload.data);
    }
  }

  public qrcode(data: WechatLoginWithQrcodeCustomRequest) {
    return this.req.post<WechatLoginWithQrcodeCustomResponse, WechatLoginWithQrcodeCustomRequest>('/-/api/qrcode', data);
  }

  public checkLogin(uuid: string) {
    return this.req.get<void | [QRCODE_STATUS, {
      info?: WechatPersonalInfoCustomResponse;
      meta?: WechatLoginWithQrcodeCustomRequest;
      nickname?: string;
      avatar?: string;
      wxid?: string;
      uuid?: string;
      message?: string,
    }]>('/-/api/' + uuid);
  }

  public logout(wxid: string) {
    return this.req.deleteWithWxid(wxid, '/-/api/logout');
  }

  public isSafe(wxid: string) {
    return this.req.getWithWxid<WechatPersonalSafeOriginResponse>(wxid, '/-/api/safe');
  }

  public delete(wxid: string) {
    return this.req.deleteWithWxid<number>(wxid, '/-/api/wechat/rel');
  }

  public updateProxy(wxid: string, proxy: IProxy) {
    return this.req.postWithWxid(wxid, '/-/api/proxy', proxy);
  }

  public deleteProxy(wxid: string) {
    return this.req.deleteWithWxid(wxid, '/-/api/proxy');
  }
}