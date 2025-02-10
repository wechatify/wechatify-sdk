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

  public ending(wxid: string, lid: string) {
    return this.sdk.req.postWithWxid<WechatFinderLiveEndingCustomResponse[]>(wxid, '/-/api/live/ending', {
      lid
    });
  }

  public heats(wxid: string, options: {
    vid: string,
    lid: string,
    nid: string,
  }) {
    return this.sdk.req.postWithWxid<WechatFinderLiveHeatsItem[]>(wxid, '/-/api/live/heats', options);
  }

  public join(wxid: string, options: {
    vid: string,
    lid: string,
    nid: string,
  }) {
    return this.sdk.req.postWithWxid<WechatFinderLiveJoinCustomResponse>(wxid, '/-/api/live/join', options);
  }

  public lottery(wxid: string, options: {
    vid: string,
    lid: string,
    lotteryId: string,
  }) {
    return this.sdk.req.postWithWxid<WechatFinderLiveLotteryOriginResponse>(wxid, '/-/api/live/lottery', options);
  }

  public message(wxid: string, options: {
    cookies?: string,
    username: string,
    vid: string,
    nid: string,
    lid: string,
  }) {
    return this.sdk.req.postWithWxid<WechatFinderLiveMessageCustomResponse>(wxid, '/-/api/live/message', options);
  }

  public products(wxid: string, options: {
    vid: string,
    lid: string,
    username: string,
  }) {
    return this.sdk.req.postWithWxid<WechatFinderLiveProductsCustomResponse>(wxid, '/-/api/live/products', options);
  }
}