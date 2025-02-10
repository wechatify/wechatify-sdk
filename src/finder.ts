import { SDK } from "./index";
import {
  FinderHotInfo,
  WechatCommentsOriginResponse,
  WechatFinderInfoCustomResponse,
  WechatFinderLinkCustomResponseItem,
  WechatFinderSearchCustomResponse,
  WechatFinderVideosResponse,
  WechatFinderWebSearchCustomResponse
} from './types';

export class Finder {
  constructor(private readonly sdk: SDK) { }

  /**
   * 获取视频小黄车列表
   * @param wxid 
   * @param ids 
   * @returns 
   */
  public links(wxid: string, ids: string[] = []) {
    if (!ids.length) return Promise.resolve<WechatFinderLinkCustomResponseItem[]>([]);
    return this.sdk.req.postWithWxid<WechatFinderLinkCustomResponseItem[]>(wxid, '/-/api/finder/links', {
      ids
    });
  }

  /**
   * 获取视频的评论列表
   * @param wxid 
   * @param options 
   * @param next 
   * @returns 
   */
  public comments(wxid: string, options: {
    vid: string;
    nid: string;
    username: string;
  }, next: string = '') {
    return this.sdk.req.postWithWxid<WechatCommentsOriginResponse>(wxid, '/-/api/finder/comments', {
      ...options, next,
    })
  }

  /**
   * 获取热搜
   * @param wxid 
   * @returns 
   */
  public hot(wxid: string) {
    return this.sdk.req.getWithWxid<FinderHotInfo[]>(wxid, '/-/api/finder/hot');
  }

  /**
   * 获取视频号信息以及视频列表
   * @param wxid 
   * @param username 
   * @param next 
   * @returns 
   */
  public info(wxid: string, username: string, next: string = '') {
    return this.sdk.req.postWithWxid<WechatFinderInfoCustomResponse>(wxid, '/-/api/finder/info', {
      username, next,
    })
  }

  /**
   * 搜索视频号
   * @param wxid 
   * @param keyword 
   * @param next 
   * @returns 
   */
  public search(wxid: string, keyword: string, next: string = '') {
    return this.sdk.req.postWithWxid<WechatFinderSearchCustomResponse>(wxid, '/-/api/finder/search', {
      keyword, next,
    })
  }

  /**
   * 获取话题下视频列表
   * @param wxid 
   * @param options 
   * @param next 
   * @returns 
   */
  public topic(wxid: string, options: {
    value: string,
    wxid: string,
    latest?: boolean,
  }, next: string = '') {
    return this.sdk.req.postWithWxid<WechatFinderVideosResponse>(wxid, '/-/api/finder/topic', {
      ...options, next,
    })
  }

  /**
   * 获取相关视频
   * @param wxid 
   * @param vid 
   * @param next 
   * @returns 
   */
  public videoRelateds(wxid: string, vid: string, next: string = '') {
    return this.sdk.req.postWithWxid<WechatFinderVideosResponse>(wxid, '/-/api/finder/video-related', {
      vid, next,
    })
  }

  /**
   * web-search接口中的视频 export/key 转换为真实的视频 ID
   * @param wxid 
   * @param key 
   * @returns 
   */
  public videoExportKeyToId(wxid: string, key: string) {
    return this.sdk.req.postWithWxid<string>(wxid, '/-/api/finder/export-key-to-video-id', {
      key,
    })
  }

  /**
   * 视频号内容通用搜索
   * @param wxid 
   * @param options 
   * @returns 
   */
  public webSearch(wxid: string, options: {
    keyword: string,
    type: 0 | 1 | 2 | 3,
    offset: number,
    searchId: string,
    cookies: string,
  }) {
    return this.sdk.req.postWithWxid<WechatFinderWebSearchCustomResponse>(wxid, '/-/api/finder/web-search', options);
  }
}