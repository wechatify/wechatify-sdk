# Wechatify-SDK

微信`iPad`协议的封装库。使用此 SDK 有助于用户快速构建微信服务。它包含以下的能力：

1. 微信 API 简单且快速调用
2. 微信事件监听
3. 视频号助手自动扫码登录
4. 视频号加热平台自动扫码登录
5. 视频号电商罗盘平台自动扫码登录

## 功能特点

- 完整的 TypeScript 类型支持
- 基于事件驱动的消息处理机制
- 支持微信登录、消息接收、账号管理等功能
- 支持视频号、直播、公众号等微信生态功能
- 支持代理配置
- 支持安全检测
- 支持多账号管理
- 支持自动重连机制
- 支持自定义错误处理
- 支持完整的日志记录

## 系统要求

- Node.js >= 14
- TypeScript >= 4.0
- 支持 ESM 模块系统
- 支持代理服务器（可选）

## 开发环境

- pnpm (推荐包管理器)
- TypeScript
- 支持 ESM 的编辑器（如 VSCode）

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

## 最佳实践

1. 错误处理
```typescript
try {
  await sdk.qrcode({...});
} catch (error) {
  console.error('获取二维码失败:', error);
}
```

2. 事件监听
```typescript
sdk.on('online', (timestamp, wxid, nickname) => {
  console.log(`账号 ${nickname}(${wxid}) 上线`);
});

sdk.on('offline', (timestamp, wxid) => {
  console.log(`账号 ${wxid} 下线`);
});
```

3. 代理配置
```typescript
const proxy = {
  address: '127.0.0.1',
  username: 'user',
  password: 'pass'
};
await sdk.updateProxy(wxid, proxy);
```

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
  deviceId: '随机字符串',
  deviceName: '随机字符串',
  // type类型'iPad' | 'windows' | 'mac' | 'QQBrowser' | 'android' | 'android-pad'
  // 可以选择 `android-pad` 表示安卓 pad 端登录
  type: 'iPad',
  proxy?: {
    address: 'IP地址',
    username: '账号',
    password: '密码'
  };
})
```

- `base64` 将用于用户的图片显示
- `uuid` 用于结果查询

## Proxy

代理支持静态代理和动态代理，推荐使用静态代理

如果你需要使用动态代理，需要自己启动一个服务来转换，并且返回固定的格式

比如

```js
const axios = require('axios');
const http = require('http');

http.createServer((req, res) => {
  axios.get('https://share.proxy.qg.net/get?key=xxx&pwd=xxx').then(result => {
    const list = result.data.data;
    // 至于怎么返回内容你们自己定
    // 但是返回结果为字符串
    res.end(list[0].server)
  })
}).listen(9012)
```

请求返回的字符串将替换`proxy.address`字符串，打到动态的效果。

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

当`status === 1`也就是`status === QRCODE_STATUS.SCANED`的时候，同时存在`meta.ticket`表示需要异常登录安全码。
你需要显示一个 input 框让用户提交这个验证码。验证码的验证方法如下：

```ts
const res = await sdk.submitAbnormalLoginSecurityCode(meta.ticket, pincode);
// ticket required
// pincode requried
```

当你提交这个验证码后，那么检查登录结果的状态也会随之改变。

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

## Wechat Sync

微信信息同步

### 同步单个微信信息

```ts
await sdk.Wechat.info(wxid);
```

### 同步微信列表

```ts
await sdk.Wechat.entries(page = 1, size = 10);
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
const req = sdk.instance.assistant.use('plmes3', 'v2_060000231003b20faec8c5e58d1ac2d0cc04ed35b0773e0dcaa981a2a9947a6ca3fe4c0b0d7d@finder');

// 可以监听里面的 session 变化
req.on('session', session => console.log('+', session));

// 当被解绑时候的事件
// 注意：在解绑前如果已经获取到 session
// 那么不论是否已经被解绑
// 这个 session 在有效期内都能获取到数据
// 直到 session 失效
req.on('disconnect', () => {
  // 失效处理
  req.clean(); // 停止所有请求，同时所有请求报 414 错误
  sdk.instance.assistant.delete(req.wxid, req.finder); // 请求对象缓存
})

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

// 停止所有请求
req.clean();

// 删除请求缓存
sdk.instance.assistant.delete(req.wxid, req.finder);
```

视频号助手所有接口都基于这个请求方式，所以，您可以自行通过该接口封装掉所需要的所有接口。

> 注意： 这里建议 session 持久化缓存
> 比如可以存储在 redis，初始化系统的时候使用`assistant.use(wxid, finder).setSession(value)`方法设置，以避免内部重复获取。

如果助手自动重置 session 判断有瑕疵，那么您可以通过以下的方法来增加自动判断的能力。目前仅对`[300334, 300330]`这两个错误码进行识别判断。

```ts
// 添加一个重置码
const remove = req.addCode(300339);
// 移除这个 code
remove();

// 或者通过函数判断
// callback: (v: number) => boolean
const remove = req.addCode(code => code > 300330 && code < 300340);
// 移除这个判断
remove();
```

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

#### WEB 请求

```ts
// use(wxid: string) => PromotionRequest
// 获得一个可以操作的请求对象体req
const req = this.sdk.instance.promotion.use('plmes3');

// 可以监听里面的 session 变化
req.on('session', session => console.log('+', session));

// 如果外部有持久化的对应的 session
// 那么可以直接设置 session
// 避免重复获取
req.setSession('BgAAD6a3vLyFm5qGsY/Wy9zqeebeL1bMdLAF5FddymXtGbT3Opr3YBGIMhEhM/g2OFvd+bV0ZuDOw0hqEAd/RmGqc1NarIvhMnFJNrVMp58=');

// 开始请求
const res = await req.post('/promote/api/web/transfer/MMFinderPromotionLiveDspApiSvr/searchLivePromotionOrderList?_rid=67a59cf4-985277x7&_vid=24c194e0-770c6ee', {
  exportIds: [],
  page: 1,
  pageSize: 20,
  sortField: 1,
  sortOrder: 0,
})
console.log(res);

// 停止所有请求
req.clean();

// 删除请求缓存
this.sdk.instance.promotion.delete('plmes3');
```

视频号加热所有接口都基于这个请求方式，所以，您可以自行通过该接口封装掉所需要的所有接口。

> 注意： 这里建议 session 持久化缓存
> 比如可以存储在 redis，初始化系统的时候使用`assistant.use(wxid).setSession(value)`方法设置，以避免内部重复获取。

如果加热自动重置 session 判断有瑕疵，那么您可以通过以下的方法来增加自动判断的能力。目前仅对`[-330]`这个错误码进行识别判断。

```ts
// 添加一个重置码
req.addCode(-400);

// 或者通过函数判断
// callback: (v: number) => boolean
req.addCode(code => code > -500 && code < -200);
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

## 常见问题

1. 登录失败
   - 检查网络连接
   - 验证代理配置
   - 确认账号状态

2. Session 失效
   - 检查 token 是否正确
   - 确认账号权限
   - 查看错误日志

3. 请求超时
   - 检查网络状况
   - 调整超时设置
   - 使用代理服务器

## 调试指南

1. 开启调试日志
```typescript
const sdk = new SDK({
  app_id: 'xxxxxx',
  app_secret: 'xxxxxxxxx',
  host: 'https://wechat.example.com',
  debug: true  // 开启调试模式
});
```

2. 错误追踪
```typescript
sdk.on('error', (error) => {
  console.error('SDK错误:', error);
});
```

3. 性能监控
```typescript
sdk.on('request', (request) => {
  console.log('请求信息:', request);
});
```

# 最后

如有问题，请`issue`联系我！

## 贡献指南

欢迎提交 Pull Request 或创建 Issue。在提交代码前，请确保：

1. 代码符合 TypeScript 规范
2. 添加了必要的测试
3. 更新了相关文档
4. 遵循现有的代码风格

## 更新日志

### v1.0.16
- 优化了错误处理机制
- 改进了代理配置功能
- 增强了类型定义

### v1.0.15
- 添加了新的 API 接口
- 修复了已知问题
- 提升了性能表现