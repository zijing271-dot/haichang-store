/* ============================================================================
 *  OMEGA Pay · 全站唯一配置中心 (Single Source of Truth)
 * ----------------------------------------------------------------------------
 *  ★ 你只需修改本文件，即可替换全站的：公司主体信息、客服联系方式、
 *    结算货币、运费政策，以及 OMEGA / Airwallex 结账对接参数。
 *  ★ 所有标注【占位符】的字段，请在上线 / 提交 Airwallex 审核前替换为真实信息。
 *  ★ 切勿在本文件（前端）写入任何 API 私钥 / Secret。私钥只放后端 server.example.js。
 * ========================================================================== */

window.SITE_CONFIG = {

  /* —— 品牌 / 网站展示 —— */
  brand: {
    name:    "Haichang Brand",              // 网站显示名
    logoText:"Haichang",                     // 页眉 Logo 文字（取首字母作 logo）
    tagline: "Everyday Essentials & Beauty, Shipped Worldwide",
    descEn:  "A cross-border online retailer of household daily goods and beauty products.",
    descZh:  "跨境在线零售 · 日用百货与美妆个护",
  },

  /* —— 公司主体（合规必填，必须与 Airwallex 注册主体一致）—— */
  company: {
    // 主体公司（Airwallex 注册实体）；注册地址 / 统一社会信用代码须与 Airwallex 资料【完全一致】
    legalName: "厦门海昌盛耀网络科技有限公司 (Xiamen Haichang Shengyao Network Technology Co., Ltd.)",
    regNo:     "91350211MAE1TNUB5D",         // 统一社会信用代码
    address:   "厦门市同安区智谷东五路15号916, Xiamen, Fujian, China",
    country:   "China (中国)",
  },

  /* —— 客服 / 联系方式（Contact Us 页与页脚使用）—— */
  support: {
    email:   "2822395393@qq.com",            // 店铺客服邮箱
    phone:   "+86 153 7677 4387",
    hours:   "Monday–Friday, 09:00–18:00 (GMT+8)",
    replyEta:"We aim to reply within 1 business day.",
  },

  /* —— 结算货币（需与 Airwallex 收单结算币种一致）—— */
  currency: { code: "USD", symbol: "$", locale: "en-US" },

  /* —— 运费 / 配送政策摘要（结账页 & Shipping 页使用）—— */
  shipping: {
    flatRate:   4.99,   // 标准运费
    freeOver:   49,     // 满额包邮门槛
    etaDays:    "7–15", // 预计送达工作日
    regions:    "Worldwide (selected countries)",
  },

  /* —— 收银对接参数（详见 assets/js/checkout.js 与 README）——
   *  本站为【独立跨境电商】，使用本店自有的 Airwallex 商户账户，与 OMEGA Pulse(SaaS) 分开。
   *  集成方式：Airwallex **Payment Links**（auth → /api/v1/pa/payment_links/create → 返回 url）。
   *  凭证只在后端 server.example.js 通过环境变量配置（AIRWALLEX_CLIENT_ID / API_KEY），前端不碰密钥。
   *  mode:
   *    "mock" = 演示跳转（不扣款）：提交 Airwallex 审核时预览完整 下单—跳转—回跳 闭环。
   *    "live" = 前端 POST → 后端 → Airwallex Payment Link → 跳转托管收银页。
   *      ⚠️ Payment Links 需商户账户「激活」后才返回 url；审核通过前 live 可能拿不到 url
   *         （后端返回 409 payment_link_unavailable，属预期）。本站正是为通过该审核而建。
   */
  omega: {
    mode:             "mock",
    apiBase:          "http://localhost:8787",   // ← 部署 server.example.js 后改为其公网地址
    createSessionPath:"/v1/checkout/sessions",
    // 支付完成后 Airwallex 回跳的落地页（成功/失败用参数区分）
    returnUrl:        (typeof window !== "undefined" ? window.location.origin : "") + "/payment-result.html",
  },

  /* —— 法务文本更新日期（各政策页展示）—— */
  legal: { lastUpdated: "2026-06-23" },
};
