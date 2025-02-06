import { SDK } from "./index";
import { AssistantRequest } from "./requests/assistant";
import { AssistantResponseMember } from './types';

export class Assistant {
  private readonly stacks = new Map<string, Map<string, AssistantRequest>>();
  constructor(private readonly sdk: SDK) { }

  public use(wxid: string, finder: string) {
    if (!this.stacks.has(wxid)) {
      this.stacks.set(wxid, new Map());
    }
    const wx = this.stacks.get(wxid);
    if (!wx.has(finder)) {
      wx.set(finder, new AssistantRequest(wxid, finder, this));
    }
    return wx.get(finder);
  }

  public members(wxid: string, token: string) {
    return this.sdk.req.getWithWxid<AssistantResponseMember[]>(wxid, `/-/api/assistant/${token}/members`);
  }

  public scan(wxid: string, token: string, username: string) {
    return this.sdk.req.postWithWxid<string>(wxid, `/-/api/assistant/${token}/scan`, {
      username,
    })
  }
}