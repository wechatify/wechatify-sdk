import { SDK } from "./index";
import { AssistantResponseMember } from './types';

export class Assistant {
  constructor(private readonly sdk: SDK) { }

  public members(wxid: string, token: string) {
    return this.sdk.req.getWithWxid<AssistantResponseMember[]>(wxid, `/-/api/assistant/${token}/members`);
  }

  public scan(wxid: string, token: string, username: string) {
    return this.sdk.req.postWithWxid<string>(wxid, `/-/api/assistant/${token}/scan`, {
      username,
    })
  }
}