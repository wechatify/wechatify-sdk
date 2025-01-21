import { SDK } from "./index";
import { PromitionMembers } from './types';

export class Promotion {
  constructor(private readonly sdk: SDK) { }

  public members(wxid: string, token: string) {
    return this.sdk.req.getWithWxid<PromitionMembers>(wxid, `/-/api/promotion/${token}/members`);
  }

  public scan(wxid: string, token: string) {
    return this.sdk.req.postWithWxid<string>(wxid, `/-/api/promotion/${token}/scan`);
  }
}