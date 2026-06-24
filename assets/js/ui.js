/* ============================================================================
 *  共享 UI：页眉 / 页脚注入、货币格式化、购物车角标、商品缩略图占位
 *  所有页面引入本文件后，会自动填充 #site-header 与 #site-footer。
 * ========================================================================== */
(function () {
  var C = window.SITE_CONFIG;

  /* —— 货币格式化 —— */
  window.UI = window.UI || {};
  UI.money = function (n) {
    try {
      return new Intl.NumberFormat(C.currency.locale, { style: "currency", currency: C.currency.code }).format(n);
    } catch (e) {
      return C.currency.symbol + Number(n).toFixed(2);
    }
  };

  /* —— 商品缩略图占位（纯 SVG 渐变 + 分类图标，零外链；上线替换为真实图）—— */
  UI.thumb = function (p) {
    var icon = p.category === "beauty"
      ? '<path d="M50 18c-7 14-7 22 0 30 7-8 7-16 0-30z" fill="rgba(255,255,255,.9)"/><circle cx="50" cy="58" r="14" fill="rgba(255,255,255,.35)"/>'
      : '<rect x="30" y="34" width="40" height="34" rx="4" fill="rgba(255,255,255,.9)"/><path d="M30 44h40" stroke="rgba(0,0,0,.12)" stroke-width="2"/>';
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="' + p.accent + '"/>' +
        '<stop offset="1" stop-color="#1f2937"/></linearGradient></defs>' +
        '<rect width="100" height="100" fill="url(#g)"/>' + icon +
      '</svg>';
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  };

  /* —— 支付方式徽标（纯文字 Pill，零外链）—— */
  function payBadges() {
    var schemes = ["Visa", "Mastercard", "American Express", "UnionPay", "JCB", "Discover"];
    return schemes.map(function (s) {
      return '<span class="inline-flex items-center px-2.5 py-1 rounded border border-gray-200 bg-white text-[11px] font-semibold text-gray-600">' + s + '</span>';
    }).join("");
  }

  /* —— 页眉 —— */
  function headerHTML() {
    return '' +
    '<div class="border-b border-gray-100 bg-white/90 backdrop-blur sticky top-0 z-40">' +
      '<div class="mx-auto max-w-6xl px-4">' +
        '<div class="flex h-16 items-center justify-between">' +
          '<a href="index.html" class="flex items-center gap-2">' +
            '<span class="grid h-9 w-9 place-items-center rounded-lg bg-gray-900 text-white font-black tracking-tight">' + (C.brand.name.charAt(0) || 'H') + '</span>' +
            '<span class="text-lg font-extrabold tracking-tight text-gray-900">' + C.brand.name + '</span>' +
          '</a>' +
          '<nav class="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">' +
            '<a href="index.html" class="hover:text-gray-900">Home</a>' +
            '<a href="index.html#household" class="hover:text-gray-900">日用百货</a>' +
            '<a href="index.html#beauty" class="hover:text-gray-900">美妆 Beauty</a>' +
            '<a href="index.html#about" class="hover:text-gray-900">About</a>' +
            '<a href="contact.html" class="hover:text-gray-900">Contact</a>' +
          '</nav>' +
          '<div class="flex items-center gap-3">' +
            '<a href="checkout.html" class="relative inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-gray-800">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M6 6 5 3H2"/></svg>' +
              '<span class="hidden sm:inline">Cart</span>' +
              '<span data-cart-badge class="absolute -top-2 -right-2 hidden min-w-[20px] rounded-full bg-rose-500 px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-white">0</span>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* —— 页脚（含公司主体、合规链接、支付徽标、安全声明）—— */
  function footerHTML() {
    return '' +
    '<footer class="mt-20 border-t border-gray-100 bg-gray-50">' +
      '<div class="mx-auto max-w-6xl px-4 py-12">' +
        '<div class="grid gap-10 md:grid-cols-4">' +
          '<div class="md:col-span-2">' +
            '<div class="flex items-center gap-2 mb-3">' +
              '<span class="grid h-8 w-8 place-items-center rounded-lg bg-gray-900 text-white font-black">' + (C.brand.name.charAt(0) || 'H') + '</span>' +
              '<span class="text-base font-extrabold text-gray-900">' + C.brand.name + '</span>' +
            '</div>' +
            '<p class="text-sm text-gray-500 max-w-sm">' + C.brand.descZh + '<br>' + C.brand.descEn + '</p>' +
            '<div class="mt-4 text-xs text-gray-500 space-y-1">' +
              '<div><span class="font-semibold text-gray-700">' + C.company.legalName + '</span></div>' +
              '<div>' + C.company.address + '</div>' +
              '<div>Company Reg. No.: ' + C.company.regNo + '</div>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<h4 class="text-sm font-semibold text-gray-900 mb-3">Customer Service</h4>' +
            '<ul class="space-y-2 text-sm text-gray-500">' +
              '<li><a class="hover:text-gray-900" href="contact.html">Contact Us</a></li>' +
              '<li><a class="hover:text-gray-900" href="shipping.html">Shipping & Delivery</a></li>' +
              '<li><a class="hover:text-gray-900" href="refund.html">Refund & Returns</a></li>' +
              '<li><a class="hover:text-gray-900" href="mailto:' + C.support.email + '">' + C.support.email + '</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4 class="text-sm font-semibold text-gray-900 mb-3">Legal</h4>' +
            '<ul class="space-y-2 text-sm text-gray-500">' +
              '<li><a class="hover:text-gray-900" href="terms.html">Terms of Service</a></li>' +
              '<li><a class="hover:text-gray-900" href="privacy.html">Privacy Policy</a></li>' +
              '<li><a class="hover:text-gray-900" href="refund.html">Refund & Return Policy</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="mt-10 border-t border-gray-200 pt-6">' +
          '<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<span class="text-xs text-gray-400 mr-1">Secure payments by</span>' + payBadges() +
            '</div>' +
            '<div class="flex items-center gap-2 text-xs text-gray-500">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>' +
              '256-bit SSL encrypted checkout' +
            '</div>' +
          '</div>' +
          '<p class="mt-6 text-xs text-gray-400">© ' + new Date().getFullYear() + ' ' + C.company.legalName + '. All rights reserved.</p>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  /* —— 更新购物车角标 —— */
  function refreshBadge() {
    var n = window.Cart ? window.Cart.count() : 0;
    document.querySelectorAll("[data-cart-badge]").forEach(function (el) {
      el.textContent = n;
      el.classList.toggle("hidden", n === 0);
    });
  }

  /* —— 初始化 —— */
  function init() {
    var h = document.getElementById("site-header");
    var f = document.getElementById("site-footer");
    if (h) h.innerHTML = headerHTML();
    if (f) f.innerHTML = footerHTML();
    refreshBadge();
    document.addEventListener("cart:change", refreshBadge);
    // 填充所有 data-config 文本占位（如页面内联引用公司名/邮箱等）
    document.querySelectorAll("[data-config]").forEach(function (el) {
      var path = el.getAttribute("data-config").split(".");
      var v = C; path.forEach(function (k) { v = v ? v[k] : ""; });
      if (v != null) el.textContent = v;
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
