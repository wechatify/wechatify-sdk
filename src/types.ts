import { AxiosRequestConfig } from "axios";

export interface APIBaseResponse {
  baseResponse: {
    ret: number;
    string: string;
  };
}

export interface WechatPlatformSDKProps {
  app_id: string,
  app_secret: string,
  host: string;
}

export interface WechatRequestZip<T = any> {
  status: number,
  message?: string,
  data?: T
}

export interface WechatRequestAuth {
  access_token: string,
  refresh_token: string,
}

export interface IProxy {
  address: string;
  username: string;
  password: string;
}

export type WechatRequestForGetConfigs<D> = Omit<AxiosRequestConfig<D>, 'method' | 'url'>;
export type WechatRequestForPostConfigs<D> = Omit<AxiosRequestConfig<D>, 'method' | 'url' | 'data'>;

export interface WebHookEvents {
  online: [number, string, string, WechatPersonalInfoCustomResponse, WechatLoginWithQrcodeCustomRequest],
  offline: [number, string],
  proxy: [number, string, IProxy],
  forbiden: [number, string],
  reconnect: [number, string],
  remove: [number, string],
}

type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;

export interface WebHookMessage<T extends keyof WebHookEvents = keyof WebHookEvents> {
  type: T,
  data: Tail<WebHookEvents[T]>,
  timestamp: number,
}

export interface WechatPersonalInfoCustomResponse {
  nickname: string;
  uin: string;
  email: string;
  mobile: string;
  sex: number;
  signature: string;
  point: number;
  country: string;
  province: string;
  city: string;
  level: number;
  experience: number;
  levelLowExp: number;
  levelHighExp: number;
  imgHead: string;
  walletRegion: number;
}

export type WechatLoginModelType = 'iPad' | 'windows' | 'mac' | 'QQBrowser' | 'android' | 'android-pad';

export interface WechatLoginWithQrcodeCustomRequest {
  deviceId: string;
  deviceName: string;
  type?: WechatLoginModelType,
  proxy?: IProxy;
}

export interface WechatLoginWithQrcodeCustomResponse {
  base64: string;
  uuid: string;
}

export interface WechatReceiveMessage {
  payload: WebHookMessage<keyof WebHookEvents>[],
}

export enum QRCODE_STATUS {
  CREATED = "created",
  SCANED = "scaned",
  CANCELED = "canceled",
  SUCCESS = "success",
  OUTDATED = "outdated",
  UNKNOW = "unknow",
  ERROR = "error",
}

export interface WechatPersonalSafeItem {
  title: string;
  result: string;
  isPass: boolean;
}
export interface WechatPersonalSafeOriginResponse extends APIBaseResponse {
  results: WechatPersonalSafeItem[];
  ticket: string;
  verifyType: number;
}

export interface AssistantResponseMember {
  "finderUsername": string;
  "nickname": string;
  "headImgUrl": string;
  "coverImgUrl": string;
  "spamFlag": number;
  "acctType": number;
  "authIconType": number;
  "ownerWxUin": number;
  "adminNickname": string;
  "categoryFlag": string;
  "uniqId": string;
  "isMasterFinder": boolean;
}

export interface PromotionMember {
  nickname: string;
  headImgUrl: string;
  username: string;
  acctStatus: number;
}

export interface PromitionMembers {
  promotionPersonalUsers: PromotionMember[];
  promotionCorporateUsers: PromotionMember[];
  acctStatus: number;
}

export interface ComPassMembers {
  success: boolean,
  talentList: { appid: string }[],
  ecStoreInfoList: { appid: string }[],
  finderList: {
    identity: number,
    nickname: string,
    finderUsername: string,
    headurl: string,
    accountType: number
  }[],
}

export enum COMPASS_BIZ_TYPE {
  FINDER = 5,
  TALENT = 9,
  ECSTORE = 4,
}

export enum WECHAT_STATUS {
  FORBIDEN,
  OFFLINE,
  ONLINE,
}

export interface IWechat {
  id: number;
  wxid: string;
  nickname: string;
  email: string;
  mobile: string;
  uin: string;
  sex: number;
  signature: string;
  country: string;
  province: string;
  city: string;
  avatar: string;
  status: WECHAT_STATUS;
  last_login_time: Date | string;
}

export interface WechatFinderLinkCustomResponseItem {
  id: string;
  wording: string;
  appid: string;
  appurl: string;
}

export interface WechatCommentsOriginResponse {
  CommentInfo: FinderVideoComment[],
  LastBuffer: string,
  CommentCount: number,
  DownContinueFlag: number,
  NextCheckObjectStatus: number,
  SecondaryShowFlag: number,
}

export interface FinderVideoComment {
  "username": string,
  "nickname": string,
  "content": string,
  "commentId": number,
  "replyCommentId": number,
  "deleteFlag": number,
  "headUrl": string,
  "createtime": number,
  "likeFlag": number,
  "likeCount": number,
  "displayid": number,
  "expandCommentCount": number,
  "lastBuffer": string,
  "continueFlag": number,
  "displayFlag": number,
  "replyContent": string,
  "replyUsername": string,
  "upContinueFlag": number
}

export interface FinderHotInfo {
  title: string;
  number: number;
  data: {
    id: number | string;
    number: number;
  };
}


export interface WechatFinderInfoCustomResponse extends APIBaseResponse {
  user: Contact;
  videos: Video[];
  next: string;
}


export interface Contact {
  id: string;
  nn: string;
  hu: string;
  desc: string;
  liveCover: string;
  woa: WOA[];
  ev: Event[];
  vs: number;
  fs: number;
  tls: string[];
  userTags: string[];
  shop: Shop;
  live: Live;
  liveList: Live[];
  liveScreenings: number;
  sex: number;
  menu: Menu[];
  auth: Auth;
}

export interface Video {
  id: string;
  oid: string;
  live: LiveVideo;
  uid: string;
  nn: string;
  cc: number;
  sc: number;
  lc: number;
  fvc: number;
  ffc: number;
  ct: number;
  rc: number;
  cu: string;
  desc: string;
  mt: number;
  url: string;
  vd: number;
  mts: {
    nn: string;
    un: string;
  }[];
  loc: LocVideo;
  ev: EventVideo;
  link: LinkVideo;
  tls: string[];
  long: boolean;
  market?: {
    state: any,
    wording: string,
  }[]
}

export interface LiveVideo {
  lva: string;
  st: number;
  lid: string;
  likeCount: number;
  lookCount: number;
  isFree: boolean;
  price: number;
  time_limit: number;
}


export interface LocVideo {
  id: string;
  cot: string;
  adr: string;
  cit: string;
  lng: number;
  lat: number;
}

export interface EventVideo {
  en: string;
  it: string;
  id: string;
}

export interface LinkVideo {
  k: string;
  t: number;
  n: string;
}

export interface WOA {
  id: string;
  name: string;
}

export interface Event {
  uid: string;
  ciu: string;
  en: string;
  desc: string;
  et: number;
  id: string;
  count: number;
}

export interface Shop {
  id: string;
  path: string;
  path1: string;
}

export interface Live {
  id: string;
  st: number;
  su: number;
  cover: string;
  title: string;
}

export interface Menu {
  banner_type: number;
  business_type: number;
  icon_url: string;
  jump_id: string;
  jumpinfo_type: number;
  ext_info: string;
  mini_app_info: MiniAppInfo;
}

export interface Loc {
  cot: string;
  poc: string;
  cit: string;
}
export interface Auth {
  pro: string;
  icon: string;
  type: number;
  identity: number;
  verifyStatus: number;
  customerType: number;
  loc: Loc;
}

export interface MiniAppInfo {
  App_id: string;
  path: string;
  request_id: string;
  version_type: number;
  fetch_info_id: string;
  native_info: NativeInfo;
}

export interface NativeInfo {
  native_type: number;
  necessary_params: string;
  wording: string;
}

export interface WechatFinderSearchCustomResponse {
  list: WechatFinderSearchItem[],
  next?: string,
}

export interface WechatFinderSearchItem {
  "Contact": {
    "username": string;
    "nickname": string;
    "headUrl": string;
    "signature": string;
    "liveCoverImgUrl": string;
  };
  "HighlightNickname": string;
  "HighlightSignature": string;
  "FriendFollowCount": number;
  "HighlightProfession": string;
}


export interface WechatFinderVideosResponse {
  Videos: Video[],
  next: string
}


export interface WechatFinderWebSearchCustomResponse {
  cookies: string,
  list: any[],
  searchID: string,
  offset: number,
}

export interface WechatFinderLiveEndingCustomResponse {
  code: number,
  status: 1 | 2,
  startTime: number,
  endTime: number,
}

export interface WechatFinderLiveHeatsItem {
  contact: {
    username: string,
    nickname: string,
    headUrl: string,
  },
  heat: number,
  nickname: string,
  fs: WechatFinderLiveHeatsFan[],
}


export interface WechatFinderLiveHeatsFan {
  type: number,
  fsImg: string,
  fsL: number,
  fsGroupName: string,
}

export interface WechatFinderLiveJoinCustomResponse {
  code: number,
  cookies: string,
  status: 1 | 2,
  url: string,
  like: number,
  startTime: number,
  endTime: number,
  look: number,
  free: boolean,
}


export interface WechatFinderLiveLotteryOriginResponse extends APIBaseResponse {
  lotteryInfo: {
    id: string,
    st: number,
    et: number,
    desc: string,
    condition: {
      type: number,
      content: string,
    },
    njc: number,
    hjc: number,
  },
  winnerInfo: {
    participateArray: {
      nickname: string,
      avatar: string,
    }[]
  },
}

export interface WechatFinderLiveMessageCustomResponse {
  messages?: LiveMessage[],
  like: number,
  look: number,
  heat: number,
  status: number,
  notifications?: LiveNotification[],
  lotteries?: LiveLottery[],
  fan: {
    name: string,
    count: number
  },
  next: string,
}

export interface LiveMessage {
  seq: number,
  type: number,
  [key: string]: any,
}
export interface LiveNotification {
  MsgType: number,
  MsgId: string,
  MsgSeq: number,
  MsgPayload: any,
  Contact: {
    contact: {
      username: string,
      nickname: string,
      headUrl: string,
    },
    badgeInfo?: any,
  },
}

export interface LiveLottery {
  id: string,
  st: number,
  et: number,
  rt?: 13,
  desc: string,
  njc: number,
  hjc: number,
  condition: {
    type: number,
    content: string,
  }
}

export type WechatFinderLiveProductsCustomResponse = (Omit<LiveShopShelfItem, 'extra'> & { extra: LiveShopShelfItemExtra })[];

export interface LiveShopShelfItem {
  productId: number,
  title: string,
  images: string[],
  maxPrice: number,
  price: number,
  shop: ShopInfo,
  shop1: ShopInfo,
  platformId: number,
  listId: number,
  extra: string,
}

export interface LiveShopShelfItemExtra {
  discount_rate: number,
  headimg_url: string,
  is_market_price_show: number,
  market_price: number,
  pre_sell_wording: string,
  selling_price: number,
  selling_price_wording: string,
  title: string,
}

export interface ShopInfo {
  appId: string,
  appUrl: string,
  imageUrl: string,
  nickname: string,
}

export interface WechatMPCodeCustomResponse {
  code: string,
  state: string,
}

export interface WechatMPDataOriginResponse {
  BaseResponse: {
    ret: number
  },
  jsapiBaseresponse: {
    errcode: number,
    errmsg: string,
  },
  data: string,
}

export interface IProductInfo {
  type: string;
  id: string;
  storeId: string;
  title: string;
  cover: string;
  description: string;
  status: number;
  source: number;
  platformSoldVolume: number;
  soldVolume: number;
  visitVolume: number;
  orderVolume: number;
  product_score: number;
  custom_weight: number;
  commission: {
    rate: number;
    estimate: number;
  };
  categories: number[];
  price: {
    max: number;
    min: number;
    discounted_price: number;
    discounted: boolean;
    estimate_price: number;
  };
}