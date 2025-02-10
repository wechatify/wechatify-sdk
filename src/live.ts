import { SDK } from "./index";
import {
  WechatFinderLiveEndingCustomResponse,
  WechatFinderLiveHeatsItem,
  WechatFinderLiveJoinCustomResponse,
  WechatFinderLiveLotteryOriginResponse,
  WechatFinderLiveMessageCustomResponse,
  WechatFinderLiveProductsCustomResponse,
} from './types';

export class Live {
  constructor(private readonly sdk: SDK) { }

  /**
   * 检测直播是否结束
   * @param wxid 
   * @param lid 
   * @returns 
   */
  public ending(wxid: string, lid: string) {
    return this.sdk.req.postWithWxid<WechatFinderLiveEndingCustomResponse[]>(wxid, '/-/api/live/ending', {
      lid
    });
  }

  /**
   * 直播热度列表
   * @param wxid 
   * @param options 
   * @returns 
   */
  public heats(wxid: string, options: {
    vid: string,
    lid: string,
    nid: string,
  }) {
    return this.sdk.req.postWithWxid<WechatFinderLiveHeatsItem[]>(wxid, '/-/api/live/heats', options);
  }

  /**
   * 加入直播
   * @param wxid 
   * @param options 
   * @returns 
   */
  public join(wxid: string, options: {
    vid: string,
    lid: string,
    nid: string,
  }) {
    return this.sdk.req.postWithWxid<WechatFinderLiveJoinCustomResponse>(wxid, '/-/api/live/join', options);
  }

  /**
   * 直播福袋数据
   * @param wxid 
   * @param options 
   * @returns 
   */
  public lottery(wxid: string, options: {
    vid: string,
    lid: string,
    lotteryId: string,
  }) {
    return this.sdk.req.postWithWxid<WechatFinderLiveLotteryOriginResponse>(wxid, '/-/api/live/lottery', options);
  }

  /**
   * 直播流数据
   * @param wxid 
   * @param options 
   * @returns 
   */
  public message(wxid: string, options: {
    cookies?: string,
    username: string,
    vid: string,
    nid: string,
    lid: string,
  }) {
    return this.sdk.req.postWithWxid<WechatFinderLiveMessageCustomResponse>(wxid, '/-/api/live/message', options);
  }

  /**
   * 直播带货商品列表
   * @param wxid 
   * @param options 
   * @returns 
   */
  public products(wxid: string, options: {
    vid: string,
    lid: string,
    username: string,
  }) {
    return this.sdk.req.postWithWxid<WechatFinderLiveProductsCustomResponse>(wxid, '/-/api/live/products', options);
  }
}