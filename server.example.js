/* ============================================================================
 *  跨境电商收款 · 结账会话后端 (Standalone Reference Backend)
 * ----------------------------------------------------------------------------
 *  本站为【独立的跨境电商网站】，使用本店自有的 Airwallex 商户账户，
 *  与 OMEGA Pulse（SaaS）完全分开。
 *
 *  集成方式：Airwallex **Payment Links**（托管收银链接）
 *    1) 鉴权     POST {baseUrl}/api/v1/authentication/login（x-client-id / x-api-key）
 *    2) 建链接   POST {baseUrl}/api/v1/pa/payment_links/create → 返回 body.url
 *  前端 window.location.href = url 即跳转到 Airwallex 托管收银页。
 *
 *  注意：Payment Links 仅在「商户账户激活该功能后」才会返回 url —— 这正是当前提交
 *  Airwallex 审核要解决的事；审核通过前 live 可能拿不到 url（返回 409，属预期）。
 *
 *  凭证（仅环境变量，绝不写进前端 / 日志 / Git）：
 *    AIRWALLEX_CLIENT_ID, AIRWALLEX_API_KEY, AIRWALLEX_BASE_URL(默认生产 api.airwallex.com)
 *  金额一律服务端按可信价格重算（防篡改）。
 *
 *  运行： npm i express && node server.example.js   （Node 18+，自带 fetch）
 * ========================================================================== */

const express = require("express");
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN || "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* ---- 本店自有 Airwallex 凭证（仅环境变量）---- */
function loadAirwallexCreds() {
  const clientId = process.env.AIRWALLEX_CLIENT_ID;
  const apiKey = process.env.AIRWALLEX_API_KEY;
  if (!clientId || !apiKey) return null;
  return { clientId, apiKey, baseUrl: process.env.AIRWALLEX_BASE_URL || "https://api.airwallex.com" };
}

/* ---- 可信价格表（服务端权威；生产应从数据库读取）---- */
const PRICES = {
  "hh-bottle-500": 18.99, "hh-storage-3": 24.99, "hh-cloth-10": 9.99,
  "hh-utensil": 21.99, "hh-umbrella": 14.99, "hh-organizer": 16.99,
  "bt-serum": 22.99, "bt-lipstick": 12.99, "bt-powder": 15.99,
  "bt-cleanser": 13.99, "bt-sunscreen": 17.99, "bt-mask": 11.99,
};
const FLAT_SHIPPING = 4.99, FREE_OVER = 49;

function computeAmount(items) {
  let subtotal = 0;
  for (const it of items || []) {
    const unit = PRICES[it.id];
    if (unit == null) throw new Error("Unknown product: " + it.id);
    subtotal += unit * Math.max(1, parseInt(it.qty, 10) || 1);
  }
  const shipping = subtotal >= FREE_OVER || subtotal === 0 ? 0 : FLAT_SHIPPING;
  const total = +(subtotal + shipping).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), shipping, total };
}

/* ---- Airwallex 鉴权 ---- */
async function airwallexAuth(creds) {
  const host = creds.baseUrl.replace(/\/$/, "");
  const r = await fetch(host + "/api/v1/authentication/login", {
    method: "POST",
    headers: { "x-client-id": creds.clientId, "x-api-key": creds.apiKey, "Content-Type": "application/json" },
  });
  if (!r.ok) throw new Error("Airwallex auth failed: " + r.status);
  return (await r.json()).token;
}

/* ---- 创建 Payment Link ---- */
async function createAirwallexPaymentLink({ creds, amount, currency, merchantOrderId }) {
  const token = await airwallexAuth(creds);
  const host = creds.baseUrl.replace(/\/$/, "");
  const r = await fetch(host + "/api/v1/pa/payment_links/create", {
    method: "POST",
    headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Order " + merchantOrderId,
      amount: amount.total,
      currency,
      reusable: false,
      metadata: { merchantOrderId },
    }),
  });
  if (!r.ok) throw new Error("Airwallex payment_links/create failed: " + r.status);
  return (await r.json()).url || null; // 仅商户账户激活后才返回 url
}

/* ============================================================================
 *  POST /v1/checkout/sessions  →  { checkoutUrl }
 * ========================================================================== */
app.post("/v1/checkout/sessions", async (req, res) => {
  try {
    const { items, currency = "USD", merchantOrderId } = req.body || {};
    const amount = computeAmount(items);
    if (amount.total <= 0) return res.status(400).json({ error: "Empty or invalid cart." });

    const creds = loadAirwallexCreds();
    if (!creds) return res.status(500).json({ error: "Airwallex credentials not configured (set AIRWALLEX_CLIENT_ID / AIRWALLEX_API_KEY)." });

    const checkoutUrl = await createAirwallexPaymentLink({ creds, amount, currency, merchantOrderId });
    if (!checkoutUrl) {
      // 账户尚未激活 Payment Links —— 审核通过前的预期状态
      return res.status(409).json({
        error: "payment_link_unavailable",
        message: "Airwallex returned no hosted URL. The merchant account is likely pending Payment Links activation.",
      });
    }
    return res.json({ checkoutUrl });
  } catch (err) {
    console.error("[checkout] error:", err.message); // 不打印密钥
    return res.status(500).json({ error: "Failed to create checkout session." });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log("Checkout backend on http://localhost:" + PORT));
