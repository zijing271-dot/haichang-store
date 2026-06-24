# OMEGA Mart — 跨境电商收款 / 结账跳转站点

一个**零构建**的多页静态电商站（HTML + TailwindCSS via CDN），销售「日用百货」与「美妆」两类商品，内置符合 **Airwallex 收单审核**的合规页面，以及基于 **OMEGA 系统**的结账跳转逻辑。

> 设计目标：让 Airwallex 风控审核人员一眼确认这是一个**真实、合规**的跨境电商收款网站。

---

## 1. 目录结构

```
omega-pay/
├─ index.html            首页（Hero + 日用百货 + 美妆 + 关于 + 信任区）
├─ checkout.html         购物车 / 结算页 → "Pay securely" 触发 OMEGA 跳转
├─ payment-result.html   支付回跳落地页（成功 / 失败）
├─ terms.html            Terms of Service（服务条款）
├─ refund.html           Refund & Return Policy（退款与退换货政策）
├─ privacy.html          Privacy Policy（隐私政策）
├─ shipping.html         Shipping & Delivery（配送政策）
├─ contact.html          Contact Us（联系我们 + 公司主体信息）
├─ assets/js/
│  ├─ config.js          ★ 全站唯一配置（公司/货币/价格/OMEGA 参数）
│  ├─ products.js        商品数据
│  ├─ cart.js            购物车（localStorage）
│  ├─ ui.js              共享页眉/页脚 + 购物车角标
│  └─ checkout.js        OMEGA 结账跳转（mock / live 双模式）
├─ server.example.js     后端示例（live 模式必需：创建支付会话）
└─ README.md
```

---

## 2. 本地预览（30 秒）

无需构建工具，任意静态服务器即可：

```bash
cd omega-pay
python -m http.server 5500      # 或： npx serve .
# 浏览器打开 http://localhost:5500
```

> 直接双击 `index.html` 也能看，但购物车 / 跳转在 `http://` 下更稳定（localStorage、相对路径）。

当前为 **演示模式**（`config.js` 里 `omega.mode = "mock"`）：下单 → 模拟跳转 → 回到结果页，全流程可走通，**不会真实扣款**，适合先给 Airwallex 审核看 UI 与流程。

---

## 3. 上线前必改（替换占位符）

只改 **一个文件**：[`assets/js/config.js`](assets/js/config.js)

| 字段 | 说明 |
|------|------|
| `company.legalName` | 公司法人全称，**必须与 Airwallex 注册主体一致** |
| `company.regNo` / `company.address` / `company.country` | 注册号、注册地址、国家 |
| `support.email` / `support.phone` / `support.hours` | 真实客服邮箱 / 电话 / 服务时间 |
| `currency` | 结算币种，与 Airwallex 一致 |
| `shipping` | 运费、包邮门槛、时效 |
| `brand.name` | 店铺显示名 |

商品与价格在 [`assets/js/products.js`](assets/js/products.js)；**商品图**目前是 SVG 占位渐变，上线请替换为真实产品图（建议 800×800 webp）。

---

## 4. 接入真实支付（mock → live）

> 本站为**独立跨境电商**，使用**本店自有的 Airwallex 商户账户**，与 OMEGA Pulse(SaaS) 分开。
> 集成方式：Airwallex **Payment Links**（auth → `/api/v1/pa/payment_links/create` → 返回 `url`）。

### 步骤
1. 部署后端 [`server.example.js`](server.example.js)（Node 18+，`npm i express`），设环境变量：
   ```bash
   AIRWALLEX_CLIENT_ID=...        # 本店 Airwallex 账户
   AIRWALLEX_API_KEY=...
   AIRWALLEX_BASE_URL=https://api.airwallex.com   # 生产；demo 用 https://api-demo.airwallex.com
   ```
2. 在 `config.js` 把 `omega.mode` 改为 `"live"`，`omega.apiBase` 指向后端公网地址。
3. 前端点击支付 → `POST {apiBase}/v1/checkout/sessions` → 后端创建 Payment Link 返回 `{ checkoutUrl }` → 浏览器跳转托管收银页 → 支付完成回跳 `payment-result.html`。

> ⚠️ **Payment Links 需商户账户激活该功能后才返回 url**。审核通过前 live 会返回 `409 payment_link_unavailable`（属预期）——所以审核阶段用 `mock` 演示完整流程即可。
>
> 🔒 **安全红线**：私钥只放后端环境变量；金额一律后端用可信价格表重算（已实现 `computeAmount`），绝不信任前端金额；生产务必加 Webhook 验签确认真实收款。

---

## 5. Airwallex 收单审核 · 合规清单

本项目已覆盖 Airwallex 网站审核常见要求：

- [x] 公司主体名称（页脚 + Contact 页，需与注册主体一致）
- [x] 清晰的商品与**定价**（含币种）
- [x] **Terms of Service**（`terms.html`）
- [x] **Refund & Return Policy**（`refund.html`）
- [x] **Privacy Policy**（`privacy.html`）
- [x] **Shipping & Delivery Policy**（`shipping.html`）
- [x] **Contact Us**：客服邮箱、电话、地址（`contact.html`）
- [x] 支付方式徽标 + “SSL 加密 / PCI-DSS” 安全声明（页脚 / 结算页）
- [x] 完整下单 → 收银跳转 → 回跳闭环
- [ ] 部署到 **HTTPS** 自有域名（Airwallex 要求，见第 6 节）
- [ ] 占位符全部替换为真实信息
- [ ] 法务文本经你方/律师确认（本仓库为通用模板，非法律意见）

---

## 6. 部署（HTTPS）

静态站点可一键部署到任意平台（自带 HTTPS）：

```bash
# Vercel
npx vercel --prod
# 或 Netlify
npx netlify deploy --prod --dir .
# 或 Cloudflare Pages / GitHub Pages（绑定自有域名 + HTTPS）
```

后端 `server.example.js` 可部署到 Render / Railway / Fly.io / 自有服务器，并在 `config.js` 的 `omega.apiBase` 指向它。

---

## 7. 上线前你需要补齐的信息

主体公司：**厦门海昌盛耀网络科技有限公司**（Airwallex 注册实体）。在 `config.js` 补齐：

1. **公司注册地址** + **统一社会信用代码**（须与 Airwallex 注册资料完全一致）
2. **店铺专属客服邮箱**（真实可收信，建议用店铺域名而非 omegapulse.io）
3. **客服电话**
4. **店铺品牌名**（`brand.name`，当前为 OMEGA Mart——与 OMEGA Pulse 分开，可改成与 SaaS 无关的零售品牌名）
5. **本店 Airwallex 账户**的 `AIRWALLEX_CLIENT_ID` / `AIRWALLEX_API_KEY`（仅填到后端环境变量）

> 审核阶段保持 `omega.mode = "mock"` 即可演示完整流程；账户激活 Payment Links 后再切 `"live"`。

---

*本仓库提供的法律/政策文本为通用模板，需结合你的实际业务与所在司法辖区由法务确认后使用。*
