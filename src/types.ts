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
  online: [number, string, WechatPersonalInfoCustomResponse, WechatLoginWithQrcodeCustomRequest],
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

export interface WechatLoginWithQrcodeCustomRequest {
  deviceId: string;
  deviceName: string;
  proxy?: IProxy;
}

export interface WechatLoginWithQrcodeCustomResponse {
  base64: string;
  uuid: string;
}

export interface WechatReceiveMessage {
  payload: WebHookMessage<keyof WebHookEvents>[],
}

export declare enum QRCODE_STATUS {
  CREATED = "created",
  SCANED = "scaned",
  CANCELED = "canceled",
  SUCCESS = "success",
  OUTDATED = "outdated",
  UNKNOW = "unknow"
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