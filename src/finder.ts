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

  public links(wxid: string, ids: string[] = []) {
    if (!ids.length) return Promise.resolve<WechatFinderLinkCustomResponseItem[]>([]);
    return this.sdk.req.postWithWxid<WechatFinderLinkCustomResponseItem[]>(wxid, '/-/api/finder/links', {
      ids
    });
  }

  public comments(wxid: string, options: {
    vid: string;
    nid: string;
    username: string;
  }, next: string = '') {
    return this.sdk.req.postWithWxid<WechatCommentsOriginResponse>(wxid, '/-/api/finder/comments', {
      ...options, next,
    })
  }

  public hot(wxid: string) {
    return this.sdk.req.getWithWxid<FinderHotInfo[]>(wxid, '/-/api/finder/hot');
  }

  public info(wxid: string, username: string, next: string = '') {
    return this.sdk.req.postWithWxid<WechatFinderInfoCustomResponse>(wxid, '/-/api/finder/info', {
      username, next,
    })
  }

  public search(wxid: string, keyword: string, next: string = '') {
    return this.sdk.req.postWithWxid<WechatFinderSearchCustomResponse>(wxid, '/-/api/finder/search', {
      keyword, next,
    })
  }

  public topic(wxid: string, options: {
    value: string,
    wxid: string,
    latest?: boolean,
  }, next: string = '') {
    return this.sdk.req.postWithWxid<WechatFinderVideosResponse>(wxid, '/-/api/finder/topic', {
      ...options, next,
    })
  }

  public videoRelateds(wxid: string, vid: string, next: string = '') {
    return this.sdk.req.postWithWxid<WechatFinderVideosResponse>(wxid, '/-/api/finder/video-related', {
      vid, next,
    })
  }

  public videoExportKeyToId(wxid: string, key: string) {
    return this.sdk.req.postWithWxid<string>(wxid, '/-/api/finder/export-key-to-video-id', {
      key,
    })
  }

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