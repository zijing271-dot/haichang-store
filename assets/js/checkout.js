/* ============================================================================
 *  OMEGA 结账跳转逻辑 (Checkout Redirect)
 * ----------------------------------------------------------------------------
 *  调用入口： Checkout.start(customer)  —— 在 checkout.html 的“立即支付”按钮触发。
 *
 *  两种模式（由 SITE_CONFIG.omega.mode 决定）：
 *   ┌── "mock" ───────────────────────────────────────────────────────────┐
 *   │  不调用真实接口；生成本地订单号并跳转到 payment-result.html?status=...  │
 *   │  用于本地预览 / 提交 Airwallex 审核时演示完整下单—跳转—回跳闭环。      │
 *   └─────────────────────────────────────────────────────────────────────┘
 *   ┌── "live" ───────────────────────────────────────────────────────────┐
 *   │  前端 POST 订单到【你的后端】(server.example.js)：                     │
 *   │      POST {apiBase}{createSessionPath}                                 │
 *   │  后端用 OMEGA / Airwallex 私钥创建结账会话，返回 { checkoutUrl }。     │
 *   │  前端 window.location.href = checkoutUrl  → 跳转到托管收银页。         │
 *   │  支付完成后 OMEGA/Airwallex 按 return_url 回跳到 payment-result.html。 │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 *  ⚠️ 安全：绝不在前端放任何 API Secret。金额请在后端按订单重新校验，
 *     不可信任前端传来的金额（防篡改）。
 * ========================================================================== */
(function () {
  var C = window.SITE_CONFIG;

  function genOrderId() {
    return "OM-" + Date.now().toString(36).toUpperCase() + "-" +
           Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  /* 组装标准订单对象（同时发给后端 / 用于 mock 回显） */
  function buildOrder(customer) {
    var items = window.Cart.items().map(function (it) {
      return { id: it.product.id, name: it.product.nameEn, qty: it.qty, unitPrice: it.product.price, lineTotal: it.lineTotal };
    });
    var subtotal = window.Cart.subtotal();
    var shipping = subtotal >= C.shipping.freeOver || subtotal === 0 ? 0 : C.shipping.flatRate;
    var total = +(subtotal + shipping).toFixed(2);
    return {
      orderId:  genOrderId(),
      currency: C.currency.code,
      items:    items,
      amounts:  { subtotal: subtotal, shipping: shipping, total: total },
      customer: customer || {},
      returnUrl:C.omega.returnUrl,
      createdAt:new Date().toISOString(),
    };
  }

  window.Checkout = {
    buildOrder: buildOrder,

    /* 主入口 */
    start: function (customer, opts) {
      opts = opts || {};
      var setBusy = opts.onBusy || function () {};
      var onError = opts.onError || function (m) { alert(m); };

      if (window.Cart.count() === 0) { onError("Your cart is empty."); return; }

      var order = buildOrder(customer);
      // 留存订单快照，供回跳页 payment-result.html 读取展示
      try { sessionStorage.setItem("omega_last_order", JSON.stringify(order)); } catch (e) {}

      /* ----- MOCK 模式：本地模拟跳转 ----- */
      if (C.omega.mode !== "live") {
        setBusy(true);
        setTimeout(function () {
          var q = "?status=success&order=" + encodeURIComponent(order.orderId) +
                  "&amount=" + encodeURIComponent(order.amounts.total) +
                  "&currency=" + encodeURIComponent(order.currency) + "&mock=1";
          window.location.href = "payment-result.html" + q;
        }, 900); // 模拟网络/收银页加载
        return;
      }

      /* ----- LIVE 模式：调后端创建结账会话并跳转 ----- */
      setBusy(true);
      var endpoint = C.omega.apiBase + C.omega.createSessionPath;
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // 后端应据此自行重算金额并创建 OMEGA/Airwallex 会话
          items: order.items,
          currency: order.currency,
          customer: order.customer,
          merchantOrderId: order.orderId,
          returnUrl: order.returnUrl,
        }),
      })
        .then(function (r) {
          if (!r.ok) throw new Error("Checkout service returned " + r.status);
          return r.json();
        })
        .then(function (data) {
          // 约定后端返回 { checkoutUrl: "https://checkout.airwallex.com/..." }
          if (!data || !data.checkoutUrl) throw new Error("No checkoutUrl in response.");
          window.location.href = data.checkoutUrl;
        })
        .catch(function (err) {
          setBusy(false);
          onError(
            "We couldn't reach the payment service.\n\n" +
            "（开发提示：请确认 SITE_CONFIG.omega.apiBase / createSessionPath 已填入 OMEGA 正式接口，" +
            "且后端 server.example.js 已部署并返回 { checkoutUrl }。）\n\n" + err.message
          );
        });
    },
  };
})();
