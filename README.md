# Wechatify-SDK

微信`iPad`协议的封装库。使用此 SDK 有助于用户快速构建微信服务。它包含以下的能力：

1. 微信 API 简单且快速调用
2. 微信事件监听
3. 视频号助手自动扫码登录
4. 视频号加热平台自动扫码登录
5. 视频号电商罗盘平台自动扫码登录

## Install

```bash
$ npm i wechatify-sdk
```

## Usage

```ts
import { SDK } from 'wechatify-sdk';
const sdk = new SDK({
  app_id: 'xxxxxx',
  app_secret: 'xxxxxxxxx',
  host: 'https://wechat.example.com',
});
```

- `app_id`和`app_secret`都是从平台获取，通过`发送密钥`到邮箱的方式获得，您也可以通过联系管理员获得试用。
- `host`必须指定我们预定的服务地址

## Listen & Receive Messages

监听并且接受消息通知，需要用户在平台管理后台设置自己的`webhook`地址，同时用户必须在有效期内才会生效。

```ts
// ... 其他事件不详细演示
sdk.on('offline', (timestamp: number, wxid: string) => {
  console.log(`微信 ID<${wxid}> 于 ${dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')} 下线！`)
})

// POST:/xxxxxx 是你填写的 webhook 地址
// 以 koa2 为例
http.post('/xxxxxxx', ctx => {
  const body = ctx.request.body;
  // 将输入压入对象进行事件分发
  sdk.receive(body);
  ctx.status = 200;
  ctx.body = Date.now();
})
```

## Create QRCode

创建登录二维码

```ts
const { base64, uuid } = await sdk.qrcode({
  deviceId: '随机字符串';
  deviceName: '随机字符串';
  proxy?: {
    address: 'IP地址',
    username: '账号',
    password: '密码'
  };
})
```

- `base64` 将用于用户的图片显示
- `uuid` 用于结果查询

## Check Login Result

检查登录结果

```ts
const res = await sdk.checkLogin(uuid);
if (res) {
  const [status, meta] = res;
  // status 表示登录状态
  // meta 表示各阶段的数据
}
```

## Logout

退出登录

```ts
await sdk.logout(wxid);
```

## isSafe?

检查微信安全性

```ts
const { results } = await sdk.isSafe(wxid);
```

## Delete Wechat

您可登录的微信个数收平台控制，一旦登录，那么平台将自动绑定该微信到您的账户下，所以，如果希望删除此绑定的微信，那么就该使用此方法。

```ts
await sdk.delete(wxid);
```

## Update Proxy

更新代理。当用户登录使用了 A 代理，但是希望修改 A -> B 代理，那么请使用此方法。

```ts
await sdk.updateProxy(wxid, {
  address: 'IP地址',
  username: '账号',
  password: '密码'
})
```

## Delete Proxy

删除使用的代理。当用户希望此微信不再使用代理，那么请使用此方法。

```ts
await sdk.deleteProxy(wxid);
```

## Assistant

视频号助手接口。

### 登录视频号助手

此能力具备两个功能，如果同一个用户登录请使用同一`token`，此处至关重要，请紧记。

```ts
const token = '随机数';
```

#### 获取当前微信号下可用的账号列表

```ts
await sdk.assistant.members(wxid, token);
```

#### 模拟扫码登录

```ts
await sdk.assistant.scan(wxid, token, username);
```

#### WEB 请求

```ts
// use(wxid: string, finder: string) => AssistantRequest
// 获得一个可以操作的请求对象体req
const req = this.sdk.instance.assistant.use('plmes3', 'v2_060000231003b20faec8c5e58d1ac2d0cc04ed35b0773e0dcaa981a2a9947a6ca3fe4c0b0d7d@finder');

// 可以监听里面的 session 变化
req.on('session', session => console.log('+', session));

// 如果外部有持久化的对应的 session
// 那么可以直接设置 session
// 避免重复获取
req.setSession('BgAAD6a3vLyFm5qGsY/Wy9zqeebeL1bMdLAF5FddymXtGbT3Opr3YBGIMhEhM/g2OFvd+bV0ZuDOw0hqEAd/RmGqc1NarIvhMnFJNrVMp58=');

// 开始请求
const res = await req.post(`/cgi-bin/mmfinderassistant-bin/post/post_list?_rid=${Date.now()}`, {
  currentPage: 1,
  pageSize: 5,
  reqScene: 7,
  scene: 7,
  timestamp: Math.floor(Date.now() / 1000).toString(),
  userpageType: 11,
  _log_finder_id: req.finder,
})
console.log(res);
```

视频号助手所有接口都基于这个请求方式，所以，您可以自行通过该接口封装掉所需要的所有接口。

> 注意： 这里建议 session 持久化缓存
> 比如可以存储在 redis，初始化系统的时候使用`assistant.use(wxid, finder).setSession(value)`方法设置，以避免内部重复获取。

## Promotion

### 登录视屏号加热平台

此能力具备两个功能，如果同一个用户登录请使用同一`token`，此处至关重要，请紧记。目前加热平台只能绑定一个账号，所以可以直接使用`scan`方法登录，而`members`方法可以辅助用于确认是否开通加热账号。

```ts
const token = '随机数';
```

#### 获取当前微信号下可用的账号列表

```ts
await sdk.promition.members(wxid, token);
```

#### 模拟扫码登录

```ts
await sdk.promition.scan(wxid, token);
```

## ComPass

### 登录视频号电商罗盘

注意两个数据 `biz_id` 和 `biz_type`。

- `biz_id` 来自列表的用户唯一编码
- `biz_type` 编码的类型

#### 获取当前微信号下可用的账号列表

```ts
await sdk.compass.members(wxid);
```

#### 模拟扫码登录

```ts
export enum COMPASS_BIZ_TYPE {
  FINDER = 5, // 视频号
  TALENT = 9, // 商户号
  ECSTORE = 4, // 小店号
}
await sdk.compass.scan(wxid, biz_id, biz_type: COMPASS_BIZ_TYPE);
```

# 最后

如有问题，请`issue`联系我！