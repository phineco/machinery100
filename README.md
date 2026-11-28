# China Equipment Direct

工程机械出海采购站。中英文页面覆盖首页、小微整机、属具、配件、合作工厂、交付与支持和联系询盘。

## 本地预览

需要 Node.js 20 或以上版本。项目无需安装第三方依赖，宝塔的 Yarn 一键安装可以直接读取仓库中的 `yarn.lock`。

```sh
npm run dev
```

浏览器打开 http://127.0.0.1:4173/ 。默认进入英文版，语言入口对应同一页面。更改内容后重新运行 `npm run build` 即可刷新预览。

预览默认只生成草稿和显示未配置提示。测试在线发送时，通过 `INQUIRY_API_URL` 指定模拟接口。

## 内容与询盘

- `src/content.mjs` 保存中英文页面文案。`src/catalog.json` 单独维护两种语言的品类，初始数据来自《01_产品类目清单》。品类编号用于搜索结果定位和双语询价预填，具体型号与供货条件由业务核实。
- [首页生产加工能力来源](docs/manufacturing-capability-sources.md)记录抖音作品标题分析、新材料工艺和首页图片出处。
- `src/media.mjs` 保存设备与场地实拍的双语描述和出处。首屏小挖使用标明为示意图的 AI 生成图。首页车间近景来自 `IMG_4768.HEIC`。巡览短片选自 `IMG_4760.MOV` 和 `IMG_4759.MOV`。
- [生产设备相册](https://www.yanxuxz.com/case/1/)与[厂房环境相册](https://www.yanxuxz.com/case/3/)的选用图片均保存在 `src/assets/`，页面浏览时从本站加载。合作工厂照片的公开使用范围由业务方在上线前确认。
- 询盘表单支持直接提交和下载草稿。网站通过同源 `POST /api/inquiries` 转发到 Scylla Light 使用的 Java 询盘接口。返回符合约定的确认后清空表单，发送失败或结果未确认时保留输入。草稿和可选的邮件、WhatsApp 联系渠道仍可使用。

## 构建

```sh
npm run build
```

输出为 `dist/`。生产环境可运行 `npm start`，由 Node.js 同时提供页面和询盘接口。首次启动时若缺少 `dist/index.html`，会先自动构建。更新代码或公开配置后，请执行 `npm run build` 再重启。

宝塔 Node 项目请选择 Node.js 20 或以上版本，项目目录使用含 `package.json` 的仓库根目录，启动脚本选择 `start`。进程默认监听 `127.0.0.1:4173`，宝塔反代端口需与 `PORT` 一致。若现有 Nginx 直接托管 `dist/`，把同源路径 `/api/inquiries` 转发到 Node.js 进程即可。

构建时可提供以下公开信息。

| 变量 | 用途 |
| --- | --- |
| `SITE_URL` | 正式 HTTPS 站点来源，默认 `https://www.machinery100.com`，用于双语 canonical、hreflang 和 sitemap。 |
| `CONTACT_EMAIL` | 公开联系邮箱，默认 `machinery100.china@gmail.com`。 |
| `WHATSAPP_NUMBER` | 公开号码，含国家区号且仅数字，默认 `8618948913729`。 |
| `FACEBOOK_URL` | 官方 Facebook 主页的 HTTPS 链接，配置并构建后出现在全站悬浮联系菜单。 |

`npm run dev` 构建禁止索引的本地预览。生产发布时执行 `npm run build`，然后可在已验证的 Google Search Console 站点资源提交 `/sitemap.xml`。

## 生产询盘配置

运行 `npm start` 时默认使用已有的 `https://q.scyllatech.cn/quant/machiapi/saveInquiry`。可通过服务端环境变量 `INQUIRY_API_URL` 覆盖完整地址，或通过 `API_BASE_URL` 覆盖 Java 根地址。也兼容旧部署的 `NEXT_PUBLIC_API_BASE_URL`。如果上游要求认证，将 `INQUIRY_API_TOKEN` 放在 Node.js 进程环境中。

构建和 Node.js 进程都使用正式的 `SITE_URL`。反向代理应传递原站 Host，保留同源路径。例如 Node.js 使用默认端口时可配置：

```nginx
location = /api/inquiries {
    proxy_set_header Host $host;
    proxy_pass http://127.0.0.1:4173;
}
```

Java 侧接收 `name`、`email`、`phoneNumber`、`message`、`productId`。合并留言包含 `[Machinery100]`、目的地、采购类型和语言，采购类型采用站内分类，`productId` 留空。姓名、邮箱和电话限制为 64 字符，包含来源及采购上下文的完整留言限制为 1024 字符。
