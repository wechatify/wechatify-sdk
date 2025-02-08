import { IWechat, SDK, WechatLoginWithQrcodeCustomRequest, WechatLoginWithQrcodeCustomResponse } from "./index";

export class Wechat {
  constructor(private readonly sdk: SDK) { }

  public info(wxid: string) {
    return this.sdk.req.getWithWxid<{
      meta: WechatLoginWithQrcodeCustomRequest,
      wechat: IWechat,
    }>(wxid, '/-/api/wechat');
  }

  public entries(page: number = 1, size: number = 10) {
    return this.sdk.req.get<{
      total: number,
      data: {
        meta: WechatLoginWithQrcodeCustomRequest,
        wechat: IWechat,
      }[]
    }>('/-/api/wechat/entries', {
      params: {
        page, size,
      }
    })
  }
}