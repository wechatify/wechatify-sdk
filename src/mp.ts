import { SDK } from "./index";
import {
  IProductInfo,
  WechatMPCodeCustomResponse,
  WechatMPDataOriginResponse,
} from './types';

export class MP {
  constructor(private readonly sdk: SDK) { }

  /**
   * 换取小程序登录 code
   * @param wxid 
   * @param appid 
   * @returns 
   */
  public code(wxid: string, appid: string) {
    return this.sdk.req.postWithWxid<WechatMPCodeCustomResponse>(wxid, '/-/api/mp/code', {
      appid
    });
  }

  /**
   * 通过 code 获取小程序数据
   * @param wxid 
   * @param options 
   * @returns 
   */
  public data(wxid: string, options: {
    appid: string,
    data: object | string,
    opt?: number,
  }) {
    return this.sdk.req.postWithWxid<WechatMPDataOriginResponse>(wxid, '/-/api/mp/data', options);
  }

  /**
   * 获取小程序商品信息
   * @param wxid 
   * @param options 如果有 url，那么其他参数不用传，否则需要传其他参数
   * @param format 是否自动格式化
   * @returns 
   */
  public getProduct<T extends true>(wxid: string, options: {
    url?: string,
    appid?: string;
    productId?: string;
    method?: string;
  }, format?: T) {
    const { url, ...meta } = options;
    return this.sdk.req.postWithWxid<T extends true ? IProductInfo : any>(wxid, '/-/api/mp/product', {
      url, meta, format,
    });
  }
}