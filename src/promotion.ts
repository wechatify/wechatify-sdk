import { SDK } from "./index";
import { PromitionMembers } from './types';
import { PromotionRequest } from "./requests/promotion";

export class Promotion {
  private readonly stacks = new Map<string, PromotionRequest>();
  constructor(private readonly sdk: SDK) { }

  public use(wxid: string) {
    if (!this.stacks.has(wxid)) {
      this.stacks.set(wxid, new PromotionRequest(wxid, this));
    }
    return this.stacks.get(wxid);
  }

  public delete(wxid: string) {
    if (this.stacks.has(wxid)) {
      const wx = this.stacks.get(wxid);
      wx.clean();
      wx.delete(wxid);
    }
    return this;
  }


  public members(wxid: string, token: string) {
    return this.sdk.req.getWithWxid<PromitionMembers>(wxid, `/-/api/promotion/${token}/members`);
  }

  public scan(wxid: string, token: string) {
    return this.sdk.req.postWithWxid<string>(wxid, `/-/api/promotion/${token}/scan`);
  }
}